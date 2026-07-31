"use client";

import Logo from "../Logo";
import { BRAND_NAME, NAV_LINKS } from "@/lib/constants";
import { Button } from "../ui/Button";
import { ArrowRight, Globe, Share2, Code2, Disc as Discord } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#07070A] border-t border-[#1C1C26] text-[#A1A1AA] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-[#1C1C26]">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-5">
            <Logo size={36} />
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              The autonomous AI agent operating system for sales and marketing agencies. Deploy Phone, Browser, and CLI workforce pods in minutes.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 rounded-lg bg-[#141419] border border-[#22222E] text-gray-400 hover:text-white hover:border-purple-500/40 transition-colors" aria-label="Website">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-[#141419] border border-[#22222E] text-gray-400 hover:text-white hover:border-purple-500/40 transition-colors" aria-label="Social Share">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-[#141419] border border-[#22222E] text-gray-400 hover:text-white hover:border-purple-500/40 transition-colors" aria-label="Developer Docs">
                <Code2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-[#141419] border border-[#22222E] text-gray-400 hover:text-white hover:border-purple-500/40 transition-colors" aria-label="Community">
                <Discord className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="md:col-span-3 grid grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div className="font-semibold text-white uppercase text-xs tracking-wider">Product</div>
              <ul className="space-y-2 text-xs">
                <li><a href="#agents" className="hover:text-white transition-colors">Phone Caller Agent</a></li>
                <li><a href="#agents" className="hover:text-white transition-colors">Browser Control Agent</a></li>
                <li><a href="#agents" className="hover:text-white transition-colors">CLI / Ops Agent</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">Orchestration Mesh</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Agency SDK</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <div className="font-semibold text-white uppercase text-xs tracking-wider">Resources</div>
              <ul className="space-y-2 text-xs">
                <li><a href="#faq" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#use-cases" className="hover:text-white transition-colors">Agency Case Studies</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">Security & Guardrails</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">Status & Uptime</a></li>
              </ul>
            </div>
          </div>

          {/* Newsletter Input Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="font-semibold text-white uppercase text-xs tracking-wider">
              Subscribe to RevOps Weekly
            </div>
            <p className="text-xs text-gray-400">
              Get battle-tested multi-agent sales scripts, browser automation patterns, and agency growth benchmarks.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
              <input
                type="email"
                placeholder="agency@company.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#141419] border border-[#22222E] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-mono"
              />
              <Button variant="primary" size="sm" type="submit" icon={<ArrowRight className="w-4 h-4" />}>
                Join
              </Button>
            </form>
            <span className="text-[10px] text-gray-500 block font-mono">No spam. Unsubscribe anytime.</span>
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} {BRAND_NAME} Inc. All rights reserved. Built for modern sales & marketing agencies.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-400 transition-colors">SOC2 Compliance</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
