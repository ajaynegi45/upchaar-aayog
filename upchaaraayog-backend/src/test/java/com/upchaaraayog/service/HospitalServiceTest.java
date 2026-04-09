package com.upchaaraayog.service;

import com.upchaaraayog.dto.DropdownResponse;
import com.upchaaraayog.dto.HospitalDTO;
import com.upchaaraayog.dto.HospitalFilterRequest;
import com.upchaaraayog.entities.HospitalType;
import com.upchaaraayog.repository.HospitalReadRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class HospitalServiceTest {

    @Mock
    private HospitalReadRepository readRepository;

    @InjectMocks
    private HospitalService hospitalService;

    @Test
    void listHospitalsDelegatesToReadRepository() {
        var filter = new HospitalFilterRequest("Delhi", "New Delhi", HospitalType.PRIVATE, List.of(1), List.of("PMJAY"));
        var pageable = PageRequest.of(0, 10);
        var expected = new PageImpl<>(List.of(new HospitalDTO(
                1L, "H1", "Hospital", "Delhi", "New Delhi", "999", "PRIVATE", List.of("Cardiology"), List.of("PMJAY"), true
        )));

        when(readRepository.findHospitals(filter, pageable)).thenReturn(expected);

        var actual = hospitalService.listHospitals(filter, pageable);

        assertThat(actual).isSameAs(expected);
        verify(readRepository).findHospitals(filter, pageable);
    }

    @Test
    void metadataLookupsDelegateToReadRepository() {
        when(readRepository.findAllStates()).thenReturn(List.of("Delhi"));
        when(readRepository.findDistrictsByState("Delhi")).thenReturn(List.of("New Delhi"));
        when(readRepository.findSchemes("Delhi", "New Delhi")).thenReturn(List.of(new DropdownResponse("PMJAY", "PMJAY")));
        when(readRepository.findSpecialities("Delhi", "New Delhi")).thenReturn(List.of(new DropdownResponse("CARD", "Cardiology")));
        when(readRepository.findHospitalTypes("Delhi", "New Delhi")).thenReturn(List.of("PRIVATE"));

        assertThat(hospitalService.getStates()).containsExactly("Delhi");
        assertThat(hospitalService.getDistricts("Delhi")).containsExactly("New Delhi");
        assertThat(hospitalService.getSchemes("Delhi", "New Delhi")).containsExactly(new DropdownResponse("PMJAY", "PMJAY"));
        assertThat(hospitalService.getSpecialities("Delhi", "New Delhi")).containsExactly(new DropdownResponse("CARD", "Cardiology"));
        assertThat(hospitalService.getHospitalTypes("Delhi", "New Delhi")).containsExactly("PRIVATE");

        verify(readRepository).findAllStates();
        verify(readRepository).findDistrictsByState("Delhi");
        verify(readRepository).findSchemes("Delhi", "New Delhi");
        verify(readRepository).findSpecialities("Delhi", "New Delhi");
        verify(readRepository).findHospitalTypes("Delhi", "New Delhi");
    }
}
