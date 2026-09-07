"use client";

import React, { useRef, useState } from "react";
import { AlertCircle, FileAudio, Trash2, UploadCloud } from "lucide-react";

interface AudioUploaderProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  error?: string;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  selectedFile,
  onFileSelect,
  error,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/x-wav",
    "audio/mp4",
    "audio/webm",
    "audio/ogg",
    "audio/m4a",
    "audio/x-m4a",
  ];

  const validateAndSetFile = (file: File) => {
    setLocalError(null);
    const isValidType =
      allowedTypes.includes(file.type) ||
      /\.(mp3|wav|m4a|webm|mp4|ogg|aac)$/i.test(file.name);

    if (!isValidType) {
      setLocalError("Invalid file format. Supported formats: MP3, WAV, M4A, WebM, MP4, OGG.");
      return;
    }

    // Max 100MB check
    if (file.size > 100 * 1024 * 1024) {
      setLocalError("File is too large. Maximum allowed size is 100MB.");
      return;
    }

    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.m4a,.webm,.mp4,.ogg"
        onChange={handleChange}
        className="hidden"
      />

      {selectedFile ? (
        /* Selected File Card */
        <div className="p-4 rounded-xl bg-[#100730]/70 border border-[#251357] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-[#5925DC]/15 text-[#7A5BF8] border border-[#5925DC]/30">
                <FileAudio className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate" title={selectedFile.name}>
                  {selectedFile.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  {formatFileSize(selectedFile.size)} • Ready to upload
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onFileSelect(null)}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>

          <audio src={URL.createObjectURL(selectedFile)} controls className="w-full h-10 rounded-lg" />
        </div>
      ) : (
        /* Dropzone */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-8 rounded-xl border border-dashed text-center transition-all cursor-pointer ${
            dragActive
              ? "border-[#5925DC] bg-[#5925DC]/10"
              : "border-[#251357] bg-[#100730]/50 hover:border-[#381c7e] hover:bg-[#100730]/70"
          }`}
        >
          <div className="p-3 rounded-full bg-[#5925DC]/15 text-[#7A5BF8] border border-[#5925DC]/30 mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-slate-200">
            Click to upload or drag & drop audio file
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Supports MP3, WAV, M4A, WebM, MP4 (Max 100MB)
          </p>
        </div>
      )}

      {(localError || error) && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{localError || error}</span>
        </div>
      )}
    </div>
  );
};
