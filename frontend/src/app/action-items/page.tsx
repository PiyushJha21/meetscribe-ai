"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  AlertCircle,
  CheckSquare,
  ListTodo,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  ActionItemFilters,
  ActionItemStats,
  ActionItemsTable,
  MeetingPagination,
  getMeetingWorkspace,
} from "@/components/meetings";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getAllActionItems, updateActionItem } from "@/services/api";
import { ActionItem } from "@/types";

const ITEMS_PER_PAGE = 10;

export default function ActionItemsPage() {
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Filters State
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "completed">("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("All Assignees");
  const [workspaceFilter, setWorkspaceFilter] = useState<string>("All Workspaces");
  const [dueDateFilter, setDueDateFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("due_date");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchActionItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getAllActionItems();
      setActionItems(data);
    } catch (err) {
      console.error("Failed to load global action items:", err);
      setError("Unable to load action items. Please ensure the backend is running.");
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  }, []);

  useEffect(() => {
    fetchActionItems();
  }, [fetchActionItems]);

  // Extract unique assignees for filter dropdown
  const availableAssignees = useMemo(() => {
    const names = new Set<string>();
    actionItems.forEach((item) => {
      if (item.assignee) names.add(item.assignee);
    });
    return Array.from(names).sort();
  }, [actionItems]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, assigneeFilter, workspaceFilter, dueDateFilter, sortBy]);

  // Client-side filtering
  const filteredItems = useMemo(() => {
    return actionItems.filter((item) => {
      // 1. Search Query
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesTask = item.task.toLowerCase().includes(q);
        const matchesAssignee = item.assignee ? item.assignee.toLowerCase().includes(q) : false;
        const matchesMeeting = item.meeting_title ? item.meeting_title.toLowerCase().includes(q) : false;
        const matchesCode = item.meeting_code ? item.meeting_code.toLowerCase().includes(q) : false;
        if (!matchesTask && !matchesAssignee && !matchesMeeting && !matchesCode) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter === "open" && item.is_completed) return false;
      if (statusFilter === "completed" && !item.is_completed) return false;

      // 3. Assignee Filter
      if (assigneeFilter !== "All Assignees" && item.assignee !== assigneeFilter) {
        return false;
      }

      // 4. Workspace Filter
      if (workspaceFilter !== "All Workspaces") {
        const ws = getMeetingWorkspace(item.meeting_title || "").name;
        const normalize = (val: string) =>
          val
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]/g, "");
        if (normalize(ws) !== normalize(workspaceFilter)) return false;
      }

      // 5. Due Date Filter
      if (dueDateFilter !== "all") {
        if (!item.due_date) {
          return dueDateFilter === "none";
        }
        if (dueDateFilter === "none") return false;

        const due = new Date(item.due_date);
        const now = new Date(2026, 8, 7); // Sept 7, 2026 seed baseline
        const diffMs = due.getTime() - now.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (dueDateFilter === "overdue" && diffDays >= 0) return false;
        if (dueDateFilter === "today" && (diffDays < -1 || diffDays > 1)) return false;
        if (dueDateFilter === "this_week" && (diffDays < 0 || diffDays > 7)) return false;
      }

      return true;
    });
  }, [actionItems, search, statusFilter, assigneeFilter, workspaceFilter, dueDateFilter]);

  // Client-side sorting
  const sortedItems = useMemo(() => {
    const list = [...filteredItems];
    if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortBy === "assignee") {
      list.sort((a, b) => (a.assignee || "").localeCompare(b.assignee || ""));
    } else {
      // Due Date Default (nulls last)
      list.sort((a, b) => {
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      });
    }
    return list;
  }, [filteredItems, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedItems.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedItems, currentPage]);

  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "all" ||
    assigneeFilter !== "All Assignees" ||
    workspaceFilter !== "All Workspaces" ||
    dueDateFilter !== "all" ||
    sortBy !== "due_date";

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setAssigneeFilter("All Assignees");
    setWorkspaceFilter("All Workspaces");
    setDueDateFilter("all");
    setSortBy("due_date");
    setCurrentPage(1);
  };

  // Checkbox completion toggle with optimistic update
  const handleToggleCompletion = async (item: ActionItem) => {
    const nextCompleted = !item.is_completed;
    setTogglingId(item.id);

    // Optimistic UI update
    setActionItems((prev) =>
      prev.map((a) => (a.id === item.id ? { ...a, is_completed: nextCompleted } : a))
    );

    try {
      await updateActionItem(item.id, { is_completed: nextCompleted });
    } catch (err) {
      console.error("Failed to update action item:", err);
      // Rollback
      setActionItems((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, is_completed: item.is_completed } : a))
      );
    } finally {
      setTogglingId(null);
    }
  };

  // Metrics
  const totalTasks = actionItems.length;
  const openTasks = actionItems.filter((i) => !i.is_completed).length;
  const completedTasks = actionItems.filter((i) => i.is_completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Action Items
            </h1>
            <Badge variant="indigo" size="sm">
              <CheckSquare className="w-3 h-3 mr-1 inline" />
              {totalTasks} Total
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Track and manage tasks generated from all your meetings.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
          New Task
        </Button>
      </div>

      {/* Overview Metric Stats */}
      <ActionItemStats
        totalCount={totalTasks}
        openCount={openTasks}
        completedCount={completedTasks}
      />

      {/* Filter and Search Bar */}
      <ActionItemFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        assigneeFilter={assigneeFilter}
        onAssigneeFilterChange={setAssigneeFilter}
        availableAssignees={availableAssignees}
        workspaceFilter={workspaceFilter}
        onWorkspaceFilterChange={setWorkspaceFilter}
        dueDateFilter={dueDateFilter}
        onDueDateFilterChange={setDueDateFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Content */}
      {error ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-6 space-y-4">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-semibold text-white">Unable to load tasks</h3>
            <p className="text-xs text-slate-400">{error}</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />}
            onClick={() => {
              setIsRetrying(true);
              fetchActionItems();
            }}
            disabled={isRetrying}
          >
            {isRetrying ? "Reconnecting..." : "Retry"}
          </Button>
        </div>
      ) : isLoading ? (
        <div className="space-y-3 animate-pulse">
          <Card className="h-14 bg-[#160c3d]/60 border-[#2b1764]/60" />
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="h-16 bg-[#160c3d]/60 border-[#2b1764]/60" />
          ))}
        </div>
      ) : sortedItems.length === 0 ? (
        <EmptyState
          icon={<ListTodo className="w-6 h-6" />}
          title="No action items found"
          description="We couldn't find any tasks matching your current search or filter criteria."
          action={
            hasActiveFilters && (
              <Button variant="secondary" size="sm" onClick={handleResetFilters}>
                Clear All Filters
              </Button>
            )
          }
          className="py-16"
        />
      ) : (
        <div className="space-y-4">
          {/* Action Items Table / Mobile Cards */}
          <ActionItemsTable
            items={paginatedItems}
            onToggleCompletion={handleToggleCompletion}
            togglingId={togglingId}
          />

          {/* Pagination Controls */}
          <MeetingPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedItems.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
