import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MeetingPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const MeetingPagination: React.FC<MeetingPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  if (totalItems === 0 || totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#251357]/80 text-xs">
      {/* Count Indicator */}
      <span className="text-slate-400 font-medium">
        Showing <span className="text-white font-semibold">{startItem}</span>–
        <span className="text-white font-semibold">{endItem}</span> of{" "}
        <span className="text-white font-semibold">{totalItems}</span> meetings
      </span>

      {/* Page Navigation */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-[#251357] bg-[#100730]/60 text-slate-300 hover:text-white hover:bg-[#1c104d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pageNumbers.map((num) => {
          const isActive = num === currentPage;
          return (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={cn(
                "w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                isActive
                  ? "bg-[#5925DC] text-white shadow-sm shadow-[#5925DC]/30"
                  : "border border-[#251357] bg-[#100730]/60 text-slate-400 hover:text-slate-200 hover:bg-[#1c104d]"
              )}
            >
              {num}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-[#251357] bg-[#100730]/60 text-slate-300 hover:text-white hover:bg-[#1c104d] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

