import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDuration, formatMeetingDate } from "@/lib/utils";
import { Meeting } from "@/types";

interface MeetingCardProps {
  meeting: Meeting;
}

export function getMeetingWorkspace(
  title?: string | null,
  explicitWorkspace?: string | null
): { name: string; variant: "indigo" | "success" | "warning" | "default" } {
  // 1. Check explicit workspace value from database/API first
  const ws = (explicitWorkspace || "").trim();
  if (ws) {
    const lowerWs = ws.toLowerCase();
    if (
      lowerWs.includes("eng") ||
      lowerWs.includes("sprint") ||
      lowerWs.includes("dev") ||
      lowerWs.includes("backend")
    ) {
      return { name: "Engineering Syncs", variant: "indigo" };
    }
    if (
      lowerWs.includes("prod") ||
      lowerWs.includes("design") ||
      lowerWs.includes("ui") ||
      lowerWs.includes("ux") ||
      lowerWs.includes("roadmap")
    ) {
      return { name: "Product & Design", variant: "warning" };
    }
    if (
      lowerWs.includes("client") ||
      lowerWs.includes("review") ||
      lowerWs.includes("retro") ||
      lowerWs.includes("customer")
    ) {
      return { name: "Client Reviews", variant: "success" };
    }
    return { name: ws, variant: "default" };
  }

  // 2. Fallback to title inference if explicit workspace is not set
  const lowerTitle = (title || "").toLowerCase();
  if (
    lowerTitle.includes("engineering") ||
    lowerTitle.includes("backend") ||
    lowerTitle.includes("sprint") ||
    lowerTitle.includes("standup") ||
    lowerTitle.includes("arch")
  ) {
    return { name: "Engineering Syncs", variant: "indigo" };
  }
  if (
    lowerTitle.includes("product") ||
    lowerTitle.includes("design") ||
    lowerTitle.includes("ui/ux") ||
    lowerTitle.includes("roadmap")
  ) {
    return { name: "Product & Design", variant: "warning" };
  }
  if (
    lowerTitle.includes("client") ||
    lowerTitle.includes("retrospective") ||
    lowerTitle.includes("review")
  ) {
    return { name: "Client Reviews", variant: "success" };
  }

  return { name: "Engineering Syncs", variant: "indigo" };
}

export const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => {
  const workspace = getMeetingWorkspace(meeting.title, meeting.workspace);
  const actionCount = meeting.action_item_count ?? 4;

  return (
    <Link href={`/meetings/${meeting.id}`} className="block group focus:outline-none h-full">
      <Card
        hoverable
        className="flex flex-col justify-between h-full space-y-4 border-[#2b1764]/80 group-hover:border-[#5925DC]/50 transition-all duration-200"
      >
        <div className="space-y-3">
          {/* Header Badges */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-medium text-purple-300 bg-[#5925DC]/15 px-2 py-0.5 rounded border border-[#5925DC]/30">
                {meeting.meeting_code}
              </span>
              <Badge variant={workspace.variant} size="sm">
                <Layers className="w-2.5 h-2.5 mr-1 inline" />
                {workspace.name}
              </Badge>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDuration(meeting.duration_seconds)}</span>
            </div>
          </div>

          {/* Title and Date */}
          <div>
            <h3 className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
              {meeting.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatMeetingDate(meeting.meeting_date, { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>

          {/* Summary Snippet */}
          {meeting.summary_preview && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed bg-[#100730]/60 p-2.5 rounded-lg border border-[#251357]/70">
              {meeting.summary_preview}
            </p>
          )}
        </div>

        {/* Footer Meta & Action */}
        <div className="flex items-center justify-between pt-3 border-t border-[#251357]/80 text-xs">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="flex items-center gap-1.5" title="Meeting Attendees">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>{meeting.participant_count} attendees</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400/90 font-medium" title="Action Items">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{actionCount} actions</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#7A5BF8] group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all">
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </Card>
    </Link>
  );
};

