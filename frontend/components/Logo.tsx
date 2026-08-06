"use client";

import Link from "next/link";
import { BRAND_NAME } from "@/lib/constants";

interface LogoProps {
  showWordmark?: boolean;
  className?: string;
  size?: number;
}

export default function Logo({ showWordmark = true, className = "", size = 36 }: LogoProps) {
  return (
    <Link 
      href="/" 
      className={`inline-flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded-xl p-1 transition-opacity ${className}`}
      aria-label={`${BRAND_NAME} Home`}
    >
      {/* Kaiso Stylized "K" Geometric Node Logo Mark */}
      <div 
        className="relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 rounded-xl bg-[#0B0E17] border border-amber-500/30 p-1.5 shadow-[0_0_20px_rgba(255,138,0,0.2)]"
        style={{ width: size + 8, height: size + 8 }}
      >
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="kaisoSpineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF8A00" />
              <stop offset="100%" stopColor="#FF3B57" />
            </linearGradient>

            <linearGradient id="kaisoNodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF3B57" />
              <stop offset="100%" stopColor="#FF8A00" />
            </linearGradient>

            <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Left Hexagonal "K" Spine */}
          <path 
            d="M 32 18 L 62 18 L 44 46 L 44 54 L 62 82 L 32 82 L 20 50 Z" 
            fill="url(#kaisoSpineGrad)" 
            filter="url(#logoGlow)"
          />

          {/* Top Right Node Line & Circle */}
          <path d="M 44 46 L 76 26" stroke="url(#kaisoNodeGrad)" strokeWidth="9" strokeLinecap="round" />
          <circle cx="76" cy="26" r="8" fill="#FF8A00" />

          {/* Middle Right Node Line & Circle */}
          <path d="M 44 50 L 78 50" stroke="url(#kaisoNodeGrad)" strokeWidth="9" strokeLinecap="round" />
          <circle cx="78" cy="50" r="8" fill="#FF3B57" />

          {/* Bottom Right Node Line & Circle */}
          <path d="M 44 54 L 76 74" stroke="url(#kaisoNodeGrad)" strokeWidth="9" strokeLinecap="round" />
          <circle cx="76" cy="74" r="8" fill="#FF3B57" />
        </svg>
      </div>

      {showWordmark && (
        <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors font-sans">
          {BRAND_NAME}
        </span>
      )}
    </Link>
  );
}
