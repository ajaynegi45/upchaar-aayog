package com.upchaaraayog.repository;

import com.upchaaraayog.entities.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JPA repository — WRITE operations only (save, update, delete).
 *
 * The read path for the listing API is handled entirely by HospitalReadRepository
 * (JdbcClient), which bypasses Hibernate's entity graph for zero-overhead reads.
 *
 * This separation — JPA for writes, JdbcClient for reads — is the CQRS-lite pattern.
 * It's lightweight, requires no extra infrastructure, and fits perfectly with Spring Boot 4's JdbcClient auto-configuration.
 */
@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    Optional<Hospital> findByHospitalCode(String hospitalCode);

    boolean existsByHospitalCode(String hospitalCode);

    @Query("select distinct h.state from Hospital h where h.state is not null order by h.state")
    List<String> findDistinctStates();

    @Query("select distinct h.district from Hospital h where h.state = :state and h.district is not null order by h.district")
    List<String> findDistinctDistrictsByState(@Param("state") String state);
}
