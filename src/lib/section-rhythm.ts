/**
 * Section rhythm tokens — how much room each homepage section takes, and what
 * that room means.
 *
 * Plain module: no I/O, no React, no framework imports — importable from both
 * server and client components, matching the `homepage-data.ts` and
 * `brand-type.ts` convention.
 *
 * ## Why this module exists
 *
 * Thirteen homepage sections shipped the identical `py-24 lg:py-32`. Uniform
 * spacing sounds like consistency, but it removes the page's only structural
 * signal: nothing told a reader whether they had entered a new movement or were
 * still inside the previous one. Every boundary felt equally important, which
 * means none of them did.
 *
 * Editorial pages solve this with unequal space. A chapter opening gets air; a
 * section that continues the argument above it stays tucked against its parent;
 * an archive gets compressed because it is reference material. The gap itself
 * carries the meaning, before a single word is read.
 *
 * ## The tiers are about relationship, not size
 *
 * Pick a tier by asking what a section *is* to the one above it, not by how
 * much space looks nice. `RHYTHM_CONTINUE` deliberately keeps a tight top pad
 * so two sections read as one movement — it is the only tier with asymmetric
 * padding, and that asymmetry is the whole point.
 *
 * Horizontal containers are unchanged (`mx-auto max-w-6xl px-6 lg:px-8`); this
 * module governs vertical rhythm only.
 */

/**
 * Tier 1 — MOVEMENT. Opens a new chapter of the page's argument.
 *
 * The most air any section gets, so the boundary registers as a change of
 * subject rather than the next item in a list. Reserved for the handful of
 * sections that genuinely start something: the wayfinding question, and the
 * three scanning anchors (`#services`, `#work`, `#process`) plus the
 * conversation. Spending this on every section is what produced the flat page
 * in the first place.
 */
export const RHYTHM_MOVEMENT = "py-28 lg:py-40";

/**
 * Tier 2 — SECTION. A standalone section that neither opens a movement nor
 * belongs to the one above it.
 *
 * The previous page-wide default, kept at its exact values so sections that
 * legitimately sit at this tier render unchanged.
 */
export const RHYTHM_SECTION = "py-24 lg:py-32";

/**
 * Tier 3 — CONTINUE. This section is the second half of the one above it.
 *
 * Asymmetric on purpose: a tight top pad binds it to its parent while a full
 * bottom pad still closes the movement properly. Used where two sections are
 * one continuous idea — BrandStory's two chapters (which already share a single
 * scroll progress value), the work archive under the flagship gallery, and the
 * growth pillars under the process narrative.
 */
export const RHYTHM_CONTINUE = "pt-10 pb-24 lg:pt-14 lg:pb-32";

/**
 * Tier 4 — QUIET. Reference material rather than argument.
 *
 * Compressed because an index does not need to be dwelt on. The journal sits
 * here, matching its `TYPE_QUIET` heading.
 */
export const RHYTHM_QUIET = "py-16 lg:py-20";
