/**
 * Every `h2`/`h3` heading text `<DentalSolutionLanding>` renders, in render
 * order. The parent page (a server component) uses this to derive `id`s
 * through its single shared `createHeadingSlugger` instance and passes the
 * result down as the `headingIds` prop, since a function cannot cross the
 * server -> client boundary (Requirement 9.5).
 *
 * This lives in its own module (no `"use client"`) rather than inside
 * `dental-solution-landing.tsx` — see gym-landing-headings.ts for the
 * rationale.
 */
export const DENTAL_LANDING_HEADINGS = [
  "From single-chair clinics to multi-specialty dental hospitals.",
  "Your clinic is invisible to the patients searching for you.",
  "From invisible to fully booked.",
  "Everything a premium dental clinic needs online.",
  "The interface your patients and team actually use.",
  "How a patient finds you, trusts you, and books.",
  "A real client. A real transformation.",
  "Content and local SEO foundations, built in.",
  "Packages that fit your clinic and your budget.",
  "Live in as little as 3–5 working days. Hands-off for you.",
  "Questions dental clinics ask before starting.",
  "Ready to become the most visible dental clinic in Hyderabad?",
  "Related reading",
] as const;
