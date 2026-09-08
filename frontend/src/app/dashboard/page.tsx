"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Layers,
  ListTodo,
  Plus,
  Radio,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDuration, formatMeetingDate } from "@/lib/utils";
import { getMeetingWorkspace } from "@/components/meetings/MeetingCard";
import { getAllActionItems, getMeetings, updateActionItem } from "@/services/api";
import { ActionItem, Meeting } from "@/types";

export default function DashboardPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [fetchedMeetings, fetchedActions] = await Promise.all([
        getMeetings(),
        getAllActionItems().catch(() => [] as ActionItem[]),
      ]);

      setMeetings(fetchedMeetings);
      setActionItems(fetchedActions);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(
        "Unable to load your meetings. Please ensure the MeetScribe API backend is running and accessible."
      );
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRetry = () => {
    setIsRetrying(true);
    fetchDashboardData();
  };

  const handleToggleTask = async (item: ActionItem) => {
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

  // Calculated Metrics
  const totalMeetings = meetings.length;
  const openActionItems = actionItems.filter((item) => !item.is_completed).length;
  const completedTasks = actionItems.filter((item) => item.is_completed).length;
  const completionRate =
    actionItems.length > 0
      ? Math.round((completedTasks / actionItems.length) * 100)
      : 0;

  // Latest 3 meetings and top pending actions
  const recentMeetings = meetings.slice(0, 3);
  const pendingActions = actionItems.filter((i) => !i.is_completed).slice(0, 5);

  // ----------------------------------------------------
  // Error State
  // ----------------------------------------------------
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-5">
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="max-w-md space-y-1.5">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Unable to load your workspace
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
        </div>
        <Button
          variant="secondary"
          size="md"
          icon={<RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />}
          onClick={handleRetry}
          disabled={isRetrying}
        >
          {isRetrying ? "Reconnecting..." : "Retry Connection"}
        </Button>
      </div>
    );
  }

  // ----------------------------------------------------
  // Loading Skeletons
  // ----------------------------------------------------
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Banner Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-64 bg-[#160c3d] rounded-lg" />
            <div className="h-4 w-80 bg-[#160c3d]/60 rounded" />
          </div>
          <div className="flex gap-3">
            <div className="h-9 w-28 bg-[#160c3d] rounded-lg" />
            <div className="h-9 w-32 bg-[#160c3d] rounded-lg" />
          </div>
        </div>

        {/* Metric Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2 w-full">
                  <div className="h-3.5 w-24 bg-[#140a38] rounded" />
                  <div className="h-8 w-16 bg-[#140a38] rounded-lg" />
                  <div className="h-3 w-28 bg-[#140a38]/60 rounded" />
                </div>
                <div className="w-10 h-10 bg-[#140a38] rounded-xl" />
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Meetings Skeleton */}
        <div className="space-y-4">
          <div className="h-5 w-44 bg-[#160c3d] rounded" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-44 bg-[#160c3d]/60" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // Loaded Dashboard Content
  // ----------------------------------------------------
  const stats = [
    {
      label: "Total Meetings",
      value: totalMeetings.toString(),
      description: "Indexed across workspaces",
      icon: Calendar,
      variant: "indigo" as const,
    },
    {
      label: "Open Action Items",
      value: openActionItems.toString(),
      description: "Pending completion",
      icon: ListTodo,
      variant: "warning" as const,
    },
    {
      label: "Completed Tasks",
      value: completedTasks.toString(),
      description: `${completionRate}% overall completion rate`,
      icon: CheckCircle2,
      variant: "success" as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#251357]/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Good morning, Piyush 👋
            </h1>
            <Badge variant="indigo" size="sm">
              <TrendingUp className="w-3 h-3 mr-1 inline" />
              Active Workspace
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Overview of intelligence notes, active meetings, and assigned action items.
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

      {/* Overview Metric Stats from Real Backend Data */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="relative overflow-hidden group hover:border-[#5925DC]/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold tracking-tight text-white mt-1 font-mono">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 font-medium">
                    {stat.description}
                  </p>
                </div>
                <div
                  className={`p-2.5 rounded-xl border ${
                    stat.variant === "indigo"
                      ? "bg-[#5925DC]/15 border-[#5925DC]/30 text-[#7A5BF8]"
                      : stat.variant === "warning"
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Meetings Section from Real API */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Recent Meetings</h2>
            <Badge variant="indigo" size="sm">
              {recentMeetings.length} latest
            </Badge>
          </div>
          <Link
            href="/meetings"
            className="text-xs font-semibold text-[#7A5BF8] hover:text-purple-300 transition-colors inline-flex items-center gap-1 group"
          >
            <span>View all {totalMeetings} meetings</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {recentMeetings.length === 0 ? (
          <Card className="p-8 text-center border-dashed border-[#251357] bg-[#100730]/40 space-y-3">
            <div className="text-2xl">🎙️</div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white">No meetings yet</h3>
              <p className="text-xs text-slate-400">
                Create your first meeting or upload a transcript to get started.
              </p>
            </div>
            <Link href="/new-meeting" className="inline-block pt-1">
              <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                New Meeting
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentMeetings.map((meeting) => {
              const workspace = getMeetingWorkspace(meeting.title, meeting.workspace);
              return (
                <Link key={meeting.id} href={`/meetings/${meeting.id}`} className="block group focus:outline-none">
                  <Card
                    hoverable
                    className="flex flex-col justify-between h-full space-y-4 border-[#2b1764]/80 group-hover:border-[#5925DC]/50 transition-all duration-200"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-purple-300 bg-[#5925DC]/15 px-2 py-0.5 rounded border border-[#5925DC]/30">
                            {meeting.meeting_code}
                          </span>
                          <Badge variant={workspace.variant} size="sm">
                            <Layers className="w-2.5 h-2.5 mr-1 inline" />
                            {workspace.name}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{formatDuration(meeting.duration_seconds)}</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                          {meeting.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatMeetingDate(meeting.meeting_date)}</span>
                        </div>
                      </div>

                      {meeting.summary_preview && (
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed bg-[#100730]/60 p-2.5 rounded-lg border border-[#251357]/70">
                          {meeting.summary_preview}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#251357]/80 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{meeting.participant_count} attendees</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#7A5BF8] font-semibold group-hover:translate-x-0.5 transition-transform">
                        <span>Workspace →</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Items Overview */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Pending Action Items</h2>
            <Badge variant="warning" size="sm">
              {openActionItems} open
            </Badge>
          </div>
          <Link
            href="/action-items"
            className="text-xs font-semibold text-[#7A5BF8] hover:text-purple-300 transition-colors inline-flex items-center gap-1 group"
          >
            <span>Action Items Hub</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {pendingActions.length === 0 ? (
          <Card className="p-6 text-center border-dashed border-[#251357] bg-[#100730]/40 space-y-1.5">
            <p className="text-sm font-semibold text-emerald-400">✓ You&apos;re all caught up!</p>
            <p className="text-xs text-slate-400">No pending action items.</p>
          </Card>
        ) : (
          <Card className="divide-y divide-[#251357]/80 p-0 overflow-hidden bg-[#160c3d]/90 border-[#2b1764]">
            {pendingActions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleTask(item)}
                className="flex items-center justify-between p-3.5 hover:bg-[#100730]/60 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    disabled={togglingId === item.id}
                    className="text-slate-400 group-hover:text-emerald-400 transition-colors focus:outline-none flex-shrink-0 cursor-pointer"
                    aria-label={item.is_completed ? "Mark incomplete" : "Mark completed"}
                  >
                    {item.is_completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 hover:text-white" />
                    )}
                  </button>
                  <span
                    className={`text-xs font-medium truncate transition-all ${
                      item.is_completed
                        ? "line-through text-slate-400"
                        : "text-slate-200 group-hover:text-white"
                    }`}
                  >
                    {item.task}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0 text-[11px] text-slate-400 pl-3">
                  {item.assignee && (
                    <span className="bg-[#140a38] px-2 py-0.5 rounded text-slate-300 border border-[#251357] text-[10px] font-medium">
                      {item.assignee}
                    </span>
                  )}
                  {item.due_date && (
                    <span className="text-amber-400/90 font-mono text-[10px]">
                      Due {formatMeetingDate(item.due_date, { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}

