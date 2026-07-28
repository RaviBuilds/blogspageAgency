/**
 * The route registry: one place enumerating every code-level Route the site
 * commits to serving, as descriptors carrying a path, an absolute canonical
 * URL, and a display label.
 *
 * Three consumers read this module and none of them exist yet:
 *
 * - `src/app/sitemap.ts` (task 12.2) composes `sitemap.xml` from `ALL_ROUTES`
 *   plus the Sanity-backed post and archive routes, instead of the inline
 *   literal array it uses today (Requirements 6.1, 6.2).
 * - `src/app/llms.txt/route.ts` (task 10.8) reads `STATIC_ROUTES` for the six
 *   absolute URLs Requirement 9.2 requires it to state.
 * - The navbar and the footer (task 10.5) read `STATIC_ROUTES` and
 *   `serviceRoutes()` for their link inventory, so `/solutions`,
 *   `/services/<slug>`, and `/about` are linked from one source instead of
 *   the `/#solutions` and `/#services` anchors Findings F-1x and F-2x record.
 *
 * This module does not itself decide *indexability* — a solution route with
 * an unapproved city token, a `noindex` post, or anything beneath `/studio`
 * is a separate concern the sitemap task filters for. This module only
 * answers "what routes does the code commit to serving", which is why the
 * shape stays a plain descriptor rather than growing an `indexable` flag it
 * cannot know the answer to.
 *
 * Pure module: no I/O, no React, no Next.js imports. `src/lib/niches.ts` is
 * imported for its data (`allNicheParams`, `resolveSolutionSlug`), which
 * pulls in Lucide icon *values* as part of `Niche`, but this module never
 * imports React itself and renders nothing.
 */

import { canonicalUrl } from "@/lib/seo";
import { allNicheParams, resolveSolutionSlug } from "@/lib/niches";
import { SERVICE_ROUTES, type ServiceRoute } from "@/lib/service-routes";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * A single Route the site commits to serving.
 *
 * `path` is the relative form (`"/"`, `"/about"`, `"/solutions/<slug>"`) that
 * a Next.js `<Link href>` or route module expects. `absoluteUrl` is always
 * `canonicalUrl(path)`, so a consumer never has to re-derive it and, more
 * importantly, can never compute a URL that disagrees with the one the route
 * itself emits as its canonical (Requirement 6.2). `label` is the anchor text
 * a nav, footer, or hub page renders for the route.
 */
export type RouteDescriptor = {
  /** Relative route path, e.g. `"/"`, `"/about"`, `"/solutions/<slug>"`. */
  path: string;
  /** `canonicalUrl(path)` — the route's own absolute, canonical URL. */
  absoluteUrl: string;
  /** Anchor text for nav, footer, and hub-page rendering. */
  label: string;
};

/** A {@link RouteDescriptor} for one of the four dedicated Service_Routes. */
export type ServiceRouteDescriptor = RouteDescriptor & {
  /** The `ServiceRoute.id` this descriptor was derived from. */
  serviceRouteId: ServiceRoute["id"];
};

/**
 * A {@link RouteDescriptor} for one `/solutions/<slug>` Route: a
 * Service_Catalog niche paired with an Approved_City_List token.
 */
export type SolutionRouteDescriptor = RouteDescriptor & {
  /** The `Niche.id` this descriptor was derived from, from `src/lib/niches.ts`. */
  nicheId: string;
  /** The `ApprovedCity.token` this descriptor was derived from. */
  cityToken: string;
};

/* -------------------------------------------------------------------------- */
/* Static routes (Requirements 6.1, 9.2)                                       */
/* -------------------------------------------------------------------------- */

/**
 * Descriptors for the seven Routes that carry no generator: the root, the
 * about page, the blog index, the solutions hub, and the three legal pages.
 *
 * Labels match the anchor text already published in
 * `src/components/layout/footer.tsx` where an equivalent link exists today
 * ("Blog", "Contact", "Privacy Policy", "Terms of Service"), so task 10.5
 * repointing the footer at this registry changes no visible copy.
 *
 * This list is exactly the six Routes Requirement 9.2 names for `llms.txt`
 * plus `/about`, which `llms.txt` does not state. Task 10.8 filters this list
 * down rather than hand-typing its own six URLs, so the two cannot drift.
 */
export const STATIC_ROUTES: readonly RouteDescriptor[] = (
  [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/blogs", label: "Blog" },
    { path: "/solutions", label: "Solutions" },
    { path: "/contact", label: "Contact" },
    { path: "/privacy", label: "Privacy Policy" },
    { path: "/terms", label: "Terms of Service" },
  ] as const
).map((route) => ({ ...route, absoluteUrl: canonicalUrl(route.path) }));

/* -------------------------------------------------------------------------- */
/* Service routes (Requirement 6.1)                                            */
/* -------------------------------------------------------------------------- */

/**
 * Short anchor labels for the four Service_Routes, matching the copy already
 * published in the footer's "Solutions" column (currently pointed at
 * `/#services`, Finding F-2x). `ServiceRoute` itself carries no short label —
 * `h1` and `keywordPhrase` are both too long for a nav pill — so this map is
 * display metadata owned by the registry, not a duplicate of the service
 * content in `src/lib/service-routes.ts`.
 */
const SERVICE_ROUTE_LABELS: Readonly<Record<ServiceRoute["id"], string>> = {
  "ai-automation": "Workflow Automation",
  "ai-sales-agents": "AI Sales Agents",
  "custom-saas-development": "Custom SaaS",
  "programmatic-seo": "Programmatic SEO",
};

/**
 * The four Service_Route descriptors, one per entry in
 * `SERVICE_ROUTES` (`src/lib/service-routes.ts`). Derives `path` from
 * `route.slug` rather than restating it, so a slug change in the source
 * module needs no matching edit here.
 */
export function serviceRoutes(): readonly ServiceRouteDescriptor[] {
  return SERVICE_ROUTES.map((route) => {
    const path = `/services/${route.slug}`;
    return {
      path,
      absoluteUrl: canonicalUrl(path),
      label: SERVICE_ROUTE_LABELS[route.id],
      serviceRouteId: route.id,
    };
  });
}

/* -------------------------------------------------------------------------- */
/* Solution routes (Requirements 6.1, 7.1)                                     */
/* -------------------------------------------------------------------------- */

/**
 * Every indexable `/solutions/<slug>` Route: the Service_Catalog crossed with
 * the Approved_City_List.
 *
 * The cross product itself is not recomputed here — `allNicheParams()` in
 * `src/lib/niches.ts` is the single owner of that logic (Requirement 3.4).
 * This function only turns each generated slug into a descriptor, resolving
 * it back through `resolveSolutionSlug` to read the niche title and the
 * city's display name for `label`.
 *
 * `resolveSolutionSlug` returning `null` for a slug `allNicheParams` itself
 * produced would mean the generator and the resolver have fallen out of sync
 * — exactly the defect Property 30 exists to catch. Throwing here surfaces
 * that at build time rather than shipping a hub page anchor that 404s.
 */
export function solutionRoutes(): readonly SolutionRouteDescriptor[] {
  return allNicheParams().map(({ slug }) => {
    const match = resolveSolutionSlug(slug);
    if (!match) {
      throw new Error(
        `allNicheParams() produced slug "${slug}", which resolveSolutionSlug() does not resolve. The generator and the resolver have fallen out of sync.`,
      );
    }

    const path = `/solutions/${slug}`;
    return {
      path,
      absoluteUrl: canonicalUrl(path),
      label: `${match.niche.title} in ${match.city.displayName}`,
      nicheId: match.niche.id,
      cityToken: match.city.token,
    };
  });
}

/* -------------------------------------------------------------------------- */
/* Aggregate (Requirements 6.1, 6.2, 7.1, 9.2)                                 */
/* -------------------------------------------------------------------------- */

/**
 * Every code-level Route this registry knows about: the static Routes, the
 * four Service_Routes, and every solution Route.
 *
 * This is not the full sitemap input — it carries no Sanity-backed post,
 * category archive, or author archive Route, since those depend on content
 * this pure module cannot fetch. `src/app/sitemap.ts` (task 12.2) unions this
 * list with its own content-backed entries; `llms.txt` and the nav/footer
 * tasks only need the subset this list already provides.
 *
 * Computed once at module evaluation, matching `KEYWORD_MAP` in
 * `src/lib/keyword-map.ts`: every input (`STATIC_ROUTES`, the service
 * catalog, the niche/city cross product) is fixed at build time, so there is
 * nothing a lazy getter would buy.
 */
export const ALL_ROUTES: readonly RouteDescriptor[] = [
  ...STATIC_ROUTES,
  ...serviceRoutes(),
  ...solutionRoutes(),
];

// Module-load invariant (Requirement 6.1: "no duplicate location values").
// Mirrors the checks in `src/lib/cities.ts` and `src/lib/keyword-map.ts`: a
// registry entry that collides with another fails the build immediately
// rather than shipping a sitemap with a repeated `<loc>`.
{
  const seenPaths = new Map<string, string>();

  for (const route of ALL_ROUTES) {
    const clash = seenPaths.get(route.path);
    if (clash !== undefined) {
      throw new Error(
        `Duplicate route path "${route.path}" in the route registry (already registered via "${clash}").`,
      );
    }
    seenPaths.set(route.path, route.path);

    if (!route.absoluteUrl.startsWith("https://")) {
      throw new Error(
        `Route "${route.path}" has no absolute URL; canonicalUrl returned "${route.absoluteUrl}".`,
      );
    }
  }
}
