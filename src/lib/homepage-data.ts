/**
 * Homepage copy deck — R1.0 content foundations.
 *
 * Single source for all v2.0 homepage copy that is not already owned by a
 * richer data module (`homepage-verticals.ts` for the three verticals,
 * `featured-work-data.ts` for project stories, `testimonials-data.ts` for
 * reviews). Plain module: no I/O, no React, no framework imports — importable
 * from both server and client components.
 *
 * Copy authority: docs/canonical/BLOGSPAGE_AI_HOMEPAGE_MASTER_BLUEPRINT_v2.0.md
 * (§8–§22). Final publication wording remains subject to the owner-input
 * registry; nothing here asserts an unverified business claim.
 *
 * ## Evidence gates honoured by this module
 *
 * - `FLAGSHIP_PROJECT_IDS` / `SUPPORTING_PROJECT_IDS` reference **only** ids
 *   that already exist in `featured-work-data.ts`. NeoDent and the gym/dental
 *   builds are owner-confirmed real work but have no repository evidence
 *   record (asset + approved copy); they are added the moment that record
 *   exists — never before.
 * - No metric, ranking, revenue, conversion or client-quote claim appears in
 *   this file. Outcome figures live only in `featured-work-data.ts` and keep
 *   their `basis: "estimated"` disclosure.
 */

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 1 — Hero (dark island)
   ───────────────────────────────────────────────────────────────────────────── */

export const HERO = {
  eyebrow: "Digital build partner for growing businesses · Hyderabad",
  headlineLines: ["Build a business people", "can find, trust and use."],
  subcopy:
    "We build your brand, website, business software and AI automation around the way your business actually works. Start with what your business needs today — we'll help you figure out what comes next.",
  capabilityLine: "Branding · Websites · Software · AI & Automation",
} as const;

/**
 * Immediate proof (Blueprint §8): business/sector proof first, technology as
 * a restrained single line — never a logo wall that dominates the strip.
 * Every sector is substantiated by a project in `featured-work-data.ts`.
 */
export const PROOF_STRIP = {
  label: "Systems shipped across",
  sectors: [
    "AI SaaS",
    "Subscription delivery",
    "Hospitality",
    "Content & SEO platforms",
  ],
  techLine: "Built with Next.js · TypeScript · Supabase · Stripe · Vercel",
} as const;

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 2 — "Where are you right now?" (self-selection)
   Meaning is complete without interaction: `title` + `line` always render.
   Selection only reveals `detail` + `cta`. Each CTA is a real link so the
   section works before hydration and without JavaScript.
   ───────────────────────────────────────────────────────────────────────────── */

export const AUDIENCE = {
  eyebrow: "Start where you are",
  heading: "Where are you right now?",
  sub: "You don't need to know exactly what to build. Start with what's missing.",
  paths: [
    {
      id: "no-website",
      title: "I don't have a website yet",
      line: "I have a business, but I need a proper online presence.",
      // The shared journey motif (creative blueprint, Motif A): each pathway
      // is an entry point into the same business journey.
      journey: ["Business", "Website"],
      // Website-first commercial emphasis (subtle, not manipulative): the
      // most common entry for the primary audience gets a quiet marker.
      featured: true,
      detail:
        "That's the most common starting point. Your website becomes your business's digital home — the one place Google, Instagram and WhatsApp can all point to.",
      cta: { label: "See what a website gives you", href: "#online-presence" },
    },
    {
      id: "have-website",
      title: "I already have a website",
      line: "It needs to look better, explain the business better, or bring in more enquiries.",
      journey: ["Website", "Stronger presence"],
      featured: false,
      detail:
        "We improve what you have — a clearer message, a better-looking site, faster pages — and build the layers your business is missing.",
      cta: { label: "See the three ways we can help", href: "#services" },
    },
    {
      id: "need-software",
      title: "I need more than a website",
      line: "My team needs software, connected workflows or automation.",
      journey: ["Website", "Software & automation"],
      featured: false,
      detail:
        "We build the software your team runs on — portals, dashboards, booking systems — and automate the work nobody should be doing by hand.",
      cta: { label: "Talk to us about your workflow", href: "#contact?need=software" },
    },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 2b — Starting-from-zero / online-presence story (Blueprint §10)
   ───────────────────────────────────────────────────────────────────────────── */

export const PRESENCE_STORY = {
  anchorId: "online-presence",
  eyebrow: "Starting from zero",
  heading: "Don't have a website yet? That's okay.",
  lead: "You may already have Instagram, WhatsApp, Facebook, YouTube or a Google Business Profile. The next step is giving your business a digital home you control.",
  channels: ["Instagram", "Google", "WhatsApp", "YouTube"],
  hub: "Your business",
  siteNode: "Your website",
  outputs: ["Enquiries", "Bookings", "Content", "SEO foundation"],
  benefits: [
    "Customers can finally see what you do, in one place.",
    "Google has a proper destination to send people to.",
    "Enquiries can come directly from your site — not just DMs and comments.",
    "Your online presence no longer depends on one social platform.",
    "It becomes the foundation for e-commerce, content and automation later.",
  ],
  cta: { label: "Start with your website", href: "#contact?need=website" },
} as const;

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 4 — Real proof (Blueprint §13–14)
   ───────────────────────────────────────────────────────────────────────────── */

/**
 * Which `featured-work-data.ts` projects carry the flagship story treatment.
 *
 * OWNER-EVIDENCE GATE: NeoDent is owner-confirmed real work with **no
 * repository evidence record yet** (asset + approved copy). Add it here only
 * after its entry exists in `featured-work-data.ts` with an image in
 * `/public`. The flagship list renders whatever it resolves — it never
 * renders a placeholder or an invented card.
 */
export const FLAGSHIP_PROJECT_IDS = ["arogyadiet", "phixl-ai"] as const;

/** Quieter supporting field (Blueprint §14). Same evidence gate applies. */
export const SUPPORTING_PROJECT_IDS = ["nextinn", "best100movies"] as const;

export const PROOF = {
  eyebrow: "Real work",
  heading: "We've built from the front door to the back office.",
  sub: "Real systems for real businesses — customer-facing websites on one side, the software that runs operations on the other.",
} as const;

export const SUPPORTING = {
  heading: "More systems we've built.",
  sub: "Smaller builds and platform work from the same engineering approach.",
} as const;

/* ─────────────────────────────────────────────────────────────────────────────
   Industry / solution bridge (Blueprint §15)
   `niches.ts` and every generated `/solutions/*` link remain untouched —
   only the framing around the existing ten cards changes.
   ───────────────────────────────────────────────────────────────────────────── */

export const BRIDGE = {
  eyebrow: "By industry",
  heading: "We've built for different kinds of businesses.",
  sub: "Every business runs on different constraints. Explore the problems and digital systems we build for specific industries.",
} as const;

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 5 — Trust: process + expectations (Blueprint §16)
   ───────────────────────────────────────────────────────────────────────────── */

export const PROCESS = {
  eyebrow: "What happens next",
  heading:
    "You don't need to know how to build it. You need to know what happens next.",
  sub: "Four phases, explained in plain language — with something concrete delivered at the end of each one.",
  steps: [
    {
      number: "01",
      title: "Understand",
      description:
        "We learn how your business works, who your customers are, and what's actually slowing you down. You explain the business — we translate it into a build plan.",
      outcome: "a written scope, a system direction and a clear plan.",
    },
    {
      number: "02",
      title: "Shape",
      description:
        "We design the screens, the content structure and the experience before any code is written, so you can see and approve what you're getting.",
      outcome:
        "defined screens, content structure and the experience we are actually going to build.",
    },
    {
      number: "03",
      title: "Build",
      description:
        "We build in reviewable increments, so you see real progress early and can course-correct while it's still cheap to do so.",
      outcome: "a working system you can use and review.",
    },
    {
      number: "04",
      title: "Launch",
      description:
        "We deploy, hand over the keys and walk you through everything — then stay available for questions and improvements.",
      outcome:
        "the live system, the accounts in your name, and a clear plan for what comes next.",
    },
  ],
} as const;

/**
 * Engagement framing around the existing `DELIVERY_MODELS` cards (whose copy
 * is shared with `/about` and therefore stays untouched). Blueprint trust
 * movement: expectations · ownership · communication.
 */
export const TRUST = {
  heading: "Two ways to work with us.",
  sub: "Choose the engagement that matches where your business is. Both come with plain-language updates, agreed expectations, and full ownership of what we build.",
  assurances: [
    {
      title: "You own what we build",
      detail: "The code, the content and the accounts are yours — no lock-in.",
    },
    {
      title: "Direct communication",
      detail: "You talk to the people actually building your project.",
    },
    {
      title: "Clear expectations",
      detail: "Scope, timeline and price are agreed before work starts.",
    },
  ],
} as const;

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 6 — Conversation (Blueprint §21)
   The dark product/terminal panel stays as visual language; the action is
   plain-language. Never ask the visitor to understand "initialize" or
   "deploy" in order to contact the agency.
   ───────────────────────────────────────────────────────────────────────────── */

export const CONVERSATION = {
  eyebrow: "Start the conversation",
  heading: "Tell us about your business.",
  sub: "Explain what you do and what you need — in your own words. No forms to decode, no technical vocabulary required. We'll figure out the technology together.",
  typedLines: [
    "say hello to blogspage",
    "✓ Sweety — our AI assistant — is online",
    "✓ A real person reads every conversation",
  ],
  sweetyCta: "Chat with Sweety",
  sweetyNote:
    "Sweety asks a few simple questions and passes everything to the team.",
  humanTitle: "Prefer a human?",
} as const;

/**
 * Friendly labels for the `need` context values the homepage passes through
 * `#contact?need=…` links. `null` means "no label needed".
 */
export const NEED_LABELS: Record<string, string | null> = {
  website: "a website",
  software: "business software",
  "ai-automation": "AI & automation",
  unsure: null,
} as const;

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 7 — Final conversion (Blueprint §20)
   ───────────────────────────────────────────────────────────────────────────── */

export const FINAL_CTA = {
  eyebrow: "Your next step",
  heading: "Tell us where you want your business to go.",
  sub: "Whether you need your first website, a stronger digital presence, software for your team or automation for repetitive work — we'll help you figure out what should come next.",
  choices: [
    { need: "website", label: "I need a website" },
    { need: "software", label: "I need software" },
    { need: "ai-automation", label: "I need AI & automation" },
    { need: "unsure", label: "I'm not sure yet" },
  ],
  footnote:
    "Every path leads to a plain-language conversation — no commitment, no jargon.",
} as const;



