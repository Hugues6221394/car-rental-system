package com.cars.cars.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cars.cars.model.Car;
import com.cars.cars.model.Reservation;
import com.cars.cars.model.ReservationStatus;
import com.cars.cars.model.User;
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
}