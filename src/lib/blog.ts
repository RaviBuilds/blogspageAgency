import type {PortableTextBlock} from '@portabletext/types'

import type {FaqItem, Post} from '@/sanity/lib/queries'

import { SITE_NAME, SITE_URL } from "@/lib/site";
import { DESCRIPTION_MIN, clampDescription } from "@/lib/seo";
import {
  breadcrumbNode,
  faqNode,
  omitEmpty,
  type BreadcrumbItem,
} from "@/lib/structured-data";

// Re-exported rather than defined locally: `src/lib/site.ts` is the identity
// source of truth, and every call site importing `SITE_URL`/`SITE_NAME` from
// this module keeps working unchanged.
export { SITE_NAME, SITE_URL };

const WORDS_PER_MINUTE = 225;

/** Extract readable plain text from Portable Text (ignores non-text blocks). */
export function portableTextToPlain(blocks?: PortableTextBlock[]): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .filter((block) => block?._type === "block")
    .map((block) => {
      const children = (block as { children?: { text?: string }[] }).children;
      if (!Array.isArray(children)) return "";
      return children.map((child) => child?.text ?? "").join("");
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(text: string): number {
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

/** Reading time in whole minutes (minimum 1), derived at render time. */
export function getReadingTime(blocks?: PortableTextBlock[]): number {
  const words = countWords(portableTextToPlain(blocks));
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** ISO-8601 duration (e.g. "PT5M") for schema.org timeRequired. */
export function toIsoDuration(minutes: number): string {
  return `PT${Math.max(1, minutes)}M`;
}

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function postUrl(slug: string): string {
  return `${SITE_URL}/blogs/${slug}`;
}

/**
 * Best available description, in priority order: `metaDescription` ->
 * `excerpt` -> a generic fallback naming the post.
 *
 * When the chosen source is under {@link DESCRIPTION_MIN} characters (after
 * entity decoding), it is extended with body text pulled from
 * {@link portableTextToPlain} until the combined string reaches the 120-160
 * character window, then clamped through {@link clampDescription} so the
 * result never exceeds 160 characters and never cuts mid-word. If body text
 * is unavailable or too short to close the gap, the short result is returned
 * as-is — `clampDescription` does not pad, so a persistently short
 * description surfaces as a content gap for the check suite to catch rather
 * than being silently hidden.
 */
export function resolveDescription(post: Post): string {
  const raw =
    post.metaDescription || post.excerpt || `Read ${post.title} on the ${SITE_NAME} journal.`;
  const decoded = decodeHtmlEntities(raw);

  if (decoded.length >= DESCRIPTION_MIN) {
    return clampDescription(decoded);
  }

  const bodyText = portableTextToPlain(post.content);
  if (!bodyText) {
    return decoded;
  }

  let extended = decoded;
  for (const word of bodyText.split(/\s+/).filter(Boolean)) {
    if (extended.length >= DESCRIPTION_MIN) break;
    extended = `${extended} ${word}`.trim();
  }

  return clampDescription(extended);
}

/**
 * schema.org BlogPosting. The single most impactful structured-data type for
 * articles — drives rich results, Google Discover eligibility, and gives LLM
 * crawlers clean, attributable metadata.
 */
export function buildArticleJsonLd(post: Post): Record<string, unknown> {
  const words = countWords(portableTextToPlain(post.content));
  const readingMinutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  const url = postUrl(post.slug);
  const headline = decodeHtmlEntities(post.title);
  const datePublished = post.publishedAt;
  const dateModified = post.lastReviewed || post._updatedAt || post.publishedAt;

  // `omitEmpty` below strips any of these that end up empty, null, or
  // undefined, so the known author-URL defect (an author with no slug) drops
  // the property instead of emitting a broken link — it does not get silently
  // dropped when the slug *is* present, since a non-empty string survives
  // `omitEmpty` untouched.
  const author = post.author
    ? omitEmpty({
        "@type": "Person",
        name: post.author.name,
        jobTitle: post.author.jobTitle,
        url: post.author.slug
          ? `${SITE_URL}/blogs/author/${post.author.slug}`
          : undefined,
        sameAs: post.author.sameAs,
      })
    : { "@type": "Organization", name: SITE_NAME, url: SITE_URL };

  const image = post.imageUrl
    ? omitEmpty({
        "@type": "ImageObject",
        url: post.imageUrl,
        caption: post.imageCaption,
      })
    : undefined;

  return omitEmpty({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline,
    description: resolveDescription(post),
    image,
    datePublished,
    dateModified,
    author,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/blogspage-logo.png`,
      },
    },
    keywords: post.seoKeywords?.length ? post.seoKeywords.join(", ") : undefined,
    articleSection: post.categories?.length
      ? post.categories.map((c) => c.title).filter(Boolean)
      : undefined,
    wordCount: words,
    timeRequired: toIsoDuration(readingMinutes),
    inLanguage: "en-US",
  });
}

/** schema.org BreadcrumbList — improves SERP breadcrumb display and crawlability. */
export function buildBreadcrumbJsonLd(post: Post): Record<string, unknown> {
  const trail: BreadcrumbItem[] = [
    { name: "Blog", path: "/blogs" },
    { name: decodeHtmlEntities(post.title), path: `/blogs/${post.slug}` },
  ];
  return breadcrumbNode(trail);
}

/** schema.org FAQPage — eligible for FAQ rich results and AI answer extraction. */
export function buildFaqJsonLd(faq?: FaqItem[]): Record<string, unknown> | null {
  return faqNode(faq);
}
