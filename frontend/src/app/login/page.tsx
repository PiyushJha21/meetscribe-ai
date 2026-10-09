"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  AudioLines,
  CheckCircle2,
  Key,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const { login } = useAuth();

  const [email, setEmail] = useState("piyush.jha@syncspace.in");
  const [password, setPassword] = useState("MeetScribe2026!");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await login(email.trim(), password.trim());
      if (result.success) {
        router.push(redirectUrl);
      } else {
        setErrorMessage(result.error || "Invalid email or password. Please try again.");
      }
    } catch {
      setErrorMessage("Unable to complete sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("piyush.jha@syncspace.in");
    setPassword("MeetScribe2026!");
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5925DC]/20 border border-[#5925DC]/40 text-purple-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Backend Authenticated Session</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Sign in to MeetScribe
        </h1>
        <p className="text-xs text-purple-200/70">
          Enter your workspace credentials to access your meetings and action items.
        </p>
      </div>

      {/* Login Card */}
      <div
        id="tour-login-card"
        className="bg-[#160b3d]/90 border border-[#2b1764] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50 space-y-5 backdrop-blur-md"
      >
        {errorMessage && (
          <div
            id="login-error-message"
            className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in duration-200"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-rose-200">Authentication Failed</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-purple-200">
              Workspace Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="you@company.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#0c0424] border border-[#2e176b] rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#5925DC] focus:border-[#5925DC]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-purple-200">
                Password
              </label>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] text-[#7A5BF8] hover:text-purple-300 font-medium cursor-pointer"
              >
                Auto-Fill Demo
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#0c0424] border border-[#2e176b] rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#5925DC] focus:border-[#5925DC]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 text-sm font-semibold text-white bg-gradient-to-r from-[#5925DC] to-[#7A5BF8] hover:from-[#662ce6] hover:to-[#8869fc] active:bg-[#4c1fc0] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-[#5925DC]/35 border border-[#8667fc]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Validating Session...</span>
              </>
            ) : (
              <>
                <span>Sign In to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Mock/Demo Account Helper Box */}
        <div className="pt-3 border-t border-[#251357]/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
              Documented Demo Account
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[10px] font-semibold text-[#7A5BF8] bg-[#5925DC]/20 px-2 py-0.5 rounded border border-[#5925DC]/40 hover:bg-[#5925DC]/30 cursor-pointer transition-colors"
            >
              Click to Apply
            </button>
          </div>

          <div className="p-3 rounded-xl bg-[#0c0424] border border-[#2e176b] space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-500">Email:</span>
              <span className="text-purple-200 font-semibold">piyush.jha@syncspace.in</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-500">Password:</span>
              <span className="text-emerald-400 font-semibold">MeetScribe2026!</span>
            </div>
            <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-[#251357]/60">
              <span className="text-slate-500">Role:</span>
              <span className="text-slate-400">Workspace Owner (USR-IND-001)</span>
            </div>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Don&apos;t have a workspace account?{" "}
            <button
              type="button"
              onClick={() => setShowSignupModal(true)}
              className="font-semibold text-purple-300 hover:text-white underline underline-offset-2 cursor-pointer transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>

      {/* Sign Up Coming Soon Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md rounded-2xl bg-[#140a38] border border-[#2e176b] p-6 sm:p-8 shadow-2xl text-slate-100 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSignupModal(false)}
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
                Self-service registration is currently in active development. Please use the pre-configured Demo Workspace Login above to immediately access and explore all platform features.
              </p>
            </div>

            <div className="p-3 bg-[#0c0424] border border-[#2e176b] rounded-xl space-y-1 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Full Workspace Access Enabled</span>
              </div>
              <p className="text-[11px] text-slate-400 pl-5.5">
                Meeting creation, audio playback, multi-format transcript import, and action item tracking are fully active.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  handleFillDemo();
                  setShowSignupModal(false);
                }}
                className="w-full bg-[#5925DC] hover:bg-[#6832e3] text-white font-semibold"
              >
                Auto-Fill Demo Credentials →
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#100730] text-slate-100 flex flex-col justify-between selection:bg-[#5925DC] selection:text-white relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#5925DC]/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[300px] bg-[#7A5BF8]/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5925DC] to-[#7A5BF8] text-white shadow-lg shadow-[#5925DC]/30 group-hover:scale-105 transition-transform">
            <AudioLines className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-purple-200 transition-colors">
              MeetScribe
            </span>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-[#5925DC]/20 text-purple-300 border border-[#5925DC]/40 rounded-md">
              Secure Login
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Login Card with Suspense for useSearchParams */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="text-xs text-slate-400">Loading login form...</div>}>
          <LoginForm />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[#1d0d47] text-center text-xs text-slate-500">
        © 2026 MeetScribe. Full-Stack Meeting Notes & Transcription Platform.
      </footer>
    </div>
  );
}
