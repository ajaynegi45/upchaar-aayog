package com.upchaaraayog.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.util.UUID;

@Entity
public class JanAushadhiKendra {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "kendra_code", unique = true, nullable = false)
    private String kendraCode;

    @Column(nullable = false)
    private String kendraName;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private Integer pincode;

    @Column(nullable = false)
    private String address;

    public UUID getId() {
        return id;
    }

    public String getKendraCode() {
        return kendraCode;
    }

    public String getKendraName() {
        return kendraName;
    }

    public String getDistrict() {
        return district;
    }

    public Integer getPincode() {
        return pincode;
    }

    public String getAddress() {
        return address;
    }
}
