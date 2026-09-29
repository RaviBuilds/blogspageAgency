/**
 * Web Design Service copy deck & canonical data model.
 * Scope: /services/web-design
 *
 * Single source of truth for all copy, structured data, process steps,
 * industry showcase links, proof projects, and FAQ entries for the
 * Web Design service page.
 *
 * Authorities:
 * - docs/canonical/BLOGSPAGE_AI_WEB_DESIGN_SERVICE_CANONICAL_BLUEPRINT_v1.5.md
 * - docs/canonical/BLOGSPAGE_AI_WEB_DESIGN_SERVICE_VISUAL_DESIGN_SYSTEM_v1.0.md
 * - docs/canonical/BLOGSPAGE_AI_WEB_DESIGN_SERVICE_COMPONENT_ARCHITECTURE_v1.0.md
 *
 * Pure module: no React, no I/O, no framework imports.
 */

import type { FaqPair } from "@/lib/structured-data";

/* -------------------------------------------------------------------------- */
/* Data Interfaces                                                            */
/* -------------------------------------------------------------------------- */

export interface MetaDataContract {
  path: string;
  title: string;
  description: string;
  keywordPhrase: string;
}

export interface HeroDataContract {
  eyebrow: string;
  h1: string;
  subhead: string;
  lead: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  microcopy: string;
  pillarsSummary: readonly {
    label: string;
    percentage: string;
    accent: "blue" | "cyan" | "violet";
  }[];
}

export interface ProblemCard {
  id: string;
  title: string;
  description: string;
  iconName: "LayoutTemplate" | "MapPinOff" | "Smartphone";
}

export interface PillarCard {
  id: string;
  percentage: string;
  title: string;
  role: string;
  description: string;
  capabilities: readonly string[];
  accent: "blue" | "cyan" | "violet";
}

export interface DesignCapability {
  id: string;
  title: string;
  description: string;
  tag: string;
}

export interface BrandElement {
  id: string;
  title: string;
  description: string;
}

export interface LocalVisibilityItem {
  id: string;
  title: string;
  description: string;
}

export interface LaunchInfrastructureItem {
  id: string;
  title: string;
  description: string;
}

export interface IndustryShowcaseItem {
  id: string;
  name: string;
  route: string;
  focus: string;
  description: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  deliverable: string;
}

export interface ProofProject {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  route: string;
  routeLabel: string;
  status: "VERIFIED FACT";
}

export interface FinalCtaContract {
  h3: string;
  lead: string;
  buttonLabel: string;
  microcopy: string;
}

/* -------------------------------------------------------------------------- */
/* 1. SEO Metadata Contract                                                   */
/* -------------------------------------------------------------------------- */

export const WEB_DESIGN_META: MetaDataContract = {
  path: "/services/web-design",
  title: "Web Design Agency Hyderabad | Blogspage AI",
  description:
    "Blogspage AI is a web design agency in Hyderabad designing high-converting, responsive websites, digital brand systems, and local launch foundations.",
  keywordPhrase: "web design agency Hyderabad",
};

/* -------------------------------------------------------------------------- */
/* 2. Hero Data Contract (Section 1)                                          */
/* -------------------------------------------------------------------------- */

export const WEB_DESIGN_HERO: HeroDataContract = {
  eyebrow: "WEB DESIGN AGENCY HYDERABAD · BRAND & DIGITAL PRESENCE",
  h1: "Premium Website Design for Hyderabad Businesses",
  subhead: "Designed for conversion, branded for trust, built to launch properly.",
  lead: "We design high-converting, custom websites for growing businesses in Hyderabad. Every project combines conversion-oriented UI/UX design (70%), digital brand consistency (20%), and the foundational local visibility and launch infrastructure (10%) required to turn visitors into enquiries.",
  primaryCtaLabel: "Start Your Website Project",
  secondaryCtaLabel: "Explore Design Scope",
  microcopy: "Instant consultation with Sweety, our AI Business Consultant · No high-pressure sales calls · 100% transparent guidance.",
  pillarsSummary: [
    { label: "Core Web Design", percentage: "70%", accent: "blue" },
    { label: "Brand Presentation", percentage: "20%", accent: "violet" },
    { label: "Launch Foundation", percentage: "10%", accent: "cyan" },
  ],
};

/* -------------------------------------------------------------------------- */
/* 3. Business Problems Data Contract (Section 2)                             */
/* -------------------------------------------------------------------------- */

export const WEB_DESIGN_PROBLEMS = {
  eyebrow: "THE COMMON PITFALLS",
  h2: "Why Most Business Websites Fail to Generate Real Revenue",
  lead: "Most business websites look like cookie-cutter templates, hide on page four of Google, fail on mobile devices, or give prospective customers no clear reason to reach out.",
  cards: [
    {
      id: "template-trap",
      title: "Uninspired, Generic Template Layouts",
      description:
        "Stock themes bloated with unused code, awkward layouts, and stock photography fail to build authentic trust or communicate your business's true positioning.",
      iconName: "LayoutTemplate",
    },
    {
      id: "missing-local",
      title: "Disconnected From Local Search & Discovery",
      description:
        "A visually passable website that is unindexed in Google Search Console, disconnected from Google Business Profile, and missing local structured data remains invisible to nearby buyers.",
      iconName: "MapPinOff",
    },
    {
      id: "conversion-friction",
      title: "Friction-Heavy Mobile & Enquiry Journeys",
      description:
        "Most local customers search for you on their phone first. Cluttered navigation, sluggish load speeds, and buried contact pathways lose prospective clients before they ever reach your offer.",
      iconName: "Smartphone",
    },
  ] as const,
};
/* -------------------------------------------------------------------------- */
/* 4. Core Positioning (70/20/10) Data Contract (Section 3)                   */
/* -------------------------------------------------------------------------- */

export const WEB_DESIGN_CORE_POSITIONING = {
  eyebrow: "OUR METHODOLOGY",
  h2: "The 70 / 20 / 10 Digital Presence System",
  lead: "We do not isolate design from business infrastructure. We weight our engagements with precision: 70% UX/UI Design, 20% Brand Harmonization, and 10% Local Visibility & Launch Readiness.",
  supportingCopy:
    "This structure ensures your website is neither an unbranded engineering template nor an impractical art project, but an operating commercial asset.",
  pillars: [
    {
      id: "web-design",
      percentage: "70%",
      title: "Core Web Design & Architecture",
      role: "PRIMARY SERVICE",
      description:
        "Custom Figma wireframes, user journeys, responsive UI design, conversion pathways, and content hierarchy.",
      capabilities: [
        "UX Strategy & Information Architecture",
        "Custom Desktop & Mobile UI Design",
        "Thumb-Friendly Responsive Layouts",
        "Conversion-Optimized Page Flows",
        "Legacy Website Redesign",
        "CMS & Performance-Aware Structures",
      ],
      accent: "blue",
    },
    {
      id: "branding",
      percentage: "20%",
      title: "Brand Presentation & Consistency",
      role: "SUPPORTING PILLAR",
      description:
        "Digital typography selection, accessible high-contrast color token systems, logo placement guidelines, and visual alignment.",
      capabilities: [
        "Web Typography Hierarchy",
        "Accessible Color Token Palettes",
        "Digital Logo Preparation & Assets",
        "Visual Consistency Across Pages",
      ],
      accent: "violet",
    },
    {
      id: "local-launch",
      percentage: "10%",
      title: "Local Visibility & Launch Infrastructure",
      role: "SUPPORTING FOUNDATION",
      description:
        "Google Business Profile setup, Google Search Console verification, NAP consistency, domain, SSL, and reliable production hosting.",
      capabilities: [
        "Google Business Profile Alignment",
        "Google Search Console Verification",
        "NAP Consistency Verification",
        "Local Structured Data Schema",
        "Domain DNS & Fast Edge Hosting",
        "Automated HTTPS / SSL Encryption",
      ],
      accent: "cyan",
    },
  ] as const,
};

/* -------------------------------------------------------------------------- */
/* 5. Web Design Pillar Data Contract (Section 4 — 70%)                       */
/* -------------------------------------------------------------------------- */

export const WEB_DESIGN_PILLAR = {
  eyebrow: "CORE SERVICE (70%)",
  h2: "Website Design Built Around Commercial Conversion",
  lead: "Custom, research-backed interface design crafted in Figma and engineered to turn visitors into active clients.",
  capabilities: [
    {
      id: "ux-ia",
      title: "UX Strategy & Information Architecture",
      description:
        "Structuring page flows, navigation hierarchies, and content blocks so visitors find answers, service scopes, and proof within seconds.",
      tag: "Navigation & Flow",
    },
    {
      id: "figma-ui",
      title: "Figma-Crafted, Custom Interface Design",
      description:
        "Tailored, bespoke visual design systems crafted specifically for your business. No purchased themes, no bloated visual builders.",
      tag: "Bespoke Design",
    },
    {
      id: "mobile-first",
      title: "Mobile-First Responsive Layouts",
      description:
        "Tested for thumb-friendly mobile navigation, readable font scales, and fluid responsive behavior across smartphones, tablets, and wide screens.",
      tag: "Responsiveness",
    },
    {
      id: "conversion-paths",
      title: "Strategic Conversion Pathways",
      description:
        "Deliberate CTA placement, reduced friction touchpoints, value proposition clarity, and frictionless qualification channels.",
      tag: "Conversion",
    },
    {
      id: "redesign",
      title: "Legacy Website Redesign",
      description:
        "Transforming outdated, slow, or poorly converting legacy websites into modern, trustworthy, high-performing digital flagships.",
      tag: "Modernization",
    },
    {
      id: "cms-performance",
      title: "Content-Ready & Performance-Aware",
      description:
        "Designing clean, modular sections ready for seamless content updates and modern edge-rendered hosting without visual degradation.",
      tag: "Maintainability",
    },
  ] as const,
  ctaLabel: "Discuss Your Website Design",
};

/* -------------------------------------------------------------------------- */
/* 6. Branding Pillar Data Contract (Section 5 — 20%)                         */
/* -------------------------------------------------------------------------- */

export const WEB_DESIGN_BRANDING = {
  eyebrow: "SUPPORTING PILLAR (20%)",
  h2: "Digital Brand Presentation & Visual Consistency",
  lead: "Your website is your primary digital office. We establish cohesive typography, color scales, and visual rules so your brand speaks with authority.",
  elements: [
    {
      id: "typography",
      title: "Web Typography & Hierarchy",
      description:
        "Pairing modern, highly legible editorial and display typefaces that establish clear visual authority and optimal reading comfort across all devices.",
    },
    {
      id: "color-systems",
      title: "Accessible Color Token Systems",
      description:
        "Establishing primary, secondary, and accent palettes with strict WCAG AA contrast compliance to highlight critical actions and guide the eye naturally.",
    },
    {
      id: "logo-application",
      title: "Logo Usage & Asset Guidance",
      description:
        "Preparing your existing logo marks for crisp SVG rendering, favicon generation, retina displays, and clean integration into dark and light backgrounds.",
    },
    {
      id: "brand-alignment",
      title: "Digital Brand Language Consistency",
      description:
        "Ensuring that visual assets, imagery styles, and design treatments on your website align seamlessly with your digital presence.",
    },
  ] as const,
  boundaryNote: {
    title: "Scope Clarity on Brand Services:",
    text: "We apply and refine your brand system for the web. Full brand naming, 100-page corporate brand books, and ground-up logo creation are separate engagements.",
  },
};

/* -------------------------------------------------------------------------- */
/* 7. Local Visibility Data Contract (Section 6 — 10% Part A)                 */
/* -------------------------------------------------------------------------- */

export const WEB_DESIGN_LOCAL_VISIBILITY = {
  eyebrow: "LAUNCH VISIBILITY (10% - PART A)",
  h2: "Local Visibility Foundation for Hyderabad Businesses",
  lead: "A website must be discoverable where your local customers search. We configure your initial local search foundation so you are visible on Google Maps and search results from day one.",
  items: [
    {
      id: "gbp-setup",
      title: "Google Business Profile Setup & Optimization",
      description:
        "Configuring business categories, operating hours, service areas, and direct website appointment/inquiry links to maximize local pack visibility.",
    },
    {
      id: "search-console",
      title: "Search Console & Indexation Setup",
      description:
        "Verifying property ownership, configuring clean XML sitemaps, and requesting initial crawl coverage to ensure rapid search engine discovery.",
    },
    {
      id: "nap-accuracy",
      title: "NAP Accuracy & Local Trust Signals",
      description:
        "Standardizing business Name, Address, and Phone details across site headers, footers, contact endpoints, and search records.",
    },
    {
      id: "local-schema",
      title: "Local Schema & Directory Orientation",
      description:
        "Implementing structured schema markup and providing guidance on relevant industry-specific directories (such as Practo for healthcare or Justdial where applicable).",
    },
  ] as const,
  boundaryNote: {
    title: "Launch Foundation vs. Ongoing Retainer:",
    text: "This is a comprehensive launch-readiness setup. Ongoing monthly backlink outreach, daily ranking tracking, and active citation campaigns belong to separate ongoing SEO services.",
  },
};

/* -------------------------------------------------------------------------- */
/* 8. Digital Launch Foundation Data Contract (Section 7 — 10% Part B)        */
/* -------------------------------------------------------------------------- */

export const WEB_DESIGN_LAUNCH_FOUNDATION = {
  eyebrow: "LAUNCH INFRASTRUCTURE (10% - PART B)",
  h2: "Complete Digital Launch & Deployment Infrastructure",
  lead: "We eliminate the technical confusion of launching a website. Domain, hosting, security, and email are configured properly with 100% client ownership.",
  items: [
    {
      id: "domain-dns",
      title: "Domain Setup & DNS Routing",
      description:
        "Assisting with domain procurement, DNS record propagation (A, CNAME, TXT), and ensuring domain ownership remains strictly in your name.",
    },
    {
      id: "edge-hosting",
      title: "Fast Production Edge Hosting",
      description:
        "Deploying to global edge networks ensuring instantaneous page loads, high availability, and automated deployment pipelines.",
    },
    {
      id: "https-ssl",
      title: "HTTPS Encryption & Basic Security",
      description:
        "Automated SSL certificate provisioning, strict transport security headers, and fundamental protection against malicious traffic.",
    },
    {
      id: "business-email",
      title: "Business Email Configuration",
      description:
        "Guiding and verifying DNS records (MX, SPF, DKIM, DMARC) for Google Workspace or Microsoft 365 to ensure high email deliverability.",
    },
    {
      id: "analytics-baseline",
      title: "Privacy-Friendly Traffic Analytics",
      description:
        "Initializing lightweight analytics to track visitor traffic, top referral sources, and page popularity without tracking cookies.",
    },
    {
      id: "full-ownership",
      title: "Total Ownership & No Lock-In",
      description:
        "Every asset, account, and configuration is handed over directly to you. You maintain full administrative ownership without proprietary agency lock-in.",
    },
  ] as const,
  ownershipNote:
    "Domain registrations and third-party hosting accounts are billed directly by their respective providers to preserve your full ownership upon renewal.",
};

/* -------------------------------------------------------------------------- */
/* 9. Industry Showcase Router Data Contract (Section 8)                      */
/* -------------------------------------------------------------------------- */

/*
 * ROUTE CONTRACT — every `route` below must be a path the site actually serves.
 *
 * Each `id` here is deliberately the same token as the corresponding `Niche.id`
 * in `src/lib/niches.ts`, but the `route` string is NOT derived from it: this
 * module is a pure data contract and `niches.ts` carries Lucide icon *values*,
 * so importing it here would pull React components into a module that must stay
 * framework-free.
 *
 * The cost of that separation is that a slug can drift from the registry
 * silently — and it did. Three of the ten routes below shipped as paths no
 * generator produces, so three tiles in the industry gallery 404'd:
 *
 *   food-delivery-business-solution-...    → online-delivery-business-solution-...
 *   consulting-agency-business-solution-…  → consulting-firm-business-solution-...
 *   pet-care-business-solution-...         → pet-cares-online-business-solution-...
 *
 * They survived a visual pass, a build and an SSR audit because none of those
 * resolve an `href` against the route registry — a `<Link>` to a non-existent
 * route is valid JSX, type-checks, renders and only fails when a visitor clicks.
 *
 * `tests/unit/web-design-routes.spec.ts` now resolves every route in this file
 * against `ALL_ROUTES`, which is the only check that can catch this class.
 */
export const WEB_DESIGN_INDUSTRY_ROUTER = {
  eyebrow: "TAILORED INDUSTRY SOLUTIONS",
  h2: "Web Design Architectures Engineered for Your Industry",
  lead: "While our design standards remain universal, conversion pathways vary by industry. Explore our specialized solutions designed for specific commercial verticals.",
  supportingCopy:
    "Looking for specific operational workflows like patient bookings or member portals? View our industry-specific solution blueprints.",
  industries: [
    {
      id: "dental-medical",
      name: "Dental & Medical",
      route: "/solutions/dental-hospital-business-solution-website-at-hyderabad",
      focus: "Patient Trust & Consultations",
      description:
        "Frictionless patient pipeline, procedure trust indicators, and structured enquiry workflows.",
    },
    {
      id: "gym-fitness",
      name: "Gym & Fitness",
      route: "/solutions/gym-business-solution-website-at-hyderabad",
      focus: "Member Onboarding & Tours",
      description:
        "Member trial signups, facility tour scheduling, class timetables, and churn defense.",
    },
    {
      id: "hotel-booking",
      name: "Hotel Booking",
      route: "/solutions/hotel-booking-business-solution-website-at-hyderabad",
      focus: "Direct Guest Reservations",
      description:
        "Direct booking conversion, room showcase layouts, and OTA commission mitigation.",
    },
    {
      id: "online-delivery",
      name: "Online Food Delivery",
      route: "/solutions/online-delivery-business-solution-website-at-hyderabad",
      focus: "Direct Local Orders",
      description:
        "Local ordering storefront, categorized menu displays, and direct customer relationships.",
    },
    {
      id: "consulting",
      name: "Consulting & Agencies",
      route: "/solutions/consulting-firm-business-solution-website-at-hyderabad",
      focus: "Authority & Inbound Leads",
      description:
        "High-value authority positioning, structured case study proof, and qualified lead intake.",
    },
    {
      id: "education",
      name: "Educational Platforms",
      route: "/solutions/educational-platform-business-solution-website-at-hyderabad",
      focus: "Admissions & Inquiries",
      description:
        "Curriculum overviews, student registration workflows, and institutional authority.",
    },
    {
      id: "pet-care",
      name: "Pet Care & Clinics",
      route: "/solutions/pet-cares-online-business-solution-website-at-hyderabad",
      focus: "Service Booking & Care",
      description:
        "Service clarity, veterinary/grooming appointment bookings, and compassionate trust signals.",
    },
    {
      id: "ecommerce",
      name: "E-commerce Brands",
      route: "/solutions/product-selling-online-ecommerce-website-at-hyderabad",
      focus: "Catalog & Checkout Flow",
      description:
        "High-converting catalog layouts, mobile-optimized checkout, and product storytelling.",
    },
    {
      id: "saas-platform",
      name: "SaaS Platforms",
      route: "/solutions/subscription-saas-business-website-at-hyderabad",
      focus: "Trial & Product Discovery",
      description:
        "Feature breakdown grids, pricing tier comparisons, and interactive product demo journeys.",
    },
    {
      id: "seo-blogs",
      name: "SEO & Content Blogs",
      route: "/solutions/seo-enabled-blogs-website-at-hyderabad",
      focus: "Reading Speed & Discovery",
      description:
        "Edge-delivered reading canvas, Core Web Vitals preservation, and organic search indexation.",
    },
  ] as const,
};

/* -------------------------------------------------------------------------- */
/* 10. Process Data Contract (Section 9)                                      */
/* -------------------------------------------------------------------------- */

export const WEB_DESIGN_PROCESS = {
  eyebrow: "HOW WE WORK",
  h2: "Our 5-Stage Web Design & Launch Process",
  lead: "A disciplined progression from strategic discovery to a live, verified launch.",
  steps: [
    {
      step: "01",
      title: "Discovery & Information Architecture",
      description:
        "We analyze your business model, customer questions, and competitive landscape to establish sitemaps, page goals, and content strategy.",
      deliverable: "Sitemap & Content Flow Architecture",
    },
    {
      step: "02",
      title: "UX Flow & Low-Fidelity Wireframes",
      description:
        "We map out user pathways and mobile touch targets to establish friction-free conversion journeys before touching colors or visual styling.",
      deliverable: "Interactive Structural Wireframes",
    },
    {
      step: "03",
      title: "High-Fidelity UI Design in Figma",
      description:
        "We craft custom, bespoke visual layouts incorporating refined typography, accessible color token scales, real copy, and custom component states.",
      deliverable: "Complete Desktop & Mobile Figma UI System",
    },
    {
      step: "04",
      title: "Design Review & Technical Preparation",
      description:
        "We conduct collaborative design walkthroughs, refine details based on your feedback, optimize image assets, and prepare hosting and DNS infrastructure.",
      deliverable: "Approved Design System & Deployment Plan",
    },
    {
      step: "05",
      title: "Launch & Local Foundation Handover",
      description:
        "We deploy the website to production edge hosting, configure SSL encryption, verify Google Search Console, and align your Google Business Profile.",
      deliverable: "Live Commercial Website + Verified Local Footprint",
    },
  ] as const,
};

/* -------------------------------------------------------------------------- */
/* 11. Proof / Project Data Contract (Section 10)                             */
/* -------------------------------------------------------------------------- */

export const WEB_DESIGN_PROOF = {
  eyebrow: "DELIVERED WORK",
  h2: "Real Systems, Real Businesses, Real Design",
  lead: "We build real commercial platforms and websites. Explore verified projects designed and engineered by Blogspage AI.",
  boundaryNote:
    "Every case study represents authentic project architecture built by our team. We do not publish fabricated awards or invented client reviews.",
  projects: [
    {
      id: "neodent",
      title: "NeoDent Dental Hospitals",
      category: "Brand & Digital Presence Proof",
      image: "/Neodent.jpg",
      description:
        "A real dental hospital business with a physical practice and a growing patient base in Hyderabad. NeoDent needed what every healthcare business needs online: a presence that presents the brand professionally, explains specialized dental procedures clearly, and gives patients a trustworthy place to enquire. We shaped the brand presentation and designed the website structure around patient trust.",
      route: "/solutions/dental-hospital-business-solution-website-at-hyderabad",
      routeLabel: "View Dental Solution Blueprint",
      status: "VERIFIED FACT",
    },
    {
      id: "arogyadiet",
      title: "ArogyaDiet Ecosystem",
      category: "Health & Delivery Platform",
      image: "/ArogyaDiet.jpg",
      description:
        "A complete end-to-end food delivery and meal subscription platform. Features custom portal layouts for customers to manage meal plans, alongside structured administrative interfaces for operational oversight.",
      route: "/solutions/online-delivery-business-solution-website-at-hyderabad",
      routeLabel: "View Delivery Solution Blueprint",
      status: "VERIFIED FACT",
    },
    {
      id: "best100movies",
      title: "Best100Movies Media Hub",
      category: "Content & SEO Platform",
      image: "/movieDB.jpg",
      description:
        "A high-performance media content portal engineered for rapid discovery and organic search indexing, paired with headless Sanity CMS content management.",
      route: "/services/programmatic-seo",
      routeLabel: "View Programmatic SEO Scope",
      status: "VERIFIED FACT",
    },
  ] as const,
  ctaLabel: "Discuss Your Project Architecture",
};

/* -------------------------------------------------------------------------- */
/* 12. FAQ Data Contract (Section 11)                                         */
/* -------------------------------------------------------------------------- */

/**
 * The FAQ section's own heading, following the same eyebrow/h2/lead contract
 * every other section on this page reads from `web-design-data.ts` rather
 * than hardcoding as JSX string literals.
 */
export const WEB_DESIGN_FAQS_HEADING = {
  eyebrow: "COMMON QUESTIONS",
  h2: "Frequently Asked Questions About Our Web Design Services",
  lead: "Clear, transparent answers regarding inclusions, boundaries, pricing, and launch infrastructure.",
};

export const WEB_DESIGN_FAQS: FaqPair[] = [
  {
    question: "What is included in your web design service?",
    answer:
      "Our web design service provides a complete, launch-ready commercial website. This includes UX information architecture, custom Figma UI design for desktop and mobile, digital brand harmonization (typography, color, and logo styling), foundational local SEO (Google Business Profile and Search Console verification), and full launch infrastructure (hosting configuration, domain setup, and SSL encryption).",
  },
  {
    question:
      "What is the difference between Web Design and Web Development at Blogspage AI?",
    answer:
      "Web Design owns user experience (UX), custom visual interfaces (UI), information architecture, mobile responsiveness, and conversion pathways. Web Development encompasses complex backend engineering, custom databases, user authentication, APIs, third-party payment gateways, and custom SaaS application software.",
  },
  {
    question:
      "Can you redesign our existing business website without hurting our existing operations?",
    answer:
      "Yes. In a redesign, we audit your existing content hierarchy and URL structure, establish proper URL redirects to prevent 404 errors, and modernize the visual interface while improving mobile responsiveness and conversion pathways.",
  },
  {
    question:
      "What brand identity work is included with the website design?",
    answer:
      "We include digital brand harmonization: establishing readable web typography pairings, high-contrast accessible color token systems, proper SVG logo scaling for dark and light surfaces, and visual style consistency across your pages. Comprehensive ground-up corporate naming, full brand guideline books, and original logo illustration from scratch are separate scopes.",
  },
  {
    question:
      "What local SEO foundation do you provide for Hyderabad businesses?",
    answer:
      "We set up and align your Google Business Profile (GBP), verify your site with Google Search Console, submit your sitemap, enforce consistent NAP (Name, Address, Phone) across your digital footprint, implement local structured data schema, and provide guidance on relevant industry directories.",
  },
  {
    question: "Do you handle domain setup, hosting, and SSL certificates?",
    answer:
      "Yes. We configure your domain DNS records, set up fast edge-rendered production hosting, provision automated HTTPS/SSL encryption, and assist with business email DNS verification. You maintain direct, 100% administrative ownership of all your domain and hosting accounts.",
  },
  {
    question: "How long does a custom business website design take?",
    answer:
      "A typical custom business website design follows our 5-stage process and takes between 2 to 4 weeks depending on the number of unique page layouts, content readiness, and client feedback cycles.",
  },
  {
    question: "How does pricing work for custom website design?",
    answer:
      "Every engagement is consultation-led based on your specific layout requirements, business vertical, and operational scope. Rather than offering rigid, one-size-fits-all packages with hidden fees, our AI consultant Sweety evaluates your exact needs to provide transparent project guidance.",
  },
  {
    question:
      "Is ongoing monthly SEO included after the website is launched?",
    answer:
      "The launch includes foundational local SEO (GBP, Search Console, NAP, and structured data). Ongoing monthly backlink outreach, continuous content creation, and managed ranking retainers are separate ongoing services.",
  },
  {
    question:
      "Can our website grow to include client portals or booking systems later?",
    answer:
      "Yes. We design our websites with modular, scalable architectures. If your business later requires custom booking logic, client portals, or internal dashboards, your website structure can seamlessly connect into our application development services.",
  },
];

/* -------------------------------------------------------------------------- */
/* 13. Final CTA Data Contract (Section 11)                                   */
/* -------------------------------------------------------------------------- */

export const WEB_DESIGN_FINAL_CTA: FinalCtaContract = {
  h3: "Ready to Build a Website That Actually Represents Your Business?",
  lead: "Start a conversation with Sweety, our AI Business Consultant. We'll assess your business requirements, discuss the right layout architecture, and guide you on the next steps—without high-pressure sales calls.",
  buttonLabel: "Chat With Our AI Consultant",
  microcopy:
    "Available 24/7 · Tailored recommendations for Hyderabad businesses · Instant clarity.",
};

