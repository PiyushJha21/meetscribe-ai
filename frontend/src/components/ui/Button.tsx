import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  icon,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#5925DC] focus:ring-offset-2 focus:ring-offset-[#100730] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary:
      "bg-[#5925DC] hover:bg-[#6b35e8] text-white shadow-sm shadow-[#5925DC]/25 active:bg-[#4d1ec4]",
    secondary:
      "bg-[#1c104d] hover:bg-[#251466] text-slate-100 border border-[#331a70] active:bg-[#1c104d]",
    outline:
      "border border-[#331a70] hover:border-[#5925DC]/60 bg-transparent text-slate-200 hover:bg-[#1c104d]/60 active:bg-[#1c104d]",
    ghost:
      "bg-transparent hover:bg-[#1c104d]/60 text-slate-300 hover:text-white active:bg-[#1c104d]/80",
    danger:
      "bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-500/20 active:bg-rose-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

