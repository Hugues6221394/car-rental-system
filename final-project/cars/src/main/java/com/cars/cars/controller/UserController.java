package com.cars.cars.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.cars.cars.model.User;
import com.cars.cars.service.ApiResponse;
import com.cars.cars.service.UserService;
import com.cars.cars.model.Role;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/users", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.success(createdUser, "User created successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.error("Internal server error"));
        }
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok()
                           .contentType(MediaType.APPLICATION_JSON)
                           .body(ApiResponse.success(users, "Users retrieved successfully"));
    }

    @GetMapping(
        value = "/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok()
                               .contentType(MediaType.APPLICATION_JSON)
                               .body(ApiResponse.success(user, "User retrieved successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound()
                               .build();
        }
    }

    @PutMapping(
        value = "/{id}",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<User>> updateUser(
            @PathVariable Long id,
            @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok()
                               .contentType(MediaType.APPLICATION_JSON)
                               .body(ApiResponse.success(updatedUser, "User updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                               .contentType(MediaType.APPLICATION_JSON)
                               .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping(
        value = "/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok()
                               .contentType(MediaType.APPLICATION_JSON)
                               .body(ApiResponse.success(null, "User deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound()
                               .build();
        }
    } 
    
    // Add this new endpoint to UserController.java
// Update the UserController.java
@PatchMapping(
    value = "/{id}/role",
    consumes = MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE
)
public ResponseEntity<ApiResponse<User>> updateUserRole(
        @PathVariable Long id,
        @RequestBody Map<String, String> request) {
    try {
        String roleString = request.get("role");
        Role role = Role.valueOf(roleString.toUpperCase()); // Convert string to enum
        
        User updatedUser = userService.updateUserRole(id, role);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(ApiResponse.success(updatedUser, "User role updated successfully"));
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(ApiResponse.error("Invalid role specified"));
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(ApiResponse.error(e.getMessage()));
    }
}
}


