package com.cars.cars.service;

import java.util.List;
import java.util.Optional;

import com.cars.cars.model.Role;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cars.cars.model.Notification;
import com.cars.cars.model.User;
import com.cars.cars.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<Notification> getUserNotifications(User user) {
        System.out.println("Getting notifications for user: " + user.getEmail() + ", Role: " + user.getRole());

        if (user.getRole() == Role.ADMIN) {
            List<Notification> adminNotifications = notificationRepository.findAllByOrderByCreatedAtDesc();
            System.out.println("Admin notifications found: " + adminNotifications.size());
            return adminNotifications;
        } else {
            List<Notification> userNotifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
            System.out.println("User notifications found: " + userNotifications.size());
            return userNotifications;
        }
    }

    // Add these methods to your NotificationService.java

    public List<Notification> getAdminNotifications() {
        return notificationRepository.findAllByOrderByCreatedAtDesc();
    }

    public long getAdminUnreadCount() {
        return notificationRepository.countByReadFalse();
    }


    public List<Notification> getNotificationsByType(Notification.NotificationType type) {
        return notificationRepository.findByTypeOrderByCreatedAtDesc(type);
    }

    public Notification createNotification(User user, String title, String message,
                                           Notification.NotificationType type,
                                           Long relatedEntityId, String relatedEntityType,
                                           String metadata) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);
        notification.setCreatedAt(java.time.LocalDateTime.now());
        notification.setRelatedEntityId(relatedEntityId);
        notification.setRelatedEntityType(relatedEntityType);
        notification.setMetadata(metadata);
        return notificationRepository.save(notification);
    }

    // Helper methods for common notification types
    public Notification createUserRegisteredNotification(User newUser) {
        String title = "New User Registration";
        String message = "User " + newUser.getEmail() + " has registered.";
        return createNotification(newUser, title, message,
                Notification.NotificationType.USER_REGISTERED,
                newUser.getId(), "user", null);
    }

    public Notification createReservationNotification(User user, Long reservationId,
                                                      String action, String details) {
        String title = "Reservation " + action;
        String message = "Reservation #" + reservationId + " has been " + action + ". " + details;
        Notification.NotificationType type = action.equals("created") ?
                Notification.NotificationType.RESERVATION_CREATED :
                action.equals("updated") ? Notification.NotificationType.RESERVATION_UPDATED :
                        Notification.NotificationType.RESERVATION_CANCELLED;

        return createNotification(user, title, message, type,
                reservationId, "reservation", details);
    }

    public Notification createPaymentNotification(User user, Long paymentId,
                                                  boolean success, String details) {
        String title = "Payment " + (success ? "Completed" : "Failed");
        String message = "Payment for reservation #" + paymentId + " has " +
                (success ? "been completed successfully." : "failed. " + details);
        Notification.NotificationType type = success ?
                Notification.NotificationType.PAYMENT_COMPLETED :
                Notification.NotificationType.PAYMENT_FAILED;

        return createNotification(user, title, message, type,
                paymentId, "payment", details);
    }

    public void markAsRead(Long notificationId) {
        Optional<Notification> notifOpt = notificationRepository.findById(notificationId);
        notifOpt.ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public void markAllAsRead(User user) {
        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndReadFalse(user);
    }
}