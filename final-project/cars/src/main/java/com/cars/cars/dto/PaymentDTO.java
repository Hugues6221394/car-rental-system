 package com.cars.cars.dto;

 import lombok.Data;
 import java.math.BigDecimal;
 import java.time.LocalDateTime;

 import com.cars.cars.model.Payment;
 import com.cars.cars.model.PaymentStatus;

 @Data
 public class PaymentDTO {
     private Long id;
     private Long reservationId;
     private String userEmail;
     private String carDetails;
     private BigDecimal amount;
     private String paymentMethod;
     private String transactionId;
     private PaymentStatus status;
     private String paymentDetails;
     private LocalDateTime paymentDate;
     private LocalDateTime createdAt;
     private LocalDateTime updatedAt;

     public static PaymentDTO fromEntity(Payment payment) {
         PaymentDTO dto = new PaymentDTO();
         dto.setId(payment.getId());
         dto.setReservationId(payment.getReservation().getId());
         dto.setUserEmail(payment.getReservation().getUser().getEmail());
         dto.setCarDetails(payment.getReservation().getCar().getMake() + " " +
                          payment.getReservation().getCar().getModel());
         dto.setAmount(payment.getAmount());
         dto.setPaymentMethod(payment.getPaymentMethod());
         dto.setTransactionId(payment.getTransactionId());
         dto.setStatus(payment.getStatus());
         dto.setPaymentDetails(payment.getPaymentDetails());
         dto.setPaymentDate(payment.getPaymentDate());
         dto.setCreatedAt(payment.getCreatedAt());
         dto.setUpdatedAt(payment.getUpdatedAt());
         return dto;
     }
 }