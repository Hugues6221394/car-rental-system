// package com.cars.cars.repository;
//
// import org.springframework.data.jpa.repository.JpaRepository;
//
// import com.cars.cars.model.Payment;
//
// import java.util.Optional;
//
// public interface PaymentRepository extends JpaRepository<Payment, Long> {
//     Optional<Payment> findByReservationId(Long reservationId);
//     Optional<Payment> findByTransactionId(String transactionId);
//     boolean existsByTransactionId(String transactionId);
// }
