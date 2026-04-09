package com.upchaaraayog.dto;

import java.time.LocalDateTime;

/**
 * Immutable error response returned by GlobalExceptionHandler.
 * restored 'path' field for backward compatibility with existing clients.
 */
public record ErrorResponse(int status, String message, LocalDateTime timestamp, String path) {

    public ErrorResponse(int status, String message, String path) {
        this(status, message, LocalDateTime.now(), path);
    }
}
