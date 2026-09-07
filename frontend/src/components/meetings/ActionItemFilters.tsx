import React from "react";
import {
  ArrowDownWideNarrow,
  Calendar,
  Layers,
  RotateCcw,
  Search,
  User as UserIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActionItemFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: "all" | "open" | "completed";
  onStatusFilterChange: (value: "all" | "open" | "completed") => void;
  assigneeFilter: string;
  onAssigneeFilterChange: (value: string) => void;
  availableAssignees: string[];
  workspaceFilter: string;
  onWorkspaceFilterChange: (value: string) => void;
  dueDateFilter: string;
  onDueDateFilterChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const ActionItemFilters: React.FC<ActionItemFiltersProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  assigneeFilter,
  onAssigneeFilterChange,
  availableAssignees,
  workspaceFilter,
  onWorkspaceFilterChange,
  dueDateFilter,
  onDueDateFilterChange,
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

  const dueDateOptions = [
    { label: "All Due Dates", value: "all" },
    { label: "Overdue", value: "overdue" },
    { label: "Today", value: "today" },
    { label: "This Week", value: "this_week" },
    { label: "No Due Date", value: "none" },
  ];

  const sortOptions = [
    { label: "Sort: Due Date", value: "due_date" },
    { label: "Sort: Newest", value: "newest" },
    { label: "Sort: Oldest", value: "oldest" },
    { label: "Sort: Assignee A–Z", value: "assignee" },
  ];

  return (
    <div className="space-y-3.5 bg-[#160c3d]/90 border border-[#2b1764]/90 rounded-xl p-4 backdrop-blur-sm">
      {/* Top Search & Status Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Box */}
        <div className="relative w-full flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks, assignees, or meeting titles..."
            className="w-full pl-9 pr-9 py-2 text-xs bg-[#100730]/90 text-slate-200 placeholder-slate-400 rounded-lg border border-[#251357] focus:outline-none focus:ring-1 focus:ring-[#5925DC] focus:border-[#5925DC] transition-all"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1 bg-[#100730]/80 p-1 rounded-lg border border-[#251357] w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => onStatusFilterChange("all")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex-1 sm:flex-initial text-center",
              statusFilter === "all"
                ? "bg-[#5925DC] text-white shadow-sm shadow-[#5925DC]/25"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            All Tasks
          </button>
          <button
            onClick={() => onStatusFilterChange("open")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex-1 sm:flex-initial text-center",
              statusFilter === "open"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            Open
          </button>
          <button
            onClick={() => onStatusFilterChange("completed")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer flex-1 sm:flex-initial text-center",
              statusFilter === "completed"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            Completed
          </button>
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-purple-300 hover:bg-[#1c104d]/60 rounded-lg border border-[#251357] transition-colors cursor-pointer w-full sm:w-auto justify-center"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Dropdown Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-[#251357]/60">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Assignee Filter Dropdown */}
          <div className="relative flex items-center min-w-[140px]">
            <UserIcon className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={assigneeFilter}
              onChange={(e) => onAssigneeFilterChange(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#100730]/90 text-slate-300 rounded-lg border border-[#251357] focus:outline-none focus:ring-1 focus:ring-[#5925DC] appearance-none cursor-pointer hover:border-[#381c7e] transition-colors"
            >
              <option value="All Assignees">All Assignees</option>
              {availableAssignees.map((name) => (
                <option key={name} value={name} className="bg-[#160c3d] text-slate-200">
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Workspace Filter Dropdown */}
          <div className="relative flex items-center min-w-[140px]">
            <Layers className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={workspaceFilter}
              onChange={(e) => onWorkspaceFilterChange(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#100730]/90 text-slate-300 rounded-lg border border-[#251357] focus:outline-none focus:ring-1 focus:ring-[#5925DC] appearance-none cursor-pointer hover:border-[#381c7e] transition-colors"
            >
              {workspaceOptions.map((ws) => (
                <option key={ws} value={ws} className="bg-[#160c3d] text-slate-200">
                  {ws}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date Filter Dropdown */}
          <div className="relative flex items-center min-w-[130px]">
            <Calendar className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              value={dueDateFilter}
              onChange={(e) => onDueDateFilterChange(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#100730]/90 text-slate-300 rounded-lg border border-[#251357] focus:outline-none focus:ring-1 focus:ring-[#5925DC] appearance-none cursor-pointer hover:border-[#381c7e] transition-colors"
            >
              {dueDateOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#160c3d] text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex items-center w-full sm:w-auto justify-end">
          <ArrowDownWideNarrow className="absolute left-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full sm:w-auto pl-8 pr-7 py-1.5 text-xs bg-[#100730]/90 text-slate-300 rounded-lg border border-[#251357] focus:outline-none focus:ring-1 focus:ring-[#5925DC] appearance-none cursor-pointer hover:border-[#381c7e] transition-colors"
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
  );
};

