package com.cars.cars.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.cars.cars.model.User;

@Component
public class NotificationSeeder implements CommandLineRunner {

    private final NotificationService notificationService;
    private final UserService userService;

    public NotificationSeeder(NotificationService notificationService, UserService userService) {
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @Override
    public void run(String... args) {
        try {
            // 🔹 Fetch admin by email
            User admin = userService.findByEmailEntity("docworld74@gmail.com");
            if (admin != null) {
                notificationService.createNotification(admin, "Admin Alert", "Welcome Admin to the Car System!", "system", null);
            }

            // 🔹 Fetch normal user by email
            User normalUser = userService.findByEmailEntity("hugues@gmail.com");
            if (normalUser != null) {
                notificationService.createNotification(normalUser, "Welcome!", "Welcome to the Car System.", "system", null);
                notificationService.createNotification(normalUser, "Reservation Update", "Your reservation has been confirmed.", "reservation_update", 1L);
                notificationService.createNotification(normalUser, "Promotion!", "Get 20% off your next rental.", "promotion", null);
            }
        } catch (Exception e) {
            System.err.println("NotificationSeeder failed: " + e.getMessage());
        }
    }
}
