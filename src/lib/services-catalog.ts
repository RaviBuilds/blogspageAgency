/**
 * Plain-text knowledge base for the Sweety AI assistant.
 *
 * Mirrors the 10 verticals in `niches.ts` but as lightweight strings, so the
 * chat route can ground the model without pulling in icon/JSX dependencies.
 * Keep this in sync with the niche matrix when offerings change.
 */

export const AGENCY_OVERVIEW = `Blogspage is a senior product-engineering agency for Web Development, SaaS, and AI Automation. We turn high-stakes ideas into polished SaaS products, workflow automation, and internal operating systems. We typically ship production-grade builds in a focused 10-15 day launch window. Core stack: Next.js, Supabase, Stripe, Vercel, Capacitor (native iOS/Android from one codebase), and modern AI integrations.`;

type CatalogEntry = {
  title: string;
  focus: string;
  summary: string;
};

export const SERVICE_CATALOG: CatalogEntry[] = [
  {
    title: "Online Delivery",
    focus: "Escape aggregator commissions",
    summary:
      "White-label ordering PWA + real-time driver dispatch so operators keep 100% of margin and own their customers instead of renting them from aggregators (which take 25-30%).",
  },
  {
    title: "Hotel Booking",
    focus: "OTA fee mitigation",
    summary:
      "Direct booking engine with a live room matrix, atomic allocation (no double-bookings), and multi-role staff dashboards. Reclaims margin lost to OTAs.",
  },
  {
    title: "Pet Care",
    focus: "Unified service booking",
    summary:
      "A single reservation wizard for medical + lifestyle pet services against one shared pet profile, with automated reminders to cut no-shows.",
  },
  {
    title: "Consulting",
    focus: "High-value inbound authority",
    summary:
      "Authority-first site with an embedded ROI discovery calculator that lets prospects self-qualify and arrive at a discovery call already convinced.",
  },
  {
    title: "Education",
    focus: "Engagement & retention",
    summary:
      "Interactive syllabus builder + progressive course player that lifts completion rates and flags at-risk learners early.",
  },
  {
    title: "Gym & Fitness",
    focus: "Churn defense",
    summary:
      "A dynamic Pause-Credit Engine that recalculates membership contracts in real time, plus QR check-ins and owner dashboards (live occupancy, conversions). Built to defend recurring revenue from churn.",
  },
  {
    title: "Dental & Medical",
    focus: "Frictionless patient pipeline",
    summary:
      "HIPAA-aligned calendar orchestration across practitioners and rooms with self-service patient booking and automated reminders.",
  },
  {
    title: "E-commerce",
    focus: "Frictionless transactions",
    summary:
      "Speed-optimized storefront with a multi-step checkout tuned for Core Web Vitals and conversion, plus native apps via Capacitor.",
  },
  {
    title: "SaaS Platforms",
    focus: "Recurring subscriptions",
    summary:
      "Tiered pricing toggles + a metered-usage simulator, subscription lifecycle automation on Supabase with row-level security.",
  },
  {
    title: "SEO Blogs",
    focus: "Core Web Vitals",
    summary:
      "Edge-delivered MDX reading canvas engineered to rank and load instantly, with an AVIF image strategy for zero layout shift.",
  },
];

/** Renders the catalog as a compact bulleted block for the system prompt. */
export function renderServiceCatalog(): string {
  return SERVICE_CATALOG.map(
    (s) => `- ${s.title} (${s.focus}): ${s.summary}`
  ).join("\n");
}
