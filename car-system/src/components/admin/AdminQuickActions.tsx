import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export default function AdminQuickAtcions() {
  const actions = [
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      href: "/users",
      icon: "users",
    },
    {
      title: "Pending Reservations",
      description: "Review and approve reservations",
      href: "/reservations",
      icon: "calendar",
    },
    // {
    //   title: "Reports",
    //   description: "View financial and usage reports",
    //   href: "/admin/reports",
    //   icon: "chart",
    // },
    // {
    //   title: "Settings",
    //   description: "Configure system settings",
    //   href: "/admin/settings",
    //   icon: "settings",
    // },
  ];

  return (
    <div
      className={cn(
        "rounded-xl",
        "bg-white/60 dark:bg-navy-800/60",
        "backdrop-blur-sm",
        "border border-gray-200 dark:border-navy-700",
        "shadow-sm",
        "dark:shadow-navy-900/50",
        "p-6"
      )}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Quick Actions
      </h2>
      <div className="space-y-2">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.href}
            className={cn(
              "flex items-center p-4 rounded-lg",
              "bg-white dark:bg-navy-800",
              "border border-gray-100 dark:border-navy-700",
              "transition-all duration-300",
              "hover:bg-gray-50 dark:hover:bg-navy-700",
              "hover:border-gray-200 dark:hover:border-navy-600",
              "group"
            )}
          >
            {/* Icon here */}
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {action.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
