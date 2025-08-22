package com.cars.cars.service;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.cars.cars.model.Reservation;
import com.cars.cars.model.ReservationStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

@Data
public class ReservationDTO {
    private Long id;
    private Long carId;
    private String carDetails;
    private Long userId;
    private String userEmail;
    private String carImageUrl;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime startDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endDate;
    
    private BigDecimal totalPrice;
    private ReservationStatus status;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    public static ReservationDTO fromEntity(Reservation reservation) {
        ReservationDTO dto = new ReservationDTO();
        dto.setId(reservation.getId());
        
        // Handle car details safely to avoid NPE
        if (reservation.getCar() != null) {
            dto.setCarId(reservation.getCar().getId());
            dto.setCarImageUrl(reservation.getCar().getImageUrl());
            String make = reservation.getCar().getMake() != null ? reservation.getCar().getMake() : "";
            String model = reservation.getCar().getModel() != null ? reservation.getCar().getModel() : "";
            dto.setCarDetails(make + " " + model);
        }
        
        // Handle user details safely to avoid NPE
        if (reservation.getUser() != null) {
            dto.setUserId(reservation.getUser().getId());
            dto.setUserEmail(reservation.getUser().getEmail());
        }        
        
        dto.setStartDate(reservation.getStartDate());
        dto.setEndDate(reservation.getEndDate());
        dto.setTotalPrice(reservation.getTotalPrice());
        dto.setStatus(reservation.getStatus());
        dto.setCreatedAt(reservation.getCreatedAt());
        dto.setUpdatedAt(reservation.getUpdatedAt());
        return dto;
    }

    public String getCarImageUrl() { return carImageUrl; }
    public void setCarImageUrl(String carImageUrl) { this.carImageUrl = carImageUrl;}
}