import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-[#160c3d]/90 border border-[#2b1764]/80 rounded-xl p-5 backdrop-blur-sm shadow-sm transition-all duration-200",
        hoverable && "hover:border-[#5925DC]/50 hover:bg-[#1c0f4c]/95 hover:shadow-md cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

