package com.cars.cars.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class CarStatsDTO {
    private long totalCars;
    private long availableCars;
    private long activeReservations;
    private BigDecimal averagePrice;
    private long pendingReservations;
    private BigDecimal totalRevenue;
}