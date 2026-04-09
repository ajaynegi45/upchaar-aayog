package com.upchaaraayog.controller;

import com.upchaaraayog.dto.JanAushadhiKendraDTO;
import com.upchaaraayog.exception.GlobalExceptionHandler;
import com.upchaaraayog.service.JanAushadhiService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(JanAushadhiController.class)
@Import(GlobalExceptionHandler.class)
class JanAushadhiControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JanAushadhiService janAushadhiService;

    @Test
    void getJanAushadhiKendraReturnsPagedResultsForStateAndDistrict() throws Exception {
        var dto = new JanAushadhiKendraDTO();
        dto.setKendraCode("PMBJK-1");
        dto.setKendraName("Aushadhi Kendra");
        dto.setState("Delhi");
        dto.setDistrict("New Delhi");
        dto.setPincode(110001);
        dto.setAddress("Connaught Place");

        when(janAushadhiService.getJanAushadhiKendra("Delhi", "New Delhi", null, (short) 0, (short) 5))
                .thenReturn(new PageImpl<>(List.of(dto), PageRequest.of(0, 5), 1));

        mockMvc.perform(get("/api/v1/jan-aushadhi-kendra")
                        .queryParam("state", "Delhi")
                        .queryParam("district", "New Delhi")
                        .queryParam("pageNumber", "0")
                        .queryParam("pageSize", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].kendraCode").value("PMBJK-1"))
                .andExpect(jsonPath("$.content[0].address").value("Connaught Place"))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(janAushadhiService).getJanAushadhiKendra("Delhi", "New Delhi", null, (short) 0, (short) 5);
    }

    @Test
    void getJanAushadhiKendraSupportsPincodeSearch() throws Exception {
        when(janAushadhiService.getJanAushadhiKendra(null, null, 110001, (short) 0, (short) 2))
                .thenReturn(new PageImpl<>(List.of(), PageRequest.of(0, 2), 0));

        mockMvc.perform(get("/api/v1/jan-aushadhi-kendra")
                        .queryParam("pincode", "110001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.totalElements").value(0));

        verify(janAushadhiService).getJanAushadhiKendra(null, null, 110001, (short) 0, (short) 2);
    }

    @Test
    void invalidServiceInputIsReturnedAsBadRequest() throws Exception {
        when(janAushadhiService.getJanAushadhiKendra(null, null, null, (short) 0, (short) 2))
                .thenThrow(new IllegalArgumentException("Either a valid 6-digit Pincode or both State and District must be provided."));

        mockMvc.perform(get("/api/v1/jan-aushadhi-kendra"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Invalid request"))
                .andExpect(jsonPath("$.path").value("uri=/api/v1/jan-aushadhi-kendra"));
    }

    @Test
    void getStatesReturnsRepositoryBackedList() throws Exception {
        when(janAushadhiService.getStates()).thenReturn(List.of("Delhi", "Punjab"));

        mockMvc.perform(get("/api/v1/states"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("Delhi"))
                .andExpect(jsonPath("$[1]").value("Punjab"));

        verify(janAushadhiService).getStates();
    }

    @Test
    void getDistrictsReturnsStateSpecificDistricts() throws Exception {
        when(janAushadhiService.getDistricts("Delhi")).thenReturn(List.of("New Delhi", "South Delhi"));

        mockMvc.perform(get("/api/v1/states/Delhi/districts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("New Delhi"))
                .andExpect(jsonPath("$[1]").value("South Delhi"));

        verify(janAushadhiService).getDistricts("Delhi");
    }
}
