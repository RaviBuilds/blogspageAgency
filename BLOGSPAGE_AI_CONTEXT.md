# BLOGSPAGE AI CONTENT CONTEXT

> **Purpose:** This document is the single source of truth for an AI system generating blog posts for the **Blogspage Agency** website. It describes the project, the Sanity content model, the exact JSON shape Sanity expects, validation rules, the house writing style, and the reusable content blocks available. An AI should be able to author and publish a fully valid blog post using only this document — no further inspection of the codebase is required.
>
> **Last verified against codebase:** Next.js 15 (App Router) + Sanity v3, `@portabletext/react` v6.

---

## 1. Project Overview

**Blogspage** is a senior product-engineering agency website. The agency builds production-grade SaaS products, workflow automation, and AI integrations for local/SMB businesses across 10 verticals, typically shipping in a focused **10–15 day launch window**.

- **Core stack of the agency's own site:** Next.js (App Router, React Server Components), Tailwind CSS v4, Framer Motion, Sanity (headless CMS), Supabase/Stripe/Vercel/Capacitor for client builds.
- **CMS:** Sanity Studio is mounted at `/studio`. All blog content lives in the Sanity `production` dataset.
- **Blog rendering:** Blog posts are written in Sanity as **Portable Text** and rendered on the Next.js front end with `@portabletext/react`.
- **The blog's editorial mission:** "Insights & Engineering" — technical deep-dives, web architecture, AI automation, local SEO playbooks, and the systems behind high-conversion business platforms.

### Agency service verticals (useful as blog topic anchors)
| Vertical | Angle |
| --- | --- |
| Online Delivery | Escape 25–30% aggregator commissions; white-label ordering + driver dispatch |
| Hotel Booking | OTA fee mitigation; direct booking + live room matrix |
| Pet Care | Unified medical + lifestyle booking wizard |
| Consulting | Authority-first site + embedded ROI discovery calculator |
| Education | Interactive syllabus builder + progressive player; retention |
| Gym & Fitness | Dynamic Pause-Credit engine; churn defense |
| Dental & Medical | HIPAA-aligned calendar orchestration |
| E-commerce | Optimized multi-step checkout; Core Web Vitals |
| SaaS Platforms | Tiered pricing + metered usage; Supabase RLS |
| SEO Blogs | Edge-delivered MDX reading canvas; Core Web Vitals |

---

## 2. Folder Structure (relevant to blogging)

```
src/
├── app/
│   ├── (site)/
│   │   ├── blogs/
│   │   │   ├── page.tsx              # Blog index / listing page
│   │   │   └── [slug]/page.tsx       # Single blog post (Portable Text render + SEO metadata)
│   │   ├── layout.tsx                # Site shell (navbar, footer)
│   │   └── page.tsx                  # Homepage
│   ├── studio/[[...tool]]/page.tsx   # Sanity Studio mount (/studio)
│   ├── sitemap.ts                    # Includes every post at /blogs/<slug>
│   └── robots.ts
├── components/
│   └── blogs/
│       └── BlogFooterCTA.tsx         # Renders the in-content "ctaBlock"
│   └── home/
│       └── latest-blogs.tsx          # Shows latest 3 posts on homepage
├── sanity/
│   ├── env.ts                        # projectId, dataset, apiVersion
│   ├── structure.ts                  # Studio desk structure (Posts, Categories, Authors)
│   ├── lib/
│   │   ├── client.ts                 # Read client (useCdn: true)
│   │   ├── write-client.ts           # Server-only write client (SANITY_WRITE_TOKEN)
│   │   └── image.ts                  # urlFor() image builder
│   └── schemaTypes/
│       ├── index.ts                  # Schema registry
│       ├── postType.ts               # ★ Blog post document
│       ├── categoryType.ts           # Category document
│       ├── authorType.ts             # Author document
│       ├── blockContentType.ts       # ★ Portable Text definition ("blockContent")
│       ├── ctaBlockType.ts           # In-content CTA object
│       └── leadType.ts               # Sales leads (not blog-related)
sanity.config.ts                      # Studio config
seed-meta.ts                          # Seeds the author + 4 categories
migrate.ts                            # WordPress → Sanity HTML→Portable Text importer
sanitize-data.ts / diagnose-and-fix.ts# Portable Text validators/repair scripts
```

---

## 3. Blog Architecture

- **Headless model:** Content is authored in Sanity, fetched via GROQ at request time, and rendered by Next.js with **ISR** (`export const revalidate = 60` — pages revalidate every 60 seconds).
- **Document type for a post:** `post`.
- **Body field:** `content`, of type `blockContent` (Portable Text array). It supports rich text, embedded images, and embedded `ctaBlock` objects.
- **Taxonomy:** posts reference `category` documents (array). Authors are `author` documents (single reference).
- **There is NO separate `tag` document type.** Keyword/tag behavior is handled by the `seoKeywords` string array on the post (rendered with a tags input UI). Do not invent a tag reference.

### GROQ queries actually used by the front end

**Listing page** (`/blogs`):
```groq
*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  publishedAt,
  "authorName": author->name,
  "categories": categories[]->title
}
```

**Single post** (`/blogs/[slug]`):
```groq
*[_type == "post" && slug.current == $slug][0] {
  title,
  "imageUrl": mainImage.asset->url,
  publishedAt,
  content,
  seoTitle,
  metaDescription,
  seoKeywords,
  "ogImageUrl": coalesce(ogImage.asset->url, mainImage.asset->url)
}
```

**Homepage latest** (`latest-blogs.tsx`): newest 3 posts (`[0...3]`).

> Note: the listing page surfaces only the **first** category (`categories[0]`) as a pill. The single-post page does **not** currently render author, categories, or keywords visibly — those drive metadata/SEO and listing only.

---

## 4. URL Structure

- **Base URL:** `https://blogspage.com`
- **Blog index:** `/blogs`
- **Single post:** `/blogs/<slug>` where `<slug>` is `post.slug.current`.
- Each published post is automatically added to `sitemap.xml` at `https://blogspage.com/blogs/<slug>` with `changeFrequency: "weekly"`, `priority: 0.6`.

---

## 5. Sanity Studio Schemas

The Studio desk (`structure.ts`) lists: **Posts**, **Categories**, **Authors** (then a divider and everything else). Registered schema types: `ctaBlock`, `blockContent`, `category`, `post`, `author`, `lead`.

### 5.1 Blog Post Schema (`post`)

Field groups: `content` (default tab) and `seo` (SEO & Metadata tab).

| Field | Type | Group | Required? | Notes / Validation |
| --- | --- | --- | --- | --- |
| `title` | `string` | content | recommended | Drives slug + display H1. No explicit validation but always provide. |
| `slug` | `slug` | content | recommended | `options.source: 'title'`. See slug rules (§7). |
| `author` | `reference` → `author` | content | optional | Single author reference. |
| `mainImage` | `image` (hotspot) | content | recommended | Has nested `alt` (string). Featured image. |
| `categories` | `array<reference → category>` | content | optional | One or more category references. |
| `publishedAt` | `datetime` | content | recommended | ISO 8601. Controls ordering & display date. |
| `content` | `blockContent` | content | recommended | The body (Portable Text). See §6. |
| `seoTitle` | `string` | seo | optional | Override for tab/search title. **Validation: max 60 chars (warning).** Falls back to `title`. |
| `metaDescription` | `text` (3 rows) | seo | **REQUIRED** | **Validation: required, min 120, max 160 chars (error).** Used for search + OG + Twitter description. |
| `seoKeywords` | `array<string>` (tags layout) | seo | optional | Keyword/tag list. Emitted as `<meta keywords>`. |
| `ogImage` | `image` (hotspot) | seo | optional | Social preview override. Falls back to `mainImage`. |

**Preview:** title + "by {author.name}", media = mainImage.

### 5.2 Category Schema (`category`)

| Field | Type | Notes |
| --- | --- | --- |
| `title` | `string` | Display name. |
| `slug` | `slug` | `source: 'title'`. |
| `description` | `text` | Short description. |

### 5.3 Author Schema (`author`)

| Field | Type | Notes |
| --- | --- | --- |
| `name` | `string` | Display name. |
| `slug` | `slug` | `source: 'name'`. |
| `image` | `image` (hotspot) | Avatar. |
| `bio` | `array<block>` | Minimal Portable Text: only `normal` style, no lists, no marks. |

### 5.4 Tag Schema

**Does not exist.** Use `seoKeywords` (plain strings on the post) for tag-like keywords. If "tags" are requested, populate `seoKeywords`.

### 5.5 SEO / Metadata Schema

SEO is not a separate document — it is the `seo` field group on `post`: `seoTitle`, `metaDescription`, `seoKeywords`, `ogImage`. How they map to HTML metadata (from `[slug]/page.tsx`):

- `<title>` = `${seoTitle || title} | Blogspage`
- `<meta name="description">` = `metaDescription` (or fallback `Read <title> on the Blogspage journal.`)
- `<meta name="keywords">` = `seoKeywords` (omitted if empty)
- **OpenGraph:** `type: "article"`, `publishedTime: publishedAt`, image = `ogImage` or `mainImage` (rendered at 1200×630)
- **Twitter:** `summary_large_image` card, same title/description/image
- HTML entities in title/description are decoded before output (`&amp;` → `&`, etc.). Prefer writing literal characters, not entities.

### 5.6 CTA Block Schema (`ctaBlock`) — in-content object

Embedded inside `content`. See §10 for usage. Fields:

| Field | Type | Required | Default |
| --- | --- | --- | --- |
| `headline` | `string` | **required** | — |
| `body` | `text` (3 rows) | **required** | — |
| `primaryLabel` | `string` | **required** (schema) | `"Start a conversation"` |
| `secondaryLabel` | `string` | **required** | — |
| `secondaryHref` | `string` | **required** | relative path (e.g. `/contact`, `/#services`) or full URL |

> Front-end render guard (`[slug]/page.tsx`): a `ctaBlock` only renders if `headline`, `body`, `secondaryLabel`, AND `secondaryHref` are all present. The primary button is wired to open the AI chat widget (it ignores any href); if `primaryLabel` is missing the component defaults its label to `"Talk to our AI"`. Always supply all five fields to be safe.

---

## 6. Portable Text Configuration (`blockContent`)

`content` is an array (`blockContent`) whose members can be: text **blocks**, **image** objects, and **ctaBlock** objects.

### 6.1 Block styles (allowed `style` values)
`normal`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `blockquote`

> Editorial guidance: the page already renders the post `title` as the on-page `<h1>`. Use `h2` for top-level section headings within the body, `h3`/`h4` for sub-sections. Avoid a second `h1` in body content.

### 6.2 Lists (allowed `listItem` values)
`bullet`, `number`

### 6.3 Marks — Decorators (inline `marks` values)
`strong`, `em`, `underline`, `strike-through`, `code`

### 6.4 Marks — Annotations
Only one annotation type: **`link`** — an object with a single field `href` (type `url`).
- Rendered as `<a target="_blank" rel="noopener noreferrer">` styled as a primary-colored link. (External-style behavior even for internal links.)

### 6.5 Embedded image (inside content)
An `image` array member with `options.hotspot: true` and a nested field:
- `alt` (string, "Alternative Text").
Rendered full-width, rounded, with shadow. Provide meaningful `alt` text.

### 6.6 Embedded CTA
A `ctaBlock` array member (see §5.6 / §10).

### 6.7 Rendering specifics (front end)
- Body is wrapped in Tailwind Typography `prose prose-invert` (dark theme).
- The site theme is **dark**. Headings/strong render light; links use the brand `primary` accent.
- Embedded images and CTA blocks are wrapped in `not-prose` (they break out of prose styling).

---

## 7. Slug Generation Rules

- Studio auto-generates slugs from the source field (`title` for posts, `name`/`title` for authors/categories) using Sanity's default slugifier.
- For programmatic creation, match the project's canonical slugify (used in `seed-meta.ts` / `niches.ts`):
  1. Lowercase the string.
  2. Strip `&` (and other special characters) entirely.
  3. Replace any run of non-alphanumeric characters with a single hyphen `-`.
  4. Trim leading/trailing hyphens.
- Example: `"JavaScript Data Types in Web Technology"` → `javascript-data-types-in-web-technology`.
- Slug JSON shape: `{ "_type": "slug", "current": "the-slug" }`.
- Slugs must be unique per document type. Keep them stable after publish (they are public URLs in the sitemap).

---

## 8. Image Requirements

### Featured image (`mainImage`)
- Recommended for every post (used on listing cards, the post hero, and OG fallback).
- Rendered as `aspect-video` (16:9) on listing and as a 16:9 hero on the post page.
- Provide `alt` text on the nested field.
- **OG image dimensions:** social previews are emitted at **1200×630**. Provide an image at least that size (or set a dedicated `ogImage`).

### How images are stored
Sanity images are **asset references**, not URLs:
```json
{
  "_type": "image",
  "alt": "Descriptive alt text",
  "asset": { "_type": "reference", "_ref": "image-<assetId>-<dims>-<format>" }
}
```
To get an asset `_ref`, the binary must first be uploaded via `client.assets.upload('image', buffer, { filename })` (see `migrate.ts`). An AI generating JSON cannot fabricate `_ref` values — either (a) omit images and let an editor add them, or (b) upload the asset first and use the returned `asset._id` as `_ref`.

---

## 9. Required vs Optional vs Metadata Fields (quick reference)

**Hard-required by schema validation:**
- `post.metaDescription` — required, **120–160 characters** (enforced as an error).
- For any `ctaBlock` you embed: `headline`, `body`, `primaryLabel`, `secondaryLabel`, `secondaryHref`.

**Strongly recommended (no validation, but needed for a good post):**
- `title`, `slug`, `content`, `publishedAt`, `mainImage` (+ `alt`), `author`, at least one `categories` entry.

**Optional:**
- `seoTitle` (≤ 60 chars), `seoKeywords`, `ogImage`.

**Metadata fields (the SEO group):** `seoTitle`, `metaDescription`, `seoKeywords`, `ogImage` — these feed `<title>`, description, keywords, OpenGraph, and Twitter tags.

---

## 10. Existing CTA Components & Reusable Sections

- **`ctaBlock` (in-content):** the primary reusable conversion block for blog bodies. Rendered by `BlogFooterCTA.tsx` as a centered card with a headline, body, a **primary button that opens the AI chat widget** (fires `window` event `open-ai-chat`), and a secondary link button to `secondaryHref`.
  - Good `secondaryHref` targets: `/contact`, `/#services`, `/#process`, `/blogs`, or a relevant `/solutions/...` page.
  - Recommended placement: one CTA near the end of the article; optionally one mid-article for long posts.
- **`BlogFooterCTA`** is the only blog-specific reusable section component. There is no other in-body custom component exposed to Portable Text besides `image` and `ctaBlock`.

Example default CTA copy (matches house tone):
- headline: `"Ready to build the system behind your growth?"`
- body: `"Tell us about your product and we'll map a 10–15 day launch plan."`
- primaryLabel: `"Talk to our AI"` (or `"Start a conversation"`)
- secondaryLabel: `"See how we work"`, secondaryHref: `"/#process"`

---

## 11. Existing Categories, Authors, Tags

### Categories (seeded — reference these by `_id`/title; do not duplicate)
| Title | Slug / `_id` | Description |
| --- | --- | --- |
| Web Development | `category-web-development` | Expert tutorials, modern frontend architecture, full-stack engineering. |
| AI & Automation | `category-ai-automation` | Leveraging AI to automate workflows and scale operations. |
| Programming | `category-programming` | Coding guides, language fundamentals, software engineering concepts. |
| Tech Insights | `category-tech-insights` | Industry trends, SaaS architecture, modern tech landscape deep-dives. |

> When assigning categories, reference an existing one: `{ "_type": "reference", "_ref": "category-web-development" }`. Create a new category document only if none fit.

### Authors (seeded)
| Name | `_id` | Slug | Bio |
| --- | --- | --- | --- |
| Ravi | `author-ravi` | `ravi` | "Top Rated Front-End Developer and AI Automation Expert specializing in Next.js, headless architecture, and scalable web solutions." |

> Default author reference: `{ "_type": "reference", "_ref": "author-ravi" }`.

### Tags
No tag documents. Use `seoKeywords` (plain strings), e.g. `["Next.js", "Portable Text", "headless CMS", "SEO"]`.

---

## 12. House Writing Style

### Tone of voice
- **Knowledgeable, not instructive.** Expert-level but never condescending. Show, don't tell.
- **Supportive and grounded.** Warm, solutions-oriented, companionable — like a senior engineer pairing with you.
- **Concise and confident.** Quick cadence, plain language grounded in facts. Avoid hyperbole ("best-ever"), superlatives ("unbelievable"), exclamation points, and em-dash-heavy run-ons.
- **Engineering-credible.** Reference real architecture (Next.js App Router, RSC, Supabase RLS, Core Web Vitals, Capacitor, Portable Text, SSE). Back claims with mechanics, not marketing.
- **Outcome-oriented.** Tie technical decisions to business outcomes (margin, churn, conversion, retention, Core Web Vitals).

### Target audience
- Founders, operators, and technical decision-makers at SMBs/local businesses in the 10 verticals (delivery, hotels, gyms, clinics, e-commerce, SaaS, etc.).
- Developers and engineering-minded readers who want depth (the "Insights & Engineering" journal).
- Readers researching how to escape platform commissions, defend recurring revenue, or ship high-conversion, high-performance web products.

### Content angles that fit the brand
- Technical deep-dives (Next.js, headless CMS, performance/Core Web Vitals, AI automation).
- Vertical playbooks (e.g., "How gyms defend membership revenue with a pause-credit engine").
- Local SEO + architecture; "systems behind high-conversion platforms."

### Structural conventions for posts
- Open with a tight, concrete hook (problem + stakes) — no fluff intro.
- Use `h2` section headings; `h3` for subsections. Short paragraphs.
- Use bullet/numbered lists for steps and enumerations; `code` decorator or code-style spans for identifiers.
- Use `blockquote` for emphasis/pull quotes sparingly.
- Close with a `ctaBlock` inviting the reader to start a project / talk to the AI.
- Always craft a 120–160 char `metaDescription` that summarizes the value, with a primary keyword early.

---

## 13. Markdown / HTML Support

- **Markdown:** Not stored or rendered as Markdown. The body is **Portable Text (structured JSON)**, not Markdown. If you author in Markdown, it must be converted to Portable Text blocks before saving.
- **HTML:** Not rendered as raw HTML. The `migrate.ts` importer converts WordPress HTML to Portable Text via `@sanity/block-tools` `htmlToBlocks`, but the stored/rendered format is always Portable Text. Do not put raw HTML strings into `content`.
- **Allowed rich features** are exactly those defined in §6 (styles, lists, decorators, `link` annotation, `image`, `ctaBlock`). Anything outside that set will be ignored or rejected.

---

## 14. JSON Structure Expected by Sanity

### 14.1 A complete `post` document (example to create)

```json
{
  "_type": "post",
  "title": "Why Direct Booking Beats OTAs for Independent Hotels",
  "slug": { "_type": "slug", "current": "why-direct-booking-beats-otas" },
  "author": { "_type": "reference", "_ref": "author-ravi" },
  "publishedAt": "2026-06-28T09:00:00.000Z",
  "categories": [
    { "_type": "reference", "_ref": "category-tech-insights", "_key": "cat1" }
  ],
  "mainImage": {
    "_type": "image",
    "alt": "Hotel front desk dashboard showing a live room matrix",
    "asset": { "_type": "reference", "_ref": "image-<assetId>-1600x900-jpg" }
  },
  "seoTitle": "Direct Booking vs OTAs for Independent Hotels",
  "metaDescription": "OTAs quietly drain hotel margin. Here is how a direct booking engine with a live room matrix reclaims revenue and prevents double-bookings.",
  "seoKeywords": ["direct booking", "hotel OTA fees", "room matrix", "Next.js"],
  "content": [ /* array of Portable Text blocks — see 14.2 */ ]
}
```

> Notes: every member of an array field (`categories`, `content`) should carry a unique `_key` string. Sanity requires `_key` on array items; omitting it causes Studio errors. For programmatic creation use `client.create(doc)` with the server-only write client (`SANITY_WRITE_TOKEN`).

### 14.2 Portable Text body blocks

**Standard text block (paragraph):**
```json
{
  "_type": "block",
  "_key": "b1",
  "style": "normal",
  "markDefs": [],
  "children": [
    { "_type": "span", "_key": "b1s1", "text": "Plain text here.", "marks": [] }
  ]
}
```

**Heading:**
```json
{
  "_type": "block",
  "_key": "h2a",
  "style": "h2",
  "markDefs": [],
  "children": [
    { "_type": "span", "_key": "h2as1", "text": "The Commission Problem", "marks": [] }
  ]
}
```

**Inline decorators (bold + code):**
```json
{
  "_type": "block",
  "_key": "b2",
  "style": "normal",
  "markDefs": [],
  "children": [
    { "_type": "span", "_key": "b2s1", "text": "Use ", "marks": [] },
    { "_type": "span", "_key": "b2s2", "text": "atomic allocation", "marks": ["strong"] },
    { "_type": "span", "_key": "b2s3", "text": " via ", "marks": [] },
    { "_type": "span", "_key": "b2s4", "text": "SELECT ... FOR UPDATE", "marks": ["code"] },
    { "_type": "span", "_key": "b2s5", "text": " to prevent races.", "marks": [] }
  ]
}
```

**Link annotation:** the link is declared in `markDefs` with a `_key`, then referenced from a span's `marks`:
```json
{
  "_type": "block",
  "_key": "b3",
  "style": "normal",
  "markDefs": [
    { "_key": "link1", "_type": "link", "href": "https://nextjs.org" }
  ],
  "children": [
    { "_type": "span", "_key": "b3s1", "text": "Read the ", "marks": [] },
    { "_type": "span", "_key": "b3s2", "text": "Next.js docs", "marks": ["link1"] },
    { "_type": "span", "_key": "b3s3", "text": ".", "marks": [] }
  ]
}
```

**Bullet list item** (each list item is its own block with `listItem`):
```json
{
  "_type": "block",
  "_key": "li1",
  "style": "normal",
  "listItem": "bullet",
  "level": 1,
  "markDefs": [],
  "children": [
    { "_type": "span", "_key": "li1s1", "text": "Own your customer relationship.", "marks": [] }
  ]
}
```
(Use `"listItem": "number"` for ordered lists.)

**Blockquote:**
```json
{
  "_type": "block",
  "_key": "q1",
  "style": "blockquote",
  "markDefs": [],
  "children": [
    { "_type": "span", "_key": "q1s1", "text": "Performance is a feature.", "marks": [] }
  ]
}
```

**Embedded image:**
```json
{
  "_type": "image",
  "_key": "img1",
  "alt": "Architecture diagram of the dispatch system",
  "asset": { "_type": "reference", "_ref": "image-<assetId>-1200x800-png" }
}
```

**Embedded CTA block:**
```json
{
  "_type": "ctaBlock",
  "_key": "cta1",
  "headline": "Ready to own your booking channel?",
  "body": "Tell us about your property and we'll map a 10–15 day launch plan for a direct-booking system.",
  "primaryLabel": "Talk to our AI",
  "secondaryLabel": "See how we work",
  "secondaryHref": "/#process"
}
```

---

## 15. Custom Validation Rules (must satisfy to save / render)

From the schema and the project's Portable Text repair scripts (`sanitize-data.ts`, `diagnose-and-fix.ts`):

1. **`metaDescription` is required and must be 120–160 characters.** Outside that range the document errors and cannot publish.
2. **`seoTitle` ≤ 60 characters** (soft warning, not blocking).
3. **`ctaBlock` requires** `headline`, `body`, `primaryLabel`, `secondaryLabel`, `secondaryHref` (schema-required); the renderer additionally needs `headline`, `body`, `secondaryLabel`, `secondaryHref` to display.
4. **Every array item needs a unique `_key`** (`content`, `categories`, spans, markDefs).
5. **Block `children` may only contain `span` objects** — never nested blocks, arrays, `div`s, or other block-level objects. (Invalid children are what the repair scripts split out.)
6. **`children` must never contain a nested array.**
7. **Span `marks` may only reference:** an allowed decorator (`strong`, `em`, `underline`, `strike-through`, `code`) **or** a `_key` that exists in the same block's `markDefs`. Orphan mark references (a mark with no matching `markDef` and not a decorator) are invalid.
8. **`markDefs` may only contain valid `link` objects:** shape `{ "_key": string, "_type": "link", "href": string }` with a non-empty `href`. Any other markDef shape is stripped as illegal.
9. **No nonstandard fields on a block.** Valid block keys are limited to: `_type`, `_key`, `style`, `listItem`, `level`, `children`, `markDefs`. (A stray `blocks` field or arbitrary keys are flagged and removed.)
10. **A `normal`-style block should not also carry `listItem`/`level`** unless it is genuinely a list item; conflicting list semantics on a plain paragraph are normalized away.
11. **`href` on link annotations is type `url`** — provide a valid absolute URL (or a clean relative path for internal links; the renderer opens links in a new tab regardless).
12. **`lead.email`** (unrelated to blogs) must match an email regex — listed for completeness only.

### Pre-publish checklist for a generated post
- [ ] `title`, `slug.current` (slugified per §7), `publishedAt` (ISO) present.
- [ ] `metaDescription` is 120–160 chars.
- [ ] `author` references `author-ravi` (or a valid author).
- [ ] At least one valid `categories` reference.
- [ ] `mainImage` set with `alt` (or intentionally omitted for an editor to add).
- [ ] Every `content` block and span has a unique `_key`.
- [ ] All spans only; marks reference valid decorators or declared markDefs.
- [ ] Headings start at `h2` in the body (title is the page `h1`).
- [ ] One closing `ctaBlock` with all five fields.
- [ ] Tone matches §12 (concise, expert, outcome-oriented, no hype).
```
