"use client";

import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Hash,
  ListTodo,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
  User as UserIcon,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatMeetingDate } from "@/lib/utils";
import { createActionItem, deleteActionItem, updateActionItem } from "@/services/api";
import { ActionItem, KeyTopic, MeetingSummary } from "@/types";

interface MeetingSummaryPanelProps {
  meetingId?: number;
  summary?: MeetingSummary | null;
  keyTopics: KeyTopic[];
  actionItems: ActionItem[];
  onActionItemToggle?: (updatedItem: ActionItem) => void;
  onActionItemCreated?: (newItem: ActionItem) => void;
  onActionItemDeleted?: (deletedId: number) => void;
}

export const MeetingSummaryPanel: React.FC<MeetingSummaryPanelProps> = ({
  meetingId,
  summary,
  keyTopics,
  actionItems,
  onActionItemToggle,
  onActionItemCreated,
  onActionItemDeleted,
}) => {
  const [localActions, setLocalActions] = useState<ActionItem[]>(actionItems);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // New Action Item Form State
  const [isAddingAction, setIsAddingAction] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Sync state if props update
  React.useEffect(() => {
    setLocalActions(actionItems);
  }, [actionItems]);

  const handleToggle = async (item: ActionItem) => {
    const nextCompleted = !item.is_completed;
    setTogglingId(item.id);

    // Optimistic UI update
    const updatedList = localActions.map((a) =>
      a.id === item.id ? { ...a, is_completed: nextCompleted } : a
    );
    setLocalActions(updatedList);

    try {
      const persisted = await updateActionItem(item.id, {
        is_completed: nextCompleted,
      });
      if (onActionItemToggle) {
        onActionItemToggle(persisted);
      }
    } catch (err) {
      console.error("Failed to toggle action item:", err);
      // Revert optimistic update
      setLocalActions(actionItems);
    } finally {
      setTogglingId(null);
    }
  };

  const handleCreateAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim() || !meetingId) return;

    setIsSubmittingAction(true);
    try {
      const created = await createActionItem({
        meeting_id: meetingId,
        task: newTask.trim(),
        assignee: newAssignee.trim() || undefined,
        due_date: newDueDate ? new Date(newDueDate).toISOString() : undefined,
        is_completed: false,
      });

      setLocalActions((prev) => [...prev, created]);
      if (onActionItemCreated) {
        onActionItemCreated(created);
      }

      setNewTask("");
      setNewAssignee("");
      setNewDueDate("");
      setIsAddingAction(false);
    } catch (err) {
      console.error("Failed to create action item:", err);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleDeleteAction = async (e: React.MouseEvent, actionId: number) => {
    e.stopPropagation();
    setLocalActions((prev) => prev.filter((a) => a.id !== actionId));
    try {
      await deleteActionItem(actionId);
      if (onActionItemDeleted) {
        onActionItemDeleted(actionId);
      }
    } catch (err) {
      console.error("Failed to delete action item:", err);
      setLocalActions(actionItems);
    }
  };

  const completedCount = localActions.filter((a) => a.is_completed).length;

  return (
    <div className="space-y-6">
      {/* 1. Executive AI Summary */}
      <Card className="space-y-3 border-[#5925DC]/30 bg-gradient-to-b from-[#5925DC]/15 to-[#160c3d]/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-300 font-semibold text-sm">
            <Sparkles className="w-4 h-4 text-[#7A5BF8]" />
            <span>AI Executive Summary</span>
          </div>
          <Badge variant="indigo" size="sm">
            1:1 Verified
          </Badge>
        </div>

        {summary?.overview ? (
          <p className="text-xs text-slate-300 leading-relaxed bg-[#100730]/70 p-3.5 rounded-lg border border-[#5925DC]/20">
            {summary.overview}
          </p>
        ) : (
          <p className="text-xs text-slate-500 italic">No summary generated for this meeting.</p>
        )}
      </Card>

      {/* 2. Key Discussion Topics */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
            <Hash className="w-4 h-4 text-[#7A5BF8]" />
            <span>Key Discussion Topics</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-[#120833] border border-[#251357] px-2 py-0.5 rounded-full">
            {keyTopics.length} topics
          </span>
        </div>

        <div className="space-y-2">
          {keyTopics.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No key topics recorded.</p>
          ) : (
            keyTopics.map((topic, idx) => (
              <div
                key={topic.id || idx}
                className="p-3 rounded-lg bg-[#100730]/60 border border-[#251357]/80 space-y-1 hover:border-[#381c7e] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-[#5925DC]/15 text-[#7A5BF8] text-[10px] font-mono font-bold border border-[#5925DC]/30">
                    {topic.sequence_number || idx + 1}
                  </span>
                  <h4 className="text-xs font-semibold text-slate-200">
                    {topic.title}
                  </h4>
                </div>
                {topic.description && (
                  <p className="text-[11px] text-slate-400 pl-7 leading-relaxed">
                    {topic.description}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* 3. Action Items Checklist */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
            <ListTodo className="w-4 h-4 text-emerald-400" />
            <span>Action Items</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              {completedCount}/{localActions.length} Done
            </span>
            {meetingId && !isAddingAction && (
              <button
                type="button"
                onClick={() => setIsAddingAction(true)}
                className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-[#160c3d] rounded transition-colors cursor-pointer"
                title="Add Action Item"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Inline Add Action Item Form */}
        {isAddingAction && (
          <form
            onSubmit={handleCreateAction}
            className="p-3 bg-[#100730]/90 border border-[#5925DC]/40 rounded-lg space-y-2.5 animate-in fade-in duration-150"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-purple-300">New Action Item</span>
              <button
                type="button"
                onClick={() => setIsAddingAction(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Task description..."
              className="w-full bg-[#140a38] border border-[#251357] rounded px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#5925DC]"
              autoFocus
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                placeholder="Assignee (e.g. Piyush)"
                className="w-full bg-[#140a38] border border-[#251357] rounded px-2.5 py-1 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#5925DC]"
              />
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full bg-[#140a38] border border-[#251357] rounded px-2.5 py-1 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#5925DC]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsAddingAction(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmittingAction || !newTask.trim()}
                icon={isSubmittingAction ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
              >
                Add Item
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {localActions.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No action items assigned for this meeting.</p>
          ) : (
            localActions.map((item) => {
              const isToggling = togglingId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => handleToggle(item)}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none group/item ${
                    item.is_completed
                      ? "bg-[#100730]/30 border-[#251357]/50 opacity-70"
                      : "bg-[#100730]/70 border-[#251357] hover:border-[#381c7e]"
                  }`}
                >
                  {/* Interactive Checkbox */}
                  <button
                    type="button"
                    disabled={isToggling}
                    className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none flex-shrink-0 cursor-pointer"
                  >
                    {item.is_completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-400 hover:text-white" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0 space-y-1">
                    <p
                      className={`text-xs font-medium leading-snug transition-all ${
                        item.is_completed
                          ? "line-through text-slate-400"
                          : "text-slate-200"
                      }`}
                    >
                      {item.task}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px]">
                      {item.assignee && (
                        <span className="inline-flex items-center gap-1 text-slate-400 bg-[#140a38] px-1.5 py-0.5 rounded border border-[#251357]">
                          <UserIcon className="w-2.5 h-2.5 text-[#7A5BF8]" />
                          <span>{item.assignee}</span>
                        </span>
                      )}

                      {item.due_date && (
                        <span className="inline-flex items-center gap-1 text-slate-400 bg-[#140a38] px-1.5 py-0.5 rounded border border-[#251357]">
                          <Calendar className="w-2.5 h-2.5 text-amber-400" />
                          <span>Due {formatMeetingDate(item.due_date)}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delete Action Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteAction(e, item.id)}
                    className="opacity-0 group-hover/item:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded transition-opacity cursor-pointer"
                    title="Delete action item"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
};

