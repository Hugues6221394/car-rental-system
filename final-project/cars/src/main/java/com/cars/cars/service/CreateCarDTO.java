package com.cars.cars.service;

import lombok.Data;
import java.math.BigDecimal;

import com.cars.cars.model.DriveType;
import com.cars.cars.model.TransmissionType;

@Data
public class CreateCarDTO {
    private String make;
    private String model;
    private Integer year;
    private String color;
    private TransmissionType transmission;
    private DriveType driveType;
    private Integer fuelEfficiency;
    private BigDecimal pricePerDay;
    private String imageUrl;
}