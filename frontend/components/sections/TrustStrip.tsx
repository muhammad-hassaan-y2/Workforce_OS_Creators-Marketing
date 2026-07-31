"use client";

import { motion } from "framer-motion";
import { TRUSTED_AGENCIES } from "@/lib/constants";

export default function TrustStrip() {
  return (
    <section className="py-12 bg-[#FAFAFA] border-y border-[#ECECEF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-[0.12em] font-semibold text-[#52525B] mb-8">
            TRUSTED BY FORWARD-THINKING REVOPS TEAMS AND GROWTH AGENCIES
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-center opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            {TRUSTED_AGENCIES.map((item, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-white/60 border border-[#E5E5EA] shadow-xs flex items-center justify-center font-bold tracking-tighter text-[#0B0B0F]/60 text-sm hover:text-[#0B0B0F] hover:border-purple-300 transition-colors"
              >
                {item.logoText}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
