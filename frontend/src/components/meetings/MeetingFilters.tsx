import React from "react";
import { ArrowDownWideNarrow, Calendar, Filter, Layers, RotateCcw, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MeetingFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  workspace: string;
  onWorkspaceChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const MeetingFilters: React.FC<MeetingFiltersProps> = ({
  search,
  onSearchChange,
  workspace,
  onWorkspaceChange,
  dateFilter,
  onDateFilterChange,
  sortBy,
  onSortChange,
  onResetFilters,
  hasActiveFilters,
}) => {
  const workspaceOptions = [
    "All Workspaces",
    "Engineering Syncs",
    "Product & Design",
    "Client Reviews",
  ];

  const dateOptions = [
    { label: "All Time", value: "all" },
    { label: "Today", value: "today" },
    { label: "Last 7 Days", value: "7days" },
    { label: "Last 30 Days", value: "30days" },
  ];

  const sortOptions = [
    { label: "Newest First", value: "newest" },
    { label: "Oldest First", value: "oldest" },
    { label: "Longest Duration", value: "longest" },
    { label: "Shortest Duration", value: "shortest" },
  ];

  return (
    <div className="space-y-3.5 bg-[#160c3d]/90 border border-[#2b1764]/90 rounded-xl p-4 backdrop-blur-sm">
      {/* Top Search & Reset Row */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Box */}
        <div className="relative w-full flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, meeting code, or participant name..."
            className="w-full pl-9 pr-9 py-2 text-xs bg-[#100730]/90 text-slate-200 placeholder-slate-400 rounded-lg border border-[#251357] focus:outline-none focus:ring-1 focus:ring-[#5925DC] focus:border-[#5925DC] transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Clear Filters Button if active */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-purple-300 hover:bg-[#1c104d]/60 rounded-lg border border-[#251357] transition-colors cursor-pointer w-full sm:w-auto justify-center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Filter Options Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#251357]/60">
        {/* Workspace Pill Toggles */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden lg:inline">
            Workspace:
          </span>
          {workspaceOptions.map((ws) => {
            const isSelected = workspace === ws;
            return (
              <button
                key={ws}
                onClick={() => onWorkspaceChange(ws)}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer border",
                  isSelected
                    ? "bg-[#5925DC] text-white border-[#7A5BF8] shadow-sm shadow-[#5925DC]/25"
                    : "bg-[#100730]/70 text-slate-400 border-[#251357] hover:text-slate-200 hover:border-[#381c7e]"
                )}
              >
                {ws}
              </button>
            );
          })}
        </div>

        {/* Dropdown Filters (Date & Sort) */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Date Filter Dropdown */}
          <div className="relative flex items-center">
            <Calendar className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={dateFilter}
              onChange={(e) => onDateFilterChange(e.target.value)}
              className="pl-8 pr-7 py-1.5 text-xs bg-[#100730]/90 text-slate-300 rounded-lg border border-[#251357] focus:outline-none focus:ring-1 focus:ring-[#5925DC] appearance-none cursor-pointer hover:border-[#381c7e] transition-colors"
            >
              {dateOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#160c3d] text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex items-center">
            <ArrowDownWideNarrow className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="pl-8 pr-7 py-1.5 text-xs bg-[#100730]/90 text-slate-300 rounded-lg border border-[#251357] focus:outline-none focus:ring-1 focus:ring-[#5925DC] appearance-none cursor-pointer hover:border-[#381c7e] transition-colors"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#160c3d] text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

