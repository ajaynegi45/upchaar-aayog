# Upchaar Aayog

Upchaar Aayog is a user-friendly platform aimed at making healthcare more affordable and accessible for all, especially for economically disadvantaged individuals. The platform helps users find affordable generic medications, nearby **Jan Aushadhi Kendras**, and **Ayushman Bharat hospitals** for free treatment up to ₹5 lakh.

<a href="https://github.com/ajaynegi45/upchaar-aayog/blob/main/Upchaar%20Aayog.pdf">Check Presentation File</a>

## Architecture & Tech Stack

Upchaar Aayog follows a strict separation of concerns, maintaining decoupled code for the Frontend and the Backend infrastructure.

### Frontend
- **Framework**: Next.js 16 / React 19 (Strictly limited to the UI client layer).
- **State Management**: Zustand for global structured state management.
- **Styling**: Vanilla CSS structure via global properties, supporting dynamic glassmorphism and modern responsive interactions. 
- **Service Layer**: Clean `src/services/` mechanism that coordinates explicit `fetch()` requests separate from the Component/Store layers (e.g. `hospitalService.ts`, `kendraService.ts`).

### Backend 
- **Framework**: Spring Boot 4 / Java 25
- **Database**: PostgreSQL with PostGIS for Geospatial queries.
- **Features**: Highly scalable virtual-thread architecture, providing RESTful endpoints.

### Client-Side Caching Mechanism
To preserve fast UX and save API bandwidth, we implement localized dictionary caching (`Map<string, Promise>`) inside the React service layer (`src/services/hospitalService.ts`). 
- Queries like *States*, *Districts*, and precisely configured *Hospital Searches* are cached securely for the active session. If a user toggles back and forth between "State A" and "State B," the App prevents redundant network trips by swiftly reading the pre-resolved Promises in the proxy map, delivering lightning-fast rendering.

## Features

- **Generic Medicine Search**: Easily find affordable generic medicine alternatives for commonly prescribed branded drugs.
- **Locate Jan Aushadhi Kendras**: Find nearby Jan Aushadhi Kendras to purchase discounted generic medications.
- **Ayushman Bharat Hospitals**: Discover nearby hospitals under the Ayushman Bharat scheme offering free treatment up to ₹5 lakh.

## Why Upchaar Aayog?

- **Affordable Medications**: Many individuals face high medical costs, especially for branded medications. Upchaar Aayog helps you find cheaper alternatives.
- **Access to Care**: Helps locate nearby **Ayushman Bharat** hospitals and **Jan Aushadhi Kendras** in a few clicks.
- **Empowering Underserved Communities**: Ensuring healthcare accessibility in rural and remote areas where medical resources are often scarce.

## Get Started

1. Visit the [Upchaar Aayog website](https://upchaaraayog.netlify.app/).
2. Search for generic medicine alternatives.
3. Locate nearby Jan Aushadhi Kendras or Ayushman Bharat hospitals.

## Contributing

We welcome contributions! Check out our [open issues](https://github.com/ajaynegi45/upchaar-aayog/issues) or create a new one to suggest improvements.
