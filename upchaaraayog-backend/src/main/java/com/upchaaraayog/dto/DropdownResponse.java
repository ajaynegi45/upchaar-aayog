package com.upchaaraayog.dto;

/**
 * Carries a single code/name pair for dropdown responses
 * (schemes, specialities, hospital types).
 *
 * Frontend caches these — they rarely change.
 */
public record DropdownResponse(String code, String name) {}