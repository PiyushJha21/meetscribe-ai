"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Square,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatTimecode } from "@/lib/utils";

interface AudioRecorderProps {
  recordedBlob: Blob | null;
  onRecordingComplete: (blob: Blob, durationSeconds: number) => void;
  onClearRecording: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  recordedBlob,
  onRecordingComplete,
  onClearRecording,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Sync audio preview URL
  useEffect(() => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      setAudioUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setAudioUrl(null);
    }
  }, [recordedBlob]);

  // Clean up media streams on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    setMicError(null);
    audioChunksRef.current = [];
    setRecordSeconds(0);

    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setMicError("Audio recording is not supported in this browser environment.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        onRecordingComplete(blob, recordSeconds || 1);

        // Stop mic tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start(250); // collect 250ms chunks
      setIsRecording(true);
      setIsPaused(false);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      console.error("Microphone access error:", err);
      setMicError("Microphone permission denied or microphone not found. Please check browser settings.");
      setIsRecording(false);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  return (
    <div className="space-y-4 p-4.5 rounded-xl bg-[#100730]/70 border border-[#251357]">
      {micError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{micError}</span>
        </div>
      )}

      {/* Recording in Progress State */}
      {isRecording ? (
        <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
          <div className="relative">
            <span className="absolute -inset-2 rounded-full bg-rose-500/20 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
              <Mic className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xl font-bold font-mono text-white">
              {formatTimecode(recordSeconds)}
            </p>
            <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5 justify-center">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              {isPaused ? "Recording Paused" : "Recording in Progress..."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {isPaused ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={resumeRecording}
                icon={<Play className="w-3.5 h-3.5" />}
              >
                Resume
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={pauseRecording}
                icon={<Pause className="w-3.5 h-3.5" />}
              >
                Pause
              </Button>
            )}

            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={stopRecording}
              icon={<Square className="w-3.5 h-3.5" />}
            >
              Stop Recording
            </Button>
          </div>
        </div>
      ) : audioUrl ? (
        /* Recorded Preview State */
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Audio Captured ({formatTimecode(recordSeconds)})
            </span>
            <button
              type="button"
              onClick={onClearRecording}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Audio</span>
            </button>
          </div>

          <audio src={audioUrl} controls className="w-full h-10 rounded-lg" />

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={startRecording}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Re-record
            </Button>
          </div>
        </div>
      ) : (
        /* Initial Ready State */
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="p-3 rounded-full bg-[#5925DC]/15 text-[#7A5BF8] border border-[#5925DC]/30">
            <Mic className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-xs">
            <p className="text-xs font-semibold text-slate-200">Record Live Audio</p>
            <p className="text-[11px] text-slate-400">
              Capture meeting audio directly from your microphone using the browser MediaRecorder API.
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={startRecording}
            icon={<Mic className="w-3.5 h-3.5" />}
          >
            Start Recording
          </Button>
        </div>
      )}
    </div>
  );
};

