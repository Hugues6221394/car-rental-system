//package com.cars.cars.controller;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@RestController
//public class HomeController {
//
//    @GetMapping("/")
//    public ResponseEntity<Map<String, String>> home() {
//        Map<String, String> response = new HashMap<>();
//        response.put("message", "Welcome to Cars App API");
//        response.put("status", "OK");
//        response.put("version", "1.0.0");
//        response.put("endpoints",
//                "Available endpoints: /api/auth/signin, /api/auth/signup, /api/cars, etc.");
//        return ResponseEntity.ok(response);
//    }
//
//    @GetMapping("/home")
//    public ResponseEntity<Map<String, String>> homePage() {
//        Map<String, String> response = new HashMap<>();
//        response.put("message", "Cars App - Car Rental System");
//        response.put("description", "A comprehensive car rental management system");
//        response.put("features", "User authentication, car management, reservations, payments");
//        return ResponseEntity.ok(response);
//    }
//}