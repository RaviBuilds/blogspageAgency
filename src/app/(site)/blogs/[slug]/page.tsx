import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

import { BlogFooterCTA } from "@/components/blogs/BlogFooterCTA";
import { CodeBlock } from "@/components/blogs/CodeBlock";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
  POST_QUERY,
  POST_SLUGS_QUERY,
  RELATED_POSTS_FALLBACK_QUERY,
  type Post,
  type PostCard,
} from "@/sanity/lib/queries";
import {
  SITE_URL,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  decodeHtmlEntities,
  getReadingTime,
  postUrl,
  resolveDescription,
} from "@/lib/blog";
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

const portableTextComponents: PortableTextComponents = {
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

      return (
        <figure className="not-prose my-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={image.alt || "Blog illustration"}
            className="h-auto w-full rounded-2xl border border-white/[0.08] object-cover shadow-2xl"
          />
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

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
  const canonical = post.canonicalUrl || postUrl(post.slug);

  return {
    title,
    description,
    keywords: post.seoKeywords?.length ? post.seoKeywords : undefined,
    authors: post.author?.name ? [{ name: post.author.name }] : undefined,
    alternates: { canonical },
    robots: {
      index: !post.noindex,
      follow: !post.nofollow,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.lastReviewed || post._updatedAt || post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      tags: post.seoKeywords,
      ...(post.ogImageUrl && {
        images: [
          { url: post.ogImageUrl, width: 1200, height: 630, alt: ogTitle },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      ...(post.ogImageUrl && { images: [post.ogImageUrl] }),
    },
  };
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
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(post);
  const faqJsonLd = buildFaqJsonLd(post.faq);
  const showUpdated =
    post.lastReviewed &&
    post.publishedAt &&
    new Date(post.lastReviewed).toDateString() !==
      new Date(post.publishedAt).toDateString();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <article className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-24">
        <header className="mb-10 border-b border-border pb-10">
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
              <span className="text-foreground">{post.author.name}</span>
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
