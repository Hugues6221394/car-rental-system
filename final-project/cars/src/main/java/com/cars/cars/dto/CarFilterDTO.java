package com.cars.cars.dto;

import com.cars.cars.model.TransmissionType;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CarFilterDTO {
    private String make;
    private String model;
    private Integer year;
    private TransmissionType transmission;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Boolean onlyAvailable;
    private String sortBy;
    private String sortDirection;
}