import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

import { BlogFooterCTA } from "@/components/blogs/BlogFooterCTA";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60; // Revalidate the page every 60 seconds

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type BlogPost = {
  title: string;
  imageUrl?: string;
  publishedAt?: string;
  content?: PortableTextBlock[];
  seoTitle?: string;
  metaDescription?: string;
  seoKeywords?: string[];
  ogImageUrl?: string;
};

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  title,
  "imageUrl": mainImage.asset->url,
  publishedAt,
  content,
  seoTitle,
  metaDescription,
  seoKeywords,
  "ogImageUrl": coalesce(ogImage.asset->url, mainImage.asset->url)
}`;

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

      const src = urlFor(image).url();
      if (!src) return null;

      return (
        <div className="not-prose">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={image.alt || "Blog illustration"}
            className="my-12 h-auto w-full rounded-2xl border border-white/[0.08] object-cover shadow-2xl"
          />
        </div>
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href;
      if (!href) return <>{children}</>;
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline-offset-4 hover:underline"
        >
          {children}
        </a>
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

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function getPost(slug: string): Promise<BlogPost | null> {
  return client.fetch<BlogPost | null>(POST_QUERY, { slug });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post Not Found | Blogspage" };
  }

  const title = decodeHtmlEntities(post.seoTitle || post.title);
  const description = post.metaDescription
    ? decodeHtmlEntities(post.metaDescription)
    : `Read ${decodeHtmlEntities(post.title)} on the Blogspage journal.`;

  const metadata: Metadata = {
    title: `${title} | Blogspage`,
    description,
    keywords: post.seoKeywords?.length ? post.seoKeywords : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.ogImageUrl && {
        images: [
          {
            url: post.ogImageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(post.ogImageUrl && { images: [post.ogImageUrl] }),
    },
  };

  return metadata;
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-24">
      <header className="mb-10 border-b border-border pb-10">
        {post.publishedAt ? (
          <time
            dateTime={post.publishedAt}
            className="text-sm font-medium text-primary"
          >
            {formatDate(post.publishedAt)}
          </time>
        ) : null}

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {decodeHtmlEntities(post.title)}
        </h1>
      </header>

      {post.imageUrl ? (
        <div className="relative mb-10 aspect-video overflow-hidden rounded-xl border border-border">
          <Image
            src={post.imageUrl}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      ) : null}

      {post.content ? (
        <div className="prose prose-invert max-w-none">
          <PortableText value={post.content} components={portableTextComponents} />
        </div>
      ) : null}
    </article>
  );
}
