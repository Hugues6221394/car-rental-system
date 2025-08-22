package com.cars.cars.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cars.cars.model.Car;

import java.math.BigDecimal;
import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByIsAvailable(Boolean isAvailable);
    List<Car> findByIsAvailableTrue(Pageable pageable);
    List<Car> findByMakeIgnoreCase(String make);
    List<Car> findByYearBetween(Integer startYear, Integer endYear);
    List<Car> findByPricePerDayLessThanEqual(BigDecimal maxPrice);    

    long countByIsAvailableTrue();        
    
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.status = 'PENDING'")
    long countPendingReservations();
    
    @Query("SELECT AVG(c.pricePerDay) FROM Car c")
    BigDecimal findAveragePricePerDay();
    
    @Query("SELECT COALESCE(SUM(r.totalPrice), 0) FROM Reservation r " +
           "WHERE r.status = 'COMPLETED'")
    BigDecimal calculateTotalRevenue();

    @Query("""
      SELECT DISTINCT c
      FROM Car c
      JOIN c.reservations r
      WHERE r.user.id = :userId
        AND r.status IN ('CONFIRMED', 'PENDING')
        
    """)
    List<Car> findRentedByUser(@Param("userId") Long userId);
}
