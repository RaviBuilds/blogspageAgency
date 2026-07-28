/**
 * The Structured_Data_Layer: every JSON-LD node the site emits is built here.
 *
 * Three design decisions are load-bearing and worth reading before editing.
 *
 * **Node identity is route-independent.** All `@id` values come from
 * {@link mintId}, never from the route being rendered. The `Organization` node
 * appears on every indexable route and the `Service` nodes appear on both
 * `/solutions` and each `/solutions/<slug>`, so Requirement 5.10 ("identical
 * `@id` across every route on which the node appears") only holds if identity
 * is fixed by the entity, not by the URL. City variation on a solution route
 * is carried by the route-local `areaServed` and `url` properties instead —
 * the requirement constrains `@id` stability, not full node equality.
 *
 * **One node per `<script>`, no `@graph`.** Requirements 5.8 and 13.2 both
 * require every emitted block to declare a `@type`, and a `@graph` envelope has
 * no top-level `@type`. So each builder returns a self-contained node carrying
 * its own `@context` and `@type`, and `<JsonLd nodes={[...]} />` renders one
 * script per node. Cross-node links are {@link NodeRef} objects, never inlined
 * copies of the referenced node: an inlined anonymous `Organization` under
 * `provider` is a second, disconnected entity, which is exactly what
 * Requirement 5.10 forbids.
 *
 * **Emptiness is handled by the builders, not by call sites.** Every builder
 * returns through {@link omitEmpty}, so Requirements 5.11 and 5.12 ("omit the
 * property rather than emitting an empty, null, or placeholder value") are
 * properties of this module rather than obligations on each caller.
 *
 * Pure module: no I/O, no React, no framework imports, nothing thrown at call
 * time.
 */

import { canonicalUrl } from "@/lib/seo";
import {
  LOCALE,
  NAP,
  OPENING_HOURS,
  SITE_URL,
  SOCIAL_PROFILES,
} from "@/lib/site";

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * A single emitted JSON-LD block. `@context` and `@type` are always present
 * because each node ships in its own `<script>` (Requirements 5.8, 13.2).
 */
export type JsonLdNode = {
  "@context": "https://schema.org";
  "@type": string;
  "@id"?: string;
} & Record<string, unknown>;

/**
 * A reference to another node by identity. The only permitted way for one node
 * to point at another (Requirement 5.10).
 */
export type NodeRef = { "@id": string };

/**
 * The shape `serviceNode` needs from a Service_Catalog entry.
 *
 * Structural rather than an import of `Niche` from `src/lib/niches.ts` on
 * purpose: `Niche` carries Lucide icon components, and pulling a React
 * dependency into this module would make it unusable from the pure test suite
 * and the crawl-layer route handlers. Callers map their own records onto this
 * shape.
 */
export type ServiceCatalogEntry = {
  /** Stable catalog id; becomes the `@id` fragment (`#service-<id>`). */
  id: string;
  /** Identical to the Service_Catalog entry name (Requirement 5.5). */
  name: string;
  /** 50-300 characters (Requirement 5.5). */
  description: string;
  /** Schema.org `serviceType`. Falls back to `name` when absent. */
  serviceType?: string;
};

/** The author fields a `Person` node can carry (Requirement 8.2). */
export type AuthorProfile = {
  name?: string;
  /** Author route segment. Absent means no author route exists yet. */
  slug?: string;
  jobTitle?: string;
  /** Biography text, emitted as `description`. */
  bio?: string;
  imageUrl?: string;
  /** External profile URLs. Emitted only when at least one is non-empty. */
  sameAs?: string[];
};

/** One rung of a breadcrumb trail. Drives both the node and the visible trail. */
export type BreadcrumbItem = {
  name: string;
  /** Route path, e.g. `"/blogs"`. Absolutised through `canonicalUrl`. */
  path: string;
};

/** One question-and-answer pair (mirrors `FaqItem` in the Sanity queries). */
export type FaqPair = {
  question: string;
  answer: string;
};

/* -------------------------------------------------------------------------- */
/* Constants                                                                   */
/* -------------------------------------------------------------------------- */

const SCHEMA_CONTEXT = "https://schema.org" as const;

/** Requirements 5.1 and 5.5: description length bounds, inclusive. */
export const NODE_DESCRIPTION_MIN = 50;
export const NODE_DESCRIPTION_MAX = 300;

/**
 * Requirement 9.9: a `/solutions/<slug>` route rendering fewer than three
 * pairs emits no `FAQPage` node. Post routes have no such floor — Requirement
 * 5.9 emits one pair per Sanity FAQ entry — so this is passed explicitly by
 * the solution and service routes rather than being the default.
 */
export const MIN_SOLUTION_FAQ_PAIRS = 3;

/**
 * The `Organization` `description` (Requirement 5.1: 50-300 characters).
 *
 * Lives here rather than in `src/lib/site.ts` because it is structured-data
 * copy, not identity data that page surfaces render. Length is asserted at
 * module load, below, so an edit that breaks the bound fails the build instead
 * of shipping an invalid node.
 */
export const ORGANIZATION_DESCRIPTION =
  "Blogspage is a senior product-engineering agency in Hyderabad, India, building AI automation, AI sales agents, custom SaaS platforms, and programmatic SEO systems for founders, with production-grade launches shipped in a focused 10 to 15 day window.";

/** Absolute URL of the brand logo asset in `public/`. */
export const ORGANIZATION_LOGO_URL = `${SITE_URL}/blogspage-logo.png`;

if (
  ORGANIZATION_DESCRIPTION.length < NODE_DESCRIPTION_MIN ||
  ORGANIZATION_DESCRIPTION.length > NODE_DESCRIPTION_MAX
) {
  throw new Error(
    `ORGANIZATION_DESCRIPTION must be ${NODE_DESCRIPTION_MIN}-${NODE_DESCRIPTION_MAX} characters (Requirement 5.1); found ${ORGANIZATION_DESCRIPTION.length}.`,
  );
}

/* -------------------------------------------------------------------------- */
/* @id minting (Requirement 5.10)                                              */
/* -------------------------------------------------------------------------- */

/**
 * Mint a node `@id` from a route path and a fragment.
 *
 * The path is normalised through `canonicalUrl`, so an `@id` is always an
 * absolute `https://blogspage.com` URL (Requirement 5.7) and is stable however
 * the caller spells the path. The root keeps its slash —
 * `https://blogspage.com/#organization`, the form the design's `@id` table
 * spells out — while `canonicalUrl` alone returns the bare host for the root
 * because Requirement 3.2 governs canonical *links*, not identifiers.
 *
 * Total: any string in, absolute URL out. A blank fragment yields the plain
 * URL rather than a dangling `#`.
 */
export function mintId(path: string, fragment: string): string {
  const base = canonicalUrl(path);
  const root = base === SITE_URL ? `${SITE_URL}/` : base;
  const anchor = fragment.trim().replace(/^#+/, "");

  return anchor === "" ? root : `${root}#${anchor}`;
}

/** `@id` of the site-wide `Organization` node. */
export function organizationId(): string {
  return mintId("/", "organization");
}

/** A {@link NodeRef} to the site-wide `Organization` node. */
export function organizationRef(): NodeRef {
  return { "@id": organizationId() };
}

/** `@id` of the `Person` node for an author slug. */
export function personId(slug: string): string {
  return mintId(`/blogs/author/${slug}`, "person");
}

/** `@id` of the `Service` node for a Service_Catalog id. */
export function serviceId(catalogId: string): string {
  return mintId("/", `service-${catalogId}`);
}

/* -------------------------------------------------------------------------- */
/* omitEmpty (Requirements 5.11, 5.12)                                         */
/* -------------------------------------------------------------------------- */

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * `undefined`, `null`, blank strings, empty arrays, and objects left empty by
 * pruning. `false`, `0`, and `NaN` are values, not absences, and survive.
 */
function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (isPlainObject(value)) return Object.keys(value).length === 0;
  return false;
}

function prune(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(prune).filter((item) => !isEmptyValue(item));
  }

  if (isPlainObject(value)) {
    const result: Record<string, unknown> = {};
    for (const [key, raw] of Object.entries(value)) {
      const pruned = prune(raw);
      if (!isEmptyValue(pruned)) result[key] = pruned;
    }
    return result;
  }

  // Strings are returned untouched. Blankness decides omission, but a retained
  // value stays byte-identical, which is what the character-for-character
  // identity claims (Requirements 5.4, 5.9, 8.5) depend on.
  return value;
}

/**
 * Recursively strip properties whose value is `undefined`, `null`, an empty or
 * whitespace-only string, an empty array, or an object left empty by the same
 * pruning.
 *
 * Applied inside every builder in this module, which is what makes Requirement
 * 5.12 a property of the builders rather than a rule each call site has to
 * remember. Pure: the input object is never mutated.
 */
export function omitEmpty<T extends object>(node: T): T {
  return prune(node) as T;
}

/* -------------------------------------------------------------------------- */
/* Description handling                                                        */
/* -------------------------------------------------------------------------- */

function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Fit a node `description` into the 50-300 character window.
 *
 * Over-long text is cut at the last word boundary at or before 300 characters,
 * so the bound in Requirements 5.1 and 5.5 holds for any input. Short text is
 * returned as-is: padding it would mean inventing copy, so it is reported as a
 * content gap in development and left for the check suite to fail.
 */
function clampNodeDescription(text: string, label: string): string {
  const normalised = collapseWhitespace(text);

  if (normalised.length < NODE_DESCRIPTION_MIN && normalised !== "") {
    reportBound(
      `${label} description is ${normalised.length} characters, under the ${NODE_DESCRIPTION_MIN}-character minimum (Requirements 5.1, 5.5)`,
    );
  }

  if (normalised.length <= NODE_DESCRIPTION_MAX) return normalised;

  const window = normalised.slice(0, NODE_DESCRIPTION_MAX + 1);
  const lastSpace = window.lastIndexOf(" ");

  return lastSpace >= NODE_DESCRIPTION_MIN
    ? window.slice(0, lastSpace)
    : normalised.slice(0, NODE_DESCRIPTION_MAX);
}

/** Development-only reporting. Silent in production; the check suite is the authority. */
function reportBound(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.error(`[structured-data] ${message}`);
}

/* -------------------------------------------------------------------------- */
/* Node builders                                                               */
/* -------------------------------------------------------------------------- */

/**
 * The site-wide `Organization` node (Requirements 5.1, 5.2).
 *
 * `name` is `NAP.legalName` and `sameAs` is exactly the three profile URLs the
 * footer renders, both read from `src/lib/site.ts`, so the identity claims in
 * Requirements 5.2 and 8.5 hold by construction.
 *
 * `foundingDate` is deliberately absent: `FOUNDING_YEAR` is still an
 * unconfirmed placeholder, and a guessed founding date in structured data is a
 * false statement about the business, which is worse than an absent property.
 */
export function organizationNode(): JsonLdNode {
  return omitEmpty<JsonLdNode>({
    "@context": SCHEMA_CONTEXT,
    "@type": "Organization",
    "@id": organizationId(),
    name: NAP.legalName,
    url: SITE_URL,
    logo: ORGANIZATION_LOGO_URL,
    description: ORGANIZATION_DESCRIPTION,
    sameAs: SOCIAL_PROFILES.map((profile) => profile.href),
    telephone: NAP.telephone,
    email: NAP.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: NAP.streetAddress,
      addressLocality: NAP.locality,
      addressRegion: NAP.region,
      postalCode: NAP.postalCode,
      addressCountry: NAP.country,
    },
  });
}

/**
 * The `WebSite` node for the site root (Requirement 5.3).
 *
 * `name` reads the same constant as `Organization.name`, so the "identical to
 * the Organization name" clause cannot drift. `publisher` is a reference, not
 * an inlined node.
 *
 * No `potentialAction` / `SearchAction`: the site has no search route, and
 * Requirement 5.7 requires every route-denoting URL in the graph to return 200.
 */
export function webSiteNode(): JsonLdNode {
  return omitEmpty<JsonLdNode>({
    "@context": SCHEMA_CONTEXT,
    "@type": "WebSite",
    "@id": mintId("/", "website"),
    name: NAP.legalName,
    url: SITE_URL,
    description: ORGANIZATION_DESCRIPTION,
    inLanguage: LOCALE.html,
    publisher: organizationRef(),
  });
}

/**
 * The `LocalBusiness` node for `/contact` (Requirement 5.4).
 *
 * Every NAP value is read from `src/lib/site.ts`, the same constant `/contact`,
 * `/privacy`, and `/terms` render, which is what makes the character-identity
 * claim in Requirement 8.5 structural. `openingHours` covers seven days via
 * `OPENING_HOURS`, and `areaServed` names the NAP city and country.
 */
export function localBusinessNode(): JsonLdNode {
  return omitEmpty<JsonLdNode>({
    "@context": SCHEMA_CONTEXT,
    "@type": "LocalBusiness",
    "@id": mintId("/contact", "localbusiness"),
    name: NAP.legalName,
    url: canonicalUrl("/contact"),
    image: ORGANIZATION_LOGO_URL,
    description: ORGANIZATION_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      streetAddress: NAP.streetAddress,
      addressLocality: NAP.locality,
      addressRegion: NAP.region,
      postalCode: NAP.postalCode,
      addressCountry: NAP.country,
    },
    telephone: NAP.telephone,
    email: NAP.email,
    openingHours: OPENING_HOURS,
    areaServed: [NAP.locality, NAP.country],
    parentOrganization: organizationRef(),
  });
}

/**
 * A `Service` node for one Service_Catalog entry (Requirement 5.5).
 *
 * `@id` is anchored at the root (`/#service-<id>`) so the node keeps one
 * identity whether it is rendered on the `/solutions` hub or on a city route.
 * `areaServed` and `url` are the route-local properties that carry the city
 * variation, and `provider` is a reference to the `Organization` node rather
 * than an inlined duplicate.
 */
export function serviceNode(
  entry: ServiceCatalogEntry,
  opts?: { areaServed?: string[]; url?: string },
): JsonLdNode {
  return omitEmpty<JsonLdNode>({
    "@context": SCHEMA_CONTEXT,
    "@type": "Service",
    "@id": serviceId(entry.id),
    name: entry.name,
    description: clampNodeDescription(
      entry.description,
      `Service "${entry.id}"`,
    ),
    serviceType: entry.serviceType ?? entry.name,
    provider: organizationRef(),
    areaServed: opts?.areaServed,
    url: opts?.url === undefined ? undefined : canonicalUrl(opts.url),
  });
}

/**
 * The `Person` node for an author (Requirement 8.2).
 *
 * `@id` and `url` are both omitted when the author has no slug, because the
 * author route cannot exist without one and Requirement 5.11 requires omitting
 * a property that would reference a non-200 route rather than emitting it.
 * Every other absent field (job title, biography, profile links) drops out
 * through `omitEmpty`, so nothing is ever placeholder-valued (Requirement 8.10).
 */
export function personNode(author: AuthorProfile): JsonLdNode {
  const slug = author.slug?.trim() ?? "";
  const authorPath = slug === "" ? undefined : `/blogs/author/${slug}`;

  return omitEmpty<JsonLdNode>({
    "@context": SCHEMA_CONTEXT,
    "@type": "Person",
    "@id": authorPath === undefined ? undefined : personId(slug),
    name: author.name,
    jobTitle: author.jobTitle,
    description: author.bio,
    image: author.imageUrl,
    url: authorPath === undefined ? undefined : canonicalUrl(authorPath),
    sameAs: author.sameAs,
    worksFor: organizationRef(),
  });
}

/**
 * A `BreadcrumbList` node for a route below the site root (Requirement 5.6).
 *
 * Positions start at 1 with the site root and increase by exactly 1 with no
 * gaps. The root rung is prepended when the caller's trail does not already
 * start there, so the "begins with the site root" clause is a property of the
 * builder rather than of each route. The same `trail` array drives the visible
 * breadcrumb component (Requirement 7.4), which is what keeps the rendered
 * trail and the markup from drifting.
 *
 * Rungs with a blank name are dropped before numbering, so a missing title
 * never produces a gap or an empty `name`.
 */
export function breadcrumbNode(trail: BreadcrumbItem[]): JsonLdNode {
  const rungs = trail
    .filter((item) => collapseWhitespace(item.name) !== "")
    .map((item) => ({ name: item.name, item: canonicalUrl(item.path) }));

  const root = { name: "Home", item: canonicalUrl("/") };
  const items =
    rungs.length > 0 && rungs[0].item === root.item ? rungs : [root, ...rungs];

  return omitEmpty<JsonLdNode>({
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  });
}

/**
 * A `FAQPage` node, or `null` when fewer than `minPairs` usable pairs are
 * supplied (Requirements 5.9, 9.9).
 *
 * Pairs missing either side are discarded before the count, so three entries
 * of which one has no answer do not produce a `FAQPage` on a solution route.
 * Returning `null` rather than an empty node is what lets a caller emit its
 * remaining structured data unchanged.
 *
 * `minPairs` defaults to 1 (Requirement 5.9, post routes). Solution and
 * service routes pass {@link MIN_SOLUTION_FAQ_PAIRS}.
 */
export function faqNode(
  pairs: FaqPair[] | undefined,
  opts?: { minPairs?: number },
): JsonLdNode | null {
  const minPairs = opts?.minPairs ?? 1;

  const usable = (pairs ?? []).filter(
    (pair) =>
      collapseWhitespace(pair?.question ?? "") !== "" &&
      collapseWhitespace(pair?.answer ?? "") !== "",
  );

  if (usable.length < minPairs) return null;

  return omitEmpty<JsonLdNode>({
    "@context": SCHEMA_CONTEXT,
    "@type": "FAQPage",
    mainEntity: usable.map((pair) => ({
      "@type": "Question",
      name: pair.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: pair.answer,
      },
    })),
  });
}
