package com.upchaaraayog.repositories;

import com.upchaaraayog.entities.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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

    // Write methods (save, delete) are inherited from JpaRepository.
    // Add domain-specific write methods here as needed.
}
