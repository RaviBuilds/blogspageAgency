import { track } from "@vercel/analytics";

/**
 * Homepage conversion events (§19, TASK H14).
 *
 * A union rather than a bare string: a typo in an event name becomes a
 * `tsc` build error instead of a silently lost funnel step.
 *
 * `booking_start` and `booking_complete` are deliberately absent — no
 * scheduler exists anywhere in the repository yet, so there is nothing for
 * either event to fire from (see §19, §31).
 */
export type HomepageEvent =
  | "hero_cta_click"
  | "work_cta_click"
  | "solution_cta_click"
  | "niche_card_click"
  | "problem_selector_click"
  | "contact_cta_click"
  | "chat_open"
  | "intake_form_start"
  | "lead_submitted"
  | "intake_form_error";

/**
 * Typed wrapper over `@vercel/analytics`'s `track()`.
 *
 * Never send PII (name, email, phone, free-text project description) in
 * `properties`. Call only from click/submit handlers in client components,
 * never during render and never from a server component.
 */
export function trackEvent(
  event: HomepageEvent,
  properties?: Record<string, string | number | boolean | null>,
) {
  track(event, properties);
}
