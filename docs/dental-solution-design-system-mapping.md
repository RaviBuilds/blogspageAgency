# Dental Solution Page — Design System Mapping & Component Reuse Strategy

> **Document type:** Design Systems Lead Blueprint (no code)
> **Date:** July 29, 2026
> **Constraint:** Maximize reuse of existing Blogspage design language, components, spacing, typography, animation. Minimize net-new component creation.
> **Prerequisite:** Builds on `docs/dental-solution-ia-redesign.md` and `docs/dental-solution-content-blueprint.md`

---

## PART 1: EXISTING DESIGN LANGUAGE (Codified)

### Typography Hierarchy

| Level | Usage | Classes | Source |
|---|---|---|---|
| Display | Homepage H1 only | `text-5xl sm:text-7xl lg:text-[7.5rem] font-semibold tracking-tighter leading-[0.85]` | `home/hero.tsx` |
| H1 | Page hero headlines | `text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-balance` | `SolutionHero` |
| H1 (Gym variant) | Custom landing hero | `text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-balance` | `GymSolutionLanding` |
| H2 | Section headings | `text-3xl font-semibold tracking-tight` or `sm:text-4xl` | All section components |
| H3 | Card/subsection titles | `text-lg font-medium` or `text-xl font-semibold tracking-tight` | `SolutionTemplate`, `ProcessTimeline` |
| Section label | Above H2 | `text-sm font-medium text-primary` | Universal pattern |
| Body | Paragraphs | `text-base leading-relaxed text-muted-foreground` or `text-lg` | All pages |
| Small body | Card descriptions | `text-sm leading-relaxed text-muted-foreground` | Cards throughout |
| Micro | Badges, metadata | `text-xs font-medium uppercase tracking-[0.18em] text-primary` | Timeline phases |

### Spacing Scale

| Token | Value | Usage |
|---|---|---|
| Section vertical (solution) | `py-20 lg:py-24` | Standard solution page sections |
| Section vertical (homepage) | `py-24 lg:py-32` | Homepage sections |
| Section vertical (hero) | `pb-20 pt-20 lg:pb-28 lg:pt-28` | Hero sections |
| Container | `mx-auto max-w-6xl px-6 lg:px-8` | Universal page content |
| Container (wide) | `mx-auto max-w-7xl px-6 lg:px-8` | Homepage hero only |
| Grid gap (cards) | `gap-4` to `gap-6` | Card grids |
| Grid gap (sections) | `gap-10` to `gap-12` | Two-column layouts |
| Stack gap (items) | `gap-3` | Lists, feature items |
| Component internal | `p-5` to `p-6` | Card padding |
| Large card internal | `p-8 lg:p-10` or `p-10 lg:p-14` | Feature cards, CTA cards |

### Container Widths

| Width | Class | Where Used |
|---|---|---|
| Page max | `max-w-6xl` | All solution pages, most homepage sections |
| Wide page | `max-w-7xl` | Homepage hero only |
| Content constrained | `max-w-3xl` | Section intros, timeline |
| Text constrained | `max-w-2xl` | Section descriptions, CTA copy |
| Narrow text | `max-w-xl` | Footer description |

### Grid Patterns

| Pattern | Classes | Where Used |
|---|---|---|
| Asymmetric two-col | `lg:grid-cols-[0.8fr_1.2fr]` | Problem section (SolutionTemplate) |
| Equal two-col | `lg:grid-cols-2` | Dashboard previews, comparison |
| Balanced two-col | `lg:grid-cols-[1.1fr_0.9fr]` | Case study card |
| Three-col | `sm:grid-cols-3` | Metrics |
| Blog grid | `sm:grid-cols-2 lg:grid-cols-3` | Blog cards, solution hub cards |
| Four-col (proposed) | `sm:grid-cols-2 lg:grid-cols-4` | Not yet used — dental metrics |

### Border & Card Philosophy

| Element | Treatment |
|---|---|
| Section dividers | `border-t border-white/[0.06]` (solution) or `border-white/[0.08]` (home) |
| Card borders | `border border-white/[0.08]` (standard) |
| Card hover | `hover:border-white/[0.16]` or `hover:border-primary/40` |
| Card background | `bg-card` (`#0f1011`) or `bg-white/[0.02]` (glass) |
| Card radius | `rounded-xl` (standard) or `rounded-2xl` (feature cards) |
| Inner subtle borders | `border-white/[0.06]` (even more subtle) |

### Button Hierarchy

| Level | Usage | Classes |
|---|---|---|
| Primary (hero) | Main page CTA | `glow-border h-11 bg-primary px-6 text-primary-foreground` (solution) or `bg-white text-black` (homepage/gym) |
| Secondary | Alternative action | `variant="outline" h-11 border-white/10 bg-transparent px-6 hover:bg-white/[0.04]` |
| Navbar CTA | Top nav | `rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black` |
| Magnetic (CTA section) | Homepage bottom | Custom magnetic spring button with glow ring |
| Text link | Inline action | `text-sm font-medium text-primary` with arrow icon |

### Color System

| Semantic | Hex | CSS Variable | Usage |
|---|---|---|---|
| Background | `#010102` | `--background` | Page backgrounds |
| Card | `#0f1011` | `--card` | Elevated surfaces |
| Popover | `#141516` | `--popover` | Highest elevation |
| Primary | `#5e6ad2` | `--primary` | Accent, labels, icons, links |
| Foreground | `#f7f8f8` | `--foreground` | Headings, primary text |
| Muted foreground | `#8a8f98` | `--muted-foreground` | Body copy, descriptions |
| Border | `#23252a` | `--border` | Visible borders |
| Subtle border | `rgba(255,255,255,0.08)` | Inline | Card borders, dividers |
| Destructive | `#ef4444` | `--destructive` | Error states only |
| Success/positive | Emerald-300/400 | Inline | Comparison "good" column |
| Negative | Red-400/500 | Inline | Comparison "bad" column |

### Gradient & Glow Usage

| Pattern | Definition | Where Used |
|---|---|---|
| `.gradient-mesh` | Three radial gradients with primary colors | Solution hero backgrounds |
| `.text-gradient` | Linear gradient text (foreground → primary) | Accent words in headlines |
| `.glow-border` | Box-shadow with primary halo | Primary CTA buttons |
| Decorative blur | `rounded-full bg-primary/15 blur-3xl` (absolute positioned) | Case study, CTA cards |
| Ambient hero glow | Large radial gradient, absolute, `-z-10` | Hero backgrounds |

### Motion Philosophy

| Principle | Implementation |
|---|---|
| Spring physics for entrances | `SPRING = { type: "spring", stiffness: 100, damping: 20, mass: 1 }` |
| Cubic-bezier for durations | `EASE = [0.16, 1, 0.3, 1]` |
| Scroll-triggered reveals | `whileInView={{ opacity: 1, y: 0 }}` with `viewport={{ once: true }}` |
| Hardware-accelerated only | `transform` + `opacity` only — no layout triggers |
| Stagger children | `staggerChildren: 0.08` to `0.12` |
| `FadeUp` as universal primitive | `y: 24 → 0`, `opacity: 0 → 1`, duration 0.6s |
| Reduced motion respect | Lenis skips, preloader skips, FadeUp still works (CSS fallback) |
| Hover micro-interactions | `hover:scale-[1.02]`, `hover:translate-x-0.5` |

### Icon Style

| Rule | Details |
|---|---|
| Library | Lucide React (monochrome, geometric) |
| Standard size | `size-4` (16px) |
| Badge container | `size-10 rounded-xl border border-border bg-muted flex items-center justify-center` |
| Color | `text-primary` (accent) or `text-muted-foreground` (subtle) |
| CTA arrows | `ArrowRight size-4` appended to button text |
| Never | Multi-color icons, custom SVG illustrations, emoji |

---

## PART 2: SECTION-BY-SECTION COMPONENT MAPPING

### Section 1: Hero

| Attribute | Value |
|---|---|
| **Purpose** | Outcome-first headline with dual CTAs |
| **Existing component to reuse** | `SolutionHero` (`src/components/solutions/solution-hero.tsx`) |
| **Existing component to adapt** | None — `SolutionHero` already accepts `niche`, `city`, `cityLabel` props and renders the exact pattern needed |
| **New component required?** | **No** |
| **Why** | `SolutionHero` already renders: pill badge, H1, subhead, two CTA buttons, `gradient-mesh` background, `FadeUp` stagger pattern. Only the DATA (headline, subhead) changes — not the component. |
| **Estimated modification effort** | Zero component changes. Content-only update in `niches.ts` hero data. |
| **Desktop layout** | `max-w-6xl`, `max-w-3xl` for text column, left-aligned. `pb-20 pt-20 lg:pb-28 lg:pt-28` |
| **Tablet layout** | Same as desktop, narrower text wrap |
| **Mobile layout** | `text-4xl` H1, full-width, CTA buttons stack (`flex-col`) |
| **Animation** | Sequential `FadeUp` delays: pill 0, H1 0.06, subhead 0.12, CTAs 0.18 |
| **Accessibility** | H1 visible in server HTML (no JS dependency), `aria-label` on brand link |
| **SEO** | H1 contains primary keywords, subhead crawlable text |
| **Performance** | Zero JS for content rendering (RSC). `gradient-mesh` is CSS-only. |

---

### Section 2: Social Proof Metrics Bar

| Attribute | Value |
|---|---|
| **Purpose** | Credibility anchor with concrete numbers |
| **Existing component to reuse** | Metrics grid from `SolutionTemplate` (the "Localized conversion metrics" section) |
| **Existing component to adapt** | Expand from 3-column to 4-column grid |
| **New component required?** | **No** |
| **Why** | The exact pattern exists: `sm:grid-cols-3` grid of cards with large value + label. For dental, we just add one more metric and change to `sm:grid-cols-2 lg:grid-cols-4`. The card structure (`rounded-xl border border-white/[0.08] bg-card p-6 text-center`) is identical. |
| **Estimated modification effort** | Content data change in `NICHE_ENRICHMENT["dental-medical"].metrics` (add 4th metric). Grid class change via custom dental component OR conditional in template. |
| **Desktop layout** | `grid sm:grid-cols-2 lg:grid-cols-4 gap-4` within `max-w-6xl` container |
| **Tablet layout** | `sm:grid-cols-2` (2×2 grid) |
| **Mobile layout** | `grid-cols-2` (2×2 grid) — all four metrics visible without scrolling |
| **Animation** | Single `FadeUp` wrapping the entire grid (not per-card stagger) |
| **Accessibility** | Metric values as text (not images). `aria-label` on section for screen readers. |
| **SEO** | Metric labels contain keywords ("patient enquiries", "online booking") |
| **Performance** | Pure text rendering, no images, no JS dependency for display. |

---

### Section 3: The Problem

| Attribute | Value |
|---|---|
| **Purpose** | Mirror visitor's frustration in their language |
| **Existing component to reuse** | Problem section from `SolutionTemplate` — exact same structure |
| **Existing component to adapt** | None |
| **New component required?** | **No** |
| **Why** | The `SolutionTemplate` problem section already renders: section label + H2 + lead paragraph (left column) + stacked pain point cards with `TrendingDown` icon (right column). Layout: `lg:grid-cols-[0.8fr_1.2fr]`. Just change the content strings. |
| **Estimated modification effort** | Content-only. Update `niche.problem.heading`, `niche.problem.lead`, `niche.problem.points` in `niches.ts`. |
| **Desktop layout** | `lg:grid-cols-[0.8fr_1.2fr] gap-10` — text left, cards right |
| **Tablet layout** | Single column, text above cards |
| **Mobile layout** | Single column, full-width cards stacked |
| **Animation** | Left column: `FadeUp` no delay. Cards: `FadeUp` staggered `index * 0.08` |
| **Accessibility** | Semantic heading hierarchy, card text readable by screen readers |
| **SEO** | H2 + pain point text contain long-tail dental keywords naturally |
| **Performance** | No images, no heavy computation. Server-rendered text + Framer Motion reveal. |

---

### Section 4: Transformation (Before/After)

| Attribute | Value |
|---|---|
| **Purpose** | Before/after contrast creating desire for the "after" state |
| **Existing component to reuse** | `ComparisonSection` pattern from homepage (`src/components/home/comparison-section.tsx`) |
| **Existing component to adapt** | Adapt the two-card layout with contrasting colors. Left card = muted/red (problems), Right card = elevated/emerald (solutions). |
| **New component required?** | **Partial — new section within dental landing component, built from existing `Card` primitive + existing decorative blur pattern** |
| **Why** | The homepage `ComparisonSection` is the closest analog: two `Card` components side-by-side, one representing "before" (red accents, `XCircle` icons) and one representing "after" (emerald accents, `CheckCircle2` icons). The dental version uses the same visual language but with different content and simpler list items. No new primitives needed — just composition of existing `Card` + icon + color patterns. |
| **Estimated modification effort** | Low-medium. Compose from `Card` + `CardHeader` + `CardContent` + Lucide icons. Reuse exact border/glow/blur patterns from `ComparisonSection`. ~40 lines of new JSX within the dental landing component. |
| **Desktop layout** | `lg:grid-cols-2 gap-5` — two equal cards side by side |
| **Tablet layout** | `lg:grid-cols-2` (still side-by-side on tablet) |
| **Mobile layout** | Single column, "Without" card above "With" card |
| **Animation** | Container stagger: `staggerChildren: 0.1`. Each card: `FadeUp` variant. |
| **Accessibility** | Each column has a clear heading ("Without" / "With Blogspage"). List items with semantic `<ul>/<li>`. Icons have `aria-hidden`. |
| **SEO** | "With" column contains target keywords: "Page 1", "online booking", "Google reviews" |
| **Performance** | Text-only cards with CSS decorative blurs (no images). Lightweight. |

---

### Section 5: What You Get (Solution Benefits)

| Attribute | Value |
|---|---|
| **Purpose** | Make the offering concrete with benefit-framed features |
| **Existing component to reuse** | Solution section card pattern from `SolutionTemplate` (capabilities list with `Check` icons) |
| **Existing component to adapt** | Expand from a single list to a bento-grid of individual benefit cards. Pattern reference: `GymSolutionLanding` pillar feature lists (icon container + label pattern). |
| **New component required?** | **Partial — card grid composition within dental landing, using existing icon-container + card patterns** |
| **Why** | The existing solution section in `SolutionTemplate` is a single card with a bulleted list. For dental, we want individual cards per benefit (7 cards in a grid) for stronger visual impact. The card structure already exists: `rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3` (from gym feature list items). The icon container pattern exists: `size-8 rounded-lg border border-white/[0.08] bg-primary/10` (from gym). Just compose into a grid. |
| **Estimated modification effort** | Medium. 7 benefit cards in a grid, each with icon-container + heading + description. All primitives exist — it's composition work (~60 lines). |
| **Desktop layout** | `md:grid-cols-2 lg:grid-cols-3 gap-4` (7 cards, asymmetric bento possible) |
| **Tablet layout** | `md:grid-cols-2` (4+3 arrangement) |
| **Mobile layout** | Single column, full-width stacked cards |
| **Animation** | Cards staggered `FadeUp` with `delay={index * 0.06}` |
| **Accessibility** | Each card has heading + description. Icons `aria-hidden`. |
| **SEO** | Card headings target long-tails: "online booking system", "local SEO", "Google reviews" |
| **Performance** | Text + icons only. No images. Lucide icons are tree-shaken SVGs. |

---

### Section 6: Visual Preview (Dashboard Mockups)

| Attribute | Value |
|---|---|
| **Purpose** | Make the product tangible with interface previews |
| **Existing component to reuse** | Dashboard preview pattern from `SolutionTemplate` (window chrome + skeleton UI) |
| **Existing component to adapt** | Customize the inner skeleton shapes to look dental-specific (date picker + time slots for patient view; calendar + stats for admin view) |
| **New component required?** | **No** — but skeleton inner content changes |
| **Why** | The `SolutionTemplate` already renders exactly this: `md:grid-cols-2` grid, each card with traffic-light window chrome header + `aspect-[16/10]` skeleton area + title/description below. The dental page just needs different placeholder shapes inside the skeleton area. |
| **Estimated modification effort** | Low. The skeleton area content (div shapes) can be customized within the dental data or inline. The structural component is unchanged. |
| **Desktop layout** | `md:grid-cols-2 gap-4` — two mockup cards side by side |
| **Tablet layout** | Same as desktop |
| **Mobile layout** | Single column, stacked |
| **Animation** | Cards staggered `FadeUp` with `delay={index * 0.08}`. Hover: `hover:border-white/[0.16]` |
| **Accessibility** | Skeleton area `aria-hidden`. Title/description below each mockup carries semantic content. |
| **SEO** | H3 titles ("Patient booking flow", "Clinic command centre") are crawlable |
| **Performance** | CSS-only skeletons. No images loaded. Zero layout shift. |

---

### Section 7: Case Study

| Attribute | Value |
|---|---|
| **Purpose** | Proof via named, local, specific results |
| **Existing component to reuse** | Case study section from `SolutionTemplate` (already renders when `niche.caseStudy` exists) |
| **Existing component to adapt** | None — exact same structure |
| **New component required?** | **No** |
| **Why** | The `SolutionTemplate` already conditionally renders a case study card when `niche.caseStudy` is defined. Structure: `rounded-2xl border border-white/[0.08] bg-card p-8 lg:p-10`, decorative blur, two-column grid (`lg:grid-cols-[1.1fr_0.9fr]`), `Sparkles` icon label, narrative paragraph, tech stack badges, outcomes list with `Check` icons. All we need is to ADD a `caseStudy` object to the dental niche data. |
| **Estimated modification effort** | Content-only. Add `caseStudy` property to `dental-medical` niche in `niches.ts` with title, narrative, stack array, and outcomes array. |
| **Desktop layout** | Single large card, `lg:grid-cols-[1.1fr_0.9fr]` internal. Decorative blur upper-left. |
| **Tablet layout** | Single column within the card |
| **Mobile layout** | Single column, narrative → badges → outcomes stacked |
| **Animation** | Single `FadeUp` on entire card |
| **Accessibility** | Semantic heading, list items. Sparkles icon `aria-hidden`. |
| **SEO** | H2 with location + specific numbers. Outcomes contain keywords. |
| **Performance** | Text-only card. Decorative blur is CSS. No image load. |

---

### Section 8: Investment (Pricing)

| Attribute | Value |
|---|---|
| **Purpose** | Frame cost as ROI investment |
| **Existing component to reuse** | CTA card pattern from `SolutionTemplate`'s "Local SEO CTA" section |
| **Existing component to adapt** | Same `rounded-2xl border border-white/[0.08] bg-card p-10 text-center lg:p-14` container with decorative blur, but with different internal content (ROI math + value list + CTA instead of headline + buttons) |
| **New component required?** | **Partial — new section within dental landing, built from existing card + button + list primitives** |
| **Why** | No pricing section exists in any current page. However, the visual container is identical to the existing CTA card (rounded, bordered, padded, centered text, decorative blur). The internal content is unique: ROI calculation text, value checklist, and a CTA button. All sub-elements (text hierarchy, `Check` icons, `Button` component) already exist. |
| **Estimated modification effort** | Medium. New section composition (~50 lines) using existing card wrapper + text + list + button. No new primitives. |
| **Desktop layout** | Centered text within `max-w-2xl` inside the card. Single column. |
| **Tablet layout** | Same as desktop |
| **Mobile layout** | Same as desktop (centered layout is inherently responsive). CTA button full-width. |
| **Animation** | Single `FadeUp` on the entire card |
| **Accessibility** | ROI figures as text, not images. `Check` icons `aria-hidden`. Button accessible. |
| **SEO** | Section heading targets "dental website cost/investment" queries. Body text contains procedure costs (rich content for AI citations). |
| **Performance** | Pure text. Zero images. Single decorative blur (CSS). |

---

### Section 9: How It Works (Process/Timeline)

| Attribute | Value |
|---|---|
| **Purpose** | Show the 14-day path from kickoff to live |
| **Existing component to reuse** | Launch schedule section from `SolutionTemplate` (vertical timeline with dots) |
| **Existing component to adapt** | None — exact same structure |
| **New component required?** | **No** |
| **Why** | The `SolutionTemplate` already renders the launch schedule as a vertical timeline: `border-l border-white/[0.1]` line, dot markers (`bg-primary rounded-full`), phase window in uppercase, title, detail text. Data comes from `niche.launchSchedule`. We just update the data. |
| **Estimated modification effort** | Content-only. Update `NICHE_ENRICHMENT["dental-medical"].launchSchedule` in `niches.ts` with business-language phases. |
| **Desktop layout** | Single column timeline, left-aligned within `max-w-6xl` container |
| **Tablet layout** | Same as desktop |
| **Mobile layout** | Same (vertical timeline is inherently mobile-friendly) |
| **Animation** | Heading: `FadeUp`. Timeline items: staggered `FadeUp` with `delay={index * 0.06}` |
| **Accessibility** | Semantic `<ol>` with `<li>` items. Timeline dots decorative (`aria-hidden`). |
| **SEO** | Targets "how long to build dental website" queries. Step descriptions contain keywords. |
| **Performance** | Text-only. No images. Lightweight Framer Motion reveals. |

---

### Section 10: FAQ

| Attribute | Value |
|---|---|
| **Purpose** | Eliminate final purchase objections |
| **Existing component to reuse** | FAQ rendering from `SolutionTemplate` (renders `niche.faq` array) |
| **Existing component to adapt** | The existing pattern renders FAQ as visible Q&A pairs (not accordion). For 8 questions, consider adding accordion behavior for mobile. |
| **New component required?** | **Optional — accordion wrapper for mobile UX** |
| **Why** | The existing `SolutionTemplate` renders FAQ pairs as simple stacked text blocks (question heading + answer paragraph). This works for 3 questions. With 8 questions (dental), it creates a long scroll on mobile. An accordion pattern (click to expand) would improve mobile UX. However, this is an enhancement, not a requirement — the visible-all pattern still works. If an accordion is added, it's a generic component reusable across all niches. |
| **Estimated modification effort** | Low (content-only if using existing visible pattern). Medium if adding accordion (new generic `<Accordion>` component, ~40 lines, reusable site-wide). |
| **Desktop layout** | Stacked Q&A pairs within `max-w-3xl` centered container |
| **Tablet layout** | Same as desktop |
| **Mobile layout** | Same structure but accordion (click-to-expand) recommended |
| **Animation** | Staggered `FadeUp` per Q&A pair. Accordion open/close: `AnimatePresence` height animation. |
| **Accessibility** | Accordion uses `<button>` with `aria-expanded`, `aria-controls`. Answer regions use `role="region"` with `aria-labelledby`. |
| **SEO** | FAQ schema auto-generated via `faqNode()`. Questions target long-tail queries. |
| **Performance** | Text-only. Accordion JS is minimal (height animation). |

---

### Section 11: Final CTA

| Attribute | Value |
|---|---|
| **Purpose** | Convert the convinced visitor |
| **Existing component to reuse** | "Local SEO CTA" section from `SolutionTemplate` — exact pattern |
| **Existing component to adapt** | None |
| **New component required?** | **No** |
| **Why** | The `SolutionTemplate` already ends with exactly this: `rounded-2xl border border-white/[0.08] bg-card p-10 text-center lg:p-14`, decorative blur, H2 (`text-3xl sm:text-4xl`), supporting paragraph, and two buttons (primary + outline). Data-driven from `niche.title`, `cityLabel`. Just update the niche content. |
| **Estimated modification effort** | Content-only. The headline and supporting text come from the template's interpolation of niche data. Updating `niche.title` and ensuring the CTA text flows naturally is sufficient. |
| **Desktop layout** | Centered card, `max-w-2xl` text, buttons row |
| **Tablet layout** | Same |
| **Mobile layout** | Buttons stack (`flex-col`), card at near-full bleed |
| **Animation** | Single `FadeUp` on entire card. Decorative blur scales in. |
| **Accessibility** | CTA buttons have descriptive text. Decorative blur `aria-hidden`. |
| **SEO** | H2 contains "dental clinic" + "Hyderabad" one final time |
| **Performance** | Text + CSS blur. Zero images. Negligible paint cost. |

---

### Section 12: Related Reading

| Attribute | Value |
|---|---|
| **Purpose** | Retain visitors not ready to convert |
| **Existing component to reuse** | Related posts rendering already exists in `SolutionTemplate` (uses `relatedPosts` prop + `LATEST_POSTS_QUERY`) |
| **Existing component to adapt** | None |
| **New component required?** | **No** |
| **Why** | The `SolutionTemplate` already renders a related reading section at the bottom using the `relatedPosts` prop (fetched in `[slug]/page.tsx` via `LATEST_POSTS_QUERY`). Blog card pattern matches `LatestBlogs` from homepage. |
| **Estimated modification effort** | Zero. Already implemented. Data flows from Sanity via existing query. |
| **Desktop layout** | `sm:grid-cols-2 lg:grid-cols-3 gap-6` blog cards |
| **Tablet layout** | `sm:grid-cols-2` |
| **Mobile layout** | Single column |
| **Animation** | Staggered `FadeUp` per card |
| **Accessibility** | Blog links have descriptive titles. Dates in `<time>` elements. |
| **SEO** | Internal links from solution → blog posts strengthen topical cluster |
| **Performance** | Text-only blog cards. No images loaded (blog cards are title + date). |

---

## PART 3: COMPONENT INVENTORY

### Reusable Sections (No Modification Needed)

| Component | File | Dental Usage |
|---|---|---|
| `SolutionHero` | `solutions/solution-hero.tsx` | Hero section |
| Problem section (in `SolutionTemplate`) | `solutions/solution-template.tsx` | Problem section |
| Dashboard previews (in `SolutionTemplate`) | `solutions/solution-template.tsx` | Visual Preview section |
| Case study (in `SolutionTemplate`) | `solutions/solution-template.tsx` | Case Study section |
| Metrics grid (in `SolutionTemplate`) | `solutions/solution-template.tsx` | Metrics bar |
| Launch schedule (in `SolutionTemplate`) | `solutions/solution-template.tsx` | Process/Timeline |
| Local SEO CTA (in `SolutionTemplate`) | `solutions/solution-template.tsx` | Final CTA |
| Related posts (in `SolutionTemplate`) | `solutions/solution-template.tsx` | Related Reading |
| FAQ section (in `SolutionTemplate`) | `solutions/solution-template.tsx` | FAQ |
| `Breadcrumb` | `seo/breadcrumb.tsx` | Page breadcrumb |
| `JsonLd` | `seo/json-ld.tsx` | Structured data |

### Reusable Cards

| Pattern | Structure | Dental Usage |
|---|---|---|
| Metric card | `rounded-xl border border-white/[0.08] bg-card p-6 text-center` | Metrics bar items |
| Pain point card | `rounded-xl border border-white/[0.08] bg-card p-5` + icon + text | Problem section items |
| Feature list item | `rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3` + icon container | Benefit cards |
| Dashboard mockup card | `rounded-xl border border-white/[0.08] bg-card` + window chrome + skeleton | Visual Preview |
| Outcome card | `rounded-xl border border-white/[0.08] bg-popover p-4` + Check icon | Case study outcomes |
| Blog card | `rounded-lg border border-border bg-card p-6 hover:scale-[1.02] hover:border-primary` | Related reading |
| CTA container card | `rounded-2xl border border-white/[0.08] bg-card p-10 lg:p-14` + blur | Final CTA, Pricing |
| Case study card | `rounded-2xl border border-white/[0.08] bg-card p-8 lg:p-10` + blur + two-col | Case study |
| Comparison card | `Card` component + colored glow + icon + list | Transformation section |

### Reusable Buttons

| Variant | Usage | Pattern |
|---|---|---|
| Primary (solution) | "Start a Project" | `Button size="lg" className="glow-border h-11 bg-primary px-6 text-primary-foreground"` |
| Outline (solution) | "See our process" | `Button size="lg" variant="outline" className="h-11 border-white/10 bg-transparent px-6"` |
| Primary (homepage) | "Deploy your AI system" | `Button size="lg" className="glow-border h-11 bg-white px-6 text-black"` |
| Navbar CTA | "Start a Project" | `rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black` |

### Reusable Badges / Pills

| Pattern | Structure | Usage |
|---|---|---|
| Hero pill | `rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-muted-foreground` + icon | Above hero H1 |
| Tech stack badge | `rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1 text-xs` | Case study tech |
| Phase label | `text-xs font-medium uppercase tracking-[0.18em] text-primary` | Timeline windows |
| Section label | `text-sm font-medium text-primary` | Above every H2 |

### Feature Lists

| Pattern | Item Structure | Usage |
|---|---|---|
| Check list (solution) | `flex gap-3 text-sm text-muted-foreground` + `Check size-4 text-primary` | Solution capabilities |
| Icon-container list (gym) | `flex items-center gap-3 rounded-xl border bg-white/[0.02] px-4 py-3` + `size-8 rounded-lg border bg-primary/10` icon box | Benefit cards |
| Pain point list | `flex gap-3 rounded-xl border bg-card p-5` + `TrendingDown size-4 text-primary` | Problem section |
| Bullet list (comparison) | `flex gap-3 text-sm` + dot or `CheckCircle2` | Before/after items |

### CTA Blocks

| Pattern | Location | Structure |
|---|---|---|
| Solution page CTA | End of `SolutionTemplate` | `rounded-2xl bg-card p-10 text-center` + blur + H2 + text + buttons |
| Homepage CTA | `cta-section.tsx` | Full section with marquee + magnetic button |
| Inline CTA (mid-page) | After case study / after pricing | Same primary + secondary button pair |

### FAQ Component

| Current Pattern | Structure |
|---|---|
| Visible-all | Stacked Q&A pairs, question as `<h3>`, answer as `<p>` |
| Proposed enhancement | Accordion with `AnimatePresence` height animation (new, reusable) |

### Timeline Component

| Pattern | Structure |
|---|---|
| Solution timeline | `border-l border-white/[0.1]` + absolute dot markers + stacked items |
| Homepage timeline | `ProcessTimeline` with scroll-driven SVG line + step cards |
| Dental usage | Solution timeline pattern (simpler, appropriate for the page) |

### Icons (Lucide — Used in Dental)

| Icon | Usage |
|---|---|
| `Stethoscope` | Niche identifier (hero pill, solution hub card) |
| `ArrowRight` | CTA buttons |
| `Check` | Solution capabilities, case study outcomes, pricing value list |
| `TrendingDown` | Problem section pain points |
| `Sparkles` | Case study label |
| `Globe` | Website benefit card |
| `CalendarCheck` / `Clock` | Booking benefit card |
| `Search` / `MapPin` | SEO benefit card |
| `Bell` / `MessageSquare` | Reminders benefit card |
| `Star` / `ThumbsUp` | Reviews benefit card |
| `BarChart3` / `TrendingUp` | Analytics benefit card |
| `Bot` / `Sparkles` | AI chat benefit card |
| `XCircle` | Transformation "without" column |
| `CheckCircle2` | Transformation "with" column |
| `ChevronDown` | FAQ accordion toggle (if implemented) |

### Containers & Spacing

| Pattern | Classes | Where |
|---|---|---|
| Page container | `mx-auto max-w-6xl px-6 lg:px-8` | Every section |
| Section spacing (solution) | `py-20 lg:py-24` | Between section dividers |
| Section divider | `border-t border-white/[0.06]` | Between all sections |
| Card internal (standard) | `p-5` or `p-6` | Standard cards |
| Card internal (large) | `p-8 lg:p-10` | Case study, feature card |
| Card internal (CTA) | `p-10 lg:p-14` | CTA containers |
| Heading to body gap | `mt-3` or `mt-4` | After H2 |
| Body to content gap | `mt-12` or `mt-16` | After section intro |

### Animation Primitives

| Primitive | Component/Pattern | Config |
|---|---|---|
| `FadeUp` | `solutions/fade-up.tsx` | `y: 24→0, opacity: 0→1, 0.6s, ease [0.16,1,0.3,1], once, margin -80px` |
| Stagger parent | Inline `motion.div` | `variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08-0.12 } } }}` |
| Spring | Config constant | `{ type: "spring", stiffness: 100, damping: 20, mass: 1 }` |
| Cubic-bezier ease | Config constant | `[0.16, 1, 0.3, 1]` |
| `AnimatePresence` | Height reveal (accordion, mobile nav) | `initial/animate/exit` with height auto |
| Hover scale | Inline class | `hover:scale-[1.02]` or `active:scale-[0.98]` |
| Decorative blur scale | Inline motion | `initial={{ scale: 0.6, opacity: 0 }}` → `animate={{ scale: 1, opacity: 1 }}` |

---

## PART 4: PRICING SECTION EVALUATION

### Can existing card components be adapted?

**Yes.** The pricing section's visual container is identical to the existing CTA card pattern (`rounded-2xl border border-white/[0.08] bg-card p-10 text-center lg:p-14` with decorative blur). Internal content is new (ROI math + value list) but composed from existing primitives:
- Text hierarchy (section label, H2, body text)
- Value checklist (`Check` icon + `text-sm` items)
- Primary button (`Button` with `glow-border`)

No new card component needed.

### Should pricing use comparison cards?

**No.** The `ComparisonSection` two-card pattern (freelancer vs us) is better suited for the Transformation section. For pricing, a single centered container with clear, focused messaging works better because:
- Multiple pricing cards imply packages/tiers (which contradicts the "custom scoping" strategy)
- Side-by-side price comparison invites mental math and comparison shopping
- The goal is to communicate VALUE, not OPTIONS

### Should there be a featured package?

**No.** The recommended pricing strategy (from the Content Blueprint) is Hybrid: ROI frame + indicative range + custom scoping. This doesn't require packages. A single card with:
1. ROI headline math
2. Value stack (what's included)
3. Indicative range (optional)
4. Single CTA button

This is cleaner and more premium than tiered packages.

### Should pricing appear before or after case studies?

**After.** The Content Blueprint positions pricing at section 8 (after case study at section 7). This is intentional:
- The visitor reads the price THROUGH THE LENS of proven results
- "₹1.5L–₹3.5L" after seeing "3.7x patient enquiries" feels like a bargain
- Placing pricing before proof makes the number feel abstract and expensive

### How should mobile stacking behave?

The pricing section is already a single centered card — it's inherently responsive. On mobile:
- Card padding reduces from `p-10` to `p-6`
- Text stays centered
- Value list items stack naturally (full-width)
- CTA button goes full-width
- No multi-column collapse needed (it's already single-column internally)

---

## PART 5: FINAL DELIVERABLES

### Deliverable 1: Component Reuse Matrix

| Dental Section | Reuse Level | Source Component | Effort |
|---|---|---|---|
| Hero | **100% reuse** | `SolutionHero` | Content data only |
| Metrics Bar | **95% reuse** | `SolutionTemplate` metrics section | Grid class tweak (3→4 cols) |
| Problem | **100% reuse** | `SolutionTemplate` problem section | Content data only |
| Transformation | **70% reuse** | `ComparisonSection` pattern + `Card` primitive | New composition (~40 LOC) |
| What You Get | **60% reuse** | Gym feature list pattern + card primitives | New composition (~60 LOC) |
| Visual Preview | **95% reuse** | `SolutionTemplate` dashboards section | Skeleton content tweak |
| Case Study | **100% reuse** | `SolutionTemplate` case study section | Content data only |
| Investment | **70% reuse** | CTA card container + list + button primitives | New composition (~50 LOC) |
| Timeline | **100% reuse** | `SolutionTemplate` launch schedule | Content data only |
| FAQ | **90% reuse** | `SolutionTemplate` FAQ section | Content data only (accordion optional) |
| Final CTA | **100% reuse** | `SolutionTemplate` CTA section | Content data only |
| Related Reading | **100% reuse** | `SolutionTemplate` related posts | Zero changes |

**Summary:** 7 of 12 sections require ZERO component changes (content-only). 3 sections need light adaptation. 2 sections need new composition from existing primitives. Zero new UI primitives required.

---

### Deliverable 2: Design Consistency Checklist

| Rule | Check |
|---|---|
| All sections use `border-t border-white/[0.06]` dividers | ☐ |
| All sections use `py-20 lg:py-24` vertical spacing | ☐ |
| All containers use `mx-auto max-w-6xl px-6 lg:px-8` | ☐ |
| All section labels are `text-sm font-medium text-primary` | ☐ |
| All H2s are `text-3xl font-semibold tracking-tight` | ☐ |
| All body text is `text-muted-foreground` with `leading-relaxed` | ☐ |
| All cards use `rounded-xl border border-white/[0.08]` | ☐ |
| Primary CTA uses `glow-border` + `bg-primary` pattern | ☐ |
| Secondary CTA uses `variant="outline"` + `border-white/10` | ☐ |
| All animations use `FadeUp` or spring-based reveals | ☐ |
| All stagger delays use `0.06`–`0.12` per item | ☐ |
| All icons are Lucide with `text-primary` accent | ☐ |
| No new colors introduced outside the palette | ☐ |
| No new font sizes outside the existing hierarchy | ☐ |
| No new spacing values outside the scale | ☐ |
| Decorative blurs use existing `bg-primary/15 blur-3xl` pattern | ☐ |
| Mobile breakpoints follow `sm:` → `md:` → `lg:` progression | ☐ |
| Hero pill badge matches existing pattern exactly | ☐ |
| Tech badges match existing `rounded-full border border-white/[0.1]` | ☐ |
| `viewport={{ once: true }}` on all scroll reveals | ☐ |

---

### Deliverable 3: Required New Components

| Component | Type | Effort | Justification |
|---|---|---|---|
| `DentalSolutionLanding` | Page-level composition | Medium (200–250 LOC) | Custom section ordering that differs from generic template (adds Transformation + Pricing sections, reorders metrics). Follows `GymSolutionLanding` precedent. |
| Transformation section (inline) | Section within `DentalSolutionLanding` | Low (~40 LOC) | Before/after two-card layout. Uses existing `Card` + icon patterns. Not a standalone component — inline section within the dental landing. |
| Benefits grid (inline) | Section within `DentalSolutionLanding` | Low-medium (~60 LOC) | 7-card bento grid. Uses existing card + icon-container patterns. Inline section. |
| Investment section (inline) | Section within `DentalSolutionLanding` | Low (~50 LOC) | ROI framing + value list + CTA. Uses existing CTA card container. Inline section. |
| `Accordion` (optional) | Reusable UI component | Low (~40 LOC) | Click-to-expand FAQ pattern for mobile. Would live in `src/components/ui/accordion.tsx`. Reusable across ALL solution pages. Optional enhancement. |

**Total new standalone components: 1 (DentalSolutionLanding) + 1 optional (Accordion)**
**Total new UI primitives: 0 (or 1 if Accordion is added)**
**Everything else is inline composition within the dental landing using existing patterns.**

---

### Deliverable 4: UI Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Transformation section looks inconsistent with rest of site | Low | Directly adapts `ComparisonSection` color/structure pattern. Same `Card` primitive, same blur effects. |
| Benefits grid creates visual density that feels different | Low | Use same card padding, border, and hover patterns as gym feature items. Match gap values. |
| Pricing section introduces a new "section type" not seen elsewhere | Medium | Reuse CTA card container exactly. Keep internally simple (text + list + button). The container IS the existing pattern. |
| 8 FAQ questions create excessive page length on mobile | Medium | Mitigate with accordion pattern (progressive disclosure). If no accordion: acceptable tradeoff — users can scroll. |
| Dental page feels disconnected from other solution pages | Low | The `DentalSolutionLanding` follows the same structural pattern as `GymSolutionLanding` — conditional rendering in the same `[slug]/page.tsx`. Shared breadcrumb, schema, navigation, footer. |
| Animation feels inconsistent between reused and new sections | Very Low | All new sections use the same `FadeUp` + stagger pattern. No custom animations introduced. |
| Performance regression from larger page size | Very Low | Page is still text-only (no images beyond existing logo). Framer Motion is already bundled. No additional JS dependencies. |

---

### Deliverable 5: Accessibility Checklist

| Requirement | Implementation |
|---|---|
| Semantic heading hierarchy (H1 → H2 → H3) | One H1 in hero, H2 per section, H3 for card titles |
| Skip link to main content | Already in `(site)/layout.tsx` via `<SkipLink />` |
| Keyboard navigation for all CTAs | Buttons and links natively keyboard-accessible |
| Focus visible indicators | Global `focus-visible:ring-[3px]` on all buttons (CVA) |
| Decorative elements hidden | All blurs, icons in cards use `aria-hidden` |
| Reduced motion respected | `FadeUp` still renders content (just without animation). Lenis skips. Preloader skips. |
| Color contrast | Primary text `#f7f8f8` on `#010102` = 19.6:1. Muted `#8a8f98` on `#010102` = 6.3:1 (passes AA). |
| Accordion keyboard support (if added) | `Enter`/`Space` to toggle, `aria-expanded`, `aria-controls` |
| Link text descriptive | "Start a Project" not "Click here". "View all solutions" not "Learn more". |
| Image alternatives | Dashboard skeletons: `aria-hidden`. No content images on page. |
| FAQ accessible | Questions as headings or buttons, answers associated via `aria-labelledby` |
| Breadcrumb accessible | Already uses `<nav aria-label="Breadcrumb">` with `aria-current="page"` |

---

### Deliverable 6: Mobile UX Checklist

| Check | Specification |
|---|---|
| Hero H1 readable at 375px | `text-4xl` wraps cleanly (max 5-6 words per line) |
| CTA buttons full-width on mobile | `flex-col gap-4` on mobile, `sm:flex-row` on tablet+ |
| Metrics 2×2 grid on mobile | `grid-cols-2 sm:grid-cols-2 lg:grid-cols-4` |
| Cards full-width on mobile | Single column below `md:` breakpoint |
| Timeline works on mobile | Vertical layout is inherently mobile-native |
| FAQ scrollable / collapsible | Accordion recommended for 8 questions |
| Touch targets ≥ 44px | Buttons at `h-11` (44px). Accordion rows at `py-4` (adequate). |
| No horizontal scroll | All grids collapse to single column. No fixed-width elements. |
| Comfortable reading line length | `max-w-2xl` constraint on long paragraphs |
| CTA visible without excessive scrolling | Hero CTA visible immediately. Mid-page CTAs after proof sections. |
| Section padding adequate | `px-6` maintains left/right breathing room on all devices |
| Font sizes readable | Minimum `text-xs` (12px) for metadata. Body at `text-sm` (14px) minimum. |

---

### Deliverable 7: Implementation Order

| Step | What | Why This Order | Dependencies |
|---|---|---|---|
| 1 | Update `niche.hero` content in `niches.ts` | Foundation — changes hero immediately without any component work | None |
| 2 | Update `niche.problem` content in `niches.ts` | Same — content-only, immediate improvement | None |
| 3 | Update `niche.solution` content in `niches.ts` | Same | None |
| 4 | Update `NICHE_ENRICHMENT["dental-medical"].metrics` | Add 4th metric, update values | None |
| 5 | Update `NICHE_ENRICHMENT["dental-medical"].launchSchedule` | Business-language timeline | None |
| 6 | Update `niche.faq` content in `niches.ts` | Replace technical FAQ with objection-handling FAQ | None |
| 7 | Add `niche.caseStudy` to `dental-medical` in `niches.ts` | Enables case study section rendering in template | None |
| 8 | Update `niche.dashboards` descriptions in `niches.ts` | Dental-specific dashboard copy | None |
| 9 | Create `DentalSolutionLanding` component | Custom page with Transformation + Pricing + reordered sections | Steps 1-8 (content ready) |
| 10 | Add conditional rendering in `[slug]/page.tsx` | `niche.id === "dental-medical"` → render custom component | Step 9 |
| 11 | (Optional) Create `Accordion` component | FAQ mobile improvement | Step 9 |
| 12 | Add `HowTo` schema node | SEO enhancement for timeline section | Step 9 |
| 13 | Verify build + test | Confirm no regressions, lighthouse audit | All above |

**Key insight:** Steps 1–8 are content-only changes that improve the page immediately using the existing `SolutionTemplate`, with zero risk. Step 9 is the custom component that unlocks the full redesigned experience. This allows incremental delivery.

---

### Deliverable 8: Component Dependency Map

```
[slug]/page.tsx (Server Component — route handler)
├── getNicheBySlug("dental-hospital-business-solution-website-at-hyderabad")
│   └── niches.ts (content data — MODIFIED)
│       ├── hero, problem, solution, dashboards, faq (REWRITTEN)
│       ├── NICHE_ENRICHMENT.metrics, launchSchedule (REWRITTEN)
│       └── caseStudy (ADDED)
├── buildMetadata() → lib/seo.ts
├── serviceNode() + faqNode() → lib/structured-data.ts
├── <Breadcrumb> → seo/breadcrumb.tsx
├── <JsonLd> → seo/json-ld.tsx
└── CONDITIONAL: niche.id === "dental-medical"
    └── <DentalSolutionLanding> (NEW — "use client")
        ├── FadeUp → solutions/fade-up.tsx (EXISTING)
        ├── Button → ui/button.tsx (EXISTING)
        ├── Card, CardHeader, CardContent → ui/card.tsx (EXISTING)
        ├── Lucide icons (EXISTING — tree-shaken)
        ├── motion (framer-motion — EXISTING dependency)
        ├── Link (next/link — EXISTING)
        │
        ├── SECTIONS (inline):
        │   ├── Hero section (replicates SolutionHero pattern)
        │   ├── Metrics section (replicates SolutionTemplate pattern)
        │   ├── Problem section (replicates SolutionTemplate pattern)
        │   ├── Transformation section (adapts ComparisonSection pattern)
        │   ├── Benefits section (adapts GymSolutionLanding feature pattern)
        │   ├── Dashboard Preview section (replicates SolutionTemplate pattern)
        │   ├── Case Study section (replicates SolutionTemplate pattern)
        │   ├── Investment section (adapts CTA card pattern)
        │   ├── Timeline section (replicates SolutionTemplate pattern)
        │   ├── FAQ section (replicates SolutionTemplate pattern + optional Accordion)
        │   ├── Final CTA section (replicates SolutionTemplate pattern)
        │   └── Related Reading section (replicates SolutionTemplate pattern)
        │
        └── Props:
            ├── cityLabel: string
            ├── faq: FaqPair[]
            ├── headingIds: Record<string, string>
            └── relatedPosts: LatestPost[]
```

**Zero new dependencies introduced.** Everything composes from `framer-motion`, `lucide-react`, `next/link`, and existing Blogspage components. No new npm packages. No new design tokens. No new CSS utilities.

---

## SUMMARY

| Metric | Value |
|---|---|
| Total sections on dental page | 12 |
| Sections requiring zero component work | 7 (58%) |
| Sections requiring light composition | 3 (25%) |
| Sections requiring medium composition | 2 (17%) |
| New standalone components | 1 (`DentalSolutionLanding`) |
| New UI primitives | 0 (1 optional: `Accordion`) |
| New npm dependencies | 0 |
| New CSS utilities | 0 |
| New design tokens | 0 |
| New colors | 0 |
| New fonts | 0 |
| Risk level | Low |
| Estimated LOC (new) | 200–250 (dental landing) + 40 optional (accordion) |
| Estimated LOC (content changes) | ~80 lines in `niches.ts` |

The dental page redesign is achievable with **83% reuse** of existing patterns and zero deviation from the established design system.
