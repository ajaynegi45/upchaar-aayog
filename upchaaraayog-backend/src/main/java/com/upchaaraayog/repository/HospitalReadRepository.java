package com.upchaaraayog.repository;

import com.upchaaraayog.dto.HospitalDTO;
import com.upchaaraayog.dto.HospitalFilterRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

/**
 * Read-only repository for the hospital listing endpoint.
 *
 * WHY JdbcClient INSTEAD OF JPA (Hibernate):
 *   The listing API is read-heavy (1k–2k concurrent users). Using JPA for this
 *   query path has three costs that compound at scale:
 *     1. Entity construction: Hibernate builds full Hospital + proxy objects for each row.
 *     2. Dirty checking: Hibernate tracks every entity for changes (even in read-only tx).
 *     3. Two-pass strategy: to avoid in-memory pagination (the HHH90003004 trap),
 *        you need 2–3 queries with JOIN FETCH. Each still goes through the entity graph.
 *
 *   JdbcClient goes directly: SQL ResultSet → RowMapper → record constructor.
 *   Zero entity materialization. Zero proxy creation. Zero dirty check overhead.
 *   For a listing of 20 hospitals per page, this is the minimal possible JVM cost.
 *
 * QUERY STRATEGY — 2 queries per API call:
 *   Q1 (Data): SELECT ... STRING_AGG ... GROUP BY ... ORDER BY ... LIMIT N OFFSET M
 *   Q2 (Count): SELECT COUNT(*) FROM hospitals WHERE filters (EXISTS subqueries, no JOINs)
 *   Count Q2 is short-circuited on the first page when fewer results than page size.
 *
 * STRING_AGG WITH chr(31) [Fix Bug 6 — was embedded \u001F in Java string]:
 *   Previously, the DELIMITER character (\u001F, chr(31)) was concatenated as a
 *   raw Java char into the SQL string: STRING_AGG(..., '??' ORDER BY name)
 *   where ?? was the actual 0x1F byte embedded in the string. This is fragile:
 *     - SQL log scrapers may corrupt or drop control characters
 *     - Some JDBC driver versions strip non-printable characters from string literals
 *     - The source file becomes harder to read and diff in version control
 *
 *   FIX: The SQL now uses chr(31), a proper PostgreSQL function call that produces
 *   the same character server-side. The Java source is clean; the delimiter is
 *   expressed as a readable SQL expression, not an invisible byte in a Java string.
 *
 * COUNT single() SAFETY [corrects misleading comment from previous version]:
 *   The previous code had: .single(); // "single" is nullable here.
 *   This was accurate for Spring Framework < 6.2. As of Spring Framework 6.2
 *   (and therefore Spring Boot 4), single() enforces non-null and throws
 *   IncorrectResultSizeDataAccessException if the result set has 0 or 2+ rows.
 *   COUNT(*) always returns exactly 1 row with a non-null value, so single()
 *   is the correct and safe call for count queries. The comment is removed.
 *
 * PARAMETER BINDING [fix from previous iteration — preserved and documented]:
 *   JdbcClient.StatementSpec is immutable-style. Each .param(name, value) call
 *   returns a NEW StatementSpec with the binding appended. The return value MUST
 *   be captured (reassigned). Using forEach with a method reference discards the
 *   return value and loses all bindings silently. The for-loop in buildSpec()
 *   captures each returned spec.
 */
@Repository
public class HospitalReadRepository {

    private final JdbcClient jdbcClient;

    public HospitalReadRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    // Singleton RowMapper: stateless, thread-safe, safe to share across all calls.
    private static final HospitalRowMapper ROW_MAPPER = new HospitalRowMapper();

    // ─────────────────────────────────────────────────────────────────────────
    // SQL builders
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Builds the data query for one page of hospital cards.
     *
     * chr(31) IS THE KEY CHANGE from previous versions:
     *   - chr(31) is a PostgreSQL expression, evaluated server-side.
     *   - No control character is embedded in the Java source or query string.
     *   - Matching split: HospitalRowMapper.DELIMITER = '\u001F' = chr(31). ✔
     *
     * GROUP BY includes all non-aggregated columns (SQL standard requirement
     * when any aggregate function is in the SELECT list).
     *
     * ORDER BY h.name uses the covering index (state, name INCLUDE ...) or
     * (state, district, name INCLUDE ...) without a separate sort step, because
     * 'name' is a real key column (not INCLUDE) in both indexes.
     *
     * LIMIT and OFFSET are concatenated as integers — safe because:
     *   - pageable.getPageSize() is a Java int bounded by @Max(50) on the controller
     *   - pageable.getOffset() is a long derived from page × size (bounded ints)
     *   Neither is a user-supplied string; there is no SQL injection risk.
     */
    private String buildDataSql(HospitalFilterRequest f, Pageable pageable) {
        return """
                SELECT
                    h.id,
                    h.hospital_code,
                    h.name,
                    h.state,
                    h.district,
                    h.contact_number,
                    h.hospital_type,
                    STRING_AGG(DISTINCT sp.name, chr(31) ORDER BY sp.name) AS speciality_names,
                    STRING_AGG(DISTINCT sc.name, chr(31) ORDER BY sc.name) AS scheme_names,
                    COALESCE(BOOL_OR(he.is_convergence_enabled), false)    AS has_convergence
                FROM hospitals h
                LEFT JOIN hospital_specialities hs ON hs.hospital_id = h.id
                LEFT JOIN specialities          sp ON sp.id = hs.speciality_id
                LEFT JOIN hospital_empanelments he ON he.hospital_id = h.id
                LEFT JOIN schemes               sc ON sc.id = he.scheme_id
                """
                + buildWhereClause(f)
                + """
                GROUP BY h.id, h.hospital_code, h.name, h.state, h.district,
                         h.contact_number, h.hospital_type
                ORDER BY h.name ASC
                LIMIT """
                + pageable.getPageSize()
                + " OFFSET "
                + pageable.getOffset();
    }

    /**
     * Builds a lean COUNT query with no JOINs and no GROUP BY.
     *
     * The data query uses LEFT JOINs to produce speciality/scheme names for display.
     * The count query does NOT need those columns — it only needs to know how many
     * hospitals match the filters. Using EXISTS subqueries for speciality/scheme
     * filters avoids materialising any JOIN product. PostgreSQL uses a semi-join
     * and stops at the first match — O(1) per hospital instead of O(n×m).
     *
     * For a state+district filter with no optional filters, this becomes:
     *   SELECT COUNT(*) FROM hospitals h WHERE h.state = :state AND h.district = :district
     * That is a single index scan on idx_hospital_state_district_name. Very fast.
     */
    private String buildCountSql(HospitalFilterRequest f) {
        return "SELECT COUNT(*) FROM hospitals h" + buildWhereClause(f);
    }

    /**
     * Builds the shared WHERE clause for both the data and count queries.
     *
     * The clause is built from the HospitalFilterRequest state alone — no values
     * are embedded. Parameter values are bound separately in buildSpec().
     * This guarantees that the count query always reflects exactly the same
     * filter logic as the data query, with no risk of divergence.
     *
     * NAMED PARAMETER CONVENTION:
     *   :state, :district, :hospitalType → scalar equality filters
     *   :specialityIds → int[] (PostgreSQL integer array for ANY())
     *   :schemeCodes   → String[] (PostgreSQL text array for ANY())
     */
    private static String buildWhereClause(HospitalFilterRequest f) {
        StringBuilder sql = new StringBuilder(" WHERE h.state = :state");

        if (f.district() != null && !f.district().isBlank()) {
            sql.append(" AND h.district = :district");
        }
        if (f.hospitalType() != null) {
            sql.append(" AND h.hospital_type = :hospitalType");
        }
        if (f.hasSpecialityFilter()) {
            // EXISTS is faster than JOIN for filtering: PostgreSQL semi-join stops
            // at the first matching speciality_id, never materialising all matches.
            sql.append("""
                     AND EXISTS (
                         SELECT 1 FROM hospital_specialities hsx
                         WHERE hsx.hospital_id = h.id
                           AND hsx.speciality_id = ANY(:specialityIds)
                     )""");
        }
        if (f.hasSchemeFilter()) {
            sql.append("""
                     AND EXISTS (
                         SELECT 1 FROM hospital_empanelments hex
                         JOIN schemes sc2 ON sc2.id = hex.scheme_id
                         WHERE hex.hospital_id = h.id
                           AND sc2.code = ANY(:schemeCodes)
                     )""");
        }
        return sql.toString();
    }

    /**
     * Builds a fully-bound JdbcClient.StatementSpec from a SQL string and filter.
     *
     * WHY THE FOR-LOOP (not forEach or method reference):
     *   JdbcClient.StatementSpec is immutable-style. Each .param(name, value) call
     *   returns a NEW StatementSpec with that binding added. The original spec is
     *   unchanged. If you use .forEach(spec::param) the return values are discarded
     *   and NO bindings are applied — the query runs with zero parameters bound,
     *   which either throws or returns wrong results.
     *   The for-loop captures each returned spec via reassignment. This is the only
     *   correct approach with JdbcClient's API design.
     *
     * ARRAY TYPES FOR PostgreSQL ANY():
     *   PostgreSQL's ANY(?) operator requires the JDBC parameter to be a SQL ARRAY.
     *   The PostgreSQL JDBC driver (42.x) accepts a Java primitive array (int[],
     *   String[]) via PreparedStatement.setObject() and converts it internally.
     *   List<Integer> does NOT work — it must be converted to int[] first.
     *
     * PARAMETER ORDER:
     *   Names and values are collected in parallel ArrayLists, iterated by index.
     *   This works because both lists are built with identical conditionals.
     *   If you add a new filter condition, add to BOTH lists in the same if-block.
     */
    private JdbcClient.StatementSpec buildSpec(String sql, HospitalFilterRequest f) {
        List<String> names = new ArrayList<>(6);
        List<Object> vals  = new ArrayList<>(6);

        names.add("state");
        vals.add(f.state());

        if (f.district() != null && !f.district().isBlank()) {
            names.add("district");
            vals.add(f.district());
        }
        if (f.hospitalType() != null) {
            names.add("hospitalType");
            vals.add(f.hospitalType().name()); // enum → "PUBLIC" / "GOVT" / "PRIVATE" / "NON_PROFIT_PRIVATE"
        }
        if (f.hasSpecialityFilter()) {
            names.add("specialityIds");
            // Must be int[] — PostgreSQL JDBC driver converts this to a SQL INTEGER ARRAY.
            // List<Integer> would cause "Cannot cast ... to int[]" at runtime.
            vals.add(f.specialityIds().stream().mapToInt(Integer::intValue).toArray());
        }
        if (f.hasSchemeFilter()) {
            names.add("schemeCodes");
            // Must be String[] — PostgreSQL JDBC driver converts to a SQL TEXT ARRAY.
            vals.add(f.schemeCodes().toArray(new String[0]));
        }

        // Build the spec by reassigning on each .param() call.
        JdbcClient.StatementSpec spec = jdbcClient.sql(sql);
        for (int i = 0; i < names.size(); i++) {
            spec = spec.param(names.get(i), vals.get(i));
        }
        return spec;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Public API
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Returns one page of hospital cards matching the given filters.
     *
     * COUNT short-circuit:
     *   On the first page (no previous page), if the number of returned cards
     *   is less than the page size, we know this is the ONLY page. The total
     *   is exactly cards.size() — no COUNT query needed. This saves one DB
     *   round-trip for every state+district combination that has fewer hospitals
     *   than the default page size (10).
     *
     * COUNT safety:
     *   single() is safe here. COUNT(*) always returns exactly one row with a
     *   non-null BIGINT value. Spring Framework 6.2+ enforces that single()
     *   never returns null (it throws IncorrectResultSizeDataAccessException on
     *   0 or 2+ rows). There is no NPE risk on this query.
     *
     * @param filter   the validated filter criteria (state is mandatory)
     * @param pageable the page number and page size from the controller
     * @return a Page containing the hospital cards and pagination metadata
     */
    public Page<HospitalDTO> findHospitals(HospitalFilterRequest filter, Pageable pageable) {

        // Q1: Fetch one page of data
        List<HospitalDTO> cards = buildSpec(buildDataSql(filter, pageable), filter)
                .query(ROW_MAPPER)
                .list();

        // Count short-circuit: first page with partial results → total is known.
        long total;
        if (!pageable.hasPrevious() && cards.size() < pageable.getPageSize()) {
            total = cards.size();
        } else {
            // Q2: Count-only query — no JOINs, lean EXISTS-based filtering.
            // single() is safe: COUNT(*) always returns exactly 1 non-null row.
            total = buildSpec(buildCountSql(filter), filter)
                    .query(Long.class)
                    .single();
        }

        return new PageImpl<>(cards, pageable, total);
    }
}