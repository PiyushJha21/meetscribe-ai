"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Calendar,
  CheckSquare,
  Clock,
  Layers,
  Loader2,
  Menu,
  Plus,
  Radio,
  Search,
  User,
  X,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { getAllActionItems, getMeetings } from "@/services/api";
import { ActionItem, Meeting } from "@/types";
import { formatDuration } from "@/lib/utils";

interface TopbarProps {
  onOpenSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenSidebar }) => {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [matchingMeetings, setMatchingMeetings] = useState<Meeting[]>([]);
  const [matchingActionItems, setMatchingActionItems] = useState<ActionItem[]>([]);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search (300ms) across meetings & action items
  useEffect(() => {
    if (!searchVal.trim()) {
      setMatchingMeetings([]);
      setMatchingActionItems([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const q = searchVal.trim().toLowerCase();
      try {
        const [allM, allA] = await Promise.all([
          getMeetings(),
          getAllActionItems().catch(() => [] as ActionItem[]),
        ]);

        // Filter meetings by title or meeting_code
        const filteredM = allM.filter(
          (m) =>
            m.title.toLowerCase().includes(q) ||
            m.meeting_code.toLowerCase().includes(q)
        ).slice(0, 5);

        // Filter action items by task, assignee, or meeting_title
        const filteredA = allA.filter(
          (a) =>
            a.task.toLowerCase().includes(q) ||
            (a.assignee && a.assignee.toLowerCase().includes(q)) ||
            (a.meeting_title && a.meeting_title.toLowerCase().includes(q)) ||
            (a.meeting_code && a.meeting_code.toLowerCase().includes(q))
        ).slice(0, 5);

        setMatchingMeetings(filteredM);
        setMatchingActionItems(filteredA);
        setShowDropdown(true);
      } catch (err) {
        console.error("Global search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchVal]);

  // Click outside listener to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    if (searchVal.trim()) {
      router.push(`/meetings?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      router.push("/meetings");
    }
  };

  const handleSelectMeeting = (id: number) => {
    setShowDropdown(false);
    setSearchVal("");
    router.push(`/meetings/${id}`);
  };

  const handleSelectActionItem = (meetingId?: number) => {
    setShowDropdown(false);
    setSearchVal("");
    if (meetingId) {
      router.push(`/meetings/${meetingId}`);
    } else {
      router.push("/action-items");
    }
  };

  const hasResults = matchingMeetings.length > 0 || matchingActionItems.length > 0;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-[#100730]/90 backdrop-blur-md border-b border-[#251357]/80">
      {/* Left Area: Mobile Menu + Debounced Search */}
      <div ref={searchContainerRef} className="relative flex items-center gap-3 flex-1 max-w-lg">
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#160c3d] md:hidden cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Global Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onFocus={() => {
              if (searchVal.trim() && hasResults) setShowDropdown(true);
            }}
            placeholder="Search meetings, transcripts, action items..."
            className="w-full pl-9 pr-12 py-1.5 text-xs bg-[#160c3d]/90 text-slate-200 placeholder-slate-400 rounded-lg border border-[#2b1764] focus:outline-none focus:ring-1 focus:ring-[#5925DC] focus:border-[#5925DC] focus:shadow-[0_0_12px_rgba(89,37,220,0.2)] transition-all"
          />
          {isSearching ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-purple-400 animate-spin" />
          ) : searchVal ? (
            <button
              type="button"
              onClick={() => {
                setSearchVal("");
                setShowDropdown(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-[#120833] border border-[#2b1764] rounded pointer-events-none">
              ↵
            </kbd>
          )}
        </form>

        {/* Search Results Dropdown */}
        {showDropdown && searchVal.trim() && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-[#160c3d]/98 backdrop-blur-xl border border-[#2b1764] rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-[#251357] animate-in fade-in zoom-in-95 duration-150">
            {/* If no matches found */}
            {!isSearching && !hasResults && (
              <div className="p-4 text-center text-xs text-slate-400">
                No meetings or action items matching &ldquo;{searchVal}&rdquo;
              </div>
            )}

            {/* Meetings Group */}
            {matchingMeetings.length > 0 && (
              <div className="p-2 space-y-1">
                <div className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  <Calendar className="w-3 h-3 text-[#7A5BF8]" />
                  <span>Meetings ({matchingMeetings.length})</span>
                </div>
                {matchingMeetings.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleSelectMeeting(m.id)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#201050]/80 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[10px] font-mono font-medium text-purple-300 bg-[#5925DC]/15 px-1.5 py-0.2 rounded border border-[#5925DC]/30">
                        {m.meeting_code}
                      </span>
                      <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                        {m.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>{formatDuration(m.duration_seconds)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Items Group */}
            {matchingActionItems.length > 0 && (
              <div className="p-2 space-y-1">
                <div className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  <CheckSquare className="w-3 h-3 text-emerald-400" />
                  <span>Action Items ({matchingActionItems.length})</span>
                </div>
                {matchingActionItems.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => handleSelectActionItem(a.meeting_id)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#201050]/80 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          a.is_completed ? "bg-emerald-400" : "bg-amber-400"
                        }`}
                      />
                      <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                        {a.task}
                      </span>
                    </div>
                    {a.assignee && (
                      <span className="text-[10px] text-slate-400 bg-[#100730] px-1.5 py-0.2 rounded border border-[#251357] flex-shrink-0">
                        {a.assignee}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Dropdown Footer Action */}
            <div
              onClick={handleSearchSubmit}
              className="p-2.5 bg-[#100730]/90 hover:bg-[#100730] text-center text-[11px] font-medium text-[#7A5BF8] hover:text-purple-300 cursor-pointer transition-colors"
            >
              Press Enter to see all results in Meetings Explorer →
            </div>
          </div>
        )}
      </div>

      {/* Right Area: Actions, Notifications, User */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Quick Record Action */}
        <Link href="/new-meeting" className="hidden lg:inline-flex">
          <Button
            variant="outline"
            size="sm"
            icon={<Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />}
          >
            Record Audio
          </Button>
        </Link>

        {/* Quick New Meeting Action */}
        <Link href="/new-meeting" className="inline-flex">
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            New Meeting
          </Button>
        </Link>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotificationToast((prev) => !prev);
            }}
            className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#160c3d] transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#5925DC] rounded-full ring-2 ring-[#100730] animate-pulse" />
          </button>

          {showNotificationToast && (
            <div className="absolute right-0 mt-2 w-72 p-3.5 bg-[#160c3d] border border-[#2b1764] rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#251357]">
                <span className="text-xs font-semibold text-white">Notifications</span>
                <span className="text-[10px] text-purple-300 font-mono">1 New</span>
              </div>
              <div className="pt-2 text-xs space-y-1">
                <p className="font-medium text-slate-200">Meeting Notes Ready</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Engineering Sprint Planning transcripts and key action items are generated.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <Link
          href="/settings"
          className="flex items-center gap-2 pl-2 border-l border-[#251357]/80 hover:opacity-90 transition-opacity"
        >
          <Avatar name="Piyush Kumar Jha" initials="PJ" size="sm" />
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-200 leading-none">
              Piyush Jha
            </span>
            <span className="text-[10px] text-slate-400 leading-none mt-1">
              Lead Architect
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};

