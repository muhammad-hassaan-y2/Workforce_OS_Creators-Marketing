// Millo Platform Constants & Content Configuration
// [PLACEHOLDER — Brand name can be swapped easily here]
export const BRAND_NAME = "Millo";

export const NAV_LINKS = [
  { name: "Product", href: "#hero" },
  { name: "Agents", href: "#agents" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "CLI Install", href: "#cli" },
  { name: "Use Cases", href: "#use-cases" },
  { name: "Playground", href: "#playground" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export const TRUSTED_AGENCIES = [
  { name: "CreatorScale", logoText: "CREATOR SCALE" },
  { name: "Apex Revenue", logoText: "APEX REVENUE" },
  { name: "MediaHive", logoText: "MEDIA HIVE" },
  { name: "GrowthScale", logoText: "GROWTH SCALE" },
  { name: "StudioVibe", logoText: "STUDIO VIBE" },
  { name: "OutboundLabs", logoText: "OUTBOUND LABS" },
];

// Pain points & problem agitation stats
export const AGITATION_STATS = [
  {
    // [PLACEHOLDER — replace with real data]
    value: "64%",
    label: "Capacity Lost to Admin",
    description: "Agencies and top creators spend over 60% of their week on manual prospecting, sponsor DMs, form filling, and lead qualification.",
  },
  {
    // [PLACEHOLDER — replace with real data]
    value: "< 4 min",
    label: "Lead Decay Window",
    description: "Sponsor inquiries and high-intent inbound leads drop 8x in conversion probability if not answered within 5 minutes.",
  },
  {
    // [PLACEHOLDER — replace with real data]
    value: "3.2x",
    label: "Higher Operational Margin",
    description: "Replacing manual VAs and SDR busywork with autonomous agents scales output without adding linear headcount.",
  },
];

// Core agents details
export const AGENTS = [
  {
    id: "caller",
    name: "Phone Caller Agent",
    tagline: "Natural Voice Outreach & Brand Negotiations",
    description: "Places and receives calls with sub-350ms neural speech latency. Qualifies agency prospects, filters high-ticket sponsor inquiries, books calendar demos, and logs outcomes directly to your CRM.",
    capabilities: [
      "Sub-350ms human-like neural conversational voice engine",
      "Dynamic objection handling, brand deal qualification & meeting booking",
      "Automatic call recordings, transcript sentiment tagging & CRM sync",
    ],
    previewType: "call",
    previewData: {
      leadName: "Sarah Jenkins",
      leadCompany: "SaaSify Inc.",
      status: "Call In Progress",
      duration: "01:42",
      transcript: [
        { speaker: "Agent", text: "Hi Sarah, I saw your brand was looking for tech creator partnerships this quarter. Are you accepting media kit proposals?" },
        { speaker: "Lead", text: "We are! We're looking for YouTube and newsletter integrations for Q3." },
        { speaker: "Agent", text: "Awesome. Millo agents handle our media kit distribution and lock in guaranteed CPM rates. Can I send over our rate sheet for Thursday?" },
        { speaker: "Lead", text: "Send over the invite and rate card, Thursday works great." }
      ]
    }
  },
  {
    id: "browser",
    name: "Browser Control Agent",
    tagline: "Autonomous Web Navigation, DM Automation & Scraping",
    description: "Operates an isolated real browser session to scrape niche lead directories, auto-reply to sponsor contact forms, manage ad dashboards, and cross-post content across social platforms.",
    capabilities: [
      "DOM-aware browser navigation bypassing anti-bot obstacles",
      "Real-time lead list enrichment & creator sponsor outreach",
      "Automated web form submissions & multi-platform social management",
    ],
    previewType: "browser",
    previewData: {
      targetUrl: "https://linkedin.com/sales/search/people",
      activeTask: "Enriching Prospect Profiles",
      stats: "142 profiles parsed | 98.4% verified emails",
      actions: [
        "[09:14:02] Navigated to Brand Marketing Directory",
        "[09:14:05] Extracted 25 VP Marketing contact cards",
        "[09:14:08] Verified work emails via SMTP handshake",
        "[09:14:11] Exported JSON record to Orchestration Bus"
      ]
    }
  },
  {
    id: "cli",
    name: "CLI / Ops Agent",
    tagline: "Terminal Automation, Pipeline Glue & Video Ops",
    description: "Executes backend scripts, handles automated video rendering pipelines, runs bulk CRM sync jobs, compiles media kit analytics, and triggers serverless webhooks on schedule.",
    capabilities: [
      "Headless bash & python execution environment",
      "Automated video rendering pipelines & analytics aggregation",
      "Custom API webhook routing & automated performance reports",
    ],
    previewType: "cli",
    previewData: {
      command: "orbital-ops sync --source sponsor-inquiries --dest hubspot-crm --dialer active",
      output: [
        "[INFO] Initializing Millo Ops Execution Bus v2.4",
        "[SUCCESS] Synced 142 enriched contacts to HubSpot CRM pipeline",
        "[TRIGGER] Dispatched lead payload to Phone Caller Agent [Queue ID: #8921]",
        "[STATUS] Campaign & content automation cycle completed in 1.24s"
      ]
    }
  }
];

export const EXTENSIBLE_CARD = {
  title: "Extensible Architecture",
  description: "Need custom agent logic for complex client workflows or creator pipelines? Build custom skills in Python or TypeScript with custom triggers, API webhooks, and memory modules.",
  badge: "SDK & Webhooks Ready",
};

// Orchestration workflow steps for "The Hero Moment"
export const ORCHESTRATION_STEPS = [
  {
    step: 1,
    agent: "Browser Control Agent",
    title: "1. Prospect Discovery & Sponsor Scrape",
    description: "Scrapes high-intent decision makers & brand managers from target sites, verifies email/phone credentials, and builds enriched lead records.",
    detail: "Extracted VP of Marketing & Brand Partnerships direct contact info.",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: "Globe"
  },
  {
    step: 2,
    agent: "Phone Caller Agent",
    title: "2. Immediate Speed-to-Lead Dialing",
    description: "Initiates phone outreach within seconds of prospect identification, conducts initial qualification, and secures a calendar spot.",
    detail: "Call completed in 2m 14s. Qualified B2B budget, locked in brand demo.",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    icon: "PhoneCall"
  },
  {
    step: 3,
    agent: "CLI / Ops Agent",
    title: "3. Automated CRM Log & Ops Trigger",
    description: "Logs full call recording & transcript to CRM, pushes meeting invite, and triggers video asset & email follow-up sequence.",
    detail: "HubSpot deal updated to 'Sponsor Meeting Booked'. Media kit dispatched.",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: "Terminal"
  }
];

// Proof / Metrics stats
// [PLACEHOLDER — replace with real data]
export const PROOF_METRICS = [
  {
    value: "1.4M+",
    label: "Calls Placed & Qualified",
    subtext: "Across 220+ active agency & creator accounts"
  },
  {
    value: "84%",
    label: "Average CAC Reduction",
    subtext: "Compared to traditional manual SDR & VA teams"
  },
  {
    value: "< 45s",
    label: "Speed-to-Lead Response",
    subtext: "Instant inbound qualification calls 24/7"
  },
  {
    value: "99.9%",
    label: "Workflow Uptime",
    subtext: "Enterprise compliance & fallback guardrails"
  }
];

// Testimonials
// [PLACEHOLDER — replace with real data]
export const TESTIMONIALS = [
  {
    quote: "Millo replaced 4 full-time offshore VAs and tripled our outbound qualification volume in 30 days. Our team now focuses 100% on high-ticket closing.",
    author: "Marcus Vance",
    role: "Founder & Managing Director",
    company: "Vance Growth Media",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "As a creator studio managing 12 tech channels, Millo's Browser and Caller agents handle all brand deal inquiries and media kit outreach. We booked $140k in sponsorships effortlessly.",
    author: "Elena Rostova",
    role: "Creator & Studio Director",
    company: "MediaHive Studios",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "The multi-agent handoff is magic. Having the Browser Agent pull leads straight into the Phone Agent's queue without manual CSV uploads saved us 25 hours every single week.",
    author: "David Chen",
    role: "Partner & Chief Revenue Officer",
    company: "Apex B2B Agency",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  }
];

// Integrations
export const INTEGRATIONS = [
  { name: "HubSpot", category: "CRM" },
  { name: "Salesforce", category: "CRM" },
  { name: "GoHighLevel", category: "Agency CRM" },
  { name: "YouTube", category: "Content Platform" },
  { name: "Instagram", category: "Social / DMs" },
  { name: "Twilio", category: "Telephony" },
  { name: "Zapier", category: "Automation" },
  { name: "LinkedIn", category: "Data Source" },
  { name: "Slack", category: "Alerts" },
  { name: "Make", category: "Webhooks" },
  { name: "PostgreSQL", category: "Database" },
  { name: "TikTok", category: "Social Platform" },
];

// Pricing Plans
// [PLACEHOLDER — replace with real data]
export const PRICING_PLANS = [
  {
    name: "Creator & Solopreneur",
    price: "$299",
    period: "/month",
    description: "Designed for content creators, influencers, and solo RevOps operators.",
    badge: null,
    highlight: false,
    features: [
      "Up to 1,000 active call minutes / month",
      "3 concurrent Browser Agent sessions",
      "Automated sponsor inquiry qualification",
      "Social media post & DM automation",
      "Standard voice latency (<500ms)",
      "Community Discord & Email support",
    ],
    cta: "Start 14-Day Free Trial",
  },
  {
    name: "Growth Agency & Studio",
    price: "$1,299",
    period: "/month",
    description: "Designed for scaling sales agencies and creator studios running multi-channel outbound.",
    badge: "MOST POPULAR",
    highlight: true,
    features: [
      "Up to 8,000 active call minutes / month",
      "25 concurrent Browser Agent sessions",
      "Full Orchestration Engine (Multi-Agent Workflows)",
      "Ultra-low voice latency (<350ms)",
      "Custom Script & Objection Builder",
      "Dedicated Slack Connect channel & Priority SLA",
    ],
    cta: "Deploy Operating System",
  },
  {
    name: "Enterprise & Network",
    price: "Custom",
    period: "",
    description: "Dedicated server nodes, white-label portals, and custom agent engineering.",
    badge: "WHITE LABEL",
    highlight: false,
    features: [
      "Unlimited custom agent capacity & call minutes",
      "Dedicated sovereign cloud infrastructure",
      "Custom CLI/Ops integration development",
      "HIPAA / SOC2 Type II compliance controls",
      "White-label client & creator reporting dashboard",
      "1-on-1 RevOps engineering onboarding",
    ],
    cta: "Contact Enterprise Sales",
  }
];

// FAQ Items
export const FAQ_ITEMS = [
  {
    question: "Is Millo built for Creators & Influencers as well as Agencies?",
    answer: "Yes! Millo is designed for both sales/marketing agencies and digital creators/influencer studios. Creators deploy Browser Agents to automate sponsor outreach and social posting, Phone Agents to handle inbound brand inquiry calls, and CLI Agents to compile media kit analytics."
  },
  {
    question: "How reliable are the voice calls, and how does it handle tough objections?",
    answer: "Millo's Phone Caller Agent runs on an ultra-low latency (<350ms) neural speech engine trained specifically on sales and sponsorship conversations. It understands context, pauses naturally when interrupted, and pulls from your custom objection guardrails to navigate pushback smoothly."
  },
  {
    question: "What safety guardrails prevent agents from making mistakes with clients or sponsors?",
    answer: "You retain total oversight. You can set strict confidence thresholds, dollar-cap boundaries, human-in-the-loop review triggers for specific actions, and emergency kill-switches per client or channel workspace."
  },
  {
    question: "Is call recording and consent handled in compliance with laws?",
    answer: "Yes. Millo automatically detects the state/country code of the recipient and dynamically includes required call recording consent disclaimers (one-party or two-party consent compliance) before beginning qualification."
  },
  {
    question: "How long does it take to integrate Millo with our current CRM and social stack?",
    answer: "Most users complete setup in under 30 minutes. Millo features 1-click native integrations for HubSpot, Salesforce, GoHighLevel, Close, YouTube, Instagram, and custom webhook endpoints."
  },
  {
    question: "Can we add custom agents or proprietary API integrations?",
    answer: "Absolutely. Orbital is engineered as an extensible agent OS. Using our Python/TypeScript SDK or CLI Agent, your technical team can wrap any custom REST API or internal model as a new agent type."
  },
  {
    question: "What happens if a browser agent encounters a captcha or unexpected UI change?",
    answer: "Our Browser Agent uses dynamic visual layout parsing rather than fragile CSS selectors. If it encounters a high-friction obstacle like a captcha, it automatically routes a notification to a human operator or executes an intelligent fallback path."
  }
];
