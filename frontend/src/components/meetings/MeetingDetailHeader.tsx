"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Download,
  Layers,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDuration, formatMeetingDate } from "@/lib/utils";
import { getMeetingWorkspace } from "@/components/meetings/MeetingCard";
import { MeetingDetail } from "@/types";

interface MeetingDetailHeaderProps {
  meeting: MeetingDetail;
  onEditMeeting?: () => void;
  onDeleteMeeting?: () => void;
}

export const MeetingDetailHeader: React.FC<MeetingDetailHeaderProps> = ({
  meeting,
  onEditMeeting,
  onDeleteMeeting,
}) => {
  const [copied, setCopied] = useState(false);
  const workspace = getMeetingWorkspace(meeting.title, meeting.workspace);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4 pb-4 border-b border-[#251357]/80">
      {/* Navigation Breadcrumb & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/meetings"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Meetings</span>
        </Link>

        {/* Action Buttons: Edit, Delete, Share, Export */}
        <div className="flex items-center gap-2 flex-wrap">
          {onEditMeeting && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEditMeeting}
              icon={<Pencil className="w-3.5 h-3.5 text-[#7A5BF8]" />}
            >
              Edit Meeting
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          >
            {copied ? "Link Copied!" : "Share"}
          </Button>

          {onDeleteMeeting && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onDeleteMeeting}
              icon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
              className="hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-300"
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Title & Metadata */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {meeting.title}
          </h1>
          <span className="text-xs font-mono font-medium text-purple-300 bg-[#5925DC]/15 px-2.5 py-0.5 rounded-md border border-[#5925DC]/30">
            {meeting.meeting_code}
          </span>
          <Badge variant={workspace.variant} size="sm">
            <Layers className="w-3 h-3 mr-1 inline" />
            {workspace.name}
          </Badge>
        </div>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatMeetingDate(meeting.meeting_date, { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDuration(meeting.duration_seconds)} duration</span>
          </div>
        </div>
      </div>
    </div>
  );
};

