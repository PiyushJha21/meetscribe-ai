import React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-[#2b1764] bg-[#160c3d]/40 max-w-md mx-auto",
        className
      )}
    >
      {icon && (
        <div className="p-3 mb-3.5 rounded-full bg-[#1c104d] text-[#7A5BF8] border border-[#331a70]">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-100 mb-1">{title}</h3>
      <p className="text-xs text-slate-400 max-w-xs mb-4">{description}</p>
      {action}
    </div>
  );
};
