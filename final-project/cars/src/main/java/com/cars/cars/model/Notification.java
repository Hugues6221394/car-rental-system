package com.cars.cars.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "notifications")
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    public enum NotificationType {
        USER_REGISTERED,
        RESERVATION_CREATED,
        RESERVATION_UPDATED,
        RESERVATION_CANCELLED,
        PAYMENT_COMPLETED,
        PAYMENT_FAILED,
        SYSTEM_ALERT,
        PROMOTION
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    private String title;
    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private boolean read = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    private Long relatedEntityId; // Can be reservationId, userId, paymentId, etc.

    private String relatedEntityType; // "reservation", "user", "payment"

    // Additional metadata
    private String metadata; // JSON string for additional data
}