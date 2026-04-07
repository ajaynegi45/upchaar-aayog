package com.upchaaraayog.repositories;

import com.upchaaraayog.dto.HospitalDTO;
import org.jspecify.annotations.NonNull;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;

/**
 * Maps one JDBC ResultSet row to one HospitalDTO record.
 *
 * WHY A DEDICATED ROWMAPPER (not JdbcClient's automatic record mapping):
 *   JdbcClient can auto-map a ResultSet to a record by matching column names
 *   to constructor parameters (case-insensitive). This works for scalar types
 *   (Long, String, boolean). However, HospitalDTO has two List<String> fields
 *   (specialities, schemes). JDBC has no List type — the driver returns
 *   STRING_AGG output as a plain VARCHAR string.
 *   JdbcClient has no built-in converter from VARCHAR → List<String>, so we
 *   need a RowMapper to split the aggregated string ourselves.
 *
 * WHY COLUMN-NAME ACCESS (not positional rs.getString(1)):
 *   Positional indexing breaks silently if the SQL SELECT column order changes.
 *   Column-name access (rs.getString("hospital_code")) is robust to reordering.
 *
 * DELIMITER CONTRACT [originally Fixed Issue 4]:
 *   SQL uses chr(31) — PostgreSQL's Unit Separator character (ASCII decimal 31).
 *   This non-printable control character cannot appear in any real hospital name,
 *   speciality name, or scheme name. It eliminates the edge case where a name
 *   containing a comma or pipe would silently corrupt the split.
 *   See HospitalReadRepository.buildDataSql() for where chr(31) is used in SQL.
 *   DELIMITER here must match: chr(31) = '\u001F'.
 *
 * @NonNull [FIX Bug 8]:
 *   org.springframework.lang.NonNull is deprecated since Spring Framework 7.0.
 *   Replaced by org.jspecify.annotations.NonNull per JSpecify standard adopted
 *   by Spring Boot 4 / Spring Framework 7.
 *   Ref: https://docs.spring.io/spring-framework/reference/core/null-safety.html
 *
 * COLUMN NAME CONTRACT (must match aliases in HospitalReadRepository.buildDataSql):
 *   id                → h.id
 *   hospital_code     → h.hospital_code
 *   name              → h.name
 *   state             → h.state
 *   district          → h.district
 *   contact_number    → h.contact_number
 *   hospital_type     → h.hospital_type
 *   speciality_names  → STRING_AGG(DISTINCT sp.name, chr(31) ORDER BY sp.name)
 *   scheme_names      → STRING_AGG(DISTINCT sc.name, chr(31) ORDER BY sc.name)
 *   has_convergence   → COALESCE(BOOL_OR(he.is_convergence_enabled), false)
 */
public class HospitalRowMapper implements RowMapper<HospitalDTO> {

    /**
     * The delimiter character used by STRING_AGG in SQL: chr(31) = ASCII Unit Separator.
     * Defined here as the single source of truth. The SQL uses chr(31); Java splits on this char.
     * These must always match — if you change one, change the other.
     */
    public static final char DELIMITER = '\u001F';

    /**
     * Maps one row from the ResultSet to one HospitalDTO.
     *
     * @param rs     the current ResultSet row (never null — Spring guarantees this)
     * @param rowNum zero-based row number (not used here; required by RowMapper contract)
     * @return a fully constructed, immutable HospitalDTO
     * @throws SQLException if any column read fails (propagated up to JdbcClient)
     */
    @Override
    public @NonNull HospitalDTO mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
        return new HospitalDTO(
                rs.getLong("id"),
                rs.getString("hospital_code"),
                rs.getString("name"),
                rs.getString("state"),
                rs.getString("district"),
                rs.getString("contact_number"),
                rs.getString("hospital_type"),
                splitAggregate(rs.getString("speciality_names")),
                splitAggregate(rs.getString("scheme_names")),
                rs.getBoolean("has_convergence")
        );
    }

    /**
     * Splits a STRING_AGG result into an unmodifiable List<String>.
     *
     * Null-safety:
     *   STRING_AGG returns SQL NULL (not empty string) when there are no rows to aggregate.
     *   Example: a hospital with zero specialities → speciality_names IS NULL.
     *   rs.getString() returns Java null for SQL NULL → we return List.of() (empty list).
     *
     * Blank-safety:
     *   STRING_AGG should never produce a blank string for a non-null aggregate,
     *   but we guard for it defensively (e.g., if a name was stored as whitespace).
     *
     * Trim:
     *   STRING_AGG doesn't add leading/trailing whitespace, but we trim each token
     *   defensively in case data was stored with padding.
     *
     * @param aggregated the raw STRING_AGG output, or null if no rows
     * @return an unmodifiable list of trimmed, non-empty name strings
     */
    private static List<String> splitAggregate(String aggregated) {
        if (aggregated == null || aggregated.isEmpty()) {
            return List.of(); // immutable empty list
        }
        // Arrays.stream().map().toList() returns an unmodifiable list (Java 16+)
        return Arrays.stream(aggregated.split(String.valueOf(DELIMITER)))
                .map(String::trim)
                .filter(s -> !s.isEmpty()) // guard: discard any empty tokens
                .toList();
    }
}