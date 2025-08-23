import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import CarCard from "@/components/CarCard";
import Pagination from "@/components/Pagination";
import type { Car, CarStats } from "@/types";
import { carService, type PaginatedResponse } from "@/lib/carService";

const Dashboard: React.FC = () => {
  const [carsData, setCarsData] = useState<PaginatedResponse<Car>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 12,
    first: true,
    last: true,
    numberOfElements: 0,
  });

  const [stats, setStats] = useState<CarStats>({
    totalCars: 0,
    availableCars: 0,
    activeReservations: 0,
    averagePrice: 0,
    pendingReservations: 0,
    totalRevenue: 0,
  });

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 12;

  const fetchData = async (page: number = 0) => {
    try {
      setLoading(true);
      setError(null);

      const [carsResponse, statsResponse] = await Promise.all([
        carService.getAvailableCarsPaginated(page, pageSize),
        carService.getCarStats(),
      ]);

      if (carsResponse && carsResponse.data) {
        // Process image URLs to ensure they point to the correct public path
        const processedCars = carsResponse.data.content.map(car => ({
          ...car,
          imageUrl: car.imageUrl
              ? `/cars/${car.imageUrl.split('/').pop()}`
              : '/default-car.png'
        }));

        setCarsData({
          ...carsResponse.data,
          content: processedCars
        });
      }

      if (statsResponse && statsResponse.data) {
        setStats({
          totalCars: statsResponse.data.totalCars || 0,
          availableCars: statsResponse.data.availableCars || 0,
          activeReservations: statsResponse.data.activeReservations || 0,
          averagePrice: statsResponse.data.averagePrice || 0,
          pendingReservations: statsResponse.data.pendingReservations || 0,
          totalRevenue: statsResponse.data.totalRevenue || 0,
        });
      }

      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(0);
  }, []);

  const handlePageChange = (page: number) => {
    fetchData(page);
    const carsSection = document.getElementById("cars-section");
    if (carsSection) {
      carsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading && currentPage === 0) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading dashboard...
            </p>
          </div>
        </div>
    );
  }

  if (error && currentPage === 0) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <button
                onClick={() => fetchData(0)}
                className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative h-[550px] overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-red-800">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white blur-3xl animate-pulse"></div>
              <div
                  className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-red-300 blur-3xl animate-pulse"
                  style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>

          <div className="absolute inset-0 bg-black/30" />
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="w-full lg:w-1/2 text-white z-10">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                Rent a car — <span className="text-red-200">quickly</span> and{" "}
                <span className="text-red-200">easily</span>!
              </h1>
              <p className="text-xl mb-8 text-gray-100 animate-slide-up max-w-xl leading-relaxed">
                Streamline your car rental experience with our effortless booking
                process and wide selection of premium vehicles.
              </p>
              <div
                  className="flex gap-4 animate-fade-in"
                  style={{ animationDelay: "0.5s" }}
              >
                <Link
                    to="/cars"
                    className="bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 flex items-center"
                >
                  Explore Cars
                  <svg
                      className="ml-2 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-1/2">
              <div className="relative w-full h-[450px]">
                <img
                    src="/cars/heroo.png"
                    alt="Featured Car"
                    className="object-contain w-full h-full animate-float"
                    style={{ filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.3))" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div className="container mx-auto px-4 -mt-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Available Cars",
                value: stats.availableCars,
                icon: (
                    <svg
                        className="w-10 h-10 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                      />
                    </svg>
                ),
                description: "Ready for immediate rental",
                color: "from-red-500 to-red-600",
                bgColor: "bg-red-50 dark:bg-red-900/20",
                delay: "0ms",
              },
              {
                title: "Active Reservations",
                value: stats.activeReservations,
                icon: (
                    <svg
                        className="w-10 h-10 text-red-500"
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
                description: "Current bookings in progress",
                color: "from-red-500 to-red-600",
                bgColor: "bg-red-50 dark:bg-red-900/20",
                delay: "150ms",
              },
              {
                title: "Average Price/Day",
                value: `$${(stats.averagePrice || 0).toFixed(2)}`,
                icon: (
                    <svg
                        className="w-10 h-10 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                ),
                description: "Average rental rate across fleet",
                color: "from-red-500 to-red-600",
                bgColor: "bg-red-50 dark:bg-red-900/20",
                delay: "300ms",
              },
            ].map((stat, index) => (
                <div
                    key={index}
                    className="card-hover bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-all duration-300 animate-fade-in-scale"
                    style={{ animationDelay: stat.delay }}
                >
                  <div className={`h-2 ${stat.color}`}></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                          {stat.title}
                        </h3>
                        <p
                            className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                        >
                          {stat.value}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                          {stat.description}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>

        {/* Car Listings */}
        <div id="cars-section" className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Available Cars
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {carsData.totalElements} cars available for rent
              </p>
            </div>
            <Link
                to="/cars"
                className="text-red-600 dark:text-red-400 hover:underline font-medium"
            >
              View all cars →
            </Link>
          </div>

          {loading && currentPage > 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
              Loading cars...
            </span>
              </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {carsData.content.map((car) => (
                <CarCard
                    key={car.id}
                    car={{
                      id: car.id.toString(),
                      make: car.make,
                      model: car.model,
                      year: car.year,
                      transmission: car.transmission,
                      pricePerDay: car.pricePerDay.toString(),
                      imageUrl: car.imageUrl,
                      isAvailable: car.isAvailable,
                    }}
                />
            ))}
          </div>

          {!loading && carsData.content.length === 0 && (
              <div className="text-center py-16">
                <div className="space-y-4">
                  <svg
                      className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <h3 className="text-xl text-gray-500 dark:text-gray-400">
                    No cars available at the moment
                  </h3>
                  <p className="text-gray-400 dark:text-gray-500">
                    Please check back later for new listings.
                  </p>
                </div>
              </div>
          )}

          {carsData.totalPages > 1 && (
              <Pagination
                  currentPage={carsData.number}
                  totalPages={carsData.totalPages}
                  totalElements={carsData.totalElements}
                  pageSize={carsData.size}
                  onPageChange={handlePageChange}
                  loading={loading}
              />
          )}
        </div>
      </div>
  );
};

export default Dashboard;