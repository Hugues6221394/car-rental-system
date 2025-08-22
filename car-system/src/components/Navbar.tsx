import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import NotificationIcon from '@/components/NotificationIcon';
import { auth } from "@/lib/api";

export default function Navbar() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      auth.signOut();
      navigate({ to: "/sign-in" });
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  return (
      <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/20 supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
                to="/"
                className="flex items-center space-x-2 group transition-all duration-300"
            >
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              Car Rental
            </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-all duration-200"
              >
                Dashboard
              </Link>

              {user?.role === "ADMIN" && (
                  <>
                    <Link
                        to="/admin"
                        className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                    >
                      Admin
                    </Link>
                    <Link
                        to="/reservations"
                        className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                    >
                      Reservations
                    </Link>
                  </>
              )}

              <Link
                  to="/cars"
                  className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-all duration-200"
              >
                Cars
              </Link>

              {/* Add Contact Link */}
              <Link
                  to="/contact"
                  className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-all duration-200"
              >
                Contact
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              {isAuthenticated && <NotificationIcon />}

              {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-r-transparent"></div>
                    <span className="text-sm text-muted-foreground">
                  Loading...
                </span>
                  </div>
              ) : isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    {user && (
                        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-accent/30 backdrop-blur-sm">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                          </div>
                          <span className="text-sm font-medium text-foreground/80">
                      {user.email?.split("@")[0]}
                    </span>
                        </div>
                    )}

                    <Link
                        to="/profile"
                        className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                    >
                      My Profile
                    </Link>

                    <Button
                        variant="outline"
                        onClick={handleSignOut}
                        className="border-border/30 hover:border-border/60 transition-colors duration-200"
                    >
                      Sign Out
                    </Button>
                  </div>
              ) : (
                  <Button
                      onClick={() => navigate({ to: "/sign-in" })}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                <span className="flex items-center space-x-2">
                  <span>Sign In</span>
                  <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"
                    />
                  </svg>
                </span>
                  </Button>
              )}
            </div>
          </div>
        </div>

        {/* Animated border bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      </nav>
  );
}