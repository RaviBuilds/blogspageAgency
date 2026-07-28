import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { client } from "@/sanity/lib/client";
import {
  CATEGORY_BY_SLUG_QUERY,
  CATEGORY_POSTS_COUNT_QUERY,
  CATEGORY_POSTS_QUERY,
  type CategoryProfile,
  type PostCard,
} from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { PostListing } from "@/components/blogs/post-listing";
import { Pagination } from "@/components/blogs/pagination";
import { PAGE_SIZE } from "@/app/(site)/blogs/category/[slug]/page";

export const revalidate = 300; // Index updates more often than individual posts.

type Props = {
  params: Promise<{ slug: string; page: string }>;
};

// A clean positive-integer string only: rejects "1.5", "01", "abc", "-1", "0".
const PAGE_PARAM_PATTERN = /^[1-9]\d*$/;

function parsePage(pageParam: string): number | null {
  return PAGE_PARAM_PATTERN.test(pageParam) ? Number(pageParam) : null;
}

async function getCategoryTitle(slug: string): Promise<string | null> {
  const category = await client.fetch<CategoryProfile | null>(
    CATEGORY_BY_SLUG_QUERY,
    { slug },
  );
  return category?.title ?? null;
}

async function getTotalPages(slug: string): Promise<number> {
  const count = await client.fetch<number>(CATEGORY_POSTS_COUNT_QUERY, {
    slug,
  });
  return Math.max(1, Math.ceil(count / PAGE_SIZE));
}

async function getPagePosts(slug: string, page: number): Promise<PostCard[]> {
  const start = (page - 1) * PAGE_SIZE;
  const end = page * PAGE_SIZE;
  return client.fetch<PostCard[]>(CATEGORY_POSTS_QUERY, { slug, start, end });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, page: pageParam } = await params;
  const page = parsePage(pageParam);
  const title = await getCategoryTitle(slug);

  if (page === null || !title) {
    return { title: "Page Not Found", robots: { index: false, follow: false } };
  }

  return buildMetadata({
    path: `/blogs/category/${slug}/page/${page}`,
    title: `${title} Articles: AI Agency Insights — Page ${page}`,
    description: `Browse ${title} articles on the Blogspage blog: hands-on engineering guides, AI automation playbooks, and field notes for growing businesses. Page ${page}.`,
    index: false,
  });
}

export default async function CategoryArchivePagedPage({ params }: Props) {
  const { slug, page: pageParam } = await params;
  const page = parsePage(pageParam);

  // Page 1 only exists at /blogs/category/<slug>; page/1 would otherwise
  // duplicate it.
  if (page === null || page === 1) {
    notFound();
  }

  const title = await getCategoryTitle(slug);

  if (!title) {
    notFound();
  }

  const totalPages = await getTotalPages(slug);

  if (page > totalPages) {
    notFound();
  }

  const posts = await getPagePosts(slug, page);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <Breadcrumb
            trail={[
              { name: "Blog", path: "/blogs" },
              { name: title, path: `/blogs/category/${slug}` },
              {
                name: `Page ${page}`,
                path: `/blogs/category/${slug}/page/${page}`,
              },
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
          currentPage={page}
          totalPages={totalPages}
          basePath={`/blogs/category/${slug}`}
        />
      </section>
    </>
  );
}
