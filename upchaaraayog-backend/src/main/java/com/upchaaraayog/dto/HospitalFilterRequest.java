package com.upchaaraayog.dto;

import com.upchaaraayog.entities.HospitalType;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Collections;

/**
 * Search/Filter request for hospitals.
 */
public record HospitalFilterRequest(
        @NotBlank(message = "State is required")
        String        state,
        String        district,
        HospitalType  hospitalType,
        List<Integer> specialityIds,
        List<String>  schemeCodes
) {
    public HospitalFilterRequest {
        if (specialityIds == null) specialityIds = Collections.emptyList();
        if (schemeCodes == null) schemeCodes = Collections.emptyList();
    }

    public boolean hasSpecialityFilter() {
        return specialityIds != null && !specialityIds.isEmpty();
    }

    public boolean hasSchemeFilter() {
        return schemeCodes != null && !schemeCodes.isEmpty();
    }
}
