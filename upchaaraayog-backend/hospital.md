# Hospital Listing System

A production-grade hospital listing and filtering API built with **Spring Boot 4.0**,
**Spring Data JPA 4.0.4**, **JdbcClient**, and **PostgreSQL 17.8**.

Designed for India's national hospital dataset: 35,000–45,000 hospitals with
1,000–2,000 concurrent users under read-heavy listing load.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Why This Design](#why-this-design)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Index Strategy](#index-strategy)
- [Performance Characteristics](#performance-characteristics)
- [Configuration](#configuration)
- [Known Bugs Fixed in This Version](#known-bugs-fixed-in-this-version)
- [Other Approaches Considered](#other-approaches-considered)
- [Future Optimisations](#future-optimisations)
- [Stack Versions](#stack-versions)

---

## Architecture Overview

```
HTTP Request
     │
     ▼
HospitalController        (@RestController, @Validated)
     │ @Valid on body, @Min/@Max on pagination params
     ▼
HospitalService           (@Transactional readOnly=true)
     │
     ▼
HospitalReadRepository    (JdbcClient — bypasses Hibernate for reads)
     │
     ├── Q1: SELECT ... STRING_AGG ... GROUP BY ... LIMIT/OFFSET  (data)
     └── Q2: SELECT COUNT(*) ... EXISTS ...                        (count, skip if possible)
                    │
                    ▼
           HospitalRowMapper  (ResultSet → HospitalDTO record)
                    │
                    ▼
           Page<HospitalDTO>  (returned to controller → JSON)

Write path (not in this module):
HospitalRepository (JpaRepository) — used for INSERT/UPDATE/DELETE only
```

---

## Why This Design

### CQRS-Lite: JPA for writes, JdbcClient for reads

**JPA (Hibernate)** is excellent for writes. It manages entity graphs, dirty checking,
cascade operations, and optimistic locking. These are all write-time concerns.

**JPA is the wrong tool for read-heavy listing pages.** When you load 20 hospitals
via JPA for a listing card, Hibernate does:
1. Constructs 20 full `Hospital` entity objects
2. Wraps each collection in a `PersistentSet` proxy
3. Registers all 20 entities in the session for dirty checking
4. If you JOIN FETCH collections, risks in-memory pagination (HHH90003004)

For this endpoint, **we only need 10 columns from one SQL query**. JdbcClient gives us:
- SQL → `ResultSet` → `HospitalDTO` record constructor. That is all.
- Zero entity construction. Zero proxy. Zero dirty check. Zero collection initialisation.

At 1,000–2,000 concurrent users each loading a page of 20 hospitals:
- JPA path: ~200–400 entity objects constructed and GC'd per request
- JdbcClient path: 20 plain Java records, collected and returned

Multiply by 1,000 concurrent requests = 200,000–400,000 fewer object allocations per second.
Fewer allocations = less GC pressure = more headroom before you need to scale up.

### Why STRING_AGG instead of N+1 or JOIN FETCH

The listing card needs a hospital's specialities and schemes as lists.

**Option A — N+1**: Load 20 hospitals, then 20 queries for specialities, 20 for schemes = 41 queries.  
**Option B — JOIN FETCH**: Loads everything in 1–3 queries but goes through JPA entity graph.  
**Option C (chosen) — STRING_AGG**: One SQL query per page, aggregating all specialities
and schemes into comma-delimited strings in the DB. JVM splits them.

PostgreSQL's `STRING_AGG(DISTINCT sp.name, chr(31) ORDER BY sp.name)` collapses
all specialities for a hospital into one string, deduplicated and sorted, in the database.
This produces **one row per hospital**, regardless of how many specialities or schemes it has.

### Why chr(31) as the delimiter

We use `chr(31)` (ASCII Unit Separator, a non-printable control character) because:
- Hospital names, scheme names, and speciality names **cannot** contain this character
- It's expressed as a readable PostgreSQL function call, not an invisible byte in a Java string
- Comma, pipe, and semicolon could all appear in real data — chr(31) cannot

The delimiter is defined exactly once: `HospitalRowMapper.DELIMITER = '\u001F'`.
`chr(31)` in SQL and `'\u001F'` in Java are the same character. One change point for both.

### Why 2 queries instead of 3

Previous version used 3 queries (IDs, then JOIN FETCH specialities, then JOIN FETCH empanelments).
This version uses 2:
1. **Data query**: full SELECT with STRING_AGG, GROUP BY, LIMIT/OFFSET
2. **Count query**: lean COUNT(*) with EXISTS-based filters, no JOINs

The count query is often skipped entirely (see count short-circuit below).

### Why the count query has no JOINs

The count query was previously:
```sql
SELECT COUNT(DISTINCT h.id)
FROM hospitals h
LEFT JOIN hospital_specialities hs ON hs.hospital_id = h.id
LEFT JOIN hospital_empanelments he ON he.hospital_id = h.id
WHERE ...
```

For 40k hospitals × avg 4 specialities × avg 2 schemes = ~320k intermediate rows
just to count how many hospitals match the filter. Then DISTINCT to de-duplicate.

The fix uses EXISTS subqueries:
```sql
SELECT COUNT(*) FROM hospitals h
WHERE h.state = :state
  AND EXISTS (SELECT 1 FROM hospital_specialities hsx WHERE ...)
  AND EXISTS (SELECT 1 FROM hospital_empanelments hex JOIN schemes sc2 ...)
```

PostgreSQL evaluates EXISTS with a semi-join — it stops at the first match per hospital.
Zero JOIN product. Zero GROUP BY. Zero DISTINCT. Much faster count at scale.

### Why the count is short-circuited on page 0

```java
if (!pageable.hasPrevious() && cards.size() < pageable.getPageSize()) {
    total = cards.size(); // skip COUNT query
}
```

If the first page returns fewer hospitals than the page size (e.g., 3 results for a
specific district), the total is known without asking the DB. One fewer network round-trip.
At 1,000 concurrent users, this can save 200–400 COUNT queries per second for small-result
state+district combinations.

---

## API Reference

### POST /api/v1/hospitals/search

Search and filter hospitals with pagination.

**Why POST instead of GET?**  
The filter includes `List<Integer> specialityIds` and `List<String> schemeCodes`.
As GET query parameters these become `?specialityIds=1&specialityIds=2&schemeCodes=PMJAY`
which is fragile (URL length limits), hard to read, and breaks some reverse proxies.
POST with a JSON body is the pattern used by Elasticsearch, Algolia, and modern search APIs.

**Request Body**:
```json
{
    "state": "Maharashtra",
    "district": "Pune",
    "hospitalType": "PRIVATE",
    "specialityIds": [1, 3],
    "schemeCodes": ["PMJAY", "CGHS"]
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| state | String | ✅ Yes | Must not be blank |
| district | String | No | Optional filter |
| hospitalType | Enum | No | PUBLIC / GOVT / PRIVATE / NON_PROFIT_PRIVATE |
| specialityIds | List\<Integer\> | No | Hospital must have ANY of these |
| schemeCodes | List\<String\> | No | Hospital must be enrolled in ANY of these |

**Query Parameters**:

| Param | Default | Constraints | Notes |
|---|---|---|---|
| page | 0 | >= 0 | Zero-based page number |
| size | 10 | 1–50 | Max 50 to protect DB and JVM memory |

**Response** (200 OK):
```json
{
    "content": [
        {
            "id": 1,
            "hospitalCode": "MH-PUNE-001",
            "name": "Ruby Hall Clinic",
            "state": "Maharashtra",
            "district": "Pune",
            "contactNumber": "020-66455555",
            "hospitalType": "PRIVATE",
            "specialityNames": ["Cardiology", "Neurology"],
            "schemeNames": ["CGHS", "PMJAY"],
            "hasConvergence": true
        }
    ],
    "totalElements": 142,
    "totalPages": 15,
    "size": 10,
    "number": 0,
    "first": true,
    "last": false
}
```

**Error Responses**:

| Code | When |
|---|---|
| 400 | state is blank, page < 0, size > 50, or other validation failure |
| 500 | Unexpected DB error (message is masked; check server logs) |

---

## Database Schema

```
hospitals (id, hospital_code, name, state, district, contact_number, hospital_type)
    │
    ├── hospital_empanelments (hospital_id FK, scheme_id FK, is_convergence_enabled)
    │       └── schemes (id, code, name)
    │
    └── hospital_specialities (hospital_id FK, speciality_id FK)
            └── specialities (id, code, name)
```

**Unique constraints** (data integrity):
- `hospitals.hospital_code` — one code per hospital
- `(hospital_id, scheme_id)` — a hospital is enrolled in each scheme at most once
- `(hospital_id, speciality_id)` — a hospital has each speciality at most once

---

## Index Strategy

```
hospitals:
  idx_hospital_state_name          (state, name) INCLUDE (district, hospital_type, contact_number, hospital_code)
  idx_hospital_state_district_name (state, district, name) INCLUDE (hospital_type, contact_number, hospital_code)

hospital_empanelments:
  UNIQUE (hospital_id, scheme_id)  ← implicit composite index, covers hospital_id lookups
  idx_emp_scheme_id                (scheme_id)

hospital_specialities:
  UNIQUE (hospital_id, speciality_id) ← implicit composite index, covers hospital_id lookups
  idx_hspec_speciality_id             (speciality_id)
```

**Why `name` is a real key column, not INCLUDE:**  
`INCLUDE` columns are stored in the index leaf pages for heap-fetch avoidance (covering reads),
but the PostgreSQL planner cannot use them for `ORDER BY`. With `name` as a real key column
in `(state, name)` and `(state, district, name)`, the index is pre-sorted by name within
each state/district. `ORDER BY h.name ASC` is served by the index scan itself — no
separate sort node in the query plan.

**Why only 2 indexes on hospitals instead of 5:**  
The previous version had `(state)`, `(state, district)`, `(state, hospital_type)`,
`(state, district, hospital_type)`, and a covering index — 5 total. At 40k rows this
is borderline over-indexed. The planner can use `(state, name)` for state-only filters
(leading column). `hospital_type` filtering on a result set that already has state+district
applied is fast as a post-scan filter with 40k rows — a dedicated `(state, hospital_type)`
index adds write overhead without meaningful read benefit at this data size.

**Why the redundant hospital_id indexes were removed:**  
PostgreSQL uses the leading column of a composite index for single-column lookups.
`UNIQUE (hospital_id, scheme_id)` already provides an index on `hospital_id`. Creating a
separate `INDEX (hospital_id)` duplicates that coverage, wastes disk space, and adds
write overhead on every INSERT/DELETE to the join tables.

---

## Performance Characteristics

| Dimension | Value |
|---|---|
| Dataset size | 35,000–45,000 hospitals |
| Concurrent users (target) | 1,000–2,000 |
| Queries per API call | 1–2 (count skipped on page 0 with partial results) |
| DB rows per data query | Exactly `pageSize` rows (20 hospitals = 20 rows) |
| JVM allocations per request | 20 plain Java records (vs ~200–400 with JPA entity graph) |
| Hibernate involved in reads | No — JdbcClient bypasses Hibernate entirely |
| Dirty checking on reads | No — @Transactional(readOnly=true) skips it |

**Bottleneck at scale:**  
With 40k hospitals and 2k users, the DB is typically NOT the bottleneck — the indexes
cover the hot queries well. The JVM is usually the bottleneck first:
- Object allocation rate (mitigated by using records instead of entities)
- Connection pool exhaustion (mitigated by keeping pool size at ~10–20 connections,
  not 2,000 — see HikariCP configuration below)

---

## Configuration

Key `application.properties` settings:

```properties
# HikariCP — pool size is NOT equal to number of users
# Rule: (CPU cores × 2) + effective disk spindles. For a 4-core SSD server: ~10
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5

# Disable Open Session In View — prevents lazy-load surprises in the controller layer
spring.jpa.open-in-view=false

# Never use 'update' in production — use Flyway or Liquibase migrations instead
spring.jpa.hibernate.ddl-auto=validate

# Read-only hint to Hibernate for any JPA queries (write path)
spring.jpa.properties.hibernate.jdbc.fetch_size=50
```

---

## Known Bugs Fixed in This Version

| # | Bug | Impact | Fix |
|---|---|---|---|
| 1 | `@Validated` missing on `HospitalController` | `@Min`/`@Max` on `@RequestParam` silently ignored; any `size` value accepted | Added `@Validated` |
| 2 | `ConstraintViolationException` unhandled | `@RequestParam` validation failures returned HTTP 500 | Added `HandlerMethodValidationException` + `ConstraintViolationException` handlers |
| 3 | NPE in `handleValidationException` | `getFieldError()` returns null for class-level constraints; calling `.getDefaultMessage()` on null throws NPE inside the handler | Collect all field errors; fall back to global errors |
| 4 | `NON_PROFIT_PRIVATE` (16 chars) vs `@Column(length=10)` | `DataException` at runtime on save; schema validation failure at startup | `@Column(length=20)`; CHECK constraint updated in schema.sql |
| 5 | `ex.getMessage()` in generic exception handler | Internal JDBC/Hibernate details sent to API consumers | Log real message; return generic safe message |
| 6 | Raw `\u001F` byte embedded in SQL text block | SQL log corruption; JDBC driver incompatibility risk | Replaced with `chr(31)` (PostgreSQL function, evaluated server-side) |
| 7 | Redundant `idx_emp_hospital_id` and `idx_hspec_hospital_id` | Wasted disk space and write overhead on join tables | Removed; covered by leading column of UNIQUE constraints |
| 8 | `@NonNull` from `org.springframework.lang` | Deprecated since Spring Framework 7.0 | Replaced with `org.jspecify.annotations.NonNull` |
| 9 | Misleading `single()` comment | Said "nullable here" — incorrect since Spring 6.2 | Removed; replaced with accurate explanation |

---

## Other Approaches Considered

### Option A: Pure JPA with @EntityGraph and @BatchSize

```
Pros:  Object-oriented, type-safe, easy to unit test
Cons:  Entity materialisation overhead, in-memory pagination trap (HHH90003004)
       on paginated collection fetches, 2–3 queries still through Hibernate
```

### Option B: JOOQ

```
Pros:  Type-safe SQL, excellent for complex queries, generates code from schema
Cons:  Extra dependency, build-time code generation, learning curve,
       Pro version required for some advanced PostgreSQL features
       Overkill for a single listing endpoint
```

### Option C: Spring Data JPA Projections (Interface or DTO)

```
Pros:  Stays within Spring Data, no extra dependency
Cons:  JPQL cannot express STRING_AGG or BOOL_OR — these are DB-specific aggregate
       functions. Projection query rewriting (Spring Data JPA 4.0) works for scalar
       properties only, not aggregated collections. Would require @NativeQuery,
       which then needs @SqlResultSetMapping for complex types.
       JdbcClient + RowMapper is simpler for this case.
```

### Option D: Spring Data JPA @NativeQuery

```
Pros:  Stays within Spring Data
Cons:  Pagination with @NativeQuery requires a manually written countQuery.
       Result mapping to a record with List<String> fields still needs
       @SqlResultSetMapping or a custom converter. JdbcClient + RowMapper
       achieves the same result with less boilerplate.
```

---

## Future Optimisations

### If dataset grows to 200k+ hospitals

**Partitioning**: Partition the `hospitals` table by `state` using PostgreSQL declarative
partitioning. Each state's data lives in its own partition. Queries with `WHERE state = :state`
hit only one partition — dramatically reducing scan cost.

```sql
CREATE TABLE hospitals (...)
    PARTITION BY LIST (state);

CREATE TABLE hospitals_maharashtra
    PARTITION OF hospitals FOR VALUES IN ('Maharashtra');
```

### If concurrent users grow to 10k+

**PgBouncer** in transaction-mode pooling: your application talks to PgBouncer (50 connections);
PgBouncer manages up to 10,000 client connections and multiplexes them onto the 50 DB connections.
PostgreSQL's max_connections stays low (200), avoiding context-switching overhead.

**Read replica**: configure a second PostgreSQL instance as a streaming replica.
Route all read-only queries (`@Transactional(readOnly=true)`) to the replica via a
`ReplicationRoutingDataSource`. The `hospitals` table is insert-heavy at setup but
read-heavy in production — replicas take all the listing load off the primary.

### If pagination latency grows at deep offsets

`OFFSET 10000` scans and discards 10,000 rows before returning 20. At 45k hospitals this
is fast, but if the dataset grows, switch to **keyset pagination** using Spring Data's
`ScrollPosition` API (`Window<T>`). No code changes needed in the SQL layer if you design
the query to accept a cursor (`WHERE (state, name) > (:lastState, :lastName)`).

### If you need full-text search (hospital name)

Add a PostgreSQL `tsvector` column with a GIN index:
```sql
ALTER TABLE hospitals ADD COLUMN name_search tsvector
    GENERATED ALWAYS AS (to_tsvector('english', name)) STORED;
CREATE INDEX idx_hospital_name_fts ON hospitals USING GIN (name_search);
```
Then query with `WHERE name_search @@ plainto_tsquery('english', :query)`.
No Elasticsearch needed at this dataset size.

### Response caching

For state-level results that change infrequently, add `Cache-Control: max-age=60`
response headers. A CDN or Nginx in front of the application can serve cached
listing pages without hitting the database for repeated identical requests.

---

## Stack Versions

| Component | Version |
|---|---|
| Spring Boot | 4.0.x |
| Spring Framework | 7.0.x |
| Spring Data JPA | 4.0.4 |
| Hibernate ORM | 7.1.x |
| PostgreSQL | 17.8 |
| PostgreSQL JDBC Driver | 42.x |
| Jakarta Persistence | 3.2 |
| HikariCP | 7.0 |
| Java | 21+ (minimum 17) |
| JSpecify | 1.0.0 |