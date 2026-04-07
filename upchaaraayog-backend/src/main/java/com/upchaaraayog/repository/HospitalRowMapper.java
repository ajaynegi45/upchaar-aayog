package com.upchaaraayog.repository;

import com.upchaaraayog.dto.HospitalDTO;
import org.jspecify.annotations.NonNull;
import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;

/**
 * Maps JDBC ResultSet to HospitalDTO record.
 */
public class HospitalRowMapper implements RowMapper<HospitalDTO> {

    public static final char DELIMITER = '\u001F';

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

    private static List<String> splitAggregate(String aggregated) {
        if (aggregated == null || aggregated.isEmpty()) return List.of();
        return Arrays.stream(aggregated.split(String.valueOf(DELIMITER)))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }
}