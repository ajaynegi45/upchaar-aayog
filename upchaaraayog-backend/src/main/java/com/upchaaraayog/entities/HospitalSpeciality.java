package com.upchaaraayog.entities;

import jakarta.persistence.*;

/**
 * Explicit join entity between Hospital and Speciality.
 * No payload columns currently, but kept as explicit entity (vs @ManyToMany) for
 * future-proofing (e.g., adding accreditation date, primary/secondary flag, etc.)

 * BUGS FIXED:
 * [1]  No getters/setters — added Lombok
 * [2]  Missing unique constraint on (hospital_id, speciality_id) — critical data integrity gap
 * [3]  Missing @Index on FK columns — speciality_id filter in EXISTS subquery would full-scan
 * [4]  No equals()/hashCode()
 * [5]  Missing nullable = false on @ManyToOne relationships
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
                @Index(name = "idx_hspec_hospital_id",   columnList = "hospital_id"),
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
    public HospitalSpeciality(Long id, Hospital hospital, Speciality speciality) {
        this.id = id;
        this.hospital = hospital;
        this.speciality = speciality;
    }

    public Long getId() {
        return id;
    }

    public Hospital getHospital() {
        return hospital;
    }

    public Speciality getSpeciality() {
        return speciality;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setHospital(Hospital hospital) {
        this.hospital = hospital;
    }

    public void setSpeciality(Speciality speciality) {
        this.speciality = speciality;
    }

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
