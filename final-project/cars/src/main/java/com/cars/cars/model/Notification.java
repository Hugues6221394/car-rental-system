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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference // 👈 child side
    private User user;


    private String title;
    private String message;

    private String type; // e.g., "system", "reservation_update", "promotion"

    private boolean read = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    private Long relatedReservationId; // optional
}
