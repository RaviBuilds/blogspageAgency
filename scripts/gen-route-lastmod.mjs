// Generates src/lib/route-lastmod.generated.json — a flat map of route path
// to an ISO 8601 timestamp (with UTC offset) for every source-backed static
// Route, so src/app/sitemap.ts (task 12.2) can derive `lastModified` from the
// last commit that touched a route's page source instead of from request
// time (Requirement 6.3: two generations separated by no content change must
// be byte-identical).
//
// For each mapped Route, the timestamp is the committer date of the last
// commit touching that Route's page file, via `git log -1 --format=%cI`.
// When the page file does not exist yet (the Route is not implemented) or
// carries no git history, the timestamp falls back to the current UTC time —
// see the fallback notes below for exactly which Routes hit that path today.
//
// Run with: node scripts/gen-route-lastmod.mjs
// Wired as the `prebuild` npm script, so it runs before every `next build`.
import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const OUTPUT_PATH = path.join(
  REPO_ROOT,
  "src",
  "lib",
  "route-lastmod.generated.json",
);

/**
 * Route path -> the Next.js page source file that backs it, relative to the
 * repo root. Mirrors the static Routes in `src/lib/routes.ts`
 * (`STATIC_ROUTES`) plus the four dedicated Service_Routes from
 * `src/lib/service-routes.ts` / `serviceRoutes()`, which all share one
 * dynamic route file, `src/app/(site)/services/[slug]/page.tsx`.
 *
 * `/blogs/<slug>`, `/solutions/<slug>`, category archives, and author
 * archives are content-backed (Sanity) rather than source-backed, so
 * `sitemap.ts` keeps deriving their `lastModified` from
 * `lastReviewed || _updatedAt || publishedAt` and this script never touches
 * them (design.md, "Crawl layer").
 */
const ROUTE_FILE_MAP = {
  "/": "src/app/(site)/page.tsx",
  "/about": "src/app/(site)/about/page.tsx",
  "/blogs": "src/app/(site)/blogs/page.tsx",
  "/solutions": "src/app/(site)/solutions/page.tsx",
  "/contact": "src/app/(site)/contact/page.tsx",
  "/privacy": "src/app/(site)/privacy/page.tsx",
  "/terms": "src/app/(site)/terms/page.tsx",
  "/services/ai-automation": "src/app/(site)/services/[slug]/page.tsx",
  "/services/ai-sales-agents": "src/app/(site)/services/[slug]/page.tsx",
  "/services/custom-saas-development": "src/app/(site)/services/[slug]/page.tsx",
  "/services/programmatic-seo": "src/app/(site)/services/[slug]/page.tsx",
};

/**
 * Returns the committer date (ISO 8601, UTC offset) of the last commit that
 * touched `relativeFilePath`, or `null` when the file has no git history
 * (untracked, or every commit touching it was later reverted out of range —
 * in practice this only happens for a file that does not exist yet).
 */
function lastCommitDate(relativeFilePath) {
  try {
    const output = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", relativeFilePath],
      { cwd: REPO_ROOT, encoding: "utf-8" },
    ).trim();
    return output === "" ? null : output;
  } catch {
    return null;
  }
}

const lastmod = {};
const fallbackRoutes = [];

for (const [routePath, relativeFilePath] of Object.entries(ROUTE_FILE_MAP)) {
  const absoluteFilePath = path.join(REPO_ROOT, relativeFilePath);
  const fileExists = existsSync(absoluteFilePath);
  const commitDate = fileExists ? lastCommitDate(relativeFilePath) : null;

  if (commitDate) {
    lastmod[routePath] = commitDate;
  } else {
    // Fallback: the page file does not exist yet, or exists but has no git
    // history (e.g. staged but never committed). Use the current UTC time
    // so the build still produces a valid ISO 8601 UTC-offset timestamp;
    // this Route's `lastModified` will vary between generations until the
    // file is committed, which the route-set report below makes visible.
    lastmod[routePath] = new Date().toISOString();
    fallbackRoutes.push({ routePath, relativeFilePath, fileExists });
  }
}

writeFileSync(OUTPUT_PATH, `${JSON.stringify(lastmod, null, 2)}\n`, "utf-8");

console.log(`Wrote ${OUTPUT_PATH} (${Object.keys(lastmod).length} routes)`);
if (fallbackRoutes.length > 0) {
  console.log(
    "Routes using a current-time fallback (no committed page source yet):",
  );
  for (const { routePath, relativeFilePath, fileExists } of fallbackRoutes) {
    console.log(
      `  ${routePath} -> ${relativeFilePath} (${fileExists ? "exists, no git history" : "does not exist yet"})`,
    );
  }
}
