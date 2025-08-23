import { useNavigate } from "@tanstack/react-router";
import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TrashIcon, CheckIcon, XIcon } from "lucide-react";

type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

type CarCardProps = {
  car: {
    id: string;
    make: string;
    model: string;
    year: number;
    transmission: string;
    pricePerDay: string;
    imageUrl: string | null;
    isAvailable: boolean;
    isRented?: boolean;
    reservations?: {
      status: ReservationStatus;
      createdAt: Date;
    }[];
  };
  showReserveButton?: boolean;
  currentDate?: string;
  onToggleAvailability?: (isAvailable: boolean) => void;
  onDelete?: () => void;
};

const CarCard: React.FC<CarCardProps> = ({
                                           car,
                                           showReserveButton = true,
                                           currentDate,
                                           onToggleAvailability,
                                           onDelete,
                                         }) => {
  const navigate = useNavigate();

  // Function to get the correct image path - FIXED
  const getImagePath = (imageUrl: string | null) => {
    console.log('Image URL received from backend:', imageUrl);

    if (!imageUrl) {
      console.log('No image URL provided, using default car image');
      return "/cars/default-car.png";
    }

    // If it's already a full URL (http/https)
    if (imageUrl.startsWith('http')) {
      console.log('Full URL detected:', imageUrl);
      return imageUrl;
    }

    // If it's a relative path starting with /cars/ (what your backend returns)
    if (imageUrl.startsWith('/cars/')) {
      console.log('Relative cars path detected:', imageUrl);
      return imageUrl;
    }

    // If it's just a filename without path (fallback)
    if (!imageUrl.startsWith('/')) {
      const constructedPath = `/cars/${imageUrl}`;
      console.log('Constructed cars path from filename:', constructedPath);
      return constructedPath;
    }

    // For any other absolute paths that don't start with /cars/
    console.log('Other absolute path, using as-is:', imageUrl);
    return imageUrl;
  };
  const isCarAvailable = () => {
    if (!car.isAvailable) return false;
    if (!car.reservations || car.reservations.length === 0) return true;

    const hasConfirmedReservation = car.reservations.some(
        (reservation) => reservation.status === "CONFIRMED"
    );

    const hasPendingReservation = car.reservations.some((reservation) => {
      if (reservation.status === "PENDING") {
        const minutesAgo =
            (new Date().getTime() - new Date(reservation.createdAt).getTime()) /
            1000 /
            60;
        return minutesAgo < 30;
      }
      return false;
    });

    return !hasConfirmedReservation && !hasPendingReservation;
  };

  const getAvailabilityMessage = () => {
    if (!car.isAvailable) return "Currently Rented";
    if (car.reservations?.some((res) => res.status === "CONFIRMED")) return "Reserved";
    if (
        car.reservations?.some((res) => {
          if (res.status === "PENDING") {
            const minutesAgo =
                (new Date().getTime() - new Date(res.createdAt).getTime()) /
                1000 /
                60;
            return minutesAgo < 30;
          }
          return false;
        })
    ) {
      return "Reservation in Progress";
    }
    return "Available";
  };

  const getStatusColor = () => {
    const status = getAvailabilityMessage();
    switch (status) {
      case "Available":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
      case "Reserved":
      case "Currently Rented":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
      case "Reservation in Progress":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800";
    }
  };

  return (
      <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:shadow-gray-900/50 overflow-hidden">
        {/* Admin actions */}
        {(onToggleAvailability || onDelete) && (
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              {onToggleAvailability && (
                  <div className="flex items-center space-x-2 bg-white/90 p-1 rounded-md">
                    <Switch
                        checked={car.isAvailable}
                        onCheckedChange={onToggleAvailability}
                        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                    />
                    <span className="text-xs">
                {car.isAvailable ? (
                    <CheckIcon className="h-3 w-3 text-green-600" />
                ) : (
                    <XIcon className="h-3 w-3 text-red-600" />
                )}
              </span>
                  </div>
              )}
              {onDelete && (
                  <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-full bg-white/90 hover:bg-red-100"
                      onClick={onDelete}
                  >
                    <TrashIcon className="w-4 h-4 text-red-600" />
                  </Button>
              )}
            </div>
        )}

        {/* Car Image */}
        <div className="relative h-48 bg-gray-100 dark:bg-gray-900/50">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <img
              src={getImagePath(car.imageUrl)}
              alt={`${car.make} ${car.model}`}
              className="h-full w-full object-cover p-2 transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                console.error('Failed to load image:', e.target);
                (e.target as HTMLImageElement).src = '/cars/default-car.png';
              }}
          />
        </div>

        {/* Car Details */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            {car.make} {car.model}
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {[
              {
                icon: (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                ),
                value: car.year,
              },
              {
                icon: (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                ),
                value: car.transmission,
              },
            ].map((spec, index) => (
                <div
                    key={index}
                    className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="mr-2">{spec.icon}</span>
                  {spec.value}
                </div>
            ))}
          </div>

          <div className="mb-4">
          <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
          >
            {getAvailabilityMessage()}
          </span>
          </div>

          {currentDate && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {currentDate}
                </p>
              </div>
          )}

          <div className="flex justify-between items-center mt-6">
            <div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Price per day
            </span>
              <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800 dark:from-red-400 dark:to-red-600">
                ${Number(car.pricePerDay).toFixed(2)}
              </p>
            </div>

            {showReserveButton && (
                <button
                    onClick={() => navigate({ to: `/cars/${car.id}` })}
                    disabled={!isCarAvailable()}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                        isCarAvailable()
                            ? "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                    }`}
                >
                  {isCarAvailable() ? "Reserve Now" : "Not Available"}
                </button>
            )}
          </div>
        </div>
      </div>
  );
};

export default CarCard;