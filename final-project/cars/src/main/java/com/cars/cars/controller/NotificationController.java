package com.cars.cars.controller;

import java.util.List;

import com.cars.cars.repository.NotificationRepository;
import com.cars.cars.repository.PaymentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import com.cars.cars.model.Notification;
import com.cars.cars.model.User;
import com.cars.cars.service.NotificationService;
import com.cars.cars.service.UserService;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;
    private final NotificationRepository  notificationRepository;

    @GetMapping
    public List<Notification> getUserNotifications() {
        User user = userService.getCurrentUser();
        return notificationService.getUserNotifications(user);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Notification>> getAdminNotifications() {
        try {
            List<Notification> notifications = notificationService.getAdminNotifications();
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/admin/unread-count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getAdminUnreadCount() {
        try {
            long count = notificationService.getAdminUnreadCount();
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Notification> getNotificationsByType(@PathVariable String type) {
        return notificationService.getNotificationsByType(Notification.NotificationType.valueOf(type));
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

    @DeleteMapping("/admin/clear-all")
    @PreAuthorize("hasRole('ADMIN')")
    public void clearAllNotifications() {
        notificationRepository.deleteAll();
    }
}