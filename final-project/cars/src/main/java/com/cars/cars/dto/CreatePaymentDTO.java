 package com.cars.cars.dto;

 import lombok.Data;
 import java.math.BigDecimal;

 @Data
 public class CreatePaymentDTO {
     private Long reservationId;
     private BigDecimal amount;
     private String paymentMethod;
     private String transactionId;
     private String paymentDetails;
 }