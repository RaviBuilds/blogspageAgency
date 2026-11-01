# Dental blog series: how to run it

## Setup (once)

1. Copy this whole folder into the repo as `docs/dental-blog-series/`.
2. Make sure `SANITY_WRITE_TOKEN` is available in the environment the way your existing scripts (`seed-meta.ts`, `migrate.ts`) expect it.
3. Start Kiro CLI with **Opus 5.5** in the repo root.

## Files

| File | Purpose |
|---|---|
| `00-GLOBAL-INSTRUCTIONS.md` | Rules for every article: audience, safety, Sanity output, drafts only, CTA, images, report |
| `01-research-source.md` | Your Word blueprint and sales PDF, converted to markdown |
| `02-strategy-and-keywords.md` | Strategy, verified regulatory facts, keyword map, blueprint issues |
| `article-B-prompt.md` | NDC advisory and dental website rules. **Run first** (time-sensitive) |
| `article-A-prompt.md` | Do dentists need a website. Evergreen hub |
| `article-C-prompt.md` | Hyderabad local SEO and Google Maps. Longest, most practical |

## Run order and kickoff messages

**One article per Kiro session.** Paste the message, let it finish, review the draft in Studio, then start a fresh session for the next.

**1. Article B**

```
Read docs/dental-blog-series/00-GLOBAL-INSTRUCTIONS.md and follow it exactly. Then read 02-strategy-and-keywords.md and 01-research-source.md in the same folder, and BLOGSPAGE_AI_CONTEXT.md in the repo root. Then execute docs/dental-blog-series/article-B-prompt.md. Create the article as a Sanity DRAFT only. Do not publish. End with the final report from section 10 of the global instructions.
```

**2. Article A**

```
Read docs/dental-blog-series/00-GLOBAL-INSTRUCTIONS.md and follow it exactly. Then read 02-strategy-and-keywords.md and 01-research-source.md in the same folder, and BLOGSPAGE_AI_CONTEXT.md in the repo root. Then execute docs/dental-blog-series/article-A-prompt.md. Create the article as a Sanity DRAFT only. Do not publish. End with the final report from section 10 of the global instructions.
```

**3. Article C**

```
Read docs/dental-blog-series/00-GLOBAL-INSTRUCTIONS.md and follow it exactly. Then read 02-strategy-and-keywords.md and 01-research-source.md in the same folder, and BLOGSPAGE_AI_CONTEXT.md in the repo root. Then execute docs/dental-blog-series/article-C-prompt.md. Create the article as a Sanity DRAFT only. Do not publish. End with the final report from section 10 of the global instructions.
```

## Before you publish each draft

- Open it in Studio (Posts, then the draft) and read it as a dentist would.
- Check every regulatory sentence against the sources listed in the agent's report.
- Replace the placeholder banner if you want a better one (keep the `alt` text).
- Set `publishedAt` to the real publish time.
- Confirm the CTA buttons work on the live page.
- Do the 30-minute keyword check in section 4.2 of the strategy file and adjust headings if needed.
- Publish **B first**, then A, then C. Because they link to each other, a link to an unpublished article will 404 until its turn.
