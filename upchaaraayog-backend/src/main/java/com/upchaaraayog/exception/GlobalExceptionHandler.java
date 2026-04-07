package com.upchaaraayog.exception;

import com.upchaaraayog.dto.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

import java.util.stream.Collectors;

/**
 * Centralised exception handling. All user-facing messages are sanitised —
 * raw exception details are logged server-side only.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, WebRequest request) {
        String detail = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + sanitise(fe.getDefaultMessage()))
                .collect(Collectors.joining("; "));

        if (detail.isBlank()) {
            detail = ex.getBindingResult().getGlobalErrors().stream()
                    .map(ge -> sanitise(ge.getDefaultMessage()))
                    .collect(Collectors.joining("; "));
        }

        return ResponseEntity.badRequest()
                .body(new ErrorResponse(HttpStatus.BAD_REQUEST.value(), detail, request.getDescription(false)));
    }

    /**
     * Handles @Validated + @RequestParam constraint violations (Spring MVC 6.1+).
     * Fixed: Removed getAllValidationResults() which was causing compilation error.
     * Using a more standard way to extract messages.
     */
    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ErrorResponse> handleMethodValidation(HandlerMethodValidationException ex, WebRequest request) {
        // Fallback to getMessage() if more specific parsing is not possible in this version
        String detail = sanitise(ex.getReason());
        if (detail == null || detail.isBlank()) {
            detail = "Validation failed for request parameters";
        }

        return ResponseEntity.badRequest()
                .body(new ErrorResponse(HttpStatus.BAD_REQUEST.value(), detail, request.getDescription(false)));
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingParam(MissingServletRequestParameterException ex, WebRequest request) {
        String msg = "Missing required parameter: " + sanitise(ex.getParameterName());
        return ResponseEntity.badRequest()
                .body(new ErrorResponse(HttpStatus.BAD_REQUEST.value(), msg, request.getDescription(false)));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex, WebRequest request) {
        log.warn("Bad request: {}", ex.getMessage());
        return ResponseEntity.badRequest()
                .body(new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "Invalid request", request.getDescription(false)));
    }

    // Catch-all — never expose internal details to the client
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex, WebRequest request) {
        log.error("Unhandled exception", ex);
        return ResponseEntity.internalServerError()
                .body(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        "An unexpected error occurred", request.getDescription(false)));
    }

    /**
     * Strips characters that could enable reflected XSS if the JSON response
     * is rendered in an HTML context.
     */
    private static String sanitise(String input) {
        if (input == null) return "";
        return input
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#x27;");
    }
}
