/**
 * Every `h2`/`h3` heading text `<GymSolutionLanding>` renders, in render
 * order. The parent page (a server component) uses this to derive `id`s
 * through its single shared `createHeadingSlugger` instance and passes the
 * result down as the `headingIds` prop, since a function cannot cross the
 * server -> client boundary (Requirement 9.5).
 *
 * This lives in its own module (no `"use client"`) rather than inside
 * `gym-solution-landing.tsx`: React Server Components proxy every export of
 * a `"use client"` module for use as an opaque JSX component reference, and
 * a plain data constant does not survive that boundary the same way a
 * component does. Importing this array from the client module into the
 * server page threw `TypeError: ... is not iterable` at request time.
 */
export const GYM_LANDING_HEADINGS = [
  "One connected platform. Four systems working as one.",
  "Website & AI Sales Agent",
  "Member Portal & App",
  "Operations Command Center",
  "Executive Analytics",
  "Build the operating system your club deserves.",
  "Frequently asked questions",
  "Related reading",
] as const;
