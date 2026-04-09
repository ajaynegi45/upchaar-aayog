package com.upchaaraayog.dto;

public class JanAushadhiKendraDTO {
    private String kendraCode;
    private String kendraName;
    private String state;
    private String district;
    private Integer pincode;
    private String address;

    // Getters and Setters
    public String getKendraCode() { return kendraCode; }
    public void setKendraCode(String kendraCode) { this.kendraCode = kendraCode; }

    public String getKendraName() { return kendraName; }
    public void setKendraName(String kendraName) { this.kendraName = kendraName; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public Integer getPincode() { return pincode; }
    public void setPincode(Integer pincode) { this.pincode = pincode; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
