import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { client } from "@/sanity/lib/client";
import { LATEST_POSTS_QUERY, type LatestPost } from "@/sanity/lib/queries";
import { TYPE_MICRO_LABEL, TYPE_QUIET } from "@/lib/brand-type";
import { RHYTHM_QUIET } from "@/lib/section-rhythm";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

/**
 * Section heading treatment — the journal is deliberately the page's QUIET
 * register. It is supporting evidence, not a claim, so it carries neither the
 * brand text sweep nor the section-tier size: both are reserved for the
 * movements that make an argument. The heading renders as one plain phrase.
 */
const HEADING_TEXT = "From the journal";

async function getLatestPosts(): Promise<LatestPost[]> {
  return client.fetch<LatestPost[]>(LATEST_POSTS_QUERY);
}

export async function LatestBlogs() {
  const posts = await getLatestPosts();

  if (posts.length === 0) {
    return null;
  }

  /* Subtle top hairline: every other homepage section uses
     `border-border-subtle`, and the journal is the page's quietest register —
     the stronger rule was announcing it louder than the movements it sits
     between. */
  return (
    <section className="border-t border-border-subtle bg-background">
      <div className={`mx-auto max-w-6xl px-6 lg:px-8 ${RHYTHM_QUIET}`}>
        <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={TYPE_MICRO_LABEL}>Journal</p>
            <h2 className={`mt-2 ${TYPE_QUIET}`}>{HEADING_TEXT}</h2>
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

        {/*
          A ruled index, not a card grid.

          The journal used to render as three bordered cards on a tinted surface
          that scaled up on hover — the same card language the page already uses
          for services, industries, pathways and the work archive. Reusing it
          here gave an archive listing the same visual weight as the page's
          arguments, and `hover:scale` on a text link is motion with no meaning.

          An index is a list of references, so it is set as one: hairline-ruled
          rows, the date as a quiet leading column, the title carrying the row.
          Hover moves the arrow only — the same restrained affordance the "View
          all articles" link uses.
        */}
        <ul className="border-t border-border-subtle">
          {posts.map((post) => (
            <li key={post._id} className="border-b border-border-subtle">
              <Link
                href={`/blogs/${post.slug}`}
                className="group flex items-baseline gap-4 py-5 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:gap-8"
              >
                {post.publishedAt ? (
                  <time
                    dateTime={post.publishedAt}
                    className="hidden w-28 shrink-0 text-xs tabular-nums text-muted-foreground sm:block"
                  >
                    {formatDate(post.publishedAt)}
                  </time>
                ) : (
                  /* Keeps the title column aligned when a post has no date. */
                  <span aria-hidden className="hidden w-28 shrink-0 sm:block" />
                )}

                <h3 className="flex-1 text-lg font-medium tracking-tight text-balance">
                  {post.title}
                  {/* The date still has to reach a phone, where the leading
                      column is hidden. */}
                  {post.publishedAt ? (
                    <time
                      dateTime={post.publishedAt}
                      className="mt-1 block text-xs tabular-nums text-muted-foreground sm:hidden"
                    >
                      {formatDate(post.publishedAt)}
                    </time>
                  ) : null}
                </h3>

                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
