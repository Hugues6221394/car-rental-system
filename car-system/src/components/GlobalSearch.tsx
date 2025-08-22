import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { request } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Search,
  X,
  User,
  Car,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";

interface SearchResult {
  id: number;
  type: "user" | "car" | "reservation";
  title: string;
  subtitle: string;
  description?: string;
  status?: string;
  href: string;
}

interface GlobalSearchProps {
  className?: string;
}

export function GlobalSearch({ className }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load recent searches from component state on mount
  useEffect(() => {
    const saved = localStorage.getItem("admin_recent_searches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent searches:", e);
      }
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) return;

      const updated = [
        searchQuery,
        ...recentSearches.filter((s) => s !== searchQuery),
      ].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("admin_recent_searches", JSON.stringify(updated));
    },
    [recentSearches]
  );

  // Perform search
  const searchData = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const [usersRes, carsRes, reservationsRes] = await Promise.all([
        request({ method: "GET", url: "/api/users" }).catch(() => ({
          data: { data: [] },
        })),
        request({ method: "GET", url: "/api/cars" }).catch(() => ({
          data: { data: [] },
        })),
        request({ method: "GET", url: "/api/reservations" }).catch(() => ({
          data: { data: [] },
        })),
      ]);

      const searchResults: SearchResult[] = [];
      const lowerQuery = searchQuery.toLowerCase();

      // Search users
      if (usersRes.data?.data) {
        usersRes.data.data
          .filter(
            (user: any) =>
              user.email?.toLowerCase().includes(lowerQuery) ||
              user.firstName?.toLowerCase().includes(lowerQuery) ||
              user.lastName?.toLowerCase().includes(lowerQuery) ||
              user.id?.toString().includes(lowerQuery)
          )
          .slice(0, 5)
          .forEach((user: any) => {
            searchResults.push({
              id: user.id,
              type: "user",
              title:
                `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                user.email,
              subtitle: user.email,
              description: `Role: ${user.role}`,
              href: "/users",
            });
          });
      }

      // Search cars
      if (carsRes.data?.data) {
        carsRes.data.data
          .filter(
            (car: any) =>
              car.make?.toLowerCase().includes(lowerQuery) ||
              car.model?.toLowerCase().includes(lowerQuery) ||
              car.licensePlate?.toLowerCase().includes(lowerQuery) ||
              car.id?.toString().includes(lowerQuery)
          )
          .slice(0, 5)
          .forEach((car: any) => {
            searchResults.push({
              id: car.id,
              type: "car",
              title: `${car.make} ${car.model}`,
              subtitle: `${car.year} • ${car.licensePlate}`,
              description: `$${car.pricePerDay}/day`,
              status: car.isAvailable ? "Available" : "Unavailable",
              href: `/cars/${car.id}`,
            });
          });
      }

      // Search reservations
      if (reservationsRes.data?.data) {
        reservationsRes.data.data
          .filter(
            (reservation: any) =>
              reservation.userEmail?.toLowerCase().includes(lowerQuery) ||
              reservation.carDetails?.toLowerCase().includes(lowerQuery) ||
              reservation.id?.toString().includes(lowerQuery)
          )
          .slice(0, 5)
          .forEach((reservation: any) => {
            searchResults.push({
              id: reservation.id,
              type: "reservation",
              title: `Reservation #${reservation.id}`,
              subtitle: reservation.userEmail,
              description: reservation.carDetails,
              status: reservation.status,
              href: "/reservations",
            });
          });
      }

      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        searchData(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchData]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        // Open search with Ctrl+K or Cmd+K
        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
          e.preventDefault();
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }
        return;
      }

      switch (e.key) {
        case "Escape":
          setIsOpen(false);
          setQuery("");
          setSelectedIndex(-1);
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query);
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(-1);
    navigate({ to: result.href });
  };

  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("admin_recent_searches");
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case "user":
        return <User className="w-4 h-4" />;
      case "car":
        return <Car className="w-4 h-4" />;
      case "reservation":
        return <Calendar className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Available":
        return "text-green-600 dark:text-green-400";
      case "Unavailable":
        return "text-red-600 dark:text-red-400";
      case "PENDING":
        return "text-yellow-600 dark:text-yellow-400";
      case "CONFIRMED":
        return "text-blue-600 dark:text-blue-400";
      case "COMPLETED":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      {/* Search Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className={cn(
          "flex items-center gap-3 px-4 py-2 rounded-lg",
          "bg-white/60 dark:bg-navy-800/60 backdrop-blur-sm",
          "border border-gray-200 dark:border-navy-700",
          "hover:bg-white dark:hover:bg-navy-800",
          "transition-all duration-200",
          "text-gray-500 dark:text-gray-400",
          "w-full max-w-md"
        )}
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">
          Search users, cars, reservations...
        </span>
        <kbd className="hidden sm:inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-navy-700 rounded border">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <div
            className={cn(
              "w-full max-w-2xl mx-4",
              "bg-white dark:bg-navy-800",
              "rounded-xl shadow-2xl",
              "border border-gray-200 dark:border-navy-700",
              "overflow-hidden"
            )}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-navy-700">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users, cars, reservations..."
                className={cn(
                  "flex-1 bg-transparent outline-none",
                  "text-gray-900 dark:text-white",
                  "placeholder-gray-500 dark:placeholder-gray-400"
                )}
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-navy-700 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              )}

              {!loading && query && results.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No results found for "{query}"
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="py-2">
                  {results.map((result, index) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3",
                        "hover:bg-gray-50 dark:hover:bg-navy-700",
                        "transition-colors duration-150",
                        selectedIndex === index && "bg-gray-50 dark:bg-navy-700"
                      )}
                    >
                      <div className="p-2 bg-gray-100 dark:bg-navy-700 rounded-lg">
                        {getResultIcon(result.type)}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {result.title}
                          </span>
                          {result.status && (
                            <span
                              className={cn(
                                "text-xs",
                                getStatusColor(result.status)
                              )}
                            >
                              {result.status}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {result.subtitle}
                        </div>
                        {result.description && (
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {result.description}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              )}

              {/* Recent Searches */}
              {!query && recentSearches.length > 0 && (
                <div className="py-2">
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearchClick(search)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2",
                        "hover:bg-gray-50 dark:hover:bg-navy-700",
                        "transition-colors duration-150"
                      )}
                    >
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="flex-1 text-left text-gray-700 dark:text-gray-300">
                        {search}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!query && recentSearches.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Start typing to search users, cars, and reservations</p>
                  <p className="text-xs mt-1">Use ⌘K to quickly open search</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
