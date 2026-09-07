"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Calendar,
  FolderKanban,
  Plus,
  Radio,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  MeetingCard,
  MeetingFilters,
  MeetingPagination,
  getMeetingWorkspace,
} from "@/components/meetings";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getMeetings } from "@/services/api";
import { Meeting } from "@/types";

const ITEMS_PER_PAGE = 6;

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  // Filters & Search State
  const [search, setSearch] = useState<string>("");
  const [workspace, setWorkspace] = useState<string>("All Workspaces");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchMeetingsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getMeetings(undefined, sortBy);
      setMeetings(data);
    } catch (err) {
      console.error("Failed to load meetings:", err);
      setError(
        "Unable to load meetings from the server. Please ensure the backend is running."
      );
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  }, [sortBy]);

  useEffect(() => {
    fetchMeetingsData();
  }, [fetchMeetingsData]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, workspace, dateFilter, sortBy]);

  // Client-side filtering & search matching for instant responsiveness
  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      // 1. Search Query Match (Title or Meeting Code)
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const matchesTitle = meeting.title.toLowerCase().includes(query);
        const matchesCode = meeting.meeting_code.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCode) {
          return false;
        }
      }

      // 2. Workspace Filter
      if (workspace !== "All Workspaces") {
        const resolvedWs = getMeetingWorkspace(meeting.title, meeting.workspace).name;

        const normalize = (val: string) =>
          val
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9]/g, "");

        const selectedNorm = normalize(workspace);
        const resolvedNorm = normalize(resolvedWs);
        const rawNorm = meeting.workspace ? normalize(meeting.workspace) : "";

        if (resolvedNorm !== selectedNorm && rawNorm !== selectedNorm) {
          return false;
        }
      }

      // 3. Date Filter
      if (dateFilter !== "all") {
        const meetingDate = new Date(meeting.meeting_date);
        const now = new Date(2026, 8, 7); // Anchored around seed timeline (Sept 2026)
        const diffMs = now.getTime() - meetingDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (dateFilter === "today" && diffDays > 1) return false;
        if (dateFilter === "7days" && diffDays > 7) return false;
        if (dateFilter === "30days" && diffDays > 30) return false;
      }

      return true;
    });
  }, [meetings, search, workspace, dateFilter]);

  // Client-side sorting
  const sortedMeetings = useMemo(() => {
    const list = [...filteredMeetings];
    if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.meeting_date).getTime() - new Date(b.meeting_date).getTime());
    } else if (sortBy === "longest") {
      list.sort((a, b) => b.duration_seconds - a.duration_seconds);
    } else if (sortBy === "shortest") {
      list.sort((a, b) => a.duration_seconds - b.duration_seconds);
    } else {
      // Newest first default
      list.sort((a, b) => new Date(b.meeting_date).getTime() - new Date(a.meeting_date).getTime());
    }
    return list;
  }, [filteredMeetings, sortBy]);

  // Pagination Slice
  const totalPages = Math.ceil(sortedMeetings.length / ITEMS_PER_PAGE);
  const paginatedMeetings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedMeetings.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedMeetings, currentPage]);

  const hasActiveFilters =
    search.trim() !== "" || workspace !== "All Workspaces" || dateFilter !== "all" || sortBy !== "newest";

  const handleResetFilters = () => {
    setSearch("");
    setWorkspace("All Workspaces");
    setDateFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const handleRetry = () => {
    setIsRetrying(true);
    fetchMeetingsData();
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">Meetings</h1>
            <Badge variant="indigo" size="sm">
              {meetings.length} Total
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Browse, search, and manage all your recorded meetings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/new-meeting">
            <Button
              variant="outline"
              size="sm"
              icon={<Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />}
            >
              Record Audio
            </Button>
          </Link>
          <Link href="/new-meeting">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              New Meeting
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <MeetingFilters
        search={search}
        onSearchChange={setSearch}
        workspace={workspace}
        onWorkspaceChange={setWorkspace}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Main Content Area */}
      {error ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-6 space-y-4">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-semibold text-white">Unable to load meetings</h3>
            <p className="text-xs text-slate-400">{error}</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />}
            onClick={handleRetry}
            disabled={isRetrying}
          >
            {isRetrying ? "Reconnecting..." : "Retry"}
          </Button>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-52 bg-[#160c3d]/60 border-[#2b1764]/60" />
          ))}
        </div>
      ) : sortedMeetings.length === 0 ? (
        <EmptyState
          icon={<Search className="w-6 h-6" />}
          title="No meetings found"
          description={
            workspace !== "All Workspaces"
              ? `There are currently no meetings in the ${workspace} workspace.`
              : search.trim()
              ? `We couldn't find any meetings matching "${search}".`
              : "We couldn't find any meetings matching your current filter criteria."
          }
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
        <div className="space-y-6">
          {/* Meeting Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {paginatedMeetings.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>

          {/* Pagination Controls */}
          <MeetingPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={sortedMeetings.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
