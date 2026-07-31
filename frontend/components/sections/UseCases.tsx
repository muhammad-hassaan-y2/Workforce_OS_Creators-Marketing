"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, TrendingUp, Megaphone, Sparkles, CheckCircle2, Video, Target } from "lucide-react";

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
        "Free your closers to focus exclusively on live prospect conversations. Orbital agents handle all initial outreach, cold dialing, objection filtering, and appointment booking.",
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
    <section id="use-cases" className="py-24 md:py-32 bg-[#FAFAFA] border-t border-[#ECECEF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" />
            WORKFLOW ADAPTABILITY
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0B0B0F] leading-tight">
            Tailored outcomes for Agencies, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
              Creators & Growth Teams.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#52525B]">
            Select your operating role to see how Orbital transforms daily output.
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
                className={`px-5 py-3 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? "bg-[#0B0B0F] text-white shadow-lg shadow-black/10 scale-105"
                    : "bg-white text-[#52525B] border border-[#ECECEF] hover:border-purple-300"
                }`}
              >
                <tabObj.icon className={`w-4 h-4 ${isActive ? "text-purple-400" : "text-gray-500"}`} />
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
            <div className="lg:col-span-6 bg-white rounded-[24px] border border-[#ECECEF] p-8 md:p-10 shadow-xs space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-semibold">
                {current.badge}
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-[#0B0B0F] tracking-tight">
                {current.title}
              </h3>

              <p className="text-base text-[#52525B] leading-relaxed">
                {current.description}
              </p>

              <div className="space-y-3 pt-2">
                {current.bullets.map((b, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-3 text-sm text-[#0B0B0F] font-medium">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {/* Big Stat Highlight inside Tab */}
              <div className="pt-6 border-t border-[#ECECEF] flex items-center gap-4">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  {current.stat}
                </div>
                <div className="text-xs text-[#52525B] font-medium max-w-[180px]">
                  {current.statLabel}
                </div>
              </div>
            </div>

            {/* Right Card: Interactive Visual Preview */}
            <div className="lg:col-span-6 bg-[#0B0B0F] rounded-[24px] p-6 md:p-8 text-white border border-[#22222E] shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div className="text-xs font-mono text-gray-400">{current.visualTitle}</div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                  LIVE STREAM
                </span>
              </div>

              <div className="space-y-3">
                {current.visualDetails.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#141419] border border-[#22222E] flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white">{item.client}</div>
                      <div className="text-xs text-purple-400 font-mono mt-0.5">{item.status}</div>
                    </div>
                    <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                      {item.metrics}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-xs text-gray-400 text-center font-mono">
                Automated multi-agent execution thread #8921
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
