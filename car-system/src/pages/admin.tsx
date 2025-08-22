import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { request } from "@/lib/api";
import { PageContainer } from "@/components/PageContaire";
import AdminStatsCard from "@/components/admin/AdminStatsCard";
import AdminQuickActions from "@/components/admin/AdminQuickActions";
import RecentActivities from "@/components/admin/RecentActivities";
import { GlobalSearch } from "@/components/GlobalSearch";
import { toast } from "react-toastify";
import type { Car, ReservationDTO } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { TrashIcon, EditIcon, CheckIcon, XIcon } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalCars: number;
  pendingReservations: number;
  totalRevenue: number;
  recentActivities: ReservationDTO[];
  cars: Car[];
}

export default function AdminPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersRes, carsRes, reservationsRes] = await Promise.all([
        request({ method: "GET", url: "/api/users" }),
        request({ method: "GET", url: "/api/cars?sort=createdAt,desc" }), // Sort by newest first
        request({ method: "GET", url: "/api/reservations" }),
      ]);

      const totalUsers = usersRes.data.data.length;
      const cars = carsRes.data.data;
      const totalCars = cars.length;

      const reservations = reservationsRes.data.data;
      const pendingReservations = reservations.filter(
          (r: any) => r.status === "PENDING"
      ).length;
      const totalRevenue = reservations
          .filter((r: any) => r.status === "COMPLETED")
          .reduce((acc: number, r: any) => acc + r.totalPrice, 0);

      const recentActivities = reservations
          .sort(
              (a: ReservationDTO, b: ReservationDTO) =>
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5);

      setStats({
        totalUsers,
        totalCars,
        pendingReservations,
        totalRevenue,
        recentActivities,
        cars,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCar = async (carId: number) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await request({
          method: "DELETE",
          url: `/api/cars/${carId}`,
        });
        toast.success("Car deleted successfully");
        fetchDashboardStats();
      } catch (error) {
        toast.error("Failed to delete car");
        console.error("Delete error:", error);
      }
    }
  };

  const handleToggleAvailability = async (carId: number, isAvailable: boolean) => {
    try {
      await request({
        method: "PATCH",
        url: `/api/cars/${carId}/availability`,
        data: { isAvailable },
      });
      toast.success(
          `Car marked as ${isAvailable ? "available" : "unavailable"}`
      );
      fetchDashboardStats();
    } catch (error) {
      toast.error("Failed to update car availability");
      console.error("Availability error:", error);
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

  if (loading) {
    return (
        <PageContainer>
          <div className="p-6 text-center">Loading dashboard...</div>
        </PageContainer>
    );
  }

  if (error) {
    return (
        <PageContainer>
          <div className="p-6 text-center text-red-500">{error}</div>
        </PageContainer>
    );
  }

  return (
      <PageContainer className="p-0">
        {/* Admin Header with Global Search */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-2xl">
          <div className="px-6 py-8">
            <div className="flex flex-col gap-6">
              {/* Header with title and button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
                  </div>
                  <p className="text-blue-100">Logged in as: {user.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="secondary" size="sm" className="flex-1 sm:flex-none">
                    <Link to="/car-create">
                      <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                      >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add New Car
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none">
                    <Link to="/admin/cars">Manage All Cars</Link>
                  </Button>
                </div>
              </div>

              {/* Global Search */}
              <div className="flex justify-center">
                <GlobalSearch className="w-full max-w-2xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-6 md:space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <AdminStatsCard
                title="Total Users"
                value={stats?.totalUsers || 0}
                icon="users"
                trend="Registered users"
            />
            <AdminStatsCard
                title="Total Cars"
                value={stats?.totalCars || 0}
                icon="cars"
                trend="Available vehicles"
            />
            <AdminStatsCard
                title="Pending Reservations"
                value={stats?.pendingReservations || 0}
                icon="calendar"
                trend="Require action"
                highlight={(stats?.pendingReservations || 0) > 0}
            />
            <AdminStatsCard
                title="Total Revenue"
                value={`$${(stats?.totalRevenue || 0).toFixed(2)}`}
                icon="money"
                trend="All-time earnings"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <AdminQuickActions
                  onRefresh={fetchDashboardStats}
                  carsCount={stats?.totalCars || 0}
                  pendingReservations={stats?.pendingReservations || 0}
              />
            </div>

            {/* Recent Activities */}
            <div className="lg:col-span-2">
              <RecentActivities
                  activities={stats?.recentActivities || []}
                  onActionComplete={fetchDashboardStats}
              />
            </div>
          </div>

          {/* Recent Cars Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Recently Added Cars</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/cars">View All</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.cars && stats.cars.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {stats.cars.slice(0, 8).map((car) => (
                        <Card key={car.id} className="hover:shadow-md transition-shadow">
                          <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
                            <img
                                src={car.imageUrl || "/cars/default-car.png"}
                                alt={`${car.make} ${car.model}`}
                                className="w-full h-full object-contain p-2"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/cars/default-car.png";
                                }}
                            />
                          </div>
                          <div className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{car.make} {car.model}</h3>
                                <p className="text-sm text-gray-600">{car.year} • {car.transmission}</p>
                              </div>
                              <div className="flex items-center gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                              car.isAvailable
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}>
                            {car.isAvailable ? "Available" : "Unavailable"}
                          </span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <p className="font-bold text-lg">
                                ${Number(car.pricePerDay).toFixed(2)}<span className="text-sm font-normal text-gray-500">/day</span>
                              </p>
                            </div>

                            <div className="flex justify-between gap-2 pt-2 border-t">
                              <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 gap-1"
                                  asChild
                              >
                                <Link to={`/admin/cars/edit/${car.id}`}>
                                  <EditIcon className="h-4 w-4" />
                                  Edit
                                </Link>
                              </Button>
                              <div className="flex items-center gap-1 px-2">
                                <Switch
                                    checked={car.isAvailable}
                                    onCheckedChange={(checked) => handleToggleAvailability(car.id, checked)}
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
                              <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 gap-1"
                                  onClick={() => handleDeleteCar(car.id)}
                              >
                                <TrashIcon className="h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </Card>
                    ))}
                  </div>
              ) : (
                  <div className="text-center py-8 text-gray-500">
                    No cars found. Add your first car to get started.
                  </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageContainer>
  );
}