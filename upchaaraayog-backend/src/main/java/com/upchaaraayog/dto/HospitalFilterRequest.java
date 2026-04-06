package com.upchaaraayog.dto;

import com.upchaaraayog.entities.HospitalType;
import jakarta.validation.constraints.NotBlank;

import java.util.List;



/**
 * Immutable filter request record.

 * 'state' is mandatory — validated at the controller layer with @Valid.
 * All other filters are optional (null = skip that filter).

 * schemeCodes: list of scheme codes e.g. ["PMJAY", "CGHS"] Hospital must match AT LEAST ONE (OR logic within group)
 * specialityIds: list of speciality PKs Hospital must match AT LEAST ONE (OR logic within group)
 */
public record HospitalFilterRequest(
        @NotBlank(message = "State is required")
        String        state,          // MANDATORY — always selected first by user
        String        district,       // optional
        HospitalType  hospitalType,   // optional — PUBLIC / GOVT / PRIVATE
        List<Integer> specialityIds,  // optional — filter hospitals having ANY of these specialities
        List<String>  schemeCodes     // optional — filter hospitals enrolled in ANY of these schemes
        //            e.g., ["PMJAY", "CGHS"]
) {

    /** Convenience: true if no optional filters are active */
    public boolean hasSpecialityFilter() {
        return specialityIds != null && !specialityIds.isEmpty();
    }

    public boolean hasSchemeFilter() {
        return schemeCodes != null && !schemeCodes.isEmpty();
    }
}
