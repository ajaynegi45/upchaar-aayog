package com.upchaaraayog.dto;

import com.upchaaraayog.entities.HospitalType;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class HospitalFilterRequestTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void nullFilterListsAreNormalisedToEmptyLists() {
        var request = new HospitalFilterRequest("Delhi", "New Delhi", HospitalType.PRIVATE, null, null);

        assertThat(request.specialityIds()).isEmpty();
        assertThat(request.schemeCodes()).isEmpty();
        assertThat(request.hasSpecialityFilter()).isFalse();
        assertThat(request.hasSchemeFilter()).isFalse();
    }

    @Test
    void filterFlagsReflectListContents() {
        var request = new HospitalFilterRequest("Delhi", "New Delhi", HospitalType.GOVT, List.of(4, 9), List.of("PMJAY"));

        assertThat(request.hasSpecialityFilter()).isTrue();
        assertThat(request.hasSchemeFilter()).isTrue();
    }

    @Test
    void blankStateViolatesValidationConstraint() {
        var request = new HospitalFilterRequest("   ", null, null, null, null);

        var violations = validator.validate(request);

        assertThat(violations).hasSize(1);
        assertThat(violations.iterator().next().getMessage()).isEqualTo("State is required");
    }
}
