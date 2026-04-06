package com.upchaaraayog.repositories;

import com.upchaaraayog.dto.HospitalDTO;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.lang.NonNull;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;

/**
 * Maps one JDBC ResultSet row → one HospitalCardDTO.
 *
 * WHY A DEDICATED ROWMAPPER (not JdbcClient's built-in record mapping):
 *   JdbcClient's auto record mapping works by passing constructor arguments
 *   positionally from the ResultSet. That works fine for scalar types (Long,
 *   String, boolean). But List<String> is not a JDBC type — the driver returns
 *   STRING_AGG output as a plain String and JdbcClient has no built-in way to
 *   split it into a List.
 *
 *   A RowMapper gives us full control: we read each column by name (safer than
 *   positional indexing — column order changes don't silently corrupt data),
 *   split the aggregated strings with the agreed delimiter, and construct the
 *   record explicitly.
 *
 * DELIMITER CONTRACT [Fix for Issue 4]:
 *   STRING_AGG in the SQL uses '\u001F' (ASCII Unit Separator, decimal 31).
 *   This character is a non-printable control character defined in ASCII/Unicode
 *   as a field separator. It cannot appear in hospital names, speciality names,
 *   or scheme names in any realistic dataset. Using it eliminates the edge case
 *   where a name containing a comma or pipe would silently corrupt the list.
 *
 * COLUMN NAME CONTRACT (must match aliases in HospitalReadRepository SQL):
 *   h.id                 → "id"
 *   h.hospital_code      → "hospital_code"
 *   h.name               → "name"
 *   h.state              → "state"
 *   h.district           → "district"
 *   h.contact_number     → "contact_number"
 *   h.hospital_type      → "hospital_type"
 *   STRING_AGG(sp.name)  → "speciality_names"
 *   STRING_AGG(sc.name)  → "scheme_names"
 *   BOOL_OR(...)         → "has_convergence"
 */
public class HospitalRowMapper implements RowMapper<HospitalDTO> {

    /**
     * ASCII Unit Separator — used as the STRING_AGG delimiter in SQL.
     * Single char for fast split. Defined once here and referenced from the SQL constant.
     */
    public static final char DELIMITER = '\u001F';

    @Override
    @NonNull // 'org.springframework.lang.NonNull' is deprecated since version 7.0
    public HospitalDTO mapRow(@NonNull ResultSet rs, int rowNum) throws SQLException {
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
     * Splits a STRING_AGG result into a List.
     *
     * Handles:
     *   null  → empty list  (hospital has no specialities / no schemes)
     *   blank → empty list  (shouldn't happen with STRING_AGG, but defensive)
     *   normal value → split on DELIMITER, trim each token
     *
     * Arrays.asList() returns a fixed-size list backed by the array — no copy,
     * minimal allocation. The list is never mutated after construction.
     */

    private List<String> splitAggregate(String aggregated) {
        if (aggregated == null || aggregated.isEmpty()) return List.of();
        return Arrays.stream(aggregated.split(String.valueOf(DELIMITER)))

                // Trim each token defensively (STRING_AGG shouldn't add whitespace, but guard it)
                .map(String::trim)
                .toList();
    }
}