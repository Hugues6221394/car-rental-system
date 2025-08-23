// File: components/admin/ReservationsList.tsx
"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { request } from "@/lib/api";
import type { ReservationDTO, ReservationStatus } from "@/types";
import { toast } from "sonner";

export const RESERVATION_STATUSES: ReservationStatus[] = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
];

interface ReservationsListProps {
  reservations: ReservationDTO[];
  onUpdate: () => void;
}

export default function ReservationsList({
                                           reservations: initialReservations,
                                           onUpdate,
                                         }: ReservationsListProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ReservationStatus | "ALL">(
      "ALL"
  );
  const [searchTerm, setSearchTerm] = useState("");

  const handleStatusChange = async (
      reservationId: string,
      newStatus: ReservationStatus
  ) => {
    try {
      setIsLoading(reservationId);
      const response = await request({
        method: "PATCH",
        url: `/api/reservations/${reservationId}/status`,
        params: { status: newStatus },
      });

      if (response.data.success) {
        toast.success(`Status updated to ${newStatus.toLowerCase()}`);
        onUpdate();
      }
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(
          error.response?.data?.message || "Failed to update reservation"
      );
    } finally {
      setIsLoading(null);
    }
  };

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "CONFIRMED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "COMPLETED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const filteredReservations = initialReservations.filter((reservation) => {
    const matchesStatus =
        filterStatus === "ALL" || reservation.status === filterStatus;
    const matchesSearch =
        reservation.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.carDetails.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                  type="text"
                  placeholder="Search by email or car."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
                className={cn(
                    "flex h-9 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
                )}
                value={filterStatus}
                onChange={(e) =>
                    setFilterStatus(e.target.value as ReservationStatus | "ALL")
                }
            >
              <option value="ALL">All Statuses</option>
              {RESERVATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reservations List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => (
                  <div
                      key={reservation.id}
                      className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Car Image */}
                      <div className="w-full md:w-48 h-32 relative rounded-lg overflow-hidden bg-gray-100">
                        {reservation.carImageUrl ? (
                            <img
                                src={reservation.carImageUrl}
                                alt={reservation.carDetails}
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              No image available
                            </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                              {reservation.carDetails}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              User: {reservation.userEmail}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              From:{" "}
                              {new Date(reservation.startDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              To: {new Date(reservation.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                      <span
                          className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                              reservation.status
                          )}`}
                      >
                        {reservation.status}
                      </span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                        Total: ${reservation.totalPrice}
                      </span>
                          </div>

                          <div className="flex gap-2">
                            {reservation.status === "PENDING" && (
                                <>
                                  <button
                                      onClick={() =>
                                          handleStatusChange(reservation.id, "CONFIRMED")
                                      }
                                      disabled={isLoading === reservation.id}
                                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                  >
                                    {isLoading === reservation.id
                                        ? "Processing..."
                                        : "Confirm"}
                                  </button>
                                  <button
                                      onClick={() =>
                                          handleStatusChange(reservation.id, "CANCELLED")
                                      }
                                      disabled={isLoading === reservation.id}
                                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                  >
                                    Cancel
                                  </button>
                                </>
                            )}

                            {reservation.status === "CONFIRMED" && (
                                <button
                                    onClick={() =>
                                        handleStatusChange(reservation.id, "COMPLETED")
                                    }
                                    disabled={isLoading === reservation.id}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                >
                                  Complete
                                </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              ))
          ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No matching reservations found
              </div>
          )}
        </div>
      </div>
  );
}