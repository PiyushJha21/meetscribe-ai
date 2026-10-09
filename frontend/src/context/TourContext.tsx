"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

export interface TourStep {
  id: string;
  stepNumber: number;
  totalSteps: number;
  route: string;
  targetId?: string;
  badge: string;
  title: string;
  description: string;
  notes?: string;
  isUnavailableFeature?: boolean;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "login",
    stepNumber: 1,
    totalSteps: 7,
    route: "/login",
    targetId: "tour-login-card",
    badge: "Step 1: Access & Login",
    title: "Authenticate with Demo Account",
    description:
      "MeetScribe uses secure backend session tokens. For testing and review, use the documented demo credentials (piyush.jha@syncspace.in) or click 'Auto-Fill Demo' to sign in.",
    notes: "Requires authentication to protect workspace meeting notes and action items.",
  },
  {
    id: "dashboard",
    stepNumber: 2,
    totalSteps: 7,
    route: "/dashboard",
    targetId: "tour-metrics-strip",
    badge: "Step 2: Workspace Dashboard",
    title: "Real-Time Productivity Metrics",
    description:
      "The dashboard calculates live metrics directly from your SQLite database: Total Meetings, Open Action Items, Completed Tasks, and completion rates. Quick-action cards allow direct jumping into recent meetings.",
  },
  {
    id: "meetings",
    stepNumber: 3,
    totalSteps: 7,
    route: "/meetings",
    targetId: "tour-meeting-filters",
    badge: "Step 3: Meetings Explorer",
    title: "Workspace Channels & Filtering",
    description:
      "Explore discussions organized across dedicated channels (Engineering Syncs, Product & Design, Client Reviews). Use the real-time search, duration sorters, and date range filters to locate recordings instantly.",
  },
  {
    id: "transcript-player",
    stepNumber: 4,
    totalSteps: 7,
    route: "/meetings/1",
    targetId: "tour-transcript-workspace",
    badge: "Step 4: Synchronized Player",
    title: "Timestamp-Synchronized Transcripts",
    description:
      "Each spoken line is paired with attached audio playback. Clicking any transcript utterance or timestamp automatically seeks the audio player directly to that second.",
  },
  {
    id: "ai-intelligence",
    stepNumber: 5,
    totalSteps: 7,
    route: "/meetings/1",
    targetId: "tour-summary-panel",
    badge: "Step 5: AI Summaries & Topics",
    title: "Executive Summaries & Topics",
    description:
      "MeetScribe's NLP extraction analyzes transcript text to generate structured executive summaries, chronological topic chapters, and actionable follow-ups.",
  },
  {
    id: "new-meeting",
    stepNumber: 6,
    totalSteps: 7,
    route: "/new-meeting",
    targetId: "tour-audio-recorder",
    badge: "Step 6: Meeting Creation",
    title: "Live Microphone Capture & Audio Upload",
    description:
      "Record audio directly in the browser using the MediaRecorder API or upload recordings in MP3, WAV, or WebM. Attach attendees and assign meetings to specific channels.",
  },
  {
    id: "action-items",
    stepNumber: 7,
    totalSteps: 7,
    route: "/action-items",
    targetId: "tour-actions-table",
    badge: "Step 7: Action Items Hub",
    title: "Centralized Task Tracking",
    description:
      "Action items extracted across all meetings are aggregated in this central hub. Check off completed items to instantly sync status changes back to the database.",
  },
];

interface TourContextType {
  isTourActive: boolean;
  currentStepIndex: number;
  currentStep: TourStep | null;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  skipTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Restore tour state if active
  useEffect(() => {
    const savedActive = localStorage.getItem("meetscribe_tour_active");
    const savedStep = localStorage.getItem("meetscribe_tour_step");
    if (savedActive === "true" && savedStep !== null) {
      setIsTourActive(true);
      setCurrentStepIndex(parseInt(savedStep, 10) || 0);
    }
  }, []);

  const saveTourState = (active: boolean, step: number) => {
    localStorage.setItem("meetscribe_tour_active", String(active));
    localStorage.setItem("meetscribe_tour_step", String(step));
  };

  const startTour = useCallback(() => {
    setIsTourActive(true);
    // If already authenticated, start at Step 2 (Dashboard)
    if (isAuthenticated) {
      setCurrentStepIndex(1);
      saveTourState(true, 1);
      if (pathname !== "/dashboard") {
        router.push("/dashboard");
      }
    } else {
      // Start at Step 1 (Login Guidance)
      setCurrentStepIndex(0);
      saveTourState(true, 0);
      if (pathname !== "/login") {
        router.push("/login");
      }
    }
  }, [isAuthenticated, pathname, router]);

  const goToStep = useCallback(
    (index: number) => {
      if (index < 0 || index >= TOUR_STEPS.length) return;
      const targetStep = TOUR_STEPS[index];
      setCurrentStepIndex(index);
      saveTourState(true, index);

      // If going to login while authenticated, advance to dashboard
      if (targetStep.route === "/login" && isAuthenticated) {
        setCurrentStepIndex(1);
        saveTourState(true, 1);
        if (pathname !== "/dashboard") {
          router.push("/dashboard");
        }
        return;
      }

      if (pathname !== targetStep.route) {
        router.push(targetStep.route);
      }
    },
    [isAuthenticated, pathname, router]
  );

  const nextStep = useCallback(() => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      goToStep(currentStepIndex + 1);
    } else {
      // Finished
      skipTour();
    }
  }, [currentStepIndex, goToStep]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  }, [currentStepIndex, goToStep]);

  const skipTour = useCallback(() => {
    setIsTourActive(false);
    setCurrentStepIndex(0);
    localStorage.removeItem("meetscribe_tour_active");
    localStorage.removeItem("meetscribe_tour_step");
  }, []);

  // Auto-advance from Step 1 to Step 2 upon successful login
  useEffect(() => {
    if (isTourActive && currentStepIndex === 0 && isAuthenticated) {
      setCurrentStepIndex(1);
      saveTourState(true, 1);
      if (pathname !== "/dashboard") {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isTourActive, currentStepIndex, pathname, router]);

  const currentStep = isTourActive ? TOUR_STEPS[currentStepIndex] : null;

  return (
    <TourContext.Provider
      value={{
        isTourActive,
        currentStepIndex,
        currentStep,
        startTour,
        nextStep,
        prevStep,
        goToStep,
        skipTour,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};

export function useTour(): TourContextType {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}
