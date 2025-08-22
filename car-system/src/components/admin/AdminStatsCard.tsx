import { cn } from "@/lib/utils";

type AdminStatsCardProps = {
  title: string;
  value: string | number;
  icon: "users" | "cars" | "calendar" | "money";
  trend: string;
  highlight?: boolean;
};

export default function AdminStatsCard({
  title,
  value,
  icon,
  trend,
  highlight = false,
}: AdminStatsCardProps) {
  const icons = {
    users: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    cars: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm-5 14h4m-4-3h4m-4-3h4M9 9h1.5m-1.5 3h1.5m-1.5 3h1.5M6 9h.5m-.5 3h.5m-.5 3h.5"
        />
      </svg>
    ),
    calendar: (
      <svg
        className="w-6 h-6"
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
    money: (
      <svg
        className="w-6 h-6"
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
  };

  return (
    <div
      className={cn(
        "rounded-xl",
        "p-6 transition-all duration-300",
        "bg-white/60 dark:bg-navy-800/60",
        "backdrop-blur-sm",
        "border border-gray-200 dark:border-navy-700",
        "hover:bg-white dark:hover:bg-navy-800",
        "shadow-sm hover:shadow-md",
        "dark:shadow-navy-900/50 dark:hover:shadow-navy-900/70",
        highlight && "ring-2 ring-blue-500 dark:ring-blue-400"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={cn(
            "p-2 rounded-lg",
            "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          )}
        >
          {icons[icon]}
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {trend}
        </span>
      </div>
      <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
        {title}
      </h3>
      <p
        className={cn(
          "text-2xl font-bold",
          "bg-clip-text text-transparent",
          "bg-gradient-to-r from-blue-600 to-blue-800",
          "dark:from-blue-400 dark:to-blue-600"
        )}
      >
        {value}
      </p>
    </div>
  );
}
