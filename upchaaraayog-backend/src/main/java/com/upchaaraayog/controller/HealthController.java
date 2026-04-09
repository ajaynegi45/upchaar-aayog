package com.upchaaraayog.controller;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@CrossOrigin(origins = "*") // Fixes "Failed to fetch" on frontend
public class HealthController {

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}
