package com.cars.cars.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO for TOTP setup response
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TotpSetupDto {
    private String secret;
    private String qrCodeDataUri;
    private String[] backupCodes; 
}



