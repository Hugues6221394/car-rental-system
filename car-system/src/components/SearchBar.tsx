// src/components/SearchBar.tsx
import { useDebounce } from "@/hooks/useDebouce";
import { useState, useEffect } from "react";

export interface SearchBarProps {
  /** Called with the debounced value whenever it changes */
  onSearch: (value: string) => void;
  /** Optionally set an initial value */
  initialValue?: string;
}

export default function SearchBar({
  onSearch,
  initialValue = "",
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, 300);

  // Whenever the debounced value updates, emit to parent
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className="relative w-full max-w-sm">
      <input
        type="text"
        placeholder="Search by make or model..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />
      <svg
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
}
