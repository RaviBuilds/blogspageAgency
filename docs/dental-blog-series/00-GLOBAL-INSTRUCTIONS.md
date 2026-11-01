# GLOBAL INSTRUCTIONS: Dental Blog Series (3 articles) for Blogspage

You are working inside the Blogspage Agency repository (Next.js 15 + Sanity v3). Your job is to research, write and save **three long-form blog articles as Sanity DRAFTS** for dentists in Hyderabad. **Never publish.** The owner (Ravi) will review each draft in Studio and publish it himself.

These instructions apply to every article. Each article also has its own prompt file with the specifics. Work on **one article per session**.

---

## 0. Read these first (in this order)

1. `BLOGSPAGE_AI_CONTEXT.md` (repo root). This is the **source of truth for the Sanity schema, Portable Text rules, validation rules, slug rules, CTA block and house style.** Follow it exactly. Where this file and that one overlap, the technical rules in that file win; the audience and regulatory rules in this file win.
2. `docs/dental-blog-series/02-strategy-and-keywords.md`: audience, positioning, verified regulatory facts, keyword map. **Section 3 (regulatory facts) is binding.**
3. `docs/dental-blog-series/01-research-source.md`: Blogspage's own dental framework (blueprint + sales deck). This is the *substance* of the articles.
4. The article prompt you were given (`article-A-prompt.md`, `article-B-prompt.md` or `article-C-prompt.md`).
5. If it exists, read `.github/skills/blogspage-seo/` and follow it where it does not conflict with this file.

> If the three dental files are not at `docs/dental-blog-series/`, search the repo for them by filename before asking me anything.

---

## 1. Audience override (important)

`BLOGSPAGE_AI_CONTEXT.md` describes the general audience as founders and operators. **For this series the reader is a practising dentist or dental clinic owner in Hyderabad.** Not a patient. Not a developer.

- Write peer-to-peer: respectful, clear, unhurried. The reader is a clinician who is sceptical of marketing.
- Explain web and SEO terms in one plain sentence the first time they appear. Do not explain dentistry to dentists.
- Tie every recommendation to what it means for the clinic: patient trust, enquiries, professional registration, staff time.
- Reflect Hyderabad naturally (see "Hyderabad lens" in the strategy file). Use localities as **examples**, never as statistics.

---

## 2. Non-negotiable content rules

These come from the regulatory brief and the blueprint's own safety rules. Breaking any of them is a failed article.

1. **No invented facts.** No invented statistics, studies, percentages, patient numbers, ranking claims, search volumes, quotes or sources. If you cannot verify it, leave it out or say it is unverified.
2. **The research file is a framework, not data.** Never describe Blogspage's blueprint as "research shows" or "studies prove". Say "our framework", "we think of it as", "the way we approach it". Do not claim client results.
3. **Regulation: describe first, interpret second.** State what the NDC advisory (and the 2014 Code) actually says, with a link to the best source you can verify, then give "our reading". Use hedged verbs for anything not explicit: "cautions", "names", "appears to", "is unclear".
4. **Do not tell dentists something is legal or illegal.** Do not give legal advice. Every regulatory section must include a short note that this is general information, not legal advice, and that the reader should confirm with their state dental council or a healthcare lawyer.
5. **Do not conflate regulators.** The NMC's October 2026 guidelines are for medical practitioners and hospitals. They are not binding on stand-alone dental clinics. Say so wherever NMC comes up.
6. **Do NOT recommend** patient testimonials, patient-story videos, before-and-after galleries, recorded consultations or procedures, "offers", countdowns, urgency language, "best/top/leading/No.1" claims, outcome guarantees, or ranking guarantees. These are exactly what the advisory (and the blueprint) steer away from.
7. **Never promise Google rankings, patient volume or revenue.** Say plainly that search and local results depend on external systems and competition.
8. **Patient privacy:** do not suggest putting symptoms or enquiry details into analytics. For law, refer to the **DPDP Act 2023 and DPDP Rules 2025** (see R9 in the strategy file for status and uncertainty). **Never mention HIPAA** except to say it is a US law that does not apply.
9. **Disclosure:** each article includes one short, plain sentence that Blogspage builds websites for clinics and therefore has a commercial interest. Place it where a careful reader would expect it (end of the introduction or just before the CTA), not buried.
10. **Date-stamp the article.** State in the body that it was written on 1 November 2026 and what could change. For article B add a line inviting corrections.
11. **Citations:** link to primary or authoritative sources via Portable Text `link` annotations (NDC, indiacode, Google Search Central or Business Profile help, the IJME study, DPDP texts). Paraphrase; do not reproduce long passages. A short quote must be under 15 words and attributed. Prefer 3 to 6 good links over many weak ones. Do not link competitors' marketing pages as authority.
12. **Tone checks (from the house style):** no hype, no superlatives, no exclamation marks, no clickbait, no fear-mongering. Avoid em-dash-heavy run-ons. Short paragraphs. Concrete examples over abstractions.

---

## 3. Before writing: verify (keep it quick)

Use web search / fetch to confirm, and cite what you confirmed:

- The NDC advisory of 14 Oct 2026: try the NDC site (dciindia.gov.in circulars) for the primary notice; otherwise use the Medical Dialogues report and say it is trade reporting.
- That the NDC replaced the DCI on 19 March 2026, and whether a new code of ethics has been notified since.
- Current DPDP Rules commencement dates and whether the compliance window has been shortened.
- For article C: Google's current Business Profile guidelines and spam policies on business names, fake locations, reviews, and doorway pages.

If a fact cannot be verified, **do not state it as fact.** Put the uncertainty in the article as a short "what we don't know yet" note, or leave it out.

Spend your effort on **writing quality**, not repo exploration. Limit repo reading to what section 4 asks.

---

## 4. Repo recon (do once, briefly)

Find and note, without changing anything:

1. The existing `post`, `category`, `author`, `blockContent`, `ctaBlockType` schemas (confirm they match `BLOGSPAGE_AI_CONTEXT.md`).
2. The **write client** (`src/sanity/lib/write-client.ts`) and how existing root scripts (`seed-meta.ts`, `migrate.ts`, `backfill-blog-meta.ts`) load env vars and run (copy that pattern). The token is `SANITY_WRITE_TOKEN` from env. **Never print or hard-code secrets.**
3. Which routes exist, so CTA links are real: check `src/app` for `/contact`, any section anchors such as `#process` or `#services`, and whether a dental or healthcare solutions page exists under `/solutions`.
4. Whether a category for dental/healthcare already exists.

---

## 5. Technical output rules (Sanity)

Follow `BLOGSPAGE_AI_CONTEXT.md` sections 5 to 15. In summary:

- Document type `post`. Body field is `content` (Portable Text). **No raw Markdown or HTML in `content`.**
- Headings inside the body start at **`h2`**; `h3` for sub-sections. The page title is the H1.
- Allowed: `normal`, `h2` to `h4`, `blockquote`, `bullet` and `number` lists, decorators `strong`, `em`, `code`, `link` annotation, `image`, `ctaBlock`. Nothing else.
- Every array item (blocks, spans, markDefs, categories) has a unique `_key`.
- `metaDescription`: **required, 120 to 160 characters.** `seoTitle`: **60 characters or fewer.** Use the exact values in your article prompt (already length-checked); if you change any, count the characters with code, not by eye.
- `seoKeywords`: 6 to 8 phrases from the strategy keyword map.
- `author`: `{ "_type": "reference", "_ref": "author-ravi" }`.
- `categories`: reference a dental/healthcare category. If none exists, create **one** new category document, title **"Dental & Healthcare"**, `_id` `category-dental-healthcare`, slug `dental-healthcare`, with a one-line description. This is the only non-post document you may create. Tell me in the final report.
- `publishedAt`: set to the current time. I will adjust it when I publish.
- `slug`: use the exact slug in your article prompt.

### 5.1 Create it as a DRAFT, never published
- Use a **draft `_id`**: `drafts.<publishedId>` with the `publishedId` given in your article prompt. This makes it appear in Studio as an unpublished draft.
- Use **`createOrReplace`** with that deterministic `_id` so re-running replaces the draft instead of creating duplicates.
- **Do not** create a document without the `drafts.` prefix. **Do not** run any publish action. **Do not** modify or delete any existing post.
- Put your build script in `scripts/dental-series/` (for example `scripts/dental-series/article-b.ts`), reuse the repo's existing script and env pattern, and add no new dependencies.
- Write the article as structured data in the script, with small helper functions for blocks (paragraph, heading, bullet, link, cta) that generate `_key`s automatically. Do not hand-write hundreds of keys.

### 5.2 Validate before writing to Sanity
Add a validation step to the script that fails loudly if any of these are wrong:

- `metaDescription` is not 120 to 160 characters, or `seoTitle` is over 60.
- Any block or span lacks a `_key`, any mark references a missing `markDef`, any block has fields outside the allowed set, any `children` contains a non-span.
- Any `h1` appears in the body.
- `ctaBlock` lacks any of its five fields.
- The word count is outside the target in your article prompt (strip link text markers, count plain words).
- The text contains any banned phrase: `HIPAA` (except in an explicit "does not apply" sentence), `best dentist`, `guarantee`, `guaranteed`, `100%`, `#1`, `number one`, `top-rated` (except when quoting a source), and any exclamation mark.

Print a short validation summary, then write the draft.

---

## 6. Calls to action (conversion is part of the job)

Every article ends with **one `ctaBlock`** (fields: `headline`, `body`, `primaryLabel`, `secondaryLabel`, `secondaryHref`, **all five required**). The exact copy is in each article prompt. Rules:

- The primary button opens the AI chat widget (this is how the existing component works); `primaryLabel` is `"Talk to our AI"` unless the article prompt says otherwise.
- `secondaryHref` must be a **route that actually exists** in this repo (from your recon). If a dental or healthcare solutions page exists, prefer it; otherwise use `/contact` or `/#process`.
- The ask is small: a plain-language conversation about the clinic's current digital footprint. Never "get more patients", never "limited time".
- Only article C may have an additional mid-article CTA, and only if the article prompt says so.
- Before the closing CTA, add one short paragraph (2 to 3 sentences) that connects the article's argument to the next step, so the CTA feels earned.

---

## 7. Images (keep it light)

Follow each article prompt. General rules:

- Create **one banner placeholder** (1600x900) for `mainImage` and set `ogImage` to the same asset. Style: calm, dark, brand-consistent, **typographic or abstract only** (the article title or a simple geometric motif on a dark gradient). No faces, no patients, no stock photos, no copyrighted material, no before-and-after imagery.
- Where the article prompt asks for a diagram, make it a clean SVG converted to PNG. Keep text large and legible on a dark background. Add meaningful `alt` text in the document.
- Upload with the write client's `assets.upload('image', buffer, { filename })` and reference the returned asset `_id` as `_ref` (see section 8 of the context file). Use `sharp` if it is already in the repo; otherwise try Python PIL; otherwise **skip image generation, leave `mainImage` unset, and say so in the report**. Do not install new dependencies.
- Every image has descriptive `alt` text (`mainImage.alt` and any in-body image).

---

## 8. Quality bar ("high-end")

- Opens with a concrete hook and a clear answer in the first 120 words. No throat-clearing.
- Genuinely useful: the reader should be able to **do something** after reading (an audit, a checklist, a decision rule).
- Original structure and thinking drawn from the research file; not a generic listicle.
- Scannable: short paragraphs, meaningful `h2`s, bullet and numbered lists where they help.
- Honest about limits and about what is unknown.
- Reads like one careful person wrote it. Vary sentence length. No filler phrases ("in today's digital world", "it is important to note", "in conclusion").
- Use Indian English with British-style spelling (organisation, programme, recognised), and keep it consistent throughout. Use "Rs" or the rupee sign only if a figure is genuinely needed; avoid quoting prices.

---

## 9. Efficiency guardrails

- Do not refactor code, change schemas, touch the front end, edit existing posts, or add dependencies.
- Do not ask me questions unless something blocks you completely; make a sensible choice and note it in the report.
- One article per session. Finish it fully, then stop.

---

## 10. Final report (always end with this, brief)

1. Draft document `_id`, title, slug, and the Studio path to find it.
2. Word count, `seoTitle` and `metaDescription` character counts, primary keyword and where it appears.
3. Sources linked (list the URLs) and **which facts could not be verified** and how you handled them.
4. Images created (and any skipped, with why).
5. The CTA copy used and the `secondaryHref` and why it exists.
6. Anything I should check or decide before publishing (for example: dentist-specific claims, publish date, category created).
7. Confirmation that **nothing was published** and no existing document was modified.
