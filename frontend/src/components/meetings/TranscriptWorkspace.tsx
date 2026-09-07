"use client";

import React, { useMemo, useState } from "react";
import {
  ClipboardPaste,
  FileText,
  MessageSquare,
  Play,
  Plus,
  RefreshCw,
  Search,
  Upload,
  X,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatTimecode } from "@/lib/utils";
import { TranscriptSegment } from "@/types";

interface TranscriptWorkspaceProps {
  transcripts: TranscriptSegment[];
  currentTime: number;
  onSelectTimestamp: (seconds: number) => void;
  onOpenImportModal?: () => void;
}

export const TranscriptWorkspace: React.FC<TranscriptWorkspaceProps> = ({
  transcripts,
  currentTime,
  onSelectTimestamp,
  onOpenImportModal,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTranscripts = useMemo(() => {
    if (!searchQuery.trim()) return transcripts;
    const q = searchQuery.toLowerCase().trim();
    return transcripts.filter(
      (t) =>
        t.content.toLowerCase().includes(q) ||
        t.speaker_name.toLowerCase().includes(q)
    );
  }, [transcripts, searchQuery]);

  // Find active transcript segment closest to currentTime
  const activeSegmentId = useMemo(() => {
    const matching = transcripts.find(
      (t) => currentTime >= t.start_time && currentTime <= t.end_time
    );
    return matching ? matching.id : null;
  }, [transcripts, currentTime]);

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-[#5925DC]/30 text-purple-200 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-[#160c3d]/90 border border-[#2b1764]/90 rounded-xl p-4 sm:p-5 space-y-4 backdrop-blur-sm">
      {/* Transcript Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#251357]/80">
        <div className="flex items-center gap-2 flex-wrap">
          <MessageSquare className="w-4 h-4 text-[#7A5BF8]" />
          <h2 className="text-sm font-semibold text-white">Transcript Stream</h2>
          <span className="text-[11px] font-mono text-slate-400 bg-[#120833] border border-[#251357] px-2 py-0.5 rounded-full">
            {transcripts.length} {transcripts.length === 1 ? "segment" : "segments"}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Transcript Search Box */}
          {transcripts.length > 0 && (
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in transcript..."
                className="w-full pl-8 pr-8 py-1.5 text-xs bg-[#100730]/90 text-slate-200 placeholder-slate-400 rounded-lg border border-[#251357] focus:outline-none focus:ring-1 focus:ring-[#5925DC]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Import / Replace Transcript Action */}
          {onOpenImportModal && (
            <Button
              variant={transcripts.length === 0 ? "primary" : "outline"}
              size="sm"
              onClick={onOpenImportModal}
              icon={
                transcripts.length === 0 ? (
                  <Plus className="w-3 h-3" />
                ) : (
                  <ClipboardPaste className="w-3 h-3 text-[#7A5BF8]" />
                )
              }
            >
              {transcripts.length === 0 ? "Import Transcript" : "Import / Replace"}
            </Button>
          )}
        </div>
      </div>

      {/* Zero Segments Empty State */}
      {transcripts.length === 0 ? (
        <div className="py-8 px-4 text-center border border-dashed border-[#251357] rounded-xl bg-[#100730]/40 space-y-4">
          <div className="p-3 bg-[#5925DC]/10 border border-[#5925DC]/20 rounded-2xl w-fit mx-auto text-[#7A5BF8]">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-sm font-semibold text-white">No transcript available</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Import transcript dialogue by pasting text or uploading a <span className="text-purple-300 font-mono">.txt</span>, <span className="text-purple-300 font-mono">.vtt</span>, or <span className="text-purple-300 font-mono">.json</span> file.
            </p>
          </div>
          {onOpenImportModal && (
            <div className="pt-1 flex items-center justify-center gap-3">
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenImportModal}
                icon={<ClipboardPaste className="w-3.5 h-3.5" />}
              >
                Import Transcript
              </Button>
            </div>
          )}
        </div>
      ) : filteredTranscripts.length === 0 ? (
        <EmptyState
          icon={<Search className="w-5 h-5" />}
          title="No transcript match"
          description={`No transcript segments found matching "${searchQuery}".`}
          action={
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-[#7A5BF8] hover:underline mt-1 cursor-pointer"
            >
              Clear transcript search
            </button>
          }
          className="py-12"
        />
      ) : (
        <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
          {filteredTranscripts.map((segment) => {
            const isActive = activeSegmentId === segment.id;

            return (
              <div
                key={segment.id}
                onClick={() => onSelectTimestamp(segment.start_time)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                  isActive
                    ? "bg-[#5925DC]/20 border-[#5925DC]/60 shadow-sm shadow-[#5925DC]/15"
                    : "bg-[#100730]/60 border-[#251357]/70 hover:bg-[#100730]/90 hover:border-[#381c7e]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={segment.speaker_name} size="xs" />
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-purple-300 transition-colors">
                      {segment.speaker_name}
                    </span>
                  </div>

                  {/* Timestamp Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTimestamp(segment.start_time);
                    }}
                    className={`inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded transition-colors ${
                      isActive
                        ? "bg-[#5925DC] text-white font-semibold"
                        : "bg-[#1c104d] text-purple-300 hover:bg-[#5925DC]/20"
                    }`}
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>{formatTimecode(segment.start_time)}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {highlightText(segment.content, searchQuery)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

