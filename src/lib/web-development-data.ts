/**
 * Web Development Service copy deck & canonical data model.
 * Scope: /services/web-development
 *
 * Single source of truth for all copy, structured data, process steps,
 * capability ladder, architecture layer, proof systems, and FAQ entries for
 * the Web Development service page.
 *
 * Authority:
 * - docs/canonical/WEB-DEVELOPMENT-PAGE-SPECIFICATION.md (v1.0)
 *
 * Positioning: Web Design = how the business looks. Web Development = how
 * the business works. This page explains functionality, business logic,
 * data, workflows, integrations, payments, authentication, dashboards, APIs,
 * roles and infrastructure — never a programming-language checklist.
 *
 * Proof systems are exactly the three the spec authorises: ArogyaDiet,
 * NextInn, and Phixl AI (the spec's "Pixel AI" — this is the one verified
 * public name used consistently, matching the in-repo asset `/phixlAI.jpg`
 * and `featured-work-data.ts`). No Neodent, no Best100Movies on this page.
 *
 * Every stack/tech attribution below is copied from the already-verified
 * `featured-work-data.ts` record for that project — never invented or
 * broadened beyond what that record states.
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
  /**
   * The six stages of one customer request, each paired with the one ordinary
   * sentence that says what happens at that point.
   *
   * Sentences, not bare nouns: a diagram whose nodes read "Business Logic" and
   * "Data" explains nothing to the non-technical reader this page is written for,
   * and the hero has the room for the explanation. The architecture section keeps
   * its own label-only chain (`WEB_DEVELOPMENT_ARCHITECTURE.flow`) for the
   * full-width register, which is why there is no second copy of these labels
   * here.
   */
  requestPath: readonly { id: string; label: string; plain: string }[];
  /** The micro label above the path, and the label above its outcome chips. */
  requestPathCaption: string;
  outcomesLabel: string;
  /**
   * What the visitor's business is left holding once that path has run. These
   * restate the lead's own three claims — capture leads, accept payments, give
   * the team tools to run operations — as the diagram's terminal state, so the
   * composition closes on an outcome rather than on a technical node.
   */
  outcomes: readonly string[];
}

export interface DesignVsDevItem {
  id: string;
  label: string;
}

export interface CapabilityLevel {
  id: string;
  level: string;
  title: string;
  /**
   * The rung's name at rail width.
   *
   * The hero closes on a five-column rail of these levels. At 375px each column
   * is ~60px, and "E-commerce, Booking & Transactions" at that measure breaks
   * into a stack of fragments — so the rail needs the short form while the
   * section keeps the full title. Each value is a contraction of `title`, never a
   * different claim, and the brief's own summary of the ladder uses exactly this
   * register (Presence → Transactions → Operations → Platforms → Products).
   */
  railLabel: string;
  audience: string;
  items: readonly string[];
  boundaryNote?: string;
  ctaLabel?: string;
  ctaRoute?: string;
}

export interface ArchitectureLayer {
  id: string;
  title: string;
  businessMeaning: string;
  tags: readonly string[];
  note?: string;
}

export interface ProofCapability {
  label: string;
}

export interface ProofProject {
  id: string;
  name: string;
  primaryCapability: string;
  label: "build" | "platform" | "product";
  image: string;
  imageAlt: string;
  problem: string;
  systemCapability: readonly string[];
  tech: readonly string[];
  route?: string;
  routeLabel?: string;
  liveUrl?: string;
  liveLabel?: string;
}

export interface CapabilityGroup {
  id: string;
  title: string;
  items: readonly string[];
  note?: string;
}

export interface TrustPillar {
  id: string;
  title: string;
  items: readonly string[];
}

export interface ProcessPhase {
  step: string;
  title: string;
  focus: readonly string[];
  output: string;
}

export interface FinalCtaContract {
  h3: string;
  lead: string;
  buttonLabel: string;
  secondaryLabel: string;
  microcopy: string;
  /**
   * The non-chat conversion route.
   *
   * Both approved buttons open the AI consultant, which is the page's primary
   * mechanism and stays that way. This is the quiet third path for a visitor who
   * would rather write the requirement down than talk to anything — and it is the
   * page's only outbound link to the contact route, which a service page should
   * not be missing.
   */
  contactContext: string;
  contactLabel: string;
  contactRoute: string;
}

/* -------------------------------------------------------------------------- */
/* 1. SEO Metadata Contract                                                   */
/* -------------------------------------------------------------------------- */

export const WEB_DEVELOPMENT_META: MetaDataContract = {
  path: "/services/web-development",
  title: "Web Development Company in Hyderabad | Blogspage AI",
  /*
   * 154 characters, deliberately.
   *
   * The previous wording measured 170, and `clampDescription` in `src/lib/seo.ts`
   * cuts anything over 160 at the last space inside the 120-160 window — so the
   * description the page actually served ended "…built around your workflows,
   * data and", a dangling conjunction in the one snippet a searcher reads. The
   * defect was invisible from this file and only visible in the emitted tag.
   *
   * Same claims, same order, same primary phrase; shortened by folding "data and
   * integrations" into "integrations" and "booking systems, web applications and
   * connected platforms" into the dashboard-bearing form, so the sentence now
   * survives the clamp whole. Anything added here has to be measured against
   * DESCRIPTION_MAX first.
   */
  description:
    "Custom web development in Hyderabad for business websites, booking systems, web applications and dashboards, built around your workflows and integrations.",
  keywordPhrase: "web development company in Hyderabad",
};

/* -------------------------------------------------------------------------- */
/* 2. Hero Data Contract (Section 01)                                        */
/* -------------------------------------------------------------------------- */

export const WEB_DEVELOPMENT_HERO: HeroDataContract = {
  eyebrow: "WEB DEVELOPMENT · CUSTOM WEBSITES, WEB APPS & BUSINESS SYSTEMS",
  h1: "Custom Web Development for Websites, Web Apps & Business Systems",
  subhead: "Design is how your business looks. This is how it works.",
  lead: "We build business websites, transactional websites, booking and order systems, web applications and business platforms — the working layer that captures leads, accepts payments, and gives your team the tools to run daily operations.",
  primaryCtaLabel: "Start a Project",
  secondaryCtaLabel: "See What We've Built",
  microcopy: "Instant consultation with Sweety, our AI Business Consultant · No high-pressure sales calls.",
  requestPathCaption: "One customer action, end to end",
  outcomesLabel: "What your business is left with",
  requestPath: [
    {
      id: "customer",
      label: "Customer",
      plain: "Someone enquires, books or places an order.",
    },
    {
      id: "website",
      label: "Website",
      plain: "The interface collects and validates what they entered.",
    },
    {
      id: "business-logic",
      label: "Business Logic",
      plain: "Your rules decide what should happen next.",
    },
    {
      id: "data",
      label: "Data",
      plain: "The record is stored — customer, order or booking.",
    },
    {
      id: "admin",
      label: "Admin",
      plain: "Your team sees it on a dashboard and acts on it.",
    },
    {
      id: "payment-notification",
      label: "Payment / Notification",
      plain: "Payment is taken where relevant, and confirmations go out.",
    },
  ],
  outcomes: ["Lead captured", "Payment handled", "Team notified"],
};

/* -------------------------------------------------------------------------- */
/* 3. Design vs Development Data Contract (Section 02)                       */
/* -------------------------------------------------------------------------- */

export const WEB_DEVELOPMENT_DESIGN_VS_DEV = {
  eyebrow: "TWO SERVICES, ONE CLEAR BOUNDARY",
  h2: "How It Looks vs. How It Works",
  lead: "Design is how your business looks. Development is how your business works.",
  /**
   * The design side of the same boundary.
   *
   * Added for the section's visual: a boundary drawn with only one side labelled
   * is not a boundary, it is a list. Every label here names scope the Web Design
   * page already owns (`WEB_DESIGN_PILLAR.capabilities` and
   * `WEB_DESIGN_BRANDING.elements`) rather than introducing new claims, and the
   * section still links to that page instead of summarising it.
   */
  designOwns: [
    { id: "interface", label: "Interface design" },
    { id: "layout", label: "Layout & hierarchy" },
    { id: "typography", label: "Typography" },
    { id: "colour", label: "Colour system" },
    { id: "responsive", label: "Responsive layout" },
    { id: "brand", label: "Brand presentation" },
  ] satisfies readonly DesignVsDevItem[] as readonly DesignVsDevItem[],
  designOwnsLabel: "Web Design owns",
  developmentOwnsLabel: "Web Development owns",
  /** The one sentence that states what the two sides add up to. */
  boundaryNote:
    "The same website has both layers. One decides what a visitor sees; the other decides what happens after they act.",
  developmentOwns: [
    { id: "forms", label: "Forms" },
    { id: "bookings", label: "Bookings" },
    { id: "payments", label: "Payments" },
    { id: "orders", label: "Orders" },
    { id: "dashboards", label: "Dashboards" },
    { id: "authentication", label: "Authentication" },
    { id: "databases", label: "Databases" },
    { id: "apis", label: "APIs" },
    { id: "workflows", label: "Workflows" },
    { id: "integrations", label: "Integrations" },
  ] satisfies readonly DesignVsDevItem[] as readonly DesignVsDevItem[],
  designLinkLabel: "Explore our Web Design service",
  designLinkRoute: "/services/web-design",
  designLinkContext:
    "If you need the visual experience and brand system first, explore our Web Design service.",
};

/* -------------------------------------------------------------------------- */
/* 4. Capability Ladder Data Contract (Section 03)                           */
/* -------------------------------------------------------------------------- */

export const WEB_DEVELOPMENT_CAPABILITY_LADDER = {
  eyebrow: "WHAT ARE YOU BUILDING?",
  h2: "Find the Level of System You Actually Need",
  lead: "Not every business needs the same thing. This is a ladder, not a menu — each level builds on the one before it.",
  levels: [
    {
      id: "business-website",
      level: "Level 1",
      title: "Business Website",
      railLabel: "Website",
      audience: "For businesses that need to be found and contacted.",
      items: [
        "Lead capture & contact forms",
        "WhatsApp click-to-chat",
        "Chatbot integrations",
        "Appointment requests",
        "CMS-managed content",
        "Social integrations",
        "Analytics & basic third-party integrations",
      ],
      boundaryNote:
        "What the website does belongs here. How the website looks belongs primarily to Web Design.",
    },
    {
      id: "transactions",
      level: "Level 2",
      title: "E-commerce, Booking & Transactions",
      railLabel: "Transactions",
      audience: "For businesses that take orders, bookings or payments online.",
      items: [
        "Product/service ordering & checkout",
        "Payments (Razorpay, Stripe)",
        "Bookings & reservation flows",
        "Customer notifications",
        "Order/reservation status",
        "Admin management",
      ],
    },
    {
      id: "web-application",
      level: "Level 3",
      title: "Web Applications",
      railLabel: "Applications",
      audience: "For businesses that need logins, roles and dashboards.",
      items: [
        "Customer, staff & admin login",
        "Dashboards & workflows",
        "Role-based access",
        "Customer portals",
        "Operational data & business rules",
      ],
    },
    {
      id: "business-platform",
      level: "Level 4",
      title: "Business Platforms",
      railLabel: "Platforms",
      audience: "For organizations that run multiple roles, branches or tenants.",
      items: [
        "Multiple roles & multiple dashboards",
        "Multi-tenant architecture",
        "Multiple branches/businesses",
        "Centralized administration",
        "Operational workflows & integrations",
        "Structured, scalable business rules",
      ],
      ctaLabel: "See NextInn & ArogyaDiet as proof",
      ctaRoute: "#proof",
    },
    {
      id: "saas-mvp",
      level: "Level 5",
      title: "SaaS MVP",
      railLabel: "SaaS MVP",
      audience: "For founders turning a product idea into a working MVP.",
      items: [
        "Build the core product",
        "Launch quickly",
        "Collect real user feedback",
        "Improve based on usage",
        "Continue expanding",
      ],
      ctaLabel: "Explore Custom SaaS Development",
      ctaRoute: "/services/custom-saas-development",
    },
  ] satisfies readonly CapabilityLevel[] as readonly CapabilityLevel[],
};

/* -------------------------------------------------------------------------- */
/* 5. Architecture Data Contract (Section 04)                                */
/* -------------------------------------------------------------------------- */

export const WEB_DEVELOPMENT_ARCHITECTURE = {
  eyebrow: "WHAT'S BEHIND THE WEBSITE?",
  h2: "The System Behind the Interface",
  lead: "Every business website or application is powered by layers working together. Here's what actually happens behind the page a customer sees.",
  flow: [
    "Customer / Staff / Admin",
    "Website / Application Interface",
    "Business Logic",
    "Database / Content",
    "APIs & Integrations",
    "Payments / Notifications / AI",
    "Admin / Operations",
  ] as const,
  layers: [
    {
      id: "frontend",
      title: "Frontend",
      businessMeaning: "What your customers and staff actually see and interact with.",
      tags: ["HTML", "CSS", "JavaScript", "React", "Next.js"],
    },
    {
      id: "backend",
      title: "Backend",
      businessMeaning: "Where your business rules and workflows are actually processed.",
      tags: ["Node.js", "Express", "APIs"],
    },
    {
      id: "data",
      title: "Data",
      businessMeaning: "Where structured business information lives — customers, orders, bookings.",
      tags: ["PostgreSQL", "Supabase", "MongoDB", "Sanity CMS"],
      note: "The database is selected around the shape and needs of the product.",
    },
    {
      id: "auth",
      title: "Authentication & Access",
      businessMeaning: "Different people get different doors into the same system.",
      tags: ["JWT", "RBAC", "Multi-tenant access control"],
      note: "Customer, Staff, Admin and Super Admin can each see only what's relevant to them.",
    },
    {
      id: "apis",
      title: "APIs & Integrations",
      businessMeaning: "Your website can communicate with the other tools your business already uses.",
      tags: ["Payment providers", "CRM", "Email", "WhatsApp", "AI APIs"],
    },
    {
      id: "payments",
      title: "Payments",
      businessMeaning: "Payment providers handle the transaction while your application manages the order or booking around it.",
      tags: ["Razorpay", "Stripe"],
    },
    {
      id: "cms",
      title: "CMS",
      businessMeaning: "Update content without needing a developer for every change.",
      tags: ["Sanity CMS"],
    },
    {
      id: "notifications",
      title: "Notifications",
      businessMeaning: "Payment confirmations, booking confirmations, order status and admin alerts — sent automatically.",
      tags: ["Email", "WhatsApp", "In-app"],
    },
    {
      id: "ai",
      title: "AI",
      businessMeaning: "AI appears only where it does real work — generation, restoration, or an AI-assisted workflow.",
      tags: ["OpenAI", "AI APIs"],
    },
  ] satisfies readonly ArchitectureLayer[] as readonly ArchitectureLayer[],
};

/* -------------------------------------------------------------------------- */
/* 6. Proof / Systems We've Built Data Contract (Section 05)                 */
/* -------------------------------------------------------------------------- */
/*
 * ROUTE CONTRACT — every `route` below must be a path the site actually
 * serves (checked in tests/unit/web-development-routes.spec.ts against
 * ALL_ROUTES, mirroring the web-design page's own route-integrity test).
 *
 * TECH CONTRACT — every `tech` array is copied verbatim from the already
 * owner-verified record for the same project in `featured-work-data.ts`.
 * Nothing here claims a feature, technology, or metric that record does not
 * already state.
 */
export const WEB_DEVELOPMENT_PROOF = {
  eyebrow: "SYSTEMS WE'VE BUILT",
  h2: "From Websites to Working Systems",
  lead: "Not a portfolio of screenshots — proof that the architecture on this page is real. Each build demonstrates a different capability.",
  boundaryNote:
    "These are builds we have engineered, not client case studies with measured results. We label metrics as estimated where no production analytics are wired in, and we never invent user counts, revenue or rankings.",
  projects: [
    {
      id: "arogyadiet",
      name: "ArogyaDiet",
      primaryCapability: "Multi-role operational web application",
      label: "platform",
      image: "/ArogyaDiet.jpg",
      imageAlt: "ArogyaDiet — customer ordering, rider tracking and admin/franchise dashboards.",
      problem:
        "A food delivery and meal-subscription business needed customers, delivery riders, and franchise admins to work from one connected system instead of separate spreadsheets and phone calls.",
      systemCapability: [
        "Customer experience — meal plans & subscriptions",
        "Rider experience — live delivery tracking",
        "Admin & franchise dashboards — operational oversight",
        "Role-based access across every user type",
        "Payments integrated into the subscription flow",
      ],
      tech: ["Next.js", "Stripe", "TypeScript", "Tailwind", "Supabase"],
      route: "/solutions/online-delivery-business-solution-website-at-hyderabad",
      routeLabel: "View the delivery solution blueprint",
    },
    {
      id: "nextinn",
      name: "NextInn",
      primaryCapability: "Hospitality booking and management platform",
      label: "platform",
      image: "/NextInn.jpg",
      imageAlt: "NextInn — guest booking flow alongside staff and admin dashboards.",
      problem:
        "A hospitality business wanted direct guest bookings and day-to-day operations running on one platform, instead of paying OTA commissions and coordinating manually.",
      systemCapability: [
        "Guest experience — live availability & booking",
        "Staff & admin dashboards for daily operations",
        "Review and performance oversight for ownership",
        "Booking data connected end-to-end, not siloed",
      ],
      tech: ["React", "Redux", "MongoDB", "Express", "Node.js"],
      route: "/solutions/hotel-booking-business-solution-website-at-hyderabad",
      routeLabel: "View the hospitality solution blueprint",
    },
    {
      id: "phixl-ai",
      name: "Phixl AI",
      primaryCapability: "AI-powered product / SaaS MVP",
      label: "product",
      image: "/phixlAI.jpg",
      imageAlt: "Phixl AI — upload, AI processing, restored result, and credit-based checkout.",
      problem:
        "Turning an AI photo-restoration idea into a working product meant shipping a real user flow — uploads, processing, a credit system and payments — not just a demo of the AI model.",
      systemCapability: [
        "Upload → AI processing → restored result workflow",
        "User accounts with a credit-based usage system",
        "Payment integration for credit top-ups",
        "Built and shipped as an MVP, iterated from usage",
      ],
      tech: ["Next.js", "Replicate AI", "Supabase", "TypeScript", "Tailwind", "Razorpay"],
      route: "/services/custom-saas-development",
      routeLabel: "See how we approach SaaS MVPs",
    },
  ] satisfies readonly ProofProject[] as readonly ProofProject[],
};

/* -------------------------------------------------------------------------- */
/* 7. What We Can Connect & Build Data Contract (Section 06)                 */
/* -------------------------------------------------------------------------- */

export const WEB_DEVELOPMENT_CAPABILITIES = {
  eyebrow: "WHAT WE CAN CONNECT & BUILD",
  h2: "Development Translated Into Business Function",
  lead: "Organized by what it does for your business, not by programming language.",
  /**
   * The one contextual hand-off out of this section.
   *
   * The "Extend" group already mentions AI APIs and AI-powered features, which is
   * the point at which a visitor whose actual requirement is an automated
   * workflow rather than a web system should be sent to the page that owns that
   * subject. One link, where it makes sense to the reader — not an inserted
   * link-count exercise, and deliberately not a second AI pitch on this page.
   */
  aiLinkContext:
    "If the problem is a repetitive internal workflow rather than a customer-facing system, that belongs with",
  aiLinkLabel: "our AI workflow automation service",
  aiLinkRoute: "/services/ai-automation",
  groups: [
    {
      id: "capture",
      title: "Capture",
      items: [
        "Contact & lead forms",
        "Appointment requests",
        "Chat & chatbot integrations",
        "WhatsApp click-to-chat",
        "Social integrations",
        "Lead notifications",
      ],
      note: "WhatsApp click-to-chat and WhatsApp Business/API workflows are different levels of integration — we'll scope the right one for you.",
    },
    {
      id: "transact",
      title: "Transact",
      items: [
        "Payments (Razorpay, Stripe)",
        "Orders & checkout",
        "Bookings & reservation flows",
        "Payment status",
        "Confirmation notifications",
      ],
    },
    {
      id: "operate",
      title: "Operate",
      items: [
        "Admin dashboards",
        "Customer portals",
        "Staff dashboards",
        "Role-based access",
        "Workflow management",
        "Reports & status changes",
      ],
    },
    {
      id: "connect",
      title: "Connect",
      items: [
        "APIs & webhooks",
        "CRM integrations",
        "Email services",
        "WhatsApp & social platforms",
        "Analytics",
        "CMS & external business systems",
      ],
      note: "A service can automatically tell your system when something happens — such as a successful payment.",
    },
    {
      id: "extend",
      title: "Extend",
      items: [
        "AI APIs & AI-powered features",
        "New modules & dashboards",
        "New integrations",
        "MVP-to-product evolution",
      ],
    },
  ] satisfies readonly CapabilityGroup[] as readonly CapabilityGroup[],
};

/* -------------------------------------------------------------------------- */
/* 8. Built to Run, Own & Evolve Data Contract (Section 07)                  */
/* -------------------------------------------------------------------------- */

export const WEB_DEVELOPMENT_TRUST = {
  eyebrow: "BUILT TO RUN, OWN & EVOLVE",
  h2: "What Happens After the Build",
  lead: "The technology discussion isn't the only thing that matters. Here's how we think about security, performance, ownership and what comes next.",
  pillars: [
    {
      id: "security",
      title: "Security & Access",
      items: [
        "Secure authentication & role-based access",
        "Controlled permissions per user type",
        "Protected data & appropriate session strategy",
        "Secure payment-provider integrations",
      ],
    },
    {
      id: "performance",
      title: "Performance & Reliability",
      items: [
        "Optimized frontend delivery & rendering strategy",
        "Efficient data access, caching where useful",
        "CDN/edge delivery where appropriate",
        "Monitoring & backups where applicable",
      ],
    },
    {
      id: "ownership",
      title: "Ownership & Handover",
      items: [
        "Code ownership according to project agreement",
        "Access to relevant services & accounts",
        "Documentation & deployment information",
        "Credentials handed over through secure processes",
      ],
    },
    {
      id: "evolution",
      title: "Post-Launch Evolution",
      items: [
        "New features & integrations",
        "New user roles & additional dashboards",
        "Additional automation",
        "Product iterations over time",
      ],
    },
  ] satisfies readonly TrustPillar[] as readonly TrustPillar[],
};

/* -------------------------------------------------------------------------- */
/* 9. Technology Stack — Supporting Layer (used inside Section 04/07)        */
/* -------------------------------------------------------------------------- */

export const WEB_DEVELOPMENT_STACK = {
  eyebrow: "THE STACK",
  h2: "We Choose the Stack Around the Product",
  lead: "Not every technology is used on every project. This is the range we build from — not a checklist every build ticks off.",
  groups: [
    { id: "foundations", title: "Foundations", items: ["HTML", "CSS", "JavaScript"] },
    { id: "frontend", title: "Frontend", items: ["React", "Next.js"] },
    { id: "backend", title: "Backend", items: ["Node.js", "Express", "APIs"] },
    { id: "data", title: "Data", items: ["PostgreSQL", "Supabase", "MongoDB"] },
    { id: "cms", title: "CMS", items: ["Sanity CMS"] },
    { id: "access", title: "Authentication / Access", items: ["JWT", "RBAC", "Multi-tenant"] },
    { id: "payments", title: "Payments", items: ["Razorpay", "Stripe"] },
    { id: "ai", title: "AI", items: ["OpenAI", "AI APIs"] },
    { id: "infra", title: "Deployment / Infrastructure", items: ["Vercel", "Netlify", "Cloud infrastructure"] },
  ] as const,
};

/* -------------------------------------------------------------------------- */
/* 10. How We Build Data Contract (Section 08)                               */
/* -------------------------------------------------------------------------- */

export const WEB_DEVELOPMENT_PROCESS = {
  eyebrow: "HOW WE BUILD",
  h2: "Five Phases, From Requirement to Live System",
  lead: "A disciplined progression from understanding the business problem to a system that keeps evolving after launch.",
  phases: [
    {
      step: "01",
      title: "Discover & Define",
      focus: ["Business goal", "Users", "Workflows", "Required functionality", "Integrations", "Scope"],
      output: "A clear product/system scope.",
    },
    {
      step: "02",
      title: "Architect",
      focus: ["System structure", "Data model", "Roles & permissions", "Workflows", "Integrations", "Infrastructure direction"],
      output: "A technical blueprint before heavy development begins.",
    },
    {
      step: "03",
      title: "Build",
      focus: ["Frontend", "Backend", "Database", "APIs", "Integrations", "Dashboards", "Business logic"],
      output: "Working increments, not a single big-bang delivery.",
    },
    {
      step: "04",
      title: "Test & Validate",
      focus: ["Functionality & forms", "Workflows", "Authentication & roles", "Payments", "Integrations", "Responsive behavior", "Security-sensitive flows"],
      output: "A system verified against real use, not just the happy path.",
    },
    {
      step: "05",
      title: "Launch & Evolve",
      focus: ["Deployment", "Production configuration", "Handover", "Monitoring", "Documentation", "Post-launch improvements"],
      output: "A live system, with a path to keep improving it.",
    },
  ] satisfies readonly ProcessPhase[] as readonly ProcessPhase[],
};

/* -------------------------------------------------------------------------- */
/* 11. FAQ Data Contract (Section 09)                                        */
/* -------------------------------------------------------------------------- */

export const WEB_DEVELOPMENT_FAQS_HEADING = {
  eyebrow: "RIGHT-SIZED DEVELOPMENT",
  h2: "Frequently Asked Questions About Web Development",
  lead: "Not every business needs a custom application. We first understand the problem, then recommend the simplest system that can solve it properly.",
  /**
   * The one contextual hand-off from the FAQ column — the reciprocal of the link
   * the Web Design page's own FAQ carries back to this page.
   *
   * A visitor whose questions are about building a *product* rather than a
   * business system belongs on the SaaS page, which owns that subject and its
   * head terms. Stated as a condition rather than as a generic "see also", so the
   * link only speaks to the reader it is for.
   */
  crossLinkContext:
    "If what you're building is a product other businesses would subscribe to rather than a system for your own operations,",
  crossLinkLabel: "start with Custom SaaS Development",
  crossLinkRoute: "/services/custom-saas-development",
};

export const WEB_DEVELOPMENT_FAQS: FaqPair[] = [
  {
    question: "Do I need a business website or a web application?",
    answer:
      "It depends on what the site needs to do, not how it should look. If you need to be found, contacted and to share information, a business website with forms, chat and CMS-managed content is usually enough. If you need logins, dashboards, roles or workflows, that's a web application. We help you figure out which one your business actually needs before we scope anything.",
  },
  {
    question: "Can you add login to an existing website?",
    answer:
      "Yes, where the existing architecture and requirements support it. We review what you already have, then add authentication and the relevant dashboards or portals on top of it, rather than starting the whole project over.",
  },
  {
    question: "Can my website accept payments?",
    answer:
      "Yes, through supported payment providers such as Razorpay or Stripe, depending on the project. The payment provider handles the transaction itself, while your application manages the order, booking or subscription around it.",
  },
  {
    question: "Can you build booking or ordering systems?",
    answer:
      "Yes. We've built booking flows for hospitality (NextInn) and ordering/subscription flows for food delivery (ArogyaDiet), each with the admin tooling needed to manage them day to day.",
  },
  {
    question: "Can you create separate customer and admin dashboards?",
    answer:
      "Yes. Separate, role-appropriate dashboards for customers, staff and admins are a core part of what we build — each user sees only the parts of the system relevant to them.",
  },
  {
    question: "Can different users have different permissions?",
    answer:
      "Yes, through role-based access and appropriate authentication architecture. A customer, a staff member, an admin and a super admin can all use the same system while seeing different things and having different capabilities inside it.",
  },
  {
    question: "Can you build a multi-tenant system?",
    answer:
      "Yes, where the business model requires one platform to serve multiple businesses, branches or tenants while keeping each organization's data logically separated.",
  },
  {
    question: "Can you integrate our existing tools?",
    answer:
      "Yes, when APIs, webhooks or other supported integration mechanisms are available from the tools you already use — CRMs, email services, WhatsApp, analytics and other business systems.",
  },
  {
    question: "Can you integrate WhatsApp with my website or system?",
    answer:
      "Yes, at the level your business actually needs. Click-to-chat simply opens a WhatsApp conversation with a pre-filled message, which suits most business websites. Sending automated confirmations or notifications through the WhatsApp Business API is a deeper integration with its own provider requirements, so we scope that separately once we know what you want the messages to do.",
  },
  {
    question: "What happens after the system goes live?",
    answer:
      "Launch is a deployment, not the end of the project. We hand over the relevant access, deployment information and documentation, and from there the system can keep evolving — new features, additional user roles, extra dashboards, more integrations or further product iterations. Anything ongoing is agreed as its own scope rather than assumed.",
  },
  {
    question: "Can you build an MVP first?",
    answer:
      "Yes. MVP scope focuses on the smallest useful product that can be launched and evaluated with real users, then improved based on what you learn — the same approach behind Phixl AI.",
  },
  {
    question: "Who owns the code?",
    answer:
      "Code ownership follows the actual engagement and contract terms agreed for your project. We don't make a blanket promise here that overrides what's actually agreed — ask us directly and we'll be specific.",
  },
  {
    question: "Can the system grow later?",
    answer:
      "Yes. We build with modular development in mind, so new features, roles, dashboards or integrations can be added later as the business grows, rather than requiring a rebuild.",
  },
  {
    question: "Do you work only in Hyderabad?",
    answer:
      "We're based in Hyderabad and work with businesses there day to day, but we also work with businesses across India and internationally where the project is a good fit.",
  },
];

/* -------------------------------------------------------------------------- */
/* 12. Final CTA Data Contract (Section 10)                                  */
/* -------------------------------------------------------------------------- */

export const WEB_DEVELOPMENT_FINAL_CTA: FinalCtaContract = {
  h3: "Have a Business Process That Needs to Become a Working System?",
  lead: "Tell us what you need the website or application to do. We'll help you understand the right architecture, scope and next step — without technical jargon.",
  buttonLabel: "Discuss Your Project",
  secondaryLabel: "Chat With Our AI Consultant",
  microcopy: "Available 24/7 · No high-pressure sales calls · Instant clarity.",
  contactContext: "Prefer to write the requirement down?",
  contactLabel: "Send us the details",
  contactRoute: "/contact",
};
