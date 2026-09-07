"use client";

import React from "react";
import { Plus, Trash2, UserPlus, Users } from "lucide-react";
import { ParticipantInput as ParticipantInputType } from "@/types";

interface ParticipantInputProps {
  participants: ParticipantInputType[];
  onChange: (participants: ParticipantInputType[]) => void;
  error?: string;
}

export const ParticipantInput: React.FC<ParticipantInputProps> = ({
  participants,
  onChange,
  error,
}) => {
  const handleAdd = () => {
    onChange([...participants, { name: "", email: "", role: "Attendee" }]);
  };

  const handleRemove = (index: number) => {
    if (participants.length <= 1) return;
    onChange(participants.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index: number, field: keyof ParticipantInputType, value: string) => {
    const updated = participants.map((p, i) => (i === index ? { ...p, [field]: value } : p));
    onChange(updated);
  };

  const rolePresets = ["Host", "Presenter", "Software Engineer", "Backend Engineer", "Frontend Engineer", "Product Manager", "Engineering Manager", "UI/UX Designer", "Attendee"];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-[#7A5BF8]" />
          <span>Participants</span>
          <span className="text-rose-400">*</span>
        </label>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#7A5BF8] hover:text-purple-300 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Participant</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {participants.map((p, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row items-center gap-2 p-2.5 rounded-xl bg-[#100730]/70 border border-[#251357] focus-within:border-[#5925DC]/50 transition-colors"
          >
            {/* Name */}
            <div className="w-full sm:flex-1">
              <input
                type="text"
                value={p.name}
                onChange={(e) => handleFieldChange(idx, "name", e.target.value)}
                placeholder="Name (e.g. Piyush Jha)"
                className="w-full px-2.5 py-1.5 text-xs bg-[#140a38] text-slate-200 placeholder-slate-500 rounded-lg border border-[#251357] focus:outline-none focus:ring-1 focus:ring-[#5925DC]"
              />
            </div>

            {/* Email */}
            <div className="w-full sm:flex-1">
              <input
                type="email"
                value={p.email || ""}
                onChange={(e) => handleFieldChange(idx, "email", e.target.value)}
                placeholder="Email (optional)"
                className="w-full px-2.5 py-1.5 text-xs bg-[#140a38] text-slate-200 placeholder-slate-500 rounded-lg border border-[#251357] focus:outline-none focus:ring-1 focus:ring-[#5925DC]"
              />
            </div>

            {/* Role */}
            <div className="w-full sm:w-36">
              <select
                value={p.role || "Attendee"}
                onChange={(e) => handleFieldChange(idx, "role", e.target.value)}
                className="w-full px-2 py-1.5 text-xs bg-[#140a38] text-slate-300 rounded-lg border border-[#251357] focus:outline-none focus:ring-1 focus:ring-[#5925DC] appearance-none cursor-pointer"
              >
                {rolePresets.map((r) => (
                  <option key={r} value={r} className="bg-[#160c3d] text-slate-200">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Delete button */}
            {participants.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer self-end sm:self-center"
                title="Remove participant"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
};

