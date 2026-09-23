import type { MetadataRoute } from "next";

import { client } from "@/sanity/lib/client";
import {
  AUTHOR_POSTS_COUNT_QUERY,
  AUTHOR_SLUGS_QUERY,
  CATEGORY_POSTS_COUNT_QUERY,
  CATEGORY_SLUGS_QUERY,
  POSTS_COUNT_QUERY,
  POST_SITEMAP_QUERY,
  type PostSitemapEntry,
} from "@/sanity/lib/queries";
import { ALL_ROUTES, type RouteDescriptor } from "@/lib/routes";
import { SITE_URL } from "@/lib/site";
import routeLastmodJson from "@/lib/route-lastmod.generated.json";

/**
 * `sitemap.xml`, composed from the route registry (`src/lib/routes.ts`) plus
 * the Sanity-backed post and archive routes.
 *
 * Requirement 6.10/6.11: revalidated hourly rather than derived per-request,
 * so a publish/unpublish in Sanity is reflected within 3600 seconds.
 */
export const revalidate = 3600;

/** Posts per page, matching `PostListing`/`Pagination` (`src/components/blogs`). */
const POSTS_PER_PAGE = 12;

type SitemapEntry = MetadataRoute.Sitemap[number];

const ROUTE_LASTMOD = routeLastmodJson as Record<string, string>;

/**
 * `/solutions/<slug>` routes have no entry in `route-lastmod.generated.json`:
 * the generator (`scripts/gen-route-lastmod.mjs`) only walks
 * `STATIC_ROUTES`/`serviceRoutes()` paths, and the dynamic solution page
 * shares no single source file the way the four service routes share
 * `services/[slug]/page.tsx`. Falling back to the `/solutions` hub's own
 * commit date keeps the value content-derived and stable across generations
 * (Requirement 6.3) instead of reading request time.
 */
const SOLUTION_LASTMOD_FALLBACK =
  ROUTE_LASTMOD["/solutions"] ??
  ROUTE_LASTMOD["/"] ??
  new Date(0).toISOString();

function staticLastModified(path: string): Date {
  return new Date(ROUTE_LASTMOD[path] ?? SOLUTION_LASTMOD_FALLBACK);
}

/**
 * `changeFrequency`/`priority` per static Route, preserving the priority
 * scale the previous hand-rolled sitemap used (1.0 root, 0.8 the blog index,
 * 0.7 contact-tier pages, 0.2 legal pages) and extending it for the routes
 * this rewrite adds. Both fields are optional in Next's sitemap type and
 * carry no correctness requirement of their own.
 */
function staticFrequencyAndPriority(
  route: RouteDescriptor,
): Pick<SitemapEntry, "changeFrequency" | "priority"> {
  switch (route.path) {
    case "/":
      return { changeFrequency: "weekly", priority: 1.0 };
    case "/blogs":
      return { changeFrequency: "daily", priority: 0.8 };
    case "/solutions":
      return { changeFrequency: "weekly", priority: 0.8 };
    case "/contact":
      return { changeFrequency: "monthly", priority: 0.7 };
    case "/privacy":
    case "/terms":
      return { changeFrequency: "yearly", priority: 0.2 };
  }

  if ("nicheId" in route) return { changeFrequency: "monthly", priority: 0.7 }; // solution route
  if ("serviceRouteId" in route)
    return { changeFrequency: "monthly", priority: 0.7 }; // service route
  return { changeFrequency: "monthly", priority: 0.6 }; // e.g. /about
}

/**
 * One entry per Route in the registry: `/`, `/about`, `/blogs`, `/solutions`,
 * the four service routes, every `/solutions/<slug>` route built from the
 * Approved_City_List, and the legal pages. `ALL_ROUTES` already excludes
 * `/studio` (it is never registered there) and any unapproved city token
 * (`solutionRoutes()` only iterates `allNicheParams()`, bounded to
 * `APPROVED_CITIES`), so no further filtering is needed here.
 */
function staticEntries(): SitemapEntry[] {
  return ALL_ROUTES.map((route) => ({
    url: route.absoluteUrl,
    lastModified: staticLastModified(route.path),
    ...staticFrequencyAndPriority(route),
  }));
}

function postLastModified(post: PostSitemapEntry): Date {
  const iso = post.lastReviewed || post._updatedAt || post.publishedAt;
  return iso ? new Date(iso) : new Date(0);
}

/** Latest lastModified among a set of posts — a content-derived stand-in for an archive/pagination page's own lastmod, since `POST_SITEMAP_QUERY` carries no category/author reference to compute a more precise value without changing the query. */
function latestOf(posts: PostSitemapEntry[]): Date {
  let latest = 0;
  for (const post of posts) {
    const time = postLastModified(post).getTime();
    if (time > latest) latest = time;
  }
  return new Date(latest);
}

function totalPages(count: number): number {
  return Math.max(1, Math.ceil(count / POSTS_PER_PAGE));
}

/**
 * Post entries. `POST_SITEMAP_QUERY` already applies `LIVE_POST_FILTER`
 * (not a draft, has a `publishedAt`, `publishedAt <= now()`) and
 * `noindex != true`, so the future-dated check below is redundant defence in
 * depth, not the primary guarantee.
 */
function postEntries(posts: PostSitemapEntry[]): SitemapEntry[] {
  const now = Date.now();

  return posts
    .filter((post) => Boolean(post.slug))
    .filter(
      (post) =>
        !post.publishedAt || new Date(post.publishedAt).getTime() <= now,
    )
    .map((post) => ({
      url: `${SITE_URL}/blogs/${post.slug}`,
      lastModified: postLastModified(post),
      changeFrequency: post.evergreen ? "monthly" : "weekly",
      priority: 0.6,
    }));
}

/**
 * Every Sanity-backed entry: post routes, `/blogs` pagination beyond page 1
 * (page 1 is already the static `/blogs` entry), and every category/author
 * archive plus their own pagination. Thrown on any query failure so the
 * caller can fall back to the static route set alone (Requirement 6.12).
 */
async function contentEntries(): Promise<SitemapEntry[]> {
  const [posts, categorySlugs, authorSlugs, postCount] = await Promise.all([
    client.fetch<PostSitemapEntry[]>(POST_SITEMAP_QUERY),
    client.fetch<string[]>(CATEGORY_SLUGS_QUERY),
    client.fetch<string[]>(AUTHOR_SLUGS_QUERY),
    client.fetch<number>(POSTS_COUNT_QUERY),
  ]);

  const entries: SitemapEntry[] = [...postEntries(posts)];

  // No per-category/per-author date is available from POST_SITEMAP_QUERY
  // without extending it, so every archive and pagination entry below
  // shares one content-derived timestamp: the latest lastmod across all
  // live posts. Still content-derived rather than request-time, so
  // Requirement 6.3 (stable across generations absent content change) holds.
  const latestPostDate = latestOf(posts);

  const blogsPageCount = totalPages(postCount);
  for (let page = 2; page <= blogsPageCount; page++) {
    entries.push({
      url: `${SITE_URL}/blogs/page/${page}`,
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 0.5,
    });
  }

  const categoryCounts = await Promise.all(
    categorySlugs.map((slug) =>
      client.fetch<number>(CATEGORY_POSTS_COUNT_QUERY, { slug }),
    ),
  );
  categorySlugs.forEach((slug, index) => {
    entries.push({
      url: `${SITE_URL}/blogs/category/${slug}`,
      lastModified: latestPostDate,
      changeFrequency: "weekly",
      priority: 0.5,
    });

    const pageCount = totalPages(categoryCounts[index]);
    for (let page = 2; page <= pageCount; page++) {
      entries.push({
        url: `${SITE_URL}/blogs/category/${slug}/page/${page}`,
        lastModified: latestPostDate,
        changeFrequency: "weekly",
        priority: 0.4,
      });
    }
  });

  const authorCounts = await Promise.all(
    authorSlugs.map((slug) =>
      client.fetch<number>(AUTHOR_POSTS_COUNT_QUERY, { slug }),
    ),
  );
  authorSlugs.forEach((slug, index) => {
    entries.push({
      url: `${SITE_URL}/blogs/author/${slug}`,
      lastModified: latestPostDate,
      changeFrequency: "monthly",
      priority: 0.4,
    });

    const pageCount = totalPages(authorCounts[index]);
    for (let page = 2; page <= pageCount; page++) {
      entries.push({
        url: `${SITE_URL}/blogs/author/${slug}/page/${page}`,
        lastModified: latestPostDate,
        changeFrequency: "monthly",
        priority: 0.3,
      });
    }
  });

  return entries;
}

/**
 * Deduplicate by `url` (first write wins — the sources are disjoint by
 * construction, so this is defence in depth, not a case expected to trigger)
 * and, outside production, flag anything that would violate the "absolute,
 * no trailing slash, no query, under 50,000 entries" invariants rather than
 * silently emitting a bad `<loc>`.
 */
function finalize(entries: SitemapEntry[]): SitemapEntry[] {
  const byUrl = new Map<string, SitemapEntry>();
  for (const entry of entries) {
    if (!byUrl.has(entry.url)) byUrl.set(entry.url, entry);
  }
  const deduped = [...byUrl.values()];

  if (process.env.NODE_ENV !== "production") {
    for (const entry of deduped) {
      if (!entry.url.startsWith(SITE_URL)) {
        console.error(
          `[sitemap] "${entry.url}" is not an absolute blogspage.com URL.`,
        );
      }
      if (entry.url.endsWith("/") && entry.url !== SITE_URL) {
        console.error(`[sitemap] "${entry.url}" has a trailing slash.`);
      }
      if (entry.url.includes("?")) {
        console.error(`[sitemap] "${entry.url}" carries a query string.`);
      }
    }
    if (deduped.length > 50_000) {
      console.error(
        `[sitemap] ${deduped.length} entries exceeds the 50,000-entry sitemap.xml limit.`,
      );
    }
  }

  return deduped;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: SitemapEntry[] = [...staticEntries()];

  try {
    entries.push(...(await contentEntries()));
  } catch (error) {
    // Sanity fetch failed (or timed out): fall back to the static route set
    // only. Still returns a valid array at HTTP 200 rather than throwing,
    // which would otherwise 500 the route or leave it empty (Requirement 6.12).
    console.error(
      "[sitemap] Sanity fetch failed; serving static routes only.",
      error,
    );
  }

  return finalize(entries);
}
