package com.upchaaraayog.repositories;

import com.upchaaraayog.entities.JanAushadhiKendra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface JanAushadhiRepository extends JpaRepository<JanAushadhiKendra, UUID> {

    Page<JanAushadhiKendra> findByStateAndDistrict( String state, String district, Pageable pageable);
    Page<JanAushadhiKendra> findByStateAndDistrictAndPincode( String state, String district, Integer pincode, Pageable pageable);

    @Query(" SELECT DISTINCT kendra.state FROM JanAushadhiKendra kendra ORDER BY kendra.state ")
    List<String> findAllStates();

    @Query(" SELECT DISTINCT kendra.district FROM JanAushadhiKendra kendra  WHERE kendra.state = :state ORDER BY kendra.district ")
    List<String> findDistrictsByStateIgnoreCase(String state);

}
