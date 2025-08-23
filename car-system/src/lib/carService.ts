// src/lib/carService.ts
import type { ApiResponse, Car, CarFilterDTO, CarStats } from "@/types";
import { getAuthToken, request } from "./api";

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

export const carService = {
  getAllCars: async (): Promise<ApiResponse<Car[]>> => {
    const response = await request({
      method: "GET",
      url: "/api/cars",
    });
    return response.data;
  },

  getAvailableCars: async (): Promise<ApiResponse<Car[]>> => {
    const response = await request({
      method: "GET",
      url: "/api/cars/available",
    });
    return response.data;
  },

  getAvailableCarsPaginated: async (
      page: number = 0,
      size: number = 12
  ): Promise<ApiResponse<PaginatedResponse<Car>>> => {
    const response = await request({
      method: "GET",
      url: `/api/cars/search?onlyAvailable=true&page=${page}&size=${size}`,
    });
    return response.data;
  },

  getCarById: async (id: number): Promise<ApiResponse<Car>> => {
    const response = await request({
      method: "GET",
      url: `/api/cars/${id}`,
    });
    return response.data;
  },

  getCarsByMake: async (make: string): Promise<ApiResponse<Car[]>> => {
    const response = await request({
      method: "GET",
      url: `/api/cars/make/${make}`,
    });
    return response.data;
  },

  getCarsByYearRange: async (
      startYear: number,
      endYear: number
  ): Promise<ApiResponse<Car[]>> => {
    const response = await request({
      method: "GET",
      url: `/api/cars/year-range?startYear=${startYear}&endYear=${endYear}`,
    });
    return response.data;
  },

  getCarsByMaxPrice: async (maxPrice: number): Promise<ApiResponse<Car[]>> => {
    const response = await request({
      method: "GET",
      url: `/api/cars/max-price?maxPrice=${maxPrice}`,
    });
    return response.data;
  },

  getCarStats: async (): Promise<ApiResponse<CarStats>> => {
    const response = await request({
      method: "GET",
      url: "/api/cars/stats",
    });
    return response.data;
  },

  updateCar: async (
      id: number,
      car: Partial<Car>
  ): Promise<ApiResponse<Car>> => {
    const response = await request({
      method: "PUT",
      url: `/api/cars/${id}`,
      data: car,
    });
    return response.data;
  },

  updateCarAvailability: async (
      id: number,
      isAvailable: boolean
  ): Promise<ApiResponse<Car>> => {
    const response = await request({
      method: "PATCH",
      url: `/api/cars/${id}/availability?isAvailable=${isAvailable}`,
    });
    return response.data;
  },

  deleteCar: async (id: number): Promise<ApiResponse<void>> => {
    const response = await request({
      method: "DELETE",
      url: `/api/cars/${id}`,
    });
    return response.data;
  },

  getUserRentedCars: async (): Promise<Car[]> => {
    const response = await request({
      method: "GET",
      url: "/api/cars/rented",
    });
    return response.data as Car[];
  },

  searchCars: async (
      filter: CarFilterDTO,
      page: number = 0,
      size: number = 12
  ): Promise<ApiResponse<PaginatedResponse<Car>>> => {
    const params = new URLSearchParams();

    if (filter.make) params.append("make", filter.make);
    if (filter.model) params.append("model", filter.model);
    if (filter.year) params.append("year", filter.year.toString());
    if (filter.transmission) params.append("transmission", filter.transmission);
    if (filter.minPrice) params.append("minPrice", filter.minPrice.toString());
    if (filter.maxPrice) params.append("maxPrice", filter.maxPrice.toString());
    if (filter.onlyAvailable !== undefined)
      params.append("onlyAvailable", filter.onlyAvailable.toString());
    if (filter.sortBy) params.append("sortBy", filter.sortBy);
    if (filter.sortDirection)
      params.append("sortDirection", filter.sortDirection);

    params.append("page", page.toString());
    params.append("size", size.toString());

    const response = await request({
      method: "GET",
      url: `/api/cars/search?${params.toString()}`,
    });

    return response.data;
  },

  searchCarsWithQuery: async (
      query: string = "",
      page: number = 0,
      size: number = 12,
      onlyAvailable: boolean = true
  ): Promise<ApiResponse<PaginatedResponse<Car>>> => {
    const params = new URLSearchParams();

    if (query.trim()) {
      params.append("make", query);
    }

    if (onlyAvailable) params.append("onlyAvailable", "true");
    params.append("page", page.toString());
    params.append("size", size.toString());
    params.append("sortBy", "id");
    params.append("sortDirection", "desc");

    const response = await request({
      method: "GET",
      url: `/api/cars/search?${params.toString()}`,
    });

    return response.data;
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const token = getAuthToken();
    if (!token) {
      throw new Error("Authentication required");
    }

    try {
      const response = await fetch(
          "http://localhost:8080/api/cars/upload-image",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${errorText}`);
      }

      const responseData = await response.json();
      return responseData.data;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  },

  createCar: async (
      car: Omit<Car, "id">,
      imageFile?: File
  ): Promise<ApiResponse<Car>> => {
    let carData = { ...car };

    if (imageFile) {
      try {
        const imageUrl = await carService.uploadImage(imageFile);
        carData.imageUrl = imageUrl;
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }

    const response = await request({
      method: "POST",
      url: "/api/cars",
      data: carData,
    });

    return response.data;
  },
};