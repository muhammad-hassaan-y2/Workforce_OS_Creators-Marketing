"use client";

import { motion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/constants";
import { Star, Quote, MessageSquare } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-[#FAFAFA] border-b border-[#ECECEF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            AGENCY PROOF & CASE STUDIES
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0B0B0F] leading-tight">
            Trusted by growth agencies running <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
              high-volume client campaigns.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#52525B]">
            See how leading RevOps and sales agencies deploy Orbital to replace manual SDR busywork.
          </p>
        </div>

        {/* 3-Up Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-[20px] border border-[#ECECEF] p-8 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group"
            >
              {/* Star Rating */}
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, sIdx) => (
                    <Star key={sIdx} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-purple-200" />

                <p className="text-sm text-[#0B0B0F]/90 leading-relaxed font-normal italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="mt-8 pt-6 border-t border-[#ECECEF] flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.author}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-100"
                />
                <div>
                  <div className="text-sm font-bold text-[#0B0B0F] tracking-tight">
                    {item.author}
                  </div>
                  <div className="text-xs text-[#52525B]">
                    {item.role}, <span className="font-semibold text-purple-600">{item.company}</span>
                  </div>
                </div>
              </div>

              {/* [PLACEHOLDER — replace with real data] */}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
