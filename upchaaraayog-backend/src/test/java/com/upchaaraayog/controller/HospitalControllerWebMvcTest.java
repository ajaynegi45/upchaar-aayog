package com.upchaaraayog.controller;
import com.upchaaraayog.dto.DropdownResponse;
import com.upchaaraayog.dto.HospitalDTO;
import com.upchaaraayog.dto.HospitalFilterRequest;
import com.upchaaraayog.entities.HospitalType;
import com.upchaaraayog.exception.GlobalExceptionHandler;
import com.upchaaraayog.service.HospitalService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(HospitalController.class)
@Import(GlobalExceptionHandler.class)
class HospitalControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private HospitalService hospitalService;

    @Test
    void searchReturnsPagedHospitalResults() throws Exception {
        var request = new HospitalFilterRequest(
                "NCT OF Delhi",
                "NEW DELHI",
                HospitalType.PRIVATE,
                List.of(7, 9),
                List.of("PMJAY")
        );
        var pageRequest = PageRequest.of(1, 20);
        var page = new PageImpl<>(
                List.of(new HospitalDTO(
                        11L,
                        "HOSP-11",
                        "AIIMS Delhi",
                        "NCT OF Delhi",
                        "NEW DELHI",
                        "9999999999",
                        "PRIVATE",
                        List.of("Cardiology", "Neurology"),
                        List.of("PMJAY"),
                        true
                )),
                pageRequest,
                31
        );

        when(hospitalService.listHospitals(eq(request), eq(pageRequest))).thenReturn(page);

        String requestJson = """
                {
                  "state": "NCT OF Delhi",
                  "district": "NEW DELHI",
                  "hospitalType": "PRIVATE",
                  "specialityIds": [7, 9],
                  "schemeCodes": ["PMJAY"]
                }
                """;

        mockMvc.perform(post("/api/v1/hospitals/search")
                        .queryParam("page", "1")
                        .queryParam("size", "20")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].hospitalCode").value("HOSP-11"))
                .andExpect(jsonPath("$.content[0].specialityNames[1]").value("Neurology"))
                .andExpect(jsonPath("$.content[0].hasConvergence").value(true))
                .andExpect(jsonPath("$.totalElements").value(21))
                .andExpect(jsonPath("$.size").value(20))
                .andExpect(jsonPath("$.number").value(1));

        verify(hospitalService).listHospitals(eq(request), eq(pageRequest));
    }

    @Test
    void searchRejectsBlankState() throws Exception {
        String invalidRequestJson = """
                {
                  "state": "   ",
                  "district": null,
                  "hospitalType": null,
                  "specialityIds": null,
                  "schemeCodes": null
                }
                """;

        mockMvc.perform(post("/api/v1/hospitals/search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidRequestJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message", containsString("state: State is required")))
                .andExpect(jsonPath("$.path").value("uri=/api/v1/hospitals/search"));

        verifyNoInteractions(hospitalService);
    }

    @Test
    void searchRejectsOversizedPageRequests() throws Exception {
        String requestJson = """
                {
                  "state": "NCT OF Delhi",
                  "district": null,
                  "hospitalType": null,
                  "specialityIds": [],
                  "schemeCodes": []
                }
                """;

        mockMvc.perform(post("/api/v1/hospitals/search")
                        .queryParam("size", "51")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").isNotEmpty());

        verifyNoInteractions(hospitalService);
    }

    @Test
    void getStatesAddsCacheHeaders() throws Exception {
        when(hospitalService.getStates()).thenReturn(List.of("Delhi", "Maharashtra"));

        mockMvc.perform(get("/api/v1/hospitals/states"))
                .andExpect(status().isOk())
                .andExpect(header().string("Cache-Control", containsString("max-age=3600")))
                .andExpect(jsonPath("$[0]").value("Delhi"))
                .andExpect(jsonPath("$[1]").value("Maharashtra"));

        verify(hospitalService).getStates();
    }

    @Test
    void getDistrictsRequiresStateParameter() throws Exception {
        mockMvc.perform(get("/api/v1/hospitals/districts"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Missing required parameter: state"));

        verifyNoInteractions(hospitalService);
    }

    @Test
    void getSchemesPassesOptionalDistrict() throws Exception {
        when(hospitalService.getSchemes("NCT OF Delhi", null))
                .thenReturn(List.of(new DropdownResponse("PMJAY", "Pradhan Mantri Jan Arogya Yojana")));

        mockMvc.perform(get("/api/v1/hospitals/schemes").queryParam("state", "NCT OF Delhi"))
                .andExpect(status().isOk())
                .andExpect(header().string("Cache-Control", containsString("max-age=86400")))
                .andExpect(jsonPath("$[0].code").value("PMJAY"))
                .andExpect(jsonPath("$[0].name").value("Pradhan Mantri Jan Arogya Yojana"));

        verify(hospitalService).getSchemes("NCT OF Delhi", null);
    }

    @Test
    void unexpectedErrorsAreSanitised() throws Exception {
        when(hospitalService.getStates()).thenThrow(new RuntimeException("database unavailable"));

        mockMvc.perform(get("/api/v1/hospitals/states"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status").value(500))
                .andExpect(jsonPath("$.message").value("An unexpected error occurred"))
                .andExpect(jsonPath("$.path").value("uri=/api/v1/hospitals/states"));
    }
}
