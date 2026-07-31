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
      href="#" 
      className={`inline-flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded-lg p-1 transition-opacity ${className}`}
      aria-label={`${BRAND_NAME} Home`}
    >
      <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <Image
          src="/logo-mark.svg"
          alt={`${BRAND_NAME} Logo Mark`}
          width={size}
          height={size}
          className="w-auto h-auto"
          priority
        />
      </div>
      {showWordmark && (
        <span className="text-xl font-semibold tracking-tight text-white group-hover:text-purple-200 transition-colors font-sans">
          {BRAND_NAME}
        </span>
      )}
    </Link>
  );
}
