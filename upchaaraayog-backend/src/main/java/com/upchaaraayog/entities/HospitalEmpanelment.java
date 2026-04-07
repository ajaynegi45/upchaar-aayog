package com.upchaaraayog.entities;

import jakarta.persistence.*;

/**
 * Join entity between Hospital and Scheme (empanelment record).
 *
 * WHY AN EXPLICIT JOIN ENTITY (not @ManyToMany):
 *   The relationship carries a payload: isConvergenceEnabled. @ManyToMany cannot
 *   express extra columns on the join table. An explicit entity also enables
 *   future additions (e.g., empanelment date, expiry date, status) without a
 *   schema migration away from a join-table approach.
 *
 * INDEX STRATEGY:
 *   The UNIQUE constraint on (hospital_id, scheme_id) automatically creates
 *   a composite index with hospital_id as the leading column. This means:
 *     - Lookups by hospital_id alone use the unique index (leading column rule)
 *     - Lookups by scheme_id alone still need a separate index → idx_emp_scheme_id
 *
 *   FIX [Bug 7 — Redundant Index]:
 *   Previous version declared @Index(name = "idx_emp_hospital_id", columnList = "hospital_id").
 *   This is redundant because hospital_id is ALREADY indexed as the leading column
 *   of the UNIQUE (hospital_id, scheme_id) index. PostgreSQL uses leading columns
 *   of composite indexes for single-column lookups automatically.
 *   Keeping a redundant index wastes disk space (~4–8 MB at 45k rows) and adds
 *   write overhead on every INSERT/UPDATE/DELETE to hospital_empanelments.
 *
 *   Only idx_emp_scheme_id is kept — it covers the "reverse" FK lookup
 *   needed if cascading deletes on Scheme are ever introduced, and for
 *   any admin queries that look up empanelments by scheme.
 */
@Entity
@Table(
        name = "hospital_empanelments",
        uniqueConstraints = {
                // Ensures a hospital is enrolled in each scheme at most once.
                // This also creates the composite index (hospital_id, scheme_id).
                @UniqueConstraint(name = "uk_hospital_scheme", columnNames = {"hospital_id", "scheme_id"})
        },
        indexes = {
                // FIX: idx_emp_hospital_id REMOVED — covered by uk_hospital_scheme's leading column.
                // Only the reverse-side (scheme_id) index is needed.
                @Index(name = "idx_emp_scheme_id", columnList = "scheme_id")
        }
)
public class HospitalEmpanelment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The hospital that is enrolled in the scheme.
     * optional = false: Hibernate skips the null check at the ORM level,
     * which generates an INNER JOIN instead of LEFT JOIN when loading — faster.
     * nullable = false: DB-level NOT NULL constraint.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    /**
     * The scheme this hospital is enrolled under.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "scheme_id", nullable = false)
    private Scheme scheme;

    /**
     * Whether convergence benefits are enabled for this hospital under this scheme.
     * Convergence allows patients to access benefits across multiple schemes simultaneously.
     * Stored as is_convergence_enabled in the DB.
     *
     * NOTE: Field is named 'convergenceEnabled' (not 'isConvergenceEnabled') to avoid
     * Lombok's boolean-prefix stripping producing 'isIsConvergenceEnabled()'. Lombok is
     * not used in this project, but the naming convention is kept for clarity.
     * The getter is named isConvergenceEnabled() following Java Bean convention.
     */
    @Column(name = "is_convergence_enabled", nullable = false)
    private boolean convergenceEnabled;

    // ── Constructors ──────────────────────────────────────────────────────────

    public HospitalEmpanelment() {}

    public HospitalEmpanelment(Hospital hospital, Scheme scheme, boolean convergenceEnabled) {
        this.hospital = hospital;
        this.scheme = scheme;
        this.convergenceEnabled = convergenceEnabled;
    }

    // ── Getters / Setters ─────────────────────────────────────────────────────

    public Long getId()                    { return id; }
    public Hospital getHospital()          { return hospital; }
    public Scheme getScheme()              { return scheme; }
    public boolean isConvergenceEnabled()  { return convergenceEnabled; }

    public void setId(Long id)                                  { this.id = id; }
    public void setHospital(Hospital hospital)                  { this.hospital = hospital; }
    public void setScheme(Scheme scheme)                        { this.scheme = scheme; }
    public void setConvergenceEnabled(boolean convergenceEnabled) {
        this.convergenceEnabled = convergenceEnabled;
    }

    // ── equals / hashCode ─────────────────────────────────────────────────────

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof HospitalEmpanelment e)) return false;
        // Composite business key: a hospital+scheme pair must be unique.
        return hospital != null && hospital.equals(e.hospital)
                && scheme != null && scheme.equals(e.scheme);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}