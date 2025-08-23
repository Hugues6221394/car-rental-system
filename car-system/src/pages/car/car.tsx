// src/pages/car/car.tsx
import { useEffect, useState } from "react";
import { carService, type PaginatedResponse } from "@/lib/carService";
import { getUser } from "@/lib/api";
import { PageContainer } from "@/components/PageContaire";
import CarCard from "@/components/CarCard";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import type { Car } from "@/types";

const CarsPage = () => {
  const [rentedCars, setRentedCars] = useState<Car[]>([]);
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

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const pageSize = 12;
  const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
  const user = getUser();
  const userName = user?.email || "Unknown User";

  const fetchCars = async (page: number = 0) => {
    try {
      setLoading(true);
      const [carsResponse, rented] = await Promise.all([
        carService.getAvailableCarsPaginated(page, pageSize),
        carService.getUserRentedCars(),
      ]);

      let carsPage = carsResponse?.data;
      if (carsPage && search) {
        carsPage = {
          ...carsPage,
          content: carsPage.content.filter(
              (car) =>
                  car.make.toLowerCase().includes(search.toLowerCase()) ||
                  car.model.toLowerCase().includes(search.toLowerCase())
          ),
          numberOfElements: carsPage.content.length,
        };
      }

      if (carsPage) {
        setCarsData(carsPage);
      }

      setRentedCars(rented);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to fetch cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReservationUpdate = () => {
    fetchCars(currentPage);
  };

  useEffect(() => {
    fetchCars(0);
  }, [search]);

  const handlePageChange = (page: number) => {
    fetchCars(page);
    const carsSection = document.getElementById("cars-section");
    if (carsSection) {
      carsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
      <PageContainer>
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back</p>
                <p className="font-semibold text-gray-900 dark:text-white">{userName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <SearchBar onSearch={setSearch} />
          </div>

          {rentedCars.length > 0 && (
              <section className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  Your Rented Cars
                  <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                {rentedCars.length}
              </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {rentedCars.map((car) => (
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
                            isRented: car.isRented,
                            reservations: car.reservations,
                          }}
                          showReserveButton={false}
                          showCancelButton={true}
                          currentDate={currentDate}
                          onReservationUpdate={handleReservationUpdate}
                      />
                  ))}
                </div>
              </section>
          )}

          <section id="cars-section" className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              Available Cars
              <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              {carsData.totalElements}
            </span>
            </h2>

            {loading && currentPage > 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Loading cars...</span>
                </div>
            ) : (
                <>
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
                              isRented: car.isRented,
                              reservations: car.reservations,
                            }}
                            showReserveButton={true}
                            showCancelButton={false}
                            currentDate={currentDate}
                            onReservationUpdate={handleReservationUpdate}
                        />
                    ))}
                  </div>

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

                  {!loading && carsData.content.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                        <div className="text-center space-y-4">
                          <svg className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <p className="text-gray-600 dark:text-gray-400">No cars found matching your search.</p>
                          <button onClick={() => setSearch("")} className="text-red-600 dark:text-red-400 hover:underline">
                            Clear search
                          </button>
                        </div>
                      </div>
                  )}
                </>
            )}
          </section>
        </div>
      </PageContainer>
  );
};

export default CarsPage;