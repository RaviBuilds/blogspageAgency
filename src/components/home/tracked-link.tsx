"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/* ─────────────────────────────────────────────────────────────────────────────
   R6 — TrackedLink

   Minimal client wrapper that lets the (server-rendered) SupportingWork
   section render real `next/link` anchors while still firing the existing
   `work_cta_click` event from `src/lib/analytics.ts`. No new event types,
   no parallel tracking system — just a `cta_location` discriminator.

   Contract (from analytics.ts): call `track()` only from click handlers,
   never during render, never with PII.
   ──────────────────────────────────────────────────────────────────────────── */

type TrackedLinkProps = Omit<React.ComponentProps<typeof Link>, "onClick"> & {
  ctaLabel: string;
  ctaLocation: "featured-work" | "supporting-work";
};

export function TrackedLink({
  ctaLabel,
  ctaLocation,
  href,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      href={href}
      onClick={() =>
        trackEvent("work_cta_click", {
          cta_location: ctaLocation,
          cta_label: ctaLabel,
          destination: typeof href === "string" ? href : href.toString(),
        })
      }
    />
  );
}
