package com.cars.cars.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cars.cars.model.Car;
import com.cars.cars.model.Reservation;
import com.cars.cars.model.ReservationStatus;
import com.cars.cars.model.User;
import com.cars.cars.service.ApiResponse;
import com.cars.cars.service.CreateReservationDTO;
import com.cars.cars.service.ReservationDTO;
import com.cars.cars.service.ReservationService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/reservations", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class ReservationController {
    private final ReservationService reservationService;

    @PostMapping(
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<ReservationDTO>> createReservation(@RequestBody CreateReservationDTO dto) {
        try {
            // Input validation first
            if (dto.getCarId() == null || dto.getUserId() == null || 
                dto.getStartDate() == null || dto.getEndDate() == null || 
                dto.getTotalPrice() == null) {
                return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.error("Missing required fields for reservation"));
            }
            
            Reservation reservation = new Reservation();
            Car car = new Car();
            car.setId(dto.getCarId());
            
            User user = new User();
            user.setId(dto.getUserId());
            
            reservation.setCar(car);
            reservation.setUser(user);
            reservation.setStartDate(dto.getStartDate());
            reservation.setEndDate(dto.getEndDate());
            reservation.setTotalPrice(dto.getTotalPrice());
            reservation.setStatus(ReservationStatus.PENDING);
            
            Reservation createdReservation = reservationService.createReservation(reservation);
            ReservationDTO responseDTO = ReservationDTO.fromEntity(createdReservation);
            
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(ApiResponse.success(responseDTO, "Reservation created successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(ApiResponse.error(e.getMessage()));
        }
    }
    

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<List<ReservationDTO>>> getAllReservations() {
        List<Reservation> reservations = reservationService.getAllReservations();
        List<ReservationDTO> dtos = reservations.stream()
            .map(ReservationDTO::fromEntity)
            .collect(Collectors.toList());
            
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(ApiResponse.success(dtos, "Reservations retrieved successfully"));
    }

    @GetMapping(
        value = "/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<ReservationDTO>> getReservationById(@PathVariable Long id) {
        try {
            Reservation reservation = reservationService.getReservationById(id);
            ReservationDTO dto = ReservationDTO.fromEntity(reservation);
            
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(ApiResponse.success(dto, "Reservation retrieved successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound()
                .build();
        }
    }

    @GetMapping(
        value = "/user/{userId}",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<List<ReservationDTO>>> getReservationsByUser(@PathVariable Long userId) {
        List<Reservation> reservations = reservationService.getReservationsByUser(userId);
        List<ReservationDTO> dtos = reservations.stream()
            .map(ReservationDTO::fromEntity)
            .collect(Collectors.toList());
            
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(ApiResponse.success(dtos, "User reservations retrieved successfully"));
    }

    @GetMapping(
        value = "/car/{carId}",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<List<ReservationDTO>>> getReservationsByCar(@PathVariable Long carId) {
        List<Reservation> reservations = reservationService.getReservationsByCar(carId);
        List<ReservationDTO> dtos = reservations.stream()
            .map(ReservationDTO::fromEntity)
            .collect(Collectors.toList());
            
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_JSON)
            .body(ApiResponse.success(dtos, "Car reservations retrieved successfully"));
    }

    @PatchMapping(
        value = "/{id}/status",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<ReservationDTO>> updateReservationStatus(
            @PathVariable Long id,
            @RequestParam ReservationStatus status) {
        try {
            Reservation updatedReservation = reservationService.updateReservationStatus(id, status);
            ReservationDTO dto = ReservationDTO.fromEntity(updatedReservation);
            
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(ApiResponse.success(dto, "Reservation status updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping(
        value = "/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<Void>> deleteReservation(@PathVariable Long id) {
        try {
            reservationService.deleteReservation(id);
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(ApiResponse.success(null, "Reservation deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound()
                .build();
        }
    }
}