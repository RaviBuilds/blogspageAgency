# Implementation Plan: SEO Audit and Optimization

## Overview

Implementation follows the design's Phase 0 through Phase 8 sequencing, in TypeScript against the existing Next.js 15 App Router application.

Three ordering rules are structural, not stylistic:

1. **Phase 0 is a hard gate.** The audit report is written and committed against `cf08607b59cdab4effde2131e756faa2f78e0232` before any remediation task starts. Requirement 1 criterion 5 requires every Finding to cite a path that exists in the audited commit, so remediation landing first makes the report unverifiable.
2. **Foundations precede consumers.** `src/lib/site.ts`, `seo.ts`, `structured-data.ts`, `cities.ts`, `heading-slug.ts`, `routes.ts`, and `rubric.ts` are what make the character-for-character identity criteria (5.2, 5.4, 8.5) true by construction. Nothing that consumes them starts before they exist.
3. **The post-remediation re-score is last.** It is appended only after the check suite passes, leaving the pre-remediation numbers byte-identical.

Pure-function and builder-level property tests sit next to the code they exercise and run without a build. Route-level property tests quantify over the sitemap-derived route set and therefore live in the Phase 8 check suite, which is the first point a served production build exists.

## Tasks

- [x] 1. Phase 0 - Audit report and scoring rubric
  - [x] 1.1 Create the rubric module at `src/lib/rubric.ts`
    - Define `RUBRIC` with the ten named categories, integer weights summing to exactly 100 (Crawlability 12, Canonicalisation 12, Metadata 10, Structured Data 13, Content and Keyword 12, Architecture 10, Core Web Vitals 10, Semantic HTML 7, Authority 8, AI Discoverability 6), and three anchor descriptors per category at scores 0, 5, and 10, each naming the artefact to inspect and the threshold that counts as met
    - Implement `computeOverallScore` (half-up rounding to one decimal), `computeContributions` (two decimals per category), and `rankByPointsLost` (descending `weight * (10 - score) / 100`, ties broken by descending weight then category name)
    - Export the `RubricCategory`, `CategoryScore`, `AnchorDescriptor`, and `Finding` types from the design's Data Models section
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 2.8, 2.9_

  - [x] 1.2 Set up the Vitest test harness
    - Add `vitest`, `fast-check`, and `@vitejs/plugin-react` as pinned dev dependencies; `jsdom` and `@types/jsdom` are already present
    - Create `vitest.config.ts` with the `jsdom` environment, `tsconfig` path alias resolution, and `tests/**` as the include root
    - Add the `test` and `test:properties` npm scripts from the design (`vitest run` and `vitest run tests/properties`), both non-watch
    - _Requirements: 13.8_

  - [x]* 1.3 Write property test for rubric scoring
    - **Property 1: Rubric scoring is a correct weighted mean**
    - Generator draws ten scores from the 0.5-step domain 0 to 10 and includes `.05` contribution boundaries where half-up rounding and float accumulation break
    - **Validates: Requirements 2.4, 2.6, 2.9**

  - [x]* 1.4 Write unit tests for rubric shape and unmeasured categories
    - Assert ten distinct category names, each weight an integer in 5 to 20, weights summing to exactly 100, and three anchors per category at scores 0, 5, and 10 with non-empty artefact and threshold text
    - Assert an `unmeasured` CategoryScore contributes 0 and leaves the other contributions unchanged
    - _Requirements: 2.1, 2.2, 2.3, 2.8_

  - [x] 1.5 Write the pre-remediation audit report to `.kiro/specs/seo-audit-and-optimization/seo-audit-report.md`
    - Record the audit date, the full-length commit hash `cf08607b59cdab4effde2131e756faa2f78e0232`, and that the working tree carried untracked `.kiro/` changes
    - Publish the rubric with all ten categories, weights, and anchor descriptors; generate the score table (name, weight, score, contribution to two decimals, sum, Overall_Score to one decimal) from `src/lib/rubric.ts` output rather than by hand
    - Record every Finding from the design's severity table with a stable id, exactly one severity, exactly one rubric category, at least one repository file path, and at least one observable crawl, index, rank, or render consequence; assign severity by the Requirement 1.12 rules
    - List existing strengths under a heading separate from the Findings, each with a cited file path
    - Add the remediation backlog with every Finding appearing exactly once, ordered critical then high then medium then low, each entry naming the Finding id it resolves
    - Add the points-lost ranking of all ten categories in descending order and name the highest three as the largest shortfall contributors
    - Add the keyword map assigning exactly one primary keyword phrase (2 to 8 words, 60 characters or fewer, unique case-insensitively) to each Indexable_Route alongside its absolute URL, plus the per-Service_Catalog-entry table of target Route URL and phrase; record a `high` Finding for any unassigned or duplicated phrase and for any catalog entry with no targeting Route
    - Label any Finding that cannot be verified from the repository as requiring live-site or Search Console verification, stating the observation needed; omit any claim that can be neither traced to a path nor so labelled
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 1.12, 1.13, 2.6, 2.7, 2.9, 12.1, 12.2, 12.6, 12.8, 12.9_

  - [x] 1.6 Verify every Finding citation against the audited commit
    - Run `git cat-file -e cf08607b59cdab4effde2131e756faa2f78e0232:<path>` for every path cited in the report and correct any citation that does not resolve
    - _Requirements: 1.5_

- [x] 2. Checkpoint - audit gate
  - Ensure all tests pass and the audit report is complete and committed before any remediation task begins. Ask the user if questions arise.

- [x] 3. Phase 1a - Identity, metadata, and pure-function foundations
  - [x] 3.1 Create `src/lib/site.ts` as the identity source of truth
    - Export `SITE_URL`, `SITE_NAME`, `LOCALE` (`openGraph: "en_IN"`, `html: "en-IN"`), `FOUNDING_YEAR`, `NAP`, `OPENING_HOURS` (`Mo-Su 10:00-19:00`), and `SOCIAL_PROFILES` (X, GitHub, LinkedIn hrefs character-identical to those currently in `src/components/layout/footer.tsx`)
    - _Requirements: 4.6, 5.1, 5.2, 5.3, 5.4, 8.4, 8.5_

  - [x] 3.2 Create `src/lib/cities.ts`
    - Export the `ApprovedCity` type, `APPROVED_CITIES` seeded with the single token `hyderabad` and display name `Hyderabad`, and `findApprovedCity(token)` which lowercases and trims its input before matching
    - _Requirements: 3.3, 12.7_

  - [x]* 3.3 Write unit tests for `findApprovedCity`
    - Cover mixed-case input, padded input, an unapproved token, and the empty string
    - _Requirements: 3.3, 3.5_

  - [x] 3.4 Create `src/lib/seo.ts` metadata factory
    - Implement `canonicalUrl(path)` normalising to `https`, `blogspage.com`, lowercase path, no query, no fragment, no trailing slash, returning the bare scheme and host for `/`
    - Implement `ogImageUrl({ title, eyebrow })` returning an absolute `/og` URL, and `clampDescription(text)` truncating at a word boundary inside the 120 to 160 character window
    - Implement `buildMetadata(input)` emitting `alternates.canonical`, the full `openGraph` block with `locale: "en_IN"`, `url`, and an image carrying non-empty `alt`, and the `twitter` block with `card: "summary_large_image"`, plus a dev-only `console.error` when title or description falls outside its length bounds
    - Read the assigned keyword phrase for the route path so titles contain it verbatim
    - _Requirements: 3.1, 3.2, 4.3, 4.4, 4.5, 4.6, 4.8, 4.11, 12.5_

  - [ ]* 3.5 Write property test for canonical normalisation
    - **Property 3: Canonical normalisation is total and idempotent**
    - **Validates: Requirements 3.2**

  - [ ]* 3.6 Write property test for description clamping
    - **Property 17: Description clamping lands inside the window**
    - **Validates: Requirements 4.11**

  - [x] 3.7 Create `src/lib/keyword-map.ts`
    - Export `KEYWORD_MAP` as `KeywordAssignment[]` mirroring the keyword map published in the audit report, with `absoluteUrl` derived from `canonicalUrl(path)` and `serviceCatalogId` set on routes that target a catalog entry
    - _Requirements: 12.1, 12.2, 12.5, 12.6_

  - [x] 3.8 Create `src/lib/heading-slug.ts`
    - Implement `slugifyHeading` (lowercase, `normalize("NFKD")` accent strip, drop anything outside `[a-z0-9\s-]`, collapse whitespace runs to single hyphens, collapse hyphen runs, trim edge hyphens, return `"section"` when empty)
    - Implement `createHeadingSlugger` closing over a `Map<string, number>` that leaves the first occurrence unsuffixed and appends `-2`, `-3`, and onward to later occurrences
    - _Requirements: 9.5_

  - [x]* 3.9 Write property test for heading slug shape
    - **Property 27: Heading slugs are lowercase, non-empty, and deterministic**
    - Generate arbitrary Unicode heading text including punctuation-only and CJK-only inputs
    - **Validates: Requirements 9.5**

  - [x]* 3.10 Write property test for slugger uniqueness
    - **Property 28: Heading slugs are unique within a route with deterministic collision suffixes** (pure-function half; the rendered-HTML half is task 15.6)
    - **Validates: Requirements 9.5**

- [x] 4. Phase 1b - Structured data, route registry, and slug resolution
  - [x] 4.1 Create `src/lib/structured-data.ts`
    - Implement `mintId(path, fragment)` and the node builders `organizationNode`, `webSiteNode`, `localBusinessNode`, `serviceNode`, `personNode`, `breadcrumbNode`, and `faqNode` per the design's `@id` scheme, all values sourced from `src/lib/site.ts` and absolute via `canonicalUrl`
    - Implement `omitEmpty` recursively stripping `undefined`, `null`, `""`, and empty arrays, and apply it inside every builder
    - Return `null` from `faqNode` when fewer than the required pairs are supplied
    - Export the `JsonLdNode` and `NodeRef` types
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.9, 5.10, 5.11, 5.12, 8.2, 9.9_

  - [ ]* 4.2 Write property test for empty-value omission
    - **Property 10: Structured-data builders never emit empty values**
    - Generate partially-populated content and author records and assert no empty string, empty array, `null`, or `undefined` anywhere in the emitted node tree
    - **Validates: Requirements 5.11, 5.12, 8.2, 8.10**

  - [ ]* 4.3 Write property test for builder-level graph connectivity and node identity
    - **Property 9: Entity graph is connected and node identity is stable** (builder-level half; the live-HTML half is task 15.4)
    - **Property 11: Organization and Service node cardinality and field bounds** (builder-level half)
    - **Validates: Requirements 5.1, 5.3, 5.5, 5.7, 5.10**

  - [x] 4.4 Create `src/components/seo/json-ld.tsx`
    - Server component taking `nodes: JsonLdNode[]` and rendering one `<script type="application/ld+json">` per node, each with its own `@context` and `@type`, no `@graph` wrapper
    - _Requirements: 5.8, 13.2_

  - [x] 4.5 Bound the solutions slug resolver in `src/lib/niches.ts`
    - Add `resolveSolutionSlug(slug)` as a pure total function returning `SolutionMatch | null`, narrowing the city capture group to `[a-z0-9-]+` and checking the captured token through `findApprovedCity`
    - Keep `getNicheBySlug` as a back-compatible alias and change `allNicheParams` to return the Service_Catalog by `APPROVED_CITIES` cross product
    - _Requirements: 3.3, 3.4, 3.5, 3.6_

  - [ ]* 4.6 Write property test for the solutions resolver
    - **Property 29: The solutions resolver accepts exactly the approved city tokens**
    - Mixed generator drawing from the approved list, case variants of it, near-miss strings, and arbitrary `[a-z0-9-]` values, since near-misses are what produced the unbounded duplicate space in the audited code
    - **Validates: Requirements 3.4, 3.5, 3.6**

  - [ ]* 4.7 Write property test for generated route set equality
    - **Property 30: The generated route set equals the resolvable set** (pure-function half over `allNicheParams`; the hub-anchor half is task 15.8)
    - **Validates: Requirements 3.4, 6.1, 7.1**

  - [x] 4.8 Create `src/lib/routes.ts` route registry
    - Static route descriptors for `/`, `/about`, `/blogs`, `/solutions`, `/contact`, `/privacy`, `/terms` and the four service routes, plus generators for solution routes from `allNicheParams`, consumed by the sitemap, `/llms.txt`, the navbar, and the footer
    - _Requirements: 6.1, 6.2, 7.1, 9.2_

  - [x] 4.9 Create `src/lib/service-routes.ts`
    - Define the four `ServiceRoute` records for AI automation, AI sales agents, custom SaaS development, and programmatic SEO, each with `slug`, `h1` containing its keyword phrase verbatim, `keywordPhrase`, a 120 to 160 character `metaDescription`, a 40 to 80 word `summary`, `sections`, and at least three FAQ pairs
    - _Requirements: 12.3, 12.10, 9.6_

  - [x] 4.10 Create `src/lib/sanity-image.ts`
    - Implement `parseSanityImageRef` returning intrinsic width and height from a Sanity asset reference
    - _Requirements: 11.2_

  - [ ]* 4.11 Write unit tests for `parseSanityImageRef`
    - Cover a real Sanity asset ref and a malformed ref
    - _Requirements: 11.2_

  - [x] 4.12 Refactor `src/lib/blog.ts` to delegate to the new foundations
    - Re-export `SITE_URL` and `SITE_NAME` from `src/lib/site.ts`, delegate `buildArticleJsonLd`, `buildBreadcrumbJsonLd`, and `buildFaqJsonLd` to `src/lib/structured-data.ts`, and replace the `...(x && { x })` spreads with plain assignment plus `omitEmpty`
    - Keep the existing exported surface so no call site breaks
    - _Requirements: 5.6, 5.9, 5.12_

- [-] 5. Checkpoint - foundations
  - Ensure all tests pass and every foundation module compiles with no unresolved imports. Ask the user if questions arise.

- [ ] 6. Phase 2 - Canonical and metadata rollout
  - [x] 6.1 Commit `public/og-default.png` at exactly 1200 by 630 pixels
    - This asset both replaces the referenced-but-absent `/og-image.png` and serves as the `ImageResponse` fallback target
    - _Requirements: 4.1, 4.2, 4.9_

  - [x] 6.2 Create the social preview image route at `src/app/og/route.tsx`
    - Use `ImageResponse` from `next/og` at 1200 by 630, `runtime = "edge"`, reading `?title=` and `?eyebrow=`, with fonts loaded from a local subset committed under `src/app/og/fonts/` and never fetched remotely
    - Race generation against an 1800 ms timer inside `try/catch` and respond `302` to `/og-default.png` on either the failure or the timeout branch
    - _Requirements: 4.7, 4.9_

  - [x] 6.3 Convert the root layout metadata in `src/app/layout.tsx`
    - Keep `metadataBase` and the title template, drop the broken `/og-image.png` reference in favour of `buildMetadata` output, and set `<html lang="en-IN">`
    - _Requirements: 4.3, 4.6, 4.8_

  - [x] 6.4 Convert `/blogs`, `/contact`, `/privacy`, and `/terms` to `buildMetadata`
    - Each route emits its own canonical, a title of 30 to 70 characters containing its assigned keyword phrase, and a description of 120 to 160 characters, all unique across routes
    - _Requirements: 3.1, 3.2, 4.3, 4.4, 4.5, 4.10, 12.5_

  - [x] 6.5 Convert post metadata in `src/app/(site)/blogs/[slug]/page.tsx` and extend `resolveDescription`
    - Route `generateMetadata` through `buildMetadata`, preserving the `noindex` robots directive for posts carrying `noindex: true` in Sanity and the author-supplied `ogImageUrl` when present, falling back to the generated `/og` URL otherwise
    - Wire `resolveDescription` in `src/lib/blog.ts` through `clampDescription` so a body-derived description lands inside 120 to 160 characters, extending from body text when the excerpt is short
    - _Requirements: 3.1, 3.8, 4.3, 4.4, 4.5, 4.11_

  - [ ]* 6.6 Write unit tests for the post metadata builder
    - Cover `noindex: true` and `noindex: false`, and a post with no excerpt
    - _Requirements: 3.8, 4.11_

  - [x] 6.7 Convert solution route metadata and enforce the 404 path
    - Route `generateMetadata` in `src/app/(site)/solutions/[slug]/page.tsx` through `buildMetadata`; set `export const dynamicParams = false` and drive `generateStaticParams` from `allNicheParams`
    - On failed resolution return `{ title, robots: { index: false, follow: false } }` with no `alternates.canonical`, and keep the in-page `notFound()` as defence in depth
    - _Requirements: 3.1, 3.2, 3.4, 3.5, 3.6, 4.3, 4.4, 4.5_

- [x] 7. Phase 3 - Entity graph and published identity
  - [x] 7.1 Emit the `Organization` node on every indexable route and the `WebSite` node on `/`
    - Render through `<JsonLd>` from the shared site layout so exactly one `Organization` appears per route, with `WebSite` added on `/` carrying a `publisher` reference to the `Organization` `@id`
    - _Requirements: 5.1, 5.3, 5.7, 5.10_

  - [x] 7.2 Render the NAP from `src/lib/site.ts` and emit `LocalBusiness` on `/contact`
    - Rewrite the address blocks in `contact/page.tsx`, `privacy/page.tsx`, and `terms/page.tsx` to read from `NAP` so all three are character-identical
    - Change the `/contact` opening-hours copy to render from `OPENING_HOURS` as "Mon-Sun, 10:00 AM - 7:00 PM IST" so the page and the `LocalBusiness` `openingHours` agree instead of contradicting each other
    - Emit exactly one `LocalBusiness` node on `/contact` with address, telephone, email, seven-day `openingHours`, `areaServed` naming the city and country, and a `parentOrganization` reference
    - _Requirements: 5.4, 8.5_

  - [x] 7.3 Drive footer social links from `SOCIAL_PROFILES`
    - Drop the local `socialLinks` array in `src/components/layout/footer.tsx` and map `SOCIAL_PROFILES`, keeping the icon lookup local so the `Organization` `sameAs` array and the rendered hrefs cannot drift
    - _Requirements: 5.2_

  - [x] 7.4 Add the visible breadcrumb trail and `BreadcrumbList` node to every route below the root
    - Create the breadcrumb component and drive both the visible trail and `breadcrumbNode` from one trail array, with the first item an anchor to `/`, ancestors as anchors, and the final item as text without an anchor
    - _Requirements: 5.6, 7.4_

  - [ ]* 7.5 Write unit test for `breadcrumbNode`
    - Cover a three-level trail asserting contiguous positions starting at 1
    - _Requirements: 5.6_

  - [x] 7.6 Replace the `ProfessionalService` block on solution routes with `serviceNode`
    - Emit `serviceNode` for the route's own service with `areaServed` and `url` pointing at the rendered route, plus the `Organization` node, so `provider` is an `@id` reference rather than an anonymous duplicate
    - _Requirements: 5.5, 5.7, 5.10_

- [x] 8. Phase 4 - Root catch-all redirect guard
  - [x] 8.1 Extend the catch-all redirect's negative lookahead in `next.config.ts`
    - Add `about`, `services`, `og`, `llms\.txt`, `services\.json`, and `feed\.xml` to the exclusion group alongside the existing `blogs|studio|solutions|contact|privacy|terms|api|_next|favicon\.ico|robots\.txt|sitemap\.xml`
    - Without this, every new root-level route 308s into a non-existent blog post; the design names this the single highest-risk edit in the feature
    - _Requirements: 3.10, 6.1, 7.3, 9.1, 9.3, 12.3_

  - [ ]* 8.2 Write the redirect regression check
    - Example-based assertions that `/about`, `/services/ai-automation`, `/llms.txt`, `/feed.xml`, `/services.json`, and `/og` are not matched by the catch-all source pattern, since this fails silently in a way no property covers
    - _Requirements: 3.10, 7.3_

- [x] 9. Phase 5a - Blog listing, archive, and author routes
  - [x] 9.1 Add the reserved-slug validation rule to `src/sanity/schemaTypes/postType.ts`
    - Reject the slug values `category`, `author`, and `page` so a post cannot be shadowed by the new static segments under `/blogs`
    - _Requirements: 7.5, 7.6, 7.7_

  - [x] 9.2 Add the archive and feed GROQ queries to `src/sanity/lib/queries.ts`
    - Add `POSTS_PAGE_QUERY`, `CATEGORY_POSTS_QUERY`, `AUTHOR_POSTS_QUERY`, `CATEGORY_SLUGS_QUERY`, `AUTHOR_SLUGS_QUERY`, `AUTHOR_PROFILE_QUERY`, and `FEED_POSTS_QUERY`, all built on `LIVE_POST_FILTER`
    - Filter the slug queries on "referenced by at least one published post" so empty taxonomy terms never become thin indexable pages
    - _Requirements: 6.4, 6.7, 7.5, 7.6, 8.1, 8.8_

  - [x] 9.3 Create the shared `PostListing` and `Pagination` components
    - `PostListing` renders at most 12 entries per page ordered by `publishedAt` descending, each entry a crawlable anchor to its post route; `Pagination` renders every page target as a real `<a href>`
    - _Requirements: 7.5, 7.6, 7.7_

  - [x] 9.4 Add `/blogs` pagination and the `/blogs/page/[page]` route
    - Serve page 1 at `/blogs` and page N at `/blogs/page/<N>`, and `notFound()` for a page token that is not an integer in `1..totalPages`
    - _Requirements: 7.7, 7.9_

  - [x] 9.5 Create `/blogs/category/[slug]` and its paginated child route
    - One archive per `category` document holding at least one published post, with `notFound()` for unknown slugs and out-of-range pages
    - _Requirements: 7.5, 7.9, 7.10_

  - [x] 9.6 Create `/blogs/author/[slug]`, its paginated child route, and the post byline link
    - Render name, job title, bio, and the author's published posts (at minimum the 20 most recent) descending by date, omitting any missing field from both the rendered output and the `Person` node with no placeholder text
    - Emit exactly one `personNode` whose `url` is this route's own absolute URL, and add a byline anchor on post routes using that same absolute URL, matching the path `buildArticleJsonLd` already emits
    - `notFound()` with no `Person` data when the slug resolves to no published author holding at least one published post
    - _Requirements: 7.6, 7.9, 8.1, 8.2, 8.8, 8.9, 8.10_

  - [ ]* 9.7 Write unit tests for pagination and taxonomy boundaries
    - Cover page tokens 0, 1, `totalPages`, `totalPages + 1`, and a non-integer token; an unknown category slug; an author with no published posts; and an author missing a job title or bio
    - _Requirements: 7.9, 7.10, 8.8, 8.10_

  - [x] 9.8 Gate the last-reviewed date on post routes behind a calendar-day comparison
    - Add the same-calendar-day helper in the site display timezone, render the publication date in both human-readable and machine-readable form always, and render the last-reviewed date only when `lastReviewed` falls on a different calendar day
    - _Requirements: 8.3_

  - [ ]* 9.9 Write property test for the review-date display rule
    - **Property 38: Review date renders only when it differs by calendar day**
    - **Validates: Requirements 8.3**

- [x] 10. Phase 5b - Marketing routes, AI discovery, and internal linking
  - [x] 10.1 Create the `/solutions` hub route
    - Render the ten Service_Catalog entries, one crawlable anchor per approved-city pairing and no anchor to any other `/solutions/<slug>` path, plus ten `Service` nodes, the `Organization` node, and the breadcrumb
    - _Requirements: 5.5, 7.1, 7.2_

  - [x] 10.2 Create the four `/services/[slug]` routes
    - Drive the page from `src/lib/service-routes.ts`, rendering the keyword phrase verbatim in the single `<h1>`, the server-rendered summary, the content sections, and the FAQ pairs with a `FAQPage` node
    - _Requirements: 12.3, 9.6, 9.8_

  - [x] 10.3 Create the `/about` route
    - State the founding year from `FOUNDING_YEAR`, at least three named service categories from the Service_Catalog, and at least two named delivery models sourced from `delivery-models.tsx`, all visible without interaction
    - _Requirements: 8.4_

  - [x] 10.4 Add metrics to the delivered-project case references
    - Rewrite the four real project cards in `src/components/home/featured-work.tsx` and mirror at least three on `/about`, each stating the project name, at least one named technology, and an outcome as a metric name plus a numeric value with its unit
    - Render the literal word "measured" or "estimated" inside the same visible block as each figure; unlabelled numbers are not permitted
    - _Requirements: 8.6, 8.7_

  - [x] 10.5 Update the navigation and footer link inventory
    - Replace `/#solutions` with `/solutions` in the footer and `solution-hero.tsx`, add a Solutions entry to the navbar, and repoint the footer's "AI Sales Agents", "Workflow Automation", "Custom SaaS", and "Programmatic SEO" entries from `/#services` to their `/services/<slug>` routes; add `/about`
    - _Requirements: 7.2, 7.3, 12.10_

  - [x] 10.6 Wire the solution-to-post and post-to-solution cross-links
    - Render at least one crawlable anchor to a published post on every `/solutions/<slug>` route, falling back to the three most recently published posts (or all of them when fewer than three exist) when Sanity records no related post
    - Render at least one crawlable anchor to a `/solutions/<slug>` route or `/contact` on every post route
    - _Requirements: 7.8, 7.11_

  - [ ]* 10.7 Write unit tests for the related-post fallback
    - Cover zero related posts, fewer than three published posts, and the normal case
    - _Requirements: 7.11_

  - [x] 10.8 Create `src/app/llms.txt/route.ts`
    - Return `text/plain; charset=utf-8` with a 200 to 10,000 character body composed from `SITE_NAME`, a 15 to 30 word one-sentence description, all ten Service_Catalog entries, and the absolute URLs of `/`, `/blogs`, `/solutions`, `/contact`, `/privacy`, `/terms`; `dynamic = "force-static"` with `revalidate = false`
    - _Requirements: 9.1, 9.2, 9.10_

  - [x] 10.9 Create `src/app/services.json/route.ts`
    - Return `application/json` with exactly one entry per Service_Catalog entry carrying `name`, a 15 to 40 word `description`, and the absolute target URL, read from the same catalog so no separate copy exists
    - _Requirements: 9.3, 9.10_

  - [x] 10.10 Wire heading ids into post, solution, and service content
    - Add `h2`/`h3` PortableText renderers in `blogs/[slug]/page.tsx` and heading renderers in `solution-template.tsx` and the service template, each pulling ids from one `createHeadingSlugger` instance created at the top of the page component so numbering is route-scoped and deterministic
    - _Requirements: 9.5_

  - [x] 10.11 Add the solution FAQ pairs and city display-name copy
    - Render at least three visible question-and-answer pairs per `/solutions/<slug>` route, each question 200 characters or fewer and each answer 20 to 100 words, with a matching `FAQPage` node emitted only when three or more pairs render
    - Replace `titleCase` in `solutions/[slug]/page.tsx` and `solution-template.tsx` with `city.displayName`, and render that display name once in the `<h1>`, once in the meta description, and at least twice in the body text
    - _Requirements: 9.6, 9.8, 9.9, 12.7_

  - [ ]* 10.12 Write unit tests for `faqNode`
    - Cover 0, 1, 2, and 3 pairs
    - _Requirements: 9.9_

- [-] 11. Checkpoint - route inventory
  - Ensure all tests pass, every new route builds, and no new root-level route is caught by the catch-all redirect. Ask the user if questions arise.

- [x] 12. Phase 6 - Crawl layer
  - [x] 12.1 Create `scripts/gen-route-lastmod.mjs` and the prebuild step
    - Run `git log -1 --format=%cI -- <file>` per source-backed route and write `src/lib/route-lastmod.generated.json`; wire it as a `prebuild` npm script so `sitemap.ts` stops deriving `lastModified` from request time
    - _Requirements: 6.3_

  - [x] 12.2 Rewrite `src/app/sitemap.ts` to compose from `src/lib/routes.ts`
    - One entry per Indexable_Route covering `/`, `/about`, `/blogs` and its pages, the `/solutions` hub, every approved solution route, the four service routes, every published post, every category and author archive, and the legal pages, with no duplicate locations and no more than 50,000 entries
    - Emit absolute `https://blogspage.com` locations with no trailing slash and no query, `lastModified` from `lastReviewed || _updatedAt || publishedAt` for content-backed routes and from the generated commit dates otherwise
    - Exclude `noindex` routes, non-200 routes, `/studio` and everything beneath it, unapproved city tokens, drafts, and future-dated posts; wrap the Sanity fetch so a failure returns the static route set at HTTP 200 rather than a 500 or an empty document
    - Export `revalidate = 3600`
    - _Requirements: 3.9, 3.10, 6.1, 6.2, 6.3, 6.4, 6.10, 6.11, 6.12, 12.10_

  - [x] 12.3 Extend `src/app/robots.ts` and add `/studio` noindex metadata
    - Add separate user-agent records for `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, and `Google-Extended` alongside `*`, each allowing `/` and disallowing `/studio`, and declare the absolute sitemap URL
    - Export `metadata.robots = { index: false, follow: false }` from `src/app/studio/layout.tsx` so every nested `/studio` path inherits the directive, since `robots.txt` alone produces no `noindex`
    - _Requirements: 3.7, 6.5, 6.6_

  - [x] 12.4 Create `src/app/feed.xml/route.ts` and reference it from `/blogs`
    - Serve RSS 2.0 for the 20 most recent live posts via `FEED_POSTS_QUERY`, each item carrying a title, absolute URL, publication date, and a summary of 500 characters or fewer; return a valid post-less channel on query failure; export `revalidate = 3600`
    - Add `alternates.types["application/rss+xml"]` to the `/blogs` metadata so the feed is discoverable from the document head
    - _Requirements: 6.7, 6.8, 6.10, 6.11, 6.12_

  - [ ]* 12.5 Write integration tests for crawl-layer degradation and studio noindex
    - Inject a failing Sanity client and assert `sitemap.xml` still responds 200 with the query-independent routes present
    - Assert `/studio` and one nested path emit `noindex` and are absent from the sitemap
    - _Requirements: 3.7, 6.12_

- [ ] 13. Phase 7 - Rendering and accessibility
  - [x] 13.1 Split the hero into server content and client ambience
    - Extract a server `Hero` rendering the `<h1>` as plain text at `opacity: 1` plus a 40 to 80 word self-contained summary paragraph whose sentence names both `Blogspage` and `AI agency`, and a client `HeroAmbient` for the gradients and trust strip
    - Move the word reveal from Framer Motion to a CSS keyframe stagger in `globals.css` driven by a `--word-index` custom property with `animation-fill-mode: both` and a `prefers-reduced-motion` short-circuit, keeping the existing offsets, easing, and stagger
    - _Requirements: 9.4, 11.1, 11.9, 12.4_

  - [x] 13.2 Bring the preloader inside its visible-duration budget
    - Cut the counter to 900 ms with a 150 ms hold, add a hard `setTimeout` release, skip entirely under `prefers-reduced-motion`, and mark the overlay `aria-hidden`
    - _Requirements: 11.8, 11.9_

  - [x] 13.3 Stop wrapping the tree in the smooth-scroll provider
    - Convert `smooth-scroll-provider.tsx` into a sibling side-effect `<SmoothScroll />` rendered after `<Footer />`, and mount it together with `CustomCursor` and the chat widget from one `<ClientEnhancements />` that defers to `requestIdleCallback`
    - _Requirements: 11.9_

  - [x] 13.4 Add the skip link and fix the document outline
    - Create `src/components/layout/skip-link.tsx` as the first focusable element with `href="#main"` using the visually-hidden-until-focused pattern and a focus ring meeting 3:1 contrast
    - Set `id="main"` and `tabIndex={-1}` on the `<main>` in `src/app/(site)/layout.tsx`, and drop the inner `<main>` from `blogs/page.tsx` in favour of a fragment
    - _Requirements: 10.1, 10.6, 10.7, 10.8_

  - [x] 13.5 Render article body images through the Next.js image component
    - Replace the raw `<img>` in the PortableText image renderer with `next/image` using intrinsic dimensions from `parseSanityImageRef`, or `fill` plus `sizes`, and remove the disabled image lint rule; carry a non-empty `alt` of 1 to 125 characters when the source supplies alternative text and a zero-length `alt` when it does not
    - _Requirements: 10.4, 10.10, 11.2_

  - [x] 13.6 Convert the gym SVG placeholders to inline React components
    - Move the four local SVG placeholders referenced by `src/components/solutions/gym-solution-landing.tsx` into `src/components/solutions/placeholders/` as inline React SVG, removing them from the image pipeline so `dangerouslyAllowSVG` can be switched off
    - _Requirements: 11.11_

  - [x] 13.7 Add image formats and security headers in `next.config.ts`
    - Set `images.formats` to `["image/avif", "image/webp"]`, flip `dangerouslyAllowSVG` to `false`, and add `async headers()` returning `Strict-Transport-Security: max-age=31536000; includeSubDomains`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin` for `/(.*)`
    - _Requirements: 11.3, 11.10, 11.11_

  - [ ]* 13.8 Write unit test for the preloader duration constants
    - Assert the counter plus hold plus exit constants sum to 1500 ms or less
    - _Requirements: 11.8_

  - [ ]* 13.9 Write the config smoke test
    - Assert `next.config.ts` declares `image/avif` and `image/webp`, has `dangerouslyAllowSVG` disabled, sets the three security headers, and lists every new root-level route in the catch-all exclusion group
    - _Requirements: 11.3, 11.10, 11.11_

- [-] 14. Checkpoint - pre-suite
  - Ensure all tests pass and a production build succeeds before wiring the route-level check suite. Ask the user if questions arise.

- [x] 15. Phase 8 - SEO check suite
  - [x] 15.1 Build the check-suite harness
    - Create `tests/seo/global-setup.ts` reading `SEO_BASE_URL` and otherwise spawning `next start -p 3100`, polling `/` until it answers or 90 seconds elapse, and killing the child in teardown
    - Create `tests/seo/route-set.ts` fetching `/sitemap.xml`, extracting `<loc>` values, converting them to paths, adding `/`, deduplicating, and asserting at least one `/blogs/<slug>` and one `/solutions/<slug>` are present
    - Create `vitest.seo.config.ts`, the `seo:check` npm script (`next build && vitest run --config vitest.seo.config.ts`), the shared `Violation` type, a fetch helper using `AbortSignal.timeout(30_000)` that records a timeout as a violation and continues, and a concurrency cap of 6
    - _Requirements: 13.7, 13.8, 13.9, 13.10_

  - [ ]* 15.2 Write property test for canonical self-reference
    - **Property 2: Canonical self-reference**
    - **Property 41: The check suite's route set derives from the sitemap**
    - **Validates: Requirements 3.1, 3.2, 4.8, 13.1, 13.9**

  - [ ]* 15.3 Write property tests for metadata completeness, bounds, and keyword integrity
    - **Property 15: Metadata field set is complete**
    - **Property 16: Title and description length bounds**
    - **Property 18: Titles and descriptions are unique**
    - **Property 31: Keyword map integrity**
    - **Property 32: City-bearing routes render their city display name**
    - **Validates: Requirements 4.3, 4.4, 4.5, 4.6, 4.10, 12.1, 12.3, 12.5, 12.6, 12.7, 13.5**

  - [ ]* 15.4 Write property tests for the emitted JSON-LD graph
    - **Property 8: JSON-LD parses and is typed**
    - **Property 9: Entity graph is connected and node identity is stable** (route-level half)
    - **Property 11: Organization and Service node cardinality and field bounds** (route-level half)
    - **Property 12: Published identity matches rendered identity**
    - **Property 13: Breadcrumb trails are contiguous and doubly rendered**
    - **Property 14: FAQ structured data matches rendered text**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 7.4, 8.5, 9.8, 9.9, 13.2**

  - [ ]* 15.5 Write property tests for social preview images
    - **Property 19: Social preview images resolve at the required size**
    - **Property 20: Generated preview images survive arbitrary titles** (capped at 25 runs, since each run renders a real image; state the reduction in the test file)
    - Add the forced-failure check asserting the `/og` fallback redirect resolves to the static default at 200 with an image content type
    - **Validates: Requirements 4.1, 4.2, 4.7, 4.9, 13.3**

  - [ ]* 15.6 Write property tests for document outline and accessibility statics
    - **Property 21: Document outline is unambiguous**
    - **Property 22: Images carry alt text and reserve their box**
    - **Property 23: Anchors have meaningful accessible names**
    - **Property 24: Skip link leads the focus order**
    - **Property 28: Heading slugs are unique within a route** (rendered-HTML half over every `h2` and `h3` id)
    - **Validates: Requirements 9.5, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.8, 10.10, 11.2, 13.4, 13.11**

  - [ ]* 15.7 Write property and smoke tests for the crawl and AI discovery layer
    - **Property 4: Sitemap membership excludes everything unindexable**
    - **Property 5: Sitemap entries are unique and canonically formed**
    - **Property 6: Sitemap lastModified is request-time independent**
    - **Property 7: Feed items are well formed and exclude hidden posts**
    - **Property 40: The AI discovery layer covers the catalog**
    - Add the smoke assertions that `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/services.json`, and `/feed.xml` return the expected status, content type, non-empty body, and stated time budgets, and that `robots.txt` declares the six named AI user-agent records and the absolute sitemap URL
    - **Validates: Requirements 3.9, 3.10, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.9, 9.1, 9.2, 9.3, 12.9, 13.6**

  - [ ]* 15.8 Write property tests for architecture and internal linking
    - **Property 30: The generated route set equals the resolvable set** (hub-anchor half)
    - **Property 33: Internal links resolve**
    - **Property 34: Listing pagination slices correctly and covers every entry**
    - **Property 35: Listing routes exist only for populated taxonomy terms**
    - **Property 36: Solution and post routes cross-link**
    - **Property 37: Author route and Person URL agree**
    - **Validates: Requirements 5.7, 6.1, 7.1, 7.2, 7.3, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 8.1, 8.2, 8.8, 8.9, 12.10**

  - [ ]* 15.9 Write property tests for no-JavaScript rendering, answer-first content, and headers
    - **Property 25: Content is present and visible without client-side JavaScript**
    - **Property 26: Answer-first content bounds**
    - **Property 39: Security headers on every response**
    - Add the content checks for `/about` field presence, the three case references carrying a named technology and a labelled metric, and the homepage sentence containing both `Blogspage` and `AI agency`
    - **Validates: Requirements 8.4, 8.6, 8.7, 9.4, 9.6, 9.7, 11.1, 11.9, 11.10, 12.4**

  - [ ]* 15.10 Write the harness self-check
    - Run the suite against a fixture with a known violation and assert a non-zero exit plus all four reported fields (target, assertion, expected, observed); point one entry at an unresponsive endpoint and assert a violation naming the route and the 30-second limit is recorded while the run continues
    - _Requirements: 13.7, 13.10_

- [-] 16. Final checkpoint - full suite
  - Ensure `npm run test`, `npm run test:properties`, and `npm run seo:check` all pass. Ask the user if questions arise.

- [ ] 17. Phase 9 - Post-remediation re-score
  - [-] 17.1 Append the post-remediation section to `seo-audit-report.md`
    - Add a second Category_Score per rubric category and a second Overall_Score under a "post-remediation" heading, generated from `src/lib/rubric.ts`, leaving the pre-remediation scores byte-identical
    - List every Finding still unresolved with its identifier, its severity, and the reason it remains open
    - Record the out-of-band lab measurements (Lighthouse mobile medians for LCP, CLS, Total Blocking Time, and the per-route SEO category scores) and the accessibility review outcome supplied by the user
    - Verify pre-remediation immutability by diffing the report between the audit commit and this commit
    - _Requirements: 1.11, 1.14_

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP.
- Task 1 is a gate: no task from 3 onward starts until the audit report is written and committed against `cf08607b59cdab4effde2131e756faa2f78e0232`.
- Task 8.1 edits the highest-risk line in the feature. It ships before any new root-level route and carries its own regression check (8.2) plus a config smoke assertion (13.9), because a broken lookahead 308s a live route into a non-existent blog post and fails silently.
- Pure-function and builder-level property tests (Properties 1, 3, 9 builder, 10, 11 builder, 17, 27, 28 pure, 29, 30 pure, 38) run without a build through `npm run test:properties` and are the fast inner loop. Route-level properties quantify over the sitemap-derived route set and run through `npm run seo:check`.
- Requirements 11.4 through 11.7 (Lighthouse lab medians), 10.7 and 10.9 (focus-indicator and text contrast ratios), the informative-versus-decorative image classification in 10.4, Requirement 2.5 (inter-rater reliability), and Requirements 6.10, 6.11, and 9.10 (propagation windows) are review and measurement items rather than coding tasks. They are verified out-of-band and their results recorded in task 17.1.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["1.3", "1.4", "1.5"] },
    { "id": 2, "tasks": ["1.6"] },
    { "id": 3, "tasks": ["3.1", "3.2", "3.8"] },
    { "id": 4, "tasks": ["3.3", "3.4", "3.9", "3.10", "4.5", "4.10"] },
    { "id": 5, "tasks": ["3.5", "3.6", "3.7", "4.1", "4.6", "4.7", "4.11"] },
    { "id": 6, "tasks": ["4.2", "4.3", "4.4", "4.9"] },
    { "id": 7, "tasks": ["4.8", "4.12", "6.1"] },
    { "id": 8, "tasks": ["6.2", "6.3", "6.4", "6.5", "6.7"] },
    { "id": 9, "tasks": ["6.6", "7.1", "7.2", "7.3", "7.4"] },
    { "id": 10, "tasks": ["7.5", "7.6", "8.1"] },
    { "id": 11, "tasks": ["8.2", "9.1", "9.2", "9.3"] },
    { "id": 12, "tasks": ["9.4", "9.5", "9.6", "9.8", "10.1", "10.2", "10.3", "10.8", "10.9"] },
    { "id": 13, "tasks": ["9.7", "9.9", "10.4", "10.5", "10.6"] },
    { "id": 14, "tasks": ["10.7", "10.10", "10.12"] },
    { "id": 15, "tasks": ["10.11", "12.1"] },
    { "id": 16, "tasks": ["12.2", "12.3"] },
    { "id": 17, "tasks": ["12.4", "12.5"] },
    { "id": 18, "tasks": ["13.1", "13.2", "13.5", "13.6", "13.7"] },
    { "id": 19, "tasks": ["13.3", "13.8", "13.9"] },
    { "id": 20, "tasks": ["13.4"] },
    { "id": 21, "tasks": ["15.1"] },
    { "id": 22, "tasks": ["15.2", "15.3", "15.4", "15.5", "15.6", "15.7", "15.8", "15.9", "15.10"] },
    { "id": 23, "tasks": ["17.1"] }
  ]
}
```
