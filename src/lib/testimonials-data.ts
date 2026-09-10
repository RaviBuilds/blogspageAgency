/**
 * Testimonials data — R1.0 data foundations.
 *
 * OWNER INPUT REQUIRED (owner-input registry, item 4): the owner has
 * approximately three genuine Google Business Profile reviews. The exact
 * review text, reviewer names and dates must be supplied by the owner before
 * anything renders.
 *
 * Design contract:
 * - This array ships **empty**. `src/components/home/testimonials.tsx` renders
 *   nothing at all while it is empty — the same data-gated pattern the rest
 *   of the site uses for evidence-dependent content.
 * - Do NOT invent, paraphrase-from-memory, or "improve" review copy. Only the
 *   verbatim published text goes here.
 * - NO Review / AggregateRating structured data is derived from this file.
 *   Review schema requires a separate validated SEO plan (search-visibility
 *   blueprint §17; SEO-audit protection rules).
 *
 * Pure module: no I/O, no React, no framework imports.
 */

export type Testimonial = {
  id: string;
  /** Reviewer display name exactly as published on Google. */
  authorName: string;
  /** Initials fallback for the avatar (e.g. "RS"). */
  authorInitials: string;
  source: "google-business-profile";
  /** Star rating as published (1–5). Rendered as stars, never averaged. */
  rating: 1 | 2 | 3 | 4 | 5;
  /** Verbatim review text as published on Google. */
  quote: string;
  /** Published date, rendered as-is (e.g. "March 2026"). */
  dateLabel?: string;
  /** Link to the Google Business Profile review surface, if the owner wants one. */
  profileUrl?: string;
};

export const TESTIMONIALS: readonly Testimonial[] = [
  // OWNER INPUT REQUIRED — populated verbatim from the Google Business
  // Profile before publication. Kept empty so the section cannot render
  // placeholder or invented content.
];
