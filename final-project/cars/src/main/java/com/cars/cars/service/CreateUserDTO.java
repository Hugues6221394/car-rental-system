package com.cars.cars.service;

import javax.management.relation.Role;

import lombok.Data;

@Data
public class CreateUserDTO {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private Role role;
}