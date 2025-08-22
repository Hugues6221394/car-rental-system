import Navbar from "@/components/Navbar";
import { Outlet } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const PublicLayout = () => {
  return (
      <div className="min-h-screen">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <footer className="border-t border-gray-200 dark:border-navy-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} Car Rental System. All rights
                reserved.
              </p>
              <div className="flex items-center gap-4">
                <Link
                    to="/contact"
                    className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  Contact
                </Link>
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