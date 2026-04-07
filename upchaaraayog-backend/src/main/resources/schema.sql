-- =============================================================================
-- Hospital Listing System — PostgreSQL 17.8 DDL
-- Spring Boot 4.0.x / Spring Data JPA 4.0.4 / Hibernate 7.1+
-- =============================================================================

CREATE TABLE schemes (
    id    INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code  VARCHAR(20)  NOT NULL,
    name  VARCHAR(100) NOT NULL,
    CONSTRAINT uk_scheme_code UNIQUE (code)
);

CREATE TABLE specialities (
    id    INTEGER      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code  VARCHAR(50)  NOT NULL,
    name  VARCHAR(100) NOT NULL,
    CONSTRAINT uk_speciality_code UNIQUE (code)
);

CREATE TABLE hospitals (
    id             BIGINT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    hospital_code  VARCHAR(50)  NOT NULL,
    name           VARCHAR(300) NOT NULL,
    state          VARCHAR(100) NOT NULL,
    district       VARCHAR(100) NOT NULL,
    contact_number VARCHAR(15),
    hospital_type  VARCHAR(20) 
        CHECK (hospital_type IS NULL OR hospital_type IN ('PUBLIC', 'GOVT', 'PRIVATE', 'NON_PROFIT_PRIVATE')),
    CONSTRAINT uk_hospital_code UNIQUE (hospital_code)
);

CREATE TABLE hospital_empanelments (
    id                     BIGINT   GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    hospital_id            BIGINT   NOT NULL REFERENCES hospitals(id)  ON DELETE CASCADE,
    scheme_id              INTEGER  NOT NULL REFERENCES schemes(id)     ON DELETE RESTRICT,
    is_convergence_enabled BOOLEAN  NOT NULL DEFAULT FALSE,
    CONSTRAINT uk_hospital_scheme UNIQUE (hospital_id, scheme_id)
);

CREATE INDEX idx_emp_scheme_id ON hospital_empanelments (scheme_id);

CREATE TABLE hospital_specialities (
    id             BIGINT   GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    hospital_id    BIGINT   NOT NULL REFERENCES hospitals(id)    ON DELETE CASCADE,
    speciality_id  INTEGER  NOT NULL REFERENCES specialities(id) ON DELETE RESTRICT,
    CONSTRAINT uk_hospital_speciality UNIQUE (hospital_id, speciality_id)
);

CREATE INDEX idx_hspec_speciality_id ON hospital_specialities (speciality_id);

CREATE INDEX idx_hospital_state_name
    ON hospitals (state, name)
    INCLUDE (district, hospital_type, contact_number, hospital_code);

CREATE INDEX idx_hospital_state_district_name
    ON hospitals (state, district, name)
    INCLUDE (hospital_type, contact_number, hospital_code);

-- Seed Data
INSERT INTO schemes (code, name) VALUES
    ('PMJAY',  'Pradhan Mantri Jan Arogya Yojana'),
    ('STATE',  'State Health Scheme'),
    ('CGHS',   'Central Government Health Scheme'),
    ('CAPF',   'Central Armed Police Forces');