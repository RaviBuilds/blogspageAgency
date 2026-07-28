import type { Metadata } from "next";

import { client } from "@/sanity/lib/client";
import { POSTS_PAGE_QUERY, POSTS_COUNT_QUERY, type PostCard } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { PostListing } from "@/components/blogs/post-listing";
import { Pagination } from "@/components/blogs/pagination";

export const revalidate = 300; // Index updates more often than individual posts.

// Matches PostListing's "at most 12 entries" contract.
export const PAGE_SIZE = 12;

export const metadata: Metadata = buildMetadata({
  path: "/blogs",
  title: "Insights & Engineering: the ai automation blog",
  description:
    "Technical deep-dives, engineering playbooks, and field notes on AI automation and web architecture from the team building high-conversion business platforms.",
  keywordPhrase: "ai automation blog",
  // Requirement 6.8: reference the feed route from the document head as an
  // alternate link carrying its absolute URL and an XML feed content type.
  extra: {
    alternates: {
      types: {
        "application/rss+xml": [
          { url: `${SITE_URL}/feed.xml`, title: `${SITE_URL} RSS Feed` },
        ],
      },
    },
  },
});

async function getPage(): Promise<{ posts: PostCard[]; totalPages: number }> {
  const [posts, count] = await Promise.all([
    client.fetch<PostCard[]>(POSTS_PAGE_QUERY, { start: 0, end: PAGE_SIZE }),
    client.fetch<number>(POSTS_COUNT_QUERY),
  ]);

  return { posts, totalPages: Math.max(1, Math.ceil(count / PAGE_SIZE)) };
}

export default async function BlogsPage() {
  const { posts, totalPages } = await getPage();

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <Breadcrumb trail={[{ name: "Blog", path: "/blogs" }]} />
          <p className="mt-6 text-sm font-medium tracking-wide text-primary">
            Journal
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Insights &amp; Engineering
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Technical deep-dives and web architecture — engineering playbooks,
            AI automation, and the systems behind scalable digital products.
          </p>
        </div>
      </section>

      {/* Post grid */}
      <section className="mx-auto max-w-6xl bg-background px-6 py-16 lg:px-8 lg:py-24">
        <PostListing posts={posts} />
        <Pagination currentPage={1} totalPages={totalPages} basePath="/blogs" />
      </section>
    </>
  );
}
