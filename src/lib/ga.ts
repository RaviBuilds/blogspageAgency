/**
 * Google Analytics 4 (gtag.js) identity + typed dataLayer helpers.
 *
 * `GA_MEASUREMENT_ID` is read from `NEXT_PUBLIC_GA_MEASUREMENT_ID` so it is
 * inlined at build time like any other `NEXT_PUBLIC_*` var. It is a public
 * tracking identifier, not a secret — safe to ship to the client.
 *
 * When the env var is unset (local dev without `.env.local`, a preview
 * deploy that hasn't been configured yet, etc.) every helper here becomes a
 * no-op instead of sending malformed/empty-id requests to Google, so the
 * absence of the var degrades safely rather than breaking the build or
 * polluting analytics with a blank measurement ID.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Sends a single GA4 `page_view` event for the given path.
 *
 * Deliberately calls `gtag('event', 'page_view', ...)` rather than re-issuing
 * `gtag('config', GA_MEASUREMENT_ID, ...)` on every route change: re-running
 * `config` re-triggers GA4's session/config bootstrapping on each navigation,
 * which is the documented cause of duplicated `session_start`/page_view
 * counting in SPA setups. Sending the `page_view` event directly, with an
 * explicit `send_to`, is the pattern Google's own SPA guidance recommends.
 */
export function sendPageView(url: string, title?: string) {
  if (!GA_MEASUREMENT_ID) return;
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", "page_view", {
    send_to: GA_MEASUREMENT_ID,
    page_location: window.location.href,
    page_path: url,
    page_title: title ?? document.title,
  });
}
