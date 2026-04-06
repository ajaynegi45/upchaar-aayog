package com.upchaaraayog.dto;

import java.util.List;

/**
 * Read-only projection for the hospital listing card.
 * NEVER expose JPA entities directly from controllers — it causes:
 *   - Accidental lazy loading (triggering DB queries during JSON serialization)
 *   - Circular reference serialization errors
 *   - Over-fetching data the client doesn't need
 *
 * Java record (immutable, compact, zero boilerplate — Java 16+)
 */
public record HospitalDTO(
        Long         id,
        String       hospitalCode,
        String       name,
        String       state,
        String       district,
        String       contactNumber,
        String       hospitalType,
        List<String> specialityNames,   // sorted for consistent display
        List<String> schemeNames,       // sorted for consistent display
        boolean      hasConvergence     // true if ANY scheme has convergence enabled
) {


}
