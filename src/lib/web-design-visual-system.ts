/**
 * Web Design service page — PRESENTATION token layer.
 *
 * Scope: /services/web-design art direction only.
 *
 * ## Why this module exists, and what it is explicitly NOT
 *
 * `web-design-data.ts` is the authoritative content/data contract: every string
 * a visitor reads lives there and nothing in this file adds, edits, reorders or
 * re-scopes a single word of it. What this file carries is the *art direction*
 * for that content — which visual archetype a section's artwork uses, which
 * accent an industry preview is painted in, which failure-state motif a problem
 * card renders. None of it is copy, none of it is a claim, and none of it is
 * crawlable: every consumer renders these tokens inside `aria-hidden` artwork.
 *
 * Keeping them here rather than inline in a component is the same discipline as
 * `brand-type.ts` / `section-rhythm.ts`: ten industry previews painted from ten
 * hardcoded hex values scattered across one JSX file is how a palette drifts
 * into a rainbow. One table makes the whole arc reviewable at a glance.
 *
 * ## The colour arc is deliberately narrow
 *
 * The approved signal family is cyan → blue → violet (`globals.css`). Ten
 * industries need ten *recognisable* identities without turning the page into a
 * rainbow, so every accent below is a station on that same arc — teal, cyan,
 * brand blue, electric blue, indigo, violet, deep violet — plus one restrained
 * slate and one near-ink for the two verticals whose real-world visual language
 * is sober (consulting, editorial). No warm hues, no neon, no saturated greens.
 *
 * Pure module: no React, no I/O, no framework imports.
 */

/* -------------------------------------------------------------------------- */
/* Website preview archetypes                                                 */
/* -------------------------------------------------------------------------- */

/**
 * The layout grammar an abstract website preview is drawn with.
 *
 * Each archetype is a *structural* statement, not a skin: `commerce` is a
 * product grid with price rails, `editorial` is a reading column with a
 * sidebar, `dashboard` is a panel with a data rail. Two industries sharing an
 * accent would still be told apart by their archetype, which is the point —
 * the section has to demonstrate "we don't use one website style for every
 * business", and colour alone cannot demonstrate that.
 */
export type MockArchetype =
  | "clinical"
  | "athletic"
  | "hospitality"
  | "storefront"
  | "corporate"
  | "learning"
  | "care"
  | "commerce"
  | "dashboard"
  | "editorial";

export interface IndustryVisual {
  /** Layout grammar for the preview. */
  archetype: MockArchetype;
  /** Accent hex, drawn from the approved cyan → blue → violet arc. */
  accent: string;
  /** Very low-alpha wash behind the preview, derived from the same hue. */
  wash: string;
  /**
   * Whether the preview's hero band is inked rather than paper. Two of the ten
   * use it (fitness, SaaS) so the gallery has tonal variety without every card
   * shouting.
   */
  inked?: boolean;
}

/**
 * Keyed by `WEB_DESIGN_INDUSTRY_ROUTER.industries[].id`.
 *
 * A missing key is not a crash: consumers fall back to `INDUSTRY_VISUAL_FALLBACK`,
 * so adding an industry to the data contract degrades to a neutral brand-blue
 * corporate preview rather than an exception.
 */
export const INDUSTRY_VISUALS: Record<string, IndustryVisual> = {
  "dental-medical": {
    archetype: "clinical",
    accent: "#0E7490",
    wash: "rgba(14, 116, 144, 0.06)",
  },
  "gym-fitness": {
    archetype: "athletic",
    accent: "#4F46E5",
    wash: "rgba(79, 70, 229, 0.07)",
    inked: true,
  },
  "hotel-booking": {
    archetype: "hospitality",
    accent: "#7C3AED",
    wash: "rgba(124, 58, 237, 0.06)",
  },
  "online-delivery": {
    archetype: "storefront",
    accent: "#0F766E",
    wash: "rgba(15, 118, 110, 0.06)",
  },
  consulting: {
    archetype: "corporate",
    accent: "#334155",
    wash: "rgba(51, 65, 85, 0.05)",
  },
  education: {
    archetype: "learning",
    accent: "#4353C9",
    wash: "rgba(67, 83, 201, 0.06)",
  },
  "pet-care": {
    archetype: "care",
    accent: "#0891B2",
    wash: "rgba(8, 145, 178, 0.06)",
  },
  ecommerce: {
    archetype: "commerce",
    accent: "#6D28D9",
    wash: "rgba(109, 40, 217, 0.06)",
  },
  "saas-platform": {
    archetype: "dashboard",
    accent: "#1D4ED8",
    wash: "rgba(29, 78, 216, 0.07)",
    inked: true,
  },
  "seo-blogs": {
    archetype: "editorial",
    accent: "#1E293B",
    wash: "rgba(30, 41, 59, 0.05)",
  },
};

export const INDUSTRY_VISUAL_FALLBACK: IndustryVisual = {
  archetype: "corporate",
  accent: "#4353C9",
  wash: "rgba(67, 83, 201, 0.06)",
};

export function industryVisual(id: string): IndustryVisual {
  return INDUSTRY_VISUALS[id] ?? INDUSTRY_VISUAL_FALLBACK;
}

/* -------------------------------------------------------------------------- */
/* Failure-state motifs (Section 2 — problem diagnosis)                       */
/* -------------------------------------------------------------------------- */

/**
 * Which broken-interface motif illustrates each problem, keyed by
 * `WEB_DESIGN_PROBLEMS.cards[].id`.
 *
 * The section's job is to make the failure legible *before* the paragraph is
 * read, so each motif draws the actual defect rather than an icon standing in
 * for it: a stock-template page with every block identical, a map with the
 * business absent from the result list, a phone whose tap target is buried
 * below a cluttered fold.
 */
export type FailureMotif = "template" | "invisible" | "friction";

export const PROBLEM_MOTIFS: Record<string, FailureMotif> = {
  "template-trap": "template",
  "missing-local": "invisible",
  "conversion-friction": "friction",
};

/* -------------------------------------------------------------------------- */
/* Process stage artefacts (Section 9)                                        */
/* -------------------------------------------------------------------------- */

/**
 * The artefact drawn beside each of the five stages, keyed by
 * `WEB_DESIGN_PROCESS.steps[].step`.
 *
 * The sequence is the story: an unstyled node map becomes a greybox wireframe,
 * becomes a coloured UI, becomes a reviewed UI, becomes a live browser window.
 * Read top to bottom the artwork alone narrates idea → structure → design →
 * refinement → live website.
 */
export type StageArtifact =
  | "sitemap"
  | "wireframe"
  | "ui"
  | "review"
  | "launch";

export const PROCESS_ARTIFACTS: Record<string, StageArtifact> = {
  "01": "sitemap",
  "02": "wireframe",
  "03": "ui",
  "04": "review",
  "05": "launch",
};

/* -------------------------------------------------------------------------- */
/* Pillar accents (Sections 3–7)                                              */
/* -------------------------------------------------------------------------- */

/**
 * The three pillar accents as literal tones, for the places artwork needs a
 * value rather than a Tailwind class — SVG strokes, gradient stops, inline
 * `background` on a proportional bar.
 *
 * Values mirror the approved light-scope `--accent-*` tokens in `globals.css`.
 * They are duplicated here (and only here) because `var(--accent-blue)` cannot
 * be interpolated into an SVG `stroke` attribute or a `linear-gradient()` string
 * that also needs an alpha channel.
 */
export const PILLAR_TONE = {
  blue: "#4353C9",
  violet: "#7C3AED",
  cyan: "#0E7490",
} as const;

export type PillarAccent = keyof typeof PILLAR_TONE;

/** The same three tones lifted for a dark island surface. */
export const PILLAR_TONE_ISLAND = {
  blue: "#828FFF",
  violet: "#A78BFA",
  cyan: "#67E8F9",
} as const;

/**
 * Proportional weight of each pillar, as a percentage of the framework.
 *
 * Derived from the copy deck's own `percentage` strings ("70%", "20%", "10%")
 * rather than invented: the framework visualisation needs them as numbers to
 * size a bar, and parsing a display string at render time would put a
 * `parseInt` in the hot path of a visual that must never mis-size.
 */
export const PILLAR_WEIGHT: Record<string, number> = {
  "web-design": 70,
  branding: 20,
  "local-launch": 10,
};
