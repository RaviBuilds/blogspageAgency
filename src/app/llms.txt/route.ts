/**
 * The `llms.txt` AI-discovery file (Requirements 9.1, 9.2, 9.10).
 *
 * States the Blogspage name, a single-sentence 15-30 word description, all
 * ten Service_Catalog entries (`src/lib/niches.ts`), and the absolute URLs of
 * `/`, `/blogs`, `/solutions`, `/contact`, `/privacy`, and `/terms`.
 *
 * The six page URLs are read from `STATIC_ROUTES` (`src/lib/routes.ts`)
 * rather than hand-typed, filtered down to exclude `/about` — the one entry
 * `STATIC_ROUTES` carries beyond the six this file names — so this list can
 * never drift from the route registry. The Service_Catalog entries are read
 * from `NICHES` for the same reason: no separate copy of the catalog exists,
 * which is what Requirement 9.10 ("reflects a catalog change on the first
 * request after deploy") depends on.
 *
 * `dynamic = "force-static"` plus `revalidate = false`: the body depends only
 * on code (`SITE_NAME`, `STATIC_ROUTES`, `NICHES`), never on request-time
 * data, so a redeploy is the only invalidation event.
 */
import { SITE_NAME } from "@/lib/site";
import { STATIC_ROUTES } from "@/lib/routes";
import { NICHES } from "@/lib/niches";

export const dynamic = "force-static";
export const revalidate = false;

/**
 * A single-sentence, 15-30 word description of the agency (Requirement 9.2).
 * Word count (split on whitespace): 24 words, one sentence, one period.
 */
const DESCRIPTION =
  "Blogspage is an AI agency in Hyderabad, India that builds AI automation, AI sales agents, custom SaaS platforms, and programmatic SEO systems for founders.";

/**
 * `STATIC_ROUTES` carries `/about` in addition to the six Routes this file
 * names (see the comment on `STATIC_ROUTES` in `src/lib/routes.ts`). Filter
 * it out rather than allow-listing the other six by path, so an added Route
 * still requires an explicit decision here instead of silently appearing.
 */
const EXCLUDED_PATHS = new Set<string>(["/about"]);

/** Requirement 9.1: total body length bounds, inclusive. */
const MIN_BODY_CHARS = 200;
const MAX_BODY_CHARS = 10_000;

function buildBody(): string {
  const pageRoutes = STATIC_ROUTES.filter(
    (route) => !EXCLUDED_PATHS.has(route.path),
  );

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    DESCRIPTION,
    "",
    "## Services",
    ...NICHES.map((niche) => `- ${niche.title}: ${niche.description}`),
    "",
    "## Pages",
    ...pageRoutes.map((route) => `- ${route.label}: ${route.absoluteUrl}`),
  ];

  return lines.join("\n");
}

const BODY = buildBody();

// Module-load invariant, mirroring the bound checks in
// `src/lib/structured-data.ts` and `src/lib/service-routes.ts`: a body that
// drifts outside Requirement 9.1's window fails the build rather than
// shipping a file the check suite would only catch later.
if (BODY.length < MIN_BODY_CHARS || BODY.length > MAX_BODY_CHARS) {
  throw new Error(
    `llms.txt body is ${BODY.length} characters; Requirement 9.1 requires ${MIN_BODY_CHARS}-${MAX_BODY_CHARS}.`,
  );
}

export async function GET(): Promise<Response> {
  return new Response(BODY, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
