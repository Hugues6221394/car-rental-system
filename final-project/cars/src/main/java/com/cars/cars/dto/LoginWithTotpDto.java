package com.cars.cars.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginWithTotpDto {
    private String email;
    private char[] password;
    private String totpCode;
}
