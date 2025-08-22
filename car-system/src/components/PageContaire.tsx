import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-navy-900/50 p-6">
      <div
        className={cn(
          // Base container styles
          "bg-white dark:bg-navy-800",
          "rounded-2xl shadow-sm dark:shadow-navy-900/50",
          "border border-gray-200 dark:border-navy-700",
          // Internal padding and spacing
          "p-6",
          // Additional classes
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
