import { useEffect, useState } from "react";
import {useNavigate, useParams} from "@tanstack/react-router";
import type { Car } from "@/types";
import ReservationForm from "@/components/ReservationForm";
import { cn } from "@/lib/utils";
import { carService } from "@/lib/carService";
import { PageContainer } from "@/components/PageContaire";
import { getUser } from "@/lib/api";

export default function CarDetailsPage() {
  const { carId } = useParams({ from: "/protected/cars/$carId" });
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await carService.getCarById(Number(carId));
        if (response.success) {
          setCar(response.data);
        } else {
          setError("Failed to fetch car details");
        }
      } catch (err) {
        setError("Error loading car details");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  const handleReservationSuccess = (reservationId: number) => {
    // Use TanStack Router's navigation
    navigate({
      to: "/payment/$reservationId",
      params: { reservationId: reservationId.toString() }
    });
  };

  const formattedReservations =
      car?.reservations
          ?.filter((res) => res.status !== "COMPLETED")
          .map((res) => ({
            startDate: new Date(res.startDate),
            endDate: new Date(res.endDate),
            status: res.status as "PENDING" | "CONFIRMED" | "CANCELLED",
          })) || [];

  if (loading) {
    return (
        <PageContainer>
          <div>Loading...</div>
        </PageContainer>
    );
  }

  if (error || !car) {
    return (
        <PageContainer>
          <div>Error: {error || "Car not found"}</div>
        </PageContainer>
    );
  }

  return (
      <PageContainer className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 dark:bg-navy-900/50 rounded-xl border border-gray-200 dark:border-navy-700">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Reserve {car.make} {car.model}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete your reservation details below
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="relative h-64 rounded-xl overflow-hidden bg-gray-100 dark:bg-navy-900/50">
              <img
                  src={car.imageUrl || "/placeholder-car.png"}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Year", value: car.year },
                { label: "Transmission", value: car.transmission },
                { label: "Drive Type", value: car.driveType },
                {
                  label: "Price per day",
                  value: `$${Number(car.pricePerDay).toFixed(2)}`,
                  highlight: true,
                },
              ].map((detail) => (
                  <div
                      key={detail.label}
                      className="bg-gray-50 dark:bg-navy-900/50 p-4 rounded-lg border border-gray-200 dark:border-navy-700"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {detail.label}
                    </p>
                    <p
                        className={cn(
                            "font-semibold",
                            detail.highlight
                                ? "text-blue-600 dark:text-blue-400 text-lg"
                                : "text-gray-900 dark:text-white"
                        )}
                    >
                      {detail.value}
                    </p>
                  </div>
              ))}
            </div>
          </div>

          <ReservationForm
              carId={car.id}
              pricePerDay={car.pricePerDay}
              userId={getUser()?.id}
              existingReservations={formattedReservations}
              onReservationSuccess={handleReservationSuccess}
          />
        </div>
      </PageContainer>
  );
}