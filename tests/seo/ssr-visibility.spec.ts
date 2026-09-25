import { describe, expect, it } from "vitest";

import {
  CONCURRENCY_CAP,
  TimeoutViolationError,
  fetchWithTimeout,
  getBaseUrl,
  mapWithConcurrency,
  type Violation,
} from "./helpers";
import { getRouteSet } from "./route-set";

/**
 * SSR VISIBILITY — meaningful content must be readable in the served HTML.
 *
 * ## The defect class this pins down
 *
 * Framer Motion serialises a resolved `initial` prop into inline styles during
 * server rendering. So any of these forms ships `style="opacity:0"` in the
 * production HTML:
 *
 * ```tsx
 * initial="hidden"                                  // unconditional
 * initial={{ opacity: 0, y: 24 }}                   // unconditional
 * initial={shouldReduceMotion ? "show" : "hidden"}  // `false` on the server
 * ```
 *
 * The third is the subtle one: `useReducedMotion()` returns `false` during SSR,
 * so the ternary always resolves to the hidden branch on the server.
 *
 * This was first found on the homepage `<h1>` (audit finding F-12) and fixed
 * there. It then recurred one level down — on section `<h2>` elements and phase
 * `<article>` blocks — because the fix was applied to a single component rather
 * than guarded. Hence this test.
 *
 * ## Why it asserts against served HTML
 *
 * Reading the JSX cannot prove what a crawler receives, and a component-level
 * render test would not catch a *parent* wrapper hiding a heading it contains.
 * The rendered document is the only place the real answer exists.
 *
 * ## The decorative exemption
 *
 * Scroll-driven visuals legitimately start at `opacity: 0`. They are exempt
 * when marked `aria-hidden` (on the element or any ancestor), which is the
 * codebase's existing contract: decorative visuals are `aria-hidden` and their
 * meaning is carried by an `sr-only` sibling. Anything NOT so marked is real
 * content and must ship visible.
 */

/** Elements with no closing tag, so they never open a subtree. */
const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
  "param", "source", "track", "wbr",
  // SVG leaves that appear self-closing or childless in rendered output.
  "circle", "ellipse", "line", "path", "polygon", "polyline", "rect", "stop",
  "use",
]);

/** Tag scanner that tolerates `>` inside quoted attribute values. */
const TAG_SOURCE = String.raw`<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>`;

/**
 * Matches a true zero opacity only.
 *
 * The negative lookahead is load-bearing: a plain `opacity:\s*0` also matches
 * `opacity:0.65`, which is a partly-faded element that is still perfectly
 * readable and is not a defect.
 */
const HIDDEN_SOURCE = String.raw`<([a-zA-Z][a-zA-Z0-9]*)((?:"[^"]*"|'[^']*'|[^>"'])*?style="[^"]*opacity:\s*0(?!\.\d*[1-9])[^"]*"(?:"[^"]*"|'[^']*'|[^>"'])*?)>`;

/** Inner HTML of the element whose opening tag ends at `from`. */
function subtree(html: string, from: number, tag: string): string {
  if (VOID_TAGS.has(tag)) return "";
  const tags = new RegExp(TAG_SOURCE, "g");
  tags.lastIndex = from;
  let depth = 1;
  let match: RegExpExecArray | null;
  while ((match = tags.exec(html)) !== null) {
    const [, closing, rawName, , selfClose] = match;
    const name = rawName.toLowerCase();
    if (VOID_TAGS.has(name) || selfClose) continue;
    // Only the same tag name moves the counter; counting every closing tag
    // terminates the walk at the first child close and under-reports.
    if (name !== tag) continue;
    if (closing) {
      depth -= 1;
      if (depth === 0) return html.slice(from, match.index);
    } else {
      depth += 1;
    }
  }
  return "";
}

/**
 * Is the element opening at `openIdx` inside an `aria-hidden` ancestor?
 *
 * Walks backwards tracking unmatched opening tags: a closing tag increments a
 * skip depth, an opening tag either consumes that depth (it was a closed
 * sibling) or is a genuine ancestor.
 */
function inAriaHiddenAncestor(html: string, openIdx: number): boolean {
  const before = [...html.slice(0, openIdx).matchAll(new RegExp(TAG_SOURCE, "g"))];
  let skip = 0;
  for (let i = before.length - 1; i >= 0; i--) {
    const [, closing, rawName, attrs, selfClose] = before[i];
    const name = rawName.toLowerCase();
    if (VOID_TAGS.has(name) || selfClose) continue;
    if (closing) {
      skip += 1;
      continue;
    }
    if (skip > 0) {
      skip -= 1;
      continue;
    }
    if (/aria-hidden/.test(attrs)) return true;
  }
  return false;
}

/** Visible text, ignoring markup and entities. */
function textOf(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-zA-Z#0-9]+;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Real (non-decorative) content shipped at `opacity: 0`.
 *
 * A finding is reported when the element is not `aria-hidden` (itself or via an
 * ancestor) AND it either contains a heading or carries a meaningful amount of
 * text. The text threshold keeps single-glyph chrome (arrows, dots, separator
 * characters) from producing noise without hiding real copy.
 */
function findHiddenContent(html: string, target: string): Violation[] {
  const violations: Violation[] = [];
  const MIN_TEXT = 12;

  for (const match of html.matchAll(new RegExp(HIDDEN_SOURCE, "g"))) {
    const tag = match[1].toLowerCase();
    const attrs = match[2];
    const index = match.index ?? 0;

    if (/aria-hidden/.test(attrs)) continue;
    if (inAriaHiddenAncestor(html, index)) continue;

    const inner = subtree(html, index + match[0].length, tag);
    const heading = /<(h[1-6])[\s>]/.exec(inner)?.[1];
    const text = textOf(inner);
    if (!heading && text.length < MIN_TEXT) continue;

    violations.push({
      target,
      assertion: heading
        ? "ssr-visibility-heading-not-hidden"
        : "ssr-visibility-content-not-hidden",
      expected: heading
        ? `<${heading}> is rendered visible in the server HTML`
        : "meaningful text is rendered visible in the server HTML",
      observed: `<${tag}> ships inline opacity:0 wrapping ${
        heading ? `<${heading}> ` : ""
      }"${text.slice(0, 80)}"`,
    });
  }

  return violations;
}

function report(violations: Violation[]): string {
  return violations
    .map(
      (v) =>
        `\n  ${v.target}\n    assertion: ${v.assertion}\n` +
        `    expected:  ${v.expected}\n    observed:  ${v.observed}`,
    )
    .join("\n");
}

const FIX_HINT =
  "Fix: drive the reveal through `animate` behind the `useMotionReady` " +
  "hydration gate (see `useStaggerReveal` in scroll-reveal.tsx) instead of a " +
  "serialised `initial`. If the element is purely decorative, mark it " +
  "`aria-hidden` and carry its meaning in an `sr-only` sibling.";

/**
 * Routes this test asserts on today.
 *
 * Scoped to `/` deliberately. Running the same scan across the full sitemap
 * reports ~279 findings on the eleven `/solutions/*` routes, all of the same
 * defect class and all pre-existing: the solution landing templates
 * (`dental-solution-landing.tsx`, `gym-solution-landing.tsx`,
 * `dental-packages-landing.tsx`, `neodent-case-study.tsx`) use unconditional
 * `initial="hidden"` / `initial={{ opacity: 0 }}` on wrappers that contain
 * `<h2>` and `<h3>` elements.
 *
 * That is real, separate work on files the homepage task did not touch, so it
 * is recorded as debt rather than absorbed silently or asserted-and-skipped.
 * `SSR_VISIBILITY_DEBT` below names the affected routes, and
 * `auditRoutes()` exists so the sweep can be widened in one line once those
 * templates are converted.
 */
const ASSERTED_ROUTES = ["/"] as const;

/** Known-affected routes, excluded from the assertion above. See the note. */
export const SSR_VISIBILITY_DEBT = /^\/solutions\//;

/**
 * Scan an arbitrary route list. Exported so the debt above can be measured
 * without editing the assertion, and so widening the scope is a one-line change.
 */
export async function auditRoutes(routes: readonly string[]): Promise<Violation[]> {
  const baseUrl = getBaseUrl();
  const violations: Violation[] = [];

  await mapWithConcurrency([...routes], CONCURRENCY_CAP, async (route) => {
    const url = `${baseUrl}${route}`;
    try {
      const response = await fetchWithTimeout(url);
      if (!response.ok) {
        violations.push({
          target: route,
          assertion: "route-served",
          expected: "HTTP 200 so the HTML can be inspected",
          observed: `HTTP ${response.status}`,
        });
        return;
      }
      violations.push(...findHiddenContent(await response.text(), route));
    } catch (error: unknown) {
      violations.push({
        target: route,
        assertion:
          error instanceof TimeoutViolationError ? "fetch-timeout" : "fetch-failed",
        expected: "the route responds so its HTML can be inspected",
        observed: error instanceof Error ? error.message : String(error),
      });
    }
  });

  return violations;
}

describe("SSR visibility (audit finding F-12 — regression guard)", () => {
  it("renders the homepage's meaningful content visible in the served HTML", async () => {
    const violations = await auditRoutes(ASSERTED_ROUTES);

    expect(
      violations,
      `Content is hidden in the server-rendered HTML.${report(violations)}\n\n${FIX_HINT}`,
    ).toEqual([]);
  });

  it("keeps the sitemap reachable, so the scan can be widened to all routes", async () => {
    const routes = await getRouteSet();
    expect(routes).toContain("/");
    expect(
      routes.some((route) => SSR_VISIBILITY_DEBT.test(route)),
      "the solution routes are still served (they carry the recorded debt)",
    ).toBe(true);
  });

  it("keeps the homepage h1 present and visible", async () => {
    const response = await fetchWithTimeout(`${getBaseUrl()}/`);
    expect(response.ok).toBe(true);
    const html = await response.text();

    const h1s = [
      ...html.matchAll(/<h1(?:"[^"]*"|'[^']*'|[^>"'])*>([\s\S]*?)<\/h1>/g),
    ];
    expect(h1s, "the homepage renders exactly one <h1>").toHaveLength(1);
    expect(
      textOf(h1s[0][1]).length,
      "the <h1> carries real text",
    ).toBeGreaterThan(0);
    expect(
      findHiddenContent(h1s[0][0], "/"),
      "the <h1> is not itself hidden",
    ).toEqual([]);
  });
});
