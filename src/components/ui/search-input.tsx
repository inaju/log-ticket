"use client";

import { Search } from "lucide-react";
import { InputHTMLAttributes, forwardRef } from "react";

const SearchInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        ref={ref}
        className={`w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors ${className}`}
        {...props}
      />
    </div>
  );
});

SearchInput.displayName = "SearchInput";
export { SearchInput };
