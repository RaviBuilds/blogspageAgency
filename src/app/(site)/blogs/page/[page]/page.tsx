import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { client } from "@/sanity/lib/client";
import { POSTS_PAGE_QUERY, POSTS_COUNT_QUERY, type PostCard } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { PostListing } from "@/components/blogs/post-listing";
import { Pagination } from "@/components/blogs/pagination";
import { PAGE_SIZE } from "@/app/(site)/blogs/page";

export const revalidate = 300; // Index updates more often than individual posts.

type Props = {
  params: Promise<{ page: string }>;
};

// A clean positive-integer string only: rejects "1.5", "01", "abc", "-1", "0".
const PAGE_PARAM_PATTERN = /^[1-9]\d*$/;

function parsePage(pageParam: string): number | null {
  return PAGE_PARAM_PATTERN.test(pageParam) ? Number(pageParam) : null;
}

async function getTotalPages(): Promise<number> {
  const count = await client.fetch<number>(POSTS_COUNT_QUERY);
  return Math.max(1, Math.ceil(count / PAGE_SIZE));
}

async function getPagePosts(page: number): Promise<PostCard[]> {
  const start = (page - 1) * PAGE_SIZE;
  const end = page * PAGE_SIZE;
  return client.fetch<PostCard[]>(POSTS_PAGE_QUERY, { start, end });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page: pageParam } = await params;
  const page = parsePage(pageParam);

  if (page === null) {
    return { title: "Page Not Found", robots: { index: false, follow: false } };
  }

  return buildMetadata({
    path: `/blogs/page/${page}`,
    title: `Insights & Engineering: the ai automation blog — Page ${page}`,
    description: `Technical deep-dives, engineering playbooks, and field notes on AI automation and web architecture. Page ${page} of the Blogspage journal archive.`,
    index: false,
  });
}

export default async function BlogsPagedPage({ params }: Props) {
  const { page: pageParam } = await params;
  const page = parsePage(pageParam);

  // Page 1 only exists at /blogs; /blogs/page/1 would otherwise duplicate it.
  if (page === null || page === 1) {
    notFound();
  }

  const totalPages = await getTotalPages();

  if (page > totalPages) {
    notFound();
  }

  const posts = await getPagePosts(page);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <Breadcrumb
            trail={[
              { name: "Blog", path: "/blogs" },
              { name: `Page ${page}`, path: `/blogs/page/${page}` },
            ]}
          />
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
        <Pagination currentPage={page} totalPages={totalPages} basePath="/blogs" />
      </section>
    </>
  );
}
