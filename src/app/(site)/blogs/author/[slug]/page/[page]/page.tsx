import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";

import { client } from "@/sanity/lib/client";
import {
  AUTHOR_POSTS_COUNT_QUERY,
  AUTHOR_POSTS_QUERY,
  AUTHOR_PROFILE_QUERY,
  type AuthorProfile,
  type PostCard,
} from "@/sanity/lib/queries";
import { portableTextToPlain } from "@/lib/blog";
import { buildMetadata, clampDescription } from "@/lib/seo";
import { personNode } from "@/lib/structured-data";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { PostListing } from "@/components/blogs/post-listing";
import { Pagination } from "@/components/blogs/pagination";
import {
  PAGE_SIZE,
  buildAuthorDescription,
} from "@/app/(site)/blogs/author/[slug]/page";

export const revalidate = 300;

type Props = {
  params: Promise<{ slug: string; page: string }>;
};

// A clean positive-integer string only: rejects "1.5", "01", "abc", "-1", "0".
const PAGE_PARAM_PATTERN = /^[1-9]\d*$/;

function parsePage(pageParam: string): number | null {
  return PAGE_PARAM_PATTERN.test(pageParam) ? Number(pageParam) : null;
}

/**
 * `null` when the slug resolves to no published `author` document holding at
 * least one published post (Requirements 7.6, 7.10, 8.8) — re-verified here
 * as well, since a paginated child of a nonexistent author must also 404, not
 * only an out-of-range page.
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, page: pageParam } = await params;
  const page = parsePage(pageParam);
  const author = page === null ? null : await getAuthorIfPublished(slug);

  if (!author || page === null) {
    return {
      title: "Author Not Found | Blogspage",
      robots: { index: false, follow: false },
    };
  }

  const name = author.name ?? "Author";
  // Re-clamped after the page suffix is appended: `buildAuthorDescription`
  // already lands inside 120-160 characters, and appending " Page N." could
  // push a description that started right at the 160-character ceiling past
  // it.
  const description = clampDescription(
    `${buildAuthorDescription(author)} Page ${page}.`,
  );

  return buildMetadata({
    path: `/blogs/author/${slug}/page/${page}`,
    title: `${name} — Author at Blogspage — Page ${page}`,
    description,
    index: false,
  });
}

export default async function AuthorPagedPage({ params }: Props) {
  const { slug, page: pageParam } = await params;
  const page = parsePage(pageParam);

  // Page 1 only exists at /blogs/author/<slug>; /page/1 would duplicate it.
  if (page === null || page === 1) {
    notFound();
  }

  const author = await getAuthorIfPublished(slug);
  if (!author) {
    notFound();
  }

  const postCount = await client.fetch<number>(AUTHOR_POSTS_COUNT_QUERY, {
    slug,
  });
  const totalPages = Math.max(1, Math.ceil(postCount / PAGE_SIZE));

  if (page > totalPages) {
    notFound();
  }

  const start = (page - 1) * PAGE_SIZE;
  const end = page * PAGE_SIZE;
  const posts = await getAuthorPosts(slug, start, end);

  // Same author entity regardless of which page of their posts is being
  // viewed: `personNode`'s `@id`/`url` are built from `slug` alone, not a
  // page number, so this always points at the canonical author route.
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
              { name: `Page ${page}`, path: `/blogs/author/${slug}/page/${page}` },
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
          currentPage={page}
          totalPages={totalPages}
          basePath={`/blogs/author/${slug}`}
        />
      </section>
    </>
  );
}
