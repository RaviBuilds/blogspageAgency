import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blogs | Blogspage",
  description:
    "Field notes on product engineering, local SEO, and building revenue systems for modern businesses.",
};

/**
 * Edge-to-edge reading layout skeleton.
 * Existing WordPress / custom blog content will be migrated into the
 * <article> reading canvas below (MDX or CMS-driven) at a later stage.
 */
export default function BlogsPage() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-3xl px-6 py-24 lg:px-8 lg:py-32">
          <p className="text-sm font-medium text-primary">Writing</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            The Blogspage journal.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Engineering deep-dives, local SEO playbooks, and the systems behind
            high-conversion business platforms. Posts are being migrated here.
          </p>
        </div>
      </section>

      {/* Reading canvas skeleton: posts render into this constrained measure. */}
      <article className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
        <div className="space-y-4" aria-hidden>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-6"
            >
              <div className="h-3 w-24 rounded-full bg-white/[0.06]" />
              <div className="h-5 w-3/4 rounded-full bg-white/[0.08]" />
              <div className="h-3 w-full rounded-full bg-white/[0.04]" />
              <div className="h-3 w-5/6 rounded-full bg-white/[0.04]" />
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Posts coming soon.
        </p>
      </article>
    </main>
  );
}
