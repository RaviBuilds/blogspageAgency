/**
 * The SEO audit rubric and its arithmetic.
 *
 * The audit report's score tables are generated from this module rather than
 * computed by hand, so the displayed contributions, their sum, and the stated
 * Overall_Score cannot disagree (Requirements 2.4, 2.6, 2.9).
 *
 * Pure module: no I/O, no React, no framework imports.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RubricCategoryName =
  | "Crawlability and Indexation"
  | "Canonicalisation and Duplicate Control"
  | "Metadata and Social Previews"
  | "Structured Data and Entity Graph"
  | "Content and Keyword Architecture"
  | "Site Architecture and Internal Linking"
  | "Core Web Vitals and Rendering"
  | "Semantic HTML and Accessibility"
  | "Authority and E-E-A-T Signals"
  | "AI and LLM Discoverability";

/** One of the three observable conditions that earn a score of 0, 5, or 10. */
export type AnchorDescriptor = {
  score: 0 | 5 | 10;
  /** What to inspect: a file, a URL, or a measurement. */
  artefact: string;
  /** What counts as met. */
  threshold: string;
};

export type RubricCategory = {
  name: RubricCategoryName;
  /** Integer 5..20; the ten weights sum to exactly 100. */
  weight: number;
  anchors: [AnchorDescriptor, AnchorDescriptor, AnchorDescriptor];
};

export type CategoryScore = {
  name: RubricCategoryName;
  weight: number;
  /** 0..10 in increments of 0.5. */
  score: number;
  /** weight * score / 100, rounded to 2 decimal places. */
  contribution: number;
  anchorUsed: 0 | 5 | 10;
  evidence: string;
  /** Empty means "no Finding was recorded for this category". */
  findingIds: string[];
  /** Present when the category could not be evaluated (Requirement 2.8). */
  unmeasured?: { missingEvidence: string };
};

export type FindingSeverity = "critical" | "high" | "medium" | "low";

export type Finding = {
  /** Stable identifier, e.g. "F-01". */
  id: string;
  severity: FindingSeverity;
  /** Exactly one rubric category. */
  category: RubricCategoryName;
  title: string;
  /** At least one path; each must exist in the audited commit. */
  filePaths: string[];
  /** At least one observable crawl, index, rank, or render consequence. */
  consequence: string;
  needsLiveVerification?: { observationNeeded: string };
  /** The requirement that resolves it, e.g. "Req 5.1". */
  remediationRequirement: string;
};

// ---------------------------------------------------------------------------
// The rubric
// ---------------------------------------------------------------------------

export const RUBRIC: readonly RubricCategory[] = [
  {
    name: "Crawlability and Indexation",
    weight: 12,
    anchors: [
      {
        score: 0,
        artefact: "src/app/sitemap.ts, src/app/robots.ts, the served /sitemap.xml and /robots.txt",
        threshold:
          "No sitemap or no robots file is served, or the sitemap omits a whole route family (for example every /solutions/<slug> route), or it lists routes that redirect or return a non-200 status.",
      },
      {
        score: 5,
        artefact: "src/app/sitemap.ts, src/app/robots.ts, the served /sitemap.xml and /robots.txt",
        threshold:
          "Both files are served and cover the main route families, but at least one indexable route family is missing, or lastModified is derived from request time, or /studio is disallowed in robots.txt without a noindex directive on the route itself.",
      },
      {
        score: 10,
        artefact: "src/app/sitemap.ts, src/app/robots.ts, the served /sitemap.xml and /robots.txt",
        threshold:
          "Every indexable route appears exactly once with an absolute, trailing-slash-free location and a content-derived lastModified; every noindex, non-200, and /studio route is excluded; robots.txt declares the absolute sitemap URL; and a Sanity query failure still yields HTTP 200 with the static route set.",
      },
    ],
  },
  {
    name: "Canonicalisation and Duplicate Control",
    weight: 12,
    anchors: [
      {
        score: 0,
        artefact:
          "alternates.canonical across src/app/layout.tsx and the route modules, plus the slug resolver in src/lib/niches.ts",
        threshold:
          "Indexable routes emit no canonical URL, or a slug resolver accepts an unbounded token space so an unlimited set of self-canonicalising duplicate routes renders.",
      },
      {
        score: 5,
        artefact:
          "alternates.canonical across the route modules, plus the slug resolver in src/lib/niches.ts",
        threshold:
          "Most routes emit a canonical URL, but at least one indexable route omits it, or a canonical is non-absolute, carries a query, a fragment, or a trailing slash, or the parameterised route space is bounded only by convention rather than by an explicit allow-list.",
      },
      {
        score: 10,
        artefact:
          "alternates.canonical across the route modules, plus resolveSolutionSlug and APPROVED_CITIES",
        threshold:
          "Every indexable route emits exactly one self-referencing canonical URL that is https, lowercase, on blogspage.com, and free of query, fragment, and trailing slash; and every parameterised route resolves against an explicit allow-list, with anything outside it returning 404 and no canonical.",
      },
    ],
  },
  {
    name: "Metadata and Social Previews",
    weight: 10,
    anchors: [
      {
        score: 0,
        artefact:
          "the metadata and generateMetadata exports of each route, and the Social_Preview_Image assets they reference",
        threshold:
          "Routes share one boilerplate title and description, or the referenced Open Graph image is absent from the deployment so previews resolve to nothing.",
      },
      {
        score: 5,
        artefact:
          "the metadata and generateMetadata exports of each route, and the Social_Preview_Image assets they reference",
        threshold:
          "Titles, descriptions, and Open Graph and Twitter blocks are present and mostly unique, but at least one route falls outside the 30-70 character title or 120-160 character description window, or an image reference is broken, missing alt text, or not 1200 by 630, or the declared locale contradicts the published NAP.",
      },
      {
        score: 10,
        artefact:
          "the metadata and generateMetadata exports of each route, and the Social_Preview_Image assets they reference",
        threshold:
          "Every indexable route emits a unique 30-70 character title and unique 120-160 character description, a complete Open Graph and Twitter card block with an absolute 1200 by 630 image carrying non-empty alt text, locale en_IN, and a document lang of en-IN.",
      },
    ],
  },
  {
    name: "Structured Data and Entity Graph",
    weight: 13,
    anchors: [
      {
        score: 0,
        artefact:
          "every application/ld+json block in the served HTML, and the builders in src/lib/blog.ts and src/lib/structured-data.ts",
        threshold:
          "No JSON-LD is emitted, or a block fails to parse, or the agency entity is undeclared with no Organization or WebSite node anywhere on the site.",
      },
      {
        score: 5,
        artefact:
          "every application/ld+json block in the served HTML, and the builders in src/lib/blog.ts and src/lib/structured-data.ts",
        threshold:
          "Content-level nodes such as BlogPosting, BreadcrumbList, or FAQPage parse and validate, but the entity graph is disconnected: a provider or publisher is an anonymous duplicate rather than an @id reference, or a node references a route that does not return 200, or LocalBusiness and sameAs are absent.",
      },
      {
        score: 10,
        artefact:
          "every application/ld+json block in the served HTML, and the builders in src/lib/structured-data.ts",
        threshold:
          "Every route emits exactly one Organization node with route-independent @id, /: adds WebSite, /contact adds LocalBusiness matching the rendered NAP character-for-character, Service and Person nodes reference the Organization by @id, every referenced @id resolves within the same route, every URL returns 200, and no property carries an empty, null, or placeholder value.",
      },
    ],
  },
  {
    name: "Content and Keyword Architecture",
    weight: 12,
    anchors: [
      {
        score: 0,
        artefact:
          "src/lib/keyword-map.ts, the rendered <h1> and <title> of each route, and the Service_Catalog in src/lib/niches.ts",
        threshold:
          "No keyword assignment exists, or multiple indexable routes target the same phrase, or a published service offering has no route targeting it at all.",
      },
      {
        score: 5,
        artefact:
          "src/lib/keyword-map.ts, the rendered <h1> and <title> of each route, and the Service_Catalog in src/lib/niches.ts",
        threshold:
          "Routes carry distinct topical focus, but the assignment is implicit rather than published, or a phrase is missing from its route's title or single <h1>, or a named service is reachable only through an on-page anchor rather than its own route.",
      },
      {
        score: 10,
        artefact:
          "src/lib/keyword-map.ts, the rendered <h1> and <title> of each route, and the Service_Catalog in src/lib/niches.ts",
        threshold:
          "Every indexable route is assigned exactly one primary phrase of 2 to 8 words and 60 characters or fewer, unique case-insensitively across routes, appearing verbatim in the route's title and, for the dedicated service routes, in the single <h1>; every catalog entry has at least one targeting route.",
      },
    ],
  },
  {
    name: "Site Architecture and Internal Linking",
    weight: 10,
    anchors: [
      {
        score: 0,
        artefact:
          "src/components/layout/navbar.tsx, src/components/layout/footer.tsx, and the anchors rendered inside each route's <main>",
        threshold:
          "Indexable routes are orphaned with no internal anchor pointing at them, or navigation links point at routes that 404, or a whole intended surface such as a hub page does not exist.",
      },
      {
        score: 5,
        artefact:
          "src/components/layout/navbar.tsx, src/components/layout/footer.tsx, and the anchors rendered inside each route's <main>",
        threshold:
          "Every route is reachable, but at least one navigation entry targets a fragment anchor instead of the route that owns the content, or a breadcrumb trail is missing, or listing pagination is not exposed as crawlable anchors.",
      },
      {
        score: 10,
        artefact:
          "src/components/layout/navbar.tsx, src/components/layout/footer.tsx, and the anchors rendered inside each route's <main>",
        threshold:
          "Every indexable route is reachable through a crawlable anchor from navigation, footer, a hub, or a listing; every internal href resolves in at most one redirect hop; every route below the root renders a breadcrumb trail; and solution and post routes cross-link.",
      },
    ],
  },
  {
    name: "Core Web Vitals and Rendering",
    weight: 10,
    anchors: [
      {
        score: 0,
        artefact:
          "the server-rendered HTML of /, a post route, and a solution route, plus Lighthouse mobile medians over three runs",
        threshold:
          "Primary content is absent from the HTML response and appears only after hydration, or the mobile LCP median exceeds 4.0 seconds, or the CLS median exceeds 0.25.",
      },
      {
        score: 5,
        artefact:
          "the server-rendered HTML of /, a post route, and a solution route, plus Lighthouse mobile medians over three runs",
        threshold:
          "Body content is server-rendered, but the largest text element ships hidden behind a client animation, or a blocking overlay stays visible beyond 1500 ms, or raster images ship without reserved dimensions, or the LCP median sits between 2.5 and 4.0 seconds.",
      },
      {
        score: 10,
        artefact:
          "the server-rendered HTML of /, a post route, and a solution route, plus Lighthouse mobile medians over three runs",
        threshold:
          "Every heading and body paragraph is present and visible in the HTML response with scripting disabled, every raster image reserves its box, no overlay exceeds its visible-duration budget, and the mobile medians hold LCP at 2.5 seconds or less, CLS at 0.1 or less, and Total Blocking Time at 200 ms or less.",
      },
    ],
  },
  {
    name: "Semantic HTML and Accessibility",
    weight: 7,
    anchors: [
      {
        score: 0,
        artefact:
          "the document outline, image alt attributes, and anchor accessible names in each route's server-rendered HTML",
        threshold:
          "A route emits no <h1> or more than one, or images conveying information carry no alt attribute, or there is no landmark structure at all.",
      },
      {
        score: 5,
        artefact:
          "the document outline, image alt attributes, and anchor accessible names in each route's server-rendered HTML",
        threshold:
          "Each route has a single <h1> and alt attributes are broadly present, but a <main> element is nested inside another, or heading levels skip, or no skip-to-content link leads the focus order, or an anchor's accessible name is a generic phrase.",
      },
      {
        score: 10,
        artefact:
          "the document outline, image alt attributes, and anchor accessible names in each route's server-rendered HTML",
        threshold:
          "Every route emits exactly one non-nested <main> and exactly one <h1> as its first heading with no level skips, every image inside <main> carries an alt attribute within bounds, every anchor has a meaningful accessible name, and the first focusable element is a skip link targeting a <main> with tabindex -1.",
      },
    ],
  },
  {
    name: "Authority and E-E-A-T Signals",
    weight: 8,
    anchors: [
      {
        score: 0,
        artefact:
          "the /about route, the author surfaces under /blogs/author/<slug>, and the case references in src/components/home/featured-work.tsx",
        threshold:
          "No author attribution surface exists, or published author URLs resolve to 404, or the site states no verifiable business identity such as a founding year, address, or named work.",
      },
      {
        score: 5,
        artefact:
          "the /about route, the author surfaces under /blogs/author/<slug>, and the case references in src/components/home/featured-work.tsx",
        threshold:
          "Posts carry a named author and the site publishes a NAP, but the author has no profile route, or case references state outcomes without a named metric and numeric value, or the NAP text differs between the routes that publish it.",
      },
      {
        score: 10,
        artefact:
          "the /about route, the author surfaces under /blogs/author/<slug>, and the case references in src/components/home/featured-work.tsx",
        threshold:
          "Every author has a profile route returning 200 whose absolute URL matches the emitted Person url and the rendered byline anchor, the NAP is character-identical everywhere it is published, and at least three case references each name a technology and a metric carrying a numeric value, a unit, and the word measured or estimated in the same visible block.",
      },
    ],
  },
  {
    name: "AI and LLM Discoverability",
    weight: 6,
    anchors: [
      {
        score: 0,
        artefact:
          "the served /llms.txt and /services.json, the user-agent records in src/app/robots.ts, and the answer-first copy on / and /solutions/<slug>",
        threshold:
          "No machine-readable discovery file is served, no AI crawler is named in robots.txt, and no route opens with a self-contained summary of what the business does.",
      },
      {
        score: 5,
        artefact:
          "the served /llms.txt and /services.json, the user-agent records in src/app/robots.ts, and the answer-first copy on / and /solutions/<slug>",
        threshold:
          "Some answer-first copy is present, but a discovery file is missing or omits catalog entries, or robots.txt names no AI user-agent records, or no feed is served, or a solution route renders fewer than three question-and-answer pairs.",
      },
      {
        score: 10,
        artefact:
          "the served /llms.txt and /services.json, the user-agent records in src/app/robots.ts, and the answer-first copy on / and /solutions/<slug>",
        threshold:
          "/llms.txt and /services.json name every Service_Catalog entry with absolute URLs that return 200, robots.txt declares the six named AI user-agent records, a feed is served and referenced from /blogs, and / and each solution route open with a 40 to 80 word summary backed by at least three question-and-answer pairs mirrored in FAQPage markup.",
      },
    ],
  },
];

const RUBRIC_BY_NAME: ReadonlyMap<RubricCategoryName, RubricCategory> = new Map(
  RUBRIC.map((category) => [category.name, category])
);

/** The rubric category with this name, or `null` when the name is outside the closed set. */
export function findRubricCategory(name: string): RubricCategory | null {
  return RUBRIC_BY_NAME.get(name as RubricCategoryName) ?? null;
}

// ---------------------------------------------------------------------------
// Exact arithmetic
// ---------------------------------------------------------------------------

/**
 * Scores are quantised to this many units per point before any multiplication,
 * which keeps every intermediate value an exact integer. A score of 10 with a
 * weight of 20 across ten categories stays far below Number.MAX_SAFE_INTEGER.
 */
const SCORE_UNITS_PER_POINT = 1_000_000;

/** `score` expressed as an exact integer count of 1e-6 units. */
function toScoreUnits(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.round(score * SCORE_UNITS_PER_POINT);
}

/**
 * `numerator / denominator` rounded half-up, on integer inputs only.
 *
 * Implemented as integer arithmetic rather than through `Math.round` or
 * `toFixed`, both of which decide `.05` boundaries by the binary
 * representation of the value rather than by its decimal value: `Math.round`
 * sees 6.85 as 6.8499999999999996 and rounds down, and `toFixed` is
 * implementation-inconsistent at the same boundaries.
 */
function divideRoundHalfUp(numerator: number, denominator: number): number {
  const sign = numerator < 0 ? -1 : 1;
  const magnitude = Math.abs(numerator);
  // floor((2m + d) / 2d) is floor(m/d + 1/2): the half-up boundary, exactly.
  return sign * Math.floor((2 * magnitude + denominator) / (2 * denominator));
}

/** The score that actually contributes: an unmeasured category contributes 0 (Requirement 2.8). */
function effectiveScoreUnits(entry: CategoryScore): number {
  return entry.unmeasured ? 0 : toScoreUnits(entry.score);
}

/** Entries naming a category outside the closed rubric set contribute nothing (Requirement 2.1). */
function scorable(scores: readonly CategoryScore[]): CategoryScore[] {
  return scores.filter((entry) => RUBRIC_BY_NAME.has(entry.name));
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

/**
 * `Overall_Score = round_half_up(sum(score * weight) / 100, 1)` (Requirement 2.4).
 *
 * The weighted sum is accumulated in exact integer units before rounding, so a
 * total whose true value sits on a `.05` boundary rounds up rather than being
 * pushed either way by accumulated float error.
 */
export function computeOverallScore(scores: readonly CategoryScore[]): number {
  let weightedUnits = 0;
  for (const entry of scorable(scores)) {
    weightedUnits += effectiveScoreUnits(entry) * entry.weight;
  }
  // weightedUnits / (SCORE_UNITS_PER_POINT * 100) is the score; scale by 10 for one decimal place.
  const tenths = divideRoundHalfUp(weightedUnits * 10, SCORE_UNITS_PER_POINT * 100);
  return tenths / 10;
}

/**
 * The same scores with `contribution` set to `weight * score / 100` rounded
 * half-up to two decimal places (Requirement 2.6). Unmeasured categories
 * contribute 0 and every other contribution is unaffected by that (Requirement 2.8).
 */
export function computeContributions(scores: readonly CategoryScore[]): CategoryScore[] {
  return scores.map((entry) => {
    const hundredths = divideRoundHalfUp(
      effectiveScoreUnits(entry) * entry.weight * 100,
      SCORE_UNITS_PER_POINT * 100
    );
    return { ...entry, contribution: hundredths / 100 };
  });
}

/** `weight * (10 - score) / 100`, the weighted points a category costs the Overall_Score. */
export function pointsLost(entry: CategoryScore): number {
  const lostUnits = (10 * SCORE_UNITS_PER_POINT - effectiveScoreUnits(entry)) * entry.weight;
  const hundredths = divideRoundHalfUp(lostUnits * 100, SCORE_UNITS_PER_POINT * 100);
  return hundredths / 100;
}

/**
 * The categories ordered by weighted points lost, descending (Requirement 2.9).
 *
 * Ties break by descending weight, then by ascending category name, so the
 * ranking is a total order and "the highest three" is well defined even when
 * several categories lose identical points. Comparison runs on exact integer
 * units rather than on the rounded value returned by `pointsLost`.
 */
export function rankByPointsLost(scores: readonly CategoryScore[]): CategoryScore[] {
  const lostUnits = (entry: CategoryScore) =>
    (10 * SCORE_UNITS_PER_POINT - effectiveScoreUnits(entry)) * entry.weight;

  return [...scores].sort((a, b) => {
    const byPoints = lostUnits(b) - lostUnits(a);
    if (byPoints !== 0) return byPoints;
    const byWeight = b.weight - a.weight;
    if (byWeight !== 0) return byWeight;
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  });
}
