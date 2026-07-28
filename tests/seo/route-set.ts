/**
 * Route-set derivation for the SEO check suite.
 *
 * Fetches `/sitemap.xml`, extracts `<loc>` values, converts them to paths,
 * adds `/`, deduplicates, and asserts that the set contains at least one
 * `/blogs/<slug>` and one `/solutions/<slug>` route.
 *
 * Requirement 13.9: the suite derives its Route set from the URLs listed in
 * `sitemap.xml` together with the `/` Route, and includes at least one
 * `/blogs/<slug>` Route and at least one `/solutions/<slug>` Route.
 */

import { getBaseUrl, fetchWithTimeout } from "./helpers";

/**
 * Fetch `/sitemap.xml` and return the deduplicated set of route paths.
 *
 * Always includes `/` even if the sitemap omits it. Throws if the sitemap
 * cannot be fetched or if the required route patterns are missing.
 */
export async function getRouteSet(): Promise<string[]> {
  const baseUrl = getBaseUrl();
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  const response = await fetchWithTimeout(sitemapUrl);

  if (!response.ok) {
    throw new Error(
      `[route-set] Failed to fetch ${sitemapUrl}: HTTP ${response.status}`
    );
  }

  const xml = await response.text();

  // Extract all <loc> values using a simple regex.
  // The sitemap is well-formed and this pattern covers the standard shape.
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  const paths = new Set<string>();

  let match: RegExpExecArray | null;
  while ((match = locRegex.exec(xml)) !== null) {
    const loc = match[1].trim();
    try {
      const url = new URL(loc);
      // Normalize: empty pathname means the root.
      const pathname = url.pathname === "" ? "/" : url.pathname;
      // Remove trailing slash (except for root "/").
      const normalized =
        pathname.length > 1 && pathname.endsWith("/")
          ? pathname.slice(0, -1)
          : pathname;
      paths.add(normalized);
    } catch {
      // Skip malformed URLs.
    }
  }

  // Always include the root.
  paths.add("/");

  const routeSet = Array.from(paths);

  // Assert minimum content requirements.
  const hasBlogSlug = routeSet.some(
    (p) => p.startsWith("/blogs/") && !p.startsWith("/blogs/page/") && !p.startsWith("/blogs/category/") && !p.startsWith("/blogs/author/")
  );
  const hasSolutionSlug = routeSet.some((p) =>
    p.startsWith("/solutions/") && p !== "/solutions"
  );

  if (!hasBlogSlug) {
    throw new Error(
      "[route-set] No /blogs/<slug> route found in sitemap.xml. " +
        "Ensure the build produced at least one published blog post."
    );
  }

  if (!hasSolutionSlug) {
    throw new Error(
      "[route-set] No /solutions/<slug> route found in sitemap.xml. " +
        "Ensure the build produced at least one solution page."
    );
  }

  return routeSet;
}
