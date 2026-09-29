import { describe, expect, it } from "vitest";

import { ALL_ROUTES } from "@/lib/routes";
import {
  WEB_DESIGN_INDUSTRY_ROUTER,
  WEB_DESIGN_META,
  WEB_DESIGN_PROOF,
} from "@/lib/web-design-data";

/**
 * WEB DESIGN PAGE — outbound internal links must resolve to served routes.
 *
 * ## The defect class this pins down
 *
 * `web-design-data.ts` hand-writes the `/solutions/<slug>` path for each of the
 * ten industry tiles and each proof project. It cannot import
 * `src/lib/niches.ts` to derive them, because that module carries Lucide icon
 * values and the copy deck is contractually framework-free — so the slugs are
 * literals, and literals drift.
 *
 * Three of the ten had drifted:
 *
 *   food-delivery-business-solution-website-at-hyderabad
 *   consulting-agency-business-solution-website-at-hyderabad
 *   pet-care-business-solution-website-at-hyderabad
 *
 * None of these is produced by `allNicheParams()`, so all three tiles rendered
 * a `<Link>` to a 404. Nothing caught it: a bad `href` is valid JSX, passes
 * `tsc`, passes lint, builds, and ships content-complete HTML — the SSR
 * visibility audit reads the served markup of *this* page and never follows an
 * anchor out of it. The failure surfaces only when a visitor clicks, which on a
 * commercial service page is the worst possible place to discover it.
 *
 * ## Why it asserts against `ALL_ROUTES`
 *
 * `ALL_ROUTES` is the registry every route module, the sitemap and `llms.txt`
 * already agree on (`src/lib/routes.ts`), and `solutionRoutes()` builds it from
 * `allNicheParams()` — the same generator `generateStaticParams` uses. A path
 * absent from it is a path the site does not serve. Comparing against a
 * hand-maintained list of expected slugs here would just reintroduce the
 * original defect one file over.
 */
describe("web design page — outbound internal links", () => {
  const servedPaths = new Set(ALL_ROUTES.map((route) => route.path));

  it("is registered as a served route itself", () => {
    expect(servedPaths.has(WEB_DESIGN_META.path)).toBe(true);
  });

  it("points every industry tile at a route the site serves", () => {
    const unresolved = WEB_DESIGN_INDUSTRY_ROUTER.industries
      .filter((industry) => !servedPaths.has(industry.route))
      .map((industry) => `${industry.id} -> ${industry.route}`);

    expect(
      unresolved,
      "These industry routes are not in the route registry, so the tiles 404. " +
        "Check the niche's `slugTemplate` in src/lib/niches.ts for the real slug.",
    ).toEqual([]);
  });

  it("points every proof project at a route the site serves", () => {
    const unresolved = WEB_DESIGN_PROOF.projects
      .filter((project) => !servedPaths.has(project.route))
      .map((project) => `${project.id} -> ${project.route}`);

    expect(
      unresolved,
      "These proof-project routes are not in the route registry, so the " +
        "case-study links 404.",
    ).toEqual([]);
  });

  it("shows ten industries, each with a distinct destination", () => {
    const routes = WEB_DESIGN_INDUSTRY_ROUTER.industries.map((i) => i.route);
    expect(routes).toHaveLength(10);
    expect(
      new Set(routes).size,
      "two industry tiles resolve to the same solution page",
    ).toBe(10);
  });
});
