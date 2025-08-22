package com.cars.cars.controller;

import com.cars.cars.dto.TotpSetupDto;
import com.cars.cars.dto.TotpStatusDto;
import com.cars.cars.dto.TotpVerificationDto;
import com.cars.cars.service.ApiResponse;
import com.cars.cars.service.TotpService;
import com.cars.cars.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/totp", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class TotpController {

    private final TotpService totpService;
    private final UserService userService;

    @PostMapping("/setup")
    public ResponseEntity<ApiResponse<TotpSetupDto>> setupTotp() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            TotpSetupDto setup = userService.setupTotp(email);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.success(setup, "TOTP setup initiated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<String>> verifyTotp(@RequestBody TotpVerificationDto verification) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            boolean verified = userService.verifyAndEnableTotp(email, verification.getCode());

            if (verified) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(ApiResponse.success("TOTP enabled successfully", "TOTP has been enabled for your account"));
            } else {
                return ResponseEntity.badRequest()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(ApiResponse.error("Invalid TOTP code"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Disable TOTP
     */
    @PostMapping("/disable")
    public ResponseEntity<ApiResponse<String>> disableTotp(@RequestBody TotpVerificationDto verification) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            boolean disabled = userService.disableTotp(email, verification.getCode());

            if (disabled) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(ApiResponse.success("TOTP disabled successfully", "TOTP has been disabled for your account"));
            } else {
                return ResponseEntity.badRequest()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(ApiResponse.error("Invalid TOTP code"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Get TOTP status
     */
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<TotpStatusDto>> getTotpStatus() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();

            TotpStatusDto status = userService.getTotpStatus(email);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.success(status, "TOTP status retrieved"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}