"use client";

import Link from "next/link";
import { BRAND_NAME } from "@/lib/constants";

interface LogoProps {
  showWordmark?: boolean;
  className?: string;
  size?: number;
}

export default function Logo({ showWordmark = true, className = "", size = 38 }: LogoProps) {
  return (
    <Link 
      href="/" 
      className={`inline-flex items-center gap-3 group focus:outline-none rounded-xl p-1 transition-all ${className}`}
      aria-label={`${BRAND_NAME} Home`}
    >
      {/* 100% Vector Kaiso Geometric "K" Neural Mesh Logo Mark */}
      <div 
        className="relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 rounded-xl bg-gradient-to-b from-[#121624] to-[#0A0D17] border border-amber-500/40 p-1.5 shadow-[0_0_25px_rgba(255,138,0,0.35)]"
        style={{ width: size + 10, height: size + 10 }}
      >
        <svg 
          width={size + 2} 
          height={size + 2} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="kaisoCoreSpine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9E00" />
              <stop offset="50%" stopColor="#FF5E36" />
              <stop offset="100%" stopColor="#FF2A4B" />
            </linearGradient>

            <linearGradient id="kaisoBranchTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFAA00" />
              <stop offset="100%" stopColor="#FF5E36" />
            </linearGradient>

            <linearGradient id="kaisoBranchBot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4B4B" />
              <stop offset="100%" stopColor="#FF2A4B" />
            </linearGradient>

            <filter id="neonGlowEffect" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Glowing Neural Grid Base */}
          <rect x="8" y="8" width="84" height="84" rx="20" fill="url(#kaisoCoreSpine)" fillOpacity="0.08" stroke="url(#kaisoCoreSpine)" strokeWidth="1.5" strokeOpacity="0.3" />

          {/* Left Hexagonal "K" Neural Pillar */}
          <path 
            d="M 30 18 L 62 18 L 44 45 L 44 55 L 62 82 L 30 82 L 20 50 Z" 
            fill="url(#kaisoCoreSpine)" 
            filter="url(#neonGlowEffect)"
          />

          {/* Top Radiating Neural Branch & Node */}
          <path d="M 44 45 L 76 25" stroke="url(#kaisoBranchTop)" strokeWidth="10" strokeLinecap="round" />
          <circle cx="76" cy="25" r="9" fill="#FFAA00" filter="url(#neonGlowEffect)" />

          {/* Middle Radiating Neural Branch & Node */}
          <path d="M 44 50 L 80 50" stroke="url(#kaisoCoreSpine)" strokeWidth="10" strokeLinecap="round" />
          <circle cx="80" cy="50" r="9" fill="#FF5E36" filter="url(#neonGlowEffect)" />

          {/* Bottom Radiating Neural Branch & Node */}
          <path d="M 44 55 L 76 75" stroke="url(#kaisoBranchBot)" strokeWidth="10" strokeLinecap="round" />
          <circle cx="76" cy="75" r="9" fill="#FF2A4B" filter="url(#neonGlowEffect)" />
        </svg>
      </div>

      {showWordmark && (
        <span className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-red-500 group-hover:from-amber-300 group-hover:to-orange-400 transition-all font-sans">
          {BRAND_NAME}
        </span>
      )}
    </Link>
  );
}
