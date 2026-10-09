"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles,
  X,
} from "lucide-react";
import { useTour } from "@/context/TourContext";

export const GuidedTourOverlay: React.FC = () => {
  const { isTourActive, currentStep, currentStepIndex, nextStep, prevStep, goToStep, skipTour } =
    useTour();

  const [isMinimized, setIsMinimized] = useState(false);

  // Apply visual spotlight/ring on targeted UI element
  useEffect(() => {
    if (!isTourActive || !currentStep?.targetId) return;

    const targetEl = document.getElementById(currentStep.targetId);
    if (targetEl) {
      targetEl.classList.add("tour-highlight-active");
      targetEl.scrollIntoView({ behavior: "smooth", block: "center" });

      return () => {
        targetEl.classList.remove("tour-highlight-active");
      };
    }
  }, [isTourActive, currentStep]);

  if (!isTourActive || !currentStep) return null;

  const isLastStep = currentStepIndex === currentStep.totalSteps - 1;

  return (
    <>
      {/* Global CSS style for targeted element highlight */}
      <style jsx global>{`
        .tour-highlight-active {
          position: relative !important;
          z-index: 30 !important;
          outline: 3px solid #7a5bf8 !important;
          outline-offset: 4px !important;
          border-radius: 12px !important;
          box-shadow: 0 0 25px rgba(122, 91, 248, 0.45) !important;
          transition: all 0.3s ease-in-out !important;
        }
      `}</style>

      {/* Floating Guided Tour Card */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-auto animate-in slide-in-from-bottom-5 fade-in duration-250 pointer-events-auto">
        <div className="bg-[#140a38]/95 backdrop-blur-xl border border-[#3b1e7e] rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black/80 text-slate-100 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#5925DC]/25 border border-[#5925DC]/50 text-purple-200 text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#7A5BF8]" />
              <span>{currentStep.badge}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-mono text-slate-400 mr-2">
                {currentStepIndex + 1} / {currentStep.totalSteps}
              </span>
              <button
                type="button"
                onClick={skipTour}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="End Guided Tour"
                aria-label="End Guided Tour"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-1.5">
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>{currentStep.title}</span>
            </h4>
            <p className="text-xs sm:text-[13px] text-purple-200/80 leading-relaxed font-normal">
              {currentStep.description}
            </p>
          </div>

          {currentStep.notes && (
            <div className="p-2.5 rounded-xl bg-[#0c0424] border border-[#2e176b] flex items-start gap-2 text-[11px] text-slate-300">
              <Info className="w-3.5 h-3.5 text-[#7A5BF8] shrink-0 mt-0.5" />
              <span>{currentStep.notes}</span>
            </div>
          )}

          {/* Footer Controls & Progress Dots */}
          <div className="pt-2 border-t border-[#251357]/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: currentStep.totalSteps }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToStep(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentStepIndex === idx
                      ? "w-5 bg-[#7A5BF8]"
                      : "w-1.5 bg-[#2b1764] hover:bg-purple-400"
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={skipTour}
                className="text-[11px] font-semibold text-slate-400 hover:text-white px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                Skip Tour
              </button>

              <button
                type="button"
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="p-1.5 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded-lg hover:bg-white/5 transition-colors cursor-pointer flex items-center"
                aria-label="Previous Step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={nextStep}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#5925DC] to-[#7A5BF8] hover:from-[#662ce6] hover:to-[#8869fc] rounded-lg shadow-md shadow-[#5925DC]/30 transition-all cursor-pointer flex items-center gap-1"
              >
                <span>{isLastStep ? "Finish Tour" : "Next"}</span>
                {!isLastStep && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
