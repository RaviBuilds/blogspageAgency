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
 * Tier 1 — STATEMENT. The page's raised voice, reserved for the few moments
 * that carry a belief rather than a label: the manifesto beat and the final
 * call. Fluid so it never needs a breakpoint ladder, floored at 2rem so it
 * stays a statement on a phone, and capped well below the hero's 5.75rem cap
 * so nothing competes with the H1.
 *
 * Use sparingly. Three of these on one page is already the limit; the fourth
 * turns emphasis back into wallpaper.
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
