# Blogspage AI — Dental Solutions Pages Refinement Blueprint v1.0

Status: canonical for dental solution-page content work (pages 1 and 2 below).
Supersedes, for these two pages only, the fabricated-copy guidance found in the
historical planning documents under `docs/dental/` (those files remain as
historical reference and must not be treated as content authority for these
routes).

## 1. Scope

This document governs the refinement of exactly two routes:

1. `/solutions/dental-hospital-business-solution-website-at-hyderabad`
   (the dynamic niche route for `dental-medical`, rendered by
   `DentalSolutionLanding`)
2. `/solutions/dental-clinic-website-packages`
   (the static pricing sub-route, rendered by `DentalPackagesLanding`)

It does not authorize changes to the homepage, other niche routes, the SEO
framework, routing infrastructure, or any shared component outside the dental
page set.

## 2. Page roles and search intent

The two pages must never converge into duplicate SEO landing pages.

### Page 1 — Dental Hospital Business Solution (the "system" page)

- Search role: informational + commercial investigation. "Can this agency build
  and run the complete digital presence for a dental hospital or larger
  multi-specialty practice?"
- Content focus: the digital system; hospital / larger-practice needs;
  credibility presentation; treatment and service architecture; doctor/team
  presentation; locations; the patient journey (discovery → treatment page →
  trust → enquiry/booking → follow-up); content and local-SEO foundations;
  growth beyond a brochure website (AI layer); the real NeoDent case study.
- Pricing appears only as a teaser that points to page 2. Page 2 owns pricing.

### Page 2 — Dental Clinic Website Packages (the "commercial" page)

- Search role: transactional / pricing. "How much does a dental clinic website
  cost, which package fits my clinic, what is included, and how do I upgrade?"
- Content focus: package comparison, included scope, suitable business stage,
  upgrade path, optional add-ons, payment terms, implementation expectations,
  FAQs, and the relationship between a package website and the broader dental
  digital system (which links back to page 1).

## 3. Claims policy (binding)

- No invented testimonials, statistics, rankings, traffic results, conversion
  figures, revenue results, delivery-time claims, or client outcomes.
- No placeholder clients: the fictional "Jubilee Hills clinic" and "Dr. Meera
  S." content is removed and must not return.
- Pricing statements must match the package data published on page 2
  (`PLANS`/`ADD_ONS` in `dental-packages-landing.tsx`): fixed packages
  ₹14,900–₹49,900 and Signature AI Practice from ₹1,25,000. Do not describe
  pricing as universal; scopes differ per package.
- Delivery claims must reflect the per-package delivery windows (3–5, 5–7,
  7–10, 10–14 working days; Signature AI Practice 3–6 weeks). "Live in 14
  days" as a universal claim is prohibited.
- No-show reduction percentages ("up to 40%") are unverified and prohibited.
  Capability phrasing ("reduces missed appointments") is required instead.
- Case-study evidence is restricted to NeoDent facts the owner has supplied
  (see §5) plus features verifiable on the delivered website.


## 4. Protected architecture (unchanged)

- Route registries (`routes.ts`), `niches.ts` structure, city data,
  `services-catalog.ts`, `keyword-map.ts` (the dental phrase
  `dental clinic website development hyderabad` stays verbatim),
  `seo.ts`, `structured-data.ts` builders, sitemap, robots, OG, feed, llms.
- Heading-text changes must be made in lockstep with
  `dental-landing-headings.ts` / `dental-packages-headings.ts`
  (Requirement 9.5 heading-slugger contract).
- FAQ data on page 1 lives in `niches.ts` and feeds the emitted `FAQPage`
  JSON-LD verbatim; corrections there fix both surfaces at once.

## 5. NeoDent case study (page 1)

Section heading: **"A real client. A real transformation."**

Owner-supplied facts (the only permitted case-study facts):

- Client: NeoDent Dental Hospitals — https://www.neodentdentalhospitals.com/
- Founded 1994 by Dr. Mohd. Siraj Ur Rahman.
- Two Hyderabad locations: Mehdipatnam and Nampally.
- Specialist-led care: prosthodontics, implants, restorative dentistry.
- Before framing (no metrics): 30+ years of reputation, credentials and press
  presence; the previous digital presence did not adequately reflect that
  authority.

After framing is limited to verified implementation facts (verified against the
live website during implementation; anything unverifiable is dropped):
stronger brand identity; doctor credentials surfaced clearly; treatment/service
presentation and treatment pages; press/media section; patient testimonial
section; appointment booking pathways; relevant location presentation.

Prohibited in the case study: traffic, lead growth, conversion percentage,
ranking improvement, patient increase, revenue increase, speed-to-launch
statistics, percentage improvements, multipliers, before/after numerical
metrics, and invented stack lists (mirror the homepage R6 decision that keeps
the NeoDent record's `tech` and `metrics` arrays empty).

### Evidence gallery

Real owner-supplied screenshots are expected under
`public/case-studies/neodent/` (hero, legacy section, treatment atlas,
testimonials, press coverage, Google-search proof, mobile view). Rules:

- No filename may be referenced before the file exists in the repository.
- Screenshots are real project evidence: never recolored, never used to imply
  performance metrics, never labeled as anything other than what they show.
- Captions state what the screenshot shows; nothing more.
- Until the assets land, the gallery renders nothing (an empty asset manifest).

### Testimonial

No quote may be fabricated. A clearly identifiable owner-pending slot is
reserved; it renders no quotation marks and no invented text, and swaps in the
real quote later via a single constant.


## 6. FAQ and structured data

- Page 1 FAQ (source `niches.ts`): the pricing answer must state the published
  package structure (₹14,900–₹49,900 packages; Signature AI Practice from
  ₹1,25,000) and point to page 2. Minimum 3 usable pairs must be preserved
  (`MIN_SOLUTION_FAQ_PAIRS`) so the `FAQPage` node keeps emitting.
- Page 2 gains a genuine FAQ section fed by package data; because real Q&As
  exist on the page, a `FAQPage` node via the existing `faqNode()` builder is
  content-justified (not SEO ornament) and is emitted.
- No `Review`/`AggregateRating`/`LocalBusiness`/`MedicalClinic` nodes. No new
  Organization nodes. No framework changes.

## 7. Metadata

- Page 1 `<title>` is derived from the protected keyword phrase and stays
  unchanged. Description is derived from `niche.hero.subhead` +
  `niche.seoLabel` through `clampDescription`; subhead wording may shift toward
  hospital/multi-specialty intent within the 160-character clamp.
- Page 2 description must state the correct floor price (₹14,900, not ₹10,000).
- No new city variants, no keyword stuffing, no exact-match repetition loops.

## 8. Files

Modified: `dental-solution-landing.tsx`, `dental-landing-headings.ts`,
`neodent-case-study.tsx` (new presentation component — the only new
component), `niches.ts` (dental-medical entry only),
`dental-packages-landing.tsx`, `dental-packages-headings.ts`,
`dental-packages-faqs.ts` (new shared FAQ data module),
`solutions/dental-clinic-website-packages/page.tsx`.

Untouched: homepage R7/R8 components, `featured-work-data.ts`, `routes.ts`,
`keyword-map.ts`, `seo.ts`, `structured-data.ts`, `sitemap.ts`, `robots.ts`,
`og`, `feed.xml`, `llms.txt`, `analytics.ts`, all non-dental niches/templates,
`gym-*` components.

## 9. Validation

`tsc --noEmit`; full vitest suite; lint; production build (watch
route-lastmod regeneration); `seo:check`; canonical URL integrity for both
routes; JSON-LD integrity (one Service, one FAQPage where content justifies
it, one BreadcrumbList per route); sitemap unchanged for both routes; internal
links resolve; referenced image assets exist; manual QA of both pages at
desktop/tablet/mobile including heading hierarchy, case-study sequencing,
real-vs-conceptual proof distinction, pricing consistency across both pages,
and no accidental duplicate content between the two pages.
