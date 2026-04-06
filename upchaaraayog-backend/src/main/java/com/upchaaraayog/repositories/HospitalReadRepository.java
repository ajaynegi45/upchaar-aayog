package com.upchaaraayog.repositories;

import com.upchaaraayog.dto.HospitalDTO;
import com.upchaaraayog.dto.HospitalFilterRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository

public class HospitalReadRepository {

    private final JdbcClient jdbcClient;
    public HospitalReadRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }


    // ── SQL constant: the delimiter used by STRING_AGG ──────────────────────
    // Sourced from HospitalRowMapper so both sides of the contract are defined once.
    private static final String DELIM = String.valueOf(HospitalRowMapper.DELIMITER);

    // ── RowMapper — singleton, stateless, safe to reuse ────────────────────
    private static final HospitalRowMapper ROW_MAPPER = new HospitalRowMapper();

    // ──────────────────────────────────────────────────────────────────────────
    // Data SQL
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Full SELECT for one page of cards.
     *
     * STRING_AGG uses DELIM (\u001F) instead of comma — safe for all possible names.
     * LEFT JOINs to specialities and schemes are needed here to produce the aggregated
     * strings; they are NOT needed in the count query.
     *
     * GROUP BY lists all non-aggregated hospital columns explicitly — required by SQL
     * standard and PostgreSQL when any aggregate function is present.
     *
     * ORDER BY h.name is served by the (state, name) or (state, district, name) index
     * without a sort step, because 'name' is a real key column in both indexes.
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
                STRING_AGG(DISTINCT sp.name, '""" + DELIM + """
            ' ORDER BY sp.name) AS speciality_names,
                STRING_AGG(DISTINCT sc.name, '""" + DELIM + """
            ' ORDER BY sc.name) AS scheme_names,
                COALESCE(BOOL_OR(he.is_convergence_enabled), false) AS has_convergence
            FROM hospitals h
            LEFT JOIN hospital_specialities hs ON hs.hospital_id = h.id
            LEFT JOIN specialities          sp ON sp.id = hs.speciality_id
            LEFT JOIN hospital_empanelments he ON he.hospital_id = h.id
            LEFT JOIN schemes               sc ON sc.id = he.scheme_id
            """ + buildWhereClause(f) + """
            GROUP BY h.id, h.hospital_code, h.name, h.state, h.district,
                     h.contact_number, h.hospital_type
            ORDER BY h.name ASC
            LIMIT """ + pageable.getPageSize() + " OFFSET " + pageable.getOffset();
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Count SQL [Fix for Issue 3]
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Lean COUNT query — no JOINs, no GROUP BY, no DISTINCT on a join product.
     *
     * The speciality and scheme filters are expressed as EXISTS subqueries, matching
     * what the WHERE clause builder produces for both the data and count queries.
     * PostgreSQL evaluates EXISTS with a semi-join and stops at the first match —
     * it never materializes the full join product that the old LEFT JOIN approach built.
     *
     * Result: for a state+district query with no optional filters, the count query
     * is: SELECT COUNT(*) FROM hospitals WHERE state = ? AND district = ?
     * That's a single index scan on idx_hospital_state_district_name. Very fast.
     */
    private String buildCountSql(HospitalFilterRequest f) {
        return "SELECT COUNT(*) FROM hospitals h" + buildWhereClause(f);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // WHERE clause builder (shared between data and count queries)
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Builds the WHERE fragment as a pure SQL string (no values — those are bound
     * via named parameters in buildSpec). The two queries share this exactly, which
     * guarantees the count always reflects the same filter as the data query.
     */
    private static String buildWhereClause(HospitalFilterRequest f) {
        var sql = new StringBuilder(" WHERE h.state = :state");

        if (f.district() != null && !f.district().isBlank()) {
            sql.append(" AND h.district = :district");
        }
        if (f.hospitalType() != null) {
            sql.append(" AND h.hospital_type = :hospitalType");
        }
        if (f.hasSpecialityFilter()) {
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

    // ──────────────────────────────────────────────────────────────────────────
    // Parameter binding
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * Builds a fully-bound JdbcClient.StatementSpec from a SQL string and filter.
     *
     * WHY spec IS REASSIGNED IN A LOOP:
     *   JdbcClient.StatementSpec is immutable-style — each call to .param(name, value)
     *   returns a NEW StatementSpec with the additional binding applied.
     *   If you discard the return value (as forEach with a method reference does),
     *   the binding is lost. You must capture each returned instance.
     *
     * WHY NOT spec::param AS A METHOD REFERENCE:
     *   spec.param(String, Object) returns StatementSpec, not void.
     *   It cannot be used as a BiConsumer<String, Object> or Consumer<ParamEntry>
     *   because the return type is non-void. The compiler rejects it.
     *   A simple indexed for-loop is the correct and readable solution.
     *
     * ANY() arrays for PostgreSQL:
     *   PostgreSQL's ANY(?) operator expects a java.sql.Array. The PostgreSQL JDBC
     *   driver (42.x) accepts a native Java array (int[], String[]) when passed via
     *   PreparedStatement.setObject() — which is what JdbcClient does internally.
     *   Using List<Integer> directly would fail; converting to int[] is required.
     */
    private JdbcClient.StatementSpec buildSpec(String sql, HospitalFilterRequest f) {
        // Collect parameter names and values in insertion order
        var names = new ArrayList<String>(6);
        var vals  = new ArrayList<Object>(6);

        names.add("state"); vals.add(f.state());

        if (f.district() != null && !f.district().isBlank()) {
            names.add("district"); vals.add(f.district());
        }
        if (f.hospitalType() != null) {
            names.add("hospitalType"); vals.add(f.hospitalType().name());
        }
        if (f.hasSpecialityFilter()) {
            // int[] required for PostgreSQL ANY(?) — NOT List<Integer>
            int[] ids = f.specialityIds().stream().mapToInt(Integer::intValue).toArray();
            names.add("specialityIds"); vals.add(ids);
        }
        if (f.hasSchemeFilter()) {
            // String[] required for PostgreSQL ANY(?)
            String[] codes = f.schemeCodes().toArray(new String[0]);
            names.add("schemeCodes"); vals.add(codes);
        }

        // FIX [Issue 1]: bind each parameter by reassigning spec
        // spec.param(name, value) returns a new StatementSpec — must capture it
        JdbcClient.StatementSpec spec = jdbcClient.sql(sql);
        for (int i = 0; i < names.size(); i++) {
            spec = spec.param(names.get(i), vals.get(i));
        }
        return spec;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Public API
    // ──────────────────────────────────────────────────────────────────────────

    public Page<HospitalDTO> findHospitals(HospitalFilterRequest filter, Pageable pageable) {

        // ── Data query: JdbcClient → HospitalRowMapper → List<HospitalCardDTO> ──
        List<HospitalDTO> cards = buildSpec(buildDataSql(filter, pageable), filter)
                .query(ROW_MAPPER)
                .list();

        // ── Count short-circuit: skip the DB round-trip when possible ─────────
        // If this is the first page and we got fewer rows than the page size,
        // the total is exactly what we have. No COUNT query needed.
        long total;
        if (!pageable.hasPrevious() && cards.size() < pageable.getPageSize()) {
            total = cards.size();
        } else {
            // FIX [Issue 3]: lean count SQL — no JOINs, just hospitals + EXISTS filters
            total = buildSpec(buildCountSql(filter), filter)// A "NullPointerException" could be thrown;
                    .query(Long.class)
                    .single(); // "single" is nullable here.
        }

        return new PageImpl<>(cards, pageable, total);
    }
}