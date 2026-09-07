import React from "react";
import { Users } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Participant } from "@/types";

interface ParticipantListProps {
  participants: Participant[];
}

export const ParticipantList: React.FC<ParticipantListProps> = ({ participants }) => {
  if (!participants || participants.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Users className="w-3.5 h-3.5 text-[#7A5BF8]" />
        <span>Participants ({participants.length})</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {participants.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-2.5 p-2 rounded-lg bg-[#160c3d]/80 border border-[#2b1764]/80 hover:border-[#381c7e] transition-colors"
          >
            <Avatar name={p.name} size="sm" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-slate-200 truncate" title={p.name}>
                {p.name}
              </span>
              <span className="text-[10px] text-purple-300 truncate">
                {p.role || "Attendee"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

