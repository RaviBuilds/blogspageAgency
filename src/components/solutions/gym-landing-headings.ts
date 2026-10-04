/**
 * Every `h2`/`h3` heading text `<GymSolutionLanding>` gives an `id`, exported
 * both individually (so the section components and the headings list share one
 * spelling) and as `GYM_LANDING_HEADINGS`, in render order.
 *
 * The parent page (a server component) uses the list to derive `id`s through
 * its single shared `createHeadingSlugger` instance and passes the result down
 * as the `headingIds` prop (Requirement 9.5), so ids are deterministic and
 * route-scoped.
 *
 * This lives in its own module (no `"use client"`, no component imports): data
 * exported from a client module does not survive the server -> client boundary
 * the way a component does, and importing an array from one into the server
 * page threw `TypeError: ... is not iterable` at request time.
 */

export const DISCOVERY_TITLE = "Discovery doesn't start at the front desk anymore.";
export const QUESTIONS_TITLE = "The questions they ask before they ask you.";
export const CHANNELS_TITLE = "Three channels. Three jobs. One member journey.";
export const WEBSITE_TITLE = "Every section has a job.";
export const GUIDANCE_TITLE =
  "Don't just tell potential members what you offer. Help them understand where to start.";
export const ENQUIRY_TITLE =
  "The website prepares the conversation. Your team takes it from there.";
export const AI_LAYER_TITLE = "Where AI fits";
export const BUILD_TITLE = "What we build for your gym.";
export const GROW_TITLE = "Your digital system can grow with your gym.";
export const LIFECYCLE_TITLE = "One member. One journey.";
export const ANSWERS_TITLE = "Straight answers.";
export const PROCESS_TITLE = "Getting started is simple.";
export const FINAL_TITLE = "See what this could look like for your gym.";
export const RELATED_TITLE = "Related reading";

export const GYM_LANDING_HEADINGS = [
  DISCOVERY_TITLE,
  QUESTIONS_TITLE,
  CHANNELS_TITLE,
  WEBSITE_TITLE,
  GUIDANCE_TITLE,
  ENQUIRY_TITLE,
  AI_LAYER_TITLE,
  BUILD_TITLE,
  GROW_TITLE,
  LIFECYCLE_TITLE,
  ANSWERS_TITLE,
  PROCESS_TITLE,
  FINAL_TITLE,
  RELATED_TITLE,
] as const;
