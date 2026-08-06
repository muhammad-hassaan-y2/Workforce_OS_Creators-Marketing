"use client";

import Image from "next/image";
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
      {/* User Uploaded Kaiso "K" Node Logo Image */}
      <div 
        className="relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(255,138,0,0.25)] border border-amber-500/30"
        style={{ width: size + 6, height: size + 6 }}
      >
        <Image
          src="/logo-mark.png"
          alt={`${BRAND_NAME} Logo Mark`}
          width={size + 6}
          height={size + 6}
          className="w-full h-full object-cover rounded-xl"
          priority
        />
      </div>

      {showWordmark && (
        <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors font-sans">
          {BRAND_NAME}
        </span>
      )}
    </Link>
  );
}
