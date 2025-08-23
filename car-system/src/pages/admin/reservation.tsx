// src/pages/admin/reservation.tsx
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeaders";
import { request } from "@/lib/api";
import { PageContainer } from "@/components/PageContaire"; // Fixed typo
import { useAuth } from "@/components/AuthContext";
import type { ReservationDTO } from "@/types";
import ReservationsList from "@/components/admin/ReservationList";
import AdminStatsCard from "@/components/admin/AdminStatsCard";

export default function ReservationPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<ReservationDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const pendingCount = reservations.filter(
      (r) => r.status === "PENDING"
  ).length;
  const confirmedCount = reservations.filter(
      (r) => r.status === "CONFIRMED"
  ).length;
  const completedCount = reservations.filter(
      (r) => r.status === "COMPLETED"
  ).length;
  const totalRevenue = reservations
      .filter((r) => r.status === "COMPLETED")
      .reduce((acc, r) => acc + r.totalPrice, 0);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchReservations();
    }
  }, [user]);

  const fetchReservations = async () => {
    try {
      const response = await request({
        method: "GET",
        url: "/api/reservations",
      });

      if (response.data.success) {
        setReservations(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReservation = async (reservationId: string) => {
    if (!confirm("Are you sure you want to delete this completed reservation? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await request({
        method: "DELETE",
        url: `/api/reservations/${reservationId}`,
      });

      if (response.data.success) {
        // Remove the deleted reservation from the list
        setReservations(prev => prev.filter(r => r.id !== reservationId));
        alert("Reservation deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
      alert("Failed to delete reservation. Please try again.");
    }
  };

  if (!user || user.role !== "ADMIN") {
    return (
        <PageContainer>
          <div className="p-6 text-center text-red-500">
            You must be an admin to view this page
          </div>
        </PageContainer>
    );
  }

  return (
      <PageContainer className="p-0">
        <PageHeader title="Reservations Management" username={user.email} />

        <div className="p-6 bg-gray-50 dark:bg-navy-900/50 min-h-[calc(100vh-16rem)]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <AdminStatsCard
                title="Pending Reservations"
                value={pendingCount}
                icon="calendar"
                trend="Awaiting confirmation"
                highlight={pendingCount > 0}
            />
            <AdminStatsCard
                title="Confirmed Reservations"
                value={confirmedCount}
                icon="calendar"
                trend="In progress"
            />
            <AdminStatsCard
                title="Completed Reservations"
                value={completedCount}
                icon="calendar"
                trend="Successfully finished"
            />
            <AdminStatsCard
                title="Total Revenue"
                value={`$${totalRevenue.toFixed(2)}`}
                icon="money"
                trend="From completed reservations"
            />
          </div>

          {loading ? (
              <div className="text-center">Loading reservations...</div>
          ) : (
              <ReservationsList
                  reservations={reservations}
                  onUpdate={fetchReservations}
                  onDelete={handleDeleteReservation} // Pass delete handler
              />
          )}
        </div>
      </PageContainer>
  );
}