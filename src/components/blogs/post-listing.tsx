import Image from "next/image";
import Link from "next/link";

import type { PostCard } from "@/sanity/lib/queries";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export type PostListingProps = {
  posts: PostCard[];
};

/**
 * Renders a grid of post cards, each a crawlable anchor to its post route.
 *
 * Callers are responsible for querying and slicing the right page (at most
 * 12 entries, ordered by `publishedAt` descending) before passing `posts`
 * here — this component does not fetch or slice on its own; it renders
 * whatever it is handed.
 */
export function PostListing({ posts }: PostListingProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card px-8 py-16 text-center">
        <p className="text-sm text-muted-foreground">
          Articles coming soon. Check back shortly.
        </p>
      </div>
    );
  }

  return (
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
                    alt={post.imageAlt || post.title}
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

                {post.excerpt ? (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {post.excerpt}
                  </p>
                ) : null}

                <p className="mt-auto pt-4 text-xs text-muted-foreground">
                  {post.authorName ? <span>{post.authorName}</span> : null}
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
  );
}
