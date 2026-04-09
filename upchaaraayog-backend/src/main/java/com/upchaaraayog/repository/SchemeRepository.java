package com.upchaaraayog.repository;

import com.upchaaraayog.entities.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/** JPA repository for Scheme reference data (PMJAY, CGHS, CAPF, STATE). */

public interface SchemeRepository extends JpaRepository<Scheme, Integer> {
    Optional<Scheme> findByCode(String code);

    List<Scheme> findAllByOrderByNameAsc();
}