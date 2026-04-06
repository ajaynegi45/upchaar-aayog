package com.upchaaraayog.entities;

/**
 * Classification of a hospital's ownership and operational model.
 *
 * STORED AS: VARCHAR in the database using @Enumerated(EnumType.STRING).
 * This means the column length MUST accommodate the longest enum name.
 *
 * CURRENT LONGEST VALUE: NON_PROFIT_PRIVATE (16 characters)
 *
 * DB COLUMN CONSTRAINT:
 *   Hospital.hospitalType is mapped with @Column(length = 20), which is sufficient
 *   for all current values plus reasonable future additions.
 *
 *   The PostgreSQL CHECK constraint in schema.sql must also include 'NON_PROFIT_PRIVATE'.
 *   See schema.sql for the updated CHECK constraint.
 *
 * IMPORTANT — RULE FOR FUTURE DEVELOPERS:
 *   If you add a new enum value, you MUST do ALL of the following:
 *   1. Add the value here.
 *   2. Verify that Hospital.@Column(length = N) is >= the new value's character count.
 *   3. Update the CHECK constraint in schema.sql (and write a migration script).
 *   4. Update any API documentation that lists valid hospital types.
 *   Failing to do steps 2–4 causes runtime DataException from PostgreSQL when
 *   anyone attempts to save a hospital with the new type.
 *
 * VALUE LENGTHS:
 *   PUBLIC            →  6 chars
 *   GOVT              →  4 chars
 *   PRIVATE           →  7 chars
 *   NON_PROFIT_PRIVATE → 16 chars  ← currently the longest; column must be >= 16
 */
public enum HospitalType {

    /**
     * Government-funded public hospital, typically under central or state ministry.
     * Examples: AIIMS, district hospitals.
     */
    PUBLIC,

    /**
     * Government hospital — used in some datasets as distinct from 'PUBLIC'
     * (e.g., PSU hospitals, ESIC hospitals).
     */
    GOVT,

    /**
     * Privately owned and operated for profit.
     */
    PRIVATE,

    /**
     * Privately operated but registered as a non-profit / charitable trust.
     * Examples: mission hospitals, trust-run hospitals.
     * Length: 16 chars — requires @Column(length >= 16) on Hospital.hospitalType.
     */
    NON_PROFIT_PRIVATE
}