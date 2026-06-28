import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { client } from "@/sanity/lib/client";
import { LATEST_POSTS_QUERY, type LatestPost } from "@/sanity/lib/queries";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

async function getLatestPosts(): Promise<LatestPost[]> {
  return client.fetch<LatestPost[]>(LATEST_POSTS_QUERY);
}

export async function LatestBlogs() {
  const posts = await getLatestPosts();

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Journal</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Latest articles
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Engineering deep-dives, local SEO playbooks, and the systems behind
              high-conversion business platforms.
            </p>
          </div>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-foreground"
          >
            View all articles
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post._id}>
              <Link
                href={`/blogs/${post.slug}`}
                className="group flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:scale-[1.02] hover:border-primary"
              >
                {post.publishedAt ? (
                  <time
                    dateTime={post.publishedAt}
                    className="text-xs text-muted-foreground"
                  >
                    {formatDate(post.publishedAt)}
                  </time>
                ) : null}

                <h3 className="mt-3 flex items-start gap-2 text-lg font-medium tracking-tight transition-colors group-hover:text-primary">
                  {post.title}
                  <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
