"use client";

import React, { useState, useRef } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardPaste,
  FileCode,
  FileText,
  HelpCircle,
  Loader2,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { importMeetingTranscript, uploadMeetingTranscriptFile } from "@/services/api";
import { TranscriptImportResponse } from "@/types";

interface TranscriptImportModalProps {
  meetingId: number;
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (result: TranscriptImportResponse) => void;
  currentSegmentCount?: number;
}

const SAMPLE_TRANSCRIPT = `Piyush Kumar Jha: Good morning everyone, let's review the sprint deliverables and API schemas.
Aman Mishra: The database models and SQLite migrations are verified. We are now integrating the transcript importer.
Priya Singh: Frontend components for paste and file upload are fully responsive with the dark theme.
Rahul Verma: Excellent progress. We should also test WebVTT timestamps and JSON formats.
Piyush Kumar Jha: Agreed. Let's make sure meeting durations and segments sync smoothly.`;

export const TranscriptImportModal: React.FC<TranscriptImportModalProps> = ({
  meetingId,
  isOpen,
  onClose,
  onImportSuccess,
  currentSegmentCount = 0,
}) => {
  const [activeTab, setActiveTab] = useState<"paste" | "upload">("paste");
  const [pastedText, setPastedText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePasteSample = () => {
    setPastedText(SAMPLE_TRANSCRIPT);
    setError(null);
  };

  const handleFileSelect = (file: File) => {
    setError(null);
    setSuccessMessage(null);

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["txt", "vtt", "json"].includes(ext)) {
      setError(`Unsupported file type ".${ext}". Please upload a .txt, .vtt, or .json file.`);
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) {
      setError("Please paste or enter transcript text before importing.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await importMeetingTranscript(meetingId, {
        text: pastedText.trim(),
        format: "auto",
      });
      setSuccessMessage(`Successfully imported ${res.total_segments} transcript segments.`);
      setTimeout(() => {
        onImportSuccess(res);
        onClose();
      }, 700);
    } catch (err: unknown) {
      console.error("Paste import failed:", err);
      const msg =
        typeof err === "object" && err !== null && "message" in err
          ? (err as { message: string }).message
          : "Failed to import transcript text. Please check the format.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a .txt, .vtt, or .json file to upload.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await uploadMeetingTranscriptFile(meetingId, selectedFile);
      setSuccessMessage(`Successfully processed and imported ${res.total_segments} segments.`);
      setTimeout(() => {
        onImportSuccess(res);
        onClose();
      }, 700);
    } catch (err: unknown) {
      console.error("Upload import failed:", err);
      const msg =
        typeof err === "object" && err !== null && "message" in err
          ? (err as { message: string }).message
          : "Failed to upload and parse transcript file.";
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
              <ClipboardPaste className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">
                {currentSegmentCount > 0 ? "Replace Transcript" : "Import Transcript"}
              </h2>
              <p className="text-xs text-slate-400">
                Provide transcript data through text paste or file upload.
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

        {/* Existing segments alert */}
        {currentSegmentCount > 0 && (
          <div className="px-6 pt-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-300">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                This meeting currently contains <strong>{currentSegmentCount} segments</strong>. Importing a new transcript will cleanly replace existing segments.
              </span>
            </div>
          </div>
        )}

        {/* Tab Selection */}
        <div className="px-6 pt-4">
          <div className="flex bg-[#100730]/80 p-1 rounded-xl border border-[#251357]">
            <button
              type="button"
              onClick={() => {
                setActiveTab("paste");
                setError(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === "paste"
                  ? "bg-[#5925DC] text-white shadow-sm shadow-[#5925DC]/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>Paste Text / JSON</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("upload");
                setError(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === "upload"
                  ? "bg-[#5925DC] text-white shadow-sm shadow-[#5925DC]/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload File (.txt, .vtt, .json)</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
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

          {/* TAB 1: PASTE TRANSCRIPT */}
          {activeTab === "paste" && (
            <form onSubmit={handlePasteSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Transcript Content
                </label>
                <button
                  type="button"
                  onClick={handlePasteSample}
                  className="text-xs text-[#7A5BF8] hover:text-purple-300 inline-flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  Load Sample Dialogue
                </button>
              </div>

              <div className="relative">
                <textarea
                  rows={8}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder={`Piyush: Welcome to our sprint review...\nAman: Let's discuss the database migration.\nRahul: The transcript import endpoint is working.`}
                  className="w-full bg-[#100730]/90 border border-[#251357] rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:ring-1 focus:ring-[#5925DC] leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  Supported formats: <strong>Speaker: Content</strong> lines, WebVTT cues, or JSON array.
                </span>
                {pastedText.trim() && (
                  <button
                    type="button"
                    onClick={() => setPastedText("")}
                    className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" size="sm" onClick={onClose} type="button">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={isSubmitting || !pastedText.trim()}
                  icon={
                    isSubmitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ClipboardPaste className="w-3.5 h-3.5" />
                    )
                  }
                >
                  {isSubmitting ? "Importing..." : "Import Transcript"}
                </Button>
              </div>
            </form>
          )}

          {/* TAB 2: UPLOAD FILE */}
          {activeTab === "upload" && (
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.vtt,.json,text/plain,text/vtt,application/json"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />

              {!selectedFile ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-[#5925DC] bg-[#5925DC]/10"
                      : "border-[#251357] hover:border-[#381c7e] bg-[#100730]/40 hover:bg-[#100730]/70"
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-[#5925DC]/15 rounded-2xl text-[#7A5BF8]">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        Click to browse or drag and drop file here
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Supported: <span className="font-mono text-purple-300">.txt</span>,{" "}
                        <span className="font-mono text-purple-300">.vtt</span>,{" "}
                        <span className="font-mono text-purple-300">.json</span> (up to 10MB)
                      </p>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="indigo" size="sm">
                        <FileText className="w-3 h-3 mr-1 inline" />
                        Plain Text (.txt)
                      </Badge>
                      <Badge variant="indigo" size="sm">
                        <FileCode className="w-3 h-3 mr-1 inline" />
                        WebVTT (.vtt)
                      </Badge>
                      <Badge variant="indigo" size="sm">
                        <FileCode className="w-3 h-3 mr-1 inline" />
                        JSON (.json)
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#100730]/80 border border-[#251357] rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#5925DC]/15 border border-[#5925DC]/30 rounded-xl text-[#7A5BF8]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white truncate max-w-xs sm:max-w-md">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.name.split(".").pop()?.toUpperCase()} format
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" size="sm" onClick={onClose} type="button">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={isSubmitting || !selectedFile}
                  icon={
                    isSubmitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )
                  }
                >
                  {isSubmitting ? "Processing..." : "Upload & Process"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

