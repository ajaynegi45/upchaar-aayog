package com.upchaaraayog.entities;

import jakarta.persistence.*;

/**
 * Join entity between Hospital and Speciality.
 *
 * WHY AN EXPLICIT JOIN ENTITY:
 *   Currently carries no extra columns, but using an explicit entity (vs @ManyToMany)
 *   allows adding columns in the future (e.g., isPrimary, accreditedDate, status)
 *   without restructuring the entire association.
 *
 * INDEX STRATEGY — same rationale as HospitalEmpanelment:
 *
 *   FIX [Bug 7 — Redundant Index]:
 *   The UNIQUE constraint on (hospital_id, speciality_id) automatically creates
 *   a composite index. hospital_id is the leading column, so it is already indexed.
 *   The previous @Index(name = "idx_hspec_hospital_id", columnList = "hospital_id")
 *   was a duplicate — wasted ~3–6 MB at 45k hospitals × avg 4 specialities.
 *
 *   Only idx_hspec_speciality_id is kept for reverse-side FK and admin queries.
 */
@Entity
@Table(
        name = "hospital_specialities",
        uniqueConstraints = {
                // Ensures a hospital is associated with each speciality at most once.
                // Also creates the composite index (hospital_id, speciality_id).
                @UniqueConstraint(
                        name = "uk_hospital_speciality",
                        columnNames = {"hospital_id", "speciality_id"}
                )
        },
        indexes = {
                // FIX: idx_hspec_hospital_id REMOVED — redundant with uk_hospital_speciality's leading column.
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

    // ── Constructors ──────────────────────────────────────────────────────────

    public HospitalSpeciality() {}

    public HospitalSpeciality(Hospital hospital, Speciality speciality) {
        this.hospital = hospital;
        this.speciality = speciality;
    }

    // ── Getters / Setters ─────────────────────────────────────────────────────

    public Long getId()               { return id; }
    public Hospital getHospital()     { return hospital; }
    public Speciality getSpeciality() { return speciality; }

    public void setId(Long id)                      { this.id = id; }
    public void setHospital(Hospital hospital)      { this.hospital = hospital; }
    public void setSpeciality(Speciality speciality) { this.speciality = speciality; }

    // ── equals / hashCode ─────────────────────────────────────────────────────

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