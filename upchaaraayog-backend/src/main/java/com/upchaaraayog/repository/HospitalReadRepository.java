package com.upchaaraayog.repository;

import com.upchaaraayog.dto.DropdownResponse;
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
 * High-performance read repository using JdbcClient.
 */
@Repository
public class HospitalReadRepository {

    private final JdbcClient jdbcClient;
    private static final HospitalRowMapper ROW_MAPPER = new HospitalRowMapper();

    public HospitalReadRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public Page<HospitalDTO> findHospitals(HospitalFilterRequest filter, Pageable pageable) {
        List<HospitalDTO> cards = buildSpec(buildDataSql(filter, pageable), filter)
                .query(ROW_MAPPER)
                .list();

        long total;
        if (!pageable.hasPrevious() && cards.size() < pageable.getPageSize()) {
            total = cards.size();
        } else {
            total = buildSpec(buildCountSql(filter), filter)
                    .query(Long.class)
                    .single();
        }
        return new PageImpl<>(cards, pageable, total);
    }

    private String buildDataSql(HospitalFilterRequest f, Pageable pageable) {
        return """
                SELECT
                    h.id, h.hospital_code, h.name, h.state, h.district,
                    h.contact_number, h.hospital_type,
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
                GROUP BY h.id, h.hospital_code, h.name, h.state, h.district, h.contact_number, h.hospital_type
                ORDER BY h.name ASC
                LIMIT """ + pageable.getPageSize() + " OFFSET " + pageable.getOffset();
    }

    private String buildCountSql(HospitalFilterRequest f) {
        return "SELECT COUNT(*) FROM hospitals h" + buildWhereClause(f);
    }

    private static String buildWhereClause(HospitalFilterRequest f) {
        StringBuilder sql = new StringBuilder(" WHERE h.state = :state");
        if (f.district() != null && !f.district().isBlank()) sql.append(" AND h.district = :district");
        if (f.hospitalType() != null) sql.append(" AND h.hospital_type = :hospitalType");
        if (f.hasSpecialityFilter()) {
            sql.append(" AND EXISTS (SELECT 1 FROM hospital_specialities hsx WHERE hsx.hospital_id = h.id AND hsx.speciality_id = ANY(:specialityIds))");
        }
        if (f.hasSchemeFilter()) {
            sql.append(" AND EXISTS (SELECT 1 FROM hospital_empanelments hex JOIN schemes sc2 ON sc2.id = hex.scheme_id WHERE hex.hospital_id = h.id AND sc2.code = ANY(:schemeCodes))");
        }
        return sql.toString();
    }

    private JdbcClient.StatementSpec buildSpec(String sql, HospitalFilterRequest f) {
        List<String> names = new ArrayList<>();
        List<Object> vals  = new ArrayList<>();
        names.add("state"); vals.add(f.state());
        if (f.district() != null && !f.district().isBlank()) { names.add("district"); vals.add(f.district()); }
        if (f.hospitalType() != null) { names.add("hospitalType"); vals.add(f.hospitalType().name()); }
        if (f.hasSpecialityFilter()) { names.add("specialityIds"); vals.add(f.specialityIds().stream().mapToInt(Integer::intValue).toArray()); }
        if (f.hasSchemeFilter()) { names.add("schemeCodes"); vals.add(f.schemeCodes().toArray(new String[0])); }
        JdbcClient.StatementSpec spec = jdbcClient.sql(sql);
        for (int i = 0; i < names.size(); i++) spec = spec.param(names.get(i), vals.get(i));
        return spec;
    }

    public List<String> findAllStates() {
        return jdbcClient.sql("SELECT DISTINCT state FROM hospitals ORDER BY state ASC").query(String.class).list();
    }

    public List<String> findDistrictsByState(String state) {
        return jdbcClient.sql("SELECT DISTINCT district FROM hospitals WHERE state = :state ORDER BY district ASC").param("state", state).query(String.class).list();
    }

    public List<DropdownResponse> findAllSchemes() {
        return jdbcClient.sql("SELECT code, name FROM schemes ORDER BY name ASC").query((rs, rn) -> new DropdownResponse(rs.getString("code"), rs.getString("name"))).list();
    }

    public List<DropdownResponse> findAllSpecialities() {
        return jdbcClient.sql("SELECT code, name FROM specialities ORDER BY name ASC").query((rs, rn) -> new DropdownResponse(rs.getString("code"), rs.getString("name"))).list();
    }

    public List<String> findDistinctHospitalTypes() {
        return jdbcClient.sql("SELECT DISTINCT hospital_type FROM hospitals WHERE hospital_type IS NOT NULL ORDER BY hospital_type ASC").query(String.class).list();
    }
}