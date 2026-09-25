/**
 * Motion tokens — the homepage's one physics vocabulary.
 *
 * Plain module: no I/O, no React, no framework imports (the values are plain
 * data that Framer Motion accepts), so it is importable from both server and
 * client components, matching the `brand-type.ts` and `section-rhythm.ts`
 * convention.
 *
 * ## Why this module exists
 *
 * The same two constants were copy-pasted across the page:
 *
 * 1. `SPRING` — `{ type: "spring", stiffness: 100, damping: 20, mass: 1 }` was
 *    re-declared verbatim in nine homepage sections.
 * 2. `EASE` — `[0.16, 1, 0.3, 1]` was re-declared in nine files.
 *
 * Both are now single exports. The values are unchanged, so every section that
 * switches to these tokens animates exactly as it did before.
 *
 * ## Stagger is a register, not a number
 *
 * The page had accumulated four different `staggerChildren` values with nothing
 * recording why any of them was chosen. A stagger communicates how many things
 * are arriving and how related they are, so the tiers below are named for that
 * intent instead of left as bare decimals at each call site.
 *
 * ## What this module does NOT change
 *
 * The SSR-visibility contract is owned by `scroll-reveal.tsx` /
 * `progress-reveal.tsx` and is untouched here: `initial` stays `false`, the
 * hidden state still arms after hydration through `useMotionReady`, and every
 * `hidden` variant still carries `transition: { duration: 0 }` so arming is a
 * pre-paint state change rather than a visible animation out. These tokens
 * describe the *arrival*; they never describe the hidden state.
 *
 * Reduced motion also stays where it is — resolved per component via
 * `useReducedMotion()`, because only the component knows what its settled
 * composition looks like.
 */

/* ─────────────────────────────────────────────────────────────────────────────
   PHYSICS
   ───────────────────────────────────────────────────────────────────────────── */

/**
 * The house spring, used for every content arrival on the page.
 *
 * Critically damped enough not to overshoot (damping 20 against stiffness 100),
 * which is what keeps a heading from bouncing as it settles. Do not tune these
 * per section: a page whose springs differ section to section reads as
 * inconsistent rather than as intentional variety.
 */
export const SPRING = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 1,
} as const;

/**
 * The house cubic-bezier, for the few places a fixed duration is correct —
 * crossfades, height reveals, and anything that must finish in a known time.
 *
 * Strongly decelerating: fast to start, long tail to settle.
 */
export const EASE = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────────────────────────────────────────────────────────
   STAGGER REGISTERS
   ───────────────────────────────────────────────────────────────────────────── */

/**
 * Tier 1 — FIELD. A dense grid or index of peer items (ten industry cards, a
 * list of tags).
 *
 * Deliberately the shortest interval: with many items, a longer stagger makes
 * the last one arrive noticeably late and the whole field feel sluggish. The
 * effect should read as one surface resolving, not as items queueing.
 */
export const STAGGER_FIELD = 0.05;

/**
 * Tier 2 — COPY. The default: a header block's eyebrow, heading and lead, or a
 * handful of cards.
 *
 * Long enough that the order of arrival is legible, short enough that the block
 * still reads as a single unit. This is the value most of the page already
 * used, and it stays the right answer for prose.
 */
export const STAGGER_COPY = 0.08;

/**
 * Tier 3 — SEQUENCE. A small set of items whose *order* carries meaning — the
 * stages of a process, the steps of a journey.
 *
 * Slower on purpose: here the arrival order is information, so it is worth the
 * extra beat between items.
 */
export const STAGGER_SEQUENCE = 0.1;

/**
 * Tier 4 — STAGED. Whole sub-scenes that must not overlap.
 *
 * Reserved for the START → GROW → SCALE capability construction in
 * `services-bento.tsx`, where each child is an entire animated visual rather
 * than a line of text; overlapping them would produce three things moving at
 * once and no legible sequence. Documented as its own tier precisely so this
 * unusually long interval is not mistaken for a typo and "corrected" to
 * `STAGGER_COPY`.
 */
export const STAGGER_STAGED = 0.35;
