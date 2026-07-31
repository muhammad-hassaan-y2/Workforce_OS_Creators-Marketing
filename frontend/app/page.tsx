import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import TrustStrip from "@/components/sections/TrustStrip";
import ProblemAgitation from "@/components/sections/ProblemAgitation";
import CoreAgents from "@/components/sections/CoreAgents";
import OrchestrationShowcase from "@/components/sections/OrchestrationShowcase";
import CLISection from "@/components/sections/CLISection";
import AgentChatInterface from "@/components/AgentChatInterface";
import UseCases from "@/components/sections/UseCases";
import AgentPlayground from "@/components/sections/AgentPlayground";
import MetricsBar from "@/components/sections/MetricsBar";
import Testimonials from "@/components/sections/Testimonials";
import Integrations from "@/components/sections/Integrations";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#0B0B0F] overflow-x-hidden selection:bg-purple-600 selection:text-white">
      {/* 1. Sticky Glassmorphic Navigation */}
      <Navigation />

      {/* 2. Hero (Dark #0B0B0F) */}
      <Hero />

      {/* 3. Logo / Trust Strip (Light #FAFAFA) */}
      <TrustStrip />

      {/* 4. Problem / Agitation (Dark #0B0B0F) */}
      <ProblemAgitation />

      {/* 5. Core Agents Feature Grid (Light #FAFAFA) */}
      <CoreAgents />

      {/* 6. Multi-Agent Orchestration Showcase (Dark #0B0B0F — "The Hero Moment") */}
      <OrchestrationShowcase />

      {/* 7. Developer CLI & NPM Workforce Installation Section (Dark #0B0B0F) */}
      <CLISection />

      {/* 8. Interactive Conversational AI Agent Interface (Dark #0B0B0F) */}
      <AgentChatInterface />

      {/* 9. Use Cases by Role (Light #FAFAFA — 4 Tabs for Creators, Agencies, Sales, Marketing) */}
      <UseCases />

      {/* 10. Interactive Agent Simulator & Playground (Dark #0B0B0F) */}
      <AgentPlayground />

      {/* 11. Metrics / Proof Bar (Dark #0B0B0F) */}
      <MetricsBar />

      {/* 12. Testimonials (Light #FAFAFA) */}
      <Testimonials />

      {/* 13. Integrations Strip (Dark #0B0B0F) */}
      <Integrations />

      {/* 14. Pricing (Light #FAFAFA) */}
      <Pricing />

      {/* 15. FAQ Accordion (Dark #0B0B0F) */}
      <FAQ />

      {/* 16. Final CTA Banner (Dark #0B0B0F) */}
      <FinalCTA />

      {/* 17. Footer (Dark #0B0B0F) */}
      <Footer />
    </main>
  );
}
