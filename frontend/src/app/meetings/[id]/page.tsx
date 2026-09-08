"use client";

import React, { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  FileQuestion,
  ListTodo,
  MessageSquare,
  RefreshCw,
  Sparkles,
  Split,
} from "lucide-react";
import {
  DeleteMeetingModal,
  EditMeetingModal,
  MeetingDetailHeader,
  MeetingSummaryPanel,
  ParticipantList,
  TranscriptImportModal,
  TranscriptPlayer,
  TranscriptWorkspace,
} from "@/components/meetings";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getMeeting, getTranscript } from "@/services/api";
import { MeetingDetail, TranscriptSegment } from "@/types";

interface MeetingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MeetingDetailPage({ params }: MeetingDetailPageProps) {
  const resolvedParams = use(params);
  const meetingId = parseInt(resolvedParams.id, 10);

  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptSegment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Player State
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Mobile View Tab Filter
  const [activeTab, setActiveTab] = useState<"split" | "transcript" | "intelligence">("split");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const loadMeetingWorkspace = useCallback(async () => {
    if (isNaN(meetingId)) {
      setIsNotFound(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsNotFound(false);

    try {
      const [meetingData, transcriptData] = await Promise.all([
        getMeeting(meetingId),
        getTranscript(meetingId).catch(() => [] as TranscriptSegment[]),
      ]);

      setMeeting(meetingData);
      setTranscripts(transcriptData);
    } catch (err: unknown) {
      console.error("Meeting detail load error:", err);
      if (typeof err === "object" && err !== null && "status" in err && (err as { status: number }).status === 404) {
        setIsNotFound(true);
      } else {
        setError("Unable to load meeting workspace from the server. Please ensure the backend is running.");
      }
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  }, [meetingId]);

  useEffect(() => {
    loadMeetingWorkspace();
  }, [loadMeetingWorkspace]);

  const handleSeek = (seconds: number) => {
    setCurrentTime(seconds);
  };

  const handleSelectTranscriptTimestamp = (seconds: number) => {
    setCurrentTime(seconds);
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  // ----------------------------------------------------
  // 1. Not Found State
  // ----------------------------------------------------
  if (isNotFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
          <FileQuestion className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h2 className="text-lg font-bold text-white tracking-tight">Meeting not found</h2>
          <p className="text-xs text-slate-400">
            We couldn&apos;t find a meeting with ID #{resolvedParams.id}. It may have been deleted or the link is incorrect.
          </p>
        </div>
        <Link href="/meetings">
          <Button variant="secondary" size="md" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Meetings
          </Button>
        </Link>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. Error State
  // ----------------------------------------------------
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h2 className="text-lg font-bold text-white tracking-tight">Failed to load meeting</h2>
          <p className="text-xs text-slate-400">{error}</p>
        </div>
        <Button
          variant="secondary"
          size="md"
          icon={<RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />}
          onClick={() => {
            setIsRetrying(true);
            loadMeetingWorkspace();
          }}
          disabled={isRetrying}
        >
          {isRetrying ? "Reconnecting..." : "Retry"}
        </Button>
      </div>
    );
  }

  // ----------------------------------------------------
  // 3. Loading Skeleton State
  // ----------------------------------------------------
  if (isLoading || !meeting) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-[#160c3d]/60 rounded-xl border border-[#2b1764]/60" />
        <div className="h-16 bg-[#160c3d]/60 rounded-xl border border-[#2b1764]/60" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-[500px] bg-[#160c3d]/60 rounded-xl border border-[#2b1764]/60" />
          <div className="lg:col-span-5 h-[500px] bg-[#160c3d]/60 rounded-xl border border-[#2b1764]/60" />
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 4. Loaded Workspace Layout
  // ----------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Meeting Header */}
      <MeetingDetailHeader
        meeting={meeting}
        onEditMeeting={() => setIsEditModalOpen(true)}
        onDeleteMeeting={() => setIsDeleteModalOpen(true)}
      />

      {/* Participants Overview */}
      <ParticipantList participants={meeting.participants} />

      {/* Tab Navigation for Mobile Viewports */}
      <div className="flex items-center gap-1.5 bg-[#100730]/90 p-1 rounded-xl border border-[#251357] w-full sm:w-auto lg:hidden">
        <button
          onClick={() => setActiveTab("split")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === "split" ? "bg-[#5925DC] text-white shadow-sm shadow-[#5925DC]/30" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Split className="w-3.5 h-3.5" />
          <span>All</span>
        </button>
        <button
          onClick={() => setActiveTab("transcript")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === "transcript" ? "bg-[#5925DC] text-white shadow-sm shadow-[#5925DC]/30" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Transcript</span>
        </button>
        <button
          onClick={() => setActiveTab("intelligence")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === "intelligence" ? "bg-[#5925DC] text-white shadow-sm shadow-[#5925DC]/30" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Summary & Actions</span>
        </button>
      </div>

      {/* Main Split Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Transcript & Simulated Player (60-65% -> 7 cols on lg) */}
        <div
          className={`lg:col-span-7 space-y-4 ${
            activeTab === "intelligence" ? "hidden lg:block" : "block"
          }`}
        >
          {/* Simulated Audio Player */}
          <TranscriptPlayer
            currentTime={currentTime}
            totalDuration={meeting.duration_seconds}
            isPlaying={isPlaying}
            onPlayPauseToggle={handlePlayPause}
            onSeek={handleSeek}
            playbackSpeed={playbackSpeed}
            onSpeedChange={setPlaybackSpeed}
          />

          {/* Transcript Stream */}
          <TranscriptWorkspace
            transcripts={transcripts}
            currentTime={currentTime}
            onSelectTimestamp={handleSelectTranscriptTimestamp}
            onOpenImportModal={() => setIsImportModalOpen(true)}
          />
        </div>

        {/* Right Side: Meeting Intelligence Panel (35-40% -> 5 cols on lg) */}
        <div
          className={`lg:col-span-5 space-y-6 ${
            activeTab === "transcript" ? "hidden lg:block" : "block"
          }`}
        >
          <MeetingSummaryPanel
            meetingId={meeting.id}
            summary={meeting.summary}
            keyTopics={meeting.key_topics}
            actionItems={meeting.action_items}
            onAiGenerated={loadMeetingWorkspace}
          />
        </div>
      </div>

      {/* Transcript Import Modal */}
      <TranscriptImportModal
        meetingId={meetingId}
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={() => {
          loadMeetingWorkspace();
          setCurrentTime(0);
        }}
        currentSegmentCount={transcripts.length}
      />

      {/* Edit Meeting Modal */}
      <EditMeetingModal
        meeting={meeting}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onMeetingUpdated={(updated) => {
          setMeeting(updated);
          loadMeetingWorkspace();
        }}
      />

      {/* Delete Meeting Modal */}
      <DeleteMeetingModal
        meeting={{
          id: meeting.id,
          title: meeting.title,
          meeting_code: meeting.meeting_code,
          meeting_date: meeting.meeting_date,
        }}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
