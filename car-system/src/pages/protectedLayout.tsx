import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../components/AuthContext";
import Navbar from "@/components/Navbar";
import { useEffect } from "react";

export const ProtectedLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated, isLoading, verifyAuth } = useAuth();
  const navigate = useNavigate();

  // Re-verify auth status when component mounts - only run once
  useEffect(() => {
    verifyAuth();
  }, []); // Empty dependency array to only run once on mount

  // Handle authentication state and redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("Redirecting to /sign-in from ProtectedLayout");
      navigate({ to: "/sign-in", replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>{children}</main>
      <footer className="border-t border-gray-200 dark:border-navy-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Car Rental System. All rights
              reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
