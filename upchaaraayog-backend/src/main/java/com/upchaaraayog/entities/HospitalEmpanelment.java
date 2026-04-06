package com.upchaaraayog.entities;

import jakarta.persistence.*;

@Entity
@Table(
        name = "hospital_empanelments",
        uniqueConstraints = {
                @UniqueConstraint( name = "uk_hospital_scheme", columnNames = {"hospital_id", "scheme_id"} )
        },
        indexes = {
                @Index(name = "idx_emp_hospital_id", columnList = "hospital_id"),
                @Index(name = "idx_emp_scheme_id",   columnList = "scheme_id")
        }
)

public class HospitalEmpanelment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;

    @Column(name = "is_convergence_enabled", nullable = false)
    private boolean convergenceEnabled;

    public HospitalEmpanelment() {}
    public HospitalEmpanelment(Long id, Hospital hospital, Scheme scheme, boolean convergenceEnabled) {
        this.id = id;
        this.hospital = hospital;
        this.scheme = scheme;
        this.convergenceEnabled = convergenceEnabled;
    }

    public Long getId() { return id; }
    public Hospital getHospital() { return hospital; }
    public Scheme getScheme() { return scheme; }
    public boolean isConvergenceEnabled() { return convergenceEnabled; }


    public void setId(Long id) { this.id = id; }
    public void setHospital(Hospital hospital) { this.hospital = hospital; }
    public void setScheme(Scheme scheme) { this.scheme = scheme; }
    public void setConvergenceEnabled(boolean convergenceEnabled) { this.convergenceEnabled = convergenceEnabled; }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof HospitalEmpanelment e)) return false;
        return hospital != null && hospital.equals(e.hospital)
                && scheme != null && scheme.equals(e.scheme);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
