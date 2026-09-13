/**
 * R7 — Industry Solution Discovery: presentation-layer story map.
 *
 * The smallest possible presentation mapping for the homepage's industry
 * discovery section (`BentoGrid`). This module deliberately holds **no**
 * routes, no slugs, no city data, no SEO copy and no niche descriptions —
 * everything that identifies a business stays owned by `src/lib/niches.ts`
 * (the programmatic-SEO Service_Catalog). This map only adds:
 *
 * - a three-node conceptual micro-story per industry (supplementary visual
 *   device; the business title remains the primary recognition element),
 * - how each of the three R5 capabilities applies to that business, keyed by
 *   `HomeVerticalId`. Absent keys fall back to that vertical's approved
 *   `plainPromise` at render time, so nothing is claimed that the verified
 *   solution data does not support,
 * - the verified project→industry proof relationship (`featured-work-data.ts`
 *   id), only where one actually exists. Gym & Fitness has no real project,
 *   so it carries no proof — never an invented association,
 * - the stage accent (`r,g,b`) reusing the R6 project accents for continuity;
 *   industries without one stay on the neutral blue default.
 *
 * `[OWNER APPROVAL REQUIRED]` — the micro-story labels and per-industry
 * capability lines below are new presentation copy, paraphrased from each
 * niche's verified `solution.capabilities` / dashboards in `niches.ts`. The
 * section heading/eyebrow/sub remain the canonically approved Blueprint §15
 * wording (Master Blueprint v2.0 §15) — this module does not touch them.
 *
 * Pure module: no I/O, no React, no framework imports.
 */

import type { HomeVerticalId } from "@/lib/homepage-verticals";

export type IndustryStory = {
  /** Three-node conceptual chain rendered as a decorative strip. */
  story: readonly [string, string, string];
  /**
   * How each capability applies to this business. Keys are `HomeVerticalId`s;
   * a missing key falls back to that vertical's approved `plainPromise`.
   */
  capabilities: Partial<Record<HomeVerticalId, string>>;
  /**
   * Verified `featured-work-data.ts` project id used as the proof line.
   * Omitted when no real project supports the industry (never invented).
   */
  proofProjectId?: string;
  /**
   * Raw `r,g,b` stage accent for the selected-state wash and signal line.
   * Omitted → `DEFAULT_INDUSTRY_ACCENT` (neutral blue).
   */
  accent?: string;
};

/** Neutral stage color for industries without an R6 accent continuity. */
export const DEFAULT_INDUSTRY_ACCENT = "67,83,201"; // --accent-blue

export const INDUSTRY_STORIES: Readonly<Record<string, IndustryStory>> = {
  "online-delivery": {
    story: ["Website", "Order", "Dispatch"],
    capabilities: {
      "brand-digital-presence":
        "A white-label ordering experience your customers belong to.",
      "applications-software":
        "Direct checkout and a real-time dispatch map you fully own.",
    },
    proofProjectId: "arogyadiet",
    accent: "16,185,129",
  },
  "hotel-booking": {
    story: ["Website", "Room", "Booking"],
    capabilities: {
      "brand-digital-presence":
        "A site that wins direct bookings instead of OTA traffic.",
      "applications-software":
        "A live room matrix and role-based dashboards for every tier of staff.",
    },
    proofProjectId: "nextinn",
    accent: "56,189,248",
  },
  "pet-care": {
    story: ["Pet profile", "Booking", "Reminders"],
    capabilities: {
      "applications-software":
        "One reservation wizard for every service, on a shared pet profile.",
      "ai-automation":
        "Automated reminders that keep booked slots from turning into no-shows.",
    },
  },
  consulting: {
    story: ["Authority", "ROI tool", "Discovery call"],
    capabilities: {
      "brand-digital-presence":
        "An authority-first content architecture for high-value inbound.",
      "applications-software":
        "An embedded ROI calculator wired straight into your call pipeline.",
    },
  },
  education: {
    story: ["Lessons", "Progress", "Completion"],
    capabilities: {
      "applications-software":
        "A syllabus builder and progressive player that keep momentum high.",
      "ai-automation":
        "Progress tracking that flags at-risk learners before they drop off.",
    },
  },
  "gym-fitness": {
    story: ["Member", "Pause-credit", "Retention"],
    capabilities: {
      "brand-digital-presence":
        "A high-conversion front door that turns interest into sign-ups.",
      "applications-software":
        "A pause-credit ledger and live occupancy dashboards for owners.",
      "ai-automation":
        "Re-engagement alerts that reach members before they lapse.",
    },
  },
  "dental-medical": {
    story: ["Website", "Appointment", "Patient"],
    capabilities: {
      "brand-digital-presence":
        "A premium presence that builds trust and ranks locally.",
      "applications-software":
        "Online booking and a command centre your front desk runs on.",
      "ai-automation":
        "Automated reminders and instant answers that cut no-shows.",
    },
    proofProjectId: "neodent",
    accent: "14,116,144",
  },
  ecommerce: {
    story: ["Storefront", "Checkout", "Order"],
    capabilities: {
      "brand-digital-presence":
        "A fast, image-optimized storefront tuned for Core Web Vitals.",
      "applications-software":
        "Payments and fulfillment running in one pipeline.",
    },
  },
  "saas-platform": {
    story: ["Product", "Tiers", "Subscribers"],
    capabilities: {
      "applications-software":
        "Tiered pricing toggles and a transparent metered-usage simulator.",
    },
  },
  "seo-blogs": {
    story: ["Content", "Edge delivery", "Search"],
    capabilities: {
      "brand-digital-presence":
        "An edge-cached reading canvas tuned for Core Web Vitals.",
      "applications-software":
        "A headless backend and a statically-fast publishing catalog.",
    },
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