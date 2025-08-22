package com.cars.cars.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cars.cars.model.User;

// In UserService.java, add this method to the repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByResetPasswordToken(String token);

    // Add case-insensitive check
    boolean existsByEmailIgnoreCase(String email);
}