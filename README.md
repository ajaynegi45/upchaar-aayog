# Upchaar Aayog

Upchaar Aayog is a full-stack healthcare discovery platform focused on affordability and access. It helps users:

- find PM-JAY empanelled hospitals
- find Jan Aushadhi Kendras
- search lower-cost generic medicine alternatives

The repository contains a Next.js frontend and a Spring Boot backend.

## Repository Structure

```text
upchaar-aayog/
├── upchaaraayog-frontend/   # Next.js 16 + React 19 UI
└── upchaaraayog-backend/    # Spring Boot 4 + PostgreSQL APIs
```

## Features

- PM-JAY hospital discovery with state, district, hospital type, scheme, and speciality filters
- Delhi preselected on the hospital page for faster first use
- Jan Aushadhi Kendra search by location
- generic medicine search experience for cheaper alternatives
- mobile-friendly frontend access over LAN during development
- cached hospital metadata and search responses to reduce duplicate fetches

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand

### Backend

- Spring Boot 4.0.5
- Spring Data JPA
- JdbcClient
- PostgreSQL
- Maven Wrapper

## How It Works

### Frontend

The frontend is a Next.js app that renders the public experience. It talks to the backend through REST APIs exposed under `/api/v1`.

Key flows:

- hospital listing page with cached filters and paginated search
- Jan Aushadhi location flow
- generic medicine lookup

### Backend

The backend serves state, district, hospital, and kendra data. The hospital listing path uses `JdbcClient` for reads so the listing page does not pay the overhead of loading JPA entity graphs for every result card.

That read path lives mainly in `upchaaraayog-backend/src/main/java/com/upchaaraayog/repository/HospitalReadRepository.java`.

## Local Development

### 1. Start the backend

```bash
cd upchaaraayog-backend
./mvnw spring-boot:run
```

Backend default:

- port: `8080`
- bind address: `0.0.0.0`

### 2. Start the frontend

```bash
cd upchaaraayog-frontend
npm install
npm run dev
```

Frontend default:

- port: `3000`
- bind address: `0.0.0.0`

### 3. Open the app

Desktop:

- [http://localhost:3000](http://localhost:3000)

Mobile on the same Wi-Fi:

- `http://<your-local-ip>:3000`
- example: `http://192.168.1.5:3000`

## Environment

Frontend uses:

- `NEXT_PUBLIC_API_URL`

Example:

```env
NEXT_PUBLIC_API_URL=http://192.168.1.5:8080
```

If this variable is missing in the browser, the frontend falls back to the current hostname with backend port `8080`.

Backend uses:

- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`

See `upchaaraayog-backend/src/main/resources/application.yaml`.

## API Overview

Important endpoints:

- `POST /api/v1/hospitals/search`
- `GET /api/v1/hospitals/states`
- `GET /api/v1/hospitals/districts?state=...`
- `GET /api/v1/hospitals/schemes?state=...&district=...`
- `GET /api/v1/hospitals/specialities?state=...&district=...`
- `GET /api/v1/hospitals/types?state=...&district=...`
- `GET /api/v1/jan-aushadhi-kendra`
- `GET /api/v1/states`
- `GET /api/v1/states/{stateName}/districts`

## Performance Notes

- hospital listing reads are SQL-first and avoid classic JPA N+1 problems on the main listing endpoint
- district, scheme, type, speciality, and search requests are cached in the frontend store
- speciality options are lazy-loaded only when the speciality field is opened

## Verification

Useful commands:

```bash
cd upchaaraayog-frontend
npm run lint
```

```bash
cd upchaaraayog-backend
./mvnw -q -DskipTests compile
```

## Current Improvement Ideas

- move remaining frontend lint warnings to zero
- add backend integration tests for hospital filters
- add request-level metrics and response time dashboards
- replace basic multi-selects with a more polished searchable select component
- persist the user’s last selected hospital filters in local storage

## Data and Purpose

This project is meant to improve discoverability of public-health and affordable-care information. Users should still verify final eligibility, hospital availability, and medicine details through official channels before making treatment decisions.
