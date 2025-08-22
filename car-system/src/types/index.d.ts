export type TransmissionType = "AUTOMATIC" | "MANUAL";
export type DriveType = "FWD" | "AWD";
export type Role = "USER" | "ADMIN";
export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export const RESERVATION_STATUSES: ReservationStatus[] = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
];

export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  transmission: TransmissionType;
  driveType: DriveType;
  fuelEfficiency: number;
  pricePerDay: number;
  imageUrl: string | null;
  isAvailable: boolean;
  reservations?: Reservation[];
  isRented?: boolean;
}

export interface Reservation {
  id: number;
  startDate: string;
  endDate: string;
  status: ReservationStatus;
  createdAt: Date;
  carId: number;
  userId: number;
}

export interface CarStats {
  totalCars: number;
  availableCars: number;
  activeReservations: number;
  averagePrice: number;
  pendingReservations: number;
  totalRevenue: number;
}

export interface CarFilterDTO {
  make?: string;
  model?: string;
  year?: number;
  transmission?: TransmissionType;
  minPrice?: number;
  maxPrice?: number;
  onlyAvailable?: boolean;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ReservationDTO {
  id: string;
  carId: string;
  carDetails: string;
  userId: string;
  userEmail: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
  carImageUrl: string | null;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
