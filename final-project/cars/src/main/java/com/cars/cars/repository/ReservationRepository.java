package com.cars.cars.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cars.cars.model.Reservation;
import com.cars.cars.model.ReservationStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    List<Reservation> findByCarId(Long carId);
    List<Reservation> findByStatus(ReservationStatus status);

    //I used this query because we needed to optimize the search
    @Query("SELECT r FROM Reservation r WHERE r.car.id = :carId " +
           "AND r.status IN ('PENDING', 'CONFIRMED') " +
           "AND ((r.startDate BETWEEN :startDate AND :endDate) " +
           "OR (r.endDate BETWEEN :startDate AND :endDate))")
    List<Reservation> findOverlappingReservations(
        @Param("carId") Long carId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    @Query("""
    SELECT COUNT(r)
    FROM Reservation r
    WHERE r.status = :status      
  """)
  long countActiveReservations(@Param("status") ReservationStatus status);    
}
