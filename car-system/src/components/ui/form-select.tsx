import { cn } from "@/lib/utils";
import React from "react";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>
      <select
        className={cn(
          "block w-full rounded-md border-gray-300 shadow-sm",
          "focus:border-blue-500 focus:ring-blue-500",
          "dark:border-gray-600 dark:bg-gray-700",
          "dark:text-white dark:focus:border-blue-500",
          "sm:text-sm",
          className
        )}
        {...props}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
