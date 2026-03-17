"use client";

import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  const pages: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3">
      <p className="text-xs sm:text-sm text-blue-600">
        Showing {start} to {end} of {totalItems} results
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {pages.map((page, i) =>
          page === "..." ? (
            <span key={`dots-${i}`} className="px-1.5 sm:px-2 text-gray-400 text-sm">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "primary" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className="min-w-[28px] sm:min-w-[32px] text-xs sm:text-sm"
            >
              {page}
            </Button>
          )
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
