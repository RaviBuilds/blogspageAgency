---
name: blogspage-seo
description: Apply Blogspage's established SEO, search-engine, AI-discoverability, canonicalisation, structured-data, crawl, metadata, accessibility, performance, and content architecture standards. Use whenever adding, modifying, auditing, reviewing, or debugging SEO-related functionality on the Blogspage website.
---

# BLOGSPAGE SEO ENGINEERING SKILL

You are working on the Blogspage agency website.

This repository already has a deliberate SEO architecture.

Do NOT treat SEO as a greenfield problem.

Your job is to:

- preserve the existing SEO architecture
- extend it consistently
- avoid duplicate or conflicting SEO systems
- protect crawl/indexation correctness
- preserve programmatic SEO boundaries
- keep metadata and structured data internally consistent
- maintain AI/LLM discoverability
- preserve accessibility and no-JavaScript content visibility
- validate SEO changes against the existing implementation
- prefer one source of truth over duplicated literals
- never weaken existing SEO invariants merely to simplify implementation

---

# 1. BLOGSPAGE SEO STANDARD

Blogspage evaluates SEO across these ten areas:

1. Crawlability and Indexation
2. Canonicalisation and Duplicate Control
3. Metadata and Social Previews
4. Structured Data and Entity Graph
5. Content and Keyword Architecture
6. Site Architecture and Internal Linking
7. Core Web Vitals and Rendering
8. Semantic HTML and Accessibility
9. Authority and E-E-A-T Signals
10. AI and LLM Discoverability

Treat all ten as part of one system.

Do not optimise one category by damaging another.

---

# 2. AUTHORITATIVE SEO MODULES

Before creating new SEO logic, inspect these modules first.

## Identity

`src/lib/site.ts`

Owns:

- SITE_URL
- SITE_NAME
- LOCALE
- FOUNDING_YEAR
- NAP
- OPENING_HOURS
- SOCIAL_PROFILES

Do not duplicate these values in route files.

The identity source of truth exists specifically so NAP, social profiles, locale, founding year, and business information remain consistent across the website.

Current architecture uses:

- `SITE_URL = https://blogspage.com`
- `SITE_NAME = Blogspage`
- Open Graph locale = `en_IN`
- HTML locale = `en-IN`

The NAP and opening-hours values must always reflect the real business data in the repository.

If the business facts change, update the shared source of truth rather than copying new literals into individual pages.

---

# 3. CANONICAL URL STANDARD

Canonical URLs are generated through:

`src/lib/seo.ts`

Primary function:

`canonicalUrl(path)`

Canonical requirements:

- HTTPS
- host `blogspage.com`
- lowercase path
- no query string
- no fragment
- no trailing slash
- root canonical is `https://blogspage.com`
- canonical must represent the route itself

Do not manually construct canonical URLs when the central canonical helper can be used.

A canonical URL must never:

- include tracking parameters
- include query parameters
- include fragments
- point to another unrelated page
- point to a redirected URL
- point to a 404
- vary between equivalent renders

Canonicalisation must be deterministic and idempotent.

---

# 4. ROUTE-LEVEL CANONICAL RULE

Every intended indexable route must emit exactly one canonical URL.

Current important route families include:

- `/`
- `/about`
- `/blogs`
- `/blogs/<slug>`
- `/blogs/category/<slug>`
- `/blogs/author/<slug>`
- `/solutions`
- `/solutions/<slug>`
- `/services/<slug>`
- `/contact`
- `/privacy`
- `/terms`

Non-indexable routes must not accidentally receive indexable canonical treatment.

If route resolution fails, do not invent a canonical URL.

For invalid solution routes specifically:

- return 404/notFound
- do not emit a canonical for the invalid request
- do not allow invalid city tokens to produce live indexable pages

---

# 5. PROGRAMMATIC SEO SAFETY

Programmatic SEO is a core part of Blogspage.

Do not treat dynamic routes as ordinary static pages.

Before changing `/solutions/<slug>` behaviour, inspect:

- `src/lib/niches.ts`
- `src/lib/cities.ts`
- `src/lib/routes.ts`
- `src/lib/keyword-map.ts`
- `src/lib/service-routes.ts`
- `src/app/(site)/solutions/[slug]/page.tsx`
- `src/app/sitemap.ts`

The Solutions Router is bounded by an explicit approved-city list.

Current approved city:

- `hyderabad`

The architecture deliberately does NOT permit arbitrary city tokens.

Do not reintroduce unbounded URL generation.

For example, a request such as:

`/solutions/gym-business-solution-website-at-anything`

must not silently become an indexable page.

Only approved city tokens may produce valid solution routes.

Adding another city is both:

1. a technical change
2. a content/editorial SEO decision

Do not multiply pages merely because the routing system can technically support them.

Every new city needs substantive, useful, localized content.

---

# 6. ROUTE REGISTRY

`src/lib/routes.ts`

is the route inventory source used by the SEO architecture.

When adding an indexable route:

- determine whether the route belongs in the route registry
- ensure sitemap inclusion is considered
- ensure navigation/internal linking is considered
- ensure AI discovery surfaces are considered
- ensure metadata exists
- ensure structured data is appropriate

Never add an indexable route and forget the route registry.

The route registry is intended to prevent separate systems from maintaining conflicting route inventories.

---

# 7. METADATA ARCHITECTURE

`src/lib/seo.ts`

is the central metadata factory.

Primary helper:

`buildMetadata(input)`

Use it instead of hand-building independent metadata objects for routes that follow the standard SEO contract.

The metadata architecture supports:

- title
- description
- canonical
- Open Graph
- Twitter
- route URL
- social preview image
- locale
- article-specific additions
- robots/index directives
- keyword injection through the keyword map

Do not introduce parallel metadata factories.

---

# 8. TITLE STANDARD

Indexable route titles must:

- be unique
- normally fit 30–70 characters after the root title template is applied
- contain the route's assigned primary keyword phrase where required
- accurately describe the page
- avoid keyword stuffing
- remain readable to humans

Do not write titles for search engines at the expense of click-through quality.

Do not create duplicate titles across routes.

Do not append unnecessary keyword lists.

---

# 9. META DESCRIPTION STANDARD

Indexable route descriptions must:

- be unique
- normally fit 120–160 characters
- describe the actual page
- reflect the page's search intent
- remain readable
- support click-through

Use:

`clampDescription()`

for body-derived descriptions where appropriate.

Description clamping should:

- respect a word boundary
- remain inside the intended range when sufficient source text exists
- be deterministic

Do not manually duplicate truncation logic.

Do not fill descriptions with keyword repetitions.

---

# 10. KEYWORD MAP

`src/lib/keyword-map.ts`

is the machine-readable primary keyword assignment.

Every indexable route should have one deliberate primary phrase.

A primary phrase should generally:

- contain 2–8 words
- be no more than 60 characters
- be unique case-insensitively
- correspond to the route's actual intent

Do not assign the same primary keyword to multiple competing indexable routes.

Do not create keyword assignments solely to increase keyword count.

Do not make the homepage attempt to rank for every commercial service.

Use dedicated routes when a service deserves its own search-intent target.

---

# 11. SERVICE / SOLUTION KEYWORD ARCHITECTURE

Blogspage intentionally separates:

## Solution pages

Vertical/business-specific pages such as:

- gym
- dental
- hotel
- online delivery
- education
- SaaS
- ecommerce
- consulting
- pet care
- SEO blogs

These may target localized commercial intent.

## Dedicated service routes

Current service architecture includes:

- AI automation
- AI sales agents
- custom SaaS development
- programmatic SEO

Each service route has its own:

- slug
- H1
- keyword phrase
- meta description
- summary
- sections
- FAQ content

Do not collapse multiple service routes back into one homepage anchor.

---

# 12. LOCAL SEO

Blogspage is positioned as a Hyderabad-based business.

Localized pages must use the authoritative city display name rather than deriving display text from arbitrary slug casing.

Use:

`APPROVED_CITIES`

and:

`findApprovedCity()`

for city validation.

Use the authoritative display name in:

- H1 where required
- meta description where required
- body copy where required
- structured data where appropriate

Do not generate fake city variation automatically.

Do not create thin doorway pages.

---

# 13. NAP CONSISTENCY

Name, Address, Phone information is a core local SEO signal.

The shared source is:

`src/lib/site.ts`

Use `NAP` rather than hardcoded address copies.

The NAP should remain character-identical across:

- `/contact`
- `/privacy`
- `/terms`
- LocalBusiness structured data

Ignore only differences that are purely line breaks or surrounding whitespace where the relevant validation permits it.

Do not create a second address literal.

If the business address or phone changes:

1. update `NAP`
2. verify rendered routes
3. verify LocalBusiness JSON-LD
4. verify any dependent local SEO content

---

# 14. OPENING HOURS

Opening hours are also part of the shared business identity.

Use:

`OPENING_HOURS`

Do not write conflicting hours in individual pages.

If the true business hours change:

- update the shared value
- update rendered business information through the shared source
- ensure structured data and visible copy agree

Do not claim seven-day availability merely because the schema technically allows it.

Business facts must be truthful.

---

# 15. STRUCTURED DATA ARCHITECTURE

Structured data lives primarily in:

`src/lib/structured-data.ts`

and is rendered through:

`src/components/seo/json-ld.tsx`

Supported entity builders include:

- Organization
- WebSite
- LocalBusiness
- Service
- Person
- BreadcrumbList
- FAQPage

Blogspage uses a connected entity graph rather than independent anonymous snippets.

Do not create anonymous duplicate Organization entities.

---

# 16. ORGANIZATION ENTITY

The website should have one stable Blogspage Organization entity.

Its `@id` is route-independent.

Conceptually:

`https://blogspage.com/#organization`

The organization identity must remain stable across routes and rebuilds.

Organization data should be based on shared identity data.

Where required, it includes:

- name
- URL
- logo
- description
- sameAs

Do not create a second Organization for every page.

---

# 17. SAMEAS

The Organization's `sameAs` values must correspond exactly to the social profile URLs used by the visible footer.

Current architectural source:

`SOCIAL_PROFILES`

Current profile surfaces include:

- X
- GitHub
- LinkedIn

Do not maintain another independent social-links array for structured data.

If a social URL changes, update the shared source.

Then verify:

- footer links
- Organization.sameAs

remain synchronized.

---

# 18. WEBSITE ENTITY

The homepage may emit a WebSite entity.

The WebSite node should:

- use the canonical site root
- reference the same Organization through its `@id`
- maintain stable identity

Do not create an anonymous publisher relationship.

---

# 19. LOCAL BUSINESS ENTITY

`/contact` emits LocalBusiness structured data.

It must remain consistent with the visible NAP.

LocalBusiness may include:

- name
- address
- telephone
- email
- openingHours
- areaServed
- parentOrganization

Do not invent extra attributes merely to make the schema longer.

Only publish facts the site can support.

---

# 20. SERVICE ENTITY

Solution and service pages use Service structured data.

A Service should:

- correspond to an actual Blogspage offering
- have a meaningful name
- have a meaningful description
- use a serviceType
- reference the Organization through `@id`
- use a valid absolute URL
- use stable identity where the architecture requires it

Do not revert to anonymous inline Organization objects.

Do not duplicate provider identities.

---

# 21. PERSON / AUTHOR ENTITY

Blog authors have their own routes:

`/blogs/author/<slug>`

When a post references an author:

- the byline should link to the author page
- Person.url should be the same absolute author URL
- the author route must exist
- invalid author routes must not become indexable
- missing optional author fields should be omitted rather than replaced by fake placeholders

Do not emit Person structured data pointing to 404 routes.

---

# 22. BLOGPOSTING

Blog post structured data can include:

- BlogPosting
- author reference
- publisher reference
- breadcrumb data
- FAQPage where applicable

The publisher should connect to the Blogspage Organization.

The author should connect to the real author entity when author data exists.

Do not invent author data.

---

# 23. FAQ STRUCTURED DATA

FAQ schema must mirror visible FAQ content.

Rules:

- only create FAQPage when the required FAQ content actually exists
- questions must exist in visible page content
- answers must exist in visible page content
- structured data text must match rendered text
- do not create invisible FAQs solely for SEO
- do not create FAQ schema for content that visitors cannot see

Current solution architecture requires at least three visible Q&A pairs before FAQPage is emitted.

When fewer than the required number exist:

- omit FAQPage
- keep other structured data valid

---

# 24. BREADCRUMBS

Every route below the root should have:

- visible breadcrumb trail
- matching BreadcrumbList structured data

Both should derive from the same trail data.

Rules:

- first item is Home
- ancestor items are crawlable links
- final item is plain text
- positions begin at 1
- positions remain contiguous
- every ancestor URL must resolve correctly

Do not create a visible breadcrumb and separately invent different JSON-LD breadcrumb data.

---

# 25. JSON-LD OUTPUT STYLE

Blogspage intentionally renders individual JSON-LD blocks per node.

Do not casually introduce a `@graph` wrapper.

The current renderer expects each block to have:

- `@context`
- `@type`

and connects entities through `@id`.

Preserve this architecture unless a deliberate architectural decision changes the validation contract.

---

# 26. OMIT EMPTY STRUCTURED-DATA VALUES

`omitEmpty()` exists to remove:

- undefined
- null
- empty strings
- empty arrays

Do not emit empty placeholder schema properties.

Do not use fake values merely to satisfy a field.

Missing data should normally be omitted.

---

# 27. HEADING IDS

Post, solution, and service headings may have deterministic IDs.

The implementation uses:

`slugifyHeading()`

and:

`createHeadingSlugger()`

Rules:

- lowercase
- stable
- deterministic
- valid characters only
- unique within the route
- repeated headings get deterministic suffixes

Example:

`pricing`

then:

`pricing-2`

then:

`pricing-3`

Do not generate random IDs.

Do not use timestamps for heading IDs.

Do not change the slugging rules casually because deep links and AI citations can depend on stable IDs.

---

# 28. SITEMAP

Primary file:

`src/app/sitemap.ts`

The sitemap must be generated from the route inventory rather than maintaining a second hand-written route list.

Indexable routes should be included exactly once.

Do not include:

- noindex routes
- 404 routes
- invalid solution cities
- `/studio`
- draft posts
- future posts
- other intentionally unindexable content

Locations must:

- use HTTPS
- use `blogspage.com`
- not contain query parameters
- not contain trailing slashes

---

# 29. SITEMAP LASTMOD

Do not use request time for static route `lastModified`.

Current architecture uses:

`scripts/gen-route-lastmod.mjs`

to derive source-backed dates from Git commit history.

Content-backed routes use appropriate content timestamps such as:

- lastReviewed
- \_updatedAt
- publishedAt

Preserve deterministic lastModified values.

Do not reintroduce:

```ts
const now = new Date();
```
