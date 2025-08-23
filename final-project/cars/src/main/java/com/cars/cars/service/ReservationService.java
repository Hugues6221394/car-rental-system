package com.cars.cars.service;

import com.cars.cars.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cars.cars.repository.ReservationRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final CarService carService;
    private final UserService userService;
    private final NotificationService notificationService;

    @Transactional
    public Reservation createReservation(Reservation reservation) {
        // For debugging
        System.out.println("Received start date: " + reservation.getStartDate());
        System.out.println("Received end date: " + reservation.getEndDate());
        
        // Normalize dates to start of day and end of day
        LocalDateTime normalizedStartDate = reservation.getStartDate().toLocalDate().atStartOfDay();
        LocalDateTime normalizedEndDate = reservation.getEndDate().toLocalDate().atTime(LocalTime.MAX);
        
        // For debugging
        System.out.println("Normalized start date: " + normalizedStartDate);
        System.out.println("Normalized end date: " + normalizedEndDate);
        
        // Update reservation with normalized dates
        reservation.setStartDate(normalizedStartDate);
        reservation.setEndDate(normalizedEndDate);
        
        // Validate dates - using start of current day for comparison
        LocalDateTime currentDayStart = LocalDate.now().atStartOfDay();
        System.out.println("Current day start: " + currentDayStart);
        
        if (normalizedStartDate.isBefore(currentDayStart)) {
            throw new RuntimeException("Start date cannot be in the past");
        }
        
        if (normalizedEndDate.isBefore(normalizedStartDate) || normalizedEndDate.equals(normalizedStartDate)) {
            throw new RuntimeException("End date must be after start date");
        }

        // Check if car exists and is available
        Car car = carService.getCarById(reservation.getCar().getId());
        if (!car.getIsAvailable()) {
            throw new RuntimeException("Car is not available for reservation");
        }

        // Check for overlapping reservations
        List<Reservation> overlapping = reservationRepository.findOverlappingReservations(
            car.getId(),
            normalizedStartDate,
            normalizedEndDate
        );
        
        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Car is already reserved for these dates");
        }

        // Validate user
        User user = userService.getUserById(reservation.getUser().getId());
        reservation.setUser(user);
        reservation.setCar(car);
        
        // Set initial status to PENDING
        if (reservation.getStatus() == null) {
            reservation.setStatus(ReservationStatus.PENDING);
        }
        notificationService.createReservationNotification(
                reservation.getUser(),
                reservation.getId(),
                "created",
                "New reservation created"
        );

        return reservationRepository.save(reservation);
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
    }

    public List<Reservation> getReservationsByUser(Long userId) {
        return reservationRepository.findByUserId(userId);
    }

    public List<Reservation> getReservationsByCar(Long carId) {
        return reservationRepository.findByCarId(carId);
    }

    @Transactional
    public Reservation updateReservationStatus(Long id, ReservationStatus newStatus) {
        Reservation reservation = getReservationById(id);       
        reservation.setStatus(newStatus);

        // Update car availability based on reservation status
        Car car = reservation.getCar();
        
        switch (newStatus) {
            case CONFIRMED:
                car.setIsAvailable(false);
                break;
            case COMPLETED:
            case CANCELLED:
                // Check if there are any other active reservations for this car
                List<Reservation> activeReservations = reservationRepository.findOverlappingReservations(
                    car.getId(),
                    LocalDateTime.now(),
                    LocalDateTime.now().plusYears(1)
                );
                if (activeReservations.isEmpty() || 
                    (activeReservations.size() == 1 && activeReservations.get(0).getId().equals(id))) {
                    car.setIsAvailable(true);
                }
                break;
            case PENDING:                
                break;
        }
        
        carService.updateCar(car.getId(), car);
        return reservationRepository.save(reservation);
    }

    @Transactional
    public void deleteReservation(Long id) {
        Reservation reservation = getReservationById(id);
        
        // If deleting a confirmed reservation, check if car should be made available
        if (reservation.getStatus() == ReservationStatus.CONFIRMED) {
            Car car = reservation.getCar();
            List<Reservation> activeReservations = reservationRepository.findOverlappingReservations(
                car.getId(),
                LocalDateTime.now(),
                LocalDateTime.now().plusYears(1)
            );
            if (activeReservations.size() <= 1) {
                car.setIsAvailable(true);
                carService.updateCar(car.getId(), car);
            }
        }
        
        reservationRepository.deleteById(id);
    }

    // In ReservationService.java - Fix the cancelReservation method
    @Transactional
    public Reservation cancelReservation(Long reservationId, String userEmail) {
        System.out.println("DEBUG: Cancelling reservation ID: " + reservationId);
        System.out.println("DEBUG: Requested by user: " + userEmail);

        // Use a more efficient query to get reservation with user and car loaded
        Reservation reservation = reservationRepository.findByIdWithUserAndCar(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + reservationId));

        System.out.println("DEBUG: Found reservation with user ID: " + reservation.getUser().getId());

        User user = userService.findByEmailEntity(userEmail);
        System.out.println("DEBUG: Found user with ID: " + user.getId() + ", Role: " + user.getRole());

        // Check if user owns the reservation or is admin
        boolean isOwner = reservation.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole().equals(Role.ADMIN);

        System.out.println("DEBUG: Is owner: " + isOwner + ", Is admin: " + isAdmin);
        System.out.println("DEBUG: Reservation status: " + reservation.getStatus());

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("You are not authorized to cancel this reservation");
        }

        // Check if reservation can be cancelled (only PENDING status can be cancelled by user)
        if (!reservation.getStatus().equals(ReservationStatus.PENDING) && user.getRole().equals(Role.USER)) {
            throw new RuntimeException("Only pending reservations can be cancelled");
        }

        // Update reservation status to CANCELLED
        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation.setUpdatedAt(LocalDateTime.now());

        // If car was reserved, make it available again - but check if there are other active reservations
        if (reservation.getCar() != null) {
            Car car = reservation.getCar();

            // Only make car available if there are no other active reservations
            List<Reservation> activeReservations = reservationRepository.findActiveReservationsForCar(car.getId());
            boolean hasOtherActiveReservations = activeReservations.stream()
                    .anyMatch(r -> !r.getId().equals(reservationId) &&
                            (r.getStatus() == ReservationStatus.PENDING || r.getStatus() == ReservationStatus.CONFIRMED));

            if (!hasOtherActiveReservations) {
                car.setIsAvailable(true);
                carService.updateCar(car.getId(), car);
            }
        }

        // Create notification
        notificationService.createReservationNotification(
                reservation.getUser(),
                reservation.getId(),
                "cancelled",
                "Reservation cancelled by user"
        );

        return reservationRepository.save(reservation);
    }
}