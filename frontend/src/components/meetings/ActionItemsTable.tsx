import React from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Circle,
  ExternalLink,
  Layers,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { formatMeetingDate } from "@/lib/utils";
import { getMeetingWorkspace } from "@/components/meetings/MeetingCard";
import { ActionItem } from "@/types";

interface ActionItemsTableProps {
  items: ActionItem[];
  onToggleCompletion: (item: ActionItem) => Promise<void>;
  togglingId: number | null;
}

export const ActionItemsTable: React.FC<ActionItemsTableProps> = ({
  items,
  onToggleCompletion,
  togglingId,
}) => {
  return (
    <div className="bg-[#160c3d]/90 border border-[#2b1764]/90 rounded-xl overflow-hidden backdrop-blur-sm shadow-md">
      {/* Desktop & Tablet Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#251357] bg-[#100730]/70 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 w-12 text-center">Status</th>
              <th className="py-3 px-4">Task Description</th>
              <th className="py-3 px-4 w-44">Assignee</th>
              <th className="py-3 px-4 w-52">Meeting</th>
              <th className="py-3 px-4 w-36">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#251357]/60">
            {items.map((item) => {
              const isToggling = togglingId === item.id;
              const workspace = getMeetingWorkspace(item.meeting_title || "");

              return (
                <tr
                  key={item.id}
                  className={`group transition-colors ${
                    item.is_completed
                      ? "bg-[#100730]/30 text-slate-400 hover:bg-[#100730]/50"
                      : "hover:bg-[#201050]/50 text-slate-200"
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      disabled={isToggling}
                      onClick={() => onToggleCompletion(item)}
                      className="text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none cursor-pointer disabled:opacity-50"
                      title={item.is_completed ? "Mark as pending" : "Mark as completed"}
                    >
                      {item.is_completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400 hover:text-white" />
                      )}
                    </button>
                  </td>

                  {/* Task Description */}
                  <td className="py-3.5 px-4">
                    <span
                      onClick={() => onToggleCompletion(item)}
                      className={`font-medium cursor-pointer transition-all line-clamp-2 ${
                        item.is_completed
                          ? "line-through text-slate-400"
                          : "text-slate-100 group-hover:text-purple-300"
                      }`}
                    >
                      {item.task}
                    </span>
                  </td>

                  {/* Assignee */}
                  <td className="py-3.5 px-4">
                    {item.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={item.assignee} size="xs" />
                        <span className="font-medium truncate text-slate-300" title={item.assignee}>
                          {item.assignee}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>

                  {/* Related Meeting Link */}
                  <td className="py-3.5 px-4">
                    {item.meeting_id ? (
                      <Link
                        href={`/meetings/${item.meeting_id}`}
                        className="flex flex-col gap-0.5 group/link max-w-[190px]"
                      >
                        <span className="font-medium text-slate-300 group-hover/link:text-purple-300 transition-colors truncate flex items-center gap-1">
                          {item.meeting_title || `Meeting #${item.meeting_id}`}
                          <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-mono text-purple-300">
                            {item.meeting_code}
                          </span>
                        </div>
                      </Link>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {/* Due Date & Status */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-1">
                      {item.due_date ? (
                        <div className="flex items-center gap-1 text-[11px] text-slate-300">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          <span>{formatMeetingDate(item.due_date)}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No due date</span>
                      )}
                      <div>
                        {item.is_completed ? (
                          <Badge variant="success" size="sm">
                            Completed
                          </Badge>
                        ) : (
                          <Badge variant="warning" size="sm">
                            Open
                          </Badge>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="md:hidden divide-y divide-[#251357]/80 p-2">
        {items.map((item) => {
          const isToggling = togglingId === item.id;

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl space-y-3 transition-colors ${
                item.is_completed
                  ? "bg-[#100730]/40 text-slate-400 opacity-80"
                  : "bg-[#100730]/70 text-slate-200"
              }`}
            >
              {/* Header: Checkbox + Task */}
              <div className="flex items-start gap-2.5">
                <button
                  type="button"
                  disabled={isToggling}
                  onClick={() => onToggleCompletion(item)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none flex-shrink-0 cursor-pointer"
                >
                  {item.is_completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 hover:text-white" />
                  )}
                </button>
                <p
                  onClick={() => onToggleCompletion(item)}
                  className={`text-xs font-medium leading-snug cursor-pointer ${
                    item.is_completed ? "line-through text-slate-400" : "text-slate-100"
                  }`}
                >
                  {item.task}
                </p>
              </div>

              {/* Meta Row: Assignee, Meeting Link, Due Date */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#251357]/60 text-[11px]">
                {item.assignee && (
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Avatar name={item.assignee} size="xs" />
                    <span>{item.assignee}</span>
                  </div>
                )}

                {item.meeting_id && (
                  <Link
                    href={`/meetings/${item.meeting_id}`}
                    className="text-[#7A5BF8] hover:underline font-mono text-[10px]"
                  >
                    {item.meeting_code}
                  </Link>
                )}

                {item.due_date && (
                  <span className="text-slate-400">
                    Due: {formatMeetingDate(item.due_date)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

