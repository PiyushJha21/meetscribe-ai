"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  AudioLines,
  Calendar,
  CheckSquare,
  HelpCircle,
  Layers,
  Menu,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LandingNavbarProps {
  onRequestDemo: () => void;
  onSignupClick: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onRequestDemo,
  onSignupClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#100730]/95 backdrop-blur-xl border-b border-[#251357]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Left Side: Logo & Direct Navigation Links */}
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

          {/* Desktop Direct Menu Links */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-[13.5px] font-medium text-slate-300">
            <a
              href="#features"
              className="px-3 py-2 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="px-3 py-2 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              How It Works
            </a>
            <Link
              href="/meetings"
              className="px-3 py-2 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Meetings Explorer
            </Link>
            <Link
              href="/action-items"
              className="px-3 py-2 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Action Items Hub
            </Link>
            <a
              href="#faq"
              className="px-3 py-2 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              FAQ
            </a>
          </nav>
        </div>

        {/* Right Side: Login, Sign Up (Coming Soon), Request Demo (Tour), Enter Workspace */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="h-9.5 px-3.5 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-semibold"
            >
              Login
            </Button>
          </Link>

          <button
            type="button"
            onClick={onSignupClick}
            className="h-9.5 px-3.5 text-xs font-semibold text-purple-200 hover:text-white hover:bg-white/5 rounded-lg border border-[#3c227d]/60 transition-colors cursor-pointer"
          >
            Sign Up
          </button>

          <button
            type="button"
            onClick={onRequestDemo}
            className="h-9.5 px-4 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 active:bg-slate-200 rounded-lg shadow-sm border border-slate-200 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5925DC]" />
            <span>Request Demo</span>
          </button>

          <Link href="/dashboard">
            <button className="h-9.5 px-4 text-xs font-semibold text-white bg-gradient-to-r from-[#5925DC] to-[#7A5BF8] hover:from-[#662ce6] hover:to-[#8869fc] active:bg-[#4c1fc0] rounded-lg shadow-md shadow-[#5925DC]/30 border border-[#8667fc]/30 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5">
              <span>Enter Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white lg:hidden rounded-lg hover:bg-[#1a0e48] transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Responsive Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 bg-[#100730] border-b border-[#251357]/80 space-y-3 animate-in slide-in-from-top-3 duration-200">
          <nav className="space-y-1">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-[#1a0e48]"
            >
              <Layers className="w-4 h-4 text-[#7A5BF8]" />
              <span>Features</span>
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-[#1a0e48]"
            >
              <Workflow className="w-4 h-4 text-[#7A5BF8]" />
              <span>How It Works</span>
            </a>
            <Link
              href="/meetings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-[#1a0e48]"
            >
              <Calendar className="w-4 h-4 text-[#7A5BF8]" />
              <span>Meetings Explorer</span>
            </Link>
            <Link
              href="/action-items"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-[#1a0e48]"
            >
              <CheckSquare className="w-4 h-4 text-[#7A5BF8]" />
              <span>Action Items Hub</span>
            </Link>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-[#1a0e48]"
            >
              <HelpCircle className="w-4 h-4 text-[#7A5BF8]" />
              <span>FAQ</span>
            </a>
          </nav>

          <div className="pt-3 border-t border-[#251357]/80 grid grid-cols-2 gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" size="sm" className="w-full text-xs font-semibold">
                Login
              </Button>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onSignupClick();
              }}
              className="w-full py-2 px-3 text-xs font-semibold text-purple-200 bg-[#160b3d] border border-[#3c227d] rounded-lg hover:bg-[#1f1052] transition-colors"
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onRequestDemo();
              }}
              className="col-span-2 w-full py-2 px-3 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5925DC]" />
              <span>Guided Product Tour</span>
            </button>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="col-span-2">
              <button className="w-full py-2 px-3 text-xs font-semibold text-white bg-gradient-to-r from-[#5925DC] to-[#7A5BF8] rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-colors">
                <span>Enter Live Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
