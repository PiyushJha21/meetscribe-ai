"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  AudioLines,
  Award,
  BarChart3,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Code2,
  CreditCard,
  Cpu,
  Database,
  FileAudio,
  FileText,
  FolderKanban,
  Globe,
  Handshake,
  HardDrive,
  Headphones,
  HelpCircle,
  Laptop,
  Layers,
  LifeBuoy,
  Lightbulb,
  Lock,
  Mail,
  Megaphone,
  Menu,
  MessageCircle,
  MessagesSquare,
  Mic,
  Newspaper,
  PhoneCall,
  Percent,
  Radio,
  Search,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Terminal,
  TrendingUp,
  UserCheck,
  Users,
  Video,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type MenuKey = "product" | "solutions" | "integration" | "resources" | null;

interface LandingNavbarProps {
  onRequestDemo: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onRequestDemo }) => {
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<MenuKey>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleMenu = (key: MenuKey) => {
    setOpenMenu((prev) => (prev === key ? null : key));
  };

  const toggleMobileAccordion = (key: MenuKey) => {
    setMobileAccordion((prev) => (prev === key ? null : key));
  };

  return (
    <header ref={navRef} className="sticky top-0 z-50 bg-[#100730]/95 backdrop-blur-xl border-b border-[#251357]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Left Side: Logo & Main Nav Links */}
        <div className="flex items-center gap-7 lg:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5925DC] to-[#7A5BF8] text-white shadow-lg shadow-[#5925DC]/30 group-hover:scale-105 transition-all">
              <AudioLines className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-purple-200 transition-colors">
                MeetScribe
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-[#5925DC]/20 text-purple-300 border border-[#5925DC]/40 rounded-md">
                AI Hub
              </span>
            </div>
          </Link>

          {/* Desktop Horizontal Menu */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-[13.5px] font-medium text-slate-300">
            {/* 1. Product Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu("product")}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  openMenu === "product"
                    ? "text-white bg-white/10"
                    : "hover:text-white hover:bg-white/5"
                }`}
              >
                <span>Product</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    openMenu === "product" ? "rotate-180 text-purple-300" : "text-slate-400"
                  }`}
                />
              </button>
            </div>

            {/* 2. Solutions Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu("solutions")}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  openMenu === "solutions"
                    ? "text-white bg-white/10"
                    : "hover:text-white hover:bg-white/5"
                }`}
              >
                <span>Solutions</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    openMenu === "solutions" ? "rotate-180 text-purple-300" : "text-slate-400"
                  }`}
                />
              </button>
            </div>

            {/* 3. Integration Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu("integration")}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  openMenu === "integration"
                    ? "text-white bg-white/10"
                    : "hover:text-white hover:bg-white/5"
                }`}
              >
                <span>Integration</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    openMenu === "integration" ? "rotate-180 text-purple-300" : "text-slate-400"
                  }`}
                />
              </button>
            </div>

            {/* 4. Resources Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu("resources")}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  openMenu === "resources"
                    ? "text-white bg-white/10"
                    : "hover:text-white hover:bg-white/5"
                }`}
              >
                <span>Resources</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    openMenu === "resources" ? "rotate-180 text-purple-300" : "text-slate-400"
                  }`}
                />
              </button>
            </div>

            {/* Direct Links */}
            <a
              href="#enterprise"
              onClick={() => setOpenMenu(null)}
              className="px-3 py-2 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Enterprise
            </a>
            <a
              href="#pricing"
              onClick={() => setOpenMenu(null)}
              className="px-3 py-2 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Pricing
            </a>
          </nav>
        </div>

        {/* Right Side: Login, Request Demo, Get Started */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="h-9.5 px-3 text-slate-300 hover:text-white hover:bg-white/5 text-sm font-medium"
            >
              Login
            </Button>
          </Link>
          <button
            onClick={() => {
              setOpenMenu(null);
              onRequestDemo();
            }}
            className="h-9.5 min-w-[126px] px-4 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 active:bg-slate-200 rounded-lg shadow-sm border border-slate-200 transition-all cursor-pointer inline-flex items-center justify-center text-center"
          >
            Request Demo
          </button>
          <Link href="/dashboard">
            <button className="h-9.5 min-w-[126px] px-4 text-xs font-semibold text-white bg-gradient-to-r from-[#5925DC] to-[#7A5BF8] hover:from-[#662ce6] hover:to-[#8869fc] active:bg-[#4c1fc0] rounded-lg shadow-md shadow-[#5925DC]/30 border border-[#8667fc]/30 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5">
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white lg:hidden rounded-lg hover:bg-[#1a0e48]"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP MEGA MENUS (Rendered Directly Below Header) */}
      {/* ========================================================================= */}
      {openMenu && (
        <div className="hidden lg:block absolute top-full left-0 right-0 px-4 sm:px-6 lg:px-8 pt-2 pb-6 pointer-events-auto">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 text-slate-900">
            {/* 1. PRODUCT MEGA MENU */}
            {openMenu === "product" && (
              <div className="grid grid-cols-12 p-6 gap-6">
                {/* 2-Column Links */}
                <div className="col-span-8 grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: <Laptop className="w-4 h-4" />,
                      title: "Desktop App",
                      desc: "Native meeting recorder & hotkey transcription",
                      href: "/meetings",
                    },
                    {
                      icon: <Bot className="w-4 h-4" />,
                      title: "Personal Assistant",
                      desc: "AI companion that joins, notes & summarizes",
                      href: "/meetings",
                    },
                    {
                      icon: <Mail className="w-4 h-4" />,
                      title: "Email Assistant",
                      desc: "Auto-send executive recaps & action items via email",
                      href: "/meetings",
                    },
                    {
                      icon: <Cpu className="w-4 h-4" />,
                      title: "AI Skills",
                      desc: "Custom intelligence prompts, extractors & filters",
                      href: "/dashboard",
                    },
                    {
                      icon: <Mic className="w-4 h-4" />,
                      title: "Voice Agents",
                      desc: "Real-time voice interaction & call facilitation",
                      href: "/new-meeting",
                    },
                    {
                      icon: <Smartphone className="w-4 h-4" />,
                      title: "Mobile App",
                      desc: "Record discussions on iOS & Android on the go",
                      href: "/meetings",
                    },
                    {
                      icon: <Globe className="w-4 h-4" />,
                      title: "Chrome Extension",
                      desc: "One-click Google Meet & browser call capture",
                      href: "/meetings",
                    },
                    {
                      icon: <Terminal className="w-4 h-4" />,
                      title: "API & Webhooks",
                      desc: "Developer endpoints for automated pipeline integration",
                      href: "/settings",
                    },
                  ].map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setOpenMenu(null)}
                      className="group flex items-start gap-3.5 p-3 rounded-xl hover:bg-purple-50/60 transition-all border border-transparent hover:border-purple-100"
                    >
                      <div className="p-2.5 rounded-xl bg-purple-50 text-[#5925DC] group-hover:bg-[#5925DC] group-hover:text-white transition-all shadow-xs">
                        {item.icon}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-[#5925DC] transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          {item.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Right Featured Card */}
                <div className="col-span-4 bg-gradient-to-br from-[#f8f5ff] via-[#f2ecff] to-[#ebe4ff] p-5 rounded-xl border border-purple-200/80 shadow-xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-[#5925DC] text-white tracking-wider">
                        Featured Platform
                      </span>
                      <Sparkles className="w-4 h-4 text-[#5925DC]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">
                        MeetScribe Intelligence v2.0
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Transform raw meeting recordings into structured transcripts, executive takeaways, and assigned action items in seconds.
                      </p>
                    </div>
                    <div className="p-3 bg-white/90 rounded-lg border border-purple-200/60 space-y-1.5 shadow-xs">
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Sub-second keyword search</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Automated speaker diarization</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setOpenMenu(null)}
                    className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold text-white bg-[#5925DC] hover:bg-[#6832e3] rounded-lg shadow-sm transition-colors"
                  >
                    <span>Explore Platform</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* 2. SOLUTIONS MEGA MENU */}
            {openMenu === "solutions" && (
              <div className="grid grid-cols-12 p-6 gap-6">
                {/* 2-Column Links */}
                <div className="col-span-8 grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: <TrendingUp className="w-4 h-4" />,
                      title: "Sales",
                      desc: "Close deals faster with automated CRM logging & client objection notes",
                      href: "/meetings",
                    },
                    {
                      icon: <Megaphone className="w-4 h-4" />,
                      title: "Marketing",
                      desc: "Capture voice-of-customer insights, launch ideas & customer feedback",
                      href: "/meetings",
                    },
                    {
                      icon: <UserCheck className="w-4 h-4" />,
                      title: "Recruiting",
                      desc: "Screen candidates, auto-generate interview notes & hiring scorecards",
                      href: "/action-items",
                    },
                    {
                      icon: <Lightbulb className="w-4 h-4" />,
                      title: "Product & User Research",
                      desc: "Analyze user interviews & prioritize high-impact feature requests",
                      href: "/meetings",
                    },
                    {
                      icon: <Terminal className="w-4 h-4" />,
                      title: "Engineering",
                      desc: "Architecture reviews, sprint planning & tech debt tracking",
                      href: "/meetings",
                    },
                    {
                      icon: <CreditCard className="w-4 h-4" />,
                      title: "Finance",
                      desc: "Board meetings, budget discussions & compliance audit trails",
                      href: "/meetings",
                    },
                    {
                      icon: <Activity className="w-4 h-4" />,
                      title: "Healthcare",
                      desc: "Secure patient consultations & clinical staff handoffs",
                      href: "/meetings",
                    },
                    {
                      icon: <Building2 className="w-4 h-4" />,
                      title: "Real Estate",
                      desc: "Property showings, investor calls & client agreement notes",
                      href: "/meetings",
                    },
                  ].map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setOpenMenu(null)}
                      className="group flex items-start gap-3.5 p-3 rounded-xl hover:bg-purple-50/60 transition-all border border-transparent hover:border-purple-100"
                    >
                      <div className="p-2.5 rounded-xl bg-purple-50 text-[#5925DC] group-hover:bg-[#5925DC] group-hover:text-white transition-all shadow-xs">
                        {item.icon}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-[#5925DC] transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          {item.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Right Featured Card: Customer Story */}
                <div className="col-span-4 bg-gradient-to-br from-[#f8f5ff] via-[#f2ecff] to-[#ebe4ff] p-5 rounded-xl border border-purple-200/80 shadow-xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-[#5925DC] text-white tracking-wider">
                        Customer Story
                      </span>
                      <Award className="w-4 h-4 text-[#5925DC]" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-slate-900">
                        How SyncSpace cut post-meeting admin work by 85%
                      </h4>
                      <p className="text-xs italic text-slate-600 leading-relaxed">
                        “MeetScribe gives our engineering and product teams instant clarity and zero lost action items after every call.”
                      </p>
                      <p className="text-[11px] font-semibold text-purple-900 pt-1">
                        — Aman Mishra, Head of Engineering
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setOpenMenu(null);
                      onRequestDemo();
                    }}
                    className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold text-white bg-[#5925DC] hover:bg-[#6832e3] rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Request Team Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 3. INTEGRATION MEGA MENU */}
            {openMenu === "integration" && (
              <div className="grid grid-cols-12 p-6 gap-6">
                {/* 2-Column Links */}
                <div className="col-span-8 grid grid-cols-2 gap-3.5">
                  {[
                    {
                      icon: <Video className="w-4 h-4" />,
                      title: "Video Conferencing",
                      desc: "Zoom, Google Meet, Microsoft Teams, Webex",
                      href: "/meetings",
                    },
                    {
                      icon: <Calendar className="w-4 h-4" />,
                      title: "Calendar",
                      desc: "Google Calendar, Outlook, Apple Calendar auto-sync",
                      href: "/settings",
                    },
                    {
                      icon: <MessagesSquare className="w-4 h-4" />,
                      title: "Collaboration",
                      desc: "Slack, Microsoft Teams, Discord workspace channels",
                      href: "/settings",
                    },
                    {
                      icon: <Database className="w-4 h-4" />,
                      title: "CRM",
                      desc: "Salesforce, HubSpot, Zoho, Pipedrive deal sync",
                      href: "/action-items",
                    },
                    {
                      icon: <HardDrive className="w-4 h-4" />,
                      title: "Storage",
                      desc: "Google Drive, Dropbox, OneDrive, AWS S3 buckets",
                      href: "/settings",
                    },
                    {
                      icon: <PhoneCall className="w-4 h-4" />,
                      title: "Dialers",
                      desc: "Aircall, RingCentral, Twilio, Dialpad recording import",
                      href: "/new-meeting",
                    },
                    {
                      icon: <Mic className="w-4 h-4" />,
                      title: "Audio Recording",
                      desc: "High-resolution WAV, WebM, and MP3 audio processing",
                      href: "/new-meeting",
                    },
                    {
                      icon: <CheckSquare className="w-4 h-4" />,
                      title: "Project Management",
                      desc: "Jira, Asana, Linear, Trello, ClickUp tasks",
                      href: "/action-items",
                    },
                    {
                      icon: <FileText className="w-4 h-4" />,
                      title: "Notes",
                      desc: "Notion, Coda, Obsidian, Evernote knowledge export",
                      href: "/meetings",
                    },
                    {
                      icon: <Zap className="w-4 h-4" />,
                      title: "Zapier & API",
                      desc: "Connect MeetScribe to 5,000+ custom workflows",
                      href: "/settings",
                    },
                  ].map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setOpenMenu(null)}
                      className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-purple-50/60 transition-all border border-transparent hover:border-purple-100"
                    >
                      <div className="p-2 rounded-xl bg-purple-50 text-[#5925DC] group-hover:bg-[#5925DC] group-hover:text-white transition-all shadow-xs">
                        {item.icon}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-[#5925DC] transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          {item.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Right Featured Card: Ecosystem */}
                <div className="col-span-4 bg-gradient-to-br from-[#f8f5ff] via-[#f2ecff] to-[#ebe4ff] p-5 rounded-xl border border-purple-200/80 shadow-xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-[#5925DC] text-white tracking-wider">
                        Ecosystem
                      </span>
                      <Workflow className="w-4 h-4 text-[#5925DC]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">
                        100+ Connected Integrations
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Seamlessly pipe summaries into Slack, push action items to Jira, and store audio recordings directly in your cloud bucket.
                      </p>
                    </div>

                    {/* App icon badge cloud */}
                    <div className="grid grid-cols-4 gap-2 pt-2">
                      {["Slack", "Zoom", "Notion", "Jira", "Teams", "Meet", "HubSpot", "Drive"].map((app, i) => (
                        <div
                          key={i}
                          className="py-1.5 px-2 bg-white rounded-lg border border-purple-200/60 text-[10px] font-bold text-purple-950 text-center shadow-xs"
                        >
                          {app}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setOpenMenu(null)}
                    className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold text-white bg-[#5925DC] hover:bg-[#6832e3] rounded-lg shadow-sm transition-colors"
                  >
                    <span>Explore Integrations</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* 4. RESOURCES MEGA MENU */}
            {openMenu === "resources" && (
              <div className="grid grid-cols-12 p-6 gap-6">
                {/* 2-Column Links */}
                <div className="col-span-8 grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: <Handshake className="w-4 h-4" />,
                      title: "Partnership",
                      desc: "Join our partner ecosystem & reseller network",
                      href: "/settings",
                    },
                    {
                      icon: <MessageCircle className="w-4 h-4" />,
                      title: "Community",
                      desc: "Join 25,000+ professionals in our Discord & community channels",
                      href: "/dashboard",
                    },
                    {
                      icon: <AlertCircle className="w-4 h-4" />,
                      title: "Report a Bug",
                      desc: "Submit feedback directly to our core engineering team",
                      href: "/settings",
                    },
                    {
                      icon: <Percent className="w-4 h-4" />,
                      title: "Affiliate Program",
                      desc: "Earn 30% recurring commissions referring MeetScribe",
                      href: "/dashboard",
                    },
                    {
                      icon: <Newspaper className="w-4 h-4" />,
                      title: "Blog",
                      desc: "Meeting productivity, AI insights & product release updates",
                      href: "/meetings",
                    },
                    {
                      icon: <ShieldCheck className="w-4 h-4" />,
                      title: "Security & Compliance",
                      desc: "SOC2 Type II, GDPR, end-to-end encryption & data privacy",
                      href: "/settings",
                    },
                    {
                      icon: <LifeBuoy className="w-4 h-4" />,
                      title: "Help Center",
                      desc: "Guides, API documentation, video tutorials & FAQs",
                      href: "#faq",
                    },
                    {
                      icon: <Award className="w-4 h-4" />,
                      title: "Customer Stories",
                      desc: "Discover how high-growth teams scale with MeetScribe",
                      href: "/meetings",
                    },
                  ].map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setOpenMenu(null)}
                      className="group flex items-start gap-3.5 p-3 rounded-xl hover:bg-purple-50/60 transition-all border border-transparent hover:border-purple-100"
                    >
                      <div className="p-2.5 rounded-xl bg-purple-50 text-[#5925DC] group-hover:bg-[#5925DC] group-hover:text-white transition-all shadow-xs">
                        {item.icon}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-[#5925DC] transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          {item.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Right Featured Card: Learn more */}
                <div className="col-span-4 bg-gradient-to-br from-[#f8f5ff] via-[#f2ecff] to-[#ebe4ff] p-5 rounded-xl border border-purple-200/80 shadow-xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-[#5925DC] text-white tracking-wider">
                        Masterclass
                      </span>
                      <BookOpen className="w-4 h-4 text-[#5925DC]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">
                        Learn more with MeetScribe
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Access our comprehensive tutorials, workflow guides, and live weekly masterclasses to supercharge team productivity.
                      </p>
                    </div>
                    <div className="p-3 bg-white/90 rounded-lg border border-purple-200/60 space-y-1.5 shadow-xs">
                      <div className="flex items-center gap-1.5 text-[11px] text-purple-900 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5925DC]" />
                        <span>Interactive Transcript Guide</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-purple-900 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5925DC]" />
                        <span>Action Item Automation Best Practices</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href="#faq"
                    onClick={() => setOpenMenu(null)}
                    className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 text-xs font-semibold text-white bg-[#5925DC] hover:bg-[#6832e3] rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Learn More →</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MOBILE RESPONSIVE DRAWER & ACCORDION MENU */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 bg-[#100730] border-b border-[#251357]/80 space-y-2 animate-in slide-in-from-top-3 duration-200 max-h-[85vh] overflow-y-auto">
          {/* 1. Mobile Product Accordion */}
          <div className="border-b border-[#251357]/60 pb-2">
            <button
              onClick={() => toggleMobileAccordion("product")}
              className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-[#1a0e48]"
            >
              <span className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-[#7A5BF8]" />
                <span>Product</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  mobileAccordion === "product" ? "rotate-180 text-purple-300" : "text-slate-400"
                }`}
              />
            </button>
            {mobileAccordion === "product" && (
              <div className="pl-6 pr-2 py-2 space-y-2 bg-[#160c3d]/60 rounded-xl border border-[#2b1764]/60 my-1">
                {[
                  { title: "Desktop App", href: "/meetings" },
                  { title: "Personal Assistant", href: "/meetings" },
                  { title: "Email Assistant", href: "/meetings" },
                  { title: "AI Skills", href: "/dashboard" },
                  { title: "Voice Agents", href: "/new-meeting" },
                  { title: "Mobile App", href: "/meetings" },
                  { title: "Chrome Extension", href: "/meetings" },
                  { title: "API & Webhooks", href: "/settings" },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs text-slate-300 hover:text-white"
                  >
                    • {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 2. Mobile Solutions Accordion */}
          <div className="border-b border-[#251357]/60 pb-2">
            <button
              onClick={() => toggleMobileAccordion("solutions")}
              className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-[#1a0e48]"
            >
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#7A5BF8]" />
                <span>Solutions</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  mobileAccordion === "solutions" ? "rotate-180 text-purple-300" : "text-slate-400"
                }`}
              />
            </button>
            {mobileAccordion === "solutions" && (
              <div className="pl-6 pr-2 py-2 space-y-2 bg-[#160c3d]/60 rounded-xl border border-[#2b1764]/60 my-1">
                {[
                  { title: "Sales", href: "/meetings" },
                  { title: "Marketing", href: "/meetings" },
                  { title: "Recruiting", href: "/action-items" },
                  { title: "Product & User Research", href: "/meetings" },
                  { title: "Engineering", href: "/meetings" },
                  { title: "Finance", href: "/meetings" },
                  { title: "Healthcare", href: "/meetings" },
                  { title: "Real Estate", href: "/meetings" },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs text-slate-300 hover:text-white"
                  >
                    • {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 3. Mobile Integration Accordion */}
          <div className="border-b border-[#251357]/60 pb-2">
            <button
              onClick={() => toggleMobileAccordion("integration")}
              className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-[#1a0e48]"
            >
              <span className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-[#7A5BF8]" />
                <span>Integration</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  mobileAccordion === "integration" ? "rotate-180 text-purple-300" : "text-slate-400"
                }`}
              />
            </button>
            {mobileAccordion === "integration" && (
              <div className="pl-6 pr-2 py-2 space-y-2 bg-[#160c3d]/60 rounded-xl border border-[#2b1764]/60 my-1">
                {[
                  { title: "Video Conferencing (Zoom, Meet, Teams)", href: "/meetings" },
                  { title: "Calendar (Google & Outlook)", href: "/settings" },
                  { title: "Collaboration (Slack, Discord)", href: "/settings" },
                  { title: "CRM (Salesforce, HubSpot)", href: "/action-items" },
                  { title: "Project Management (Jira, Linear)", href: "/action-items" },
                  { title: "Zapier & Custom API", href: "/settings" },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs text-slate-300 hover:text-white"
                  >
                    • {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 4. Mobile Resources Accordion */}
          <div className="border-b border-[#251357]/60 pb-2">
            <button
              onClick={() => toggleMobileAccordion("resources")}
              className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-semibold text-slate-200 hover:text-white rounded-lg hover:bg-[#1a0e48]"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#7A5BF8]" />
                <span>Resources</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  mobileAccordion === "resources" ? "rotate-180 text-purple-300" : "text-slate-400"
                }`}
              />
            </button>
            {mobileAccordion === "resources" && (
              <div className="pl-6 pr-2 py-2 space-y-2 bg-[#160c3d]/60 rounded-xl border border-[#2b1764]/60 my-1">
                {[
                  { title: "Partnership Program", href: "/settings" },
                  { title: "Community Forum", href: "/dashboard" },
                  { title: "Report a Bug", href: "/settings" },
                  { title: "Affiliate Program", href: "/dashboard" },
                  { title: "Product Blog", href: "/meetings" },
                  { title: "Security & SOC2", href: "/settings" },
                  { title: "Help Center & FAQs", href: "#faq" },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-1 text-xs text-slate-300 hover:text-white"
                  >
                    • {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Direct Mobile Links */}
          <a
            href="#enterprise"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-[#1a0e48]"
          >
            Enterprise
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-[#1a0e48]"
          >
            Pricing
          </a>
          <Link
            href="/meetings"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-[#1a0e48]"
          >
            Meetings Explorer
          </Link>
          <Link
            href="/action-items"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-[#1a0e48]"
          >
            Action Items
          </Link>

          {/* Bottom Action Buttons in Mobile Drawer */}
          <div className="pt-3 flex flex-col gap-2.5">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" size="md" className="w-full text-slate-300 hover:text-white">
                Login
              </Button>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRequestDemo();
              }}
              className="w-full h-10 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-sm transition-colors cursor-pointer text-center inline-flex items-center justify-center"
            >
              Request Demo
            </button>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full h-10 text-xs font-semibold text-white bg-gradient-to-r from-[#5925DC] to-[#7A5BF8] hover:from-[#662ce6] hover:to-[#8869fc] active:bg-[#4c1fc0] rounded-lg shadow-md shadow-[#5925DC]/30 border border-[#8667fc]/30 transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5">
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
