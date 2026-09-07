"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AudioLines,
  Calendar,
  CheckSquare,
  ChevronRight,
  FolderKanban,
  Home,
  Layers,
  Settings,
  X,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const mainNavItems = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Meetings", href: "/meetings", icon: Calendar },
    { label: "Action Items", href: "/action-items", icon: CheckSquare },
  ];

  const workspaceChannels = [
    { label: "Engineering Syncs", count: 4 },
    { label: "Product & Design", count: 2 },
    { label: "Client Reviews", count: 2 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-[#0d0526] border-r border-[#251357]/80 transition-transform duration-300 ease-in-out md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[#251357]/80">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            {/* Original MeetScribe Logo Icon */}
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#5925DC] to-[#7A5BF8] text-white shadow-md shadow-[#5925DC]/30 group-hover:scale-105 transition-transform">
              <AudioLines className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                MeetScribe
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 bg-[#5925DC]/20 text-purple-300 border border-[#5925DC]/30 rounded">
                  v0.1
                </span>
              </span>
            </div>
          </Link>

          {/* Mobile Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-[#160c3d] md:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Content */}
        <div className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
          {/* Main Navigation */}
          <nav className="space-y-1">
            <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              Main Navigation
            </div>
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-all duration-150 group",
                    isActive
                      ? "bg-gradient-to-r from-[#5925DC] to-[#7A5BF8] text-white shadow-sm shadow-[#5925DC]/30 font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-[#160c3d]/90"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-purple-300"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Workspace Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              <span>Workspace Channels</span>
              <FolderKanban className="w-3.5 h-3.5 text-slate-400" />
            </div>
            {workspaceChannels.map((channel, idx) => (
              <Link
                key={idx}
                href={`/meetings`}
                onClick={onClose}
                className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-[#160c3d]/90 rounded-lg cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Layers className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-300 transition-colors" />
                  <span className="truncate">{channel.label}</span>
                </div>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-[#140a38] border border-[#251357] text-slate-400 group-hover:border-[#381c7e] group-hover:text-slate-300 transition-colors">
                  {channel.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-3 border-t border-[#251357]/80 bg-[#0d0526]/90 space-y-2">
          <Link
            href="/settings"
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors",
              pathname === "/settings"
                ? "bg-[#5925DC] text-white font-semibold shadow-sm shadow-[#5925DC]/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-[#160c3d]/80"
            )}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>

          <div className="flex items-center gap-3 p-2 rounded-xl bg-[#160c3d] border border-[#2b1764]">
            <Avatar name="Piyush Kumar Jha" initials="PJ" size="sm" />
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white truncate">
                  Piyush Kumar Jha
                </span>
              </div>
              <span className="text-[10px] text-purple-300 font-mono">
                USR-IND-001
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                piyush.jha@syncspace.in
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

