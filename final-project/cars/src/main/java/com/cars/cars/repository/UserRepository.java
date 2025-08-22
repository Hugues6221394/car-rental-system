package com.cars.cars.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cars.cars.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);    
    boolean existsByEmail(String email);
    Optional<User> findByResetPasswordToken(String token);
}