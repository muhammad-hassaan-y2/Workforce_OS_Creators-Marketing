"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, TrendingUp, Megaphone, CheckCircle2, Video, Target } from "lucide-react";

export default function UseCases() {
  const [activeTab, setActiveTab] = useState<"creators" | "agency" | "sales" | "marketing">("creators");

  const useCasesData = {
    creators: {
      title: "For Content Creators & Influencer Studios",
      badge: "SPONSORSHIPS & DM AUTOMATION",
      icon: Video,
      description:
        "Automate your brand deal pipeline, inbound sponsor calls, and cross-platform content distribution. Let AI agents handle pitch emails, rate negotiations, and media kit analytics while you focus on content.",
      bullets: [
        "Browser agents crawl brand directories & submit automated media kit pitches",
        "Phone agents take inbound sponsor calls & negotiate CPM rate sheets 24/7",
        "CLI agents compile channel analytics & automate post-campaign brand reports",
      ],
      stat: "4.8x",
      statLabel: "More Sponsored Brand Deals Secured",
      visualTitle: "Creator Sponsorship & Content Control Center",
      visualDetails: [
        { client: "Tech Brand Deal", status: "Sponsor Inquiry Qualified", metrics: "$12,500 CPM Rate Locked" },
        { client: "Podcast Guest Intake", status: "Phone Agent Qualified", metrics: "Calendar Demo Booked" },
        { client: "YouTube Media Kit", status: "Browser Agent Dispatched", metrics: "142 Brand Managers Reached" }
      ]
    },
    agency: {
      title: "For Agency Owners & Managing Directors",
      badge: "SCALE MARGINS & RETAINERS",
      icon: Briefcase,
      description:
        "Replace fragmented VA teams and manual SDR headcount with autonomous agent pods. Deliver 3x higher lead throughput to clients while protecting 70%+ gross margins.",
      bullets: [
        "Deploy white-label AI workforce dedicated to each client account",
        "Scale client onboarding from 2 weeks down to 45 minutes",
        "Eliminate SDR turnover and training overhead permanently",
      ],
      stat: "3.4x",
      statLabel: "Higher Gross Margin per Client Retainer",
      visualTitle: "Agency Client Portfolio Dashboard",
      visualDetails: [
        { client: "Acme SaaS", status: "Active (4 Agents)", metrics: "142 Demos Booked" },
        { client: "Venture Corp", status: "Active (8 Agents)", metrics: "389 Calls Qualified" },
        { client: "GrowthScale", status: "Active (2 Agents)", metrics: "98.2% Lead Enrichment" }
      ]
    },
    sales: {
      title: "For Sales Leads & SDR Teams",
      badge: "ZERO MANUAL DIALING",
      icon: TrendingUp,
      description:
        "Free your closers to focus exclusively on live prospect conversations. Millo agents handle all initial outreach, cold dialing, objection filtering, and appointment booking.",
      bullets: [
        "Instant speed-to-lead response within 45 seconds of form fill",
        "Automated calendar booking straight into closer calendars",
        "Full call transcripts & sentiment tags logged directly to CRM",
      ],
      stat: "100%",
      statLabel: "Pre-Qualified Calendar Pipeline",
      visualTitle: "SDR Calendar & Pipeline Feed",
      visualDetails: [
        { client: "09:00 AM Call", status: "Qualified B2B Prospect", metrics: "Budget: $50k+ confirmed" },
        { client: "11:30 AM Call", status: "Inbound Lead", metrics: "Time-to-call: 28 seconds" },
        { client: "02:00 PM Call", status: "Outbound Qualification", metrics: "HubSpot stage: Demo Set" }
      ]
    },
    marketing: {
      title: "For Growth & RevOps Leaders",
      badge: "ENRICHMENT & AUTOMATION",
      icon: Megaphone,
      description:
        "Turn raw ad lead submissions into enriched, phone-verified appointments instantly. Browser agents crawl targeted directories while Ops agents sync data across your stack.",
      bullets: [
        "Real-time contact enrichment across LinkedIn, Apollo & company sites",
        "Automatic ad form spam filtering and validation handshake",
        "Closed-loop revenue reporting synced across ad platforms",
      ],
      stat: "45s",
      statLabel: "Average Inbound Speed-to-Lead",
      visualTitle: "RevOps Data Pipeline Monitor",
      visualDetails: [
        { client: "Ad Form Webhook", status: "Parsed & Enriched", metrics: "100% verified emails" },
        { client: "Browser Scrape", status: "LinkedIn Directory", metrics: "500 VP profiles parsed" },
        { client: "CRM Sync", status: "HubSpot & Salesforce", metrics: "Zero duplicate leads" }
      ]
    }
  };

  const current = useCasesData[activeTab];

  return (
    <section id="use-cases" className="py-24 md:py-32 bg-[#090814] text-white border-t border-[#1F1A3A] relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            WORKFLOW ADAPTABILITY
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Tailored outcomes for Agencies, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500">
              Creators & Growth Teams.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Select your operating role to see how Millo transforms daily output.
          </p>
        </div>

        {/* Custom 4 Tab Switches */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-12 flex-wrap">
          {(["creators", "agency", "sales", "marketing"] as const).map((tabKey) => {
            const tabObj = useCasesData[tabKey];
            const isActive = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-red-500 text-black shadow-lg shadow-amber-500/20 scale-105"
                    : "bg-[#14102E] text-gray-400 border border-[#2D2654] hover:border-amber-500/50 hover:text-white"
                }`}
              >
                <tabObj.icon className={`w-4 h-4 ${isActive ? "text-black" : "text-amber-400"}`} />
                <span>{tabObj.title.split("For ")[1].split(" &")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left Card: Value Narrative */}
            <div className="lg:col-span-6 bg-[#120E2B]/80 backdrop-blur-xl rounded-3xl border border-[#26204D] p-8 md:p-10 shadow-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                {current.badge}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {current.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {current.description}
              </p>

              <div className="space-y-3 pt-2">
                {current.bullets.map((b, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-200 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {/* Big Stat Highlight inside Tab */}
              <div className="pt-6 border-t border-[#231E4D] flex items-center gap-4">
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-500 font-mono">
                  {current.stat}
                </div>
                <div className="text-xs text-gray-400 font-medium max-w-[180px]">
                  {current.statLabel}
                </div>
              </div>
            </div>

            {/* Right Card: Interactive Visual Preview */}
            <div className="lg:col-span-6 bg-[#090716] rounded-3xl p-6 md:p-8 text-white border border-[#231E4D] shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-[#1E193C] pb-3">
                <div className="text-xs font-mono text-gray-400">{current.visualTitle}</div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20 font-bold">
                  LIVE STREAM
                </span>
              </div>

              <div className="space-y-3">
                {current.visualDetails.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#14102E] border border-[#2D2654] flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white">{item.client}</div>
                      <div className="text-xs text-amber-400 font-mono mt-0.5">{item.status}</div>
                    </div>
                    <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                      {item.metrics}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[11px] text-gray-500 text-center font-mono">
                Automated multi-agent execution thread #8921
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
