package com.cars.cars.service;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cars.cars.dto.CarFilterDTO;
import com.cars.cars.dto.CarStatsDTO;
import com.cars.cars.model.Car;
import com.cars.cars.model.ReservationStatus;
import com.cars.cars.repository.CarRepository;
import com.cars.cars.repository.ReservationRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CarService {
    private final CarRepository carRepository;
    private final EntityManager entityManager;
    private final ReservationRepository reservationRepository;

    @Transactional
    public Car createCar(Car car) {
        // Basic validation
        if (car.getPricePerDay().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Price per day must be greater than zero");
        }
        return carRepository.save(car);
    }

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public Car getCarById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + id));
    }

    public List<Car> getAvailableCars() {
        return carRepository.findByIsAvailable(true);
    }

    public List<Car> getCarsByMake(String make) {
        return carRepository.findByMakeIgnoreCase(make);
    }

    public List<Car> getCarsByYearRange(Integer startYear, Integer endYear) {
        return carRepository.findByYearBetween(startYear, endYear);
    }

    public List<Car> getCarsByMaxPrice(BigDecimal maxPrice) {
        return carRepository.findByPricePerDayLessThanEqual(maxPrice);
    }

    @Transactional
    public Car updateCar(Long id, Car carDetails) {
        Car car = getCarById(id);
        
        car.setMake(carDetails.getMake());
        car.setModel(carDetails.getModel());
        car.setYear(carDetails.getYear());
        car.setColor(carDetails.getColor());
        car.setTransmission(carDetails.getTransmission());
        car.setDriveType(carDetails.getDriveType());
        car.setFuelEfficiency(carDetails.getFuelEfficiency());
        car.setPricePerDay(carDetails.getPricePerDay());
        car.setImageUrl(carDetails.getImageUrl());
        car.setIsAvailable(carDetails.getIsAvailable());
        
        return carRepository.save(car);
    }

    @Transactional
    public void deleteCar(Long id) {
        if (!carRepository.existsById(id)) {
            throw new RuntimeException("Car not found with id: " + id);
        }
        carRepository.deleteById(id);
    }

    @Transactional
    public Car updateCarAvailability(Long id, Boolean isAvailable) {
        Car car = getCarById(id);
        car.setIsAvailable(isAvailable);
        return carRepository.save(car);
    }

    public CarStatsDTO getCarStats() {
        long totalCars = carRepository.count();
        long availableCars = carRepository.countByIsAvailableTrue();
        
        // Get active reservations (current date between startDate and endDate)
        long activeReservations = reservationRepository
            .countActiveReservations(ReservationStatus.CONFIRMED);
        
        // Calculate average price
        BigDecimal averagePrice = carRepository.findAveragePricePerDay();
        
        // Get pending reservations
        long pendingReservations = carRepository.countPendingReservations();
        
        // Calculate total revenue from completed reservations
        BigDecimal totalRevenue = carRepository.calculateTotalRevenue();

        return new CarStatsDTO(
            totalCars,
            availableCars,
            activeReservations,
            averagePrice,
            pendingReservations,
            totalRevenue
        );
    }

     public Page<Car> filterCars(CarFilterDTO filter, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Car> query = cb.createQuery(Car.class);
        Root<Car> car = query.from(Car.class);

        List<Predicate> predicates = new ArrayList<>();

        // Add filter conditions
        if (filter.getMake() != null && !filter.getMake().isEmpty()) {
            predicates.add(cb.like(cb.lower(car.get("make")), 
                "%" + filter.getMake().toLowerCase() + "%"));
        }

        if (filter.getModel() != null && !filter.getModel().isEmpty()) {
            predicates.add(cb.like(cb.lower(car.get("model")), 
                "%" + filter.getModel().toLowerCase() + "%"));
        }

        if (filter.getYear() != null) {
            predicates.add(cb.equal(car.get("year"), filter.getYear()));
        }

        if (filter.getTransmission() != null) {
            predicates.add(cb.equal(car.get("transmission"), filter.getTransmission()));
        }

        if (filter.getMinPrice() != null) {
            predicates.add(cb.greaterThanOrEqualTo(car.get("pricePerDay"), filter.getMinPrice()));
        }

        if (filter.getMaxPrice() != null) {
            predicates.add(cb.lessThanOrEqualTo(car.get("pricePerDay"), filter.getMaxPrice()));
        }

        // Only show available cars if specified
        if (filter.getOnlyAvailable() != null && filter.getOnlyAvailable()) {
            predicates.add(cb.isTrue(car.get("isAvailable")));
        }

        query.where(predicates.toArray(new Predicate[0]));
        
        // Add ordering
        if (filter.getSortBy() != null) {
            if (filter.getSortDirection() != null && filter.getSortDirection().equalsIgnoreCase("desc")) {
                query.orderBy(cb.desc(car.get(filter.getSortBy())));
            } else {
                query.orderBy(cb.asc(car.get(filter.getSortBy())));
            }
        }

        return executePagedQuery(query, pageable);
    }

     private Page<Car> executePagedQuery(CriteriaQuery<Car> query, Pageable pageable) {
        // Get total count
        CriteriaQuery<Long> countQuery = entityManager.getCriteriaBuilder()
            .createQuery(Long.class);
        countQuery.select(entityManager.getCriteriaBuilder().count(
            countQuery.from(Car.class)));
        Long total = entityManager.createQuery(countQuery).getSingleResult();

        // Execute paged query
        List<Car> cars = entityManager.createQuery(query)
            .setFirstResult((int) pageable.getOffset())
            .setMaxResults(pageable.getPageSize())
            .getResultList();

        return new PageImpl<>(cars, pageable, total);
    }

    public List<Car> getCarsRentedByUser(Long userId) {
        return carRepository.findRentedByUser(userId);
    }

}