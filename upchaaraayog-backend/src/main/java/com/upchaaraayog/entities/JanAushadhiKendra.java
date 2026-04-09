package com.upchaaraayog.entities;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "jan_aushadhi_kendra", indexes = {
    @Index(name = "idx_pincode", columnList = "pincode"),
    @Index(name = "idx_state_district", columnList = "state, district")
})
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

    public void setId(UUID id) {
        this.id = id;
    }

    public String getKendraCode() {
        return kendraCode;
    }

    public void setKendraCode(String kendraCode) {
        this.kendraCode = kendraCode;
    }

    public String getKendraName() {
        return kendraName;
    }

    public void setKendraName(String kendraName) {
        this.kendraName = kendraName;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public Integer getPincode() {
        return pincode;
    }

    public void setPincode(Integer pincode) {
        this.pincode = pincode;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
