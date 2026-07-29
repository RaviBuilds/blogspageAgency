/**
 * The metadata factory: the only place a Next.js `Metadata` object is
 * assembled.
 *
 * Requirements 3.1, 3.2, 4.3, 4.4, 4.5, 4.6, 4.8, and 12.5 are all "every
 * Indexable_Route emits X" claims. They hold by construction only if no route
 * module hand-rolls its own `Metadata` literal, so every route is converted to
 * call `buildMetadata` (tasks 6.3 through 6.7).
 *
 * `canonicalUrl`, `clampDescription`, and `ogImageUrl` are pure and total:
 * string in, string out, no I/O, no throw. `buildMetadata` is pure apart from
 * a development-only `console.error` when a length or keyword bound is
 * violated.
 */

import type { Metadata } from "next";

// Import order is load-bearing. `src/lib/keyword-map.ts` calls `canonicalUrl`
// during its own module evaluation, and `canonicalUrl` reads `SITE_URL`, so
// `@/lib/site` must be evaluated before the keyword map. Both ES modules and
// Vite's SSR transform evaluate a module's dependencies in import order, so
// listing site first is what keeps this cycle safe when either module is the
// one entered first.
import { LOCALE, SITE_NAME, SITE_URL } from "@/lib/site";
import { KEYWORD_MAP } from "@/lib/keyword-map";

/* -------------------------------------------------------------------------- */
/* Canonical URLs (Requirements 3.1, 3.2)                                      */
/* -------------------------------------------------------------------------- */

/**
 * Suffix the root title template (`"%s | Blogspage"`) appends to every
 * non-absolute route title. Requirement 4.4 bounds the *rendered* `<title>`,
 * measured after the template is applied, so the dev-time check has to add
 * this back to the pre-template string it is handed.
 */
export const TITLE_TEMPLATE_SUFFIX = ` | ${SITE_NAME}`;

/** Requirement 4.4: rendered `<title>` length bounds, inclusive. */
export const TITLE_MIN = 30;
export const TITLE_MAX = 70;

/** Requirements 4.5 and 4.11: meta description length bounds, inclusive. */
export const DESCRIPTION_MIN = 120;
export const DESCRIPTION_MAX = 160;

/** Requirement 4.2: every Social_Preview_Image is 1200x630. */
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/**
 * Strip query and fragment, drop any scheme and authority, and normalise the
 * remainder. Only used when the WHATWG parser rejects the input outright
 * (`"http://"` and similar), which `new URL(path, SITE_URL)` handles for every
 * other shape.
 */
function fallbackPath(raw: string): string {
  let rest = raw.split("#")[0].split("?")[0];

  const scheme = /^[a-z][a-z0-9+.-]*:\/\//i.exec(rest);
  if (scheme) {
    rest = rest.slice(scheme[0].length);
    const firstSlash = rest.indexOf("/");
    rest = firstSlash === -1 ? "" : rest.slice(firstSlash);
  }

  return rest;
}

/** Lowercase, single-slashed, leading-slashed, no trailing slash. */
function normalisePath(raw: string): string {
  const path = raw
    .toLowerCase()
    .replace(/\/{2,}/g, "/")
    .replace(/\/+$/, "");

  if (path === "") return "";
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * The canonical absolute URL for a route path.
 *
 * Total over any string. Always returns `https` + `blogspage.com` + a
 * lowercase path with no query, no fragment, and no trailing slash, and the
 * bare `https://blogspage.com` for the root (Requirement 3.2).
 *
 * Idempotent: the function accepts its own output, because the parse below
 * reads only the *pathname* of the input and discards scheme, host, query, and
 * fragment. Discarding the host is also the security-relevant part — a
 * protocol-relative or absolute foreign input (`"//evil.com/x"`,
 * `"http://evil.com/x"`) canonicalises to a `blogspage.com` URL rather than
 * emitting a cross-origin canonical.
 *
 * Declared as a hoisted `function` on purpose: `src/lib/keyword-map.ts`
 * imports it while this module reads `KEYWORD_MAP` back (see
 * {@link lookupKeywordPhrase}), and hoisting is what makes that cycle safe in
 * either module-evaluation order.
 */
export function canonicalUrl(path: string): string {
  const raw = path.trim();

  let pathname: string;
  try {
    // A base is always supplied, so relative input ("blogs/x"), rooted input
    // ("/blogs/x"), and absolute input ("https://blogspage.com/blogs/x") all
    // parse. Dot segments, tabs, newlines, and backslashes are normalised by
    // the parser; only `pathname` survives.
    pathname = new URL(raw, SITE_URL).pathname;
  } catch {
    pathname = fallbackPath(raw);
  }

  const firstPass = normalisePath(pathname);
  if (firstPass === "") return SITE_URL;

  // Second parse, and the reason idempotence is not free: the parser only
  // percent-encodes path characters for *special* schemes. Input carrying its
  // own non-special scheme (`a:"`) yields a raw `"` in `pathname`, which the
  // https parser would then encode on the next call, so one pass would not be
  // a fixed point. Re-parsing the extracted path against the https base
  // applies that encoding now. `firstPass` always starts with a single slash,
  // so this cannot pick up a foreign host.
  let encoded: string;
  try {
    encoded = new URL(firstPass, SITE_URL).pathname;
  } catch {
    encoded = firstPass;
  }

  const finalPath = normalisePath(encoded);
  return finalPath === "" ? SITE_URL : `${SITE_URL}${finalPath}`;
}

/* -------------------------------------------------------------------------- */
/* Social preview image URLs (Requirements 4.1, 4.7)                           */
/* -------------------------------------------------------------------------- */

export type OgImageInput = {
  /** The route's title text, rendered into the generated image. */
  title: string;
  /** Optional kicker rendered above the title. */
  eyebrow?: string;
};

/**
 * The absolute URL of the generated Social_Preview_Image for a route.
 *
 * Absolute because Requirement 4.1 applies to every consumer of the URL, not
 * only to consumers that happen to resolve it against `metadataBase`. The
 * route itself (`src/app/og/route.tsx`, task 6.2) owns generation, the 1800 ms
 * timeout, and the fallback redirect to `/og-default.png`; this function only
 * builds the query.
 */
export function ogImageUrl({ title, eyebrow }: OgImageInput): string {
  const params = new URLSearchParams();
  const cleanTitle = collapseWhitespace(title);
  const cleanEyebrow = collapseWhitespace(eyebrow ?? "");

  if (cleanTitle !== "") params.set("title", cleanTitle);
  if (cleanEyebrow !== "") params.set("eyebrow", cleanEyebrow);

  const query = params.toString();
  return query === "" ? `${SITE_URL}/og` : `${SITE_URL}/og?${query}`;
}

/* -------------------------------------------------------------------------- */
/* Description clamping (Requirements 4.5, 4.11)                               */
/* -------------------------------------------------------------------------- */

/** Collapse whitespace runs to single spaces and trim the edges. */
function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Clamp description text into the 120-160 character window.
 *
 * Behaviour, in the order the branches are taken:
 *
 * 1. Whitespace is collapsed first, so "extractable text" means the same thing
 *    to this function as it does to a crawler reading the rendered attribute.
 * 2. Text already at or under 160 characters is returned unchanged. **Input
 *    shorter than 120 characters is therefore returned short.** Padding it
 *    here would mean inventing copy; the design puts the extension at the call
 *    site instead (`resolveDescription` in `src/lib/blog.ts` extends from post
 *    body text, task 6.5), which is the only place that has more real text to
 *    draw on. Callers that cannot extend should treat a short return value as
 *    a content gap, not as a passing description.
 * 3. Longer text is cut at the last space at an index in `[120, 160]`, so the
 *    result is 120-160 characters and ends at a word boundary.
 * 4. If no space falls in that window — a single token spanning the whole
 *    window, which real prose does not produce — the window wins and the text
 *    is cut at 160. Requirement 4.5 is the acceptance criterion; ending at a
 *    word boundary is the quality rule layered on top of it, and one of the
 *    two has to yield. The cut backs off one code unit rather than splitting a
 *    surrogate pair.
 *
 * Deterministic: no clock, no randomness, no locale-sensitive operations.
 */
export function clampDescription(text: string): string {
  const normalised = collapseWhitespace(text);

  if (normalised.length <= DESCRIPTION_MAX) return normalised;

  for (let i = DESCRIPTION_MAX; i >= DESCRIPTION_MIN; i--) {
    if (normalised[i] === " ") {
      return normalised.slice(0, i);
    }
  }

  const highSurrogate = /[\uD800-\uDBFF]/;
  const end = highSurrogate.test(normalised[DESCRIPTION_MAX - 1])
    ? DESCRIPTION_MAX - 1
    : DESCRIPTION_MAX;

  return normalised.slice(0, end);
}

/* -------------------------------------------------------------------------- */
/* Keyword phrase lookup (Requirement 12.5)                                    */
/* -------------------------------------------------------------------------- */

/**
 * Route canonical URL -> assigned phrase, built on first lookup.
 *
 * Built lazily rather than at module scope because `src/lib/keyword-map.ts`
 * imports `canonicalUrl` from this module: reading `KEYWORD_MAP` during this
 * module's evaluation would hit its temporal dead zone whenever the keyword map
 * is the module entered first. By call time both modules have evaluated.
 */
let keywordPhraseIndex: Map<string, string> | null = null;

/**
 * The primary keyword phrase assigned to a route path in the keyword map, or
 * `null` for a route the map does not cover.
 *
 * Unmapped routes are expected, not exceptional: post routes and taxonomy
 * archives carry content-derived phrases (audit Finding F-07), so they skip the
 * dev-time verbatim check. The check suite (task 15.3, Property 31) is the
 * authority on keyword integrity regardless.
 */
function lookupKeywordPhrase(path: string): string | null {
  keywordPhraseIndex ??= new Map(
    KEYWORD_MAP.map((entry) => [entry.absoluteUrl, entry.phrase]),
  );
  return keywordPhraseIndex.get(canonicalUrl(path)) ?? null;
}

/* -------------------------------------------------------------------------- */
/* buildMetadata (Requirements 4.3, 4.4, 4.5, 4.6, 4.8, 12.5)                  */
/* -------------------------------------------------------------------------- */

export type BuildMetadataInput = {
  /** Route path: `"/"`, `"/blogs"`, `"/solutions/<slug>"`. */
  path: string;
  /**
   * Pre-template title. Must contain the route's assigned keyword phrase
   * verbatim (Requirement 12.5) and land inside Requirement 4.4's bounds once
   * the root template's `" | Blogspage"` suffix is applied.
   */
  title: string;
  /** 120-160 characters (Requirement 4.5). Run body-derived text through {@link clampDescription} first. */
  description: string;
  /**
   * Author-supplied Social_Preview_Image. Omit to fall back to the generated
   * `/og` URL. `alt` must be non-empty (Requirement 4.3); an empty value is
   * replaced by a title-derived alt rather than emitted.
   */
  image?: { url: string; alt: string };
  /** Open Graph object type. Defaults to `"website"`. */
  type?: "website" | "article";
  /** `false` emits `noindex, nofollow`. Defaults to `true`. */
  index?: boolean;
  /**
   * Emit the title as `title.absolute`, bypassing the root template. Set on
   * the root layout's own metadata, where the default title already carries
   * the brand.
   */
  titleAbsolute?: boolean;
  /** Kicker passed to the generated preview image. */
  eyebrow?: string;
  /**
   * The route's assigned keyword phrase, when the caller already has it.
   * Falls back to the keyword-map lookup. Used only for the dev-time verbatim
   * check; it never alters the emitted metadata.
   */
  keywordPhrase?: string;
  /**
   * Per-route additions merged over the generated object: `authors`,
   * `openGraph.publishedTime`, `alternates.types` for the feed, and so on.
   * Merging is one level deep for `alternates`, `openGraph`, and `twitter`, so
   * an addition to one of those blocks does not drop the generated fields.
   */
  extra?: Metadata;
};

/** Keys whose values are merged one level deep rather than replaced. */
const DEEP_MERGE_KEYS = ["alternates", "openGraph", "twitter"] as const;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function mergeMetadata(base: Metadata, extra: Metadata): Metadata {
  const merged: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(extra)) {
    const current = merged[key];
    const deep = (DEEP_MERGE_KEYS as readonly string[]).includes(key);

    merged[key] =
      deep && isPlainObject(current) && isPlainObject(value)
        ? { ...current, ...value }
        : value;
  }

  return merged as Metadata;
}

/**
 * Development-only bound reporting. Silent in production builds, so a
 * borderline description never writes to a production log; the check suite
 * (tasks 15.2, 15.3) is what fails a build.
 */
function reportBounds(
  input: BuildMetadataInput,
  renderedTitle: string,
  keywordPhrase: string | null,
): void {
  if (process.env.NODE_ENV === "production") return;

  const problems: string[] = [];

  if (
    renderedTitle.length < TITLE_MIN ||
    renderedTitle.length > TITLE_MAX
  ) {
    problems.push(
      `rendered title is ${renderedTitle.length} characters, outside ${TITLE_MIN}-${TITLE_MAX} (Requirement 4.4): "${renderedTitle}"`,
    );
  }

  if (
    input.description.length < DESCRIPTION_MIN ||
    input.description.length > DESCRIPTION_MAX
  ) {
    problems.push(
      `description is ${input.description.length} characters, outside ${DESCRIPTION_MIN}-${DESCRIPTION_MAX} (Requirement 4.5)`,
    );
  }

  if (keywordPhrase !== null && !input.title.includes(keywordPhrase)) {
    problems.push(
      `title does not contain the assigned keyword phrase "${keywordPhrase}" verbatim (Requirement 12.5)`,
    );
  }

  for (const problem of problems) {
    console.error(`[seo] ${input.path}: ${problem}`);
  }
}

/**
 * Assemble the `Metadata` object for a route.
 *
 * Emits `alternates.canonical`, the full `openGraph` block with
 * `locale: "en_IN"`, `url`, and an image carrying non-empty `alt`, and the
 * `twitter` block with `card: "summary_large_image"` (Requirements 4.3, 4.6).
 * Exactly one canonical and one title per route follows from every route
 * calling this once (Requirement 4.8).
 */
export function buildMetadata(input: BuildMetadataInput): Metadata {
  const {
    path,
    title,
    description,
    image,
    type = "website",
    index = true,
    titleAbsolute = false,
    eyebrow,
    extra,
  } = input;

  const canonical = canonicalUrl(path);
  const renderedTitle = titleAbsolute
    ? title
    : `${title}${TITLE_TEMPLATE_SUFFIX}`;

  const keywordPhrase = input.keywordPhrase ?? lookupKeywordPhrase(path);
  reportBounds(input, renderedTitle, keywordPhrase);

  // Requirement 4.3: `alt` must be non-empty. A supplied image with blank alt
  // text is a content bug, but emitting the blank value is the worse failure,
  // so it falls back to the same derived alt the generated image uses.
  const previewUrl = image?.url ?? ogImageUrl({ title, eyebrow });
  const previewAlt =
    collapseWhitespace(image?.alt ?? "") ||
    `${collapseWhitespace(title)} - ${SITE_NAME}`;

  const base: Metadata = {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    alternates: { canonical },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      type,
      url: canonical,
      siteName: SITE_NAME,
      locale: LOCALE.openGraph,
      title: renderedTitle,
      description,
      images: [
        {
          url: previewUrl,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: previewAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: renderedTitle,
      description,
      images: [previewUrl],
    },
  };

  return extra ? mergeMetadata(base, extra) : base;
}
