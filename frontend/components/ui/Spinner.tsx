"use client";

import React from "react";

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  color?: "purple" | "yellow" | "emerald" | "blue" | "white";
  className?: string;
}

export function Spinner({ size = "md", color = "purple", className = "" }: SpinnerProps) {
  const sizeMap = {
    xs: "w-3 h-3 border-[1.5px]",
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-[2.5px]"
  };

  const colorMap = {
    purple: "border-purple-500/20 border-t-purple-500 text-purple-400",
    yellow: "border-yellow-400/20 border-t-yellow-400 text-yellow-400",
    emerald: "border-emerald-400/20 border-t-emerald-400 text-emerald-400",
    blue: "border-blue-500/20 border-t-blue-500 text-blue-400",
    white: "border-white/20 border-t-white text-white"
  };

  return (
    <div
      className={`inline-block rounded-full animate-spin ${sizeMap[size]} ${colorMap[color]} ${className}`}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface RunnerProps {
  progress?: number;
  indeterminate?: boolean;
  color?: "purple" | "yellow" | "emerald" | "gradient";
  height?: string;
  className?: string;
}

export function Runner({
  progress = 0,
  indeterminate = false,
  color = "gradient",
  height = "h-1.5",
  className = ""
}: RunnerProps) {
  const colorGradients = {
    gradient: "from-indigo-500 via-purple-500 to-yellow-400",
    purple: "from-purple-600 to-indigo-500",
    yellow: "from-yellow-400 to-amber-500",
    emerald: "from-emerald-400 to-teal-500"
  };

  return (
    <div className={`w-full bg-[#12121A] rounded-full overflow-hidden relative border border-white/5 ${height} ${className}`}>
      {indeterminate ? (
        <div className={`h-full w-full bg-gradient-to-r ${colorGradients[color]} animate-pulse opacity-90 rounded-full relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
      ) : (
        <div
          className={`h-full bg-gradient-to-r ${colorGradients[color]} transition-all duration-300 rounded-full relative`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        >
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_#ffffff] animate-ping" />
        </div>
      )}
    </div>
  );
}

interface PulseDotProps {
  color?: "emerald" | "yellow" | "purple" | "blue";
  size?: "sm" | "md";
  ping?: boolean;
}

export function PulseDot({ color = "emerald", size = "sm", ping = true }: PulseDotProps) {
  const bgColors = {
    emerald: "bg-emerald-400",
    yellow: "bg-yellow-400",
    purple: "bg-purple-400",
    blue: "bg-blue-400"
  };

  const sizes = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5"
  };

  return (
    <span className="relative flex items-center justify-center">
      {ping && (
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${bgColors[color]}`} />
      )}
      <span className={`relative inline-flex rounded-full ${sizes[size]} ${bgColors[color]}`} />
    </span>
  );
}
