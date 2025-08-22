package com.cars.cars.controller;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cars.cars.config.UserAuthProvider;
import com.cars.cars.dto.CredentialsDto;
import com.cars.cars.dto.ForgotPasswordDto;
import com.cars.cars.dto.LoginWithTotpDto;
import com.cars.cars.dto.ResetPasswordDto;
import com.cars.cars.dto.SignUpDto;
import com.cars.cars.dto.TotpSetupDto;
import com.cars.cars.dto.UserDto;
import com.cars.cars.service.ApiResponse;
import com.cars.cars.service.UserService;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping(value = "/api/auth", produces = MediaType.APPLICATION_JSON_VALUE)
@RestController
public class AuthController {

    private final UserService userService;
    private final UserAuthProvider userAuthProvider;

    @PostMapping("/signin")
    public ResponseEntity<?> login(@RequestBody CredentialsDto credentialsDto) {
        try {
            UserDto user = userService.login(credentialsDto);
            if (userService.isTotpEnabled(user.getEmail())) {
                Map<String, Object> totpResponse = new HashMap<>();
                totpResponse.put("requiresTotp", true);
                totpResponse.put("email", user.getEmail());
                totpResponse.put("totpSetupRequired", !userService.isTotpVerified(user.getEmail()));
                //totpResponse.put("tempToken", userAuthProvider.createTempToken(user.getEmail()));
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(ApiResponse.success(totpResponse, "TOTP_REQUIRED"));
            } else {
                user.setToken(userAuthProvider.createToken(user.getEmail()));
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(ApiResponse.success(user, "Login successful"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/signin-totp")
    public ResponseEntity<?> loginWithTotp(@RequestBody LoginWithTotpDto loginDto) {
        try {
            UserDto user = userService.loginWithTotp(loginDto);
            user.setToken(userAuthProvider.createToken(user.getEmail()));
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.success(user, "Login successful"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@RequestBody SignUpDto signUpDto) {
        try {
            UserDto user = userService.register(signUpDto);
            TotpSetupDto totpSetup = userService.setupTotp(signUpDto.getEmail());
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("totpSetup", totpSetup);
            return ResponseEntity.created(URI.create("/users/" + user.getId()))
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.success(response, "User registered successfully, TOTP setup required"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/totp/setup")
    public ResponseEntity<ApiResponse<TotpSetupDto>> setupTotp(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            TotpSetupDto totpSetup = userService.setupTotp(email);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.success(totpSetup, "TOTP setup initiated"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/totp/verify")
    public ResponseEntity<ApiResponse<Boolean>> verifyTotp(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String code = request.get("code");
            boolean isValid = userService.verifyAndEnableTotp(email, code);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.success(isValid, isValid ? "TOTP verified" : "Invalid TOTP code"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody ForgotPasswordDto forgotPasswordDto) {
        try {
            userService.requestPasswordReset(forgotPasswordDto);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.success(null, "Password reset email sent"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody ResetPasswordDto resetPasswordDto) {
        try {
            userService.resetPassword(resetPasswordDto);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.success(null, "Password reset successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}