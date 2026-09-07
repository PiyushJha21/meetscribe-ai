"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Calendar,
  Loader2,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatMeetingDate } from "@/lib/utils";
import { deleteMeeting } from "@/services/api";

interface DeleteMeetingModalProps {
  meeting: {
    id: number;
    title: string;
    meeting_code: string;
    meeting_date?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess?: () => void;
}

export const DeleteMeetingModal: React.FC<DeleteMeetingModalProps> = ({
  meeting,
  isOpen,
  onClose,
  onDeleteSuccess,
}) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteMeeting(meeting.id);
      if (onDeleteSuccess) {
        onDeleteSuccess();
      } else {
        router.push("/meetings");
      }
      onClose();
    } catch (err: unknown) {
      console.error("Failed to delete meeting:", err);
      const msg =
        typeof err === "object" && err !== null && "message" in err
          ? (err as { message: string }).message
          : "Failed to delete meeting. Please try again.";
      setError(msg);
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070314]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#160c3d] border border-[#2b1764] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#251357] bg-[#100730]/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Delete Meeting</h2>
              <p className="text-xs text-slate-400">Permanently remove this meeting</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1c104d] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2 text-xs text-rose-300">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-4 bg-[#100730]/60 border border-[#251357] rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-medium text-purple-300 bg-[#5925DC]/15 px-2 py-0.5 rounded border border-[#5925DC]/30">
                {meeting.meeting_code}
              </span>
              {meeting.meeting_date && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatMeetingDate(meeting.meeting_date, { month: "short", day: "numeric", year: "numeric" })}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-white">
              {meeting.title}
            </p>
          </div>

          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3 text-xs text-rose-300 leading-relaxed">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-rose-200">Warning:</span> All associated transcript segments, summaries, key topics, action items, and uploaded audio will be permanently deleted. This action cannot be undone.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#100730]/60 border-t border-[#251357]">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            icon={
              isDeleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )
            }
          >
            {isDeleting ? "Deleting..." : "Delete Meeting"}
          </Button>
        </div>
      </div>
    </div>
  );
};

