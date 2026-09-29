/**
 * Web Development service page — PRESENTATION token layer.
 *
 * Scope: /services/web-development art direction only.
 *
 * ## Why this module exists, and what it is explicitly NOT
 *
 * `web-development-data.ts` is the authoritative content/data contract. This
 * file carries only the *art direction* for that content: which accent an
 * architecture layer or capability group is drawn in, which motif a proof
 * project's "primary capability" pairs with. None of it is copy, none of it
 * is crawlable — every consumer renders these tokens inside `aria-hidden`
 * artwork or as decorative fills behind real text.
 *
 * ## Visual identity vs. Web Design
 *
 * Web Design's arc is cyan → blue → violet, applied to browser/interface
 * mockups. This page needs to look unmistakably different while staying
 * inside the same brand system, so it reuses the identical three brand hues
 * (never introducing a fourth palette) but applies them to a different visual
 * grammar entirely: system nodes, data-flow lines, RBAC doors, lifecycle
 * chips and dashboard fragments — never a browser chrome or a phone frame.
 * "Premium engineering blueprint", per the canonical spec's visual direction.
 *
 * Pure module: no React, no I/O, no framework imports.
 */

/* -------------------------------------------------------------------------- */
/* Core accents (shared with the brand system, reused — not reinvented)      */
/* -------------------------------------------------------------------------- */

export const SYSTEM_TONE = {
  blue: "#4353C9",
  violet: "#7C3AED",
  cyan: "#0E7490",
} as const;

export type SystemAccent = keyof typeof SYSTEM_TONE;

/**
 * The same three hues lifted for the page's **dark island** (section 04).
 *
 * Not a fourth palette: these are the exact stops `BRAND_TEXT_GRADIENT_ISLAND`
 * in `brand-type.ts` already uses for a brand phrase on ink. They exist here
 * because the paper values measure far too dark against `--surface-dark` —
 * #0E7490 on #0B0E14 is barely a border, let alone a readable label — and a
 * diagram whose lines cannot be seen is not a diagram.
 *
 * Keyed identically to `SYSTEM_TONE`, so a consumer switches surface by
 * swapping the table rather than by re-mapping every layer id.
 */
export const SYSTEM_TONE_ON_DARK: Record<SystemAccent, string> = {
  blue: "#828FFF",
  violet: "#A78BFA",
  cyan: "#67E8F9",
};

/* -------------------------------------------------------------------------- */
/* Architecture layer accents (Section 04)                                   */
/* -------------------------------------------------------------------------- */

/**
 * One accent per architecture layer, keyed by
 * `WEB_DEVELOPMENT_ARCHITECTURE.layers[].id`. Cycles through the three brand
 * hues rather than inventing new ones — nine layers, three hues, so the
 * pattern is legible as a repeating system rather than a rainbow.
 */
export const ARCHITECTURE_LAYER_ACCENT: Record<string, SystemAccent> = {
  frontend: "blue",
  backend: "violet",
  data: "cyan",
  auth: "blue",
  apis: "violet",
  payments: "cyan",
  cms: "blue",
  notifications: "violet",
  ai: "cyan",
};

/* -------------------------------------------------------------------------- */
/* Proof project accents (Section 05)                                       */
/* -------------------------------------------------------------------------- */

export type ProofMotif = "roles" | "booking-lifecycle" | "ai-pipeline";

/**
 * Which system motif each proof project's architecture fragment draws,
 * keyed by `WEB_DEVELOPMENT_PROOF.projects[].id`.
 *
 * - `roles` — three doors (customer / rider / admin) converging on one
 *   system, for ArogyaDiet's multi-role claim.
 * - `booking-lifecycle` — a request moving through states, for NextInn's
 *   booking/operations claim.
 * - `ai-pipeline` — upload → processing → result → credits, for Phixl AI's
 *   product/MVP claim.
 */
export const PROOF_MOTIF: Record<string, ProofMotif> = {
  arogyadiet: "roles",
  nextinn: "booking-lifecycle",
  "phixl-ai": "ai-pipeline",
};

export const PROOF_ACCENT: Record<string, string> = {
  arogyadiet: "#0F766E",
  nextinn: "#7C3AED",
  "phixl-ai": "#4353C9",
};

/* -------------------------------------------------------------------------- */
/* Capability group accents (Section 06)                                     */
/* -------------------------------------------------------------------------- */

export const CAPABILITY_GROUP_ACCENT: Record<string, SystemAccent> = {
  capture: "blue",
  transact: "cyan",
  operate: "violet",
  connect: "blue",
  extend: "violet",
};

/* -------------------------------------------------------------------------- */
/* Trust pillar accents (Section 07)                                         */
/* -------------------------------------------------------------------------- */

export const TRUST_PILLAR_ACCENT: Record<string, SystemAccent> = {
  security: "blue",
  performance: "cyan",
  ownership: "violet",
  evolution: "blue",
};

/* -------------------------------------------------------------------------- */
/* Capability ladder rung weight (Section 03)                               */
/* -------------------------------------------------------------------------- */

/**
 * Visual "system complexity" weight per rung, 1 (simplest) to 5 (most
 * complex) — drives the rising-bar/step motif behind the ladder so the
 * ascending shape communicates complexity without any invented percentage.
 */
export const LADDER_WEIGHT: Record<string, number> = {
  "business-website": 1,
  transactions: 2,
  "web-application": 3,
  "business-platform": 4,
  "saas-mvp": 5,
};

export function alpha(hex: string, a: number): string {
  const v = hex.replace("#", "");
  const full =
    v.length === 3
      ? v
          .split("")
          .map((c) => c + c)
          .join("")
      : v;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
