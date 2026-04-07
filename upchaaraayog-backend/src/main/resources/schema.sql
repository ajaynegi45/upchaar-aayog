-- =============================================================================
-- Hospital Listing System — PostgreSQL 17.8 DDL
-- Spring Boot 4.0.x / Spring Data JPA 4.0.4 / Hibernate 7.1+
--
-- FIX [Bug 4]: hospital_type column changed from VARCHAR(10) to VARCHAR(20)
-- to accommodate the NON_PROFIT_PRIVATE enum value (16 characters).
-- FIX [Bug 4]: CHECK constraint updated to include 'NON_PROFIT_PRIVATE'.
-- FIX [Bug 7]: Redundant indexes idx_emp_hospital_id and idx_hspec_hospital_id
-- removed — both are covered by the leading column of their UNIQUE constraints.
-- =============================================================================

-- ── Reference: Schemes ────────────────────────────────────────────────────────
CREATE TABLE schemes (
                         id    INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                         code  VARCHAR(20)  NOT NULL,
                         name  VARCHAR(100) NOT NULL,
                         CONSTRAINT uk_scheme_code UNIQUE (code)
);

-- ── Reference: Specialities ───────────────────────────────────────────────────
CREATE TABLE specialities (
                              id    INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                              code  VARCHAR(50)  NOT NULL,
                              name  VARCHAR(100) NOT NULL,
                              CONSTRAINT uk_speciality_code UNIQUE (code)
);

-- ── Hospitals ─────────────────────────────────────────────────────────────────
--
-- hospital_type VARCHAR(20):
--   FIX: Was VARCHAR(10). NON_PROFIT_PRIVATE is 16 characters.
--   VARCHAR(10) caused DataException at runtime on any hospital with this type.
--
-- CHECK constraint includes all four HospitalType enum values:
--   FIX: Was ('PUBLIC','GOVT','PRIVATE'). Now includes 'NON_PROFIT_PRIVATE'.
--   Without this fix, INSERT/UPDATE of NON_PROFIT_PRIVATE hospitals would succeed
--   at the application layer but be rejected by the DB with a constraint violation.
--
-- contact_number VARCHAR(15):
--   Accommodates 10-digit mobile, landline with STD code (e.g. "011-26588500"),
--   and international format "+91-9XXXXXXXXX". Previous length 10 was too short.
--
CREATE TABLE hospitals (
                           id             BIGINT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                           hospital_code  VARCHAR(50)  NOT NULL,
                           name           VARCHAR(300) NOT NULL,
                           state          VARCHAR(100) NOT NULL,
                           district       VARCHAR(100) NOT NULL,
                           contact_number VARCHAR(15),
                           hospital_type  VARCHAR(20)  NOT NULL
                               CHECK (hospital_type IN ('PUBLIC', 'GOVT', 'PRIVATE', 'NON_PROFIT_PRIVATE')),
                           CONSTRAINT uk_hospital_code UNIQUE (hospital_code)
);

-- ── Join: Hospital ↔ Scheme (Empanelment) ─────────────────────────────────────
CREATE TABLE hospital_empanelments (
                                       id                     BIGINT   GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                       hospital_id            BIGINT   NOT NULL REFERENCES hospitals(id)  ON DELETE CASCADE,
                                       scheme_id              INTEGER  NOT NULL REFERENCES schemes(id)     ON DELETE RESTRICT,
                                       is_convergence_enabled BOOLEAN  NOT NULL DEFAULT FALSE,
                                       CONSTRAINT uk_hospital_scheme UNIQUE (hospital_id, scheme_id)
    -- The UNIQUE constraint above creates an index on (hospital_id, scheme_id).
    -- hospital_id queries use the leading column of this composite index.
    -- No separate idx_emp_hospital_id is needed — that was redundant (Bug 7).
);

-- idx_emp_scheme_id: needed for "reverse" FK lookups (scheme → hospitals).
-- PostgreSQL does NOT auto-create FK indexes.
CREATE INDEX idx_emp_scheme_id ON hospital_empanelments (scheme_id);

-- ── Join: Hospital ↔ Speciality ───────────────────────────────────────────────
CREATE TABLE hospital_specialities (
                                       id             BIGINT   GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                       hospital_id    BIGINT   NOT NULL REFERENCES hospitals(id)    ON DELETE CASCADE,
                                       speciality_id  INTEGER  NOT NULL REFERENCES specialities(id) ON DELETE RESTRICT,
                                       CONSTRAINT uk_hospital_speciality UNIQUE (hospital_id, speciality_id)
    -- The UNIQUE constraint creates an index on (hospital_id, speciality_id).
    -- No separate idx_hspec_hospital_id is needed — redundant (Bug 7).
);

-- idx_hspec_speciality_id: needed for "reverse" FK lookups.
CREATE INDEX idx_hspec_speciality_id ON hospital_specialities (speciality_id);

-- ── Performance Indexes on Hospitals ─────────────────────────────────────────
--
-- Two covering indexes replace the previous five individual indexes.
-- 'name' is a real key column (not INCLUDE) in both indexes so that
-- ORDER BY h.name is served by the index scan without a separate sort step.
--
-- Columns in INCLUDE (district, hospital_type, contact_number, hospital_code)
-- are carried in the index leaf pages for heap-fetch avoidance (covering reads).
-- They are NOT in the key because they are not used for filtering or sorting.

CREATE INDEX idx_hospital_state_name
    ON hospitals (state, name)
    INCLUDE (district, hospital_type, contact_number, hospital_code);

CREATE INDEX idx_hospital_state_district_name
    ON hospitals (state, district, name)
    INCLUDE (hospital_type, contact_number, hospital_code);

-- ── Seed Data ─────────────────────────────────────────────────────────────────
INSERT INTO schemes (code, name) VALUES
                                     ('PMJAY',  'Pradhan Mantri Jan Arogya Yojana'),
                                     ('STATE',  'State Health Scheme'),
                                     ('CGHS',   'Central Government Health Scheme'),
                                     ('CAPF',   'Central Armed Police Forces');

-- ── Migration Note ────────────────────────────────────────────────────────────
-- If you are applying this to an existing database (not a fresh schema):
--
-- 1. Widen the column:
--    ALTER TABLE hospitals ALTER COLUMN hospital_type TYPE VARCHAR(20);
--
-- 2. Update the CHECK constraint:
--    ALTER TABLE hospitals DROP CONSTRAINT IF EXISTS hospitals_hospital_type_check;
--    ALTER TABLE hospitals ADD CONSTRAINT hospitals_hospital_type_check
--        CHECK (hospital_type IN ('PUBLIC', 'GOVT', 'PRIVATE', 'NON_PROFIT_PRIVATE'));
--
-- 3. Widen contact_number:
--    ALTER TABLE hospitals ALTER COLUMN contact_number TYPE VARCHAR(15);
--
-- 4. Drop the redundant indexes (if they exist from a previous schema):
--    DROP INDEX IF EXISTS idx_emp_hospital_id;
--    DROP INDEX IF EXISTS idx_hspec_hospital_id;