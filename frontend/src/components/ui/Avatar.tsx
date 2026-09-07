import React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  src?: string;
  initials?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  initials,
  size = "md",
  className,
  ...props
}) => {
  const getInitials = (fullName?: string) => {
    if (initials) return initials;
    if (!fullName) return "U";
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const sizes = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-9 h-9 text-xs font-semibold",
    lg: "w-11 h-11 text-sm font-semibold",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#5925DC] to-[#7A5BF8] text-white font-medium border border-[#7A5BF8]/40 select-none overflow-hidden flex-shrink-0 shadow-sm",
        sizes[size],
        className
      )}
      title={name}
      {...props}
    >
      {src ? (
        <img src={src} alt={name || "Avatar"} className="w-full h-full object-cover" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};
