# Requirements Document

## Introduction

This feature covers two connected deliverables for the Blogspage agency website (Next.js 15 App Router + Sanity CMS, deployed at `https://blogspage.com`):

1. **A grounded SEO audit** of the existing codebase that produces a written report with a category-by-category rubric and a single overall rating out of 10.
2. **The remediation and positioning work** that follows from the audit, so the site is discoverable, indexable, and understood by both classic search engines and AI answer engines as **the Blogspage AI agency** that delivers the services published on the site.

### Grounding: what the codebase scan established

The audit scope is anchored to what exists today. A read of the SEO surface found both real strengths and concrete defects:

**Already in place**
- Root metadata with `metadataBase`, title template, Open Graph and Twitter card blocks (`src/app/layout.tsx`).
- Per-post `generateMetadata` with canonical, robots, article Open Graph, keywords, author (`src/app/(site)/blogs/[slug]/page.tsx`).
- `BlogPosting`, `BreadcrumbList`, and conditional `FAQPage` JSON-LD builders (`src/lib/blog.ts`).
- `ProfessionalService` JSON-LD plus canonical on solution landing pages (`src/app/(site)/solutions/[slug]/page.tsx`).
- Dynamic `sitemap.ts` and `robots.ts`; `/studio` disallowed.
- A deep, SEO-aware Sanity `post` schema (excerpt, focus keyword, canonical, noindex/nofollow, `lastReviewed`, FAQ, related posts) with a shared `LIVE_POST_FILTER` that keeps drafts, future-dated, and `noindex` posts out of listings and the sitemap.
- Legacy WordPress URL redirects preserved in `next.config.ts`.

**Defects and gaps found**
- `/og-image.png` is referenced by root Open Graph and Twitter metadata but is absent from `public/`, so every non-blog page has a broken social preview image.
- No `Organization`, `WebSite`, or `LocalBusiness` structured data anywhere; the agency entity itself is undeclared, and the social profiles in the footer are never linked as `sameAs`.
- The homepage, `/contact`, `/privacy`, and `/terms` declare no canonical URL.
- `getNicheBySlug` matches any `[city]` token, so `/solutions/<niche>-business-solution-website-at-<anything>` renders a self-canonicalising, indexable page — an unbounded duplicate-URL space.
- Solution landing pages are absent from `sitemap.xml`.
- `/solutions` has no hub page, while the footer and solution hero link to the `/#solutions` anchor.
- `buildArticleJsonLd` emits author URLs at `/blogs/author/<slug>`, a route that does not exist.
- No category or author archive routes, so topical clustering has no landing surface.
- `src/app/(site)/blogs/page.tsx` renders a second `<main>` inside the `<main>` already provided by `src/app/(site)/layout.tsx`.
- Article body images render through a raw `<img>` with the Next.js image lint rule disabled.
- No `llms.txt`, no AI-crawler rules in `robots.ts`, and no RSS feed.
- The hero `<h1>` renders each word at `opacity: 0` behind a client-side Framer Motion animation, which puts the largest text element on the critical path of hydration.
- `next.config.ts` sets no image `formats` preference and no response security headers.
- Root Open Graph declares `en_US` while the business NAP is Hyderabad, India.
- `next.config.ts` sets `dangerouslyAllowSVG: true`, so remote SVG assets are rendered without sanitisation.

## Glossary

- **Blogspage**: The agency and brand that owns `https://blogspage.com`.
- **Site**: The Next.js application in this repository, served at `https://blogspage.com`.
- **Route**: A publicly reachable URL path rendered by the Site (for example `/`, `/blogs`, `/blogs/<slug>`, `/solutions/<slug>`, `/contact`, `/privacy`, `/terms`).
- **Indexable_Route**: A Route that returns HTTP 200 and does not emit a `noindex` robots directive.
- **Audit_Report**: The written SEO audit deliverable produced by this feature, stored as a Markdown file in the repository.
- **Rubric**: The fixed set of weighted scoring categories, each with a defined 0–10 scale, used to score the Site.
- **Category_Score**: A score from 0 to 10, in increments of 0.5, assigned to one Rubric category.
- **Overall_Score**: The weighted mean of all Category_Scores, expressed out of 10 with one decimal place.
- **Finding**: A single audit observation recorded with a severity, a repository file path, and a description of the SEO impact.
- **Metadata_Layer**: The Next.js `metadata` exports and `generateMetadata` functions across the Site.
- **Structured_Data_Layer**: The JSON-LD emitted by the Site, including the builders in `src/lib/blog.ts`.
- **Entity_Graph**: The interlinked `Organization`, `LocalBusiness`, `WebSite`, `Service`, and `Person` JSON-LD nodes that describe Blogspage and its offerings.
- **Crawl_Layer**: `src/app/robots.ts`, `src/app/sitemap.ts`, and any additional feed or discovery files the Site serves.
- **AI_Discovery_Layer**: The files and content patterns that let AI answer engines locate, parse, and cite Blogspage, including `llms.txt` and answer-first content structures.
- **Solutions_Router**: The dynamic route and slug resolver at `src/app/(site)/solutions/[slug]/page.tsx` together with `src/lib/niches.ts`.
- **Approved_City_List**: The explicit list of city tokens that the Solutions_Router serves as Indexable_Routes.
- **Service_Catalog**: The ten agency service verticals defined in `src/lib/niches.ts` and mirrored in `src/lib/services-catalog.ts`.
- **Service_Route**: A Route dedicated to a single named agency service offering, distinct from the vertical `/solutions/<slug>` Routes.
- **Social_Preview_Image**: The image referenced by a Route's Open Graph and Twitter card metadata.
- **NAP**: The name, address, and phone number of Blogspage as published on `/contact`, `/privacy`, and `/terms`.
- **SEO_Check_Suite**: The automated test suite added by this feature that asserts the Site's SEO invariants.
- **Core_Web_Vitals**: Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Interaction to Next Paint (INP) as defined by Google.
- **Total Blocking Time**: The Lighthouse lab metric used in this document as the proxy for INP.

## Requirements

### Requirement 1: SEO Audit Report and Rating

**User Story:** As the owner of Blogspage, I want a written SEO audit of my codebase with a rating out of 10, so that I know exactly where the Site stands and what to fix first.

#### Acceptance Criteria

1. THE Audit_Report SHALL be written as a single Markdown file to `.kiro/specs/seo-audit-and-optimization/seo-audit-report.md` before any remediation work specified in Requirements 3 through 13 begins.
2. THE Audit_Report SHALL record exactly one Category_Score per Rubric category defined in Requirement 2, each stated as a value from 0 to 10 in increments of 0.5, and SHALL state for each category either the identifiers of the Findings that reduced its Category_Score or, where no Finding applies to that category, that no Finding was recorded for it.
3. THE Audit_Report SHALL state the Overall_Score as a value from 0.0 to 10.0 with exactly one decimal place.
4. THE Audit_Report SHALL record each Finding with a unique identifier, exactly one severity value from `critical`, `high`, `medium`, or `low`, and a description of at least one observable consequence for crawling, indexation, ranking, or rendering.
5. THE Audit_Report SHALL cite for each Finding at least one repository file path that exists in the audited commit.
6. THE Audit_Report SHALL name for each Finding exactly one of the ten Rubric categories defined in Requirement 2 as the category the Finding reduces.
7. THE Audit_Report SHALL include a remediation backlog in which every Finding appears exactly once, ordered so that all `critical` items precede all `high` items, all `high` precede all `medium`, and all `medium` precede all `low`, with each backlog entry naming the Finding identifier it resolves.
8. THE Audit_Report SHALL list the Site's existing SEO strengths under a heading separate from the Findings, with at least one repository file path cited for each strength.
9. THE Audit_Report SHALL record the calendar date of the audit, the full-length Git commit hash of the audited code, and whether the audited working tree contained uncommitted changes.
10. WHERE a Finding cannot be verified from the repository alone, THE Audit_Report SHALL label that Finding as requiring live-site or Search Console verification and SHALL state the observation needed to confirm it.
11. WHEN the remediation work in Requirements 3 through 13 is complete, THE Audit_Report SHALL add, under a "post-remediation" heading, a second Category_Score per Rubric category and a second Overall_Score, while leaving the pre-remediation Category_Scores and Overall_Score unchanged in the file.
12. THE Audit_Report SHALL assign Finding severity by these rules: `critical` where the defect makes an intended Indexable_Route unreachable or unindexable, exposes an unbounded set of duplicate Indexable_Routes, or emits structured data that fails to parse; `high` where an Indexable_Route is absent from the Crawl_Layer, resolves to a broken referenced asset, or omits a canonical URL; `medium` where a signal is present but incomplete or inconsistent across Routes; `low` where the defect changes no Indexable_Route's crawling, indexation, or rendering outcome.
13. IF an audit claim can neither be traced to a repository file path nor labelled as requiring live-site or Search Console verification, THEN THE Audit_Report SHALL omit that claim.
14. IF a Finding remains unresolved when the post-remediation Category_Scores are recorded, THEN THE Audit_Report SHALL list that Finding under the "post-remediation" heading with its identifier, its severity, and the reason it remains open.

### Requirement 2: Scoring Rubric

**User Story:** As the owner of Blogspage, I want the rating to come from a published rubric, so that the score is reproducible and I can see which area drags it down.

#### Acceptance Criteria

1. THE Rubric SHALL define exactly ten uniquely named categories, being Crawlability and Indexation, Canonicalisation and Duplicate Control, Metadata and Social Previews, Structured Data and Entity Graph, Content and Keyword Architecture, Site Architecture and Internal Linking, Core Web Vitals and Rendering, Semantic HTML and Accessibility, Authority and E-E-A-T Signals, and AI and LLM Discoverability, and no category outside this closed set SHALL contribute to the Overall_Score.
2. THE Rubric SHALL assign each of the ten categories an integer weight between 5 and 20 inclusive, and the sum of the ten weights SHALL equal exactly 100.
3. THE Rubric SHALL define, for each category, three anchor descriptors stating the observable conditions that earn a Category_Score of 0, 5, and 10, where each descriptor names the artefact or measurement to inspect and the threshold that counts as met.
4. THE Audit_Report SHALL compute the Overall_Score as the sum over all ten categories of Category_Score multiplied by that category's weight, divided by 100, rounded half-up to one decimal place, producing a value between 0.0 and 10.0 inclusive.
5. WHEN two auditors independently apply the Rubric to the same identified commit of the Site, THE Rubric SHALL yield Category_Scores that differ by no more than 1.0 point for every category and an Overall_Score that differs by no more than 0.5 points.
6. THE Audit_Report SHALL show, for each of the ten categories, the category name, its weight, its Category_Score, and its weighted contribution rounded to two decimal places, followed by the sum of the ten contributions and the resulting Overall_Score, with the displayed contributions summing to the displayed Overall_Score within 0.05.
7. WHERE observed evidence for a category falls between two anchor descriptors, THE Rubric SHALL require the Category_Score to be set to the nearest 0.5 increment between those two anchors, and THE Audit_Report SHALL cite for that category the anchor used and the evidence observed.
8. IF a category cannot be evaluated because a required measurement or artefact is unavailable, THEN THE Audit_Report SHALL record that category's Category_Score as 0, mark the category as unmeasured with an indication of which evidence was missing, and retain all other Category_Scores unchanged.
9. WHEN the Audit_Report presents the Overall_Score, THE Audit_Report SHALL list all ten categories ordered by weighted points lost, computed as weight multiplied by the difference between 10 and Category_Score, divided by 100, in descending order, and identify the highest three as the largest contributors to the score shortfall.

### Requirement 3: Indexation and Canonical Correctness

**User Story:** As the owner of Blogspage, I want every page to declare one canonical URL and only intended pages to be indexable, so that ranking signals consolidate instead of splitting across duplicates.

#### Acceptance Criteria

1. THE Metadata_Layer SHALL emit exactly one `alternates.canonical` absolute URL for `/`, `/blogs`, `/contact`, `/privacy`, `/terms`, every `/blogs/<slug>` Route, and every `/solutions/<slug>` Route, and that URL SHALL resolve to the same Route that emitted it.
2. THE Metadata_Layer SHALL emit each canonical URL with the `https` scheme, the `blogspage.com` host, a lowercase path, no query string, no fragment, and no trailing slash, except that the canonical URL for the `/` Route SHALL be the scheme and host with no path segment.
3. THE Solutions_Router SHALL define the Approved_City_List as an explicit enumeration of between 1 and 50 city tokens, each 2 to 40 characters long and composed only of lowercase letters, digits, and hyphens.
4. WHEN a `/solutions/<slug>` request arrives whose niche segments match a defined niche slug template and whose city token, after lowercasing, exactly matches a member of the Approved_City_List, THE Solutions_Router SHALL serve an Indexable_Route.
5. IF a `/solutions/<slug>` request carries a city token that is absent from the Approved_City_List, THEN THE Solutions_Router SHALL respond with HTTP 404 and SHALL NOT emit an `alternates.canonical` URL for that request.
6. IF a `/solutions/<slug>` request carries niche segments that match no defined niche slug template, THEN THE Solutions_Router SHALL respond with HTTP 404.
7. THE Site SHALL emit a `noindex` robots directive for the `/studio` Route and for every Route beneath `/studio` at any path depth.
8. WHEN a post carries `noindex: true` in Sanity, THE Metadata_Layer SHALL emit a `noindex` robots directive for that post's Route.
9. THE Site SHALL exclude from `sitemap.xml` every Route that emits a `noindex` robots directive, every `/solutions/<slug>` Route whose city token is absent from the Approved_City_List, and the `/studio` Route together with every Route beneath it.
10. THE Site SHALL list each URL in `sitemap.xml` at most once, in the canonical form defined in criterion 2, and SHALL respond to each listed URL with HTTP 200 without an intervening redirect.

### Requirement 4: Metadata and Social Preview Integrity

**User Story:** As a founder evaluating Blogspage, I want links to the site to render a correct title, description, and image wherever they are shared, so that the agency looks credible before I click.

#### Acceptance Criteria

1. THE Site SHALL resolve every URL referenced by Open Graph or Twitter card image metadata to an absolute `https://blogspage.com` URL that responds with HTTP 200, a `Content-Type` beginning `image/`, and a payload of 5 MB or less.
2. THE Site SHALL serve every Social_Preview_Image at exactly 1200 pixels wide by 630 pixels tall.
3. THE Metadata_Layer SHALL emit non-empty `title`, `description`, `openGraph.title`, `openGraph.description`, `openGraph.url`, `openGraph.image` with a non-empty `alt` value, `twitter.card` with the value `summary_large_image`, `twitter.title`, `twitter.description`, and `twitter.image` values for `/`, `/blogs`, `/contact`, `/privacy`, `/terms`, every `/blogs/<slug>` Route, and every `/solutions/<slug>` Route.
4. THE Metadata_Layer SHALL emit a rendered `<title>`, measured after the root title template is applied, of between 30 and 70 characters inclusive for every Indexable_Route.
5. THE Metadata_Layer SHALL emit a meta description of between 120 and 160 characters inclusive for every Indexable_Route.
6. THE Metadata_Layer SHALL emit `en_IN` as the `openGraph.locale` value on every Indexable_Route and `en-IN` as the document `lang` attribute on every Route.
7. WHERE a Route has no author-supplied Social_Preview_Image, WHEN that Route's Social_Preview_Image URL is requested, THE Site SHALL respond within 2 seconds with a generated image of 1200 by 630 pixels that renders the Route's rendered `<title>` text and the Blogspage logo.
8. THE Metadata_Layer SHALL emit exactly one `<title>` element and exactly one canonical `<link>` element per rendered Route.
9. IF generation of a Social_Preview_Image fails or does not complete within 2 seconds, THEN THE Site SHALL respond with the Site's static default Social_Preview_Image at HTTP 200 with a `Content-Type` beginning `image/`.
10. THE Metadata_Layer SHALL emit a rendered `<title>` string and a meta description string that are each unique across all Indexable_Routes.
11. IF a post carries no author-supplied excerpt in Sanity, THEN THE Metadata_Layer SHALL emit a meta description derived from that post's body text truncated to between 120 and 160 characters inclusive.

### Requirement 5: Structured Data and Entity Graph

**User Story:** As the owner of Blogspage, I want search engines to recognise Blogspage as a named AI agency with defined services and a real business location, so that the brand surfaces as an entity rather than an anonymous website.

#### Acceptance Criteria

1. THE Structured_Data_Layer SHALL emit exactly one `Organization` node on every Indexable_Route, carrying a `name` equal to the Blogspage name in the NAP, a `url` equal to the absolute `https://blogspage.com` site root, a `logo` that resolves to an image asset returning HTTP 200, a `description` of between 50 and 300 characters inclusive, and a `sameAs` array.
2. THE Structured_Data_Layer SHALL populate the `Organization` `sameAs` array with exactly three absolute URLs, character-for-character identical to the X, GitHub, and LinkedIn profile URLs published in `src/components/layout/footer.tsx`.
3. THE Structured_Data_Layer SHALL emit exactly one `WebSite` node on the `/` Route, carrying a `name` equal to the `Organization` `name`, a `url` equal to the absolute site root, and a `publisher` reference whose `@id` is identical to the `@id` of the `Organization` node emitted on the same Route.
4. THE Structured_Data_Layer SHALL emit exactly one `LocalBusiness` node on the `/contact` Route, carrying a `name`, an `address` whose locality, region, postal code, and country values are character-for-character identical to the NAP rendered on the `/contact` Route, a `telephone` and an `email` identical to those rendered on the `/contact` Route, an `openingHours` value covering all seven days of the week, and an `areaServed` value naming at least the city and the country stated in the NAP.
5. THE Structured_Data_Layer SHALL emit, on the `/solutions` hub Route, one `Service` node for each of the ten entries in the Service_Catalog, and SHALL emit on each `/solutions/<slug>` Route the single `Service` node for that Route's service, each node carrying a `name` identical to the Service_Catalog entry name, a `description` of between 50 and 300 characters inclusive, a `serviceType`, and a `provider` reference whose `@id` is identical to the `@id` of the `Organization` node.
6. THE Structured_Data_Layer SHALL emit exactly one `BreadcrumbList` node on every Route below the site root, whose items begin at `position` 1 with the site root and increase by 1 per item without gaps, and whose final item names the current Route.
7. THE Structured_Data_Layer SHALL emit every `@id`, `url`, and `logo` value as an absolute URL with the `https` scheme and the `blogspage.com` host, and every such value that denotes a Route on the Site SHALL resolve to a Route returning HTTP 200.
8. THE Structured_Data_Layer SHALL emit every JSON-LD block so that it parses as valid JSON without error, declares a Schema.org `@context`, declares a `@type` that is a published Schema.org type name, and returns zero errors when submitted to Schema.org structured-data validation.
9. WHEN a post carries FAQ entries in Sanity, THE Structured_Data_Layer SHALL emit one `FAQPage` node containing one question-and-answer pair per Sanity FAQ entry, with question and answer text character-for-character identical to the question and answer text rendered in that post's HTML, ignoring leading and trailing whitespace.
10. THE Structured_Data_Layer SHALL emit an `@id` for every `Organization`, `WebSite`, and `Service` node that is identical for that node across every Route on which the node appears and across successive builds of unchanged content, and every `@id` reference emitted on a Route SHALL resolve to a node carrying that `@id` in the same Route's JSON-LD.
11. IF a JSON-LD property value would reference a Route on the Site that does not return HTTP 200, THEN THE Structured_Data_Layer SHALL omit that property from the emitted node and SHALL emit the node's remaining required properties unchanged.
12. IF a value required by a JSON-LD property is unavailable at render time, THEN THE Structured_Data_Layer SHALL omit that property rather than emitting an empty, null, or placeholder value, and SHALL emit the remaining nodes for that Route unchanged.

### Requirement 6: Crawl and Discovery Infrastructure

**User Story:** As the owner of Blogspage, I want crawlers to find every page worth ranking, so that no revenue page depends on being stumbled upon.

#### Acceptance Criteria

1. THE Crawl_Layer SHALL list in `sitemap.xml` exactly one entry per Indexable_Route, covering `/`, `/blogs`, `/contact`, `/privacy`, `/terms`, the `/solutions` hub Route, every `/solutions/<slug>` Route built from the Approved_City_List, every published post Route, and every category and author archive Route, with no duplicate location values and no more than 50,000 entries.
2. THE Crawl_Layer SHALL emit every `sitemap.xml` location as an absolute URL with the `https` scheme and the `blogspage.com` host, without a trailing slash and without query parameters.
3. THE Crawl_Layer SHALL set each `sitemap.xml` `lastModified` value to an ISO 8601 timestamp with a UTC offset, derived from the `lastReviewed`, `_updatedAt`, or `publishedAt` value of the Route's Sanity content for content-backed Routes and from the last commit date of the Route's source files for Routes with no Sanity content, and SHALL NOT derive that value from the time the request is served, so that two requests separated by no content change return identical `lastModified` values for every entry.
4. THE Crawl_Layer SHALL omit from `sitemap.xml` every Route that emits a `noindex` robots directive, every Route that responds with a status other than HTTP 200, and every post that is an unpublished draft or carries a `publishedAt` value later than the time of generation.
5. THE Crawl_Layer SHALL declare in `robots.txt` a separate user-agent record for each of `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, and `Google-Extended`, each record allowing `/` and disallowing `/studio`.
6. THE Crawl_Layer SHALL declare in `robots.txt` the absolute URL of `sitemap.xml`.
7. THE Crawl_Layer SHALL serve an RSS or Atom feed of the 20 most recently published posts at a fixed Route path that does not change between deployments, SHALL emit for each item a title, an absolute item URL, a publication date, and a summary of 500 characters or fewer, and SHALL exclude from the feed every post excluded from `sitemap.xml`.
8. THE Crawl_Layer SHALL reference the feed Route from the document `<head>` of `/blogs` as an alternate link carrying the feed's absolute URL and an XML feed content type.
9. THE Crawl_Layer SHALL serve `robots.txt` with HTTP 200 and a `Content-Type` beginning `text/plain`, and SHALL serve `sitemap.xml` and the feed Route with HTTP 200 and a `Content-Type` beginning `application/xml` or `text/xml`, in each case without requiring authentication and completing each response within 3 seconds on a production build.
10. WHEN a post is published in Sanity, THE Crawl_Layer SHALL include that post's Route in `sitemap.xml` and in the feed within 3600 seconds.
11. IF a post is unpublished, deleted, marked `noindex`, or given a `publishedAt` value in the future, THEN THE Crawl_Layer SHALL remove that post's Route from `sitemap.xml` and from the feed within 3600 seconds.
12. IF the Sanity query that supplies post Routes fails or times out while `sitemap.xml` or the feed is generated, THEN THE Crawl_Layer SHALL respond with HTTP 200 listing the Indexable_Routes that do not depend on that query, and SHALL NOT respond with an error status or an empty document.

### Requirement 7: Site Architecture and Internal Linking

**User Story:** As a visitor researching a specific vertical, I want to reach the matching solution page from anywhere on the site, so that I land on the page written for my business.

#### Acceptance Criteria

1. THE Site SHALL serve a `/solutions` hub Route that renders exactly one crawlable anchor `href` in the server-rendered HTML for each `/solutions/<slug>` Route formed by pairing each Service_Catalog entry with each Approved_City_List token, and no anchor to any other `/solutions/<slug>` path.
2. THE Site SHALL render an anchor whose `href` is `/solutions` in the site footer, in the site navigation, and in the solution page hero, and SHALL NOT render `/#solutions` as the `href` of any of those three anchors.
3. THE Site SHALL resolve every internal `href` rendered in the site navigation, the site footer, and the breadcrumb trail to a Route that returns HTTP 200 within at most one redirect hop, excluding `mailto:` and `tel:` schemes and hosts other than `blogspage.com`, and SHALL resolve every fragment-only `href` to an element `id` present in the server-rendered HTML of the Route that renders it.
4. THE Site SHALL render on every Route below the site root a visible breadcrumb trail whose first item is an anchor to `/`, whose items appear in path-segment order, whose ancestor items are anchors to Routes returning HTTP 200, and whose final item names the current Route as text without an anchor.
5. THE Site SHALL serve a category archive Route at `/blogs/category/<slug>` for each Sanity `category` document referenced by at least one published post, listing at most 12 post entries per page ordered by publication date descending, with each entry rendered as a crawlable anchor to that post's Route.
6. THE Site SHALL serve an author archive Route for each Sanity `author` document referenced by at least one published post at the same path that the Structured_Data_Layer emits as that author's URL, listing at most 12 post entries per page ordered by publication date descending, with each entry rendered as a crawlable anchor to that post's Route.
7. WHILE the count of published posts exceeds 12, THE `/blogs` Route SHALL render at most 12 post entries per page ordered by publication date descending, SHALL serve page 1 at `/blogs` and page N at `/blogs/page/<N>` for every N from 2 to the total page count, and SHALL render each page target as a crawlable anchor `href` in the server-rendered HTML.
8. THE Site SHALL render on every `/solutions/<slug>` Route at least one crawlable anchor to a published post Route, and SHALL render on every post Route at least one crawlable anchor to a `/solutions/<slug>` Route or to the `/contact` Route.
9. IF a paginated `/blogs` Route, category archive Route, or author archive Route is requested with a page number that is not an integer between 1 and that listing's total page count inclusive, THEN THE Site SHALL respond with HTTP 404.
10. IF a category archive Route or an author archive Route is requested for a slug that matches no Sanity `category` or `author` document holding at least one published post, THEN THE Site SHALL respond with HTTP 404.
11. IF a `/solutions/<slug>` Route has no related post recorded in Sanity, THEN THE Site SHALL render crawlable anchors to the three most recently published post Routes, or to every published post Route when fewer than three exist.

### Requirement 8: Authority and E-E-A-T Signals

**User Story:** As a founder deciding whether to hire Blogspage, I want visible proof of who is behind the work and what has been delivered, so that I can judge credibility.

#### Acceptance Criteria

1. THE Site SHALL serve an author profile Route for each published Sanity `author` document that has a non-empty slug and at least one published post, rendering the author name, the job title, the biography text, and a list of that author's published posts ordered by publication date descending, listing at minimum the 20 most recent of those posts.
2. THE Structured_Data_Layer SHALL emit exactly one `Person` node on each author profile Route carrying `name`, `jobTitle`, and `url`, where `url` is the absolute URL of that same author profile Route, and SHALL emit `sameAs` only when the `author` document holds at least one non-empty profile link, omitting any property whose source value is empty rather than emitting an empty value.
3. WHEN a post Route is rendered, THE Site SHALL render the publication date in both human-readable and machine-readable form, and SHALL additionally render the last-reviewed date in both forms only when the post carries a `lastReviewed` value that falls on a different calendar day than the publication date, suppressing the last-reviewed date in all other cases.
4. THE Site SHALL serve an about Route that states the founding year of Blogspage, at least 3 named service categories, and at least 2 named delivery models, all rendered as text visible without user interaction.
5. THE Site SHALL publish a NAP block on `/contact`, `/privacy`, and `/terms` and in the `LocalBusiness` structured data in which the business name, street address line, locality, region, postal code, country, and at least one contact point (telephone number or email address) are character-for-character identical across all four locations, ignoring differences in line breaks and surrounding whitespace only.
6. THE Site SHALL render at least 3 delivered-project case references, each stating the project or client name, at least 1 named technology of the stack, and at least 1 outcome expressed as a metric name plus a numeric value with its unit (percentage, count, currency amount, or duration).
7. IF a case reference cites a numeric outcome, THEN THE Site SHALL render the word "measured" or the word "estimated" within the same visible block as that figure.
8. IF a requested author profile Route does not resolve to a published `author` document with at least one published post, THEN THE Site SHALL return a not-found response, SHALL emit no `Person` structured data for that Route, and SHALL exclude that Route from the sitemap.
9. WHEN a post Route that has an `author` reference is rendered, THE Site SHALL render a link from that post Route to the corresponding author profile Route, using the same absolute URL that the post's `Person` author node carries in its `url` property.
10. IF an `author` document is missing a job title or a biography, THEN THE Site SHALL still serve the author profile Route with the remaining available fields, SHALL omit the missing field from both the rendered output and the `Person` node, and SHALL render no placeholder text in place of the missing field.

### Requirement 9: AI and LLM Discoverability

**User Story:** As the owner of Blogspage, I want AI assistants to describe and recommend Blogspage as an AI agency when asked, so that the brand is cited in AI answers as well as search results.

#### Acceptance Criteria

1. THE AI_Discovery_Layer SHALL serve an `llms.txt` file at `https://blogspage.com/llms.txt` with HTTP 200, a `Content-Type` of `text/plain`, UTF-8 encoding, a body of between 200 and 10,000 characters, and a complete response within 1 second.
2. THE `llms.txt` file SHALL state the Blogspage name, a single-sentence description of the agency of between 15 and 30 words, all ten Service_Catalog entries, the absolute URL of the `/contact` Route, and one absolute URL for each of the `/`, `/blogs`, `/solutions`, `/contact`, `/privacy`, and `/terms` Routes, where every stated URL returns HTTP 200.
3. THE AI_Discovery_Layer SHALL serve a machine-readable service index Route that returns HTTP 200, a `Content-Type` of `application/json`, a complete response within 1 second, and exactly one entry per Service_Catalog entry, each entry carrying a `name`, a `description` of between 15 and 40 words, and the absolute URL of the Route targeting that service, where that URL returns HTTP 200.
4. THE Site SHALL render, in the server-rendered HTML of the `/` Route and of every `/solutions/<slug>` Route, a self-contained summary paragraph of between 40 and 80 words that names Blogspage and the service in the same sentence, at full opacity and independent of client-side JavaScript execution.
5. THE Site SHALL render on every `h2` and `h3` element in post and solution content an `id` attribute that is derived from the heading text, contains only lowercase letters, digits, and hyphens, is unique within its Route, is disambiguated by an appended numeric suffix where two headings would otherwise produce the same value, and remains unchanged across rebuilds while the heading text is unchanged.
6. THE Site SHALL render on every `/solutions/<slug>` Route at least three visible question-and-answer pairs, with each question of 200 characters or fewer and each answer of between 20 and 100 words.
7. WHEN a post Route or a `/solutions/<slug>` Route is requested with client-side JavaScript disabled, THE Site SHALL return in the server-rendered HTML response every heading and every body paragraph of that Route's published content, with no such element rendered at an opacity below 1 or hidden from rendering.
8. WHERE a `/solutions/<slug>` Route renders at least three question-and-answer pairs, THE Structured_Data_Layer SHALL emit a `FAQPage` node whose question and answer text matches the text rendered on that Route character for character.
9. IF a `/solutions/<slug>` Route renders fewer than three question-and-answer pairs, THEN THE Structured_Data_Layer SHALL omit the `FAQPage` node from that Route and SHALL still emit its remaining structured data as valid JSON-LD.
10. WHEN a deployment changes a Service_Catalog entry, THE AI_Discovery_Layer SHALL serve `llms.txt` and the service index Route reflecting that change on the first request received after the deployment completes.

### Requirement 10: Semantic HTML and Accessibility

**User Story:** As a visitor using a screen reader or a crawler parsing the page, I want one clear document outline per page, so that the content structure is unambiguous.

#### Acceptance Criteria

1. THE Site SHALL render exactly one `<main>` element in the server-rendered HTML of every Route, and SHALL NOT render a `<main>` element nested inside another `<main>` element.
2. THE Site SHALL render exactly one `<h1>` element in the server-rendered HTML of every Route, with text content of between 1 and 70 characters inclusive.
3. THE Site SHALL render the first heading of every Route as an `<h1>`, and SHALL render each subsequent heading at a level no more than one level deeper than the closest preceding heading.
4. THE Site SHALL render a non-empty `alt` attribute of between 1 and 125 characters inclusive on every image that conveys information to the reader, and SHALL render an `alt` attribute of zero characters on every image that repeats adjacent text or serves only presentation.
5. THE Site SHALL render on every anchor element an accessible name of at least 4 characters, taken from its text content, its `aria-label`, or the `alt` attribute of an image it contains, and SHALL NOT rely on an accessible name consisting only of a generic phrase such as "click here", "read more", "learn more", "here", or "link".
6. THE Site SHALL render a skip-to-content link in the server-rendered HTML of every Route as the first focusable element in document order, with an `href` referencing the fragment identifier of that Route's `<main>` element.
7. WHEN the skip-to-content link receives keyboard focus, THE Site SHALL render that link inside the viewport with a focus indicator at a contrast ratio of at least 3 to 1 against its adjacent background.
8. WHEN a visitor activates the skip-to-content link, THE Site SHALL move keyboard focus to the `<main>` element of that Route.
9. THE Site SHALL render text below 24 pixels, or below 19 pixels when bold, at a contrast ratio of at least 4.5 to 1 against its background, and SHALL render text at or above those sizes at a contrast ratio of at least 3 to 1, in every colour theme the Site serves.
10. IF an image's source data supplies no alternative text value, THEN THE Site SHALL render that image with an `alt` attribute of zero characters and SHALL NOT omit the `alt` attribute.

### Requirement 11: Core Web Vitals and Rendering

**User Story:** As a visitor on a mobile connection, I want the page to show its main content quickly and hold its layout still, so that I stay on the site.

#### Acceptance Criteria

1. WHEN the `/` Route is requested, THE Site SHALL return server-rendered HTML in which the `<h1>` text is rendered at computed `opacity: 1` and `visibility: visible`, so that the `<h1>` text is readable with client-side JavaScript disabled and without waiting on any client-side animation.
2. THE Site SHALL render every content image — defined as any raster image displayed inside the `<main>` element of any Route, including article body images sourced from Sanity — through the Next.js image component with either explicit `width` and `height` or `fill` plus `sizes`, so that the image's box is reserved before the image bytes arrive and the image contributes 0 to the Route's CLS.
3. THE Site SHALL declare `image/avif` and `image/webp` in the Next.js image `formats` configuration.
4. WHEN the `/` Route of a production build is measured with Lighthouse mobile emulation at its default mobile throttling preset across 3 consecutive runs, THE Site SHALL report a median LCP of 2.5 seconds or less.
5. WHEN the `/` Route of a production build is measured with Lighthouse mobile emulation at its default mobile throttling preset across 3 consecutive runs with no user interaction during page load, THE Site SHALL report a median CLS of 0.1 or less.
6. WHEN the `/` Route of a production build is measured with Lighthouse mobile emulation at its default mobile throttling preset across 3 consecutive runs, THE Site SHALL report a median Total Blocking Time of 200 milliseconds or less, as the lab proxy for INP.
7. WHEN each of the Routes `/`, `/blogs`, one `/blogs/<slug>`, one `/solutions/<slug>`, `/contact`, `/privacy`, and `/terms` of a production build is measured with Lighthouse mobile emulation at its default mobile throttling preset, THE Site SHALL report a Lighthouse SEO category score of 95 or higher for each measured Route.
8. WHILE the preloader overlay is displayed on a Route, THE Site SHALL keep its total visible duration at 1500 milliseconds or less measured from navigation start, and SHALL keep the Route's main content present in the document during that time.
9. IF client-side JavaScript is disabled or fails to execute on a Route, THEN THE Site SHALL display that Route's main content readable and scrollable, with no preloader overlay obscuring it and no dependency on the custom cursor or smooth-scroll components.
10. THE Site SHALL send on every Route response a `Strict-Transport-Security` header with a `max-age` of at least 31536000 seconds, an `X-Content-Type-Options` header with the value `nosniff`, and a `Referrer-Policy` header with the value `strict-origin-when-cross-origin`.
11. THE Site SHALL serve every remote SVG asset either with SVG rendering disabled in the Next.js image configuration or through a sanitising step that strips script and event-handler content, so that no unsanitised remote SVG is rendered inline.

### Requirement 12: Content and Keyword Architecture for AI Agency Positioning

**User Story:** As the owner of Blogspage, I want the site's page inventory and copy to target the searches an AI-agency buyer actually types, so that the site ranks for the services it sells.

#### Acceptance Criteria

1. THE Audit_Report SHALL include a keyword map that assigns to each Indexable_Route exactly one primary keyword phrase of between 2 and 8 words and 60 characters or fewer, recorded alongside that Route's absolute URL.
2. THE Audit_Report SHALL record, for each of the ten entries in the Service_Catalog, the absolute URL of the Route that targets that service and the primary keyword phrase assigned to that Route.
3. THE Site SHALL serve one service Route for each of AI automation, AI sales agents, custom SaaS development, and programmatic SEO, each returning HTTP 200 as an Indexable_Route and rendering its assigned primary keyword phrase in its single `<h1>` element.
4. THE Site SHALL render, within the `<h1>` or the first rendered paragraph of the `/` Route, one sentence that contains both the name `Blogspage` and the phrase `AI agency`, present in the server-rendered HTML response.
5. THE Metadata_Layer SHALL emit, for every Indexable_Route, a `title` that contains verbatim the primary keyword phrase assigned to that Route in the keyword map, within the 70-character limit defined in Requirement 4.
6. THE Audit_Report SHALL assign each primary keyword phrase to at most one Indexable_Route, comparing phrases without regard to letter case or surrounding whitespace.
7. WHERE a Route's slug carries a city token from the Approved_City_List, THE Site SHALL render the display name of that city at least once in the Route's `<h1>`, at least once in the Route's meta description, and at least twice in the Route's rendered body text.
8. IF the keyword map assigns no primary keyword phrase to an Indexable_Route, or assigns the same phrase to two or more Indexable_Routes, THEN THE Audit_Report SHALL record a Finding of severity `high` that names each affected Route.
9. IF an entry in the Service_Catalog has no Route that targets it, THEN THE Audit_Report SHALL record a Finding of severity `high` that names that service entry.
10. THE Site SHALL list every service Route in `sitemap.xml` and SHALL link every service Route from the site navigation or the site footer.

### Requirement 13: SEO Regression Prevention

**User Story:** As the owner of Blogspage, I want the SEO fixes to stay fixed, so that a future change does not silently undo them.

#### Acceptance Criteria

1. THE SEO_Check_Suite SHALL assert, for every Route in its Route set, that the Route's emitted canonical URL is character-for-character equal to that Route's own absolute URL expressed with the `https` scheme, the `blogspage.com` host, no trailing slash, and no query parameters.
2. THE SEO_Check_Suite SHALL assert that every JSON-LD block emitted by a Route in its Route set parses as valid JSON and declares both an `@context` and an `@type` property.
3. THE SEO_Check_Suite SHALL assert that every URL referenced by Open Graph and Twitter card metadata on a Route in its Route set responds with HTTP 200 and a `Content-Type` value beginning `image/`.
4. THE SEO_Check_Suite SHALL assert that each Route in its Route set renders exactly one `<h1>` element containing at least one non-whitespace character.
5. THE SEO_Check_Suite SHALL assert that each Route in its Route set emits exactly one meta description whose length, measured after HTML entity decoding, falls between 120 and 160 characters inclusive.
6. THE SEO_Check_Suite SHALL assert that `/llms.txt`, `/robots.txt`, and `/sitemap.xml` each respond with HTTP 200 and a body of at least one non-whitespace character.
7. IF one or more assertions are violated, THEN THE SEO_Check_Suite SHALL exit with a non-zero status code and SHALL report, for each violation, the Route or file path under test, the name of the violated assertion, the expected value, and the observed value.
8. THE SEO_Check_Suite SHALL run as a single non-watch execution through an npm script recorded in `package.json`, evaluate the Site's production build served at a configurable base URL that defaults to the locally served production build, and terminate within 10 minutes.
9. WHEN the SEO_Check_Suite starts, THE SEO_Check_Suite SHALL derive its Route set from the URLs listed in `sitemap.xml` together with the `/` Route, and SHALL include at least one `/blogs/<slug>` Route and at least one `/solutions/<slug>` Route in that set.
10. IF a Route or referenced asset under test returns no response within 30 seconds, THEN THE SEO_Check_Suite SHALL record a failed assertion naming that Route or asset and the exceeded time limit, and SHALL continue evaluating the remaining Routes in its Route set.
11. THE SEO_Check_Suite SHALL assert that each Route in its Route set renders exactly one `<main>` element.
