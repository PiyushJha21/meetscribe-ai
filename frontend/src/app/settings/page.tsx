"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Check,
  Database,
  FolderKanban,
  HardDrive,
  Key,
  Layers,
  Lock,
  Save,
  Settings as SettingsIcon,
  ShieldCheck,
  Sliders,
  User,
  Volume2,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function SettingsPage() {
  const [name, setName] = useState("Piyush Kumar Jha");
  const [email, setEmail] = useState("piyush.jha@syncspace.in");
  const [workspaceName, setWorkspaceName] = useState("SyncSpace Tech");
  const [defaultWorkspace, setDefaultWorkspace] = useState("Engineering Syncs");
  const [autoScrollTranscript, setAutoScrollTranscript] = useState(true);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#251357]/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Workspace Settings
            </h1>
            <Badge variant="indigo" size="sm">
              <Sliders className="w-3 h-3 mr-1 inline" />
              Preferences
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Manage your MeetScribe profile, workspace channels, and transcription preferences.
          </p>
        </div>

        <Link href="/meetings">
          <Button variant="secondary" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
            Back to Meetings
          </Button>
        </Link>
      </div>

      {showSavedFeedback && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Preferences successfully saved to local workspace.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. User Profile */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#251357]/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#5925DC]/15 border border-[#5925DC]/30 rounded-xl text-[#7A5BF8]">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">User Profile</h3>
                <p className="text-xs text-slate-400">Your personal identification in meetings</p>
              </div>
            </div>
            <span className="text-xs font-mono font-medium text-purple-300 bg-[#5925DC]/15 px-2.5 py-0.5 rounded border border-[#5925DC]/30">
              USR-IND-001
            </span>
          </div>

          <div className="flex items-center gap-4 py-2">
            <Avatar name={name} initials="PJ" size="lg" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">{name}</p>
              <p className="text-xs text-slate-400">{email}</p>
              <span className="inline-block text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-medium border border-emerald-500/20">
                Workspace Owner
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#100730]/90 border border-[#251357] rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#5925DC] focus:border-[#5925DC]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#100730]/90 border border-[#251357] rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#5925DC] focus:border-[#5925DC]"
              />
            </div>
          </div>
        </Card>

        {/* 2. Workspace Channels */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#251357]/80">
            <div className="p-2 bg-[#5925DC]/15 border border-[#5925DC]/30 rounded-xl text-[#7A5BF8]">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Workspace Configuration</h3>
              <p className="text-xs text-slate-400">Default workspace channels and category routing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Organization / Team Name</label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full bg-[#100730]/90 border border-[#251357] rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#5925DC] focus:border-[#5925DC]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Default Channel</label>
              <select
                value={defaultWorkspace}
                onChange={(e) => setDefaultWorkspace(e.target.value)}
                className="w-full bg-[#100730]/90 border border-[#251357] rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#5925DC] focus:border-[#5925DC] cursor-pointer"
              >
                <option value="Engineering Syncs" className="bg-[#100730]">Engineering Syncs</option>
                <option value="Product & Design" className="bg-[#100730]">Product & Design</option>
                <option value="Client Reviews" className="bg-[#100730]">Client Reviews</option>
              </select>
            </div>
          </div>
        </Card>

        {/* 3. System & Storage Architecture */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#251357]/80">
            <div className="p-2 bg-[#5925DC]/15 border border-[#5925DC]/30 rounded-xl text-[#7A5BF8]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Database & Storage Engine</h3>
              <p className="text-xs text-slate-400">Local SQLite storage configuration</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#100730]/70 border border-[#251357]/80 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Engine</span>
              <p className="text-xs font-bold text-white">SQLite 3 (WAL mode)</p>
              <p className="text-[11px] text-emerald-400">Connected</p>
            </div>
            <div className="p-3 rounded-xl bg-[#100730]/70 border border-[#251357]/80 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Audio Directory</span>
              <p className="text-xs font-bold text-white">backend/uploads/audio/</p>
              <p className="text-[11px] text-purple-300">Local Safe Storage</p>
            </div>
            <div className="p-3 rounded-xl bg-[#100730]/70 border border-[#251357]/80 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Backend API</span>
              <p className="text-xs font-bold text-white">FastAPI + SQLAlchemy</p>
              <p className="text-[11px] text-emerald-400">Port 8000 (Active)</p>
            </div>
          </div>
        </Card>

        {/* Save Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={<Save className="w-4 h-4" />}
          >
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
