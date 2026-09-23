/**
 * Testimonials data — R1.0 data foundations.
 *
 * OWNER INPUT (owner-input registry, item 4): the owner supplied two genuine
 * Google Business Profile reviews. `quote` is character-for-character as
 * published — including the reviewer's own capitalisation, wording and line
 * breaks (`whitespace-pre-line` re-renders the breaks at the call site). Do
 * NOT correct spelling, grammar or word choice, and do NOT edit a quote to
 * read more strongly than the reviewer wrote it. The same applies to
 * `ownerResponse`: it is the owner's own published words, or absent.
 *
 * Design contract:
 * - `src/components/home/testimonials.tsx` renders nothing at all while this
 *   array is empty — the same data-gated pattern the rest of the site uses for
 *   evidence-dependent content.
 * - Do NOT invent, paraphrase-from-memory, or "improve" review copy. Only the
 *   verbatim published text goes here.
 * - No counts, averages or review totals are rendered from this file, and no
 *   Google API / live-sync claim is made anywhere: this module is static
 *   owner-supplied data, not a fetched or verified feed.
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
  /** Relative date exactly as Google renders it (e.g. "3 weeks ago"). */
  dateLabel?: string;
  /**
   * The owner's own published reply, verbatim. Rendered as a clearly secondary
   * block beneath the review. Leave undefined when no reply is published on
   * the profile — never draft one on the owner's behalf.
   */
  ownerResponse?: string;
  /** Link to the Google Business Profile review surface, if the owner wants one. */
  profileUrl?: string;
};

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: "dr-miftah-ur-rahman-clinic-website",
    authorName: "Dr. Miftah Ur Rahman",
    authorInitials: "MR",
    source: "google-business-profile",
    // OWNER-CONFIRM: published star rating on the profile.
    rating: 5,
    quote:
      "Mr Ravi has created very nice sophisticated website for my Clinic. Very impressive. I am happy and recommend his skilled work.",
    // OWNER-CONFIRM (reviews re-art-direction brief): the owner supplied the
    // exact published values — dateLabel and ownerResponse are
    // character-for-character as they appear on the profile.
    dateLabel: "3 weeks ago",
    ownerResponse:
      "Thank you so much, Miftah, for your kind words and for trusting me with your clinic’s website.",
  },
  {
    id: "vaibhav-sharma-automation-ai-seo",
    authorName: "Vaibhav Sharma",
    authorInitials: "VS",
    source: "google-business-profile",
    // OWNER-CONFIRM: published star rating on the profile.
    rating: 5,
    quote:
      "Would recommend this to all.\nRavindra did help me with web development of my page and has changed the entire way of billing through his automation. He has great knowledge of AI and did use his knowledge to help me with keywords search and how effectively I can use at my store to increase my audience and online traffic",
    // OWNER-CONFIRM (reviews re-art-direction brief): exact published values.
    dateLabel: "3 weeks ago",
    ownerResponse: "Thank you so much, Vaibhav! Really appreciate your kind words.",
  },
];
