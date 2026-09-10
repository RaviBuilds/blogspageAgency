# BLOGSPAGE AI — SEARCH VISIBILITY & ENTITY BLUEPRINT

**Document type:** Canonical strategy and guardrail blueprint  
**Status:** Final. Documentation only. This document authorizes no application code, metadata, structured-data, sitemap, robots, route, or data-file changes by itself.  
**Scope:** Google Search visibility strategy, brand/entity consistency, sitelink-supporting site architecture, Google Business Profile relationship, local/entity signals, important-page discoverability, FAQ strategy, and search-oriented internal linking.  
**Primary audience:** Implementation agents, SEO implementers, and decision-makers.  
**Relationship to other canonical documents:** This document defines the long-term search/entity strategy. It never overrides the technical dependency constraints of `blogspage-architecture-report.md` or the SEO-protection rules of `seo-audit-report.md`. Where this document describes future work, that work requires its own implementation plan before any code changes.

---

## 0. How to read this document: the four control quadrants

Every search-visibility goal in this document belongs to exactly one of four quadrants. Any implementation agent working from this document must classify its task before acting.

| Quadrant | Definition | Examples | Who decides the outcome |
|---|---|---|---|
| **A — Controlled** | Fully within Blogspage's power | Site structure, internal links, navigation, page purposes, content quality, brand naming on owned surfaces | Blogspage |
| **B — Optimizable** | Blogspage can influence but not control | Sitelink candidacy, branded-result quality, entity understanding, FAQ presentation | Google, informed by signals |
| **C — Google-decided** | Entirely automatic | Whether sitelinks appear, which sitelinks appear, whether a knowledge panel appears, ranking positions, FAQ/rich-result presentation | Google |
| **D — External-dependent** | Depends on signals outside this repository | Google Business Profile state, external reviews, third-party profile consistency, citations | Blogspage (operationally) + Google |

**The governing principle:** the desired search appearance described in this document is an **objective, not a guaranteed result**. This document must never be read — by a human or an agent — as promising sitelinks, a knowledge panel, a specific ranking position, or any specific Google-generated search feature.

### Forbidden language

The following claims must never appear in implementation plans, code comments, commit messages, or marketing copy derived from this document:

- "guaranteed sitelinks" / "guarantee" (in any Google-outcome context)
- "force Google to show…"
- "mandatory sitelinks"
- "guaranteed knowledge panel"
- "guaranteed FAQ rich result"

---

## Core search objective

When users search for the brand — "Blogspage AI", "Blogspage", or "Blogspage Agency" — the desired long-term search experience is a clear, branded result for `blogspage.com` with a recognizable site name and, where Google determines they are useful, links to important pages.

**Desired possible result structure (illustrative objective, not a specification of Google output):**

```text
Blogspage AI
blogspage.com
[Brand description line]

Possible useful sitelinks (Google-selected):
About | Services | Solutions | Work | Insights / Blog | Contact | FAQ
```

Three explicit statements that govern everything downstream:

1. **Google determines actual sitelinks automatically.** The sitelink set above is the set of pages the site should make *strong candidates* — clear, discoverable, well-linked, unambiguous. It is not a list Blogspage can require Google to display, and it is not expected that all candidates appear.
2. **The site name and entity presentation are signals, not switches.** Consistent naming increases the likelihood Google presents the brand accurately; it does not command a presentation.
3. **Absence of a feature is not failure of the strategy.** If Google never shows sitelinks, a knowledge panel, or an FAQ expansion, the underlying work — clear architecture, honest entity signals, useful content — remains correct and valuable on its own terms.

---

## 1. Brand entity consistency

### Canonical brand presentation

**Preferred brand: `Blogspage AI`.**

This is the brand form that should anchor entity representation across all controlled surfaces over time.

### Known variants in existing surfaces

Different existing surfaces currently use different brand variants, including:

| Variant | Where it may currently appear |
|---|---|
| `Blogspage` | Short-form references, some copy, some link labels |
| `Blogspage AI` | Canonical documentation, product/AI-facing surfaces |
| `Blogspage Agency` | Organizational/repo naming, operational contexts |

These variants are recorded here as a fact, not as an authorization to change any of them now. **No renaming, metadata rewrite, or structured-data change is authorized by this document.**

### Future goal: one consistent entity representation

Over time, the following surfaces should converge on a single, consistent brand/entity representation built on the preferred brand:

- website visible copy and headings
- title/site-name presentation
- Organization/entity references
- Google Business Profile
- social profiles
- contact information
- footer
- external profiles where Blogspage controls them

Consistency means: the same primary brand form, the same logo, the same business description, and the same contact details everywhere they appear.

### OWNER DECISION required before implementation

The following inconsistencies require an explicit owner decision before any surface is changed:

1. **Which exact brand string is canonical** (`Blogspage AI` vs another form) for public-facing presentation — including whether the word "Agency" appears anywhere in public brand naming.
2. **Whether existing pages using `Blogspage` without "AI" should be updated** and on what schedule.
3. **What the exact Google Business Profile business name is or will be**, and whether it matches the website brand exactly.

This document records the preferred brand as a strategy/guardrail. It does not implement any rename.

---

## 2. Google sitelink strategy

### Candidate pages

The preferred candidate set for Google sitelinks, with current existence status:

| Candidate | Path | Status today |
|---|---|---|
| Home | `/` | Exists |
| About | `/about` | Exists |
| Services | `/services` index | **Does not exist** — individual `/services/[slug]` pages exist; a hub/index is future architecture |
| Solutions | `/solutions` | Exists |
| Work | `/work` | **Does not exist** — future candidate |
| Insights / Blog | `/blogs` | Exists (note: the blog lives at `/blogs`, not `/blog`; do not rename it) |
| Contact | `/contact` | Exists |
| FAQ | `/faq` | **Does not exist** — future candidate |

**No statement in this document requires that all of these pages appear as sitelinks, or that any of them appear at all.** Google selects sitelinks automatically based on page usefulness, structure, and query context.

### How the site supports sitelink candidacy

The site should make its hierarchy legible through:

- **Consistent global navigation** — important commercial pages reachable from every page
- **Descriptive page titles** — each page's title describes that page uniquely
- **Meaningful headings** — heading hierarchy reflects real content structure
- **Logical site structure** — hubs above detail pages, no orphaned important pages
- **Strong internal links** — important pages linked from relevant, related pages (Section 12)
- **Concise anchor text** — short, descriptive labels ("About", "Contact"), not long keyword strings
- **Important-page links from relevant pages** — e.g., the blog links to contact when contextually appropriate; solutions link to their service context
- **Avoiding duplicate/confusing page purposes** — two pages must not compete to be "the" page for the same job

### URL protection rule

**The existing solution URLs and blog URLs MUST remain intact.** No slug may be renamed, merged, or redirected as part of any sitelink or navigation strategy. See Section 16.

---

## 3. Site architecture for search

### Conceptual architecture

```text
Homepage (/)
→ Service hubs (future: /services/*)
   → Existing /services/[slug] service pages
   → Related existing /solutions/* pages
→ Existing solution pages (/solutions, /solutions/[slug])
→ Portfolio/work (future: /work)
→ Blog/Insights (/blogs, /blogs/[slug], category/author archives)
→ About (/about)
→ Contact (/contact)
→ FAQ (future: /faq)
```

This is the conceptual target. It describes how surfaces should relate, not a required implementation sequence.

### What is protected now

- The **existing programmatic solution system** (`NICHES` × `CITIES` → `/solutions/[slug]`) remains exactly as built.
- The **existing dynamic blog architecture** (`/blogs`, `/blogs/[slug]`, category/author/pagination archives) remains exactly as built.
- The existing `/services/[slug]` service pages remain exactly as built.

### Future service hubs (planned, not authorized for implementation here)

```text
/services/brand-digital-presence    — future
/services/application-development   — future
/services/ai-automation             — COLLISION; see below
```

**⚠ OWNER DECISION — `/services/ai-automation` already exists.** The repo currently serves `/services/ai-automation` as an existing service detail page (one of the four routes in `src/lib/service-routes.ts`). The brief's future hub of the same path therefore collides with a live URL. Any future hub architecture must either (a) extend the existing `/services/ai-automation` page into the hub role, or (b) select a different path for the hub. This must be decided by the owner in a dedicated implementation plan. **No hub routes are implemented as part of this document.**

---

## 4. Homepage search role

The homepage (`/`) is the **broad brand/entity/business-value hub**. It is the page most likely to be served for branded queries, and it is the anchor of the site's entity signal.

The homepage should naturally communicate — through real content, not keyword lists:

- **Blogspage AI** (the brand)
- website development
- branding / digital presence
- web applications
- business software
- SaaS
- AI
- automation
- Hyderabad (where genuinely relevant)
- the intent of a business owner looking for a digital build partner

Rules:

- **Avoid keyword stuffing.** Every phrase must appear because it explains the business, not because a list demands it.
- **The homepage must not attempt to replace the existing solution pages.** `/solutions/*` pages own their industry/problem/local intents. The homepage links to them (Section 12); it does not duplicate or absorb them.
- The homepage restructuring described in the homepage master blueprint is **additive**: existing content classes are strengthened or reorganized, never deleted because a new page is considered better.

---

## 5. Existing solution SEO role

The existing `/solutions/*` system is the **industry/problem/local search layer** of the site. It is mature, audited infrastructure (see `seo-audit-report.md` and `blogspage-architecture-report.md`) and must be preserved in full.

### Preserved without exception

- **existing slugs** — every `/solutions/<slug>` URL stays byte-identical
- **existing dynamic generation** — the `NICHES` × `APPROVED_CITIES` cross product, `allNicheParams()`, and `resolveSolutionSlug()`
- **existing internal links** — homepage anchors, `/solutions` hub links, breadcrumb trails
- **city/niche architecture** — `src/lib/niches.ts`, `src/lib/cities.ts`
- **sitemap relationships** — solution routes in `sitemap.xml` via `routes.ts`
- **canonical architecture** — every solution page's canonical URL

### Explicit prohibitions

- Do **not** rename existing solution URLs.
- Do **not** replace solution pages with generic service pages.
- Do **not** fold solution content into future service hubs and delete the originals.

### Coexistence model

Homepage navigation and SEO URL architecture can and should coexist as two layers over the same business:

| Layer | Purpose | Shape |
|---|---|---|
| **Navigation** | Clear business-facing service structure a human can browse | Future service hubs: Brand & Digital Presence / Applications & Business Software / AI & Automation |
| **SEO layer** | Specific industry/problem/local solution pages matching real search intent | Existing `/solutions/<niche>-...-at-<city>` programmatic pages |

Neither layer replaces the other. Hubs link down into relevant solution pages; solution pages link back up to their relevant service context (Section 12).

---

## 6. Blog search role

The blog is the **topical authority and informational discovery surface** of the site.

### Existing routes (protected as-is)

- `/blogs` — index
- `/blogs/[slug]` — post
- `/blogs/category/[slug]` (+ pagination) — category archives
- `/blogs/author/[slug]` (+ pagination) — author archives
- `/blogs/page/[page]` — index pagination

Note: the blog lives at `/blogs` (plural). This document's "Insights / Blog" label refers to these existing routes. **Do not rename, move, or restructure them.** No category/author/archive behavior is modified by this document.

### Role definition

- Blog content builds topical depth around the services and problems the solutions pages target commercially.
- Category and author archives are cluster landing surfaces; their existence strengthens topical organization.
- Posts are the natural internal-linking source toward service hubs, solution pages, and work/case-study proof (Section 12).

### Homepage relationship to the blog

The homepage **may surface a small selection of recent or important articles** to demonstrate activity and depth. It **must not become a blog directory**: no exhaustive post lists, no replicating the `/blogs` index. The homepage's journal surface links to `/blogs` for everything else.

---

## 7. Strategic purpose of each candidate page

Each important page has one clear job. Pages must not compete for the same purpose.

| Page | Strategic purpose | Notes |
|---|---|---|
| **ABOUT** (`/about`) | Entity, trust, background — who is behind the work | A primary entity signal surface; consistent brand naming matters most here |
| **SERVICES** (future `/services` hubs + existing `/services/[slug]`) | High-level capability and commercial intent — what Blogspage builds, at the business-decision level | The existing four `/services/[slug]` pages keep their slugs and role |
| **SOLUTIONS** (`/solutions`, `/solutions/[slug]`) | Industry/problem/local intent — "can you solve this for a business like mine, here" | Protected programmatic system (Section 5) |
| **WORK** (future `/work`) | Proof and project evidence — real builds, real outcomes | Does not exist yet; future candidate. Homepage portfolio sections are not a substitute for a durable proof surface |
| **CONTACT** (`/contact`) | Commercial conversion and business identity — how to start, how to reach the business | Entity-consistent contact details are also an entity signal |
| **FAQ** (future `/faq`) | User education, objection handling, topical clarity, internal linking | Section 8 governs content; **do not assume FAQ rich results** |

The homepage is none of these pages' replacement. It is the hub that orients visitors and links to each surface according to its purpose.

---

## 8. FAQ strategy

### Future FAQ architecture (not implemented in this task)

A future FAQ should answer **real questions business owners actually ask**, such as:

- What does Blogspage AI build?
- Do you create websites for small businesses?
- Can you build an online store?
- Can you help with branding and digital presence?
- Can you build custom software?
- Can you build SaaS?
- Can you add AI to an existing business?
- Do you work with businesses in Hyderabad?
- What happens after I contact Blogspage?
- Do I need to understand technology to work with you?

**Do not fabricate answers now. Do not create FAQ implementation in this task.** Answer content must come from real business facts confirmed by the owner (Section 18).

### Content rules

FAQ content must be:

- **genuinely useful** — each answer is one a real owner would be glad to read
- **visible on the relevant page** — the FAQ exists as readable page content, not hidden markup
- **written for business owners** — plain language, no jargon-first explanations
- **not keyword stuffed** — questions phrased the way people ask, not the way a keyword tool outputs
- **not created solely to chase rich results** — FAQPage structured data is **not a goal in itself** and is not required by this document (Section 15)

### Placement (future decision)

FAQ may live as a prominent dedicated page (`/faq`), distributed across relevant pages, or both — depending on the final information architecture. It may also appear as a strong footer/support destination. This is a future IA decision, not part of the current homepage work.

---

## 9. Google Business Profile / local entity

Google Business Profile (GBP) is an **external component** of the broader search/entity system — it lives outside this repository and outside this codebase's control.

### Consistency requirements (future operational requirement)

The following must stay consistent across the website, GBP, and all controlled profiles:

- Business name
- Website URL
- Phone
- Address / service area
- Business category
- Business description
- Real photos
- Genuine reviews
- Social/profile references where appropriate

### Desired relationship

```text
Google Business Profile
        ↕
Blogspage website  (/contact, /about, homepage entity signals)
        ↕
External brand profiles  (directories, listings where controlled)
        ↕
Social profiles
        ↕
Consistent business information everywhere
```

One business, one name, one phone, one address/service-area story, one description — repeated consistently. Divergence between any two surfaces weakens every other surface.

### Boundary

**Do not modify or create a Google Business Profile as part of any repository task.** GBP management is a future operational requirement handled by the owner, informed by this document. No code in this repo claims to manage GBP.

---

## 10. Knowledge panel / entity visibility

The goal is to **strengthen Google's understanding of Blogspage as a real business/entity** — so that when Google decides how to represent the brand, it has accurate, consistent material to work from.

### Signals that support entity understanding

- consistent organization identity (one brand, one logo, one description)
- consistent website/brand naming across surfaces
- appropriate existing structured data (Section 15 — the current implementation's ownership is preserved)
- the same business information across controlled profiles (name, phone, address/service area)
- authoritative external references where they genuinely exist
- genuine reviews
- Google Business Profile (Section 9)

### Explicit statement

**Google determines whether — and how — a knowledge panel or any other entity feature appears.** Entity work improves the *inputs* Google reasons over; it does not and cannot command an output.

**This document must never promise a knowledge panel.** No implementation plan, ticket, or commit message may state or imply that entity work produces one.

---

## 11. Site name / homepage entity signals

### Desired website identity

**`Blogspage AI`**

The homepage should provide a clear, consistent site-name/entity signal — the visible page, its title presentation, and its content all agreeing on one brand identity.

### Rules for future implementation (not authorized in this task)

The existing WebSite/Organization structured-data implementation is **not modified by this document**. When future work touches site-name/entity signals, that work must:

- **preserve current structured-data ownership** — the sitewide `Organization` node is emitted once by the shared `(site)/layout.tsx`; that single-source pattern stays
- **avoid duplicate Organization/WebSite nodes** — one Organization node, one WebSite node, sitewide; never re-declared per page
- **keep the homepage as the appropriate site-name/entity source** — the root layout/homepage is where the sitewide identity lives, not individual pages
- **use one coherent brand identity** — the brand string in structured data, visible copy, and titles must agree (pending the Section 1 owner decision)

If any future change risks creating a second Organization or WebSite node, the change is wrong by definition.

---

## 12. Internal linking rules

These are the required future internal-linking relationships. They describe *natural, contextual* links between related content — not link matrices.

### Homepage should link naturally to

- Services (future hubs and/or existing `/services/[slug]` pages)
- Solutions (`/solutions`, and representative existing solution pages)
- Work (when it exists; today, portfolio proof surfaces)
- Blog/Insights (`/blogs`, plus a small selection of articles)
- About (`/about`)
- Contact (`/contact`)
- FAQ (when it exists)

### Service hubs (future) should link to

- related existing solution pages (`/solutions/*` for the industries the hub serves)
- relevant portfolio work
- relevant blog content

### Solution pages should link back to

- the relevant service hub (when hubs exist; today, the `/solutions` hub and service context)
- the homepage where appropriate
- related solution pages (same niche in other cities, adjacent niches)
- relevant proof/work
- contact (`/contact`) — as the conversion path

### Blog articles should link naturally to

- relevant service hubs (future) / service pages
- relevant solutions
- relevant work/case studies
- contact, when contextually appropriate (already the pattern on post routes today)

### Universal rules

- **Avoid artificial cross-linking.** No link lists that exist only to pass links; no boilerplate link blocks unrelated to page content.
- **Use descriptive anchor text.** Anchors describe the destination ("dental clinic website packages in Hyderabad"), not "click here" or raw URLs — and not keyword-stuffed repetition.
- Links must respect the existing internal-linking contracts documented in the architecture report (homepage anchors, `routes.ts`-derived links).

---

## 13. Navigation requirements

Navigation is a **search-supporting structure, not just visual UI**. A crawler that can reach every important page from the global navigation — and a human who can too — is the baseline for sitelink candidacy (Section 2).

### Future preferred global navigation

```text
Home | Services | Solutions | Work | Insights | About | Contact
```

The navigation should make the important commercial pages discoverable from every page of the site.

### FAQ placement

FAQ may live:

- as a **prominent page** in global navigation, **or**
- as a **strong footer/support destination**

depending on the final information architecture. Both are acceptable; the requirement is that FAQ content be discoverable, not that it occupy a nav slot.

### Boundary

**Do not implement navigation changes as part of this document.** Navigation changes require their own implementation plan, coordinated with the homepage master blueprint's navigation direction (its §42) and with the `routes.ts` link inventory.

---

## 14. Local / Hyderabad signals

Blogspage is **Hyderabad-based**, and natural local relevance is part of the entity story.

### Principle

Future controlled surfaces should **consistently and naturally represent Hyderabad where appropriate** — but never as stuffing.

### Where local context genuinely belongs

- homepage (brand origin/business context)
- contact (`/contact`)
- about (`/about`)
- relevant service pages
- local solution pages (the existing `/solutions/...-at-hyderabad` pages already own this)
- Google Business Profile
- business information across controlled profiles

### Rules

- **Do not put "Hyderabad" into every heading.** Local mention is a fact stated where it matters, not a token repeated for its own sake.
- The existing city/niche infrastructure (`src/lib/cities.ts`, `src/lib/niches.ts`, the `[city]` slug token system) **must remain untouched**. Local search coverage is expanded only by the documented, bounded process for approving cities — never by ad-hoc local pages.
- Local claims must be true. Do not claim physical premises, service areas, or coverage that the owner has not confirmed (Section 18).

---

## 15. Structured data rules

Structured data must **support the visible content and the actual entity/page role**. Schema is a description of the page, not a wish list. **Do not add schema just because a feature exists in this strategy document.**

### Principles

1. **No duplicate Organization nodes.** One sitewide Organization node, from its existing single source.
2. **No duplicate WebSite nodes.** One sitewide WebSite node, from its existing single source.
3. **Schema must match visible content.** Every marked-up fact must be present and true on the rendered page.
4. **Do not fabricate ratings.** No rating markup for content without real, verifiable ratings.
5. **Do not fabricate testimonials.** No testimonial/review markup or content that was not genuinely provided.
6. **Do not invent business claims.** No addresses, phones, service areas, awards, client counts, or founding dates that the owner has not confirmed.
7. **FAQ schema is not the objective by itself.** FAQPage markup is optional and only appropriate where genuine, visible FAQ content already exists (note: the existing solution pages already emit `FAQPage` nodes gated on real content — that ownership and gating pattern is preserved).
8. **Review/AggregateRating markup requires real, compliant content** and must be evaluated in a separate dedicated task — never bundled into other work.
9. **Existing structured-data ownership must be preserved.** `src/lib/structured-data.ts` and the emission points documented in the architecture report remain the single sources of truth.

---

## 16. Existing SEO protection

This document reinforces, and every task operating under it must obey, the protection rules of `seo-audit-report.md` and `blogspage-architecture-report.md`.

### DO NOT BREAK

- existing URLs (all of them — solutions, blog, services, legal, homepage anchors)
- existing canonical architecture (`canonicalUrl`, per-route canonicals)
- sitemap (`src/app/sitemap.ts`, `routes.ts` route inventory)
- robots
- solution routing (`niches.ts`, `cities.ts`, `allNicheParams`, `resolveSolutionSlug`, `dynamicParams = false`)
- blog routing (`/blogs` and all child routes)
- service routing (`service-routes.ts`, `/services/[slug]`)
- `NICHES`
- `CITIES` (`APPROVED_CITIES`)
- `ROUTES` (`src/lib/routes.ts`)
- service catalog (`SERVICE_ROUTES`)
- keyword map (`KEYWORD_MAP` / `keyword-map.ts`)
- SEO helper logic (`src/lib/seo.ts`, `buildMetadata`, `solutionTitle`, `clampDescription`)
- `llms.txt` (its route and its `STATIC_ROUTES` derivation)
- `services.json`
- `feed.xml` (RSS)
- OG route
- internal-linking contracts (breadcrumb arrays, hub links, homepage anchors)
- homepage anchors (`/#contact`, `/#process`, `/#solutions`, `/#services`)

### Additive principle

The homepage restructuring is **additive**. **Do not delete a page because another new page is considered better.** Consolidation, removal, or redirection of any existing page requires its own explicit, separately authorized plan with the SEO audit consulted.

---

## 17. Search objectives vs guarantees

| OBJECTIVE | CONTROL (what Blogspage does) | GOOGLE-CONTROLLED (what Google decides) | STATUS |
|---|---|---|---|
| Useful sitelinks | Site architecture, navigation, internal linking, clear page purposes make pages strong candidates | Google chooses whether sitelinks appear and which ones | **Optimize** |
| Business Profile appearance | Maintain the profile; keep entity signals consistent across surfaces | Google determines display, matching, and presentation | **Optimize** |
| Knowledge panel | Strengthen entity consistency; accurate structured data; consistent external references | Google determines whether it appears and what it contains | **Optimize** |
| FAQ usefulness | Content quality and page architecture; visible, genuinely useful answers | Google determines search presentation (including any rich-result treatment) | **Optimize** |
| Branded search result | Site/entity consistency; clear site-name and homepage signals | Google ranking systems decide the served result and its presentation | **Optimize** |
| Local (Hyderabad) relevance | Consistent local business information where genuinely relevant; existing city pages preserved | Google determines local matching and pack/map presentation | **Optimize** |

Read every row as: *Blogspage controls the inputs in column 2; the outcome in column 3 is Google's*. The word for this whole document is **optimize** — never **guarantee**.

---

## 18. Owner inputs

The following items require **future owner confirmation** before any implementation uses them. **Do not invent missing information.** Until confirmed, the relevant surface stays as-is.

| # | Item | Why it matters |
|---|---|---|
| 1 | Canonical public brand name (exact string) | Every entity signal depends on it (Section 1) |
| 2 | Exact Google Business Profile name | Must match website brand for entity consistency |
| 3 | Address / service area | Contact page, GBP, Organization consistency |
| 4 | Business category | GBP accuracy |
| 5 | Official phone | Contact page, GBP, all profiles must match |
| 6 | Official social profiles | Profile linking and entity references |
| 7 | Approved logo | Entity identity across surfaces and structured data |
| 8 | Approved business description | GBP, profiles, homepage/about copy |
| 9 | Actual testimonials / reviews | Any proof or review-related content and markup |
| 10 | FAQ content (real answers) | Future FAQ architecture (Section 8) |
| 11 | Official work/project claims | Work/portfolio surfaces and case-study claims |

No implementation task may fill any of these gaps with placeholder or invented data.

---

## 19. Future implementation phases

All phases below are **future work**. None is authorized by this document. Each requires its own implementation plan, and each must pass the Section 16 protections before merging.

| Phase | Scope |
|---|---|
| **SV1 — Brand/entity consistency audit** | Inventory every controlled surface's brand string, logo, description, and contact details; produce the variance list for owner decisions (Section 1) |
| **SV2 — Site navigation + important-page linking** | Align global navigation and footer with the Section 13 direction; ensure every important page is discoverable sitewide |
| **SV3 — FAQ architecture/content** | Build the FAQ surface with owner-confirmed answers per Section 8 |
| **SV4 — Homepage entity/search signals** | Homepage brand/site-name coherence per Section 11, within the homepage master blueprint's additive restructuring |
| **SV5 — Service hub architecture** | The future `/services/*` hubs, resolving the `/services/ai-automation` collision first (Section 3) |
| **SV6 — Internal linking refinement** | Implement the Section 12 relationships across existing pages |
| **SV7 — Google Business Profile consistency** | Operational: align GBP with the confirmed entity facts (Section 9) — outside the repository |
| **SV8 — Search/entity regression audit** | Post-implementation verification: no broken URLs, no duplicate entity nodes, no canonical drift, protection list intact |

Ordering note: SV5 must not begin before the Section 3 owner decision. SV7 requires the Section 18 owner inputs.

---

## 20. Non-goals

This document explicitly does **NOT** authorize:

- deleting existing SEO pages
- changing existing solution slugs
- rewriting all metadata
- adding schema everywhere
- creating fake testimonials
- creating fake reviews
- promising sitelinks
- promising knowledge panels
- promising specific Google ranking positions
- creating Google Business Profile from code
- adding unrelated SEO changes during homepage implementation

Any task proposing one of the above must be rejected as out of scope unless a separate, explicitly authorized plan exists for it.

---

## Change control

- This document is a strategy/guardrail. It changes only through an explicit documentation task.
- Application work governed by this document must also satisfy `BLOGSPAGE_AI_HOMEPAGE_MASTER_BLUEPRINT_v2.0.md` (homepage strategy), `blogspage-architecture-report.md` (dependencies), and `seo-audit-report.md` (SEO protection).
- When this document and a protection rule conflict, the protection rule wins.






