import type {PortableTextBlock} from '@portabletext/types'

import type {FaqItem, Post} from '@/sanity/lib/queries'

export const SITE_URL = "https://blogspage.com";
export const SITE_NAME = "Blogspage";
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

/** Best available description, in priority order. */
export function resolveDescription(post: Post): string {
  const raw =
    post.metaDescription || post.excerpt || `Read ${post.title} on the ${SITE_NAME} journal.`;
  return decodeHtmlEntities(raw);
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

  const author = post.author
    ? {
        "@type": "Person",
        name: post.author.name,
        ...(post.author.jobTitle && { jobTitle: post.author.jobTitle }),
        ...(post.author.slug && { url: `${SITE_URL}/blogs/author/${post.author.slug}` }),
        ...(post.author.sameAs?.length && { sameAs: post.author.sameAs }),
      }
    : { "@type": "Organization", name: SITE_NAME, url: SITE_URL };

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    headline,
    description: resolveDescription(post),
    ...(post.imageUrl && {
      image: {
        "@type": "ImageObject",
        url: post.imageUrl,
        ...(post.imageCaption && { caption: post.imageCaption }),
      },
    }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
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
    ...(post.seoKeywords?.length && { keywords: post.seoKeywords.join(", ") }),
    ...(post.categories?.length && {
      articleSection: post.categories.map((c) => c.title).filter(Boolean),
    }),
    wordCount: words,
    timeRequired: toIsoDuration(readingMinutes),
    inLanguage: "en-US",
  };
}

/** schema.org BreadcrumbList — improves SERP breadcrumb display and crawlability. */
export function buildBreadcrumbJsonLd(post: Post): Record<string, unknown> {
  const items = [
    { name: "Home", item: SITE_URL },
    { name: "Blog", item: `${SITE_URL}/blogs` },
    { name: decodeHtmlEntities(post.title), item: postUrl(post.slug) },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

/** schema.org FAQPage — eligible for FAQ rich results and AI answer extraction. */
export function buildFaqJsonLd(faq?: FaqItem[]): Record<string, unknown> | null {
  if (!faq?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
