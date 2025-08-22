import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import {
  differenceInDays,
  startOfDay,
  endOfDay,
  addDays,
  isSameDay,
} from "date-fns";

import "react-datepicker/dist/react-datepicker.css";
import { request } from "@/lib/api";
import { toast } from "sonner";

interface ReservationFormProps {
  carId: number;
  pricePerDay: number;
  userId: number;
  existingReservations: Array<{
    startDate: Date;
    endDate: Date;
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
  }>;
  onReservationSuccess?: (reservationId: number) => void; // Add this prop
}

export default function ReservationForm({
                                          carId,
                                          pricePerDay,
                                          userId,
                                          existingReservations,
                                          onReservationSuccess, // Receive callback from parent
                                        }: ReservationFormProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [reservationSuccess, setReservationSuccess] = useState(false);

  // Reset success state when form inputs change
  useEffect(() => {
    if (reservationSuccess) {
      setReservationSuccess(false);
    }
  }, [startDate, endDate]);

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      // Always normalize to start of day
      const normalizedDate = startOfDay(date);
      setStartDate(normalizedDate);

      // If end date exists but is before or same as the new start date, reset it
      if (
          endDate &&
          (normalizedDate >= endDate || isSameDay(normalizedDate, endDate))
      ) {
        setEndDate(null);
      }
    } else {
      setStartDate(null);
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      // Always normalize to end of day
      setEndDate(endOfDay(date));
    } else {
      setEndDate(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!startDate || !endDate || !userId) {
      toast.error("Please select both start and end dates");
      return;
    }

    // Get tomorrow's date (since we can't reserve for today)
    const tomorrow = startOfDay(addDays(new Date(), 1));

    if (startDate < tomorrow) {
      toast.error("Start date must be at least tomorrow");
      return;
    }

    // Check if end date is after start date (at day level)
    const startDay = startOfDay(startDate);
    const endDay = startOfDay(endDate);

    if (isSameDay(startDay, endDay)) {
      toast.error("End date must be at least one day after start date");
      return;
    }

    const days = differenceInDays(endDate, startDate);
    if (days < 1) {
      toast.error("Reservation must be at least 1 day");
      return;
    }

    setIsLoading(true);

    try {
      const totalPrice = days * pricePerDay;

      // Make sure dates are in the correct format
      const formattedStartDate = startOfDay(startDate).toISOString();
      const formattedEndDate = endOfDay(endDate).toISOString();

      console.log("Sending reservation request:", {
        carId,
        userId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        totalPrice,
      });

      const response = await request({
        method: "POST",
        url: "/api/reservations",
        data: {
          carId,
          userId,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          totalPrice,
        },
      });

      console.log("Reservation response:", response);

      if (response.data.success) {
        const reservationId = response.data.data.id;

        toast.success("Reservation created successfully!");
        setReservationSuccess(true);
        setStartDate(null);
        setEndDate(null);

        // Call the parent callback instead of using router directly
        if (onReservationSuccess) {
          onReservationSuccess(reservationId);
        } else {
          // Fallback: use window.location if no callback provided
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.href = `/payment/${reservationId}`;
            }
          }, 1500);
        }

      } else {
        throw new Error(
            response.data.message || "Failed to create reservation"
        );
      }
    } catch (error) {
      const errorMessage =
          error instanceof Error ? error.message : "Failed to create reservation";
      console.error("Reservation error:", error);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isDateDisabled = (date: Date) => {
    // Check if date is already reserved
    const normalizedDate = startOfDay(date);

    // Disallow today and past dates
    const tomorrow = startOfDay(addDays(new Date(), 1));
    if (normalizedDate < tomorrow) {
      return true;
    }

    return existingReservations.some((reservation) => {
      if (reservation.status === "CANCELLED") return false;

      const resStart = startOfDay(new Date(reservation.startDate));
      const resEnd = endOfDay(new Date(reservation.endDate));

      // Check if the normalized date falls within a reserved period
      return normalizedDate >= resStart && normalizedDate <= resEnd;
    });
  };

  // Minimum date should be tomorrow
  const minDate = addDays(new Date(), 1);

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={minDate}
                filterDate={(date) => !isDateDisabled(date)}
                dateFormat="MMMM d, yyyy"
                className="w-full px-3 py-2 border rounded-lg dark:bg-navy-800 dark:border-navy-700 dark:text-white"
                placeholderText="Select start date"
            />
            <p className="text-xs text-gray-500 mt-1">
              Earliest reservation date: tomorrow
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate ? addDays(startDate, 1) : minDate}
                filterDate={(date) => !isDateDisabled(date)}
                dateFormat="MMMM d, yyyy"
                className="w-full px-3 py-2 border rounded-lg dark:bg-navy-800 dark:border-navy-700 dark:text-white"
                placeholderText="Select end date"
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 1 day after start date
            </p>
          </div>
        </div>

        {startDate && endDate && (
            <div className="bg-gray-50 dark:bg-navy-900/50 p-4 rounded-lg">
              <p className="text-lg font-semibold dark:text-white">
                Total Price: $
                {(differenceInDays(endDate, startDate) * pricePerDay).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {differenceInDays(endDate, startDate)} days at ${pricePerDay}/day
              </p>
            </div>
        )}

        {error && (
            <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
        )}

        {reservationSuccess && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-700 dark:text-green-400">
                Your reservation was created successfully! You can view all your
                reservations in your account.
              </p>
            </div>
        )}

        <button
            type="submit"
            disabled={isLoading || !startDate || !endDate || !userId}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700
                 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isLoading ? "Creating Reservation..." : "Confirm Reservation & Pay"}
        </button>
      </form>
  );
}