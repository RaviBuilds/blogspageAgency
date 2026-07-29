/**
 * Every `h2` heading text `<DentalPackagesLanding>` renders, in render order.
 *
 * Same contract as `dental-landing-headings.ts`: the parent server component
 * derives `id`s through its single shared `createHeadingSlugger` instance and
 * passes the result down as the `headingIds` prop, since a function cannot
 * cross the server -> client boundary (Requirement 9.5).
 */
export const DENTAL_PACKAGES_HEADINGS = [
  "Three ways to start. One goal: more patients.",
  "Explore all five plans.",
  "Compare every plan side by side.",
  "AI that answers, books, and follows up.",
  "Optional add-ons.",
  "Simple payment terms.",
  "Not sure which plan fits your clinic?",
] as const;
