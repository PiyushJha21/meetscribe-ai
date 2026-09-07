import React from "react";
import { CheckCircle2, CircleDot, ListTodo, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface ActionItemStatsProps {
  totalCount: number;
  openCount: number;
  completedCount: number;
}

export const ActionItemStats: React.FC<ActionItemStatsProps> = ({
  totalCount,
  openCount,
  completedCount,
}) => {
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const stats = [
    {
      label: "Total Tasks",
      value: totalCount.toString(),
      subtext: "Across all meetings",
      icon: ListTodo,
      variant: "indigo" as const,
    },
    {
      label: "Open Tasks",
      value: openCount.toString(),
      subtext: "Pending completion",
      icon: CircleDot,
      variant: "warning" as const,
    },
    {
      label: "Completed Tasks",
      value: completedCount.toString(),
      subtext: "Finished action items",
      icon: CheckCircle2,
      variant: "success" as const,
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      subtext: "Team task velocity",
      icon: TrendingUp,
      variant: "indigo" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card key={idx} className="relative overflow-hidden p-4 sm:p-5 border-[#2b1764]/80">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1 font-mono">
                  {stat.value}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 font-medium hidden sm:block">
                  {stat.subtext}
                </p>
              </div>
              <div
                className={`p-2 sm:p-2.5 rounded-xl border ${
                  stat.variant === "indigo"
                    ? "bg-[#5925DC]/15 border-[#5925DC]/30 text-[#7A5BF8]"
                    : stat.variant === "warning"
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

