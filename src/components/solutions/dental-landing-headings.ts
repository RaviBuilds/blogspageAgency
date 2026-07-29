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
  "Your clinic is invisible to the patients searching for you.",
  "From invisible to fully booked.",
  "Everything a premium dental clinic needs online.",
  "The interface your patients and team actually use.",
  "How a 4-chair clinic in Jubilee Hills went from 12 to 45 enquiries per week",
  "One new patient per week pays for everything.",
  "Live in 14 days. Hands-off for you.",
  "Questions dental clinics ask before starting.",
  "Ready to become the most visible dental clinic in Hyderabad?",
  "Related reading",
] as const;
