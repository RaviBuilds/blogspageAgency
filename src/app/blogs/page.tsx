import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blogs | Blogspage",
  description:
    "Field notes on product engineering, local SEO, and building revenue systems for modern businesses.",
};

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: string;
};

/**
 * MDX-ready listing source.
 * Replace this static array with a content-collection / MDX loader
 * (e.g. reading from `content/blog/*.mdx` frontmatter) during migration.
 * The listing UI below is decoupled from the source shape via BlogPost.
 */
const posts: BlogPost[] = [
  {
    slug: "escape-aggregator-commissions",
    title: "How to escape 30% aggregator commissions for good",
    excerpt:
      "A practical teardown of the white-label ordering stack that lets local operators keep their margin and their customers.",
    category: "Online Delivery",
    date: "2026-05-28",
    readingTime: "8 min read",
  },
  {
    slug: "core-web-vitals-budget",
    title: "Shipping a Core Web Vitals budget your team won't break",
    excerpt:
      "LCP under 1.2s, INP under 50ms, CLS at zero. The constraints we hold every page to, and how we enforce them in CI.",
    category: "Performance",
    date: "2026-05-14",
    readingTime: "6 min read",
  },
  {
    slug: "pause-credit-engine",
    title: "Designing a pause-credit engine that defends recurring revenue",
    excerpt:
      "Letting gym members freeze fairly without bleeding contract value, modelled as an append-only ledger.",
    category: "Gym & Fitness",
    date: "2026-04-30",
    readingTime: "7 min read",
  },
  {
    slug: "local-seo-routing",
    title: "A deterministic local-SEO routing engine in Next.js",
    excerpt:
      "One slug contract, ten verticals, every city. How we generate ProfessionalService schema from a single registry.",
    category: "Local SEO",
    date: "2026-04-16",
    readingTime: "9 min read",
  },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function BlogsPage() {
  return (
    <main className="min-h-screen">
      {/* Header band */}
      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-3xl px-6 py-24 lg:px-8 lg:py-32">
          <p className="text-sm font-medium text-primary">Writing</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            The Blogspage journal.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Engineering deep-dives, local SEO playbooks, and the systems behind
            high-conversion business platforms.
          </p>
        </div>
      </section>

      {/* Reading canvas: constrained measure, MDX-ready listing */}
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-20">
        {posts.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Posts coming soon.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-white/[0.06]">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blogs/${post.slug}`}
                  className="group flex flex-col gap-3 py-8 transition-colors"
                >
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-foreground/70">
                      {post.category}
                    </span>
                    <span>{formatDate(post.date)}</span>
                    <span aria-hidden>·</span>
                    <span>{post.readingTime}</span>
                  </div>

                  <h2 className="flex items-start gap-2 text-xl font-medium tracking-tight transition-colors group-hover:text-primary">
                    {post.title}
                    <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </h2>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
