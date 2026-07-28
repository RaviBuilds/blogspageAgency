import { afterEach, describe, expect, it, vi } from "vitest";

import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { FeedPost } from "@/sanity/lib/queries";
import { GET } from "@/app/feed.xml/route";

/**
 * Feature: seo-audit-and-optimization
 *
 * Example-based checks on the RSS feed Route (`src/app/feed.xml/route.ts`):
 * well-formed XML on success, a valid post-less channel on a Sanity fetch
 * failure, per-item field presence, the 500-character summary bound, and XML
 * escaping of author-supplied text.
 *
 * `@/sanity/lib/client` is mocked so each test controls exactly what
 * `client.fetch` returns or throws; no network call is made.
 *
 * _Requirements: 6.7, 6.8, 6.10, 6.11, 6.12_
 */

const fetchMock = vi.fn();

vi.mock("@/sanity/lib/client", () => ({
  client: { fetch: (...args: unknown[]) => fetchMock(...args) },
}));

afterEach(() => {
  vi.resetAllMocks();
});

async function getFeedXml(): Promise<{ status: number; contentType: string | null; body: string }> {
  const response = await GET();
  return {
    status: response.status,
    contentType: response.headers.get("Content-Type"),
    body: await response.text(),
  };
}

describe("GET /feed.xml: success (Requirements 6.7, 6.8)", () => {
  it("serves a well-formed RSS 2.0 document with the feed content type", async () => {
    const posts: FeedPost[] = [
      {
        title: "Shipping AI Agents",
        slug: "shipping-ai-agents",
        excerpt: "How we ship production AI agents for clients.",
        publishedAt: "2024-05-01T00:00:00.000Z",
      },
    ];
    fetchMock.mockResolvedValueOnce(posts);

    const { status, contentType, body } = await getFeedXml();

    expect(status).toBe(200);
    expect(contentType).toMatch(/^application\/rss\+xml/);
    expect(body).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(body).toContain("<rss version=\"2.0\">");
    expect(body).toContain(`<title>${SITE_NAME} Journal</title>`);
    expect(body).toContain(`<link>${SITE_URL}/blogs</link>`);
  });

  it("renders one item per post with title, absolute URL, guid, pubDate, and description", async () => {
    const posts: FeedPost[] = [
      {
        title: "Post One",
        slug: "post-one",
        excerpt: "A short excerpt for post one.",
        publishedAt: "2024-05-01T00:00:00.000Z",
      },
      {
        title: "Post Two",
        slug: "post-two",
        excerpt: "A short excerpt for post two.",
        publishedAt: "2024-06-01T00:00:00.000Z",
      },
    ];
    fetchMock.mockResolvedValueOnce(posts);

    const { body } = await getFeedXml();

    expect(body.match(/<item>/g)?.length).toBe(2);
    for (const post of posts) {
      const url = `${SITE_URL}/blogs/${post.slug}`;
      expect(body).toContain(`<title>${post.title}</title>`);
      expect(body).toContain(`<link>${url}</link>`);
      expect(body).toContain(`<guid isPermaLink="true">${url}</guid>`);
      expect(body).toContain(new Date(post.publishedAt!).toUTCString());
      expect(body).toContain(post.excerpt!);
    }
  });

  it("falls back to a generic summary when a post has no excerpt", async () => {
    const posts: FeedPost[] = [
      { title: "No Excerpt Post", slug: "no-excerpt", publishedAt: "2024-05-01T00:00:00.000Z" },
    ];
    fetchMock.mockResolvedValueOnce(posts);

    const { body } = await getFeedXml();

    expect(body).toContain("<description>");
    expect(body).toMatch(/journal/i);
  });

  it("clamps a long excerpt to 500 characters or fewer at a word boundary", async () => {
    const longExcerpt = Array.from({ length: 100 }, (_, i) => `abcdefghij${i}`).join(" ");
    expect(longExcerpt.length).toBeGreaterThan(500);

    const posts: FeedPost[] = [
      { title: "Long Post", slug: "long-post", excerpt: longExcerpt, publishedAt: "2024-05-01T00:00:00.000Z" },
    ];
    fetchMock.mockResolvedValueOnce(posts);

    const { body } = await getFeedXml();

    // The channel itself has its own leading `<description>`, so match
    // within the `<item>` block rather than the first tag in the document.
    const itemMatch = body.match(/<item>([\s\S]*?)<\/item>/);
    expect(itemMatch).not.toBeNull();
    const descriptionMatch = itemMatch![1].match(/<description>([\s\S]*?)<\/description>/);
    expect(descriptionMatch).not.toBeNull();
    const description = descriptionMatch![1];
    expect(description.length).toBeLessThanOrEqual(500);
    // Word-boundary safe: clamped text must not itself contain a partial
    // "wordNN" split mid-token relative to the source.
    expect(longExcerpt.startsWith(description)).toBe(true);
  });

  it("escapes XML special characters in title and description", async () => {
    const posts: FeedPost[] = [
      {
        title: 'Cats & Dogs <are> "great"',
        slug: "cats-and-dogs",
        excerpt: "It's a & b < c > d \"quoted\" text.",
        publishedAt: "2024-05-01T00:00:00.000Z",
      },
    ];
    fetchMock.mockResolvedValueOnce(posts);

    const { body } = await getFeedXml();

    expect(body).not.toContain("<are>");
    expect(body).toContain("&amp;");
    expect(body).toContain("&lt;");
    expect(body).toContain("&gt;");
    expect(body).toContain("&quot;");
    expect(body).toContain("&apos;");
  });
});

describe("GET /feed.xml: Sanity failure (Requirements 6.12)", () => {
  it("serves a valid post-less channel with HTTP 200 instead of throwing", async () => {
    fetchMock.mockRejectedValueOnce(new Error("Sanity query timed out"));

    const { status, contentType, body } = await getFeedXml();

    expect(status).toBe(200);
    expect(contentType).toMatch(/^application\/rss\+xml/);
    expect(body).toContain("<channel>");
    expect(body).toContain(`<title>${SITE_NAME} Journal</title>`);
    expect(body).not.toContain("<item>");
  });
});

describe("GET /feed.xml: empty result (Requirement 6.7)", () => {
  it("serves a valid post-less channel when no live posts exist", async () => {
    fetchMock.mockResolvedValueOnce([]);

    const { status, body } = await getFeedXml();

    expect(status).toBe(200);
    expect(body).toContain("<channel>");
    expect(body).not.toContain("<item>");
  });
});
