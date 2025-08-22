package com.cars.cars.service;

import java.util.List;

import com.cars.cars.model.Car;

public class PageResponse {
    private List<Car> cars;
    private long total;
    private int pages;

    public PageResponse(List<Car> cars, long total, int pages) {
        this.cars = cars;
        this.total = total;
        this.pages = pages;
    }

    // Getters
    public List<Car> getCars() {
        return cars;
    }

    public long getTotal() {
        return total;
    }

    public int getPages() {
        return pages;
    }
}
