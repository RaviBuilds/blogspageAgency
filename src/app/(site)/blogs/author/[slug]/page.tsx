import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";

import { client } from "@/sanity/lib/client";
import {
  AUTHOR_POSTS_COUNT_QUERY,
  AUTHOR_POSTS_QUERY,
  AUTHOR_PROFILE_QUERY,
  AUTHOR_SLUGS_QUERY,
  type AuthorProfile,
  type PostCard,
} from "@/sanity/lib/queries";
import { portableTextToPlain } from "@/lib/blog";
import { DESCRIPTION_MIN, buildMetadata, clampDescription } from "@/lib/seo";
import { personNode } from "@/lib/structured-data";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { PostListing } from "@/components/blogs/post-listing";
import { Pagination } from "@/components/blogs/pagination";

export const revalidate = 300; // Index-like route; updates more often than individual posts.

// Matches PostListing's "at most 12 entries per page" contract, which
// Requirement 7.6 requires for the author archive specifically ("at most 12
// post entries per page"). Requirement 8.1's "at minimum the 20 most recent"
// floor is satisfied across the paginated route family rather than on this
// page alone: an author with more than 12 live posts reaches their 13th
// through 20th most recent by following the crawlable page-2 link
// `Pagination` renders below, not by raising this constant past 12.
export const PAGE_SIZE = 12;

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * `null` when the slug resolves to no published `author` document holding at
 * least one published post (Requirements 7.6, 7.10, 8.8). `AUTHOR_SLUGS_QUERY`
 * already only returns authors with >=1 live post, but this route can still
 * be hit directly by a stale or unknown slug outside that set, so the count is
 * re-verified at request time here rather than trusted from static params.
 */
async function getAuthorIfPublished(
  slug: string,
): Promise<AuthorProfile | null> {
  const [author, postCount] = await Promise.all([
    client.fetch<AuthorProfile | null>(AUTHOR_PROFILE_QUERY, { slug }),
    client.fetch<number>(AUTHOR_POSTS_COUNT_QUERY, { slug }),
  ]);

  if (!author || postCount < 1) return null;
  return author;
}

async function getAuthorPosts(
  slug: string,
  start: number,
  end: number,
): Promise<PostCard[]> {
  return client.fetch<PostCard[]>(AUTHOR_POSTS_QUERY, { slug, start, end });
}

/**
 * A meta description inside the 120-160 character window (Requirement 4.5).
 *
 * Preference order mirrors `resolveDescription` in `src/lib/blog.ts`: use the
 * author's own bio text when it is already long enough, otherwise fall back
 * to a generic sentence naming the author, then extend that generic sentence
 * with further generic text until `clampDescription` has enough length to
 * land inside the window. Never truncates to a placeholder — a persistently
 * short bio still produces a description at least `DESCRIPTION_MIN` long
 * because the fallback sentences are fixed, non-empty text.
 */
export function buildAuthorDescription(author: AuthorProfile): string {
  const name = author.name ?? "This author";
  const bioText = portableTextToPlain(author.bio);

  if (bioText.length >= DESCRIPTION_MIN) {
    return clampDescription(bioText);
  }

  const base = `${name}${author.jobTitle ? `, ${author.jobTitle},` : ""} writes on the Blogspage journal covering AI automation, engineering, and product delivery.`;
  if (base.length >= DESCRIPTION_MIN) {
    return clampDescription(base);
  }

  const extended = `${base} Explore their published articles on the Blogspage journal for practical, production-grade engineering and AI automation insights.`;
  return clampDescription(extended);
}

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(AUTHOR_SLUGS_QUERY);
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorIfPublished(slug);

  if (!author) {
    return {
      title: "Author Not Found | Blogspage",
      robots: { index: false, follow: false },
    };
  }

  return buildMetadata({
    path: `/blogs/author/${slug}`,
    title: `${author.name ?? "Author"} — Author at Blogspage`,
    description: buildAuthorDescription(author),
  });
}

export default async function AuthorProfilePage({ params }: Props) {
  const { slug } = await params;
  const author = await getAuthorIfPublished(slug);

  if (!author) {
    notFound();
  }

  const [posts, postCount] = await Promise.all([
    getAuthorPosts(slug, 0, PAGE_SIZE),
    client.fetch<number>(AUTHOR_POSTS_COUNT_QUERY, { slug }),
  ]);
  const totalPages = Math.max(1, Math.ceil(postCount / PAGE_SIZE));

  const bioText = portableTextToPlain(author.bio);
  const person = personNode({
    name: author.name,
    slug: author.slug,
    jobTitle: author.jobTitle,
    bio: bioText || undefined,
    imageUrl: author.imageUrl,
    sameAs: author.sameAs,
  });

  return (
    <>
      <JsonLd nodes={[person]} />

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <Breadcrumb
            trail={[
              { name: "Blog", path: "/blogs" },
              {
                name: author.name ?? "Author",
                path: `/blogs/author/${slug}`,
              },
            ]}
          />
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {author.name ?? "Author"}
          </h1>
          {author.jobTitle ? (
            <p className="mt-3 text-lg text-muted-foreground">
              {author.jobTitle}
            </p>
          ) : null}
          {author.bio ? (
            <div className="prose prose-invert mt-6 max-w-2xl">
              <PortableText value={author.bio} />
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-6xl bg-background px-6 py-16 lg:px-8 lg:py-24">
        <PostListing posts={posts} />
        <Pagination
          currentPage={1}
          totalPages={totalPages}
          basePath={`/blogs/author/${slug}`}
        />
      </section>
    </>
  );
}
