import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { client } from "@/sanity/lib/client";
import {
  CATEGORY_BY_SLUG_QUERY,
  CATEGORY_POSTS_COUNT_QUERY,
  CATEGORY_POSTS_QUERY,
  CATEGORY_SLUGS_QUERY,
  type CategoryProfile,
  type PostCard,
} from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { PostListing } from "@/components/blogs/post-listing";
import { Pagination } from "@/components/blogs/pagination";

export const revalidate = 300; // Index updates more often than individual posts.

// Matches PostListing's "at most 12 entries" contract.
export const PAGE_SIZE = 12;

type Props = {
  params: Promise<{ slug: string }>;
};

async function getCategoryTitle(slug: string): Promise<string | null> {
  const category = await client.fetch<CategoryProfile | null>(
    CATEGORY_BY_SLUG_QUERY,
    { slug },
  );
  return category?.title ?? null;
}

async function getCategoryPostCount(slug: string): Promise<number> {
  return client.fetch<number>(CATEGORY_POSTS_COUNT_QUERY, { slug });
}

async function getPage(
  slug: string,
): Promise<{ posts: PostCard[]; totalPages: number }> {
  const [posts, count] = await Promise.all([
    client.fetch<PostCard[]>(CATEGORY_POSTS_QUERY, {
      slug,
      start: 0,
      end: PAGE_SIZE,
    }),
    getCategoryPostCount(slug),
  ]);

  return { posts, totalPages: Math.max(1, Math.ceil(count / PAGE_SIZE)) };
}

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(CATEGORY_SLUGS_QUERY);
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = await getCategoryTitle(slug);

  if (!title) {
    return { title: "Category Not Found", robots: { index: false, follow: false } };
  }

  return buildMetadata({
    path: `/blogs/category/${slug}`,
    title: `${title} Articles: AI Agency Insights`,
    description: `Browse ${title} articles on the Blogspage blog: hands-on engineering guides, AI automation playbooks, and field notes for growing businesses.`,
  });
}

export default async function CategoryArchivePage({ params }: Props) {
  const { slug } = await params;
  const title = await getCategoryTitle(slug);

  if (!title) {
    notFound();
  }

  // Defence in depth: a slug whose category document has zero live posts
  // should never have made it past CATEGORY_SLUGS_QUERY's own filter.
  const count = await getCategoryPostCount(slug);
  if (count === 0) {
    notFound();
  }

  const { posts, totalPages } = await getPage(slug);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <Breadcrumb
            trail={[
              { name: "Blog", path: "/blogs" },
              { name: title, path: `/blogs/category/${slug}` },
            ]}
          />
          <p className="mt-6 text-sm font-medium tracking-wide text-primary">
            Category
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Every Blogspage article filed under {title}, newest first.
          </p>
        </div>
      </section>

      {/* Post grid */}
      <section className="mx-auto max-w-6xl bg-background px-6 py-16 lg:px-8 lg:py-24">
        <PostListing posts={posts} />
        <Pagination
          currentPage={1}
          totalPages={totalPages}
          basePath={`/blogs/category/${slug}`}
        />
      </section>
    </>
  );
}
