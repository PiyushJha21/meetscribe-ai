"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileAudio,
  FolderKanban,
  Layers,
  Mic,
  Plus,
  Radio,
  Sparkles,
  Upload,
} from "lucide-react";
import { AudioRecorder } from "@/components/meetings/AudioRecorder";
import { AudioUploader } from "@/components/meetings/AudioUploader";
import { ParticipantInput } from "@/components/meetings/ParticipantInput";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createMeeting, uploadMeetingAudio } from "@/services/api";
import { ParticipantInput as ParticipantInputType } from "@/types";

export default function NewMeetingPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [workspace, setWorkspace] = useState("Engineering Syncs");
  const [meetingDate, setMeetingDate] = useState("");

  useEffect(() => {
    const now = new Date();
    // format as YYYY-MM-DDTHH:mm for datetime-local input
    const pad = (n: number) => n.toString().padStart(2, "0");
    setMeetingDate(
      `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
    );
  }, []);
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState<ParticipantInputType[]>([
    { name: "Piyush Kumar Jha", email: "piyush.jha@syncspace.in", role: "Host" },
  ]);

  // Audio State
  const [audioTab, setAudioTab] = useState<"record" | "upload">("record");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedDuration, setRecordedDuration] = useState<number>(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Validation & Submit State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState<number>(0); // 1: Creating, 2: Uploading, 3: Success

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Meeting title is required.";
    }
    if (!workspace.trim()) {
      newErrors.workspace = "Workspace selection is required.";
    }
    if (!meetingDate) {
      newErrors.meetingDate = "Meeting date is required.";
    }

    const validParticipants = participants.filter((p) => p.name.trim() !== "");
    if (validParticipants.length === 0) {
      newErrors.participants = "At least one participant name is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitStep(1); // Creating meeting

    try {
      // 1. Create Meeting in Backend
      const validParticipants = participants.filter((p) => p.name.trim() !== "");
      const created = await createMeeting({
        title: title.trim(),
        workspace,
        description: description.trim() || undefined,
        meeting_date: new Date(meetingDate).toISOString(),
        duration_seconds: recordedDuration || 1800, // 30m default if not timed
        participants: validParticipants,
      });

      // 2. Upload Audio if attached
      const audioToUpload = uploadedFile || recordedBlob;
      if (audioToUpload) {
        setSubmitStep(2); // Uploading audio
        const filename = uploadedFile ? uploadedFile.name : `recording_${created.id}.webm`;
        await uploadMeetingAudio(created.id, audioToUpload, filename);
      }

      setSubmitStep(3); // Completed step, ready to redirect
      setTimeout(() => {
        router.push(`/meetings/${created.id}`);
      }, 1200);
    } catch (err) {
      console.error("Failed to create meeting:", err);
      setErrors({ submit: "Failed to create meeting. Please verify that the backend API is running." });
      setIsSubmitting(false);
      setSubmitStep(0);
    }
  };

  const workspaceOptions = [
    "Engineering Syncs",
    "Product & Design",
    "Client Reviews",
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header & Back Link */}
      <div className="space-y-3">
        <Link
          href="/meetings"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Meetings</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              New Meeting
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Record or upload audio to generate automated meeting notes, transcription, and action items.
            </p>
          </div>
          <Badge variant="indigo" size="md">
            <Sparkles className="w-3.5 h-3.5 mr-1 inline" />
            AI Audio Processing
          </Badge>
        </div>
      </div>

      {/* Progress Overlay Modal if Submitting */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-[#070314]/85 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 space-y-5 bg-[#160c3d] border-[#5925DC]/40 text-center shadow-2xl">
            <div className="inline-flex p-3 rounded-full bg-[#5925DC]/15 text-[#7A5BF8] border border-[#5925DC]/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Processing Meeting Setup...</h3>
              <p className="text-xs text-slate-400">Saving meeting workspace and uploading recording.</p>
            </div>

            {/* Steps Checklist */}
            <div className="space-y-2.5 text-left bg-[#100730]/90 p-4 rounded-xl border border-[#251357] text-xs">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 fill-emerald-500/20" />
                <span className="font-medium">Meeting created in SQLite</span>
              </div>

              <div className={`flex items-center gap-2.5 ${submitStep >= 2 ? "text-emerald-400" : "text-slate-400"}`}>
                <CheckCircle2 className={`w-4 h-4 ${submitStep >= 2 ? "fill-emerald-500/20 text-emerald-400" : "text-slate-600"}`} />
                <span className="font-medium">Audio recording uploaded</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-400">
                <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px]">○</span>
                <span>Preparing transcript segments</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-400">
                <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px]">○</span>
                <span>Generating meeting insights</span>
              </div>
            </div>

            <p className="text-[11px] text-purple-300 font-mono animate-pulse">
              Redirecting to meeting workspace...
            </p>
          </Card>
        </div>
      )}

      {/* Main Form Form Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Details & Participants (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <Card className="p-5 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-[#251357]/80 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#7A5BF8]" />
              <span>Meeting Information</span>
            </h2>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Meeting Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Engineering Sprint Planning & Architecture Sync"
                className={`w-full px-3 py-2 text-xs bg-[#100730]/90 text-slate-100 placeholder-slate-500 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#5925DC] focus:border-[#5925DC] ${
                  errors.title ? "border-rose-500" : "border-[#251357]"
                }`}
              />
              {errors.title && <p className="text-xs text-rose-400">{errors.title}</p>}
            </div>

            {/* Workspace & Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Workspace */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#7A5BF8]" />
                  <span>Workspace</span> <span className="text-rose-400">*</span>
                </label>
                <select
                  value={workspace}
                  onChange={(e) => setWorkspace(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#100730]/90 text-slate-200 rounded-lg border border-[#251357] focus:outline-none focus:ring-1 focus:ring-[#5925DC] focus:border-[#5925DC] appearance-none cursor-pointer"
                >
                  {workspaceOptions.map((ws) => (
                    <option key={ws} value={ws} className="bg-[#100730] text-slate-200">
                      {ws}
                    </option>
                  ))}
                </select>
              </div>

              {/* Meeting Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#7A5BF8]" />
                  <span>Meeting Date</span> <span className="text-rose-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#100730]/90 text-slate-200 rounded-lg border border-[#251357] focus:outline-none focus:ring-1 focus:ring-[#5925DC] focus:border-[#5925DC] cursor-pointer"
                />
              </div>
            </div>

            {/* Description (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Meeting Description <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key goals, agenda items, or discussion context..."
                rows={3}
                className="w-full px-3 py-2 text-xs bg-[#100730]/90 text-slate-100 placeholder-slate-500 rounded-lg border border-[#251357] focus:outline-none focus:ring-1 focus:ring-[#5925DC] focus:border-[#5925DC] resize-none"
              />
            </div>
          </Card>

          {/* Dynamic Participants Card */}
          <Card className="p-5">
            <ParticipantInput
              participants={participants}
              onChange={setParticipants}
              error={errors.participants}
            />
          </Card>
        </div>

        {/* Right Column: Audio Recording / Upload (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="p-5 space-y-4 border-[#5925DC]/30 bg-gradient-to-b from-[#5925DC]/15 to-[#160c3d]">
            <div className="flex items-center justify-between pb-2 border-b border-[#251357]/80">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileAudio className="w-4 h-4 text-[#7A5BF8]" />
                <span>Audio Recording</span>
              </h2>
              <Badge variant="indigo" size="sm">
                Optional
              </Badge>
            </div>

            {/* Audio Mode Tabs */}
            <div className="flex items-center gap-1 bg-[#100730]/90 p-1 rounded-lg border border-[#251357]">
              <button
                type="button"
                onClick={() => setAudioTab("record")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  audioTab === "record"
                    ? "bg-[#5925DC] text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Record Audio</span>
              </button>

              <button
                type="button"
                onClick={() => setAudioTab("upload")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  audioTab === "upload"
                    ? "bg-[#5925DC] text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Audio</span>
              </button>
            </div>

            {/* Active Tab Panel */}
            {audioTab === "record" ? (
              <AudioRecorder
                recordedBlob={recordedBlob}
                onRecordingComplete={(blob, duration) => {
                  setRecordedBlob(blob);
                  setRecordedDuration(duration);
                  setUploadedFile(null); // exclusive
                }}
                onClearRecording={() => {
                  setRecordedBlob(null);
                  setRecordedDuration(0);
                }}
              />
            ) : (
              <AudioUploader
                selectedFile={uploadedFile}
                onFileSelect={(file) => {
                  setUploadedFile(file);
                  setRecordedBlob(null); // exclusive
                }}
              />
            )}
          </Card>

          {/* Submission Action Card */}
          <Card className="p-5 space-y-3 bg-[#160c3d]/90 border-[#2b1764]">
            {errors.submit && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.submit}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-semibold shadow-lg shadow-[#5925DC]/30 text-sm py-3"
              disabled={isSubmitting}
              icon={<Plus className="w-4 h-4" />}
            >
              {isSubmitting ? "Creating Meeting..." : "Create Meeting"}
            </Button>

            <p className="text-[11px] text-slate-400 text-center">
              Your meeting will be registered in SQLite and ready for transcription review.
            </p>
          </Card>
        </div>
      </form>
    </div>
  );
}
