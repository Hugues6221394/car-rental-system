package com.cars.cars.dto;

import com.cars.cars.model.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UserDto {
    
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private char[] password;
    private Role role;
    private String token;
}
