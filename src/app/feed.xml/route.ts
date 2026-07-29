/**
 * RSS 2.0 feed of the 20 most recent live posts (Requirements 6.7, 6.8, 6.10,
 * 6.11, 6.12).
 *
 * `FEED_POSTS_QUERY` already applies `LIVE_POST_FILTER` and `noindex != true`,
 * so a post excluded from `sitemap.xml` is excluded here for the same reason
 * (Requirement 6.7's "excludes every post excluded from sitemap.xml").
 *
 * `revalidate = 3600` matches `sitemap.ts`: a publish/unpublish in Sanity is
 * reflected within the 3600-second window Requirements 6.10/6.11 require.
 */
import { client } from "@/sanity/lib/client";
import { FEED_POSTS_QUERY, type FeedPost } from "@/sanity/lib/queries";
import { decodeHtmlEntities, postUrl } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

/** Requirement 6.7: every item summary is 500 characters or fewer. */
const SUMMARY_MAX = 500;

/**
 * Clamp text to `SUMMARY_MAX` characters at a word boundary. Distinct from
 * `clampDescription` in `src/lib/seo.ts`, which targets the 120-160 character
 * meta-description window rather than this feed's 500-character bound.
 */
function clampSummary(text: string): string {
  const normalised = text.replace(/\s+/g, " ").trim();
  if (normalised.length <= SUMMARY_MAX) return normalised;

  for (let i = SUMMARY_MAX; i >= 0; i--) {
    if (normalised[i] === " ") {
      return normalised.slice(0, i);
    }
  }
  return normalised.slice(0, SUMMARY_MAX);
}

/**
 * Escape the five XML special characters. Sanity content is author-supplied
 * and can carry any of them, so every text field emitted into the feed goes
 * through this rather than being interpolated raw.
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function summaryFor(post: FeedPost): string {
  const raw = post.excerpt
    ? decodeHtmlEntities(post.excerpt)
    : `Read "${decodeHtmlEntities(post.title)}" on the ${SITE_NAME} journal.`;
  return clampSummary(raw);
}

function itemXml(post: FeedPost): string {
  const url = postUrl(post.slug);
  const title = escapeXml(decodeHtmlEntities(post.title));
  const description = escapeXml(summaryFor(post));
  const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : undefined;

  return [
    "    <item>",
    `      <title>${title}</title>`,
    `      <link>${url}</link>`,
    `      <guid isPermaLink="true">${url}</guid>`,
    pubDate ? `      <pubDate>${pubDate}</pubDate>` : undefined,
    `      <description>${description}</description>`,
    "    </item>",
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}

function channelXml(itemsXml: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)} Journal</title>
    <link>${SITE_URL}/blogs</link>
    <description>${escapeXml(`Technical deep-dives and engineering playbooks from ${SITE_NAME}.`)}</description>
    <language>en-IN</language>
${itemsXml}
  </channel>
</rss>
`;
}

const FEED_HEADERS = { "Content-Type": "application/rss+xml; charset=utf-8" };

export async function GET(): Promise<Response> {
  try {
    const posts = await client.fetch<FeedPost[]>(FEED_POSTS_QUERY);
    const itemsXml = posts.map(itemXml).join("\n");
    return new Response(channelXml(itemsXml), { headers: FEED_HEADERS });
  } catch (error) {
    // Sanity fetch failed: serve a valid, post-less channel at HTTP 200
    // rather than an error status or an empty/malformed document
    // (Requirement 6.12).
    console.error("[feed.xml] Sanity fetch failed; serving an empty channel.", error);
    return new Response(channelXml(""), { headers: FEED_HEADERS });
  }
}
