package com.upchaaraayog.dto;

import java.util.List;

/**
 * Read-only projection for a hospital card.
 */
public record HospitalDTO(
        Long         id,
        String       hospitalCode,
        String       name,
        String       state,
        String       district,
        String       contactNumber,
        String       hospitalType,
        List<String> specialityNames,
        List<String> schemeNames,
        boolean      hasConvergence
) {}
