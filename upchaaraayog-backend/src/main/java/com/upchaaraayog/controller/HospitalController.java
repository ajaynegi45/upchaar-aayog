package com.upchaaraayog.controller;

import com.upchaaraayog.dto.DropdownResponse;
import com.upchaaraayog.dto.HospitalDTO;
import com.upchaaraayog.dto.HospitalFilterRequest;
import com.upchaaraayog.service.HospitalService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * REST controller for hospital listing and metadata dropdowns.
 */
@RestController
@RequestMapping("/api/v1/hospitals")
@Validated
public class HospitalController {

    private final HospitalService service;

    public HospitalController(HospitalService service) {
        this.service = service;
    }

    @PostMapping("/search")
    public ResponseEntity<Page<HospitalDTO>> search(
            @Valid @RequestBody HospitalFilterRequest request,
            @RequestParam(defaultValue = "0")  @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(50) int size
    ) {
        return ResponseEntity.ok(service.listHospitals(request, PageRequest.of(page, size)));
    }

    @GetMapping("/states")
    public ResponseEntity<List<String>> getStates() {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS))
                .body(service.getStates());
    }

    @GetMapping("/districts")
    public ResponseEntity<List<String>> getDistricts(@RequestParam String state) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS))
                .body(service.getDistricts(state));
    }

    @GetMapping("/schemes")
    public ResponseEntity<List<DropdownResponse>> getSchemes() {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(24, TimeUnit.HOURS))
                .body(service.getSchemes());
    }

    @GetMapping("/specialities")
    public ResponseEntity<List<DropdownResponse>> getSpecialities() {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(24, TimeUnit.HOURS))
                .body(service.getSpecialities());
    }

    @GetMapping("/types")
    public ResponseEntity<List<String>> getHospitalTypes() {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(24, TimeUnit.HOURS))
                .body(service.getHospitalTypes());
    }
}