// package com.cars.cars.service;

// import lombok.RequiredArgsConstructor;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import com.cars.cars.model.Payment;
// import com.cars.cars.model.PaymentStatus;
// import com.cars.cars.model.Reservation;
// import com.cars.cars.model.ReservationStatus;
// import com.cars.cars.repository.PaymentRepository;

// import java.util.List;
// import java.util.stream.Collectors;

// @Service
// @RequiredArgsConstructor
// public class PaymentService {
//     private final PaymentRepository paymentRepository;
//     private final ReservationService reservationService;

//     @Transactional
//     public PaymentDTO createPayment(CreatePaymentDTO dto) {
//         if (paymentRepository.existsByTransactionId(dto.getTransactionId())) {
//             throw new RuntimeException("Transaction ID already exists");
//         }

//         Reservation reservation = reservationService.getReservationById(dto.getReservationId());

//         if (dto.getAmount().compareTo(reservation.getTotalPrice()) != 0) {
//             throw new RuntimeException("Payment amount does not match reservation total");
//         }

//         Payment payment = new Payment();
//         payment.setReservation(reservation);
//         payment.setAmount(dto.getAmount());
//         payment.setPaymentMethod(dto.getPaymentMethod());
//         payment.setTransactionId(dto.getTransactionId());
//         payment.setPaymentDetails(dto.getPaymentDetails());

//         Payment savedPayment = paymentRepository.save(payment);
//         reservationService.updateReservationStatus(reservation.getId(), ReservationStatus.CONFIRMED);

//         return PaymentDTO.fromEntity(savedPayment);
//     }

//     public PaymentDTO getPaymentById(Long id) {
//         Payment payment = paymentRepository.findById(id)
//             .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
//         return PaymentDTO.fromEntity(payment);
//     }

//     public List<PaymentDTO> getAllPayments() {
//         return paymentRepository.findAll().stream()
//             .map(PaymentDTO::fromEntity)
//             .collect(Collectors.toList());
//     }

//     @Transactional
//     public PaymentDTO updatePaymentStatus(Long id, PaymentStatus newStatus) {
//         Payment payment = paymentRepository.findById(id)
//             .orElseThrow(() -> new RuntimeException("Payment not found with id: " + id));
        
//         payment.setStatus(newStatus);
        
//         if (newStatus == PaymentStatus.COMPLETED) {
//             reservationService.updateReservationStatus(
//                 payment.getReservation().getId(), 
//                 ReservationStatus.CONFIRMED
//             );
//         } else if (newStatus == PaymentStatus.FAILED || newStatus == PaymentStatus.REFUNDED) {
//             reservationService.updateReservationStatus(
//                 payment.getReservation().getId(), 
//                 ReservationStatus.CANCELLED
//             );
//         }

//         return PaymentDTO.fromEntity(paymentRepository.save(payment));
//     }
// }