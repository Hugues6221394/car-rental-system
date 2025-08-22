package com.cars.cars.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import com.cars.cars.model.Notification;
import com.cars.cars.model.User;
import com.cars.cars.service.NotificationService;
import com.cars.cars.service.UserService; // assuming you have this to get currently logged-in user

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping
    public List<Notification> getUserNotifications() {
        User user = userService.getCurrentUser(); // implement this method in your UserService
       return notificationService.getUserNotifications(user);
    }

    @PatchMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }

    @PatchMapping("/read-all")
    public void markAllAsRead() {
        User user = userService.getCurrentUser();
        notificationService.markAllAsRead(user);
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
    }
}
