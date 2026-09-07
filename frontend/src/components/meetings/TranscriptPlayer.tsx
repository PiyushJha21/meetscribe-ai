"use client";

import React, { useEffect, useRef } from "react";
import { Pause, Play, RotateCcw, RotateCw, Volume2 } from "lucide-react";
import { formatTimecode } from "@/lib/utils";

interface TranscriptPlayerProps {
  currentTime: number;
  totalDuration: number;
  isPlaying: boolean;
  onPlayPauseToggle: () => void;
  onSeek: (seconds: number) => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
}

export const TranscriptPlayer: React.FC<TranscriptPlayerProps> = ({
  currentTime,
  totalDuration,
  isPlaying,
  onPlayPauseToggle,
  onSeek,
  playbackSpeed,
  onSpeedChange,
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Simulated playback ticker
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        onSeek(Math.min(currentTime + 1, totalDuration));
      }, 1000 / playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTime, totalDuration, playbackSpeed, onSeek]);

  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || totalDuration === 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSeconds = Math.round(ratio * totalDuration);
    onSeek(targetSeconds);
  };

  const handleSkip = (secondsDelta: number) => {
    const newTime = Math.max(0, Math.min(totalDuration, currentTime + secondsDelta));
    onSeek(newTime);
  };

  const speedOptions = [1, 1.25, 1.5, 2];

  return (
    <div className="bg-[#160c3d]/95 border border-[#2b1764] rounded-xl p-3.5 space-y-2.5 backdrop-blur-md shadow-md">
      {/* Interactive Progress Bar */}
      <div
        ref={progressBarRef}
        onClick={handleBarClick}
        className="group relative h-2 w-full bg-[#100730] rounded-full cursor-pointer overflow-hidden transition-all hover:h-2.5 border border-[#251357]"
      >
        <div
          className="h-full bg-gradient-to-r from-[#5925DC] to-[#7A5BF8] rounded-full relative transition-all duration-150"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Controls and Timestamps */}
      <div className="flex items-center justify-between gap-2 text-xs">
        {/* Playback Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSkip(-10)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1c104d] transition-colors cursor-pointer"
            title="Rewind 10s"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onPlayPauseToggle}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#5925DC] hover:bg-[#6b35e8] text-white shadow-md shadow-[#5925DC]/30 transition-all active:scale-95 cursor-pointer"
            title={isPlaying ? "Pause playback" : "Play transcript audio"}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white translate-x-0.5" />}
          </button>

          <button
            onClick={() => handleSkip(10)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1c104d] transition-colors cursor-pointer"
            title="Fast forward 10s"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Timecode */}
          <div className="font-mono text-xs text-slate-300 ml-1">
            <span className="text-white font-semibold">{formatTimecode(currentTime)}</span>
            <span className="text-slate-400"> / {formatTimecode(totalDuration)}</span>
          </div>
        </div>

        {/* Speed & Volume Right Controls */}
        <div className="flex items-center gap-2">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-[#100730]/80 p-1 rounded-lg border border-[#251357]">
            {speedOptions.map((speed) => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`px-1.5 py-0.5 text-[10px] font-mono font-medium rounded transition-colors cursor-pointer ${
                  playbackSpeed === speed
                    ? "bg-[#5925DC] text-white shadow-sm shadow-[#5925DC]/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          <div className="p-1.5 text-slate-400 hover:text-slate-200 hidden sm:block">
            <Volume2 className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

