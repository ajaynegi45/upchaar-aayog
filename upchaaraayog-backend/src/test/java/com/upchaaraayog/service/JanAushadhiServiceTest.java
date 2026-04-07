package com.upchaaraayog.service;

import com.upchaaraayog.entities.JanAushadhiKendra;
import com.upchaaraayog.repository.JanAushadhiRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JanAushadhiServiceTest {

    @Mock
    private JanAushadhiRepository janAushadhiRepository;

    @InjectMocks
    private JanAushadhiService janAushadhiService;

    @Test
    void pincodeSearchUsesDedicatedRepositoryMethodAndMapsDto() {
        var entity = buildEntity("PMBJK001", "Nearest Kendra", "Delhi", "New Delhi", 110001, "Address 1");
        when(janAushadhiRepository.findByPincode(110001, PageRequest.of(0, 5)))
                .thenReturn(new PageImpl<>(List.of(entity), PageRequest.of(0, 5), 1));

        var page = janAushadhiService.getJanAushadhiKendra(null, null, 110001, (short) 0, (short) 5);

        assertThat(page.getContent()).singleElement().satisfies(dto -> {
            assertThat(dto.getKendraCode()).isEqualTo("PMBJK001");
            assertThat(dto.getKendraName()).isEqualTo("Nearest Kendra");
            assertThat(dto.getState()).isEqualTo("Delhi");
            assertThat(dto.getDistrict()).isEqualTo("New Delhi");
            assertThat(dto.getPincode()).isEqualTo(110001);
            assertThat(dto.getAddress()).isEqualTo("Address 1");
        });

        verify(janAushadhiRepository).findByPincode(110001, PageRequest.of(0, 5));
        verify(janAushadhiRepository, never()).findByStateAndDistrict(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any());
    }

    @Test
    void stateAndDistrictSearchUsesLocationRepositoryMethod() {
        var entity = buildEntity("PMBJK002", "District Kendra", "Punjab", "Ludhiana", 141001, "Address 2");
        when(janAushadhiRepository.findByStateAndDistrict("Punjab", "Ludhiana", PageRequest.of(1, 3)))
                .thenReturn(new PageImpl<>(List.of(entity), PageRequest.of(1, 3), 4));

        var page = janAushadhiService.getJanAushadhiKendra("Punjab", "Ludhiana", null, (short) 1, (short) 3);

        assertThat(page.getTotalElements()).isEqualTo(4);
        assertThat(page.getContent()).extracting("kendraCode").containsExactly("PMBJK002");

        verify(janAushadhiRepository).findByStateAndDistrict("Punjab", "Ludhiana", PageRequest.of(1, 3));
        verify(janAushadhiRepository, never()).findByPincode(org.mockito.ArgumentMatchers.anyInt(), org.mockito.ArgumentMatchers.any());
    }

    @Test
    void invalidLocationInputIsRejectedEarly() {
        assertThatThrownBy(() -> janAushadhiService.getJanAushadhiKendra("Delhi", null, 99999, (short) 0, (short) 2))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Either a valid 6-digit Pincode or both State and District must be provided.");

        verifyNoMoreInteractions(janAushadhiRepository);
    }

    @Test
    void metadataMethodsDelegateToRepository() {
        when(janAushadhiRepository.findAllStates()).thenReturn(List.of("Delhi", "Punjab"));
        when(janAushadhiRepository.findDistrictsByStateIgnoreCase("Delhi")).thenReturn(List.of("New Delhi", "South Delhi"));

        assertThat(janAushadhiService.getStates()).containsExactly("Delhi", "Punjab");
        assertThat(janAushadhiService.getDistricts("Delhi")).containsExactly("New Delhi", "South Delhi");

        verify(janAushadhiRepository).findAllStates();
        verify(janAushadhiRepository).findDistrictsByStateIgnoreCase("Delhi");
    }

    private static JanAushadhiKendra buildEntity(
            String code,
            String name,
            String state,
            String district,
            int pincode,
            String address
    ) {
        var entity = new JanAushadhiKendra();
        entity.setKendraCode(code);
        entity.setKendraName(name);
        entity.setState(state);
        entity.setDistrict(district);
        entity.setPincode(pincode);
        entity.setAddress(address);
        return entity;
    }
}
