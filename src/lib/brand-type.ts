/**
 * Brand typography tokens — the homepage's heading vocabulary.
 *
 * Plain module: no I/O, no React, no framework imports — importable from both
 * server and client components, matching the `homepage-data.ts` convention.
 *
 * ## Why this module exists
 *
 * Two things had been copy-pasted into a dozen section components:
 *
 * 1. The brand text sweep (`BRAND_TEXT_GRADIENT`) was re-declared verbatim in
 *    12 files. Same four properties, same three stops, twelve chances to drift.
 * 2. Every section heading was `text-3xl … sm:text-4xl`, so the page had
 *    exactly two type sizes — the hero's `clamp()` H1 and one shared 36px H2.
 *    After the hero the page never changed its voice.
 *
 * Both now resolve here. The gradient is one exported object; the scale is four
 * named tiers.
 *
 * ## The scale is presentational only
 *
 * These tokens carry *size*, *weight* and *tracking*. They never carry an
 * element. A `TYPE_STATEMENT` heading is still an `<h2>` if that is what the
 * document outline requires — visual emphasis is not a licence to renumber
 * headings, and the homepage's h1 → h2 → h3 hierarchy is unchanged by this
 * module. Do not reach for a bigger tier to "promote" a heading semantically.
 */

/* ─────────────────────────────────────────────────────────────────────────────
   THE BRAND TEXT SWEEP
   ───────────────────────────────────────────────────────────────────────────── */

/**
 * The approved restrained cyan → blue → violet sweep for a heading's one
 * meaningful phrase, on a **light** surface.
 *
 * Declared as an inline style object rather than via the `.text-gradient`
 * utility because the hero island's locked override in `globals.css` still
 * points that class at the legacy near-white gradient — the documented reason
 * the Hero declares its own sweep inline too.
 *
 * Painted by `background-clip: text` over a transparent fill, so on an engine
 * that cannot clip a background to text the glyphs would vanish. The hero
 * phrase has an `@supports` fallback in `globals.css`; light-surface headings
 * using this token need their own contrast check before joining that rule,
 * which is why it stays scoped to the hero for now.
 */
export const BRAND_TEXT_GRADIENT = {
  backgroundImage:
    "linear-gradient(90deg, #0891B2 0%, #4353C9 52%, #7C3AED 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text",
  color: "transparent",
} as const;

/**
 * The same sweep lifted for a **dark island** surface (Real Work, Supporting
 * Work). Lighter stops and a slightly rotated angle so the phrase keeps its
 * luminance against `--surface-dark` instead of sinking into it.
 *
 * Not interchangeable with `BRAND_TEXT_GRADIENT`: the light values measure far
 * too dark on the island, and these values measure too light on paper.
 */
export const BRAND_TEXT_GRADIENT_ISLAND = {
  backgroundImage:
    "linear-gradient(94deg, #67E8F9 0%, #828FFF 48%, #A78BFA 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text",
  color: "transparent",
} as const;

/* ─────────────────────────────────────────────────────────────────────────────
   THE TYPE SCALE

   Four tiers, in descending voice. The page's rhythm comes from *choosing*
   between them per section rather than applying one size everywhere.
   ───────────────────────────────────────────────────────────────────────────── */

/**
 * Tier 0 — DISPLAY. The page's two editorial bookends: the manifesto that
 * opens the argument and the final call that closes it.
 *
 * ## Why a tier above STATEMENT exists
 *
 * STATEMENT was introduced as the raised voice and then spent on both the
 * manifesto and the final CTA — which meant the page's opening belief and its
 * closing argument rendered at the same size as each other *and* only one step
 * above the eleven `TYPE_SECTION` headings between them. The bookends never
 * read as bookends.
 *
 * DISPLAY is that missing step. It is close enough to the hero's fluid H1 to
 * feel like the same voice returning, and far enough below its 5.75rem cap that
 * the H1 is still unambiguously the largest type on the page.
 *
 * `leading-[0.95]` is deliberate and only safe at this size: at display scale
 * the natural gap between lines is already generous, and normal leading makes a
 * three-line statement sprawl instead of reading as one block. Do not copy this
 * leading down to the smaller tiers.
 *
 * Reserved for exactly two uses — Manifesto and FinalCTA. A third instance is
 * the point at which the page has two openings, which is the same problem as
 * having none.
 */
export const TYPE_DISPLAY =
  "text-[clamp(2.5rem,6.2vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-balance";

/**
 * Tier 1 — STATEMENT. The page's raised voice, reserved for the few moments
 * that carry a belief rather than a label.
 *
 * Now that DISPLAY owns the manifesto and the final call, this tier's job
 * changed: it is the *peak of the page's middle* — the two scanning anchors
 * that a visitor is most likely to be looking for (`#services`, `#work`) and
 * the trust movement's claim. Those sections used to share one size with the
 * nine sections around them, so nothing in the middle of the page had a summit.
 *
 * Fluid so it never needs a breakpoint ladder, floored at 2rem so it stays a
 * statement on a phone.
 */
export const TYPE_STATEMENT =
  "text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.05] tracking-tight text-balance";

/**
 * Tier 2 — SECTION. The workhorse section heading, and the page's previous
 * only size. Unchanged values, so every section that keeps this tier renders
 * byte-identically to before.
 */
export const TYPE_SECTION =
  "text-3xl font-semibold tracking-tight text-balance sm:text-4xl";

/**
 * Tier 3 — QUIET. For registers that are supporting evidence rather than a
 * claim: the archive, the journal index, secondary groupings. Deliberately
 * lower-contrast in size so these sections stop competing with the movements
 * that matter.
 */
export const TYPE_QUIET =
  "text-2xl font-semibold tracking-tight text-balance sm:text-[1.75rem]";

/**
 * Tier 4 — MICRO. Eyebrows, journey labels, category tags.
 *
 * The `12px` floor is deliberate: the page had accumulated `text-[10px]` and
 * `text-[11px]` labels that fall below comfortable reading size on a phone.
 * The Master Visual Design System permits uppercase micro-labels with wide
 * tracking; it does not require them to be unreadable.
 */
export const TYPE_MICRO =
  "text-xs font-medium uppercase tracking-[0.14em]";

/**
 * `TYPE_MICRO` with the standard quiet colour already applied.
 *
 * Two tokens rather than one because the two uses genuinely differ: tags that
 * carry their own per-vertical accent colour compose `TYPE_MICRO` with that
 * accent, while the ordinary structural label — a section kicker, a stage
 * name, a "Journal" marker — always wants the same muted neutral. Baking the
 * colour into the common case is what stops `cn(TYPE_MICRO, "text-muted-…")`
 * from being retyped in a dozen files, which is the duplication this module
 * exists to end.
 */
export const TYPE_MICRO_LABEL =
  "text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground";

/**
 * The eyebrow as it renders today on sections that keep one.
 *
 * Kept as its own token rather than folded into `TYPE_MICRO` because an
 * eyebrow is sentence-case `primary`-coloured text, not an uppercase tag — and
 * because the set of sections entitled to an eyebrow is now a deliberate
 * shortlist (the scanning anchors: Services, Work, Process) rather than
 * every section on the page.
 */
export const TYPE_EYEBROW = "text-sm font-medium text-primary";

/* ─────────────────────────────────────────────────────────────────────────────
   SUPPORTING PROSE

   The scale above governs headings. These two tokens govern the paragraph that
   follows a heading — the other half of a section's typographic hierarchy, and
   the half the page had left unspecified.
   ───────────────────────────────────────────────────────────────────────────── */

/**
 * The lead paragraph under a DISPLAY or STATEMENT heading.
 *
 * Section leads had accumulated four different treatments — bare
 * `text-muted-foreground`, `text-lg`, `text-xl font-medium`, and
 * `text-lg leading-relaxed` — chosen per file rather than per role. At display
 * scale a default-size lead looks like a caption that fell off the heading, so
 * this token sets the one relationship that matters: noticeably larger than
 * body copy, clearly quieter than any heading.
 *
 * `max-w-*` is intentionally NOT baked in. Measure depends on whether the lead
 * sits in a single column or a grid cell, so the call site owns it.
 */
export const TYPE_LEAD =
  "text-lg leading-[1.6] text-muted-foreground sm:text-xl sm:leading-[1.55]";

/**
 * Metadata: a date, a role, a location, a source note, a caption.
 *
 * Distinct from `TYPE_MICRO_LABEL` because metadata is sentence-case running
 * text that happens to be small, not an uppercase structural marker. Keeping
 * them apart is what stops every small string on the page from becoming another
 * wide-tracked all-caps label.
 *
 * Holds the same 12px floor as the micro tier — the page had `text-[10px]` and
 * `text-[11px]` metadata that is uncomfortable on a phone.
 */
export const TYPE_META = "text-xs leading-relaxed text-text-subtle";
