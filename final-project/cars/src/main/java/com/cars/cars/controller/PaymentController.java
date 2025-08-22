// package com.cars.cars.controller;

// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import com.cars.cars.model.PaymentStatus;
// import com.cars.cars.service.ApiResponse;
// import com.cars.cars.service.CreatePaymentDTO;
// import com.cars.cars.service.PaymentDTO;
// import com.cars.cars.service.PaymentService;

// import java.util.List;

// @RestController
// @RequestMapping("/api/payments")
// @RequiredArgsConstructor
// public class PaymentController {
//     private final PaymentService paymentService;

//     @PostMapping
//     public ResponseEntity<ApiResponse<PaymentDTO>> createPayment(@RequestBody CreatePaymentDTO dto) {
//         try {
//             PaymentDTO payment = paymentService.createPayment(dto);
//             return ResponseEntity.ok(ApiResponse.success(payment, "Payment created successfully"));
//         } catch (RuntimeException e) {
//             return ResponseEntity.badRequest()
//                 .body(ApiResponse.error(e.getMessage()));
//         }
//     }

//     @GetMapping("/{id}")
//     public ResponseEntity<ApiResponse<PaymentDTO>> getPaymentById(@PathVariable Long id) {
//         try {
//             PaymentDTO payment = paymentService.getPaymentById(id);
//             return ResponseEntity.ok(ApiResponse.success(payment, "Payment retrieved successfully"));
//         } catch (RuntimeException e) {
//             return ResponseEntity.notFound().build();
//         }
//     }

//     @GetMapping
//     public ResponseEntity<ApiResponse<List<PaymentDTO>>> getAllPayments() {
//         List<PaymentDTO> payments = paymentService.getAllPayments();
//         return ResponseEntity.ok(ApiResponse.success(payments, "Payments retrieved successfully"));
//     }

//     @PatchMapping("/{id}/status")
//     public ResponseEntity<ApiResponse<PaymentDTO>> updatePaymentStatus(
//             @PathVariable Long id,
//             @RequestParam PaymentStatus status) {
//         try {
//             PaymentDTO payment = paymentService.updatePaymentStatus(id, status);
//             return ResponseEntity.ok(ApiResponse.success(payment, "Payment status updated successfully"));
//         } catch (RuntimeException e) {
//             return ResponseEntity.badRequest()
//                 .body(ApiResponse.error(e.getMessage()));
//         }
//     }
// }