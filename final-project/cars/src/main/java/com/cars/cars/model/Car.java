package com.cars.cars.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@Table(name = "cars")
@NoArgsConstructor
@AllArgsConstructor

public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String make;
    
    @Column(nullable = false)
    private String model;
    
    @Column(nullable = false)
    private Integer year;
    
    private String color;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransmissionType transmission;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DriveType driveType;
    
    private Integer fuelEfficiency;
    
    @Column(nullable = false)
    private BigDecimal pricePerDay;
    
    private String imageUrl;
    
    @Column(nullable = false)
    private Boolean isAvailable = true;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"car", "hibernateLazyInitializer", "handler"})
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Reservation> reservations = new HashSet<>();
}