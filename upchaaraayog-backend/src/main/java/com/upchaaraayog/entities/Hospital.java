package com.upchaaraayog.entities;

import java.util.Set;
import java.util.HashSet;
import jakarta.persistence.*;
import org.hibernate.annotations.NaturalId;

/**
 * JPA entity representing a hospital.
 *
 * ROLE IN THE ARCHITECTURE:
 *   This entity is used ONLY for write operations (create, update, delete).
 *   The read path for the listing API bypasses JPA entirely — it uses JdbcClient
 *   in HospitalReadRepository to avoid Hibernate entity materialization overhead.
 *   This is the CQRS-lite pattern (Command Query Responsibility Segregation, lightweight).
 *
 * COLLECTION INITIALIZATION:
 *   Both collections are initialized to empty HashSet. This prevents NullPointerException
 *   when calling .add() on a freshly constructed hospital before it is persisted.
 *
 * equals() / hashCode() CONTRACT:
 *   Based on hospitalCode (the business key), NOT on the surrogate id.
 *   Using id breaks Sets when the entity is in transient state (id == null before
 *   first persist). See Vlad Mihalcea's "The best way to implement equals and hashCode"
 *   for the rationale: https://vladmihalcea.com/jpa-entity-identifier-hashcode/
 *   hashCode() returns a constant to satisfy the contract while staying safe across
 *   state transitions (transient → persistent → detached).
 */
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

    /**
     * Business-level unique identifier for a hospital (e.g., "DL-AIIMS-001").
     * @NaturalId: Hibernate 7 uses this annotation to resolve the entity from the
     * second-level cache without a DB round-trip:
     *   session.byNaturalId(Hospital.class).using("hospitalCode", "DL-AIIMS-001").load()
     */
    @NaturalId
    @Column(name = "hospital_code", unique = true, nullable = false, length = 50)
    private String hospitalCode;

    @Column(name = "name", nullable = false, length = 300)
    private String name;

    @Column(name = "state", nullable = false, length = 100)
    private String state;

    @Column(name = "district", nullable = false, length = 100)
    private String district;

    /**
     * Hospital contact number.
     * Length = 15: accommodates 10-digit mobile numbers, landlines with STD codes
     * (e.g. "011-26588500" = 12 chars), and international format "+91-9XXXXXXXXX" = 14 chars.
     *
     * FIX: Previous version had length = 10. Indian hospital landlines commonly follow
     * the format "CITY_CODE-NUMBER" which exceeds 10 characters (e.g. "0120-4141414" = 12).
     */
    @Column(name = "contact_number", length = 15)
    private String contactNumber;

    /**
     * Hospital type: PUBLIC, GOVT, PRIVATE, or NON_PROFIT_PRIVATE.
     *
     * FIX [Bug 4]: Previous version had @Column(length = 10). The enum value
     * NON_PROFIT_PRIVATE is 16 characters long. A length of 10 causes:
     *   - DataException at runtime when saving NON_PROFIT_PRIVATE hospitals
     *   - Schema validation failure at startup if ddl-auto = validate
     *
     * Length = 20 accommodates all current values (max 16 chars) and future additions
     * up to 20 characters without needing a migration.
     *
     * ALSO: The PostgreSQL CHECK constraint in schema.sql must list 'NON_PROFIT_PRIVATE'.
     * See schema.sql.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "hospital_type", nullable = false, length = 20) // FIX: was 10, must be >= 16
    private HospitalType hospitalType;

    /**
     * All empanelment (scheme) associations for this hospital.
     * cascade = ALL: saving/deleting the hospital saves/deletes its empanelments.
     * orphanRemoval = true: removing from this Set deletes the DB row.
     * fetch = LAZY: collections are NOT loaded unless explicitly accessed —
     * essential for the write path where we don't need scheme data on save.
     */
    @OneToMany(mappedBy = "hospital", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<HospitalEmpanelment> empanelments = new HashSet<>();

    /**
     * All speciality associations for this hospital.
     * Same cascade/fetch strategy as empanelments — see above.
     */
    @OneToMany(mappedBy = "hospital", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<HospitalSpeciality> specialities = new HashSet<>();

    // ── Constructors ──────────────────────────────────────────────────────────

    /** Required by JPA. Do not use directly — use the builder pattern or setters. */
    public Hospital() {}

    // ── Getters ───────────────────────────────────────────────────────────────

    public Long getId()                                { return id; }
    public String getHospitalCode()                    { return hospitalCode; }
    public String getName()                            { return name; }
    public String getState()                           { return state; }
    public String getDistrict()                        { return district; }
    public String getContactNumber()                   { return contactNumber; }
    public HospitalType getHospitalType()              { return hospitalType; }
    public Set<HospitalEmpanelment> getEmpanelments()  { return empanelments; }
    public Set<HospitalSpeciality> getSpecialities()   { return specialities; }

    // ── Setters ───────────────────────────────────────────────────────────────

    public void setId(Long id)                                          { this.id = id; }
    public void setHospitalCode(String hospitalCode)                    { this.hospitalCode = hospitalCode; }
    public void setName(String name)                                    { this.name = name; }
    public void setState(String state)                                  { this.state = state; }
    public void setDistrict(String district)                            { this.district = district; }
    public void setContactNumber(String contactNumber)                  { this.contactNumber = contactNumber; }
    public void setHospitalType(HospitalType hospitalType)              { this.hospitalType = hospitalType; }
    public void setEmpanelments(Set<HospitalEmpanelment> empanelments)  { this.empanelments = empanelments; }
    public void setSpecialities(Set<HospitalSpeciality> specialities)   { this.specialities = specialities; }

    // ── equals / hashCode / toString ──────────────────────────────────────────

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Hospital other)) return false;
        // Use business key (hospitalCode), never surrogate id.
        // id is null in transient state; hospitalCode is set before persist.
        return hospitalCode != null && hospitalCode.equals(other.hospitalCode);
    }

    @Override
    public int hashCode() {
        // Constant hashCode satisfies the equals/hashCode contract across entity
        // lifecycle transitions (transient → persistent → detached).
        // Bucket distribution is poor but correct — acceptable for entity Sets.
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        // Intentionally excludes collections (empanelments, specialities) to
        // prevent accidental lazy-load trigger from logging frameworks.
        return "Hospital{"
                + "id=" + id
                + ", hospitalCode='" + hospitalCode + '\''
                + ", name='" + name + '\''
                + ", state='" + state + '\''
                + ", district='" + district + '\''
                + ", contactNumber='" + contactNumber + '\''
                + ", hospitalType=" + hospitalType
                + '}';
    }
}