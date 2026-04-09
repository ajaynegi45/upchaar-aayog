package com.upchaaraayog.controller;

import com.upchaaraayog.dto.JanAushadhiKendraDTO;
import com.upchaaraayog.service.JanAushadhiService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*") // For development, allow all. In production, specify frontend URL.
public class JanAushadhiController {

    private final JanAushadhiService janAushadhiService;
    public JanAushadhiController(JanAushadhiService janAushadhiService) {
        this.janAushadhiService = janAushadhiService;
    }


    @GetMapping("/jan-aushadhi-kendra")
    public Page<JanAushadhiKendraDTO> getJanAushadhiKendra(
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) Integer pincode,

            @RequestParam(required = false, defaultValue = "0") short pageNumber,
            @RequestParam(required = false, defaultValue = "2") short pageSize

    ) {
        return janAushadhiService.getJanAushadhiKendra(state, district, pincode, pageNumber, pageSize);
    }


    @GetMapping("/states")
    public List<String> getStates() {
        return janAushadhiService.getStates();
    }

    @GetMapping("/states/{stateName}/districts")
    public List<String> getDistricts(@PathVariable String stateName) {
        return janAushadhiService.getDistricts(stateName);
    }

}
