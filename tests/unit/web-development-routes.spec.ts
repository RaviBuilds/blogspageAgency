import { describe, expect, it } from "vitest";

import { ALL_ROUTES } from "@/lib/routes";
import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  TITLE_MAX,
  TITLE_MIN,
  clampDescription,
} from "@/lib/seo";
import {
  WEB_DEVELOPMENT_CAPABILITIES,
  WEB_DEVELOPMENT_CAPABILITY_LADDER,
  WEB_DEVELOPMENT_DESIGN_VS_DEV,
  WEB_DEVELOPMENT_FAQS_HEADING,
  WEB_DEVELOPMENT_FINAL_CTA,
  WEB_DEVELOPMENT_META,
  WEB_DEVELOPMENT_PROOF,
} from "@/lib/web-development-data";

/**
 * WEB DEVELOPMENT PAGE — outbound internal links must resolve to served routes.
 *
 * Mirrors `tests/unit/web-design-routes.spec.ts`: `web-development-data.ts`
 * hand-writes route strings rather than importing the route registry (the copy
 * deck is contractually framework-free), so a literal can drift from what the
 * site actually serves. This test compares every outbound link against
 * `ALL_ROUTES` — the one registry every route module, the sitemap and
 * `llms.txt` already agree on — rather than against a second hand-maintained
 * expectation list.
 *
 * The link set grew during the final polish pass (the contextual AI-automation
 * hand-off, the FAQ's SaaS cross-link, and the closing band's contact route), so
 * the assertion is written over *every* route-bearing field in the deck rather
 * than over an enumerated subset that the next addition would silently escape.
 */
describe("web development page — outbound internal links", () => {
  const servedPaths = new Set(ALL_ROUTES.map((route) => route.path));

  /** Every hand-written internal path the page renders, with its source field. */
  const outboundRoutes: readonly { source: string; route: string }[] = [
    {
      source: "designVsDev.designLinkRoute",
      route: WEB_DEVELOPMENT_DESIGN_VS_DEV.designLinkRoute,
    },
    {
      source: "capabilities.aiLinkRoute",
      route: WEB_DEVELOPMENT_CAPABILITIES.aiLinkRoute,
    },
    {
      source: "faqsHeading.crossLinkRoute",
      route: WEB_DEVELOPMENT_FAQS_HEADING.crossLinkRoute,
    },
    {
      source: "finalCta.contactRoute",
      route: WEB_DEVELOPMENT_FINAL_CTA.contactRoute,
    },
    ...WEB_DEVELOPMENT_PROOF.projects
      .filter((project): project is typeof project & { route: string } =>
        Boolean(project.route),
      )
      .map((project) => ({ source: `proof.${project.id}`, route: project.route })),
    ...WEB_DEVELOPMENT_CAPABILITY_LADDER.levels
      .filter((level): level is typeof level & { ctaRoute: string } =>
        Boolean(level.ctaRoute),
      )
      .map((level) => ({ source: `ladder.${level.id}`, route: level.ctaRoute })),
  ];

  it("is registered as a served route itself", () => {
    expect(servedPaths.has(WEB_DEVELOPMENT_META.path)).toBe(true);
  });

  it("points every outbound internal link at a route the site serves", () => {
    const unresolved = outboundRoutes
      // In-page anchors are not part of the route registry and are checked
      // separately, below, against the section ids the page actually renders.
      .filter(({ route }) => !route.startsWith("#"))
      .filter(({ route }) => !servedPaths.has(route))
      .map(({ source, route }) => `${source} -> ${route}`);

    expect(
      unresolved,
      "These links are not in the route registry, so they 404.",
    ).toEqual([]);
  });

  it("only uses in-page anchors that the page actually renders as section ids", () => {
    /**
     * The `id` attributes rendered by the page's section components. Kept in
     * sync by hand because the ids live in JSX, not in the deck — the same
     * trade-off the Web Design route test makes.
     */
    const renderedIds = new Set([
      "design-vs-development",
      "capability-ladder",
      "architecture",
      "proof",
      "capabilities",
      "ownership",
      "process",
      "faq",
    ]);

    const unresolved = outboundRoutes
      .filter(({ route }) => route.startsWith("#"))
      .filter(({ route }) => !renderedIds.has(route.slice(1)))
      .map(({ source, route }) => `${source} -> ${route}`);

    expect(
      unresolved,
      "These in-page anchors do not match any section id rendered on the page.",
    ).toEqual([]);
  });

  it("links out to each sibling service the page's boundaries name", () => {
    const targets = new Set(outboundRoutes.map(({ route }) => route));

    for (const expected of [
      "/services/web-design",
      "/services/custom-saas-development",
      "/services/ai-automation",
      "/contact",
    ]) {
      expect(
        targets.has(expected),
        `The page no longer links to ${expected}; the keyword-ownership boundary ` +
          "between the service pages depends on that hand-off existing.",
      ).toBe(true);
    }
  });
});

/**
 * METADATA BOUNDS.
 *
 * `clampDescription` silently truncates anything over `DESCRIPTION_MAX` at the
 * last space inside the 120-160 window, so an over-long description does not
 * fail a build — it ships a snippet that stops mid-sentence. That is exactly
 * what this page did (170 characters, served ending "…your workflows, data
 * and"), and it was invisible from the copy deck.
 *
 * Asserting on the *clamped* output as well as the raw string is the part that
 * matters: it is the only way to state "the description a searcher sees is the
 * description we wrote".
 */
describe("web development page — metadata bounds", () => {
  it("emits a title inside the rendered-title bounds", () => {
    // `titleAbsolute` is set on this route, so the rendered <title> is exactly
    // the deck's string — no template suffix is appended.
    expect(WEB_DEVELOPMENT_META.title.length).toBeGreaterThanOrEqual(TITLE_MIN);
    expect(WEB_DEVELOPMENT_META.title.length).toBeLessThanOrEqual(TITLE_MAX);
  });

  it("carries its assigned keyword phrase in the title, verbatim", () => {
    expect(
      WEB_DEVELOPMENT_META.title.toLowerCase(),
    ).toContain(WEB_DEVELOPMENT_META.keywordPhrase.toLowerCase());
  });

  it("emits a description the clamp does not have to truncate", () => {
    const { description } = WEB_DEVELOPMENT_META;

    expect(description.length).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
    expect(description.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
    expect(
      clampDescription(description),
      "The served description differs from the written one, which means it is " +
        "being cut mid-sentence.",
    ).toBe(description);
  });
});
