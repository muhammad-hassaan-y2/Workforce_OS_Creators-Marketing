"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      children,
      icon,
      iconPosition = "right",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variants = {
      // Primary: full pill radius, brand gradient, soft hover lift & glow
      primary:
        "rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:-translate-y-[2px]",
      // Secondary: 12px radius, subtle elevated background
      secondary:
        "rounded-xl bg-[#1D1D26] text-[#F5F5F7] border border-[#2E2E3D] hover:bg-[#262633] hover:border-purple-500/30 hover:-translate-y-[2px]",
      // Ghost: transparent with hover subtle fill
      ghost:
        "rounded-xl bg-transparent text-[#A1A1AA] hover:text-white hover:bg-white/5",
      // Outline: for light sections or dark sections
      outline:
        "rounded-xl bg-transparent text-current border border-current/20 hover:border-current/40 hover:bg-current/5",
      danger:
        "rounded-xl bg-red-600 text-white hover:bg-red-700",
    };

    const sizes = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5",
      md: "text-sm px-5 py-2.5 gap-2",
      lg: "text-base px-7 py-3.5 gap-2.5 font-semibold",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {icon && iconPosition === "left" && <span className="inline-flex shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === "right" && <span className="inline-flex shrink-0">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
