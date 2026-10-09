"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  AudioLines,
  Calendar,
  CheckCircle2,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Cpu,
  Database,
  FileAudio,
  FileSpreadsheet,
  FileText,
  FolderKanban,
  Headphones,
  Layers,
  Lock,
  Mic,
  Minus,
  Play,
  Plus,
  Radio,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Volume2,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { useTour } from "@/context/TourContext";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"summary" | "actions" | "topics">("summary");
  const { startTour } = useTour();

  // Sign Up Coming Soon Modal state
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is MeetScribe?",
      answer:
        "MeetScribe is an AI-assisted meeting intelligence and transcription platform designed to capture, transcribe, summarize, and organize team discussions into structured notes, topic chapters, and trackable action items.",
    },
    {
      question: "Which transcript formats are supported?",
      answer:
        "MeetScribe parses structured transcripts in WebVTT (.vtt), JSON (.json), and Plain Text (.txt) formats, extracting speaker names, timestamps, and utterance sequences automatically.",
    },
    {
      question: "Can I record and upload audio directly?",
      answer:
        "Yes. You can record live audio directly in your browser using the MediaRecorder API or upload audio files in MP3, WAV, WebM, AAC, and OGG formats to attach to your meetings.",
    },
    {
      question: "How does audio playback synchronization work?",
      answer:
        "MeetScribe synchronizes audio playback with parsed transcript timestamps. Clicking on any transcript line or key topic automatically seeks the audio player to that exact time in the recording.",
    },
    {
      question: "How are Executive Summaries and Topics generated?",
      answer:
        "MeetScribe's intelligence engine analyzes transcript segments to generate structured executive overviews and divides the discussion into sequential topic chapters with start and end timestamps.",
    },
    {
      question: "How are Action Items extracted and tracked?",
      answer:
        "The system analyzes transcript sentences for concrete deliverable tasks, identifying assigned owners and deadlines. All tasks are synced to a centralized Action Items Hub where completion status can be toggled in real-time.",
    },
    {
      question: "What technology stack powers MeetScribe?",
      answer:
        "MeetScribe is built with a Next.js 16 (App Router) and TypeScript frontend, a FastAPI Python backend, and a thread-safe SQLite 3 database managed via SQLAlchemy 2.0 with strict Pydantic v2 schemas.",
    },
    {
      question: "How do I log in to explore the platform?",
      answer:
        "Click the Login button at the top right to access the login page with pre-configured demo workspace access, or click Enter Workspace to go straight to the live dashboard.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#100730] text-slate-100 selection:bg-[#5925DC] selection:text-white overflow-x-hidden font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP ANNOUNCEMENT BAR */}
      {/* ========================================================================= */}
      <div className="bg-[#7A5BF8] border-b border-[#6944f5] py-2 px-4 text-center text-xs text-white shadow-sm relative z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-white text-[#5925DC] rounded-full shadow-sm">
            PLATFORM
          </span>
          <span className="hidden sm:inline font-medium text-purple-100">
            MeetScribe Meeting Intelligence Platform:
          </span>
          <span className="text-white font-semibold">
            Audio recording, synchronized transcripts & automated action items.
          </span>
          <Link
            href="/meetings"
            className="inline-flex items-center text-white hover:text-purple-100 font-bold underline underline-offset-2 ml-1 text-xs transition-colors"
          >
            Explore Meetings <ChevronRight className="w-3.5 h-3.5 ml-0.5 inline" />
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP HORIZONTAL NAVIGATION BAR */}
      {/* ========================================================================= */}
      <LandingNavbar
        onRequestDemo={startTour}
        onSignupClick={() => setSignupModalOpen(true)}
      />

      {/* ========================================================================= */}
      {/* 3. HERO SHOWCASE SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[480px] bg-[#5925DC]/20 rounded-full blur-[150px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-[#7A5BF8]/15 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Subtle Star / Particle Specks */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[8%] left-[12%] w-1 h-1 bg-white/50 rounded-full blur-[0.5px] animate-pulse" />
          <div className="absolute top-[14%] right-[18%] w-1.5 h-1.5 bg-purple-200/60 rounded-full blur-[0.5px]" />
          <div className="absolute top-[22%] left-[28%] w-1 h-1 bg-white/40 rounded-full" />
          <div className="absolute top-[18%] right-[32%] w-1 h-1 bg-indigo-200/50 rounded-full blur-[0.5px]" />
          <div className="absolute top-[30%] left-[8%] w-1.5 h-1.5 bg-[#7A5BF8]/60 rounded-full blur-[1px]" />
          <div className="absolute top-[28%] right-[10%] w-1 h-1 bg-white/60 rounded-full" />
          <div className="absolute top-[42%] left-[16%] w-1 h-1 bg-purple-100/40 rounded-full" />
          <div className="absolute top-[48%] right-[22%] w-1.5 h-1.5 bg-white/50 rounded-full blur-[0.5px]" />
          <div className="absolute top-[6%] left-[45%] w-1 h-1 bg-white/30 rounded-full" />
          <div className="absolute top-[52%] left-[4%] w-1 h-1 bg-purple-300/40 rounded-full" />
          <div className="absolute top-[60%] right-[6%] w-1.5 h-1.5 bg-indigo-300/50 rounded-full blur-[0.5px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5925DC]/20 border border-[#5925DC]/40 text-purple-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>FastAPI & Next.js Full-Stack Architecture</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
            Intelligent AI Workspace For <br />
            <span className="bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
              Your Team Meetings
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-purple-200/80 leading-relaxed font-normal">
            Record audio, import multi-format transcripts, generate structured summaries, and track assigned action items in a unified workspace.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-12 min-w-[170px] px-7 text-sm font-semibold text-white bg-gradient-to-r from-[#5925DC] to-[#7A5BF8] hover:from-[#662ce6] hover:to-[#8869fc] active:bg-[#4c1fc0] rounded-xl shadow-xl shadow-[#5925DC]/35 border border-[#8667fc]/30 transition-all cursor-pointer inline-flex items-center justify-center gap-2 group">
                <span>Enter Live Workspace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <button
              onClick={startTour}
              className="w-full sm:w-auto h-12 min-w-[170px] px-7 text-sm font-semibold bg-[#1c123d]/85 hover:bg-[#271954] active:bg-[#140b2e] text-white rounded-xl shadow-lg border border-[#3c227d]/80 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#7A5BF8]" />
              <span>Guided Product Tour</span>
            </button>
            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-12 min-w-[130px] px-6 text-sm font-semibold bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white rounded-xl border border-white/10 transition-all cursor-pointer inline-flex items-center justify-center">
                <span>Login</span>
              </button>
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. APPLICATION PREVIEW WORKSPACE */}
        {/* ========================================================================= */}
        <div id="product" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 md:pt-18">
          {/* Centered Technical Capability Trust Badge */}
          <div className="relative z-20 -mb-5 flex justify-center px-4">
            <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-5 sm:px-6 py-2 rounded-full bg-[#180b3d]/95 backdrop-blur-md border border-[#3b1e7e] text-xs text-purple-200 shadow-2xl shadow-black/60">
              <div className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-purple-400" />
                <span className="text-slate-200 font-medium">SQLite 3 & SQLAlchemy 2.0 ORM</span>
              </div>
              <span className="text-purple-400/50 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200 font-medium">FastAPI & Pydantic v2 Schemas</span>
              </div>
              <span className="text-purple-400/50 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200 font-medium">.vtt, .json, and .txt Transcripts</span>
              </div>
            </div>
          </div>

          {/* Large Application Preview Container */}
          <div className="relative rounded-2xl p-1.5 sm:p-2 bg-gradient-to-b from-white/20 via-purple-500/20 to-purple-900/30 shadow-2xl shadow-purple-950/90 border border-purple-400/20">
            <div className="bg-white rounded-xl overflow-hidden border border-slate-200/90 shadow-2xl text-slate-900">
              {/* Window Chrome Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-100/90 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-mono text-slate-600 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>MeetScribe Live Workspace / Meeting #1</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#5925DC] border border-purple-200 font-semibold">
                    Interactive Preview
                  </span>
                </div>
              </div>

              {/* Workspace Top Bar */}
              <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    AUDIO ATTACHED
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800"># Engineering Syncs</span>
                    <span>/</span>
                    <span className="font-bold text-slate-900 truncate">
                      Architecture & Scalability Discussion
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Link href="/meetings/1">
                    <button className="bg-[#5925DC] hover:bg-[#6832e3] text-white text-xs px-3.5 py-1.5 rounded-lg font-semibold shadow-sm inline-flex items-center gap-1.5 cursor-pointer transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Open Workspace</span>
                    </button>
                  </Link>
                </div>
              </div>

              {/* Application Workspace Content */}
              <div className="p-4 sm:p-6 bg-white space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Left: Synchronized Audio & Transcript (7 Cols) */}
                  <div className="lg:col-span-7 space-y-3.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-50 text-[#5925DC] border border-purple-200 inline-flex items-center">
                          <Radio className="w-3 h-3 mr-1 inline text-[#5925DC]" />
                          MTG-IND-2026-001
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          Synchronized Audio & Dialog Feed
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 font-medium">25:00 Duration</span>
                    </div>

                    {/* Audio Player Bar */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <button className="p-2 rounded-lg bg-[#5925DC] text-white shadow-sm hover:bg-[#6832e3] transition-colors cursor-pointer">
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <span className="text-[11px] font-mono font-medium text-slate-700">04:15 / 25:00</span>
                      </div>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden relative">
                        <div className="h-full bg-gradient-to-r from-[#5925DC] to-[#7A5BF8] w-[42%]" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          1.0x
                        </span>
                      </div>
                    </div>

                    {/* Synchronized Transcripts */}
                    <div className="space-y-2.5 text-xs pt-1">
                      <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200/90 shadow-xs">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#5925DC]">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#5925DC]" />
                            Piyush Jha (Tech Lead)
                          </span>
                          <span className="font-mono text-slate-500 text-[10px] font-normal">04:15</span>
                        </div>
                        <p className="text-slate-900 mt-1.5 text-[11.5px] leading-relaxed font-medium">
                          &quot;We must ensure idempotent request keys are validated on the cache layer before triggering database transactions.&quot;
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                          <span>Ananya Sharma (Senior Backend)</span>
                          <span className="font-mono text-slate-400 text-[10px] font-normal">04:45</span>
                        </div>
                        <p className="text-slate-600 mt-1.5 text-[11.5px] leading-relaxed">
                          &quot;Agreed. I have prepared the benchmark scripts to test 2,500 TPS load on the staging cluster.&quot;
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: AI Intelligence Panel (5 Cols) */}
                  <div className="lg:col-span-5 space-y-3.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between">
                    <div>
                      {/* Tab Selector */}
                      <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-200/80 border border-slate-200 mb-3">
                        <button
                          onClick={() => setActiveTab("summary")}
                          className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                            activeTab === "summary"
                              ? "bg-white text-[#5925DC] shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Summary
                        </button>
                        <button
                          onClick={() => setActiveTab("actions")}
                          className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                            activeTab === "actions"
                              ? "bg-white text-[#5925DC] shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Action Items
                        </button>
                        <button
                          onClick={() => setActiveTab("topics")}
                          className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                            activeTab === "topics"
                              ? "bg-white text-[#5925DC] shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Topics
                        </button>
                      </div>

                      {/* Tab Content */}
                      {activeTab === "summary" && (
                        <div className="space-y-3">
                          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                            <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#5925DC]" />
                              Executive Summary
                            </h5>
                            <p className="text-[11.5px] text-slate-700 leading-relaxed">
                              Engineering sync aligned on scaling request throughput to 2,500 TPS with zero-downtime database migrations and robust cache validation.
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                            <h5 className="text-[11px] font-bold text-slate-900 mb-1.5">Key Decisions</h5>
                            <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                              <li>Enforce 60-second TTL on idempotency validation</li>
                              <li>Schedule staging load tests for Thursday 3 PM</li>
                            </ul>
                          </div>
                        </div>
                      )}

                      {activeTab === "actions" && (
                        <div className="space-y-2">
                          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs flex items-start gap-2.5 text-[11px]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-slate-900">Deploy Redis cluster patch</p>
                              <p className="text-[10px] text-slate-500">Assigned to: Piyush Jha</p>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs flex items-start gap-2.5 text-[11px]">
                            <CheckSquare className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-slate-900">Conduct load test for 2.5k TPS</p>
                              <p className="text-[10px] text-slate-500">Assigned to: Ananya Sharma</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "topics" && (
                        <div className="space-y-2">
                          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                            <span className="text-[10px] font-mono font-bold text-[#5925DC] bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                              00:00 - 08:30
                            </span>
                            <p className="text-xs font-bold text-slate-900 mt-1">Payment Gateway Architecture</p>
                          </div>
                          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs">
                            <span className="text-[10px] font-mono font-bold text-[#5925DC] bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                              08:31 - 18:45
                            </span>
                            <p className="text-xs font-bold text-slate-900 mt-1">Idempotency & Database Locks</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <Link href="/meetings/1" className="block pt-2">
                      <button className="w-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#5925DC] font-bold text-xs py-2.5 rounded-lg text-center cursor-pointer transition-colors">
                        Open Full Meeting Workspace →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CORE FEATURES SECTION */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 bg-[#0d0526] border-t border-[#1d0d47] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5925DC] bg-[#5925DC]/15 px-3 py-1 rounded-full border border-[#5925DC]/30">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Modern Meeting Productivity
            </h2>
            <p className="text-sm text-purple-200/70 leading-relaxed">
              Every feature is engineered directly in the platform architecture, providing end-to-end support for audio, transcripts, and action tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#160b3d]/60 border border-[#2b1764]/70 hover:border-[#5925DC]/60 hover:bg-[#1a0e48]/80 transition-all duration-200 group shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#5925DC]/20 border border-[#5925DC]/40 text-purple-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-purple-200 transition-colors">
                Meeting Management & Channels
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Create, edit, organize, and manage meetings across dedicated workspace channels with participant attribution and duration tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#160b3d]/60 border border-[#2b1764]/70 hover:border-[#5925DC]/60 hover:bg-[#1a0e48]/80 transition-all duration-200 group shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#5925DC]/20 border border-[#5925DC]/40 text-purple-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileAudio className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-purple-200 transition-colors">
                In-Browser Audio Recording & Upload
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Capture live audio through your browser microphone via the MediaRecorder API or upload audio recordings in MP3, WAV, and WebM formats.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#160b3d]/60 border border-[#2b1764]/70 hover:border-[#5925DC]/60 hover:bg-[#1a0e48]/80 transition-all duration-200 group shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#5925DC]/20 border border-[#5925DC]/40 text-purple-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-purple-200 transition-colors">
                Multi-Format Transcript Ingestion
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Import structured transcripts from WebVTT (.vtt), JSON (.json), and Plain Text (.txt) formats with automated speaker attribution and timestamps.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#160b3d]/60 border border-[#2b1764]/70 hover:border-[#5925DC]/60 hover:bg-[#1a0e48]/80 transition-all duration-200 group shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#5925DC]/20 border border-[#5925DC]/40 text-purple-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-purple-200 transition-colors">
                Synchronized Audio Playback
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Interactive audio player synchronized with transcript lines. Click on any utterance or topic chapter to jump playback immediately to that point.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-[#160b3d]/60 border border-[#2b1764]/70 hover:border-[#5925DC]/60 hover:bg-[#1a0e48]/80 transition-all duration-200 group shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#5925DC]/20 border border-[#5925DC]/40 text-purple-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-purple-200 transition-colors">
                Automated AI Executive Summaries
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Extract high-level executive overviews and chronological discussion topics from transcript dialog for quick review and team alignment.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-[#160b3d]/60 border border-[#2b1764]/70 hover:border-[#5925DC]/60 hover:bg-[#1a0e48]/80 transition-all duration-200 group shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#5925DC]/20 border border-[#5925DC]/40 text-purple-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-purple-200 transition-colors">
                Centralized Action Items Hub
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Semantic task detection extracts deliverables, assigned owners, and deadlines, syncing them into a global action hub with real-time status toggles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. HOW IT WORKS SECTION */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 bg-[#100730] border-t border-[#1d0d47]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5925DC] bg-[#5925DC]/15 px-3 py-1 rounded-full border border-[#5925DC]/30">
              Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Simple, Direct Three-Step Workflow
            </h2>
            <p className="text-sm text-purple-200/70 leading-relaxed">
              From raw discussion audio to organized notes and actionable follow-ups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#160b3d]/70 border border-[#2b1764]/80 space-y-3 relative group hover:border-[#5925DC]/60 transition-all">
              <div className="text-3xl font-extrabold font-mono text-[#5925DC] group-hover:text-purple-300 transition-colors">
                01
              </div>
              <h3 className="text-base font-bold text-white">Create Meeting & Capture Audio</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add meeting details, select a workspace channel, specify participants, and record live audio or upload a recording.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#160b3d]/70 border border-[#2b1764]/80 space-y-3 relative group hover:border-[#5925DC]/60 transition-all">
              <div className="text-3xl font-extrabold font-mono text-[#5925DC] group-hover:text-purple-300 transition-colors">
                02
              </div>
              <h3 className="text-base font-bold text-white">Import Transcript & Run AI Analysis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste or upload WebVTT, JSON, or text transcripts. The parser processes speaker lines and extracts summaries and action items.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#160b3d]/70 border border-[#2b1764]/80 space-y-3 relative group hover:border-[#5925DC]/60 transition-all">
              <div className="text-3xl font-extrabold font-mono text-[#5925DC] group-hover:text-purple-300 transition-colors">
                03
              </div>
              <h3 className="text-base font-bold text-white">Review Notes & Track Follow-ups</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Navigate the transcript with synchronized audio playback, review key topic chapters, and manage action items to completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. TECHNICAL ARCHITECTURE HIGHLIGHTS */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#0d0526] border-t border-[#1d0d47]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-[#160b3d]/60 border border-[#2b1764]/70">
              <p className="text-2xl sm:text-3xl font-bold text-purple-300 font-mono">SQLite 3</p>
              <p className="text-xs font-semibold text-white mt-1">Structured Storage</p>
              <p className="text-[11px] text-purple-300/60 mt-1">SQLAlchemy 2.0 ORM</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#160b3d]/60 border border-[#2b1764]/70">
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">3 Formats</p>
              <p className="text-xs font-semibold text-white mt-1">Transcript Parsing</p>
              <p className="text-[11px] text-purple-300/60 mt-1">.vtt, .json, and .txt</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#160b3d]/60 border border-[#2b1764]/70">
              <p className="text-2xl sm:text-3xl font-bold text-purple-400 font-mono">Real-Time</p>
              <p className="text-xs font-semibold text-white mt-1">Action Item Toggles</p>
              <p className="text-[11px] text-purple-300/60 mt-1">Live database synchronization</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#160b3d]/60 border border-[#2b1764]/70">
              <p className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono">FastAPI</p>
              <p className="text-xs font-semibold text-white mt-1">REST Architecture</p>
              <p className="text-[11px] text-purple-300/60 mt-1">Pydantic v2 validation</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. CALL TO ACTION SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#5925DC]/20 via-[#100730] to-[#0a031e] -z-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5925DC]/20 border border-[#5925DC]/40 text-purple-200 text-xs font-medium">
            <Zap className="w-3.5 h-3.5 text-purple-300" />
            <span>Ready to Explore MeetScribe</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Centralize Your Team Discussions & Action Items
          </h2>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-purple-200/80 leading-relaxed">
            Experience clean, synchronized meeting notes, audio recordings, and automated task extraction.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-12 px-8 text-sm font-semibold bg-gradient-to-r from-[#5925DC] to-[#7A5BF8] hover:from-[#662ce6] hover:to-[#8869fc] text-white shadow-xl shadow-[#5925DC]/40 border border-[#8667fc]/30 rounded-xl active:bg-[#4c1fc0] inline-flex items-center justify-center gap-2 cursor-pointer">
                <span>Enter Live Workspace →</span>
              </button>
            </Link>
            <button
              onClick={startTour}
              className="w-full sm:w-auto h-12 px-8 text-sm font-semibold bg-[#1c123d]/85 hover:bg-[#271954] active:bg-[#140b2e] text-white rounded-xl shadow-lg border border-[#3c227d]/80 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#7A5BF8]" />
              <span>Guided Product Tour</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      {/* ========================================================================= */}
      <section id="faq" className="py-20 bg-white text-slate-900 border-t border-slate-200 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5925DC] bg-purple-50 px-3 py-1 rounded-full border border-purple-200 inline-block">
              Platform Details
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about MeetScribe&apos;s features, audio recording, and transcript intelligence.
            </p>
          </div>

          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="transition-colors">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full py-5 flex items-center justify-between text-left gap-4 group cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-semibold text-slate-900 group-hover:text-[#5925DC] transition-colors">
                      {faq.question}
                    </span>
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isOpen
                          ? "bg-[#5925DC] text-white rotate-180"
                          : "bg-slate-100 text-slate-600 group-hover:bg-purple-50 group-hover:text-[#5925DC]"
                      }`}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="pb-5 pt-1 text-sm text-slate-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* ========================================================================= */}
      {/* 11. SIGN UP COMING SOON MODAL */}
      {/* ========================================================================= */}
      {signupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md rounded-2xl bg-[#140a38] border border-[#2e176b] p-6 sm:p-8 shadow-2xl text-slate-100 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSignupModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-[#5925DC]/20 border border-[#5925DC]/40 text-[#7A5BF8] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Self-Serve Sign Up is Coming Soon
              </h3>
              <p className="text-xs text-purple-200/80 leading-relaxed">
                Self-service account registration is currently in active development. You can immediately access and explore all platform features using the pre-configured Demo Workspace Login.
              </p>
            </div>

            <div className="p-3 bg-[#0c0424] border border-[#2e176b] rounded-xl space-y-1 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Full Platform Access Available</span>
              </div>
              <p className="text-[11px] text-slate-400 pl-5.5">
                Meeting creation, audio playback, multi-format transcript import, and action item tracking are fully active in the live demo workspace.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Link href="/login" onClick={() => setSignupModalOpen(false)} className="w-full">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full bg-[#5925DC] hover:bg-[#6832e3] text-white font-semibold"
                >
                  Continue with Demo Login →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. FOOTER */}
      {/* ========================================================================= */}
      <footer className="py-12 bg-[#080218] border-t border-[#1d0d47] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[#5925DC] text-white">
                <AudioLines className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm text-white">MeetScribe</span>
            </div>
            <p className="text-purple-300/50 text-[11px] text-center md:text-left">
              A modern workspace for organizing meetings, transcripts, and action items.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <Link href="/meetings" className="hover:text-white transition-colors">
              Meetings Explorer
            </Link>
            <Link href="/action-items" className="hover:text-white transition-colors">
              Action Items Hub
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Login
            </Link>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </div>

          <div className="text-[11px] text-purple-300/50 text-center md:text-right">
            © 2026 MeetScribe. Full-Stack Meeting Notes & Transcription Platform.
          </div>
        </div>
      </footer>
    </div>
  );
}
