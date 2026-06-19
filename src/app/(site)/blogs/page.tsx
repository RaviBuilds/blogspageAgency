import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { client } from "@/sanity/lib/client";

export const revalidate = 60; // Revalidate the page every 60 seconds

export const metadata: Metadata = {
  title: "Insights & Engineering | Blogspage",
  description:
    "Technical deep-dives, web architecture, and field notes on building high-conversion business platforms.",
};

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  imageUrl?: string;
  publishedAt?: string;
  authorName?: string;
  categories?: string[];
};

const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  publishedAt,
  "authorName": author->name,
  "categories": categories[]->title
}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

async function getPosts(): Promise<BlogPost[]> {
  return client.fetch<BlogPost[]>(POSTS_QUERY);
}

export default async function BlogsPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <p className="text-sm font-medium tracking-wide text-primary">
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
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-8 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Articles coming soon. Check back shortly.
            </p>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const category = post.categories?.[0];

              return (
                <li key={post._id}>
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary"
                  >
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      {post.imageUrl ? (
                        <Image
                          src={post.imageUrl}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            Blogspage
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      {category ? (
                        <span className="inline-flex w-fit rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground">
                          {category}
                        </span>
                      ) : null}

                      <h2 className="mt-3 line-clamp-2 text-lg font-medium tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {post.title}
                      </h2>

                      <p className="mt-auto pt-4 text-xs text-muted-foreground">
                        {post.authorName ? (
                          <span>{post.authorName}</span>
                        ) : null}
                        {post.authorName && post.publishedAt ? (
                          <span aria-hidden className="mx-1.5">
                            ·
                          </span>
                        ) : null}
                        {post.publishedAt ? (
                          <time dateTime={post.publishedAt}>
                            {formatDate(post.publishedAt)}
                          </time>
                        ) : null}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
