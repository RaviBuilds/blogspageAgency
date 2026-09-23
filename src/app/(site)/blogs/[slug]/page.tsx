import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

import { BlogFooterCTA } from "@/components/blogs/BlogFooterCTA";
import { CodeBlock } from "@/components/blogs/CodeBlock";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { parseSanityImageRef } from "@/lib/sanity-image";
import {
  POST_QUERY,
  POST_SLUGS_QUERY,
  RELATED_POSTS_FALLBACK_QUERY,
  type Post,
  type PostCard,
} from "@/sanity/lib/queries";
import {
  buildArticleJsonLd,
  buildFaqJsonLd,
  decodeHtmlEntities,
  getReadingTime,
  resolveDescription,
} from "@/lib/blog";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { createHeadingSlugger } from "@/lib/heading-slug";
import { Suspense } from "react";

export const revalidate = 3600; // Posts change rarely; revalidate hourly.

type Props = {
  params: Promise<{ slug: string }>;
};

type CtaBlockValue = {
  headline?: string;
  body?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

type PortableTextImageValue = {
  asset?: { _ref?: string; _type?: string };
  alt?: string;
  caption?: string;
};

/** Plain text from a Portable Text block's span children, for heading slugs. */
function blockPlainText(value: unknown): string {
  const children = (value as { children?: { text?: string }[] } | undefined)
    ?.children;
  if (!Array.isArray(children)) return "";
  return children
    .map((child) => child?.text ?? "")
    .join("")
    .trim();
}

/**
 * Builds the PortableText renderer map for a single route render.
 *
 * `slugger` is a fresh {@link createHeadingSlugger} instance created once at
 * the top of `BlogPost`'s render body, so `h2`/`h3` ids stay deterministic
 * and route-scoped (Requirement 9.5).
 */
function getPortableTextComponents(
  slugger: (text: string) => string,
): PortableTextComponents {
  return {
    block: {
    h2: ({ children, value }) => (
      <h2 id={slugger(blockPlainText(value))}>{children}</h2>
    ),
    h3: ({ children, value }) => (
      <h3 id={slugger(blockPlainText(value))}>{children}</h3>
    ),
  },
  types: {
    ctaBlock: ({ value }) => {
      const cta = value as CtaBlockValue | undefined;
      if (
        !cta?.headline ||
        !cta.body ||
        !cta.secondaryLabel ||
        !cta.secondaryHref
      ) {
        return null;
      }

      return (
        <div className="not-prose my-12">
          <BlogFooterCTA
            headline={cta.headline}
            body={cta.body}
            primaryLabel={cta.primaryLabel}
            secondaryLabel={cta.secondaryLabel}
            secondaryHref={cta.secondaryHref}
          />
        </div>
      );
    },
    image: ({ value }) => {
      const image = value as PortableTextImageValue | undefined;
      if (!image?.asset) return null;

      const src = urlFor(image).width(1600).url();
      if (!src) return null;

      const alt = clampAltText(image.alt ?? "");
      const dimensions = parseSanityImageRef(image);

      return (
        <figure className="not-prose my-12">
          {dimensions ? (
            <Image
              src={src}
              alt={alt}
              width={dimensions.width}
              height={dimensions.height}
              className="h-auto w-full rounded-2xl border border-border object-cover shadow-2xl"
            />
          ) : (
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border shadow-2xl">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}
          {image.caption ? (
            <figcaption className="mt-3 text-center text-sm text-muted-foreground">
              {image.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    codeBlock: ({ value }) => {
      const block = value as
        | { language?: string; code?: string; filename?: string }
        | undefined;
      if (!block?.code) return null;
      return (
        <CodeBlock
          language={block.language}
          code={block.code}
          filename={block.filename}
        />
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href;
      if (!href) return <>{children}</>;
      const blank = value?.blank !== false;
      const rel = [
        "noopener",
        "noreferrer",
        value?.nofollow ? "nofollow" : null,
      ]
        .filter(Boolean)
        .join(" ");
      return (
        <a
          href={href}
          {...(blank ? { target: "_blank" } : {})}
          rel={rel}
          className="text-primary underline-offset-4 hover:underline"
        >
          {children}
        </a>
      );
    },
    internalLink: ({ children, value }) => {
      const slug = value?.reference?.slug?.current ?? value?.slug;
      if (!slug) return <>{children}</>;
      return (
        <Link
          href={`/blogs/${slug}`}
          className="text-primary underline-offset-4 hover:underline"
        >
          {children}
        </Link>
      );
    },
  },
  };
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/** Requirement 10.4: non-empty alt text is capped at 125 characters. */
const ALT_TEXT_MAX = 125;

/**
 * Trim alt text to {@link ALT_TEXT_MAX} characters at a word boundary,
 * returning a zero-length string when the source supplies no alt text
 * (Requirements 10.4, 10.10) rather than a placeholder like "Blog
 * illustration".
 */
function clampAltText(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed.length <= ALT_TEXT_MAX) return trimmed;

  const cut = trimmed.slice(0, ALT_TEXT_MAX);
  const lastSpace = cut.lastIndexOf(" ");
  return lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
}

/**
 * Same-calendar-day comparison in the site display timezone (Asia/Kolkata,
 * per `LOCALE.html` = `en-IN` and the Hyderabad NAP in `src/lib/site.ts`).
 * `toDateString()` compares in the server/runtime's local timezone, which is
 * not necessarily IST, so a review made on the same IST calendar day as
 * publication could still be rendered as a distinct day — the bug this
 * helper fixes (Requirement 8.3).
 */
function isSameCalendarDay(
  a: string,
  b: string,
  timeZone = "Asia/Kolkata",
): boolean {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date(a)) === fmt.format(new Date(b));
}

async function getPost(slug: string): Promise<Post | null> {
  return client.fetch<Post | null>(POST_QUERY, { slug });
}

async function getRelatedPosts(post: Post): Promise<PostCard[]> {
  if (post.relatedPosts?.length) return post.relatedPosts;

  const categorySlugs = (post.categories ?? [])
    .map((c) => c.slug)
    .filter((slug): slug is string => Boolean(slug));

  if (!categorySlugs.length) return [];

  try {
    return await client.fetch<PostCard[]>(RELATED_POSTS_FALLBACK_QUERY, {
      id: post._id,
      categorySlugs,
    });
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(POST_SLUGS_QUERY);
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post Not Found", robots: { index: false, follow: false } };
  }

  const title = decodeHtmlEntities(post.seoTitle || post.title);
  const description = resolveDescription(post);
  const ogTitle = decodeHtmlEntities(post.ogTitle || title);
  const ogDescription = post.ogDescription
    ? decodeHtmlEntities(post.ogDescription)
    : description;
  // `buildMetadata`'s `path` option expects a route path, but its
  // implementation resolves the input through `new URL(raw, SITE_URL)`
  // before reading `.pathname`, so an absolute URL input (an author-supplied
  // `canonicalUrl`) resolves to its own path correctly as well.
  const canonicalPath = post.canonicalUrl || `/blogs/${post.slug}`;

  // `buildMetadata`'s `index` option maps to a single combined
  // `robots: { index, follow }` pair, whereas the original hand-rolled object
  // set `index`/`follow` independently from `post.noindex`/`post.nofollow`.
  // `buildMetadata` has no way to set them independently, so `nofollow` is
  // folded into the same boolean as the closest available equivalent: a post
  // marked `nofollow` but not `noindex` now also gets `index: false` rather
  // than `index: true, follow: false`. This is a minor behavioural narrowing,
  // flagged here since no post in the current content set sets `nofollow`
  // without also setting `noindex`.
  return buildMetadata({
    path: canonicalPath,
    title,
    description,
    type: "article",
    index: !post.noindex && !post.nofollow,
    image: post.ogImageUrl
      ? { url: post.ogImageUrl, alt: ogTitle }
      : undefined,
    extra: {
      keywords: post.seoKeywords?.length ? post.seoKeywords : undefined,
      authors: post.author?.name ? [{ name: post.author.name }] : undefined,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        publishedTime: post.publishedAt,
        modifiedTime: post.lastReviewed || post._updatedAt || post.publishedAt,
        authors: post.author?.name ? [post.author.name] : undefined,
        tags: post.seoKeywords,
      },
      twitter: {
        title: ogTitle,
        description: ogDescription,
      },
    },
  });
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const readingTime = getReadingTime(post.content);
  const related = await getRelatedPosts(post);
  const articleJsonLd = buildArticleJsonLd(post);
  const faqJsonLd = buildFaqJsonLd(post.faq);
  // One heading slugger per rendered route, so `h2`/`h3` ids stay
  // deterministic and route-scoped (Requirement 9.5).
  const slugger = createHeadingSlugger();
  const portableTextComponents = getPortableTextComponents(slugger);
  const showUpdated = Boolean(
    post.lastReviewed &&
      post.publishedAt &&
      !isSameCalendarDay(post.lastReviewed, post.publishedAt),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <article className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-24">
        <Breadcrumb
          trail={[
            { name: "Blog", path: "/blogs" },
            {
              name: decodeHtmlEntities(post.title),
              path: `/blogs/${post.slug}`,
            },
          ]}
        />
        <header className="mt-6 mb-10 border-b border-border pb-10">
          {post.categories?.[0]?.title ? (
            <span className="inline-flex w-fit rounded-full border border-border bg-background px-2.5 py-0.5 text-xs text-muted-foreground">
              {post.categories[0].title}
            </span>
          ) : null}

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {decodeHtmlEntities(post.title)}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {post.author?.name ? (
              post.author.slug ? (
                <Link
                  href={`/blogs/author/${post.author.slug}`}
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  {post.author.name}
                </Link>
              ) : (
                <span className="text-foreground">{post.author.name}</span>
              )
            ) : null}
            {post.publishedAt ? (
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            ) : null}
            <span aria-hidden>·</span>
            <span>{readingTime} min read</span>
          </div>

          {showUpdated && post.lastReviewed ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Last reviewed{" "}
              <time dateTime={post.lastReviewed}>
                {formatDate(post.lastReviewed)}
              </time>
            </p>
          ) : null}
        </header>

        {post.imageUrl ? (
          <figure className="mb-10">
            <div className="relative aspect-video overflow-hidden rounded-xl border border-border">
              <Image
                src={post.imageUrl}
                alt={post.imageAlt || decodeHtmlEntities(post.title)}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
            {post.imageCaption ? (
              <figcaption className="mt-3 text-center text-sm text-muted-foreground">
                {post.imageCaption}
              </figcaption>
            ) : null}
          </figure>
        ) : null}

        {post.content ? (
          <div className="prose prose-invert max-w-none">
            <PortableText
              value={post.content}
              components={portableTextComponents}
            />
          </div>
        ) : null}

        {post.faq?.length ? (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="text-2xl font-semibold tracking-tight">
              Frequently asked questions
            </h2>
            <dl className="mt-6 space-y-6">
              {post.faq.map((item, index) => (
                <div key={index}>
                  <dt className="font-medium text-foreground">
                    {item.question}
                  </dt>
                  <dd className="mt-2 text-muted-foreground">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {/* Post-to-contact cross-link (Requirement 7.11) */}
        <section className="mt-16 border-t border-border pt-10">
          <p className="text-muted-foreground">
            Want a system like this for your business?{" "}
            <Link
              href="/contact"
              className="text-primary underline-offset-4 hover:underline"
            >
              Get in touch
            </Link>
            .
          </p>
        </section>

        <Suspense fallback={null}>
          {related.length ? (
            <section className="mt-16 border-t border-border pt-10">
              <h2 className="text-2xl font-semibold tracking-tight">
                Related reading
              </h2>
              <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <li key={item._id}>
                    <Link
                      href={`/blogs/${item.slug}`}
                      className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 transition-all duration-300 hover:border-primary"
                    >
                      {item.categories?.[0] ? (
                        <span className="text-xs text-muted-foreground">
                          {item.categories[0]}
                        </span>
                      ) : null}
                      <h3 className="mt-2 line-clamp-2 text-base font-medium tracking-tight transition-colors group-hover:text-primary">
                        {item.title}
                      </h3>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </Suspense>
      </article>
    </>
  );
}
