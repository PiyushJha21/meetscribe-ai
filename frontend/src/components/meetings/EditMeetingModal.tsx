"use client";

import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  FolderKanban,
  Loader2,
  Pencil,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ParticipantInput } from "@/components/meetings/ParticipantInput";
import { updateMeeting } from "@/services/api";
import { MeetingDetail, ParticipantInput as ParticipantInputType } from "@/types";

interface EditMeetingModalProps {
  meeting: MeetingDetail;
  isOpen: boolean;
  onClose: () => void;
  onMeetingUpdated: (updated: MeetingDetail) => void;
}

const WORKSPACE_OPTIONS = [
  "Engineering Syncs",
  "Product & Design",
  "Client Reviews",
];

export const EditMeetingModal: React.FC<EditMeetingModalProps> = ({
  meeting,
  isOpen,
  onClose,
  onMeetingUpdated,
}) => {
  const [title, setTitle] = useState(meeting.title || "");
  const [workspace, setWorkspace] = useState(meeting.workspace || "Engineering Syncs");
  const [description, setDescription] = useState(meeting.description || "");
  const [meetingDate, setMeetingDate] = useState("");
  const [participants, setParticipants] = useState<ParticipantInputType[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync state whenever modal opens or meeting changes
  useEffect(() => {
    if (isOpen && meeting) {
      setTitle(meeting.title || "");
      setWorkspace(meeting.workspace || "Engineering Syncs");
      setDescription(meeting.description || "");

      // Format ISO date for datetime-local input (YYYY-MM-DDTHH:mm)
      try {
        const d = new Date(meeting.meeting_date);
        const isoLocal = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setMeetingDate(isoLocal);
      } catch {
        setMeetingDate("");
      }

      if (meeting.participants && meeting.participants.length > 0) {
        setParticipants(
          meeting.participants.map((p) => ({
            name: p.name || "",
            email: p.email || "",
            role: p.role || "Attendee",
          }))
        );
      } else {
        setParticipants([{ name: "", email: "", role: "Attendee" }]);
      }

      setError(null);
      setSuccessMessage(null);
    }
  }, [isOpen, meeting]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Meeting title is required.");
      return;
    }

    const validParticipants = participants.filter((p) => p.name.trim() !== "");
    if (validParticipants.length === 0) {
      setError("Please include at least one participant with a name.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        title: title.trim(),
        workspace,
        description: description.trim() || undefined,
        meeting_date: meetingDate ? new Date(meetingDate).toISOString() : undefined,
        participants: validParticipants,
      };

      const updated = await updateMeeting(meeting.id, payload);
      setSuccessMessage("Meeting updated successfully!");
      
      setTimeout(() => {
        onMeetingUpdated(updated);
        onClose();
      }, 500);
    } catch (err: unknown) {
      console.error("Failed to update meeting:", err);
      const msg =
        typeof err === "object" && err !== null && "message" in err
          ? (err as { message: string }).message
          : "Failed to update meeting. Please check your inputs.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070314]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#160c3d] border border-[#2b1764] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#251357] bg-[#100730]/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#5925DC]/15 border border-[#5925DC]/30 rounded-xl text-[#7A5BF8]">
              <Pencil className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Edit Meeting</h2>
              <p className="text-xs text-slate-400">
                Modify meeting title, workspace, date, and participants.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1c104d] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Meeting Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <span>Meeting Title</span>
              <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Engineering Sprint Planning"
              className="w-full bg-[#100730]/90 border border-[#251357] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#5925DC]"
              required
            />
          </div>

          {/* Workspace and Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Workspace Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-[#7A5BF8]" />
                <span>Workspace</span>
              </label>
              <select
                value={workspace}
                onChange={(e) => setWorkspace(e.target.value)}
                className="w-full bg-[#100730]/90 border border-[#251357] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#5925DC] cursor-pointer"
              >
                {WORKSPACE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#160c3d] text-white">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Meeting Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#7A5BF8]" />
                <span>Meeting Date & Time</span>
              </label>
              <input
                type="datetime-local"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full bg-[#100730]/90 border border-[#251357] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#5925DC]"
              />
            </div>
          </div>

          {/* Meeting Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Meeting Description <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the meeting agenda, key objectives, or notes..."
              className="w-full bg-[#100730]/90 border border-[#251357] rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#5925DC] resize-none"
            />
          </div>

          {/* Dynamic Participants */}
          <div className="space-y-2 pt-2 border-t border-[#251357]/80">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#7A5BF8]" />
              <label className="text-xs font-semibold text-slate-300">
                Participants
              </label>
            </div>
            <ParticipantInput
              participants={participants}
              onChange={setParticipants}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#251357]">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting || !title.trim()}
              icon={
                isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )
              }
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

