"use client";

import Script from "next/script";
import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { GA_MEASUREMENT_ID, sendPageView } from "@/lib/ga";

/**
 * Fires one GA4 `page_view` per route change.
 *
 * Why this exists at all: gtag.js's own Enhanced Measurement "page changes
 * based on browser history events" listens for `pushState`/`popState`, which
 * covers plain `<a>` navigation and the browser back/forward buttons. Next.js
 * App Router navigation (`<Link>`, `router.push`) also goes through the
 * History API, so Enhanced Measurement already observes most transitions —
 * but App Router additionally mutates the route via React state/Suspense
 * without always firing a fresh `popstate`-equivalent signal gtag listens
 * for on every param-only change (e.g. paginated blog routes, category
 * filters). Watching `pathname` + `searchParams` directly and sending one
 * explicit `page_view` per resulting URL is the single source of truth here,
 * so Enhanced Measurement's history-based listener is NOT relied on in
 * addition — that combination is exactly the double-counting setup Google's
 * own SPA docs warn against.
 */
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastSentUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;

    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    // Guards against StrictMode/fast-refresh double-invocation in dev and
    // against firing twice if this effect re-runs for an unrelated reason
    // while the resolved URL hasn't actually changed.
    if (lastSentUrl.current === url) return;
    lastSentUrl.current = url;

    sendPageView(url);
  }, [pathname, searchParams]);

  return null;
}

/**
 * Global GA4 installation (gtag.js), mounted once from the root layout.
 *
 * Renders nothing visible. Two scripts, matching Google's own installation
 * snippet exactly:
 *   1. The gtag.js loader from googletagmanager.com, `strategy="afterInteractive"`
 *      so it never competes with first paint / LCP.
 *   2. The inline bootstrap that creates `dataLayer`, defines `gtag`, and
 *      issues the initial `gtag('config', ...)` — this initial config call
 *      covers the very first page load's page_view; every subsequent
 *      client-side navigation is handled by `PageViewTracker` above instead
 *      of a second `config` call.
 *
 * No-ops entirely (renders null) when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is
 * unset, so local/preview environments without the var never load a half
 * configured tag.
 *
 * `useSearchParams` requires a Suspense boundary in the App Router; the
 * boundary is local to this component so nothing upstream needs to know
 * analytics is involved.
 */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}

export default GoogleAnalytics;
