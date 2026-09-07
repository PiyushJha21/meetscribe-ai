"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  AudioLines,
  Calendar,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  Clock,
  Code2,
  Cpu,
  FileAudio,
  FileSpreadsheet,
  FileText,
  FolderKanban,
  Headphones,
  Layers,
  Menu,
  Mic,
  Minus,
  Play,
  Plus,
  Radio,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LandingNavbar } from "@/components/landing/LandingNavbar";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"summary" | "actions" | "topics">("summary");

  // Request Demo Modal state
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoForm, setDemoForm] = useState({
    name: "",
    email: "",
    company: "",
    teamSize: "1-10",
    note: "",
  });

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is MeetScribe?",
      answer:
        "MeetScribe is an AI-powered meeting intelligence platform designed to transcribe, summarize, search, and analyze your team discussions. It automatically converts raw meeting audio and transcripts into structured notes, executive summaries, key discussion topics, and trackable action items.",
    },
    {
      question: "How does MeetScribe process meeting transcripts?",
      answer:
        "MeetScribe parses imported meeting transcripts, attributing spoken lines to individual participants with exact timestamps. It synchronizes utterances with attached audio playback, allowing you to click on any utterance or topic to jump directly to that point in the recording.",
    },
    {
      question: "Which transcript formats does MeetScribe support?",
      answer:
        "MeetScribe supports structured transcripts in WebVTT (.vtt), JSON (.json), and Plain Text (.txt) formats. You can effortlessly import transcripts exported from Google Meet, Zoom, Microsoft Teams, or custom recording setups.",
    },
    {
      question: "How are Executive Summaries generated?",
      answer:
        "MeetScribe's AI intelligence engine analyzes transcript discussions to generate structured executive overviews, key takeaways, and strategic decisions made during the call, allowing team members to catch up on any meeting in under two minutes.",
    },
    {
      question: "How does MeetScribe identify Action Items?",
      answer:
        "MeetScribe automatically detects commitments, tasks, and follow-ups mentioned throughout the conversation. It extracts each action item along with the assigned owner, due date, and priority, syncing them into a dedicated centralized productivity hub.",
    },
    {
      question: "Can I view topics discussed during a meeting?",
      answer:
        "Yes! MeetScribe breaks down each meeting into chronological topic chapters with start and end timestamps. Clicking on any topic takes you directly to that section of the transcript and audio playback.",
    },
    {
      question: "Is my meeting data stored securely?",
      answer:
        "Yes. All meeting metadata, audio references, summaries, transcripts, and action items are securely stored using SQLite with SQLAlchemy ORM and validated through strict Pydantic schemas in FastAPI.",
    },
    {
      question: "Can I upload and analyze multiple meetings?",
      answer:
        "Absolutely. MeetScribe is built to manage all your organization's meetings across dedicated workspace channels like Engineering Syncs, Product & Design, and Client Reviews.",
    },
    {
      question: "Does MeetScribe support multiple users?",
      answer:
        "Yes. MeetScribe supports team collaboration, participant attribution, assigned action items, and shareable meeting notes across your engineering and product teams.",
    },
    {
      question: "How can I explore previous meetings?",
      answer:
        "You can navigate to the Meetings Explorer (/meetings) or open the Dashboard (/dashboard) to view, filter by channel, search discussions, review audio recordings, and track all assigned tasks in real-time.",
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
            NEW
          </span>
          <span className="hidden sm:inline font-medium text-purple-100">
            MeetScribe Meeting Intelligence Platform:
          </span>
          <span className="text-white font-semibold">
            Capture notes, transcripts & action items in real-time.
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
      {/* 2. TOP HORIZONTAL NAVIGATION BAR (WITH FULL MEGA MENUS) */}
      {/* ========================================================================= */}
      <LandingNavbar
        onRequestDemo={() => {
          setDemoSubmitted(false);
          setDemoModalOpen(true);
        }}
      />

      {/* ========================================================================= */}
      {/* 3. UPPER PRODUCT SHOWCASE SECTION WITH SPARKLES & STARS */}
      {/* ========================================================================= */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[480px] bg-[#5925DC]/20 rounded-full blur-[150px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-[#7A5BF8]/15 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Subtle Star / Particle Specks across dark purple background */}
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
          <div className="absolute top-[75%] left-[14%] w-1 h-1 bg-white/40 rounded-full" />
          <div className="absolute top-[82%] right-[15%] w-1 h-1 bg-purple-200/50 rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
            The #1 AI Assistant For <br />
            <span className="bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
              Your Meetings
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-purple-200/80 leading-relaxed font-normal">
            Transcribe, summarize, search, and analyze all your team conversations.
          </p>

          {/* Dual CTA Buttons (Get Started in #5925DC/gradient and Request Demo in dark gray/purple) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <button
                className="w-full sm:w-auto h-12 min-w-[170px] px-7 text-sm font-semibold text-white bg-gradient-to-r from-[#5925DC] to-[#7A5BF8] hover:from-[#662ce6] hover:to-[#8869fc] active:bg-[#4c1fc0] rounded-xl shadow-xl shadow-[#5925DC]/35 border border-[#8667fc]/30 transition-all cursor-pointer inline-flex items-center justify-center gap-2 group"
              >
                <span>Get Started →</span>
              </button>
            </Link>
            <button
              onClick={() => {
                setDemoSubmitted(false);
                setDemoModalOpen(true);
              }}
              className="w-full sm:w-auto h-12 min-w-[170px] px-7 text-sm font-semibold bg-[#1c123d]/85 hover:bg-[#271954] active:bg-[#140b2e] text-white rounded-xl shadow-lg border border-[#3c227d]/80 transition-all cursor-pointer inline-flex items-center justify-center"
            >
              Request Demo
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. LARGE MEETSCRIBE PRODUCT PREVIEW WITH FLOATING TRUST BADGE */}
        {/* ========================================================================= */}
        <div id="product" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-20">
          {/* Centered Floating Trust / Information Badge overlapping the preview */}
          <div className="relative z-20 -mb-5 flex justify-center px-4">
            <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-5 sm:px-6 py-2 rounded-full bg-[#180b3d]/95 backdrop-blur-md border border-[#3b1e7e] text-xs text-purple-200 shadow-2xl shadow-black/60">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white">Rated 4.9 / 5</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <span className="text-purple-400/50 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">Structured SQLite & REST Architecture</span>
              </div>
              <span className="text-purple-400/50 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-200">Multi-Format Transcripts (.vtt, .json, .txt)</span>
              </div>
            </div>
          </div>

          {/* Large Application Preview Window (Clean White / Light Surface) */}
          <div className="relative rounded-2xl p-1.5 sm:p-2 bg-gradient-to-b from-white/20 via-purple-500/20 to-purple-900/30 shadow-2xl shadow-purple-950/90 border border-purple-400/20">
            {/* Ambient Backlight */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#5925DC] to-[#7A5BF8] rounded-3xl blur-2xl opacity-25 group-hover:opacity-35 transition duration-1000 -z-10" />

            {/* Mockup Frame Container (Clean White / Light Surface) */}
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
                  <span>https://meetscribe.io/meetings/1</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#5925DC] border border-purple-200 font-semibold">
                    Live Demo
                  </span>
                </div>
              </div>

              {/* Sub-Header / Meeting Workspace Top Navigation Bar */}
              <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    REC
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="font-semibold text-slate-800"># Engineering</span>
                    <span>/</span>
                    <span className="font-bold text-slate-900 truncate">
                      Sprint 42 Architecture & UPI Scalability Sync
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-1.5">
                    <div className="w-6.5 h-6.5 rounded-full bg-indigo-600 border-2 border-white text-[10px] font-bold flex items-center justify-center text-white shadow-xs">
                      PJ
                    </div>
                    <div className="w-6.5 h-6.5 rounded-full bg-purple-600 border-2 border-white text-[10px] font-bold flex items-center justify-center text-white shadow-xs">
                      AS
                    </div>
                    <div className="w-6.5 h-6.5 rounded-full bg-emerald-600 border-2 border-white text-[10px] font-bold flex items-center justify-center text-white shadow-xs">
                      VP
                    </div>
                  </div>
                  <Link href="/meetings/1">
                    <button
                      className="bg-[#5925DC] hover:bg-[#6832e3] text-white text-xs px-3.5 py-1.5 rounded-lg font-semibold shadow-sm inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </Link>
                </div>
              </div>

              {/* Application Workspace Main Area (Bright White background) */}
              <div className="p-4 sm:p-6 bg-white space-y-5">
                {/* Metric Strip Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-[11px] font-medium text-slate-500">Total Meetings</p>
                      <p className="text-2xl font-bold font-mono text-slate-900 mt-0.5">8</p>
                      <p className="text-[10px] text-slate-400 mt-1">Indexed across workspaces</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-[#5925DC]">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-[11px] font-medium text-slate-500">Open Action Items</p>
                      <p className="text-2xl font-bold font-mono text-amber-600 mt-0.5">12</p>
                      <p className="text-[10px] text-slate-400 mt-1">Pending completion</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-600">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-xs">
                    <div>
                      <p className="text-[11px] font-medium text-slate-500">Completed Tasks</p>
                      <p className="text-2xl font-bold font-mono text-emerald-600 mt-0.5">19</p>
                      <p className="text-[10px] text-slate-400 mt-1">61% completion rate</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Split Workspace View */}
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
                          Engineering Architecture Discussion
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
                          1.25x
                        </span>
                      </div>
                    </div>

                    {/* Synchronized Transcripts */}
                    <div className="space-y-2.5 text-xs pt-1">
                      {/* Active Utterance */}
                      <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200/90 shadow-xs">
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#5925DC]">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#5925DC]" />
                            Piyush Jha (Tech Lead)
                          </span>
                          <span className="font-mono text-slate-500 text-[10px] font-normal">04:15</span>
                        </div>
                        <p className="text-slate-900 mt-1.5 text-[11.5px] leading-relaxed font-medium">
                          "We must ensure UPI idempotent request keys are validated on Redis before triggering database transactions."
                        </p>
                      </div>

                      {/* Second Utterance */}
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                          <span>Ananya Sharma (Senior Backend)</span>
                          <span className="font-mono text-slate-400 text-[10px] font-normal">04:45</span>
                        </div>
                        <p className="text-slate-600 mt-1.5 text-[11.5px] leading-relaxed">
                          "Agreed. I have prepared the benchmark scripts to test 2,500 TPS load on the staging cluster."
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
                              Engineering sync aligned on scaling the payment gateway to 2,500 TPS with zero-downtime database migrations. Redis cluster cache will buffer idempotent keys.
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                            <h5 className="text-[11px] font-bold text-slate-900 mb-2">Key Decisions</h5>
                            <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc list-inside">
                              <li>Enforce Redis TTL of 60 seconds on idempotency checks</li>
                              <li>Schedule staging load tests for Thursday 3 PM IST</li>
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
                            <p className="text-xs font-bold text-slate-900 mt-1">Redis Idempotency & Database Locks</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <Link href="/meetings/1" className="block pt-2">
                      <button
                        className="w-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#5925DC] font-bold text-xs py-2.5 rounded-lg text-center cursor-pointer transition-colors"
                      >
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
      {/* 5. INTEGRATIONS & SUPPORTED FORMATS STRIP */}
      {/* ========================================================================= */}
      <section className="py-12 bg-[#0c0524] border-t border-[#1d0d47]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-purple-300/70 mb-6">
            Seamlessly Works with Your Meeting Audio & Transcripts
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-80">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Mic className="w-4 h-4 text-[#5925DC]" />
              <span>Google Meet</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Headphones className="w-4 h-4 text-purple-400" />
              <span>Zoom Recordings</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>Microsoft Teams</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <FileAudio className="w-4 h-4 text-amber-400" />
              <span>MP3 / WAV Audio</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>WebVTT & JSON Transcripts</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CORE CAPABILITIES / FEATURES SECTION */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 bg-[#0d0526] border-t border-[#1d0d47] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5925DC] bg-[#5925DC]/15 px-3 py-1 rounded-full border border-[#5925DC]/30">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Everything You Need to Manage Meetings
            </h2>
            <p className="text-sm text-purple-200/70 leading-relaxed">
              MeetScribe centralizes discussions, transcripts, summaries, and action items in one cohesive, high-performance workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1: Meeting Management */}
            <div className="p-6 rounded-2xl bg-[#160b3d]/60 border border-[#2b1764]/70 hover:border-[#5925DC]/60 hover:bg-[#1a0e48]/80 transition-all duration-200 group hover:-translate-y-1 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#5925DC]/20 border border-[#5925DC]/40 text-purple-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-purple-200 transition-colors">
                Meeting Management
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Create, edit, organize, and manage all your meetings in one workspace with metadata, participants, and duration tracking.
              </p>
            </div>

            {/* Feature 2: Audio Upload */}
            <div className="p-6 rounded-2xl bg-[#160b3d]/60 border border-[#2b1764]/70 hover:border-[#5925DC]/60 hover:bg-[#1a0e48]/80 transition-all duration-200 group hover:-translate-y-1 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#5925DC]/20 border border-[#5925DC]/40 text-purple-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileAudio className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-purple-200 transition-colors">
                Audio Upload & Playback
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Attach meeting audio files (MP3, WAV, WebM) to keep recordings organized alongside their corresponding notes and discussions.
              </p>
            </div>

            {/* Feature 3: Transcript Import */}
            <div className="p-6 rounded-2xl bg-[#160b3d]/60 border border-[#2b1764]/70 hover:border-[#5925DC]/60 hover:bg-[#1a0e48]/80 transition-all duration-200 group hover:-translate-y-1 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#5925DC]/20 border border-[#5925DC]/40 text-purple-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-purple-200 transition-colors">
                Transcript Import (.vtt, .json, .txt)
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Import structured transcripts in WebVTT, JSON, or Plain Text formats with automated speaker attribution and timestamp synchronization.
              </p>
            </div>

            {/* Feature 4: Meeting Summaries */}
            <div className="p-6 rounded-2xl bg-[#160b3d]/60 border border-[#2b1764]/70 hover:border-[#5925DC]/60 hover:bg-[#1a0e48]/80 transition-all duration-200 group hover:-translate-y-1 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#5925DC]/20 border border-[#5925DC]/40 text-purple-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-purple-200 transition-colors">
                Structured Meeting Summaries
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Store and access structured executive summaries and categorized discussion topics for rapid review and cross-team alignment.
              </p>
            </div>

            {/* Feature 5: Action Items */}
            <div className="p-6 rounded-2xl bg-[#160b3d]/60 border border-[#2b1764]/70 hover:border-[#5925DC]/60 hover:bg-[#1a0e48]/80 transition-all duration-200 group hover:-translate-y-1 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#5925DC]/20 border border-[#5925DC]/40 text-purple-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-purple-200 transition-colors">
                Action Items Central Hub
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Track assigned tasks, due dates, and completion status across meetings in a dedicated centralized productivity feed.
              </p>
            </div>

            {/* Feature 6: Organized Workspace */}
            <div className="p-6 rounded-2xl bg-[#160b3d]/60 border border-[#2b1764]/70 hover:border-[#5925DC]/60 hover:bg-[#1a0e48]/80 transition-all duration-200 group hover:-translate-y-1 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-[#5925DC]/20 border border-[#5925DC]/40 text-purple-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FolderKanban className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-purple-200 transition-colors">
                Organized Workspaces
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Categorize meetings into dedicated channels like Engineering Syncs, Product & Design, and Client Reviews with instant filtering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. HOW IT WORKS SECTION */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 bg-[#100730] border-t border-[#1d0d47]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5925DC] bg-[#5925DC]/15 px-3 py-1 rounded-full border border-[#5925DC]/30">
              Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Simple. Organized. Productive.
            </h2>
            <p className="text-sm text-purple-200/70 leading-relaxed">
              From raw discussions to structured execution in three intuitive steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#160b3d]/70 border border-[#2b1764]/80 space-y-3 relative group hover:border-[#5925DC]/60 transition-all">
              <div className="text-3xl font-extrabold font-mono text-[#5925DC] group-hover:text-purple-300 transition-colors">
                01
              </div>
              <h3 className="text-base font-bold text-white">Create a Meeting</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add meeting details, select the appropriate workspace channel, and specify attendees and timing.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#160b3d]/70 border border-[#2b1764]/80 space-y-3 relative group hover:border-[#5925DC]/60 transition-all">
              <div className="text-3xl font-extrabold font-mono text-[#5925DC] group-hover:text-purple-300 transition-colors">
                02
              </div>
              <h3 className="text-base font-bold text-white">Add Meeting Content</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload audio recordings or import structured transcripts in WebVTT, JSON, or Plain Text format.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#160b3d]/70 border border-[#2b1764]/80 space-y-3 relative group hover:border-[#5925DC]/60 transition-all">
              <div className="text-3xl font-extrabold font-mono text-[#5925DC] group-hover:text-purple-300 transition-colors">
                03
              </div>
              <h3 className="text-base font-bold text-white">Track What Matters</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Review executive notes, navigate transcripts via timestamp, and track assigned action items to completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. PRODUCT STATISTICS & CAPABILITY HIGHLIGHTS */}
      {/* ========================================================================= */}
      <section className="py-16 bg-[#0d0526] border-t border-[#1d0d47]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-[#160b3d]/60 border border-[#2b1764]/70">
              <p className="text-3xl font-bold text-purple-300 font-mono">100%</p>
              <p className="text-xs font-semibold text-white mt-1">Structured Storage</p>
              <p className="text-[11px] text-purple-300/60 mt-1">SQLite & SQLAlchemy ORM</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#160b3d]/60 border border-[#2b1764]/70">
              <p className="text-3xl font-bold text-emerald-400 font-mono">3+</p>
              <p className="text-xs font-semibold text-white mt-1">Transcript Formats</p>
              <p className="text-[11px] text-purple-300/60 mt-1">.txt, .vtt, and .json parsing</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#160b3d]/60 border border-[#2b1764]/70">
              <p className="text-3xl font-bold text-purple-400 font-mono">Real-Time</p>
              <p className="text-xs font-semibold text-white mt-1">Task Sync</p>
              <p className="text-[11px] text-purple-300/60 mt-1">Live completion updates</p>
            </div>
            <div className="p-6 rounded-2xl bg-[#160b3d]/60 border border-[#2b1764]/70">
              <p className="text-3xl font-bold text-amber-400 font-mono">FastAPI</p>
              <p className="text-xs font-semibold text-white mt-1">REST Architecture</p>
              <p className="text-[11px] text-purple-300/60 mt-1">Pydantic validation engine</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FINAL CALL TO ACTION (CTA) */}
      {/* ========================================================================= */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#5925DC]/20 via-[#100730] to-[#0a031e] -z-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5925DC]/20 border border-[#5925DC]/40 text-purple-200 text-xs font-medium">
            <Zap className="w-3.5 h-3.5 text-purple-300" />
            <span>Ready for Evaluation & Production Workspaces</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Make Every Meeting Count with MeetScribe.
          </h2>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-purple-200/80 leading-relaxed">
            Keep your meetings, transcripts, summaries, and action items organized in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <button
                className="w-full sm:w-auto h-12 px-8 text-sm font-semibold bg-gradient-to-r from-[#5925DC] to-[#7A5BF8] hover:from-[#662ce6] hover:to-[#8869fc] text-white shadow-xl shadow-[#5925DC]/40 border border-[#8667fc]/30 rounded-xl active:bg-[#4c1fc0] inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get Started →</span>
              </button>
            </Link>
            <button
              onClick={() => {
                setDemoSubmitted(false);
                setDemoModalOpen(true);
              }}
              className="w-full sm:w-auto h-12 px-8 text-sm font-semibold bg-[#1c123d]/85 hover:bg-[#271954] active:bg-[#140b2e] text-white rounded-xl shadow-lg border border-[#3c227d]/80 transition-all cursor-pointer inline-flex items-center justify-center"
            >
              Request Demo
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. ENTERPRISE SECTION */}
      {/* ========================================================================= */}
      <section id="enterprise" className="py-24 bg-[#0d0526] border-t border-[#1d0d47] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A5BF8] bg-[#5925DC]/20 px-3 py-1 rounded-full border border-[#5925DC]/40 inline-block">
              Enterprise Ready
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Scale Meeting Intelligence Across Your Entire Organization
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Designed for enterprise teams requiring SOC2 Type II compliance, custom LLM models, and dedicated virtual private cloud infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-2xl bg-[#160c3d]/90 border border-[#2b1764]/90 space-y-4 hover:border-[#5925DC]/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#5925DC]/15 border border-[#5925DC]/30 flex items-center justify-center text-[#7A5BF8]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Zero Data Retention VPC</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deploy MeetScribe on your private cloud with strict zero third-party training data guarantees and end-to-end AES-256 encryption.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#160c3d]/90 border border-[#2b1764]/90 space-y-4 hover:border-[#5925DC]/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#5925DC]/15 border border-[#5925DC]/30 flex items-center justify-center text-[#7A5BF8]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">SSO, SCIM & RBAC Governance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Integrate Okta, Azure AD, and Google Workspace with role-based access control across sensitive executive, financial, and client channels.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#160c3d]/90 border border-[#2b1764]/90 space-y-4 hover:border-[#5925DC]/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#5925DC]/15 border border-[#5925DC]/30 flex items-center justify-center text-[#7A5BF8]">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Custom Engineering Vocabulary</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fine-tuned speech-to-text models for technical jargon, Kubernetes terms, code repos, and domain-specific acronyms with 99.9% uptime SLA.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                setDemoSubmitted(false);
                setDemoModalOpen(true);
              }}
              className="h-12 px-8 text-sm font-semibold bg-[#5925DC] hover:bg-[#6832e3] active:bg-[#4c1fc0] text-white rounded-xl shadow-xl shadow-[#5925DC]/35 border border-[#8667fc]/30 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>Talk to Enterprise Sales</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. PRICING SECTION */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-24 bg-[#100730] border-t border-[#1d0d47] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7A5BF8] bg-[#5925DC]/20 px-3 py-1 rounded-full border border-[#5925DC]/40 inline-block">
              Transparent Pricing
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Simple Plans For Every Team
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Start free and scale as your engineering, product, and client meetings grow.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Plan 1: Free */}
            <div className="p-8 rounded-2xl bg-[#160c3d]/90 border border-[#2b1764]/90 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">Starter</h3>
                  <p className="text-xs text-slate-400">For individuals & quick syncs</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-slate-400 font-medium">/ month</span>
                </div>
                <ul className="space-y-2.5 pt-4 border-t border-[#251357]/80 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7A5BF8] shrink-0" />
                    <span>Up to 5 recorded meetings / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7A5BF8] shrink-0" />
                    <span>Automated AI Executive Summaries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7A5BF8] shrink-0" />
                    <span>WebVTT, JSON & Text transcript import</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7A5BF8] shrink-0" />
                    <span>30 days transcript retention</span>
                  </li>
                </ul>
              </div>
              <Link href="/dashboard" className="block w-full">
                <Button variant="secondary" size="md" className="w-full font-semibold">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Plan 2: Pro (Featured) */}
            <div className="p-8 rounded-2xl bg-[#1c104d] border-2 border-[#5925DC] shadow-2xl shadow-[#5925DC]/25 flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-gradient-to-r from-[#5925DC] to-[#7A5BF8] text-white shadow-md">
                  Most Popular
                </span>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">Pro Intelligence</h3>
                  <p className="text-xs text-purple-200/70">For growing engineering & product teams</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$19</span>
                  <span className="text-xs text-slate-400 font-medium">/ user / month</span>
                </div>
                <ul className="space-y-2.5 pt-4 border-t border-purple-500/30 text-xs text-purple-100">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlimited meetings & audio uploads</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real-time speaker attribution & diarization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Centralized Action Items productivity hub</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Slack, Notion, and Jira one-click sync</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlimited transcript search history</span>
                  </li>
                </ul>
              </div>
              <Link href="/dashboard" className="block w-full">
                <Button variant="primary" size="md" className="w-full font-semibold shadow-lg shadow-[#5925DC]/30">
                  Start 14-Day Free Trial
                </Button>
              </Link>
            </div>

            {/* Plan 3: Enterprise */}
            <div className="p-8 rounded-2xl bg-[#160c3d]/90 border border-[#2b1764]/90 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">Enterprise</h3>
                  <p className="text-xs text-slate-400">For scaling organizations & strict compliance</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">Custom</span>
                </div>
                <ul className="space-y-2.5 pt-4 border-t border-[#251357]/80 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7A5BF8] shrink-0" />
                    <span>Dedicated Private VPC Deployment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7A5BF8] shrink-0" />
                    <span>Custom domain speech vocabulary models</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7A5BF8] shrink-0" />
                    <span>SSO, SCIM, and audit log integrations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7A5BF8] shrink-0" />
                    <span>SOC2 Type II compliance reports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#7A5BF8] shrink-0" />
                    <span>Dedicated Technical Account Manager & SLA</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => {
                  setDemoSubmitted(false);
                  setDemoModalOpen(true);
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-sm transition-colors cursor-pointer text-center"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FREQUENTLY ASKED QUESTIONS (FAQ) SECTION (Clean White Background) */}
      {/* ========================================================================= */}
      <section id="faq" className="py-24 bg-white text-slate-900 border-t border-slate-200 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#5925DC] bg-purple-50 px-3 py-1 rounded-full border border-purple-200 inline-block">
              Support & Answers
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about MeetScribe's AI meeting workspace, transcript processing, and automated task extraction.
            </p>
          </div>

          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="transition-colors">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full py-5 sm:py-6 flex items-center justify-between text-left gap-4 group cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-[#5925DC] transition-colors">
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
                    <div className="pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Help Note */}
          <div className="mt-12 text-center p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="text-sm font-bold text-slate-900">Have a question not listed here?</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Our team is here to help you get the most out of your meeting workspaces.
              </p>
            </div>
            <button
              onClick={() => {
                setDemoSubmitted(false);
                setDemoModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-lg bg-[#5925DC] hover:bg-[#6832e3] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              Contact Support / Demo →
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. REQUEST DEMO MODAL */}
      {/* ========================================================================= */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg rounded-2xl bg-[#140a38] border border-[#2e176b] p-6 sm:p-8 shadow-2xl text-slate-100 space-y-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!demoSubmitted ? (
              <>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5925DC]/20 border border-[#5925DC]/40 text-purple-300 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>MeetScribe Enterprise & Team Demo</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    Experience MeetScribe in Action
                  </h3>
                  <p className="text-xs sm:text-sm text-purple-200/70 leading-relaxed">
                    Schedule a personalized walkthrough of automated transcript indexing, AI meeting summaries, and task extraction.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setDemoSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-medium text-purple-200 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Piyush Jha"
                      value={demoForm.name}
                      onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c0424] border border-[#2e176b] text-white text-sm placeholder:text-slate-500 focus:border-[#5925DC] focus:ring-1 focus:ring-[#5925DC]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-purple-200 mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={demoForm.email}
                      onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c0424] border border-[#2e176b] text-white text-sm placeholder:text-slate-500 focus:border-[#5925DC] focus:ring-1 focus:ring-[#5925DC]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-purple-200 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Acme Corp"
                        value={demoForm.company}
                        onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c0424] border border-[#2e176b] text-white text-sm placeholder:text-slate-500 focus:border-[#5925DC] focus:ring-1 focus:ring-[#5925DC]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-purple-200 mb-1">
                        Team Size
                      </label>
                      <select
                        value={demoForm.teamSize}
                        onChange={(e) => setDemoForm({ ...demoForm, teamSize: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c0424] border border-[#2e176b] text-white text-sm focus:border-[#5925DC] focus:ring-1 focus:ring-[#5925DC]"
                      >
                        <option value="1-10">1 - 10 people</option>
                        <option value="11-50">11 - 50 people</option>
                        <option value="51-200">51 - 200 people</option>
                        <option value="200+">200+ Enterprise</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-purple-200 mb-1">
                      Notes / What would you like to see?
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Audio syncing with WebVTT transcripts and real-time task export"
                      value={demoForm.note}
                      onChange={(e) => setDemoForm({ ...demoForm, note: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-lg bg-[#0c0424] border border-[#2e176b] text-white text-sm placeholder:text-slate-500 focus:border-[#5925DC] focus:ring-1 focus:ring-[#5925DC]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setDemoModalOpen(false)}
                      className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#5925DC] to-[#7A5BF8] hover:from-[#662ce6] hover:to-[#8869fc] rounded-lg shadow-md shadow-[#5925DC]/30 transition-all cursor-pointer"
                    >
                      Submit Request →
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Demo Request Received!</h3>
                <p className="text-xs sm:text-sm text-purple-200/80 max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-white">{demoForm.name || "there"}</span>. Our team will reach out at <span className="font-semibold text-white">{demoForm.email}</span> shortly with your dedicated demo workspace.
                </p>
                <div className="pt-4 flex items-center justify-center gap-3">
                  <Link href="/dashboard" onClick={() => setDemoModalOpen(false)}>
                    <Button
                      variant="primary"
                      size="md"
                      className="bg-[#5925DC] hover:bg-[#6832e3] text-white font-semibold"
                    >
                      Enter Live Workspace Now →
                    </Button>
                  </Link>
                  <button
                    onClick={() => setDemoModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
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
            <a href="#product" className="hover:text-white transition-colors">
              Product
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <Link href="/meetings" className="hover:text-white transition-colors">
              Meetings
            </Link>
            <Link href="/action-items" className="hover:text-white transition-colors">
              Action Items
            </Link>
            <Link href="/settings" className="hover:text-white transition-colors">
              Settings
            </Link>
          </div>

          <div className="text-[11px] text-purple-300/50 text-center md:text-right">
            © 2026 MeetScribe. Built for the Scaler SDE Assignment.
          </div>
        </div>
      </footer>
    </div>
  );
}
