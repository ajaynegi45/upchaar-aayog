package com.upchaaraayog.repository;

import com.upchaaraayog.entities.Speciality;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/** JPA repository for Speciality reference data. Used during import for find-or-create. */
public interface SpecialityRepository extends JpaRepository<Speciality, Integer> {
    Optional<Speciality> findByCode(String code);

    List<Speciality> findAllByOrderByNameAsc();
}