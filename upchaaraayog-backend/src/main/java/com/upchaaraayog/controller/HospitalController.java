package com.upchaaraayog.controller;

import com.upchaaraayog.dto.HospitalDTO;
import com.upchaaraayog.dto.HospitalFilterRequest;
import com.upchaaraayog.service.HospitalService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for hospital listing and search.
 *
 * WHY @Validated ON THE CLASS:
 *   Jakarta Validation annotations on @RequestParam and @PathVariable parameters
 *   (@Min, @Max, @NotBlank, etc.) are NOT processed by default in Spring MVC.
 *   They require method-level validation, which is enabled only when @Validated
 *   is present on the controller class. This triggers Spring's
 *   MethodValidationPostProcessor to intercept the call.
 *
 *   WITHOUT @Validated: @Min(0), @Max(50) on 'page' and 'size' are silently
 *   ignored. A caller can pass size=100000 and get 100,000 hospital rows in one
 *   response, potentially exhausting JVM heap and DB connection pool under load.
 *
 *   When validation fails with @Validated + @RequestParam, the thrown exception
 *   is HandlerMethodValidationException (Spring MVC 6.1+, wrapping
 *   ConstraintViolationException), handled by GlobalExceptionHandler.
 *
 * WHY ResponseEntity<Page<HospitalDTO>>:
 *   Returning Page<T> directly works, but ResponseEntity gives us explicit
 *   control over HTTP status codes without requiring changes here — we can add
 *   caching headers, ETags, or content negotiation later without touching the
 *   method signature.
 *
 * WHY POST /search (not GET):
 *   The filter payload includes List<Integer> specialityIds and List<String>
 *   schemeCodes. Encoding these as GET query parameters works but produces URLs
 *   like ?specialityIds=1&specialityIds=2&schemeCodes=PMJAY&schemeCodes=CGHS
 *   which break bookmarking, are harder to read, and have URL length limits.
 *   POST with a JSON body is cleaner and matches how filter-heavy APIs work
 *   in practice (Elasticsearch, Algolia, etc.).
 */
@RestController
@RequestMapping("/api/v1/hospitals")
@Validated // FIX [Bug 1]: Required for @Min/@Max on @RequestParam to be enforced.
// Without this, pagination constraints are completely ignored at runtime.
public class HospitalController {

    private final HospitalService service;

    /*
     * Constructor injection — preferred over @Autowired field injection.
     * Makes the dependency explicit, enables immutability, and simplifies
     * unit testing (no Spring context needed to construct the controller).
     */
    public HospitalController(HospitalService service) {
        this.service = service;
    }

    /**
     * Search hospitals with filters and pagination.
     *
     * @param request the filter payload (state is mandatory, rest optional)
     * @param page    zero-based page number, validated >= 0
     * @param size    page size, validated 1–50. Max capped at 50 to protect
     *                DB and JVM memory at 1k–2k concurrent users.
     * @return a page of hospital cards matching the filters
     */
    @PostMapping("/search")
    public ResponseEntity<Page<HospitalDTO>> search(
            @Valid @RequestBody HospitalFilterRequest request,
            @RequestParam(defaultValue = "0")  @Min(value = 0,  message = "Page index must be 0 or greater") int page,
            @RequestParam(defaultValue = "10") @Min(value = 1,  message = "Page size must be at least 1")
            @Max(value = 50, message = "Page size must not exceed 50")    int size
    ) {
        Page<HospitalDTO> result = service.listHospitals(request, PageRequest.of(page, size));
        return ResponseEntity.ok(result);
    }
}