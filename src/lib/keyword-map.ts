/**
 * The keyword map: one primary keyword phrase per code-level Indexable_Route.
 *
 * This module is the machine-readable mirror of the "Keyword map" section of
 * `.kiro/specs/seo-audit-and-optimization/seo-audit-report.md`. The report is
 * the published assignment (Requirements 12.1 and 12.2); the phrases below are
 * copied from it verbatim, so a change belongs in both places or in neither.
 *
 * Two consumers:
 *
 * - `buildMetadata` in `src/lib/seo.ts` reads the phrase for the route it is
 *   building, so a title that drops its phrase is reported in development
 *   (Requirement 12.5).
 * - The check suite (task 15.3, Property 31) reads the map as its expectation
 *   for every route in the sitemap-derived route set.
 *
 * `absoluteUrl` is derived by calling `canonicalUrl(path)` rather than being
 * written by hand, because Property 31 compares these URLs against the
 * canonical each route emits, and a hand-typed URL would let the two drift.
 * `src/lib/seo.ts` imports nothing from this module at evaluation time and
 * `canonicalUrl` is a hoisted `function`, so the cycle between the two modules
 * resolves in either evaluation order.
 *
 * ## What is deliberately absent
 *
 * Post routes (`/blogs/<slug>`), category archives (`/blogs/category/<slug>`),
 * and author archives (`/blogs/author/<slug>`) carry no entry. Their phrases
 * are content data, not code: a post's phrase is the `focusKeyword` field on
 * its Sanity document, and an archive's phrase is derived from the taxonomy
 * term's own title. Audit Finding **F-07** records the `high` Finding
 * Requirement 12.8 mandates for that family, together with the observation
 * needed to close it (whether every published post carries a non-empty,
 * case-insensitively unique `focusKeyword`), because the repository cannot
 * answer it. Inventing code-level phrases for those routes here would paper
 * over F-07 rather than resolve it.
 *
 * Pure module: no I/O, no React, no framework imports.
 */

import { canonicalUrl } from "@/lib/seo";

export type KeywordAssignment = {
  /** Route path as written in the route registry, e.g. `"/"`, `"/blogs"`. */
  path: string;
  /** `canonicalUrl(path)` — the route's own absolute canonical URL. */
  absoluteUrl: string;
  /**
   * The primary keyword phrase: 2 to 8 words, 60 characters or fewer, unique
   * across the map when compared case-insensitively and trimmed
   * (Requirements 12.1, 12.6).
   */
  phrase: string;
  /**
   * The `id` of the Service_Catalog entry this route targets, for the routes
   * that target one (Requirement 12.2). Values mirror the niche ids in
   * `src/lib/niches.ts`; they are written as literals rather than imported so
   * this module stays free of the icon and React dependencies `niches.ts`
   * pulls in, and `tests/unit/keyword-map.spec.ts` guards the drift that
   * choice allows.
   *
   * The four `/services/<slug>` routes carry no id: the Service_Catalog is the
   * ten verticals, and those routes target service lines, not catalog entries.
   */
  serviceCatalogId?: string;
};

/** Requirement 12.1: word-count bounds, inclusive. */
const MIN_WORDS = 2;
const MAX_WORDS = 8;

/** Requirement 12.1: character bound, inclusive. */
const MAX_PHRASE_CHARS = 60;

type KeywordSeed = Omit<KeywordAssignment, "absoluteUrl">;

/**
 * Routes that exist at the audited commit, in the order the report lists them.
 */
const EXISTING_ROUTE_SEEDS: readonly KeywordSeed[] = [
  { path: "/", phrase: "ai automation agency" },
  { path: "/blogs", phrase: "ai automation blog" },
  { path: "/contact", phrase: "hire an ai agency in hyderabad" },
  { path: "/privacy", phrase: "blogspage privacy policy" },
  { path: "/terms", phrase: "blogspage terms of service" },
  {
    path: "/solutions/online-delivery-business-solution-website-at-hyderabad",
    phrase: "online delivery app development hyderabad",
    serviceCatalogId: "online-delivery",
  },
  {
    path: "/solutions/hotel-booking-business-solution-website-at-hyderabad",
    phrase: "hotel booking website development hyderabad",
    serviceCatalogId: "hotel-booking",
  },
  {
    path: "/solutions/pet-cares-online-business-solution-website-at-hyderabad",
    phrase: "pet care booking software hyderabad",
    serviceCatalogId: "pet-care",
  },
  {
    path: "/solutions/consulting-firm-business-solution-website-at-hyderabad",
    phrase: "consulting firm website development hyderabad",
    serviceCatalogId: "consulting",
  },
  {
    path: "/solutions/educational-platform-business-solution-website-at-hyderabad",
    phrase: "education platform development hyderabad",
    serviceCatalogId: "education",
  },
  {
    path: "/solutions/gym-business-solution-website-at-hyderabad",
    phrase: "gym management software hyderabad",
    serviceCatalogId: "gym-fitness",
  },
  {
    path: "/solutions/dental-hospital-business-solution-website-at-hyderabad",
    phrase: "dental clinic website development hyderabad",
    serviceCatalogId: "dental-medical",
  },
  {
    path: "/solutions/product-selling-online-ecommerce-website-at-hyderabad",
    phrase: "ecommerce website development hyderabad",
    serviceCatalogId: "ecommerce",
  },
  {
    path: "/solutions/subscription-saas-business-website-at-hyderabad",
    phrase: "saas platform development hyderabad",
    serviceCatalogId: "saas-platform",
  },
  {
    path: "/solutions/seo-enabled-blogs-website-at-hyderabad",
    phrase: "seo blog website development hyderabad",
    serviceCatalogId: "seo-blogs",
  },
];

/**
 * Routes added by the remediation. They are not Indexable_Routes at the
 * audited commit, and they are listed here rather than deferred because
 * Requirement 12.5 needs their phrases available to `buildMetadata` on the
 * commit that ships each route (tasks 10.1, 10.2, 10.3) — not one commit
 * later.
 */
const PLANNED_ROUTE_SEEDS: readonly KeywordSeed[] = [
  { path: "/about", phrase: "about blogspage ai agency" },
  { path: "/solutions", phrase: "ai business solutions by industry" },
  { path: "/services/ai-automation", phrase: "ai workflow automation services" },
  { path: "/services/ai-sales-agents", phrase: "ai sales agent development" },
  {
    path: "/services/custom-saas-development",
    phrase: "custom saas development company",
  },
  { path: "/services/programmatic-seo", phrase: "programmatic seo services" },
];

/**
 * The keyword map. Ordered existing routes first, then the routes this feature
 * adds, matching the report's two tables.
 */
export const KEYWORD_MAP: readonly KeywordAssignment[] = [
  ...EXISTING_ROUTE_SEEDS,
  ...PLANNED_ROUTE_SEEDS,
].map((seed) => ({ ...seed, absoluteUrl: canonicalUrl(seed.path) }));

/* -------------------------------------------------------------------------- */
/* Module-load invariants (Requirements 12.1, 12.6)                            */
/* -------------------------------------------------------------------------- */

/** Comparison key for Requirement 12.6: case-insensitive, trimmed. */
function phraseKey(phrase: string): string {
  return phrase.trim().toLowerCase();
}

function wordCount(phrase: string): number {
  const trimmed = phrase.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

// Mirrors the check in `src/lib/cities.ts`: an edit that breaks a published
// bound fails the build rather than shipping a duplicate assignment.
{
  const seenPhrases = new Map<string, string>();
  const seenUrls = new Map<string, string>();

  for (const entry of KEYWORD_MAP) {
    const words = wordCount(entry.phrase);
    if (words < MIN_WORDS || words > MAX_WORDS) {
      throw new Error(
        `Keyword phrase for ${entry.path} has ${words} words; Requirement 12.1 allows ${MIN_WORDS} to ${MAX_WORDS}: "${entry.phrase}".`,
      );
    }

    if (entry.phrase.length > MAX_PHRASE_CHARS) {
      throw new Error(
        `Keyword phrase for ${entry.path} is ${entry.phrase.length} characters; Requirement 12.1 allows ${MAX_PHRASE_CHARS} or fewer: "${entry.phrase}".`,
      );
    }

    const key = phraseKey(entry.phrase);
    const clash = seenPhrases.get(key);
    if (clash !== undefined) {
      throw new Error(
        `Keyword phrase "${entry.phrase}" is assigned to both ${clash} and ${entry.path}; Requirement 12.6 allows at most one route per phrase.`,
      );
    }
    seenPhrases.set(key, entry.path);

    const urlClash = seenUrls.get(entry.absoluteUrl);
    if (urlClash !== undefined) {
      throw new Error(
        `Routes ${urlClash} and ${entry.path} canonicalise to the same URL ${entry.absoluteUrl}; each route may hold at most one assignment.`,
      );
    }
    seenUrls.set(entry.absoluteUrl, entry.path);

    // `canonicalUrl` is total, so an empty result means the cycle with
    // `src/lib/seo.ts` failed to resolve and every lookup would silently miss.
    if (!entry.absoluteUrl.startsWith("https://")) {
      throw new Error(
        `Keyword map entry for ${entry.path} has no absolute URL; canonicalUrl returned "${entry.absoluteUrl}".`,
      );
    }
  }
}

/**
 * The primary keyword phrase assigned to a route, or `null` for a route whose
 * phrase is content-derived (see the F-07 note above) or unmapped.
 *
 * Keyed on `canonicalUrl(path)` so `"/Blogs"`, `"/blogs/"`, and
 * `"https://blogspage.com/blogs?x=1"` all resolve to the same assignment.
 */
export function findKeywordPhrase(path: string): string | null {
  const url = canonicalUrl(path);
  return KEYWORD_MAP.find((entry) => entry.absoluteUrl === url)?.phrase ?? null;
}
