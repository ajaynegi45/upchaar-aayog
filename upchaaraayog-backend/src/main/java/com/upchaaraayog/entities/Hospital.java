package com.upchaaraayog.entities;

import java.util.Set;
import java.util.HashSet;
import jakarta.persistence.*;
import org.hibernate.annotations.NaturalId;

@Entity
@Table(
        name = "hospitals",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_hospital_code", columnNames = "hospital_code")
        }
)

public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @NaturalId: Hibernate 7 uses this for L2 cache natural-id resolution
    @NaturalId
    @Column(name = "hospital_code", unique = true, nullable = false, length = 50)
    private String hospitalCode;

    @Column(name = "name", nullable = false, length = 300)
    private String name;

    @Column(name = "state", nullable = false, length = 100)
    private String state;

    @Column(name = "district", nullable = false, length = 100)
    private String district;

    @Column(name = "contact_number", length = 10)
    private String contactNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "hospital_type", nullable = false, length = 10)
    private HospitalType hospitalType;

    @OneToMany(mappedBy = "hospital", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<HospitalEmpanelment> empanelments = new HashSet<>();

    @OneToMany(mappedBy = "hospital", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<HospitalSpeciality> specialities = new HashSet<>();

    public Hospital() {}

    // Constructor has 9 parameters, which is greater than 7 authorized.
    public Hospital(Long id, String hospitalCode, String name, String state, String district, String contactNumber, HospitalType hospitalType, Set<HospitalEmpanelment> empanelments, Set<HospitalSpeciality> specialities) {
        this.id = id;
        this.hospitalCode = hospitalCode;
        this.name = name;
        this.state = state;
        this.district = district;
        this.contactNumber = contactNumber;
        this.hospitalType = hospitalType;
        this.empanelments = empanelments;
        this.specialities = specialities;
    }

    public Long getId() { return id; }
    public String getHospitalCode() { return hospitalCode; }
    public String getName() { return name; }
    public String getState() { return state; }
    public String getDistrict() { return district; }
    public String getContactNumber() { return contactNumber; }
    public HospitalType getHospitalType() { return hospitalType; }
    public Set<HospitalEmpanelment> getEmpanelments() { return empanelments; }
    public Set<HospitalSpeciality> getSpecialities() { return specialities; }

    public void setId(Long id) { this.id = id; }
    public void setHospitalCode(String hospitalCode) { this.hospitalCode = hospitalCode; }
    public void setName(String name) { this.name = name; }
    public void setState(String state) { this.state = state; }
    public void setDistrict(String district) { this.district = district; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public void setHospitalType(HospitalType hospitalType) { this.hospitalType = hospitalType; }
    public void setEmpanelments(Set<HospitalEmpanelment> empanelments) { this.empanelments = empanelments; }
    public void setSpecialities(Set<HospitalSpeciality> specialities) { this.specialities = specialities; }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Hospital other)) return false;
        return hospitalCode != null && hospitalCode.equals(other.hospitalCode);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Hospital{" +
                "id=" + id +
                ", hospitalCode='" + hospitalCode + '\'' +
                ", name='" + name + '\'' +
                ", state='" + state + '\'' +
                ", district='" + district + '\'' +
                ", contactNumber='" + contactNumber + '\'' +
                ", hospitalType=" + hospitalType +
                '}';
    }
}

