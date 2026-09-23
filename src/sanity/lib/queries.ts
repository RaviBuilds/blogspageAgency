import type {PortableTextBlock} from '@portabletext/types'

/**
 * Centralised GROQ queries + result types for the blog.
 *
 * A single `LIVE_POST_FILTER` is reused everywhere so the rules for "what is
 * publicly visible" live in one place:
 *   - not a draft document
 *   - has a publishedAt date
 *   - publishedAt is not in the future (scheduled publishing)
 *   - not flagged noindex (kept out of listings/sitemap, still reachable by URL)
 */
export const LIVE_POST_FILTER = `_type == "post" && !(_id in path("drafts.**")) && defined(slug.current) && defined(publishedAt) && publishedAt <= now()`

// Shared projection for list/card surfaces.
const CARD_PROJECTION = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "imageUrl": mainImage.asset->url,
  "imageAlt": mainImage.alt,
  publishedAt,
  featured,
  "authorName": author->name,
  "categories": categories[]->title
`

/** Full blog index, newest first. */
export const POSTS_QUERY = `*[${LIVE_POST_FILTER}] | order(featured desc, publishedAt desc) {${CARD_PROJECTION}}`

/** Homepage "latest" rail. */
export const LATEST_POSTS_QUERY = `*[${LIVE_POST_FILTER}] | order(publishedAt desc)[0...3] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt
}`

/** Single post by slug, with everything needed to render + build metadata + JSON-LD. */
export const POST_QUERY = `*[${LIVE_POST_FILTER} && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "imageUrl": mainImage.asset->url,
  "imageAlt": mainImage.alt,
  "imageCaption": mainImage.caption,
  publishedAt,
  lastReviewed,
  _updatedAt,
  evergreen,
  content,
  seoTitle,
  metaDescription,
  seoKeywords,
  focusKeyword,
  canonicalUrl,
  noindex,
  nofollow,
  ogTitle,
  ogDescription,
  "ogImageUrl": coalesce(ogImage.asset->url, mainImage.asset->url),
  faq,
  "author": author->{
    name,
    "slug": slug.current,
    jobTitle,
    "imageUrl": image.asset->url,
    sameAs
  },
  "categories": categories[]->{title, "slug": slug.current},
  "relatedPosts": relatedPosts[]->{${CARD_PROJECTION}}
}`

/**
 * Automatic related-post fallback: same primary category, excludes the current
 * post. Used only when an editor has not hand-picked related posts.
 */
export const RELATED_POSTS_FALLBACK_QUERY = `*[${LIVE_POST_FILTER} && _id != $id && count((categories[]->slug.current)[@ in $categorySlugs]) > 0] | order(publishedAt desc)[0...3] {${CARD_PROJECTION}}`

/** Slugs + lastmod for the sitemap. */
export const POST_SITEMAP_QUERY = `*[${LIVE_POST_FILTER} && noindex != true] {
  "slug": slug.current,
  publishedAt,
  lastReviewed,
  evergreen,
  _updatedAt
}`

/** Slugs only, for generateStaticParams. */
export const POST_SLUGS_QUERY = `*[${LIVE_POST_FILTER}].slug.current`

/**
 * Paginated `/blogs` archive. `$start`/`$end` are a 0-indexed GROQ slice
 * range (e.g. start=0, end=12 for page 1 of a 12-per-page listing).
 */
export const POSTS_PAGE_QUERY = `*[${LIVE_POST_FILTER}] | order(publishedAt desc)[$start...$end] {${CARD_PROJECTION}}`

/** Total count of live posts, needed alongside POSTS_PAGE_QUERY to compute page count. */
export const POSTS_COUNT_QUERY = `count(*[${LIVE_POST_FILTER}])`

/** Paginated category archive: posts referencing the category with slug $slug. */
export const CATEGORY_POSTS_QUERY = `*[${LIVE_POST_FILTER} && $slug in categories[]->slug.current] | order(publishedAt desc)[$start...$end] {${CARD_PROJECTION}}`

/** Total count of live posts in a category, for page-count computation. */
export const CATEGORY_POSTS_COUNT_QUERY = `count(*[${LIVE_POST_FILTER} && $slug in categories[]->slug.current])`

/** Paginated author archive: posts authored by the author with slug $slug. */
export const AUTHOR_POSTS_QUERY = `*[${LIVE_POST_FILTER} && author->slug.current == $slug] | order(publishedAt desc)[$start...$end] {${CARD_PROJECTION}}`

/** Total count of live posts by an author, for page-count computation. */
export const AUTHOR_POSTS_COUNT_QUERY = `count(*[${LIVE_POST_FILTER} && author->slug.current == $slug])`

/**
 * Every category slug referenced by at least one live post. Categories with
 * zero live posts are excluded so their archive route never becomes a thin
 * indexable page.
 */
export const CATEGORY_SLUGS_QUERY = `*[_type == "category" && count(*[${LIVE_POST_FILTER} && references(^._id)]) > 0].slug.current`

/**
 * Every author slug referenced by at least one live post. Authors with zero
 * live posts are excluded so their profile route never becomes a thin
 * indexable page.
 */
export const AUTHOR_SLUGS_QUERY = `*[_type == "author" && count(*[${LIVE_POST_FILTER} && author._ref == ^._id]) > 0].slug.current`

/** Single category's display title by slug, for the category archive route. */
export const CATEGORY_BY_SLUG_QUERY = `*[_type == "category" && slug.current == $slug][0] { title, "slug": slug.current }`

/** Single author profile by slug, for the author archive route. */
export const AUTHOR_PROFILE_QUERY = `*[_type == "author" && slug.current == $slug][0] {
  name,
  "slug": slug.current,
  jobTitle,
  bio,
  sameAs,
  "imageUrl": image.asset->url
}`

/** 20 most recent live posts, excluding noindex, for the RSS/Atom feed. */
export const FEED_POSTS_QUERY = `*[${LIVE_POST_FILTER} && noindex != true] | order(publishedAt desc)[0...20] {
  title,
  "slug": slug.current,
  excerpt,
  publishedAt
}`

// --------------------------------------------------------------------- Types

export type FaqItem = {
  question: string
  answer: string
}

export type PostCard = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  imageUrl?: string
  imageAlt?: string
  publishedAt?: string
  featured?: boolean
  authorName?: string
  categories?: string[]
}

export type LatestPost = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
}

export type PostAuthor = {
  name?: string
  slug?: string
  jobTitle?: string
  imageUrl?: string
  sameAs?: string[]
}

export type PostCategory = {
  title?: string
  slug?: string
}

export type Post = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  imageUrl?: string
  imageAlt?: string
  imageCaption?: string
  publishedAt?: string
  lastReviewed?: string
  _updatedAt?: string
  evergreen?: boolean
  content?: PortableTextBlock[]
  seoTitle?: string
  metaDescription?: string
  seoKeywords?: string[]
  focusKeyword?: string
  canonicalUrl?: string
  noindex?: boolean
  nofollow?: boolean
  ogTitle?: string
  ogDescription?: string
  ogImageUrl?: string
  faq?: FaqItem[]
  author?: PostAuthor
  categories?: PostCategory[]
  relatedPosts?: PostCard[]
}

export type PostSitemapEntry = {
  slug: string
  publishedAt?: string
  lastReviewed?: string
  evergreen?: boolean
  _updatedAt?: string
}

export type CategoryProfile = {
  title?: string
  slug?: string
}

export type AuthorProfile = {
  name?: string
  slug?: string
  jobTitle?: string
  bio?: PortableTextBlock[]
  sameAs?: string[]
  imageUrl?: string
}

export type FeedPost = {
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
}
