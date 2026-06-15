import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

import { client } from "@/sanity/lib/client";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type BlogPost = {
  title: string;
  imageUrl?: string;
  publishedAt?: string;
  content?: PortableTextBlock[];
};

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  title,
  "imageUrl": mainImage.asset->url,
  publishedAt,
  content
}`;

const portableTextComponents: PortableTextComponents = {
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
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post Not Found | Blogspage" };
  }

  return {
    title: `${decodeHtmlEntities(post.title)} | Blogspage`,
    description: `Read ${decodeHtmlEntities(post.title)} on the Blogspage journal.`,
  };
}

export default async function BlogPost({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
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
