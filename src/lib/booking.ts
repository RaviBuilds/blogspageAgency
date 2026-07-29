/**
 * Provider-agnostic appointment-scheduling configuration.
 *
 * The site never ships its own booking engine. It links, embeds, or pops open
 * whatever scheduling provider a deployment configures, so swapping providers
 * is an environment change rather than a code change. Nothing here names a
 * vendor, and no vendor name reaches rendered copy — visible text always
 * describes the patient-facing benefit ("Book Appointment", "24/7 online
 * appointment booking"), never the implementation.
 *
 * Configuration, both optional:
 *
 * - `NEXT_PUBLIC_BOOKING_URL` — absolute `https` URL of the scheduling page or
 *   embeddable widget.
 * - `NEXT_PUBLIC_BOOKING_MODE` — `"modal"` (default when a URL is set),
 *   `"external"`, or `"embed"`.
 *
 * With no URL configured the mode resolves to `"contact"` and every booking
 * CTA falls back to the site's own lead-capture anchor, so the page is never
 * left with a dead control.
 *
 * Pure module: no I/O beyond reading `process.env`, no React, no throwing.
 */

/**
 * How a booking CTA behaves.
 *
 * - `embed` — the provider widget is rendered inline in the page.
 * - `modal` — the widget opens in an overlay above the current page.
 * - `external` — the CTA navigates to the provider's own booking page.
 * - `contact` — no provider configured; CTAs fall back to the lead-capture
 *   form. Google Calendar sync, confirmations, and reminders are provider
 *   features in every non-`contact` mode, which is why no flag for them
 *   exists here.
 */
export type BookingMode = "embed" | "modal" | "external" | "contact";

export type BookingConfig = {
  mode: BookingMode;
  /** Absolute provider URL. Always `undefined` when `mode` is `"contact"`. */
  url?: string;
  /** Where a `"contact"`-mode CTA (or a failed provider load) sends the visitor. */
  fallbackHref: string;
};

const VALID_MODES: readonly BookingMode[] = [
  "embed",
  "modal",
  "external",
  "contact",
];

/** `https`-only, so a misconfigured value can never downgrade the connection. */
function readProviderUrl(raw: string | undefined): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function readMode(raw: string | undefined, hasUrl: boolean): BookingMode {
  if (!hasUrl) return "contact";

  const value = raw?.trim().toLowerCase() as BookingMode | undefined;
  if (value && VALID_MODES.includes(value) && value !== "contact") return value;

  // A configured provider with no explicit mode opens in an overlay: the
  // visitor keeps their place on the page, which converts better than a
  // cross-domain navigation.
  return "modal";
}

/**
 * Resolve the booking configuration for a given page.
 *
 * `fallbackHref` is the page's own lead-capture destination, passed in rather
 * than hardcoded so each route keeps its existing contact anchor (including
 * any niche/city query it already carries).
 */
export function resolveBookingConfig(fallbackHref: string): BookingConfig {
  const url = readProviderUrl(process.env.NEXT_PUBLIC_BOOKING_URL);
  const mode = readMode(process.env.NEXT_PUBLIC_BOOKING_MODE, Boolean(url));

  return mode === "contact"
    ? { mode, fallbackHref }
    : { mode, url, fallbackHref };
}

/** Whether a real scheduling provider is wired up for this deployment. */
export function hasBookingProvider(config: BookingConfig): boolean {
  return config.mode !== "contact" && Boolean(config.url);
}
