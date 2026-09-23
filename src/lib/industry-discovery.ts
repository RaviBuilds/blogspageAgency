/**
 * R7 -- Industry Solution Discovery: presentation-layer story map.
 *
 * R7.1 (owner-approved): the repeated three-column capability treatment is
 * REMOVED. Each industry now owns:
 *
 * - a three-node system flow (supplementary; the panel renders it as the
 *   Website -> Process -> Outcome row),
 * - a visual discriminator: `kind: "real"` for the three industries with
 *   VERIFIED owner-supplied project screenshots (rendered as authentic
 *   proof -- never recolored or restyled), `kind: "concept"` for the seven
 *   industries whose visuals are clearly conceptual product/system
 *   representations (they must never imply client work),
 * - the verified project->industry proof relationship, only where one
 *   exists. Gym & Fitness has no real project, so it carries no proof.
 *
 * All business copy (problem eyebrow, outcome headline, description) is NOT
 * stored here: it renders straight from the verified `NICHES` catalog
 * (`focus`, `hero.headline`, `description`) so no second source of truth and
 * no generic fallback copy can exist.
 *
 * This module holds no routes, no slugs, no city data, no SEO copy.
 * Pure module: no I/O, no React, no framework imports.
 */

export type IndustryVisual =
  | {
      /** Verified owner-supplied project screenshot (authentic proof). */
      kind: "real";
      image: string;
      alt: string;
      width: number;
      height: number;
    }
  | {
      /** Conceptual product/system representation (not client work). */
      kind: "concept";
    };

export type IndustryStory = {
  /** Three-node conceptual chain rendered as the system flow row. */
  story: readonly [string, string, string];
  /** The panel's main visual artifact. */
  visual: IndustryVisual;
  /**
   * Verified `featured-work-data.ts` project id used as the proof line.
   * Omitted when no real project supports the industry (never invented).
   */
  proofProjectId?: string;
  /** Raw `r,g,b` stage accent; omitted -> DEFAULT_INDUSTRY_ACCENT. */
  accent?: string;
};

/** Neutral stage color for industries without an R6 accent continuity. */
export const DEFAULT_INDUSTRY_ACCENT = "67,83,201"; // --accent-blue

export const INDUSTRY_STORIES: Readonly<Record<string, IndustryStory>> = {
  "online-delivery": {
    story: ["Website", "Order", "Dispatch"],
    visual: {
      kind: "real",
      image: "/ArogyaDiet.jpg",
      alt: "Real work: ArogyaDiet Ecosystem -- customer ordering, rider tracking and admin dashboards.",
      width: 1263,
      height: 935,
    },
    proofProjectId: "arogyadiet",
    accent: "16,185,129",
  },
  "hotel-booking": {
    story: ["Website", "Room", "Booking"],
    visual: {
      kind: "real",
      image: "/NextInn.jpg",
      alt: "Real work: NextInn Booking & Operations -- direct booking with staff dashboards.",
      width: 1263,
      height: 923,
    },
    proofProjectId: "nextinn",
    accent: "56,189,248",
  },
  "pet-care": {
    story: ["Pet profile", "Booking", "Reminders"],
    visual: { kind: "concept" },
  },
  consulting: {
    story: ["Authority", "ROI tool", "Discovery call"],
    visual: { kind: "concept" },
  },
  education: {
    story: ["Lessons", "Progress", "Completion"],
    visual: { kind: "concept" },
  },
  "gym-fitness": {
    story: ["Member", "Pause-credit", "Retention"],
    visual: { kind: "concept" },
  },
  "dental-medical": {
    story: ["Website", "Appointment", "Patient"],
    visual: {
      kind: "real",
      image: "/Neodent.jpg",
      alt: "Real work: NeoDent Dental Hospitals -- brand presence and patient enquiry website.",
      width: 1261,
      height: 834,
    },
    proofProjectId: "neodent",
    accent: "14,116,144",
  },
  ecommerce: {
    story: ["Storefront", "Checkout", "Order"],
    visual: { kind: "concept" },
  },
  "saas-platform": {
    story: ["Product", "Tiers", "Subscribers"],
    visual: { kind: "concept" },
  },
  "seo-blogs": {
    story: ["Content", "Edge delivery", "Search"],
    visual: { kind: "concept" },
  },
};

/**
 * Look up the presentation story for a niche id. Returns `null` for an
 * unknown id so the rendering component can fall back to the verified niche
 * data alone (no invented story, no crash).
 */
export function getIndustryStory(nicheId: string): IndustryStory | null {
  return INDUSTRY_STORIES[nicheId] ?? null;
}
