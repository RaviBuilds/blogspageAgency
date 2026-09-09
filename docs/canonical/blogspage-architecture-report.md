# Blogspage AI — Architecture & Dependency Report

**Status: FINAL.** Analysis-only. No application code was modified to produce this report.

## Verification pass

Every load-bearing claim in this report was re-checked directly against source in a second reading, independent of the original analysis, rather than carried forward on trust.

**Confirmed accurate as originally written**: homepage section order and the server/client split (exactly 8 `"use client"` files in `src/components/home/`, matching §6), all three dead-code findings (`BusinessOutcomes`, `HotelHyderabadLanding`, `submitLead` each return only their own definition on a repo-wide importer search), the full anchor-ID contract including the two orphaned anchors, homepage metadata living in the root layout rather than `page.tsx`, all three cross-route shared dependencies, the entire programmatic-SEO slug engine including all ten slug templates character-for-character, the total absence of GA/GTM/Clarity/`useSearchParams`/`useReducedMotion` anywhere in `src/`, every stack version in §3, and §16's per-route breadcrumb claim (checked across all 13 `(site)` routes).

**Corrected during this pass**:

1. **The Hero `<h1>` opacity claim** (§7, §22, §23) — the report stated the headline renders at `opacity: 1` in server HTML. `globals.css` sets `.hero-word { opacity: 0 }` with `animation-fill-mode: both`, so it does not. This was not invented by the report: [`hero.tsx`](src/components/home/hero.tsx:16)'s own comment makes the same claim and the stylesheet contradicts it. **The stale code comment should be fixed in `hero.tsx` too, or it will keep misleading readers.**
2. **`niches.ts` characterized as framework-free** (§4) — it imports 10 runtime `lucide-react` components and carries no "pure module" comment.
3. **Missing dependency analysis** (§26) — a report titled "Architecture & Dependency Report" never examined `package.json` hygiene. Now added.

**Gaps closed rather than relabeled**: the original pass deferred contrast ratios, hand-rolled-button focus states, the chat input's accessible name, and `motion.header` semantics as unverified. All four are now measured or confirmed in §23. The contrast work surfaced the most actionable new finding in the report — the opacity-modifier failures — which was invisible while the ratios remained uncomputed.

**Deliberately left open**: runtime performance magnitudes, the composited LCP number, and gradient-backdrop contrast. These require live measurement, and §29's closing section states precisely why. Nothing was upgraded to "verified" without evidence.

# 1. Executive Summary

Blogspage is a Next.js 15 App Router site combining a marketing/agency homepage, a mature programmatic-SEO "solutions" system (10 verticals × approved cities, currently just Hyderabad), a Sanity-backed blog, a functioning AI sales-chat widget ("Sweety") with lead capture into Sanity, and a comprehensive hand-built SEO layer (metadata, JSON-LD, sitemap, robots, llms.txt, services.json, RSS feed). The SEO system is not a stub — it is the product of a completed remediation documented in `.kiro/specs/seo-audit-and-optimization/`, which raised an audited score from 3.0/10 to 8.6/10. Any homepage work must treat `src/lib/seo.ts`, `src/lib/structured-data.ts`, `src/lib/routes.ts`, `src/lib/niches.ts`, and `src/lib/cities.ts` as load-bearing infrastructure, not homepage-local code.

The homepage itself is a single server component (`src/app/(site)/page.tsx`) composing 10 section components, mixing server and client components, driven by Framer Motion for nearly all animation, Lenis for smooth scroll, and a custom cursor. Two components exist in the codebase but are never imported by any route (`BusinessOutcomes`, `HotelHyderabadLanding`), and one server action (`submitLead`) is defined but never called — the homepage's own `ContactForm` bypasses it entirely in favor of opening the AI chat widget.

Solution pages (the programmatic SEO output) link back into the homepage via hash anchors (`/#contact`, `/#process`, `/#services`, `/#models`), which means the homepage's section `id` attributes are part of the internal-linking contract, not just in-page UX — renaming or removing those anchors would break inbound links from every solution page.

# 2. Current Business Understanding

Confirmed from `BLOGSPAGE_AI_CONTEXT.md`, `src/lib/site.ts`, `src/lib/niches.ts`, `src/lib/services-catalog.ts`, and rendered copy:

- Brand: **Blogspage** (legal name), trading as "Blogspage AI" / "Blogspage Agency" in different surfaces (footer copyright says "Blogspage Agency"; NAP legal name is "Blogspage").
- Positioning in code: "senior product-engineering agency" building AI automation, AI sales agents, custom SaaS platforms, and programmatic SEO systems, shipping in a "10–15 day launch window," based in Hyderabad, India.
- Ten declared verticals (`src/lib/niches.ts` `NICHES`): Online Delivery, Hotel Booking, Pet Care, Consulting, Education, Gym & Fitness, Dental & Medical, E-commerce, SaaS Platforms, SEO Blogs.
- Four dedicated service lines exist as their own routes (`src/lib/service-routes.ts`): AI Workflow Automation, AI Sales Agent Development, Custom SaaS Development, Programmatic SEO.
- NAP (`src/lib/site.ts`): Ayodhya Nagar Colony, Mehdipatnam, Hyderabad, Telangana 500028, India. `FOUNDING_YEAR` is explicitly flagged in a code comment as an **unconfirmed placeholder (2024)** — a business fact the repository cannot verify.

# 3. Current Tech Stack

From `package.json`, `next.config.ts`, `tailwind.config.ts`, `vitest.config.ts`:

- **Framework**: Next.js 15.3.3 (App Router), React 19.1.0.
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`), `@tailwindcss/typography`, `class-variance-authority`, `tailwind-merge`.
- **Animation**: Framer Motion 12.40.0 (dominant), Lenis 1.1.18 (smooth scroll). No GSAP anywhere in the repo.
- **UI primitives**: shadcn/ui-style components (`components.json` present) — Button, Card, Input, Label, Textarea — built on Radix Slot + CVA.
- **CMS**: Sanity v3 (`sanity`, `next-sanity`, `@sanity/client`, `@sanity/image-url`), Studio mounted at `/studio`.
- **AI**: Vercel AI SDK (`ai` 6.0.205, `@ai-sdk/openai` 3.0.71, `@ai-sdk/react` 3.0.207), OpenAI `gpt-4o-mini` model.
- **Analytics**: `@vercel/analytics` only. No Google Analytics, GTM, or Clarity found anywhere in `src/`.
- **Testing**: Vitest 4.1.10, `fast-check` 4.9.0 for property-based tests, a separate `vitest.seo.config.ts` for a live-build SEO check suite (`seo:check` script runs `next build` first).
- **Images**: `next/image` with AVIF/WebP formats, remote pattern allow-listing only `cdn.sanity.io`, SVGs disallowed in the image loader.
- **Build-time codegen**: `scripts/gen-route-lastmod.mjs` runs as a `prebuild` step, writing `src/lib/route-lastmod.generated.json` from git commit timestamps (gitignored, regenerated every build).

# 4. Repository Architecture

Top-level layout:

```
src/app/                      Next.js App Router routes
  layout.tsx                  Root layout: <html>, fonts, metadataBase, <Analytics/>
  robots.ts, sitemap.ts        Crawl-layer route handlers
  llms.txt/route.ts, services.json/route.ts, feed.xml/route.ts, og/route.tsx
  api/chat/route.ts            AI chat streaming endpoint
  actions/leads.ts             Server action (UNUSED — see §26)
  (site)/                      Route group sharing Navbar/Footer/Preloader
    layout.tsx, page.tsx       Site shell, homepage
    about/, blogs/, contact/, services/[slug]/, solutions/, solutions/[slug]/,
    solutions/dental-clinic-website-packages/  Hand-built pricing sub-route
    privacy/, terms/
  studio/                      Sanity Studio mount
src/components/
  home/                        10 homepage section components + 1 unused
  layout/                      Navbar, Footer, SkipLink
  providers/                   ClientEnhancements, SmoothScroll
  seo/                         JsonLd, Breadcrumb
  solutions/                   Gym/Dental bespoke landings + generic SolutionTemplate
  booking/                     Provider-agnostic BookingCta
  blogs/, ui/                  Blog widgets, shadcn primitives
  chat-widget.tsx              "Sweety" AI chat UI (root-level, not in a subfolder)
src/lib/                       Pure, framework-free business/SEO logic (the "engine")
src/sanity/                    Sanity client, queries, schemas, Studio structure
tests/                         Unit, property-based, and live-build SEO check suites
scripts/                       Build-time codegen (route lastmod, OG default, hero trim)
vitest.config.ts               Default unit/property suite config
vitest.seo.config.ts           Separate live-build SEO check suite config (see §3)
.env.local                     Present locally; holds OPENAI_API_KEY / SANITY_WRITE_TOKEN
.kiro/specs/seo-audit-and-optimization/  Requirements/design/tasks/audit report for the SEO remediation
docs/                          Dental-solution-specific content/CRO/IA docs (not homepage-related)
```

Notable structural facts:

- `src/lib/*.ts` is _mostly_ framework-free ("pure module: no I/O, no React, no framework imports" appears as a comment convention across `site.ts`, `structured-data.ts`, `routes.ts`, `cities.ts`, `keyword-map.ts`, `featured-work-data.ts`, `service-routes.ts`, `rubric.ts`, `heading-slug.ts`, `sanity-image.ts`, and `booking.ts` with a `process.env` carve-out). This is the actual "engine" of the site and is heavily unit/property tested. **Two documented exceptions**: `seo.ts` imports `type Metadata` from `next` (type-only, so no runtime coupling), and **`niches.ts` is not framework-free at all** — it imports 10 runtime icon components from `lucide-react` and carries no "pure module" comment. That matters because `niches.ts` is the most widely shared module on the site: any consumer of `NICHES` (including `services.json` and `llms.txt` route handlers) transitively pulls in `lucide-react`.
- There is a duplicate, unused `src/public/` directory (with `gitnotes.txt` and duplicate images) sitting alongside the real `public/` — dead weight, not referenced by any import.
- Root-level loose scripts (`migrate.ts`, `sanitize-data.ts`, `diagnose-and-fix.ts`, `backfill-blog-meta.ts`, `seed-meta.ts`) are one-off Sanity content migration tools, not part of the running app.

# 5. Homepage Architecture

Root route resolution: `/` → `src/app/layout.tsx` (root, sets `<html>`, fonts, `metadataBase`, mounts `<Analytics/>`) → `src/app/(site)/layout.tsx` (site shell: `SkipLink`, `JsonLd` with `organizationNode()`, `Preloader`, `Navbar`, `<main id="main">`, `Footer`, `ClientEnhancements`) → `src/app/(site)/page.tsx` (the homepage itself).

`src/app/(site)/page.tsx` is a **server component**. It renders `<JsonLd nodes={[webSiteNode()]} />` plus ten sections in fixed order:

```
Hero → ServicesBento → BentoGrid → ComparisonSection → DeliveryModels →
ProcessTimeline → FeaturedWork → LatestBlogs → CtaSection → ContactForm
```

`ClientEnhancements` (mounted once in the site layout, not per-page) is a client component that defers mounting `SmoothScroll`, `CustomCursor`, and `ChatWidget` until `requestIdleCallback` (or a 1ms timeout fallback), so these three cross-cutting client features never block first paint/hydration.

# 6. Homepage Component Tree

```
RootLayout (src/app/layout.tsx) [server]
 └── SiteLayout (src/app/(site)/layout.tsx) [server]
      ├── SkipLink (src/components/layout/skip-link.tsx) [server]
      ├── JsonLd — organizationNode() (src/components/seo/json-ld.tsx) [server]
      ├── Preloader (src/components/ui/preloader.tsx) [client]
      ├── Navbar (src/components/layout/navbar.tsx) [client]
      ├── <main id="main">
      │    └── HomePage (src/app/(site)/page.tsx) [server]
      │         ├── JsonLd — webSiteNode() [server]
      │         ├── Hero (src/components/home/hero.tsx) [server]
      │         │    ├── KineticHeadline (inline, server, CSS-only animation)
      │         │    ├── HeroGradients (src/components/home/hero-ambient.tsx) [client]
      │         │    └── HeroTrustStrip (src/components/home/hero-ambient.tsx) [client]
      │         ├── ServicesBento (src/components/home/services-bento.tsx) [client]
      │         │    └── ServiceCard × 4 (inline)
      │         ├── BentoGrid (src/components/home/bento-grid.tsx) [client]
      │         │    └── NicheCard × 10 (inline, reads NICHES from src/lib/niches.ts)
      │         ├── ComparisonSection (src/components/home/comparison-section.tsx) [client]
      │         │    └── Card × 2 (src/components/ui/card.tsx)
      │         ├── DeliveryModels (src/components/home/delivery-models.tsx) [server]
      │         │    └── Card × 2, exports DELIVERY_MODELS (shared with /about)
      │         ├── ProcessTimeline (src/components/home/process-timeline.tsx) [client]
      │         │    ├── ScrollLine (inline, useScroll/useTransform)
      │         │    └── StepCard × 4 (inline)
      │         ├── FeaturedWork (src/components/home/featured-work.tsx) [client]
      │         │    ├── DesktopHorizontalScroll (pinned scroll, desktop only)
      │         │    └── MobileVerticalStack (mobile only)
      │         │    (both read `projects` from src/lib/featured-work-data.ts, shared with /about)
      │         ├── LatestBlogs (src/components/home/latest-blogs.tsx) [server, async]
      │         │    (fetches LATEST_POSTS_QUERY from Sanity)
      │         ├── CtaSection (src/components/home/cta-section.tsx) [client]
      │         │    ├── InfiniteMarquee (inline)
      │         │    └── MagneticButton (inline, dispatches "open-ai-chat" event)
      │         └── ContactForm (src/components/home/contact-form.tsx) [client]
      │              └── TypedLine (inline, terminal typing effect)
      ├── Footer (src/components/layout/footer.tsx) [client]
      └── ClientEnhancements (src/components/providers/client-enhancements.tsx) [client, idle-deferred]
           ├── SmoothScroll (src/components/providers/smooth-scroll.tsx) [client, renders null]
           ├── CustomCursor (src/components/ui/custom-cursor.tsx) [client]
           └── ChatWidget (src/components/chat-widget.tsx) [client]
```

`BusinessOutcomes` (`src/components/home/business-outcomes.tsx`) is fully built and styled identically to the other sections but is **not present in this tree** — confirmed via repo-wide search, it has zero importers.

# 7. Homepage Section-by-Section Analysis

### Hero — `src/components/home/hero.tsx`

1. File: `src/components/home/hero.tsx` (+ `hero-ambient.tsx` for client parts).
2. Component: `Hero` (default section), `KineticHeadline` (inline helper), `HeroGradients`/`HeroTrustStrip` (imported from `hero-ambient.tsx`).
3. Server/client: `Hero` itself is a **server component** — the `<h1>` and all its word `<span>`s are fully present in the server-rendered HTML, animated by a pure CSS keyframe (`.hero-word` in `globals.css`), not Framer Motion. `HeroGradients` and `HeroTrustStrip` are separate `"use client"` exports composed into the server tree. **Correction to a claim made in the source code itself**: `hero.tsx`'s own comment states the `<h1>` "is at `opacity: 1` in the server-rendered HTML," but `globals.css` defines `.hero-word { opacity: 0 }` with `animation: hero-word-reveal 0.6s ... both` and `animation-delay: calc(100ms + var(--word-index) * 80ms)`. Because `animation-fill-mode: both` holds the `from` state (`opacity: 0`) for the duration of the delay, **the headline text is not painted at full opacity on first paint** — the first word begins revealing at ~100ms and each subsequent word 80ms later. The text is in the DOM and fully crawlable (which is the crawlability half of F-12), and the animation is CSS-only so it does not wait on hydration, but "server-rendered at opacity 1" is not accurate. The code comment is stale relative to the stylesheet.
4. Purpose: primary above-the-fold value proposition and dual CTA.
5. Data source: hardcoded strings (`HEADLINE_LINES`, body copy, trust-strip logos array `["OpenAI","Vercel","Supabase","Next.js","Stripe"]`).
6. Props/dependencies: none external; imports `Button` (ui primitive) and `hero-ambient` exports.
7. Child components: `KineticHeadline`, `HeroGradients`, `HeroTrustStrip`.
8. Animation: CSS `@keyframes hero-word-reveal` per-word stagger (server-safe, respects `prefers-reduced-motion`); `HeroGradients`/`HeroTrustStrip` use Framer Motion (`whileInView`, infinite breathing blobs).
9. Interactive behaviour: none beyond the two CTA links.
10. CTA destinations: `#contact` ("Deploy your AI system"), `#models` ("See what we automate") — both same-page hash anchors.
11. Internal links: two in-page anchors only.
12. SEO relevance: the only `<h1>` on the homepage; the text being present in server HTML (rather than injected by client JS) is what satisfies the crawlability half of audit finding F-12. The LCP half is weaker than the audit implies — see item 3 above and §22.
13. Conversion relevance: primary CTA above the fold — highest-intent surface on the page.
14. Performance: `priority` + explicit `sizes` on the hero visual `<Image>`; ambient gradients and trust strip are client-only but non-blocking (separate export, mounted with the server tree, not idle-deferred like `ChatWidget`).
15. Shared dependencies: `Button` (`src/components/ui/button.tsx`) — global primitive.

### ServicesBento — `src/components/home/services-bento.tsx`

1–2. `src/components/home/services-bento.tsx`, exports `ServicesBento`, `ServiceCard` (inline). 3. Server/client: **fully client** (`"use client"` at file top) — uses `useRef`, mouse-tracked spotlight, Framer Motion stagger. 4. Purpose: "Core Capabilities" 4-card bento (AI agents, workflow automation, SaaS development, programmatic SEO). 5. Data source: hardcoded `services` array in-file. 6. Props: none (no external data). 7. Children: `ServiceCard` × 4. 8. Animation: Framer Motion `whileInView` stagger + hover spotlight via CSS custom properties (`--x`/`--y`) updated on `onMouseMove`. 9. Interactive: mouse-tracked radial glow per card; `whileHover={{ scale: 1.015 }}`. 10. CTA: none — purely informational, no links. 11. Internal links: none. 12. SEO relevance: `<h2>` heading text carries positioning copy ("AI-powered systems that sell, qualify, and operate"); no links to crawl. 13. Conversion relevance: medium — reinforces the AI-agency/product-engineering positioning right after the hero, but has zero click targets. 14. Performance: `onMouseMove` listener per card is lightweight (only sets CSS vars, no re-render). 15. Shared: `cn` utility (`src/lib/utils.ts`) — global.

### BentoGrid — `src/components/home/bento-grid.tsx`

1–2. `src/components/home/bento-grid.tsx`, exports `BentoGrid`, `NicheCard` (inline). 3. Server/client: **fully client**. 4. Purpose: "Ten industries. One engineering standard." — one card per vertical, linking into the programmatic SEO solution pages. 5. Data source: **`NICHES` from `src/lib/niches.ts`** — this is the single most important shared dependency on the homepage; it is the exact same array that drives `/solutions`, `/solutions/[slug]`, `services.json`, and `llms.txt`. 6. Props: none; reads `NICHES` directly at module scope. 7. Children: `NicheCard` × 10 (one per niche). 8. Animation: Framer Motion stagger (`gridVariants`/`cardVariants`), `MotionLink = motion.create(Link)` so routing and motion compose on one element. 9. Interactive: same mouse-tracked spotlight pattern as `ServicesBento`; featured niches get extra decorative watermark layers. 10. CTA destinations: `niche.href()` → `/solutions/<slug>` for the default city (`hyderabad`), one per niche — **10 real internal links into the programmatic SEO system**. 11. Internal links: 10, all outbound to `/solutions/*`. 12. SEO relevance: **high** — this is the homepage's primary internal-linking bridge into the entire programmatic SEO route set. Removing or restructuring it changes how PageRank/crawl paths flow from the homepage into every solution page. 13. Conversion relevance: high — visitors self-select their vertical here. 14. Performance: 10 `motion.create(Link)` elements each with hover listeners; acceptable at this scale. 15. Shared dependencies: `NICHES` (`src/lib/niches.ts`) — **do not touch during homepage-only work**; used by 4+ other routes/files.

### ComparisonSection — `src/components/home/comparison-section.tsx`

1–2. `src/components/home/comparison-section.tsx`, exports `ComparisonSection`. 3. Server/client: **fully client**. 4. Purpose: "Static Sites vs. Intelligent Systems" — freelancer-pain-points vs. agency-advantages two-card comparison. 5. Data source: hardcoded `freelancerPainPoints`/`agencyAdvantages` arrays. 6. Props: none. 7. Children: `Card`/`CardHeader`/`CardContent` (ui primitives) × 2. 8. Animation: Framer Motion stagger fade-up, `whileInView`. 9. Interactive: none (no hover/click targets beyond ambient hover on Card via CSS). 10. CTA: none. 11. Internal links: none. 12. SEO relevance: differentiation copy ("A website that looks good isn't the same as a system that sells") — useful for on-page keyword/positioning signals, no structured data. 13. Conversion relevance: medium — objection-handling/differentiation content, no direct CTA. 14. Performance: lightweight, no images. 15. Shared: `Card` family (`src/components/ui/card.tsx`) — global primitive, used across homepage, solutions, blogs.

### DeliveryModels — `src/components/home/delivery-models.tsx`

1–2. `src/components/home/delivery-models.tsx`, exports `DeliveryModels` **and `DELIVERY_MODELS`** (named data export). 3. Server/client: **server component** (no `"use client"`, no hooks). 4. Purpose: "How we work with you" — SaaS MVP Launch vs. Custom Enterprise System engagement models. 5. Data source: hardcoded `DELIVERY_MODELS` array, explicitly exported so `/about` can render "the same two named delivery models without keeping a separate, driftable copy" (per in-file comment) — **confirmed shared**: `src/app/(site)/about/page.tsx` imports `DELIVERY_MODELS` from this file. 6. Props: none. 7. Children: `Card` family, `Button`. 8. Animation: none — pure CSS hover transitions (`group-hover:opacity-100`), no Framer Motion. 9. Interactive: hover-only border/glow reveal via CSS. 10. CTA destination: both cards' "Discuss this model" button → `#contact`. 11. Internal links: 2, both to the homepage's own contact anchor. 12. SEO relevance: low direct SEO value, but the shared `DELIVERY_MODELS` export means **this file is not homepage-exclusive** — editing it changes `/about` too. 13. Conversion relevance: medium — clarifies engagement structure before the CTA sections later on the page. 14. Performance: server-rendered, zero client JS cost. 15. Shared dependencies: **`DELIVERY_MODELS` export consumed by `/about`** — flag as shared, not homepage-only.

### ProcessTimeline — `src/components/home/process-timeline.tsx`

1–2. `src/components/home/process-timeline.tsx`, exports `ProcessTimeline`; inline `StepCard`, `ScrollLine`. 3. Server/client: **fully client**. 4. Purpose: "Engineered like an elite product team" — 4-phase process timeline. 5. Data source: hardcoded `steps` array. 6. Props: none. 7. Children: `StepCard` × 4, `ScrollLine` (SVG). 8. Animation: Framer Motion `whileInView` per step + a scroll-driven SVG line using `useScroll`/`useTransform` mapped to `pathLength`. 9. Interactive: none beyond scroll-triggered reveal. 10. CTA: none directly, but `id="process"` is the anchor target referenced by the navbar ("Process" link → `/#process`) **and by solution pages** (`gym-solution-landing.tsx`, `solution-template.tsx` both link to `/#process` as a secondary CTA — "See our process"). 11. Internal links: none outbound; is itself an inbound anchor target from solutions pages. 12. SEO relevance: the `id="process"` anchor is part of the internal-linking contract with programmatic SEO pages — **do not remove/rename without checking inbound solution-page links**. 13. Conversion relevance: medium — builds trust/process transparency before asking for the sale. 14. Performance: `useScroll` with a `target` ref triggers scroll listeners; moderate cost, standard Framer Motion pattern. 15. Shared: the `id="process"` DOM anchor is a cross-route dependency (see §19 Internal Linking).

### FeaturedWork — `src/components/home/featured-work.tsx`

1–2. `src/components/home/featured-work.tsx`, exports `FeaturedWork` (wraps `MobileVerticalStack` + `DesktopHorizontalScroll`). 3. Server/client: **fully client**. 4. Purpose: "Proof, not promises" — portfolio/case-study showcase (4 real projects: Phixl AI, NextInn, ArogyaDiet, Best100Movies). 5. Data source: **`projects` from `src/lib/featured-work-data.ts`** — a plain non-client module, explicitly split out so `/about` can import the same array from a server component (confirmed: `src/app/(site)/about/page.tsx` imports `projects` and slices it). 6. Props: none; reads module-scope data. 7. Children: `DesktopCard`/`BrowserChrome`/`TechPills`/`MetricLine` (inline, desktop); separate mobile card markup (inline, mobile). 8. Animation: desktop uses a **pinned horizontal-scroll** section (`h-[400vh]` sticky container, `useScroll`+`useTransform` driving `translateX`); mobile uses a simpler vertical stagger reveal. This is the most performance-intensive homepage section. 9. Interactive: hover "muted reveal" filter transition on project screenshots (grayscale/brightness fade-in on hover). 10. CTA: none directly (no explicit "view project" links) — purely visual proof. 11. Internal links: none. 12. SEO relevance: each project has a `metrics` array explicitly labeled "estimated" (never "measured") — a deliberate honesty constraint noted in code comments to avoid false measured-metric claims. 13. Conversion relevance: high — social proof section directly before the final CTA/contact sections. 14. Performance: **flagged risk** — `h-[400vh]` desktop section with 4 full-bleed `next/image` renders and continuous scroll-linked transforms; the single largest client-side layout/animation cost on the homepage. Mobile variant avoids the pinned-scroll cost. 15. Shared dependencies: **`projects` array (`src/lib/featured-work-data.ts`) consumed by `/about`** — shared, not homepage-only.

### LatestBlogs — `src/components/home/latest-blogs.tsx`

1–2. `src/components/home/latest-blogs.tsx`, exports async `LatestBlogs`. 3. Server/client: **async server component** — the only homepage section that performs data fetching. 4. Purpose: "Journal" — latest 3 blog posts. 5. Data source: **Sanity**, via `client.fetch(LATEST_POSTS_QUERY)` (`src/sanity/lib/client.ts`, `src/sanity/lib/queries.ts`). Returns `null` (renders nothing) if zero posts exist. 6. Props: none. 7. Children: none (inline `<li>` rendering). 8. Animation: none — plain CSS `hover:scale-[1.02]` transition. 9. Interactive: hover-scale on each card link. 10. CTA destinations: each post title → `/blogs/<slug>`; header "View all articles" → `/blogs`. 11. Internal links: up to 4 (3 posts + index link). 12. SEO relevance: this is a **live Sanity dependency on the homepage** — if Sanity is unreachable or has zero posts, the section silently disappears (no error boundary/fallback UI beyond returning `null`). 13. Conversion relevance: low-medium — content marketing surface, not a direct CTA. 14. Performance: one Sanity fetch on every homepage request/revalidation; no explicit `revalidate` set in this file (relies on Next.js default fetch caching behavior for the Sanity client). 15. Shared dependencies: `LATEST_POSTS_QUERY` (`src/sanity/lib/queries.ts`) — **this exact query is also fetched by `src/app/(site)/solutions/[slug]/page.tsx`** for the "related posts" fallback on every solution page. Editing this query changes solution-page content too.

### CtaSection — `src/components/home/cta-section.tsx`

1–2. `src/components/home/cta-section.tsx`, exports `CtaSection`; inline `InfiniteMarquee`, `MagneticButton`. 3. Server/client: **fully client**. 4. Purpose: "Ready to scale without the headcount?" — immersive full-bleed CTA before the final contact section. 5. Data source: hardcoded copy. 6. Props: none. 7. Children: `InfiniteMarquee`, `MagneticButton`. 8. Animation: infinite horizontal marquee (`animate={{x:["0%","-50%"]}}`, 30s linear loop, `repeat: Infinity`); magnetic button uses `useMotionValue`+`useSpring` for cursor-following pull. 9. Interactive: `MagneticButton.onClick` dispatches `window.dispatchEvent(new Event("open-ai-chat"))` — **opens the AI chat widget**, not a navigation. 10. CTA destination: the AI chat widget (in-page overlay), not a route. 11. Internal links: none (the CTA is a JS event, not an `<a>`/`<Link>`). 12. SEO relevance: none (button, not a crawlable link); marquee text is decorative, `WebkitTextStroke` transparent fill — not meaningfully indexable content. 13. Conversion relevance: **highest-intent CTA on the page** — directly routes into the AI sales agent conversation. 14. Performance: `repeat: Infinity` marquee animation runs continuously once mounted — a permanent, uninterruptible animation loop for as long as the section is in the viewport (no `whileInView` gate on the marquee itself, unlike the text content above it). 15. Shared: none beyond the global `open-ai-chat` event contract (see §9).

### ContactForm — `src/components/home/contact-form.tsx`

1–2. `src/components/home/contact-form.tsx`, exports `ContactForm` (accepts optional unused `source` prop). 3. Server/client: **fully client**. 4. Purpose: "Your AI system is one conversation away" — a fake-terminal UI that leads to opening the chat, styled as a CLI boot sequence. 5. Data source: hardcoded terminal script lines with staggered typing effect (`TypedLine`). 6. Props: `source?: string` — **accepted but never read/used in the component body** (dead prop). 7. Children: `TypedLine` (inline). 8. Animation: Framer Motion stagger fade-up + custom `setInterval`-driven character-by-character typing effect (not Framer Motion — plain React state/`setInterval`). 9. Interactive: "Initialize System" button dispatches `open-ai-chat` — **same event contract as the CTA section's magnetic button**. 10. CTA destination: AI chat widget overlay. 11. Internal links: none. 12. SEO relevance: none directly; section has `id="contact"` — **the primary inbound anchor target referenced by the navbar, hero, delivery models, and every solution page's CTA**. 13. Conversion relevance: **critical** — this is the terminus of the entire homepage funnel and the landing point for every solution-page CTA (`/#contact?niche=<id>&city=<token>`). 14. Performance: multiple `setInterval` timers for the typing effect (4 lines × individual timers) — cleaned up on unmount, low but non-zero cost. 15. Shared: **`id="contact"` DOM anchor is the single most load-bearing internal-linking dependency on the homepage** — referenced from Navbar, Hero, DeliveryModels, and every `/solutions/*` and `/solutions/[slug]` CTA. There is no actual query-param handling for `?niche=`/`?city=` in this component — those params are appended by solution pages but **silently ignored** by `ContactForm` (confirmed: no `useSearchParams` or param-reading code in this file). This is a real UX/tracking gap: a visitor arriving from a gym-solution CTA sees a generic terminal, not a niche-aware message.

Note: the site never used a native `<form>`/`submitLead` server action on the homepage. `ContactForm`'s name is legacy/aspirational — it is purely a chat-launch trigger. The actual lead-capture path is exclusively through the AI chat tool call (see §9, §10).

# 8. Homepage Data Flow

| Section                      | Data source                                                        | Classification                                |
| ---------------------------- | ------------------------------------------------------------------ | --------------------------------------------- |
| Hero                         | hardcoded strings + `/hero-visual.png` static asset                | STATIC                                        |
| ServicesBento                | hardcoded `services` array                                         | STATIC                                        |
| BentoGrid                    | `NICHES` (`src/lib/niches.ts`)                                     | DERIVED (shared code module, not per-request) |
| ComparisonSection            | hardcoded arrays                                                   | STATIC                                        |
| DeliveryModels               | `DELIVERY_MODELS` (exported, shared with `/about`)                 | STATIC (shared)                               |
| ProcessTimeline              | hardcoded `steps` array                                            | STATIC                                        |
| FeaturedWork                 | `projects` (`src/lib/featured-work-data.ts`, shared with `/about`) | STATIC (shared)                               |
| LatestBlogs                  | Sanity `LATEST_POSTS_QUERY`                                        | SANITY (live fetch)                           |
| CtaSection                   | hardcoded copy                                                     | STATIC                                        |
| ContactForm                  | hardcoded terminal script                                          | STATIC                                        |
| Organization/WebSite JSON-LD | `src/lib/structured-data.ts` + `src/lib/site.ts` constants         | DERIVED                                       |

Only **one** homepage section performs live I/O: `LatestBlogs`. Everything else is either hardcoded copy or derived from statically-imported code modules (`NICHES`, `DELIVERY_MODELS`, `projects`) evaluated at build/render time, not fetched from an external API or database at request time. There is no client-side data fetching (no SWR/React Query/`useEffect`+`fetch` pattern) anywhere in the homepage tree.

# 9. CTA / Conversion Architecture

Every conversion point on the homepage, traced to its actual destination:

| CTA                                                  | Component               | Route/Action                           | Destination                                                                            | Purpose                                     |
| ---------------------------------------------------- | ----------------------- | -------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------- |
| Navbar "Start a Project"                             | `Navbar`                | `window.dispatchEvent("open-ai-chat")` | Opens `ChatWidget` overlay                                                             | Primary nav CTA                             |
| Navbar logo                                          | `Navbar`                | `<Link href="/">`                      | Homepage                                                                               | Brand nav                                   |
| Hero "Deploy your AI system"                         | `Hero`                  | `<Link href="#contact">`               | Same-page anchor → `ContactForm`                                                       | Primary hero CTA                            |
| Hero "See what we automate"                          | `Hero`                  | `<Link href="#models">`                | Same-page anchor → `DeliveryModels`                                                    | Secondary hero CTA                          |
| DeliveryModels × 2 "Discuss this model"              | `DeliveryModels`        | `<Link href="#contact">`               | Same-page anchor                                                                       | Mid-page CTA                                |
| BentoGrid × 10 "View solution"                       | `BentoGrid`/`NicheCard` | `<Link href={niche.href()}>`           | `/solutions/<slug>` (real route)                                                       | Vertical selection → programmatic SEO page  |
| CtaSection "Deploy Your AI System" (magnetic button) | `CtaSection`            | `window.dispatchEvent("open-ai-chat")` | Opens `ChatWidget` overlay                                                             | Highest-intent CTA                          |
| ContactForm "Initialize System"                      | `ContactForm`           | `window.dispatchEvent("open-ai-chat")` | Opens `ChatWidget` overlay                                                             | Funnel terminus                             |
| Footer link columns                                  | `Footer`                | `serviceRoutes()`, static links        | `/services/<slug>`, `/about`, `/solutions`, `/blogs`, `/contact`, `/privacy`, `/terms` | Sitewide navigation                         |
| Footer social icons                                  | `Footer`                | `SOCIAL_PROFILES` (`src/lib/site.ts`)  | External X/GitHub/LinkedIn                                                             | Trust/authority signal                      |
| AI Chat widget (floating button)                     | `ChatWidget`            | Toggles overlay open/closed            | In-page chat UI                                                                        | Persistent conversion surface on every page |
| AI Chat "quick replies"                              | `ChatWidget`            | `sendMessage({text})` → `/api/chat`    | Streams model response                                                                 | Low-friction conversation starter           |

**No phone/WhatsApp/booking CTA exists on the homepage.** Confirmed via repo-wide search: `tel:` and `mailto:` links exist only via `NAP.telephoneHref`/`NAP.emailHref` (`src/lib/site.ts`), rendered on `/contact`, `/privacy`, `/terms`, and inside `Organization`/`LocalBusiness` JSON-LD — **never rendered as visible UI on the homepage**. `BookingCta` (`src/components/booking/booking-cta.tsx`) is used extensively on the dental/gym solution pages but is **never imported by any homepage section**.

**The current homepage conversion funnel is unusually narrow**: every CTA funnels into exactly one of two outcomes — (a) a same-page scroll to `#contact`, or (b) directly dispatching `open-ai-chat`. There is no lead-capture `<form>`, no email-only opt-in, no phone number, no WhatsApp link, and no calendar/booking embed anywhere on the homepage. The AI chat is the sole lead-capture mechanism site-wide from the homepage's perspective.

# 10. AI Chat / Sales Agent Architecture

**Entry point**: `ChatWidget` (`src/components/chat-widget.tsx`), mounted globally via `ClientEnhancements` in the site layout (idle-deferred), present on every page, not homepage-specific. Opens via (a) its own floating button, or (b) any component dispatching `window.dispatchEvent(new Event("open-ai-chat"))` — a global custom-event contract with dispatch sites in homepage (`CtaSection`, `ContactForm`), `Navbar`, and `contact-chat-trigger.tsx` (`/contact` page).

**Client/server architecture**: Client — `ChatWidget` uses `useChat` from `@ai-sdk/react` for message state/streaming via `sendMessage`/`status`. Server — `src/app/api/chat/route.ts`, a `force-dynamic` Route Handler.

**Model provider**: OpenAI via `@ai-sdk/openai`'s `createOpenAI`, model `gpt-4o-mini`, requires `OPENAI_API_KEY` (returns HTTP 500 with a clear error if missing).

**System prompt**: names the agent "Sweety," an "AI SDR," built from `AGENCY_OVERVIEW` + `renderServiceCatalog()` (`src/lib/services-catalog.ts` — a plain-text mirror of `NICHES`, kept **manually** in sync per its own file comment). The prompt encodes a strict 3-step flow (greet → qualify → collect contact details) and hard rules against inventing/guessing contact details or calling the lead-save tool prematurely.

**Context/data source**: `AGENCY_OVERVIEW` (static) + `renderServiceCatalog()` (static, from a **separate, hand-maintained catalog**, not the same object as `NICHES`) — a documented drift risk (see §26).

**Qualification flow**: enforced entirely through system-prompt instructions (no code-level state machine).

**Lead capture**: a `save_lead` tool (Vercel AI SDK `tool()`), strict Zod schema requiring a real name and valid email; phone/business/industry/goal optional. The tool's `execute` re-validates defensively even though the schema already enforces the same checks.

**Booking flow**: none — the prompt explicitly forbids claiming a call was booked; only promises "reach out within one business day."

**Handoff behaviour**: no live-agent handoff exists; fully autonomous, no escalation path to a human mid-conversation.

**Error handling**: `onError` in `toUIMessageStreamResponse` logs and streams error text; outer `try/catch` returns HTTP 500 on unhandled exceptions; missing API key returns 500 before any model call.

**Storage**: `recordLead()` in `src/lib/lead-store.ts` (`import "server-only"`) writes a `lead` document to Sanity via `writeClient` (requires `SANITY_WRITE_TOKEN`). **Graceful degradation**: without the token it logs to console instead of persisting and still returns `{success: true, persisted: false}` — the chat UI shows a success confirmation even when nothing was saved, in a deployment missing that env var.

**Analytics/events**: none — no chat-open/message/lead-captured events wired to any analytics tool.

**External integrations**: OpenAI (model), Sanity (lead storage). No CRM, no Slack/email notification, no WhatsApp integration despite being described hypothetically in `service-routes.ts` copy.

**Shared with**: `/contact` page, `Navbar` (every page), and is the terminus of every homepage CTA — a fully global, cross-cutting component, not homepage-specific despite being central to the homepage funnel.

# 11. Programmatic SEO Architecture

The programmatic solution system is a deterministic **cross product** of two catalogs:

- **Niche catalog**: `NICHES` in `src/lib/niches.ts` — 10 verticals, each a `NicheSeed` object with `id`, `title`, `description`, `focus`, `icon`, `slugTemplate` (containing a literal `[city]` token), `seoLabel`, `hero`, `problem`, `solution`, `dashboards`, `faq` (≥3 pairs), plus enrichment (`metrics`, `launchSchedule`, `caseStudy`) merged in from separate `NICHE_ENRICHMENT`/`NICHE_CASE_STUDIES` maps at module scope.
- **City catalog**: `APPROVED_CITIES` in `src/lib/cities.ts` — currently a single entry, `{ token: "hyderabad", displayName: "Hyderabad" }`. Bounded to 1–50 entries by a module-load invariant check (throws at import time if violated).

**Slug creation**: each niche's `slugTemplate` (e.g. `"gym-business-solution-website-at-[city]"`) has `[city]` replaced with a city token, then the whole string is run through `slugify()` (lowercase, strip non-alphanumerics, collapse to hyphens). `nicheSlug(niche, city)` performs this. `allNicheParams()` (in `niches.ts`) computes the full cross product: 10 niches × 1 city = **10 solution routes today**; adding a second approved city would produce 20 automatically.

**Slug resolution**: `resolveSolutionSlug(slug)` (in `niches.ts`) does the reverse — for each niche, it builds a regex from the template's literal prefix/suffix around `[city]` (escaping regex metacharacters, constraining the captured city segment to `[a-z0-9-]+`), tests the incoming slug, and if a niche template matches, looks up the captured city token in `findApprovedCity()`. **A template match with an unapproved city token returns `null`** (404) rather than falling through — this is the exact fix for a documented pre-remediation vulnerability (audit Finding F-01) where any arbitrary city string produced a live, indexable page.

**Dynamic route**: `src/app/(site)/solutions/[slug]/page.tsx`. `export const dynamicParams = false` plus `generateStaticParams() { return allNicheParams(); }` means **the generated set is the entire served route space** — any slug outside it 404s at the Next.js routing layer before the page module's own code runs.

**Metadata**: `generateMetadata()` in the page calls `getNicheBySlug(slug)` (alias of `resolveSolutionSlug`), builds a title via a bespoke `solutionTitle()` helper (keeps titles inside the 30–70 char bound, avoids duplicating the niche label when the keyword phrase already contains it), and a description via `clampDescription()` — then delegates to the shared `buildMetadata()` factory in `src/lib/seo.ts`.

**Structured data**: the page emits a `Service` node (`serviceNode()` from `src/lib/structured-data.ts`) with `areaServed` set to the resolved city's display name, plus a `FAQPage` node (`faqNode()`) gated on `MIN_SOLUTION_FAQ_PAIRS` (3) — if a niche has fewer than 3 usable FAQ pairs, no `FAQPage` node is emitted at all. The site-wide `Organization` node is already emitted once by the shared `(site)/layout.tsx`, not duplicated per solution page.

**Breadcrumb**: `<Breadcrumb trail={[{name:"Solutions",path:"/solutions"},{name:`${niche.title} in ${city.displayName}`,path:`/solutions/${slug}`}]} />` — renders both the visible trail and a matching `BreadcrumbList` JSON-LD node from the same array, so they cannot drift.

**Body content / rendering strategy**: the page branches on `niche.id`:

- `"gym-fitness"` → bespoke `GymSolutionLanding` component (its own hero, ecosystem sections, headings sourced from `gym-landing-headings.ts`).
- `"dental-medical"` → bespoke `DentalSolutionLanding` component (own headings file, own pricing sub-route at `/solutions/dental-clinic-website-packages`).
- every other niche (8 of 10) → the **generic** `SolutionTemplate` component, which renders the niche's `hero`/`problem`/`solution`/`dashboards`/`metrics`/`launchSchedule`/`caseStudy` fields directly from the `Niche` object.

**Internal links**: each solution page's CTAs link to `/#contact?niche=<id>&city=<token>` and `/#process` (homepage anchors) and `/solutions` ("View all solutions"); the gym/dental bespoke pages also link to `/blogs/<slug>` for related-posts fallback content (same `LATEST_POSTS_QUERY` the homepage uses).

**CTA**: "Start a Project"/"Start your project"/"Book an architecture review" buttons — all point at the homepage contact anchor with query params that, as noted in §7, `ContactForm` does not actually read.

**Sitemap inclusion**: `solutionRoutes()` (`src/lib/routes.ts`) generates one `RouteDescriptor` per resolved slug from `allNicheParams()`, consumed directly by `src/app/sitemap.ts`'s `ALL_ROUTES` export — every generated solution URL is automatically in the sitemap with no separate list to maintain.

# 12. Complete Gym Solution Route Lifecycle

Tracing `/solutions/gym-business-solution-website-at-hyderabad` end to end:

1. **Browser request** → Next.js resolves the dynamic segment `src/app/(site)/solutions/[slug]/page.tsx` with `slug = "gym-business-solution-website-at-hyderabad"`.
2. **Static params check**: because `dynamicParams = false`, Next.js first checks this slug against the set returned by `generateStaticParams()` → `allNicheParams()` (`src/lib/niches.ts`). The gym niche's `nicheSlug()` for `hyderabad` produces exactly this string, so it is a valid pre-generated static path.
3. **Slug extraction**: the page component receives `params: Promise<{slug}>`, awaited to get the raw string.
4. **Slug resolver**: `getNicheBySlug(slug)` → `resolveSolutionSlug(slug)` iterates `NICHE_SLUG_MATCHERS`, finds the gym niche's regex matches, captures `"hyderabad"`.
5. **Niche lookup**: the matched niche object (`id: "gym-fitness"`) is returned directly — no separate lookup step, resolution and lookup are the same operation.
6. **City lookup**: `findApprovedCity("hyderabad")` returns `{token:"hyderabad", displayName:"Hyderabad"}` from `APPROVED_CITIES`.
7. **Content/data**: the `Niche` object for gym-fitness carries `hero`, `problem`, `solution`, `dashboards`, `metrics`, `launchSchedule`, `caseStudy`, `faq` — all hardcoded in `niches.ts`/enrichment maps, no external fetch.
8. **Page component**: `SolutionPage` branches — `niche.id === "gym-fitness"` is true, so it renders `<GymSolutionLanding cityLabel="Hyderabad" faq={niche.faq} headingIds={gymHeadingIds(slugger)} relatedPosts={relatedPosts} />` instead of the generic `SolutionTemplate`.
9. **Metadata**: `generateMetadata()` runs independently, producing title `"gym management software hyderabad"` (from `KEYWORD_MAP`), description built from `niche.hero.subhead` + `niche.seoLabel` via `clampDescription()`, then `buildMetadata()` assembles the full `Metadata` object (canonical, OG, Twitter, robots).
10. **JSON-LD**: `serviceNode({id:"gym-fitness", name:"Gym & Fitness", description: niche.description}, {areaServed:["Hyderabad"], url:"/solutions/gym-business-solution-website-at-hyderabad"})` plus `faqNode(niche.faq, {minPairs:3})` (gym has ≥3 FAQ pairs, so this node is emitted).
11. **Breadcrumb**: `<Breadcrumb trail={[{name:"Solutions",path:"/solutions"},{name:"Gym & Fitness in Hyderabad",path:"/solutions/gym-business-solution-website-at-hyderabad"}]} />` renders visible trail + `BreadcrumbList` node.
12. **Body content**: `GymSolutionLanding` renders its own hero (kinetic word-reveal headline "The AI-Powered Operating System for Elite Fitness Clubs in Hyderabad."), ecosystem sections, and a related-posts block using `relatedPosts` (fetched via `LATEST_POSTS_QUERY` in the parent page, with a try/catch that falls back to `[]` on Sanity failure).
13. **Internal links**: hero CTAs → `/#contact?niche=gym-fitness` and `#ecosystem` (in-page); a later CTA → `/#process`; related-posts → `/blogs/<slug>`.
14. **Sitemap**: `solutionRoutes()` includes this exact path (derived from the same `allNicheParams()` the static-params generator uses), so `src/app/sitemap.ts` lists it with `changeFrequency: "monthly"`, `priority: 0.7`.
15. **Robots/crawl system**: `src/app/robots.ts` allows `/` broadly (disallows only `/studio`), so this route is crawlable by both general and the six named AI crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended).

Files/functions involved: `src/app/(site)/solutions/[slug]/page.tsx`, `src/lib/niches.ts` (`resolveSolutionSlug`, `getNicheBySlug`, `allNicheParams`, `NICHES`), `src/lib/cities.ts` (`findApprovedCity`, `APPROVED_CITIES`), `src/lib/seo.ts` (`buildMetadata`, `clampDescription`), `src/lib/keyword-map.ts` (`findKeywordPhrase`), `src/lib/structured-data.ts` (`serviceNode`, `faqNode`), `src/lib/heading-slug.ts` (`createHeadingSlugger`), `src/components/solutions/gym-solution-landing.tsx`, `src/components/solutions/gym-landing-headings.ts`, `src/components/seo/breadcrumb.tsx`, `src/components/seo/json-ld.tsx`, `src/lib/routes.ts` (`solutionRoutes`), `src/app/sitemap.ts`, `src/app/robots.ts`.

# 13. Programmatic SEO Route Matrix

| Vertical         | Route (Hyderabad)                                                        | Slug source              | City source | Primary keyword                                 | Route component                                           | Metadata source             | Schema source           | Internal-link source                               | Sitemap source                 |
| ---------------- | ------------------------------------------------------------------------ | ------------------------ | ----------- | ----------------------------------------------- | --------------------------------------------------------- | --------------------------- | ----------------------- | -------------------------------------------------- | ------------------------------ |
| Online Delivery  | `/solutions/online-delivery-business-solution-website-at-hyderabad`      | `niches.ts` slugTemplate | `cities.ts` | "online delivery app development hyderabad"     | `SolutionTemplate`                                        | `keyword-map.ts` + `seo.ts` | `serviceNode`+`faqNode` | homepage `#contact`/`#process`, `/solutions`       | `routes.ts` `solutionRoutes()` |
| Hotel Booking    | `/solutions/hotel-booking-business-solution-website-at-hyderabad`        | same                     | same        | "hotel booking website development hyderabad"   | `SolutionTemplate`                                        | same                        | same                    | same                                               | same                           |
| Pet Care         | `/solutions/pet-cares-online-business-solution-website-at-hyderabad`     | same                     | same        | "pet care booking software hyderabad"           | `SolutionTemplate`                                        | same                        | same                    | same                                               | same                           |
| Consulting       | `/solutions/consulting-firm-business-solution-website-at-hyderabad`      | same                     | same        | "consulting firm website development hyderabad" | `SolutionTemplate`                                        | same                        | same                    | same                                               | same                           |
| Education        | `/solutions/educational-platform-business-solution-website-at-hyderabad` | same                     | same        | "education platform development hyderabad"      | `SolutionTemplate`                                        | same                        | same                    | same                                               | same                           |
| Gym & Fitness    | `/solutions/gym-business-solution-website-at-hyderabad`                  | same                     | same        | "gym management software hyderabad"             | **`GymSolutionLanding`** (bespoke)                        | same                        | same                    | same + related-posts                               | same                           |
| Dental & Medical | `/solutions/dental-hospital-business-solution-website-at-hyderabad`      | same                     | same        | "dental clinic website development hyderabad"   | **`DentalSolutionLanding`** (bespoke) + pricing sub-route | same                        | same                    | same + `/solutions/dental-clinic-website-packages` | same                           |
| E-commerce       | `/solutions/product-selling-online-ecommerce-website-at-hyderabad`       | same                     | same        | "ecommerce website development hyderabad"       | `SolutionTemplate`                                        | same                        | same                    | same                                               | same                           |
| SaaS Platforms   | `/solutions/subscription-saas-business-website-at-hyderabad`             | same                     | same        | "saas platform development hyderabad"           | `SolutionTemplate`                                        | same                        | same                    | same                                               | same                           |
| SEO Blogs        | `/solutions/seo-enabled-blogs-website-at-hyderabad`                      | same                     | same        | "seo blog website development hyderabad"        | `SolutionTemplate`                                        | same                        | same                    | same                                               | same                           |

Answers:

1. **New cities added**: add one entry to `APPROVED_CITIES` in `src/lib/cities.ts` (token + displayName), passing the module's own validity assertions (2–40 lowercase/digit/hyphen chars, 1–50 total entries). No other file needs editing — `allNicheParams()`, `solutionRoutes()`, `sitemap.ts`, and `services.json` all derive from this list automatically.
2. **New verticals added**: add a `NicheSeed` entry to `NICHE_SEEDS` in `src/lib/niches.ts` (plus corresponding entries in `NICHE_ENRICHMENT`/`NICHE_CASE_STUDIES` if metrics/case-study data is wanted), and a `KeywordAssignment` in `src/lib/keyword-map.ts`. `services-catalog.ts` (the chat's knowledge base) would need a manual matching entry too — **not automatic**, a documented drift point.
3. **Does one data change generate multiple URLs?** Yes — adding a city multiplies by 10 (one per existing niche); adding a niche multiplies by however many approved cities exist (currently 1).
4. **Are invalid combinations blocked?** Yes — `resolveSolutionSlug` returns `null` for any city token not in `APPROVED_CITIES`, even if the niche-template prefix/suffix matches exactly.
5. **Are unknown slugs 404?** Yes — via `dynamicParams = false` at the static-params layer, and via the page's own `notFound()` call as a second, defense-in-depth layer if resolution ever fails post-generation.
6. **Are generated URLs included in sitemap?** Yes, automatically via `solutionRoutes()` → `ALL_ROUTES` → `sitemap.ts`.
7. **Are all generated pages indexable?** Yes — no `noindex` logic exists for solution routes; every resolved niche×city pair gets standard `index:true, follow:true` robots metadata via `buildMetadata()`.
8. **Is the system deterministic?** Yes — same niche+city always produces the same slug (pure `slugify`/string replacement), and the resolver is a pure function with no randomness or time-dependence.
9. **Critical dependency files**: `src/lib/niches.ts`, `src/lib/cities.ts`, `src/lib/routes.ts`, `src/lib/keyword-map.ts`, `src/lib/seo.ts`, `src/lib/structured-data.ts`, `src/app/(site)/solutions/[slug]/page.tsx`, `src/app/sitemap.ts`.

# 14. Dynamic Slug / Niche / City Resolution

Already fully traced in §11–§13. Summary of the resolution algorithm's key properties (verified against `tests/properties/solution-slug.spec.ts`, a property-based test suite):

- **Property 29** (tested): the resolver accepts exactly the approved city tokens — near-miss tokens and unapproved cities always return `null`, even when the niche-template literal fragments match perfectly.
- **Property 30** (tested): the generated route set (`allNicheParams()`) exactly equals the resolvable set (every slug it produces, `resolveSolutionSlug` can resolve back) — no drift between generator and resolver is possible without failing this test.
- Matching is case-insensitive and whitespace-trimmed at the boundary (`slug.trim().toLowerCase()`), so a mixed-case or padded input resolves identically — purely a resolver-robustness property, not an intentional multi-casing feature since no such URL is ever linked internally.

# 15. Metadata Architecture

| Element         | FILE                             | FUNCTION                                | DEPENDENCY                                       | SHARED SCOPE                      | RISK OF HOMEPAGE CHANGE                                                                |
| --------------- | -------------------------------- | --------------------------------------- | ------------------------------------------------ | --------------------------------- | -------------------------------------------------------------------------------------- |
| `metadataBase`  | `src/app/layout.tsx`             | inline `new URL(SITE_URL)`              | `src/lib/site.ts` `SITE_URL`                     | Global — inherited by every route | Do not touch; changing it re-bases every relative OG/canonical URL sitewide            |
| title           | `src/lib/seo.ts`                 | `buildMetadata()`                       | `TITLE_TEMPLATE_SUFFIX`, per-route `title` input | Global factory, per-route input   | Safe to change homepage's own title string; do not touch the factory                   |
| description     | `src/lib/seo.ts`                 | `buildMetadata()`, `clampDescription()` | none                                             | Global factory                    | Safe to change homepage's own description text                                         |
| canonical       | `src/lib/seo.ts`                 | `canonicalUrl()`                        | `SITE_URL`                                       | Global — every route calls this   | Do not touch; used by structured data, sitemap, keyword map too                        |
| OpenGraph       | `src/lib/seo.ts`                 | `buildMetadata()`                       | `LOCALE.openGraph`, `ogImageUrl()`               | Global factory                    | Safe to change homepage's own OG title/description/image via `buildMetadata` call args |
| Twitter         | `src/lib/seo.ts`                 | `buildMetadata()`                       | same as OG                                       | Global factory                    | Same as OG                                                                             |
| robots metadata | `src/lib/seo.ts`                 | `buildMetadata()` `index` param         | none                                             | Global factory                    | Homepage is always `index:true` — no reason to change                                  |
| llms.txt        | `src/app/llms.txt/route.ts`      | `buildBody()`                           | `STATIC_ROUTES`, `NICHES`, `SITE_NAME`           | Sitewide static file              | Homepage copy changes don't affect this; only route-registry changes do                |
| services.json   | `src/app/services.json/route.ts` | `buildServiceIndex()`                   | `NICHES`, `solutionRoutes()`                     | Sitewide static file              | Not affected by homepage visual changes                                                |

The root layout (`src/app/layout.tsx`) is the **only** place `metadataBase` is set, and it explicitly documents (in a code comment) that `buildMetadata()` itself never sets it — this is a deliberate single-responsibility split that must be preserved.

The homepage's own metadata is defined inline in `src/app/layout.tsx` (not in `page.tsx`) — title `"Blogspage: ai automation agency & SaaS studio"`, `titleAbsolute: true`, `keywordPhrase: "ai automation agency"`, plus a `keywords` array preserved via the `extra` merge parameter. **This is unusual**: every other route defines its own `metadata`/`generateMetadata`, but the homepage's lives in the root layout because Next.js requires root-layout metadata as the default and the homepage happens to share that same route segment structurally. Editing homepage metadata means editing `src/app/layout.tsx`, not `src/app/(site)/page.tsx`.

# 16. Structured Data Architecture

All JSON-LD is built in `src/lib/structured-data.ts` and rendered via `<JsonLd nodes={[...]} />` (`src/components/seo/json-ld.tsx`), one `<script type="application/ld+json">` per node (never a `@graph` wrapper, per design rationale documented in the file's header comment).

| Node type      | FILE                 | FUNCTION              | DEPENDENCY                           | SHARED SCOPE                                              | RISK OF HOMEPAGE CHANGE                                                                          |
| -------------- | -------------------- | --------------------- | ------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Organization   | `structured-data.ts` | `organizationNode()`  | `NAP`, `SOCIAL_PROFILES` (`site.ts`) | Emitted once, sitewide, by `(site)/layout.tsx`            | **Not homepage-owned** — do not move/duplicate this call into `page.tsx`                         |
| WebSite        | `structured-data.ts` | `webSiteNode()`       | `NAP.legalName`, `organizationRef()` | Emitted by `page.tsx` (homepage-specific)                 | This IS homepage-owned — safe to adjust here, but keep `@id` stable                              |
| LocalBusiness  | `structured-data.ts` | `localBusinessNode()` | `NAP`, `OPENING_HOURS`               | Emitted only on `/contact`                                | Not on homepage; no risk                                                                         |
| Service        | `structured-data.ts` | `serviceNode()`       | `organizationRef()`                  | Emitted on `/solutions`, `/solutions/[slug]`              | Not on homepage; homepage's `BentoGrid` links to these pages but emits no `Service` nodes itself |
| Person         | `structured-data.ts` | `personNode()`        | `organizationRef()`                  | Emitted on author archive pages                           | Not on homepage                                                                                  |
| BreadcrumbList | `structured-data.ts` | `breadcrumbNode()`    | `canonicalUrl()`                     | Emitted via `<Breadcrumb>` on every route except homepage | **Homepage has no breadcrumb** — it is the root, so none is rendered                             |
| FAQPage        | `structured-data.ts` | `faqNode()`           | none                                 | Emitted on solution/service routes with ≥3 FAQ pairs      | Not on homepage                                                                                  |

**Node identity is route-independent** (a documented design decision): every `@id` comes from `mintId()`, anchored at a fixed path/fragment, not derived from the rendering route. This is why the `Organization` node's `@id` (`https://www.blogspage.com/#organization`) stays identical whether it's rendered site-wide from the layout or referenced via `organizationRef()` from a solution page's `Service.provider` field — critical for Requirement 5.10 (schema.org entity consistency), and **must not be touched** during homepage work since it underpins every other route's structured data too.

# 17. Sitemap / Robots / AI Discovery

| System              | FILE                             | Mechanism                                                                                                                                                                                                                               | Revalidation                                                 |
| ------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| sitemap.xml         | `src/app/sitemap.ts`             | `ALL_ROUTES` (code) + Sanity-fetched post/category/author entries, deduplicated, dev-mode invariant checks (absolute URL, no trailing slash, no query, <50k entries)                                                                    | `revalidate = 3600` (1 hour)                                 |
| robots.txt          | `src/app/robots.ts`              | Static rule set: `*` allowed on `/`, disallow `/studio`; 6 named AI crawlers (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended) each get an identical explicit record                                     | Static (no revalidation needed — no data dependency)         |
| llms.txt            | `src/app/llms.txt/route.ts`      | `force-static`, `revalidate: false` — body computed once at build time from `SITE_NAME`, `STATIC_ROUTES`, `NICHES`, module-load-time length-bound assertion (200–10,000 chars)                                                          | Build-time only                                              |
| services.json       | `src/app/services.json/route.ts` | `force-static`, `revalidate: false` — derived from `NICHES` + `solutionRoutes()`                                                                                                                                                        | Build-time only                                              |
| feed.xml (RSS)      | `src/app/feed.xml/route.ts`      | Fetches `FEED_POSTS_QUERY` from Sanity (20 most recent live, non-noindex posts), builds RSS 2.0 XML with XML-escaping and 500-char excerpt clamping; falls back to a valid empty-channel response on Sanity failure (HTTP 200, not 500) | Live per-request fetch (not explicitly cached in this route) |
| og image generation | `src/app/og/route.tsx`           | Edge runtime `ImageResponse`, 1800ms timeout race, falls back to `/og-default.png` static redirect on timeout/error                                                                                                                     | Per-request, edge                                            |

The homepage contributes exactly one static entry to the sitemap (`path: "/"`, `changeFrequency: "weekly"`, `priority: 1.0` — the highest priority value in the entire sitemap). No homepage-specific robots or llms.txt logic exists; the homepage is simply one of the `STATIC_ROUTES` entries these systems already enumerate generically.

# 18. Sanity / Content Architecture

**Client**: `src/sanity/lib/client.ts` — read-only, `useCdn: true` (fast, cached reads acceptable for public content). **Write client**: `src/sanity/lib/write-client.ts` — separate, server-only, requires `SANITY_WRITE_TOKEN`, used exclusively by `src/lib/lead-store.ts` for lead persistence.

**Schemas** (`src/sanity/schemaTypes/`): `postType` (blog posts — extensive SEO field group: `focusKeyword`, `seoKeywords`, `seoTitle`, `metaDescription`, `canonicalUrl`, `noindex`, `nofollow`, `ogTitle`/`ogDescription`/`ogImage`, `faq` array), `categoryType`, `authorType` (with `sameAs` social links, feeding `personNode()`), `blockContentType` (Portable Text definition, supports embedded images, code blocks, internal/external links, and embedded `ctaBlock` objects), `ctaBlockType` (in-content CTA object), `leadType` (the chat/form lead-capture document — `name`, `email`, `phone`, `businessName`, `industry`, `message`, `source`, `status`, `transcript`, `submittedAt`).

**Queries** (`src/sanity/lib/queries.ts`): a single `LIVE_POST_FILTER` constant (`_type == "post" && !draft && defined(slug) && defined(publishedAt) && publishedAt <= now()`) is reused across every query — `POSTS_QUERY` (blog index), `LATEST_POSTS_QUERY` (homepage rail, top 3), `POST_QUERY` (single post + full metadata/JSON-LD fields), `RELATED_POSTS_FALLBACK_QUERY`, `POST_SITEMAP_QUERY`, `POST_SLUGS_QUERY`, `POSTS_PAGE_QUERY`/`POSTS_COUNT_QUERY` (pagination), `CATEGORY_POSTS_QUERY`/`AUTHOR_POSTS_QUERY` (taxonomy archives), `CATEGORY_SLUGS_QUERY`/`AUTHOR_SLUGS_QUERY` (only returns taxonomy terms with ≥1 live post — prevents empty archive pages from being generated), `FEED_POSTS_QUERY` (RSS, top 20 non-noindex).

**Homepage's only Sanity touchpoint**: `LatestBlogs` fetching `LATEST_POSTS_QUERY` — 3 fields (`_id`, `title`, `slug`, `publishedAt` — confirmed minimal projection, no body/image fetched for the homepage rail).

**Homepage content classification**:

| Homepage element                                                                      | Classification                                                   |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Hero, ServicesBento, ComparisonSection, ProcessTimeline, CtaSection, ContactForm copy | HARDCODED                                                        |
| BentoGrid niche cards                                                                 | DERIVED (from `NICHES` code module — not Sanity, not a database) |
| DeliveryModels                                                                        | HARDCODED (shared export)                                        |
| FeaturedWork projects                                                                 | HARDCODED (shared export, `src/lib/featured-work-data.ts`)       |
| LatestBlogs post list                                                                 | SANITY (the only live-data section on the homepage)              |
| Organization/WebSite JSON-LD                                                          | DERIVED (from `src/lib/site.ts` constants)                       |

**No homepage data lives in a traditional database/API** — there is no Postgres/Supabase read on the homepage despite Supabase being part of the agency's own client-project stack; Supabase is used only in _client deliverables_ referenced in copy (Phixl AI, ArogyaDiet case studies), not in Blogspage's own site.

# 19. Internal Linking Architecture

The homepage is both a **hub** (linking out to 10 solution pages via `BentoGrid`, plus `/blogs` via `LatestBlogs`) and a **destination** (every solution page and the navbar/footer link back into it via hash anchors). The anchor contract:

| Anchor ID    | Defined in                                               | Referenced from                                                                                                                                                                 |
| ------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `#contact`   | `ContactForm` (`contact-form.tsx`)                       | Navbar (implicit via chat), Hero, DeliveryModels × 2, every `/solutions/[slug]` CTA (`/#contact?niche=<id>`), `SolutionTemplate`, `GymSolutionLanding`, `DentalSolutionLanding` |
| `#process`   | `ProcessTimeline` (`process-timeline.tsx`)               | Navbar ("Process" link), `GymSolutionLanding` ("See our process"), `SolutionTemplate` ("See our process")                                                                       |
| `#services`  | `ServicesBento` (`services-bento.tsx`)                   | Navbar ("Services" link)                                                                                                                                                        |
| `#models`    | `DeliveryModels` (`delivery-models.tsx`)                 | Hero ("See what we automate")                                                                                                                                                   |
| `#solutions` | `BentoGrid` (`bento-grid.tsx`)                           | Not currently referenced by any found link (orphaned anchor id — defined but no confirmed inbound link target found in the codebase search)                                     |
| `#work`      | `FeaturedWork` mobile variant only (desktop has no `id`) | Not referenced by any found link                                                                                                                                                |

This means **the homepage's section `id` attributes function as a public API contract** consumed by every solution page in the programmatic SEO system. Renaming, removing, or restructuring `#contact` or `#process` specifically would break inbound CTA links across all 10 solution pages plus the navbar.

Footer internal links (`src/components/layout/footer.tsx`): "Solutions" column reads `serviceRoutes()` (the 4 dedicated `/services/<slug>` routes, not the 10 niches), "Company" column is a hardcoded list (`/about`, `/#process`, `/solutions`, `/blogs`, `/contact`), "Legal" column (`/privacy`, `/terms`).

# 20. Design System

| Element                                                                      | HOMEPAGE-ONLY      | SHARED                                                                                                      | SOLUTION-PAGE SHARED | GLOBAL                                                                   |
| ---------------------------------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------ |
| Color tokens (`--background`, `--primary`, etc.)                             |                    |                                                                                                             |                      | ✅ (`globals.css` `:root`/`.dark`)                                       |
| `Button` (`ui/button.tsx`)                                                   |                    |                                                                                                             | ✅                   | ✅                                                                       |
| `Card` family (`ui/card.tsx`)                                                |                    |                                                                                                             | ✅                   | ✅                                                                       |
| `.glass`, `.gradient-mesh`, `.text-gradient`, `.glow-border` utility classes |                    |                                                                                                             | ✅                   | ✅ (defined in `globals.css` `@layer utilities`)                         |
| `.hero-word` CSS keyframe animation                                          | ✅ (Hero-specific) |                                                                                                             |                      |                                                                          |
| `cn()` utility (`lib/utils.ts`)                                              |                    |                                                                                                             | ✅                   | ✅                                                                       |
| `CustomCursor`, `SmoothScroll`                                               |                    |                                                                                                             |                      | ✅ (mounted once, sitewide via `ClientEnhancements`)                     |
| `FadeUp` (`solutions/fade-up.tsx`)                                           |                    |                                                                                                             | ✅ (solutions only)  |                                                                          |
| `Preloader`                                                                  |                    |                                                                                                             |                      | ✅ (sitewide, once per session)                                          |
| Bento-grid mouse-tracked spotlight pattern (CSS custom props `--x`/`--y`)    |                    | ✅ (duplicated independently in `ServicesBento` and `BentoGrid` — not extracted to a shared hook/component) |                      |                                                                          |
| Typography scale (Tailwind classes, no custom scale file)                    |                    |                                                                                                             |                      | ✅ (no design-tokens.ts; sizes are Tailwind utility classes used ad hoc) |

**Notable finding**: the mouse-tracked spotlight/glow effect (`onMouseMove` writing `--x`/`--y` CSS vars, then a `radial-gradient` background) is implemented **twice**, nearly identically, in `ServicesBento`'s `ServiceCard` and `BentoGrid`'s `NicheCard` — a duplicated pattern that could be extracted into a shared primitive but currently is not. This is a technical-debt item, not a blocker.

There is no dedicated design-tokens file beyond `globals.css`'s CSS custom properties (a "Linear design system palette" per its own comment) — spacing, breakpoints, and typography scale are all default Tailwind v4 values, not customized in `tailwind.config.ts` (which only extends `typography` plugin CSS variables).

# 21. Animation / Interaction Architecture

| Technique                                   | FILE                                                                                                                                                          | PURPOSE                                                | CLIENT/SERVER                                   | PERFORMANCE COST                                                                                                                       | SHARED SCOPE                                                                     |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Framer Motion `whileInView` stagger reveals | `services-bento.tsx`, `bento-grid.tsx`, `comparison-section.tsx`, `process-timeline.tsx`, `cta-section.tsx`, `contact-form.tsx`, `featured-work.tsx` (mobile) | Scroll-triggered entrance animation                    | Client                                          | Low-moderate per section; cumulative cost across 7 sections is the dominant homepage JS animation cost                                 | Homepage-only pattern, but same Framer Motion primitives used on solution pages  |
| CSS `@keyframes hero-word-reveal`           | `globals.css`, consumed by `hero.tsx`                                                                                                                         | Word-by-word headline reveal without client JS         | **Server-safe** — pure CSS, no hydration cost   | Near-zero — GPU-composited transform/opacity                                                                                           | Homepage-only (Hero-specific class)                                              |
| Lenis smooth scroll                         | `providers/smooth-scroll.tsx`                                                                                                                                 | Global inertia-based scroll smoothing                  | Client, idle-deferred                           | Continuous `requestAnimationFrame` loop for the entire session                                                                         | **Global** — affects every page's scroll feel, not homepage-specific             |
| Custom cursor                               | `ui/custom-cursor.tsx`                                                                                                                                        | Decorative cursor-follow circle with hover-state scale | Client, idle-deferred, fine-pointer only        | Low — `useSpring` smoothing, mousemove listener with `passive:true`                                                                    | **Global**                                                                       |
| Pinned horizontal scroll                    | `featured-work.tsx` (`DesktopHorizontalScroll`)                                                                                                               | Desktop project showcase                               | Client                                          | **Highest single-section cost on the homepage** — `h-[400vh]` sticky container + continuous `useTransform` recalculation while in view | Homepage-only                                                                    |
| Scroll-driven SVG line draw                 | `process-timeline.tsx` (`ScrollLine`)                                                                                                                         | Visual progress indicator through the 4-phase timeline | Client                                          | Low-moderate — one `useScroll` target                                                                                                  | Homepage-only                                                                    |
| Infinite marquee                            | `cta-section.tsx` (`InfiniteMarquee`)                                                                                                                         | Decorative background text scroll                      | Client                                          | **Runs continuously, uninterruptible** — no `whileInView` gate, animates for the section's entire mounted lifetime                     | Homepage-only                                                                    |
| Magnetic button                             | `cta-section.tsx` (`MagneticButton`)                                                                                                                          | Cursor-attraction hover effect                         | Client                                          | Low — `useMotionValue`/`useSpring`, only active on mousemove within the button's bounding box                                          | Homepage-only                                                                    |
| Mouse-tracked spotlight                     | `services-bento.tsx`, `bento-grid.tsx`                                                                                                                        | Hover glow following cursor                            | Client                                          | Low per card, but duplicated across 14 total cards (4 + 10)                                                                            | Homepage-only, duplicated pattern                                                |
| Character-typing effect                     | `contact-form.tsx` (`TypedLine`)                                                                                                                              | Terminal boot-sequence simulation                      | Client, plain `setInterval` (not Framer Motion) | Low — 4 independent intervals, cleaned up on unmount                                                                                   | Homepage-only                                                                    |
| Preloader counter animation                 | `ui/preloader.tsx`                                                                                                                                            | Full-screen loading overlay, 0→100 counter             | Client, `requestAnimationFrame`                 | Bounded to ~1050ms budget (900ms counter + 150ms hold), with a hard `setTimeout` release as a fail-safe                                | **Global** — runs once per session on any first page load, not homepage-specific |

**Reduced-motion behaviour**: `.hero-word` CSS animation is explicitly disabled under `@media (prefers-reduced-motion: reduce)` (`globals.css`); `Preloader` skips its entire animated sequence and releases immediately under reduced motion; `SmoothScroll` skips initializing Lenis entirely under reduced motion. **Not all Framer Motion sections check `prefers-reduced-motion`** — the `whileInView` stagger reveals in `ServicesBento`, `BentoGrid`, `ComparisonSection`, `ProcessTimeline`, `CtaSection`, and `ContactForm` have no explicit reduced-motion guard found in their code (Framer Motion does not automatically respect the media query unless a project explicitly wires `useReducedMotion()`, which none of these files do).

**Lazy loading / idle deferral**: `ClientEnhancements` defers `SmoothScroll`+`CustomCursor`+`ChatWidget` mounting via `requestIdleCallback` — this is the only `requestIdleCallback` usage found in the codebase.

# 22. Performance Architecture

**Client component overuse**: of the 10 homepage sections, 7 are fully client (`ServicesBento`, `BentoGrid`, `ComparisonSection`, `ProcessTimeline`, `FeaturedWork`, `CtaSection`, `ContactForm`); only `Hero`, `DeliveryModels`, and `LatestBlogs` render server-side. This is a heavy client-JS homepage by Next.js App Router standards, though largely justified by the Framer Motion-driven design language rather than avoidable over-clienting.

**JavaScript payload**: Framer Motion (a non-trivial bundle) is imported by 8 of the ~13 homepage-adjacent files (7 client sections + `hero-ambient.tsx`). No dynamic `import()`/`next/dynamic` code-splitting was found for any homepage section — all are statically imported in `page.tsx`, meaning the full homepage JS bundle (including `FeaturedWork`'s heaviest scroll logic) ships on initial load rather than being deferred until scroll-proximity.

**Hydration**: the server-rendered `Hero` (with its CSS-only word reveal) is a deliberate hydration-cost mitigation — the design explicitly avoids Framer Motion for the `<h1>` specifically so the LCP element never waits on hydration (documented in the file's own comments, tied to audit Finding F-12). This much holds: no JS is required for the headline to appear.

**Image loading**: hero visual uses `priority` + explicit responsive `sizes`; `FeaturedWork`'s first project image also uses `priority={index === 0}` (correctly limits eager-loading to a single above-the-fold-adjacent image, not all 4). All images route through `next/image` with AVIF/WebP; `next.config.ts` disallows SVG in the image loader.

**Fonts**: Geist Sans/Mono via `next/font/google`, self-hosted at build time (no runtime Google Fonts request) — good practice, zero external font-loading risk.

**Animation cost**: `FeaturedWork`'s desktop pinned-scroll section is the single largest animation-performance risk on the homepage — a `400vh`-tall sticky container with continuous scroll-linked transform recalculation is exactly the pattern most likely to show up in Lighthouse as INP/TBT pressure on lower-end devices, though it is gated to desktop only (`hidden md:block`), so mobile avoids this cost entirely.

**Third-party scripts**: none beyond `@vercel/analytics`'s script (loaded via the `<Analytics/>` component, which Vercel documents as lightweight/deferred by design).

**Chat loading**: `ChatWidget` is idle-deferred via `ClientEnhancements`, so it does not compete with initial paint — a correct performance pattern already in place.

**Analytics**: single lightweight Vercel Analytics beacon; no additional third-party analytics scripts to audit.

**Layout shift (CLS) risk**: `Preloader` covers the full viewport during its ~1050ms window, which structurally prevents any layout shift from being visible during that period — but the audit report notes this exact overlay is itself a documented open question requiring live Lighthouse measurement (Finding F-19, "the overlay's contribution to perceived load and blocking time" — unresolved, needs live-site data).

**LCP risk**: the `<h1>` in `Hero` is the LCP candidate on most viewports. The audit's remediation is usually described as "server-rendering it at full opacity," but as established in §7, `.hero-word` starts at `opacity: 0` with `animation-fill-mode: both` and a per-word delay of `100ms + index × 80ms`. Browsers do not count a fully transparent element as a paint, so **the LCP timestamp is pushed out by the reveal delay** — for the last word of a two-line, seven-word headline that is roughly 100ms + 6 × 80ms = ~580ms plus the 600ms animation duration before the text is fully opaque. This is far cheaper than a hydration-gated Framer Motion reveal (the pre-remediation state) and is not a crawlability problem, but it is not a zero-cost LCP path either. The measured LCP number was never captured (Finding F-12, unresolved without a production Lighthouse run), and this delay is a concrete reason that measurement matters rather than being assumed resolved.

**INP risk**: the 14 duplicated mouse-tracked spotlight cards (`ServicesBento` + `BentoGrid`) each attach an `onMouseMove` handler; combined with `FeaturedWork`'s continuous `useTransform` recalculation while the pinned section is in view, this is the most plausible INP pressure point, though none of it has been lab-measured per the audit report's own admission.

**CLS risk**: `next/image` usage throughout homepage sections (all with explicit `fill`/`sizes` or width/height) should keep image-driven CLS low; no unsized images were found in any homepage component.

# 23. Accessibility Architecture

**H1**: exactly one per route — homepage's is in `Hero` ("We Build AI Systems That / Sell While You Sleep."), present in server HTML and not hidden pending JS, addressing the crawlability half of audit Finding F-12. It is _not_ rendered at full opacity initially: `.hero-word` animates up from `opacity: 0` via CSS (see §7 and §22). Under `prefers-reduced-motion: reduce` the animation is disabled and the words are forced to `opacity: 1` immediately, so reduced-motion users do get the instant-visibility behavior.

**H2–H6**: each homepage section with a heading uses `<h2>` (ServicesBento, BentoGrid, ComparisonSection, DeliveryModels, ProcessTimeline, LatestBlogs, CtaSection, ContactForm) or `<h3>` for card-level headings (NicheCard, ServiceCard titles) — a generally correct, non-skipping hierarchy was observed; no `<h4>`+ found on the homepage itself (deeper levels appear on blog posts and solution pages via `createHeadingSlugger`).

**Landmarks**: `<main id="main" tabIndex={-1}>` wraps all page content (site layout); `<nav>` in `Navbar` and `Breadcrumb`; `<footer>` in `Footer`. The `Navbar` is a `motion.header`, which renders a literal semantic `<header>` element — Framer Motion's `motion.<tag>` proxy maps one-to-one onto the corresponding DOM tag and forwards unrecognized props to it, so the `<header>` landmark is present. (The original pass hedged this; it is standard, stable library behavior and can be treated as settled. The one caveat worth keeping: `motion.header` renders a `<header>` but the _banner_ landmark role only applies when the `<header>` is not nested inside another sectioning element, which here it is not.) No `<aside>` landmark exists on the homepage, correctly — there is no complementary content.

**Keyboard navigation**: `SkipLink` (`src/components/layout/skip-link.tsx`) provides a "Skip to main content" link, visually hidden until focused, jumping to `#main` — present on every page via the site layout, not homepage-specific. `Navbar`'s mobile menu toggle has `aria-expanded`; `CustomCursor` is `aria-hidden` and `pointer-events-none`, so it cannot interfere with keyboard/focus flow.

**Focus states**: `Button` ([`ui/button.tsx`](src/components/ui/button.tsx:8)) includes `focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50` in its base CVA class, so a consistent ring applies wherever `Button` is used — including Hero, DeliveryModels, and ComparisonSection, which use `Button asChild` wrapping `<Link>` and inherit the treatment. `Input` and `Textarea` carry equivalent `focus-visible:ring-[3px] focus-visible:ring-primary/20` treatments.

**Now confirmed** (the original pass marked this uncertain): every hand-rolled `<button>` outside the `Button` primitive was checked, and **none of them declare any `focus-visible` styling**. The affected elements are `Navbar`'s "Start a Project" CTA, mobile menu toggle, and mobile CTA; `ContactForm`'s "Initialize System" trigger ([`contact-form.tsx`](src/components/home/contact-form.tsx:166) — its className carries only hover and border transitions); `ChatWidget`'s close, send, quick-reply, and floating toggle buttons; `CtaSection`'s `MagneticButton`; and the FAQ accordion toggles on the dental landing pages. Each also sets `outline-none` implicitly through Tailwind's preflight or explicitly (`ChatWidget`'s input uses `outline-none`), so these controls fall back to whatever the browser draws — which for `outline-none` elements can be **no visible focus indicator at all**.

This is a genuine WCAG 2.4.7 (Focus Visible) risk concentrated in exactly the wrong place: the homepage's primary conversion control (`ContactForm`'s trigger) and the entire AI chat interface — the site's sole lead-capture path — are keyboard-reachable but may give no visual indication of focus. A keyboard-only user can tab to the chat's send button without seeing where they are.

**ARIA labelling on the chat input**: [`chat-widget.tsx`](src/components/chat-widget.tsx:173)'s `<input>` has a `placeholder` but no `<label>`, no `aria-label`, and no `aria-labelledby` — confirmed, not inferred. Placeholder text is not an accessible name substitute (WCAG 3.3.2), and it disappears once the user types. Every icon-only _button_ in the widget is correctly `aria-label`led, so this is an isolated miss rather than a pattern.

**ARIA**: `aria-hidden` correctly applied to every purely decorative element found (gradient blobs, custom cursor, marquee background, watermark layers, hero background image). `aria-label` present on icon-only buttons (`Navbar` menu toggle, `ChatWidget` open/close, `Footer` social links). `aria-current="page"` on the active breadcrumb item.

**Buttons vs. links**: generally correct semantic usage was observed — navigation uses `<Link>`, action-triggers (opening chat) use `<button onClick>`. `MagneticButton` in `CtaSection` is a `motion.button`, appropriately.

**Contrast**: now computed. The original pass left this unmeasured; the ratios below are calculated per the WCAG 2.1 relative-luminance formula from the hex tokens in `globals.css`, against `--background: #010102`. These are exact for flat-color pairings; sections sitting on gradient overlays (Hero, CtaSection) will differ slightly and still warrant a rendered check.

| Pairing                                                   | Ratio      | WCAG verdict (normal text)          |
| --------------------------------------------------------- | ---------- | ----------------------------------- |
| `--foreground` `#f7f8f8` on background                    | **19.6:1** | Passes AA and AAA comfortably       |
| `--muted-foreground` `#8a8f98` on background              | **6.4:1**  | Passes AA (4.5:1), fails AAA (7:1)  |
| `--primary-foreground` `#ffffff` on `--primary` `#5e6ad2` | **4.7:1**  | Passes AA, but only just; fails AAA |
| `text-muted-foreground/50` on background                  | **~2.3:1** | **Fails AA**                        |
| `text-white/30` (chat placeholder) on chat surface        | **~2.4:1** | **Fails AA**                        |

The base palette is sound: body and muted text both clear AA. **The real problem is the opacity modifiers.** Tailwind's `/50`, `/40`, and `/30` suffixes are applied to already-muted foreground colors in several places, and the composited result lands near 2.3:1 — roughly half the AA floor. Confirmed instances include `contact-form.tsx`'s footnote (`text-muted-foreground/50`, "Powered by our proprietary LLM pipeline · Response in <5s"), `ChatWidget`'s input placeholder (`placeholder:text-white/30`) and its close button (`text-white/40`), and `Navbar`'s idle nav links (`text-white/50`). These are small, secondary, or decorative strings rather than primary content, which limits the severity, but the placeholder and nav-link cases are functional UI, not decoration. This is the single most actionable accessibility finding in this report and it was previously invisible because the ratios had never been computed.

Note also that `--primary` at 4.7:1 leaves no headroom: any future darkening of the primary swatch, or use of `--primary` as a _text_ color on the dark background rather than as a button fill, would drop below AA.

**Reduced motion**: partial coverage — confirmed for `.hero-word` CSS animation, `Preloader`, and `SmoothScroll` (all explicitly check `prefers-reduced-motion`); **not confirmed** for the Framer Motion `whileInView` sections listed in §21, which have no `useReducedMotion()` guard in their code.

**Alt text**: `Hero`'s decorative visual has `alt=""` (correct — it's `aria-hidden` and purely decorative); `Navbar`/`Footer` logo images have `alt="Blogspage AI"` (correct, meaningful alt); `FeaturedWork` project images use `alt={project.headline}` (correct, descriptive).

**Forms**: the homepage has **no native `<form>` element** — `ContactForm` is a chat-launch trigger, not a form, so there are no form-field labeling concerns to audit on the homepage itself. The `/contact` page and the AI chat's own text input (`<input>` with a `placeholder` but no visible `<label>`, relying on `placeholder="Type your message…"` as the only affordance — a minor accessibility gap: placeholder text is not a substitute for a proper label per WCAG guidance) are outside the homepage but worth noting since `ChatWidget` is globally mounted.

# 24. Analytics / Tracking Architecture

Confirmed via exhaustive repo-wide search — **only one analytics integration exists in the entire codebase**:

- **Vercel Analytics** (`@vercel/analytics/react`'s `<Analytics />`), mounted once in `src/app/layout.tsx`, sitewide, not homepage-specific.

**Not present anywhere in the repository**:

- Google Analytics (GA4) — no `gtag`, no `G-XXXXXXX` measurement ID, no `next/script` GA loader.
- Google Tag Manager — no `dataLayer`, no GTM container snippet.
- Microsoft Clarity — no Clarity script/project ID.
- Search Console verification — no `google-site-verification` meta tag or DNS-verification artifact found in `layout.tsx` metadata or anywhere else.
- Custom event tracking — no `gtag('event', ...)`, no custom analytics `track()` calls, anywhere in `chat-widget.tsx`, `cta-section.tsx`, `contact-form.tsx`, `bento-grid.tsx`, or any other CTA-bearing component.
- Conversion tracking — no pixel, no conversion-event firing tied to `open-ai-chat` dispatches or `save_lead` tool-call success.
- Chat events — the AI chat's own success state (`leadCaptured` boolean in `ChatWidget`) drives only a UI indicator, never an analytics event.

**This is a genuine, confirmed gap**: there is currently no way to measure which homepage CTA (Hero vs. CtaSection vs. ContactForm vs. Navbar) actually drives chat opens, nor any way to attribute a captured lead back to which CTA or which solution-page referrer triggered it. Vercel Analytics provides pageview-level traffic data only, with no custom event dimension in use.

# 25. Existing Strengths

To ground the CRO/technical gap analysis in what is already working well, confirmed directly from code:

- **A complete, tested, deterministic programmatic SEO engine** — not a prototype. Bounded city/niche cross-product, 404 handling for invalid combinations, property-based test coverage (`tests/properties/solution-slug.spec.ts`) proving generator/resolver parity.
- **A genuinely comprehensive structured-data layer** — Organization, WebSite, LocalBusiness, Service, Person, BreadcrumbList, FAQPage all correctly cross-referenced via stable `@id`s rather than inlined duplicates, following current JSON-LD best practice (one node per script, no `@graph`).
- **A functioning, safety-conscious AI sales agent** — strict Zod validation preventing hallucinated lead data, graceful degradation when Sanity write credentials are absent, a clear conversational qualification flow.
- **A documented, audited SEO remediation with a paper trail** — the `.kiro/specs/seo-audit-and-optimization/` folder shows a rare level of rigor: a formal rubric (`src/lib/rubric.ts`), pre/post scores, and property-based tests directly enforcing the audit's own claims (title length bounds, description clamping, keyword-phrase uniqueness, canonical URL idempotence).
- **Deliberate honesty in content claims** — the "estimated" vs. "measured" metric labeling convention in `featured-work-data.ts`, and the explicit refusal to fabricate a `FOUNDING_YEAR` or claim booked calls in the AI chat's system prompt, reflect genuine content-integrity discipline rather than typical marketing-site embellishment.
- **Correct core-web-vitals-aware engineering** — server-rendering the `<h1>` at full opacity specifically to avoid LCP risk, idle-deferring non-critical client enhancements, and gating the heaviest animation (pinned horizontal scroll) to desktop only.
- **A genuinely reusable data layer** — `NICHES`, `DELIVERY_MODELS`, and `projects` are each exported once and consumed by both the homepage and `/about`, avoiding copy-paste content drift between those two surfaces.
- **AI-crawler-aware robots configuration** — explicit named allow-rules for GPTBot, ClaudeBot, PerplexityBot, etc., not just a generic wildcard — a forward-looking choice most sites of this size have not made.

# 26. Technical Risks / Technical Debt

Strictly technical/architectural — no business/CRO judgments here (see §27 for those):

- **Dead code**: `BusinessOutcomes` (`src/components/home/business-outcomes.tsx`) and `HotelHyderabadLanding` (`src/components/solutions/hotel-hyderabad-landing.tsx`) are fully built, styled components with zero importers anywhere in the codebase. `submitLead` server action (`src/app/actions/leads.ts`) is defined but never invoked by any component.
- **Duplicate `public/` directory**: `src/public/` exists alongside the real `public/` at project root, containing stale duplicate images and a `gitnotes.txt` — not referenced by any import, pure clutter.
- **`package.json` dependency hygiene** (verified by searching every import site across `src/`, `tests/`, `scripts/`, and the root scripts):
  - `axios`, `dotenv`, and `@sanity/block-tools` are reachable **only** from the root-level one-off migration scripts (`migrate.ts`, `seed-meta.ts`, `backfill-blog-meta.ts`), never from `src/`. They ship as production `dependencies` despite the running app having no path to them.
  - `jsdom` (and `@types/jsdom`) sit in `dependencies` rather than `devDependencies`, though their only role is test-environment DOM simulation.
  - `styled-components` has no direct import anywhere in the repo; it is present as a Sanity Studio peer dependency. Correct to keep, but worth documenting so nobody mistakes it for an app styling layer alongside Tailwind.
  - `@sanity/schema` likewise has no direct import outside the migration tooling.
  - Net effect: the production dependency surface is larger than the deployed app needs. Not a correctness bug, but it inflates install time and audit surface. Moving the migration-only packages to `devDependencies` (or extracting the migration scripts into their own workspace) would tighten this.
- **Manual sync risk between `NICHES` and `services-catalog.ts`**: the AI chat's knowledge base (`SERVICE_CATALOG` in `services-catalog.ts`) is a hand-maintained plain-text mirror of `NICHES`, explicitly flagged in its own file comment as needing manual sync — no automated test or build-time check enforces this parity, so the chat can silently drift out of sync with the actual solution pages it should be describing.
- **Duplicated mouse-spotlight implementation**: the `--x`/`--y` CSS-var hover-glow pattern is independently re-implemented in `ServicesBento.ServiceCard` and `BentoGrid.NicheCard` rather than extracted into a shared hook/component.
- **Documentation drift**: `BLOGSPAGE_AI_CONTEXT.md` documents GROQ queries for `/blogs` and `/blogs/[slug]` that do not match the current `src/sanity/lib/queries.ts` (the actual queries carry more fields — SEO metadata, breadcrumb data, FAQ arrays — than the simplified examples in the doc). This document is stale relative to code.
- **Unread `ContactForm` query params**: solution pages construct CTA links with `?niche=<id>&city=<token>` query strings targeting `/#contact`, but `ContactForm` never reads `useSearchParams()` — these params are silently dropped, meaning any future personalization based on referral niche/city would require new code, not just a copy change.
- **No automated Lighthouse/CWV measurement in CI**: the `vitest.seo.config.ts` suite checks structural SEO invariants (sitemap shape, route-set contents) but does not appear to run Lighthouse; every Core Web Vitals finding in the audit report (F-12, F-13, F-19) remains explicitly unverified pending manual measurement — a gap in the automated check suite's coverage, not just a one-time oversight.
- **`FOUNDING_YEAR` placeholder**: flagged directly in code (`src/lib/site.ts`) as an unconfirmed guess (2024) that must be verified before `/about` "ships" — currently `/about` already renders it, so this may already be a live, unverified claim in production if `/about` has been deployed.
- **No client/server data-fetching abstraction reuse**: `LatestBlogs` (homepage) and the solution-page's related-posts fetch both call `client.fetch(LATEST_POSTS_QUERY)` independently with separate try/catch handling — functionally correct but duplicated fetch logic rather than a shared server-side helper.
- **AI chat has no CRM/notification integration**: a captured lead sits in Sanity with no automated Slack/email alert to the team — the confirmation shown to the visitor ("our team will reach out") depends entirely on someone manually checking the Sanity Studio's lead list, with no push notification safety net.

# 27. Homepage CRO / UX Risks

Strictly business/CRO judgments — see §26 for the technical counterparts:

- **The narrowest possible conversion funnel**: every homepage CTA converges on exactly one of two outcomes (scroll to `#contact` or open the AI chat) — there is no low-commitment alternative (no email-only opt-in, no downloadable resource, no calendar-embed booking, no phone/WhatsApp click-to-contact) for a visitor who is not yet ready for a full conversation with an AI agent.
- **No visible trust signal beyond a logo strip**: `HeroTrustStrip` lists 5 _technology_ brands (OpenAI, Vercel, Supabase, Next.js, Stripe) as "AI-native systems built on" — this is a tech-stack credibility signal, not client/customer social proof (no client logos, no testimonials, no review-star ratings visible anywhere on the homepage).
- **Case studies exist but carry only "estimated" metrics**: `FeaturedWork`'s 4 projects are real and well-presented, but every single metric is explicitly labeled "estimated," not "measured" — a business owner scrutinizing proof points will notice none of the numbers are backed by verified data.
- **Query-param personalization promised but not delivered**: a visitor clicking "Book an architecture review" from the gym solution page arrives at a generic terminal-styled chat trigger with zero niche-aware messaging, despite the URL literally carrying `?niche=gym-fitness` — a broken personalization promise that could reduce trust/relevance at the exact moment of highest intent.
- **The AI chat is the sole lead-capture path**: a visitor who distrusts chatbots, wants to reach a human directly, or wants to submit info without a live conversation has no alternative path on the homepage — this is a single point of failure for the entire homepage conversion funnel.
- **Zero conversion-event tracking**: as established in §24, there is no way to know which homepage CTA is actually working — decisions about what to keep/change on the homepage would currently be made without any funnel-attribution data.
- **The positioning is AI-agency-forward, but proof skews toward classic web/SaaS development**: the hero, services-bento, and CTA sections all lead heavily with "AI sales agents," "AI automation," and "AI-powered systems," but 3 of 4 `FeaturedWork` case studies (NextInn, ArogyaDiet, Best100Movies) are booking/e-commerce/CMS platforms without a prominent AI-agent component in their headline description — a potential positioning/proof mismatch for a skeptical visitor.
- **`ComparisonSection` attacks "freelancers," which may not match the actual buyer's frame of reference**: the "Typical Freelancer vs. Our Approach" framing assumes the visitor is comparing Blogspage against freelance web developers — but the stated positioning (agencies, SaaS studios, product engineering) suggests some visitors may instead be comparing Blogspage against larger dev agencies or in-house teams, a comparison this section does not address.

# 28. Shared Dependencies

This section directly supports §29's boundary determination.

**Files/DOM contracts that are homepage-owned but consumed elsewhere:**

- `src/lib/featured-work-data.ts` (`projects`) — consumed by `/about`.
- `src/components/home/delivery-models.tsx` (`DELIVERY_MODELS` export) — consumed by `/about`.
- Homepage anchor IDs `#contact`, `#process`, `#services`, `#models` — consumed by every `/solutions/[slug]` route, `SolutionTemplate`, `GymSolutionLanding`, `DentalSolutionLanding`, and `Navbar` (every page).

**Files the homepage consumes but does not own, and must not be changed as part of homepage-only work:**

- `src/lib/niches.ts` (`NICHES`) — powers `/solutions`, `/solutions/[slug]`, `services.json`, `llms.txt`, and the AI chat's conceptual parity target (`services-catalog.ts`).
- `src/lib/seo.ts`, `src/lib/structured-data.ts`, `src/lib/site.ts`, `src/lib/routes.ts`, `src/lib/cities.ts`, `src/lib/keyword-map.ts` — sitewide SEO engine, used by every route.
- `src/sanity/lib/queries.ts` (`LATEST_POSTS_QUERY`) — shared verbatim between the homepage's `LatestBlogs` and every solution page's related-posts fallback.
- `Navbar`, `Footer`, `Preloader`, `ClientEnhancements`, `SkipLink` — rendered once in the shared `(site)/layout.tsx`, not homepage-local.
- `ChatWidget`, `chat-widget.tsx`'s `open-ai-chat` event contract — global, consumed by `Navbar`, `/contact`, and multiple solution pages, not just the homepage.
- `Button`, `Card` family, `cn()` utility — global UI primitives used across homepage, solutions, and blog surfaces.

# 29. Homepage Implementation Boundary

**What can change visually without touching the SEO architecture?** Any Tailwind class, color, spacing, animation timing, or layout arrangement within a homepage section component's own JSX — as long as the section's `id` attribute (where one exists: `#contact`, `#process`, `#services`, `#models`) is preserved and the `<h1>` in `Hero` remains server-rendered and non-empty.

**What can change in copy without affecting routes?** Any hardcoded string in `Hero`, `ServicesBento`, `ComparisonSection`, `ProcessTimeline`, `CtaSection`, `ContactForm` — none of these strings feed into `buildMetadata()`, JSON-LD, or the route registry. The homepage's actual `<title>`/`<meta description>` live in `src/app/layout.tsx`, not in these component files, so copy changes inside section components never touch metadata unless someone also edits `layout.tsx`.

**What can change in homepage components without affecting programmatic SEO?** Everything except: (a) the `NICHES` import inside `BentoGrid` (removing/restructuring how niches are rendered would change the internal-link graph into `/solutions/*`), and (b) the `#contact`/`#process` anchor IDs (removing them breaks inbound solution-page CTAs).

**What changes would propagate to solution pages?** Editing `#contact`/`#process` anchor IDs or removing those sections entirely; editing `LATEST_POSTS_QUERY`; editing `NICHES` (affects `BentoGrid` too, but that's a `src/lib` change, not a homepage-component change).

**What changes would affect every page?** Editing `Navbar`, `Footer`, `Preloader`, `ClientEnhancements`, `SkipLink`, `src/app/layout.tsx`, or any `src/lib/seo.ts`/`structured-data.ts`/`site.ts` function.

## HOMEPAGE IMPLEMENTATION BOUNDARY

### SAFE TO MODIFY

- `src/components/home/hero.tsx` + `src/components/home/hero-ambient.tsx` — visual/copy/animation changes, provided `<h1>` stays server-rendered and non-empty (LCP/Requirement 4.4-related).
- `src/components/home/services-bento.tsx` — no external routing/SEO dependency; pure visual/copy component.
- `src/components/home/comparison-section.tsx` — no external routing/SEO dependency.
- `src/components/home/process-timeline.tsx` — visual/copy/animation freely changeable, **but preserve `id="process"`**.
- `src/components/home/cta-section.tsx` — visual/copy/animation freely changeable; preserves the `open-ai-chat` event dispatch contract.
- `src/components/home/contact-form.tsx` — visual/copy/animation freely changeable, **but preserve `id="contact"`** and the `open-ai-chat` dispatch.
- `src/app/(site)/page.tsx` — section ordering/composition, as long as `<JsonLd nodes={[webSiteNode()]}/>` remains rendered somewhere on the page.
- `src/components/home/business-outcomes.tsx` — dead code, safe to delete or repurpose freely (verify zero importers again before deleting, per §26).
- `src/components/solutions/hotel-hyderabad-landing.tsx` — dead code, same caveat, though technically outside the homepage's own folder.

### SHARED — MODIFY ONLY WITH CARE

- `src/components/home/bento-grid.tsx` — visual changes are safe; **do not remove the `NICHES` import or the per-niche `href()` links** without updating the internal-linking analysis in §19, since this is the homepage's primary bridge into the entire programmatic SEO route set.
- `src/components/home/delivery-models.tsx` — the component's own markup can change visually, but the exported `DELIVERY_MODELS` constant's **shape** (not styling) must stay compatible with `/about`'s usage; do not remove the export.
- `src/components/home/featured-work.tsx` — same caveat: markup/animation is free to change, but the imported `projects` array's shape must stay compatible with `/about`'s usage of the same data.
- `src/components/home/latest-blogs.tsx` — safe to restyle, but do not change the shape of data read from `LATEST_POSTS_QUERY` (`src/sanity/lib/queries.ts`) without checking the solution-page related-posts fallback, which fetches the identical query.
- Section `id` attributes (`#contact`, `#process`, `#services`, `#models`) — renaming any of these requires updating every inbound link in `Navbar`, `Hero`, `DeliveryModels`, `GymSolutionLanding`, `DentalSolutionLanding`, and `SolutionTemplate` simultaneously.

### DO NOT TOUCH DURING HOMEPAGE WORK

- `src/lib/niches.ts`, `src/lib/cities.ts`, `src/lib/routes.ts`, `src/lib/service-routes.ts`, `src/lib/services-catalog.ts`, `src/lib/keyword-map.ts` — the entire programmatic-SEO data/routing engine; homepage work should only _read_ `NICHES` (as `BentoGrid` already does), never modify these files.
- `src/lib/seo.ts`, `src/lib/structured-data.ts`, `src/lib/site.ts` — the sitewide metadata/JSON-LD/identity engine; used by every route including the homepage, but changes here are never "homepage-only" changes.
- `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`, `src/app/services.json/route.ts`, `src/app/feed.xml/route.ts`, `src/app/og/route.tsx` — the crawl layer; homepage's only footprint here is its single `STATIC_ROUTES` entry, already correctly generic.
- Sanity schemas (`src/sanity/schemaTypes/*`) — content-model changes affect the CMS Studio and every content-editing workflow, far beyond the homepage.
- `src/components/layout/navbar.tsx`, `src/components/layout/footer.tsx`, `src/components/layout/skip-link.tsx`, `src/components/providers/client-enhancements.tsx`, `src/components/providers/smooth-scroll.tsx`, `src/components/ui/custom-cursor.tsx`, `src/components/ui/preloader.tsx` — all rendered once in the shared site layout; any change here is sitewide, never homepage-scoped.
- `src/components/chat-widget.tsx`, `src/app/api/chat/route.ts`, `src/lib/lead-store.ts`, `src/lib/booking.ts` — the AI chat/lead-capture system is global infrastructure the homepage merely triggers; changes here affect `/contact` and every solution page's CTA outcome too.
- `src/components/ui/button.tsx`, `src/components/ui/card.tsx`, `src/lib/utils.ts` — shared design primitives used across homepage, solutions, and blog surfaces.
- `src/app/layout.tsx` — root layout; contains the homepage's actual `<title>`/`<meta description>` (an exception worth remembering: editing the homepage's _metadata_ does require touching this file, but nothing else about it).

## PRIORITIZED REMEDIATION QUEUE

The sections above catalogue findings without ranking them. This queue orders every actionable item by impact-to-effort, so the next work session can start at the top rather than re-deriving priorities. Ordering is by severity and blast radius, not by effort.

**Tier 1 — correctness and accessibility defects with real user impact**

1. **Add `focus-visible` styling to every hand-rolled `<button>`** (§23). WCAG 2.4.7. Concentrated on the homepage's primary conversion control and the entire chat interface — the sole lead-capture path. A keyboard user can tab into the chat with no visible focus indicator. The cheapest durable fix is to route these through the existing `Button` primitive, which already carries the ring, rather than patching classNames one by one.
2. **Give the chat input an accessible name** (§23). One `aria-label` on [`chat-widget.tsx`](src/components/chat-widget.tsx:173). WCAG 3.3.2.
3. **Raise the failing opacity-modifier contrasts** (§23). The `/50`, `/40`, `/30` foreground modifiers land near 2.3:1 against a 4.5:1 requirement. The nav links and chat placeholder are functional UI, not decoration.
4. **Fix the stale comment in [`hero.tsx`](src/components/home/hero.tsx:16)** (§7). It asserts `opacity: 1` where the stylesheet sets `opacity: 0`. This comment already propagated one error into this report; leaving it invites the same mistake again.

**Tier 2 — measurement gaps that block informed decisions**

5. **Add conversion-event tracking** (§24). There is currently no way to know which of the four homepage CTAs drives chat opens, or to attribute a captured lead to its referring solution page. Every future homepage decision is otherwise guesswork. This is the highest-leverage item in the report for business outcomes even though it is not a defect.
6. **Run a production Lighthouse pass** (§22). Findings F-12, F-13, and F-19 have been open since the original audit. The Hero reveal-delay arithmetic in §22 gives a concrete hypothesis to test rather than a blind measurement.
7. **Wire a lead notification** (§26). A captured lead currently sits in Sanity with no Slack or email alert, while the visitor is told the team will reach out within one business day. That promise depends on someone manually checking Studio.

**Tier 3 — technical debt and hygiene**

8. **Read the `?niche=`/`?city=` params in `ContactForm`** (§7, §27). Solution pages already append them; the component silently drops them. The highest-intent arrivals on the site get generic messaging.
9. **Add a build-time parity check between `NICHES` and `services-catalog.ts`** (§26). The AI chat's knowledge base is a hand-maintained mirror with no test enforcing it. Drift here means the chat misdescribes live pages.
10. **Delete the dead code** (§26): `BusinessOutcomes`, `HotelHyderabadLanding`, `submitLead`, and the duplicate `src/public/` directory.
11. **Move migration-only packages to `devDependencies`** (§26): `axios`, `dotenv`, `@sanity/block-tools`, `@sanity/schema`, plus `jsdom`.
12. **Extract the duplicated mouse-spotlight pattern** (§20) into a shared hook. Cosmetic; lowest priority.
13. **Confirm `FOUNDING_YEAR`** (§26). A placeholder year is rendering on a live `/about` page.
14. **Refresh `BLOGSPAGE_AI_CONTEXT.md`** (§26). Its documented GROQ queries no longer match `queries.ts`.

**Explicitly not recommended**: none of the above requires touching `src/lib/niches.ts`, `seo.ts`, `structured-data.ts`, or the crawl layer. The §29 boundary holds for the entire queue except item 9, which adds a test rather than modifying the engine.

## CURRENT ARCHITECTURAL CONFIDENCE

**High-confidence findings** (directly read from source code, unambiguous):

- The exact homepage component tree, server/client boundaries, and section ordering (§5, §6).
- The full programmatic SEO slug-generation/resolution algorithm and its test-verified determinism (§11–§14).
- The AI chat's system prompt, tool schema, and lead-storage fallback behavior (§10).
- The complete absence of GA/GTM/Clarity/custom-event tracking (§24).
- The dead-code status of `BusinessOutcomes`, `HotelHyderabadLanding`, and `submitLead` (confirmed via repository-wide search for importers).
- The shared-dependency relationships between homepage components and `/about` (`DELIVERY_MODELS`, `projects`) — confirmed by reading `/about`'s actual imports.
- The homepage anchor-ID contract with solution pages (`#contact`, `#process`) — confirmed by reading every solution-page component's CTA hrefs.

**Resolved during the verification pass** (previously medium-confidence or uncertain; now measured or confirmed against source):

- **Contrast ratios** — computed from the palette hex values against WCAG 2.1 thresholds (§23). The base palette passes AA; the `/50`, `/40`, and `/30` opacity modifiers do not. This turned a hedge into the report's most actionable accessibility finding.
- **Focus states on hand-rolled buttons** — every non-`Button` `<button>` in the codebase was checked. None declare `focus-visible` styling (§23). Previously "not confirmed present"; now confirmed absent.
- **The chat input's accessible name** — confirmed to have no `<label>`, `aria-label`, or `aria-labelledby` (§23).
- **`motion.header` semantics** — settled as rendering a literal `<header>` element (§23).
- **The Hero `<h1>` opacity claim** — resolved against `globals.css` and corrected in §7, §22, and §23. The source file's own comment was the origin of the error.
- **`niches.ts` purity** — confirmed non-pure; it imports 10 runtime `lucide-react` components (§4).
- **Dependency hygiene** — every `package.json` entry traced to its actual import sites (§26).

**Medium-confidence findings that remain open** (reasonable inference from code patterns, not verifiable without runtime measurement):

- Performance risk rankings in §22 (e.g., `FeaturedWork`'s pinned scroll as the "highest cost" section) — based on code-pattern analysis (continuous `useTransform`, `h-[400vh]` container), not actual Lighthouse/profiler measurement. The _relative_ ranking is well-supported by the code; the absolute magnitudes are not.
- The precise LCP delta introduced by the Hero reveal delay — the delay arithmetic in §22 is exact, but how it composites with font loading, image decode, and network conditions into a final LCP number requires real measurement.
- Contrast for text sitting on gradient overlays (Hero, CtaSection) rather than flat `--background` — the flat-color ratios in §23 are exact; composited-over-gradient values still need a rendered check.

**Areas where repository evidence is insufficient** (do not invent — flagged per the task's explicit instruction):

- **Actual Lighthouse/Core Web Vitals numbers** for the homepage in production — the audit report itself explicitly states these were never measured (Findings F-12, F-13, F-19 remain open pending live-site data); this report cannot supply what the audit could not.
- **Whether `/about` has actually been deployed to production** with the unconfirmed `FOUNDING_YEAR` placeholder rendered — the code renders it, but this report cannot confirm production deployment state.
- **Rendered-state contrast verification** — the flat-token ratios in §23 are now computed, but confirming them against real composited styles (gradient backdrops, backdrop-blur surfaces, images behind text) still requires rendering the page with a contrast tool. The computed ratios narrow this gap; they do not fully close it.
- **Whether Search Console verification exists outside the codebase** (e.g., via DNS TXT record rather than a meta tag) — the repository shows no in-code verification artifact, but an out-of-band DNS-based verification cannot be ruled out from source code alone.
- **Real-world conversion data** — which CTA actually performs best, how many leads the AI chat has captured historically, or actual chat-abandonment rates — none of this exists in the repository; any such claim would need to come from Sanity's live `lead` document count or a live-analytics source, neither of which this static-code analysis can access.
