package com.upchaaraayog.entities;

import jakarta.persistence.*;

/**
 * Join entity between Hospital and Speciality.
 */
@Entity
@Table(
        name = "hospital_specialities",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_hospital_speciality",
                        columnNames = {"hospital_id", "speciality_id"}
                )
        },
        indexes = {
                @Index(name = "idx_hspec_speciality_id", columnList = "speciality_id")
        }
)
public class HospitalSpeciality {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "speciality_id", nullable = false)
    private Speciality speciality;

    public HospitalSpeciality() {}
    public HospitalSpeciality(Hospital hospital, Speciality speciality) {
        this.hospital = hospital;
        this.speciality = speciality;
    }

    public Long getId()               { return id; }
    public Hospital getHospital()     { return hospital; }
    public Speciality getSpeciality() { return speciality; }

    public void setId(Long id)                      { this.id = id; }
    public void setHospital(Hospital hospital)      { this.hospital = hospital; }
    public void setSpeciality(Speciality speciality) { this.speciality = speciality; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof HospitalSpeciality hs)) return false;
        return hospital != null && hospital.equals(hs.hospital)
                && speciality != null && speciality.equals(hs.speciality);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}