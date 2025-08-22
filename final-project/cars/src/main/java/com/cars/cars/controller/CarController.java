package com.cars.cars.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.cars.cars.dto.CarFilterDTO;
import com.cars.cars.dto.CarStatsDTO;
import com.cars.cars.dto.UserDto;
import com.cars.cars.model.Car;
import com.cars.cars.service.ApiResponse;
import com.cars.cars.service.CarService;
import com.cars.cars.service.FileStorageService;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/cars", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class CarController {
    private final FileStorageService fileStorageService;
    private final CarService carService;

    private Car normalizeImageUrl(Car car) {
        if (car != null && car.getImageUrl() != null && !car.getImageUrl().startsWith("/cars/")) {
            car.setImageUrl("/cars/" + car.getImageUrl());
        }
        return car;
    }

    private List<Car> normalizeImageUrls(List<Car> cars) {
        return cars.stream().map(this::normalizeImageUrl).collect(Collectors.toList());
    }


    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<Car>> createCar(@RequestBody Car car) {
        try {
            Car createdCar = carService.createCar(car);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.success(createdCar, "Car created successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Car>>> getAllCars() {
        List<Car> cars = normalizeImageUrls(carService.getAllCars());
        return ResponseEntity.ok(ApiResponse.success(cars, "Cars retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Car>> getCarById(@PathVariable Long id) {
        try {
            Car car = carService.getCarById(id);
            normalizeImageUrl(car);
            return ResponseEntity.ok(ApiResponse.success(car, "Car retrieved successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<Car>>> getAvailableCars() {
        List<Car> cars = normalizeImageUrls(carService.getAvailableCars());
        return ResponseEntity.ok(ApiResponse.success(cars, "Available cars retrieved successfully"));
    }

    @GetMapping("/make/{make}")
    public ResponseEntity<ApiResponse<List<Car>>> getCarsByMake(@PathVariable String make) {
        List<Car> cars = normalizeImageUrls(carService.getCarsByMake(make));
        return ResponseEntity.ok(ApiResponse.success(cars, "Cars retrieved successfully"));
    }

    @GetMapping("/year-range")
    public ResponseEntity<ApiResponse<List<Car>>> getCarsByYearRange(
            @RequestParam Integer startYear,
            @RequestParam Integer endYear) {
        List<Car> cars = normalizeImageUrls(carService.getCarsByYearRange(startYear, endYear));
        return ResponseEntity.ok(ApiResponse.success(cars, "Cars retrieved successfully"));
    }

    @GetMapping("/max-price")
    public ResponseEntity<ApiResponse<List<Car>>> getCarsByMaxPrice(@RequestParam BigDecimal maxPrice) {
        List<Car> cars = normalizeImageUrls(carService.getCarsByMaxPrice(maxPrice));
        return ResponseEntity.ok(ApiResponse.success(cars, "Cars retrieved successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Car>> updateCar(@PathVariable Long id, @RequestBody Car carDetails) {
        try {
            Car updatedCar = carService.updateCar(id, carDetails);
            normalizeImageUrl(updatedCar);
            return ResponseEntity.ok(ApiResponse.success(updatedCar, "Car updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<ApiResponse<Car>> updateCarAvailability(@PathVariable Long id, @RequestParam Boolean isAvailable) {
        try {
            Car updatedCar = carService.updateCarAvailability(id, isAvailable);
            normalizeImageUrl(updatedCar);
            return ResponseEntity.ok(ApiResponse.success(updatedCar, "Car availability updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCar(@PathVariable Long id) {
        try {
            carService.deleteCar(id);
            return ResponseEntity.ok(ApiResponse.success(null, "Car deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<CarStatsDTO>> getCarStats() {
        try {
            CarStatsDTO stats = carService.getCarStats();
            return ResponseEntity.ok(ApiResponse.success(stats, "Car stats retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error retrieving car stats: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<Car>>> searchCars(
            @ModelAttribute CarFilterDTO filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<Car> cars = carService.filterCars(filter, PageRequest.of(page, size));
            cars.forEach(this::normalizeImageUrl);
            return ResponseEntity.ok(ApiResponse.success(cars, "Cars retrieved successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Error searching cars: " + e.getMessage()));
        }
    }

    @PostMapping(
            value = "/upload-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(ApiResponse.error("No file provided or file is empty"));
            }

            String fileUrl = fileStorageService.storeFile(file);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.success(fileUrl, "Image uploaded successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(ApiResponse.error("Failed to upload image: " + e.getMessage()));
        }
    }


    @GetMapping("/rented")
    public ResponseEntity<List<Car>> getRentedCars(Authentication authentication) {
        UserDto user = (UserDto) authentication.getPrincipal();
        Long userId = user.getId();
        List<Car> rented = normalizeImageUrls(carService.getCarsRentedByUser(userId));
        return ResponseEntity.ok(rented);
    }
}
