import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { client } from "@/sanity/lib/client";
import { LATEST_POSTS_QUERY, type LatestPost } from "@/sanity/lib/queries";
import { TYPE_META, TYPE_MICRO_LABEL, TYPE_QUIET } from "@/lib/brand-type";
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
     between.

     The measure is narrower than the page's `max-w-6xl` default. A ruled index
     of three long titles set across the full container produces rows so wide
     that the title, the date and the arrow stop reading as one unit. Publication
     indexes are set to a comfortable measure; this is that measure. */
  return (
    <section className="border-t border-border-subtle bg-background">
      <div className={`mx-auto max-w-4xl px-6 lg:px-8 ${RHYTHM_QUIET}`}>
        {/* Masthead. The label sits inline with a rule that runs to the "view
            all" link, so the journal opens like the head of a publication page
            rather than with the same stacked label-heading-lead block that ten
            other sections on this page use. */}
        <div className="flex items-center gap-4">
          <p className={`shrink-0 ${TYPE_MICRO_LABEL}`}>Journal</p>
          <span aria-hidden className="h-px flex-1 bg-border" />
          <Link
            href="/blogs"
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-foreground"
          >
            View all articles
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className={TYPE_QUIET}>{HEADING_TEXT}</h2>
          <p className="max-w-sm text-sm leading-relaxed text-text-subtle">
            Engineering deep-dives, local SEO playbooks, and the systems behind
            high-conversion business platforms.
          </p>
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
        <ul className="mt-12 border-t border-border">
          {posts.map((post, index) => (
            <li key={post._id} className="border-b border-border">
              <Link
                href={`/blogs/${post.slug}`}
                className="group relative flex items-baseline gap-5 py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:gap-8 lg:py-9"
              >
                {/* Hover wash. A ruled index has no card to highlight, so the
                    row itself lights very slightly and bleeds past the
                    container's padding — the affordance stays inside the
                    editorial language instead of reintroducing a card. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-x-4 -inset-y-px bg-foreground/[0.02] opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:-inset-x-6"
                />

                {/* Index numeral. Editorial numbering, in the same tabular
                    figures as the date, marking position in the list rather
                    than ranking the posts. */}
                <span
                  aria-hidden
                  className="relative shrink-0 text-xs tabular-nums text-text-disabled transition-colors duration-300 group-hover:text-primary"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="relative flex-1">
                  <h3 className="text-xl font-medium leading-snug tracking-tight text-balance transition-colors duration-300 group-hover:text-primary sm:text-2xl">
                    {post.title}
                  </h3>
                  {post.publishedAt ? (
                    <time
                      dateTime={post.publishedAt}
                      className={`mt-2 block tabular-nums ${TYPE_META}`}
                    >
                      {formatDate(post.publishedAt)}
                    </time>
                  ) : null}
                </div>

                <ArrowUpRight className="relative size-5 shrink-0 self-center text-text-disabled transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
