/**
 * Homepage verticals — R1.0 data foundations.
 *
 * The three permanent presentation-level capability verticals from
 * docs/canonical/BLOGSPAGE_AI_HOMEPAGE_MASTER_BLUEPRINT_v2.0.md (§3, §11–12,
 * §34). This is a **presentation-layer** model only:
 *
 * - It deliberately does NOT touch `src/lib/niches.ts` (the programmatic SEO
 *   Service_Catalog), `src/lib/service-routes.ts`, or the keyword map. The
 *   verticals and the SEO catalog answer different questions and stay
 *   separate by design (Blueprint §0 and §34).
 * - `href` values point only at routes that already exist today:
 *   `/services/ai-automation` (verified existing Service_Route),
 *   `/services/custom-saas-development` (closest existing match), and an
 *   in-page `#contact?need=…` anchor for the Brand vertical until its future
 *   service hub is created. When the future hubs ship, only `href` /
 *   `hrefMode` change here — no component rewrite, no dead links.
 * - `proofProjectId` references `featured-work-data.ts` ids; the component
 *   resolves the project from there, so proof copy never duplicates the
 *   project data.
 *
 * Pure module: no I/O, no React, no framework imports. Icons are mapped to
 * ids in the rendering component, never stored here.
 */

export type HomeVerticalId =
  | "brand-digital-presence"
  | "applications-software"
  | "ai-automation";

export type HomeVertical = {
  id: HomeVerticalId;
  /** Storytelling device (Blueprint §12) — never a replacement for the name. */
  stage: "START" | "GROW" | "SCALE";
  number: string;
  title: string;
  /** Plain-language promise (Blueprint §3). */
  plainPromise: string;
  capabilities: string[];
  body: string;
  ctaLabel: string;
  href: string;
  /** "route" = navigates off the homepage; "anchor" = in-page target. */
  hrefMode: "route" | "anchor";
  /** `featured-work-data.ts` project id used as the descriptive proof line. */
  proofProjectId: string;
  proofDetail: string;
  proofDestination: "#work" | "#more-work";
  /** Raw `r,g,b` triple for the accent system, matching existing cards. */
  accent: string;
};

export const HOME_VERTICALS: readonly HomeVertical[] = [
  {
    id: "brand-digital-presence",
    stage: "START",
    number: "01",
    title: "Brand & Digital Presence",
    plainPromise: "Get your business online properly.",
    capabilities: [
      "Branding",
      "Website",
      "E-commerce",
      "CMS",
      "Google presence",
      "SEO foundation",
    ],
    body: "Everything a customer sees, searches and clicks — designed properly and built to grow with you.",
    ctaLabel: "Explore Brand & Digital Presence",
    // Staged destination: the future `/services/brand-digital-presence` hub
    // does not exist yet. The conversation section understands `need=website`.
    href: "#contact?need=website",
    hrefMode: "anchor",
    proofProjectId: "best100movies",
    proofDetail: "a Sanity-backed content platform with programmatic routes.",
    proofDestination: "#more-work",
    // R5 color system: cyan = presence / website / incoming attention.
    accent: "14,116,144", // --accent-cyan
  },
  {
    id: "applications-software",
    stage: "GROW",
    number: "02",
    title: "Applications & Business Software",
    plainPromise: "Build the software your business runs on.",
    capabilities: [
      "CRM",
      "Dashboards",
      "Portals",
      "SaaS",
      "Booking",
      "Subscriptions",
    ],
    body: "Portals, dashboards and custom systems for teams that have outgrown spreadsheets and manual work.",
    ctaLabel: "Explore Applications & Software",
    // Closest existing Service_Route to this vertical today (verified).
    href: "/services/custom-saas-development",
    hrefMode: "route",
    proofProjectId: "arogyadiet",
    proofDetail:
      "customer, rider, franchise and master-admin portals on shared data.",
    proofDestination: "#work",
    // R5 color system: blue = business / customer / software.
    accent: "67,83,201", // --accent-blue
  },
  {
    id: "ai-automation",
    stage: "SCALE",
    number: "03",
    title: "AI & Automation",
    plainPromise: "Remove repetitive work and connect the pieces.",
    capabilities: [
      "AI agents",
      "Workflow automation",
      "Lead handling",
      "Follow-ups",
      "Integrations",
    ],
    body: "The intelligence layer that qualifies leads, follows up automatically and keeps opportunities from slipping.",
    ctaLabel: "Explore AI & Automation",
    // This Service_Route already exists — verified, not a future slug.
    href: "/services/ai-automation",
    hrefMode: "route",
    proofProjectId: "phixl-ai",
    proofDetail:
      "AI image restoration with credits, checkout and processing pipeline.",
    proofDestination: "#work",
    // R5 color system: violet = AI / automation / intelligence.
    accent: "124,58,237", // --accent-violet
  },
];

export const VERTICALS_SECTION = {
  eyebrow: "Three ways we can help",
  heading: "Start with what your business needs today. Build from there.",
  sub: "Three permanent capabilities, connected. Most businesses start with the first and grow into the rest.",
} as const;
