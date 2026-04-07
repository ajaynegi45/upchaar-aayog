package com.upchaaraayog.repository;

import org.junit.jupiter.api.Test;

import java.sql.ResultSet;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class HospitalRowMapperTest {

    private final HospitalRowMapper rowMapper = new HospitalRowMapper();

    @Test
    void mapRowSplitsAggregatedFieldsAndTrimsWhitespace() throws Exception {
        var rs = mock(ResultSet.class);
        String delimiter = String.valueOf(HospitalRowMapper.DELIMITER);

        when(rs.getLong("id")).thenReturn(5L);
        when(rs.getString("hospital_code")).thenReturn("HOSP-5");
        when(rs.getString("name")).thenReturn("City Hospital");
        when(rs.getString("state")).thenReturn("Delhi");
        when(rs.getString("district")).thenReturn("New Delhi");
        when(rs.getString("contact_number")).thenReturn("8888888888");
        when(rs.getString("hospital_type")).thenReturn("PRIVATE");
        when(rs.getString("speciality_names")).thenReturn(" Cardiology " + delimiter + "Neurology");
        when(rs.getString("scheme_names")).thenReturn(" PMJAY " + delimiter + delimiter + " CGHS ");
        when(rs.getBoolean("has_convergence")).thenReturn(true);

        var dto = rowMapper.mapRow(rs, 0);

        assertThat(dto.id()).isEqualTo(5L);
        assertThat(dto.hospitalCode()).isEqualTo("HOSP-5");
        assertThat(dto.specialityNames()).containsExactly("Cardiology", "Neurology");
        assertThat(dto.schemeNames()).containsExactly("PMJAY", "CGHS");
        assertThat(dto.hasConvergence()).isTrue();
    }

    @Test
    void mapRowReturnsEmptyListsForMissingAggregates() throws Exception {
        var rs = mock(ResultSet.class);

        when(rs.getLong("id")).thenReturn(9L);
        when(rs.getString("hospital_code")).thenReturn("HOSP-9");
        when(rs.getString("name")).thenReturn("District Hospital");
        when(rs.getString("state")).thenReturn("Punjab");
        when(rs.getString("district")).thenReturn("Ludhiana");
        when(rs.getString("contact_number")).thenReturn(null);
        when(rs.getString("hospital_type")).thenReturn("GOVT");
        when(rs.getString("speciality_names")).thenReturn(null);
        when(rs.getString("scheme_names")).thenReturn("");
        when(rs.getBoolean("has_convergence")).thenReturn(false);

        var dto = rowMapper.mapRow(rs, 0);

        assertThat(dto.specialityNames()).isEmpty();
        assertThat(dto.schemeNames()).isEmpty();
        assertThat(dto.contactNumber()).isNull();
        assertThat(dto.hasConvergence()).isFalse();
    }
}
