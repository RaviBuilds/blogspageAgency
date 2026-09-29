/**
 * Service-page headline primitive — the per-word CSS reveal plus the brand
 * phrase sweep.
 *
 * Extracted verbatim from `web-design-hero.tsx`, which had authored it inline.
 * The Web Development hero needs the identical treatment, and a second copy of
 * a mechanism this subtle is how two sibling pages end up with headlines that
 * animate and paint slightly differently from each other.
 *
 * ## Why this file is server-renderable
 *
 * There is no hook and no `"use client"`: the reveal is the `.hero-word`
 * keyframe in `globals.css`, driven by a `--word-index` custom property set
 * per word. So the words are plain text nodes in the served HTML (fill-mode
 * `both` holds the `from` state, it is never `opacity: 0` in the markup as an
 * *inline* style a crawler would read as hidden), and the animation is already
 * disabled under `prefers-reduced-motion` by that stylesheet.
 *
 * ## Why the gradient clip is declared on the word span
 *
 * Verbatim the reason documented in `home/hero.tsx` and the Web Design hero:
 * the words are individual `will-change: transform` compositing layers, and
 * Chrome drops a `background-clip: text` mask owned by an *ancestor* of those
 * layers — which silently deletes the glyphs, because the mask is the only
 * thing painting them. Declaring the clip on the span that owns the layer keeps
 * mask and glyphs in one paint layer.
 *
 * `globals.css` carries the `@supports` fallback (`.brand-word-on-paper`,
 * contrast-checked at 6.29:1 on white) for engines that cannot clip a
 * background to text at all, so a headline can never lose its tail.
 */

import type { CSSProperties } from "react";

/**
 * The approved light-surface sweep, as gradient stops.
 *
 * Mirrors `BRAND_TEXT_GRADIENT` in `brand-type.ts` but as a bare
 * `background-image` string, because each word needs its own
 * `background-size` / `background-position` slice of the same sweep and the
 * token is a complete style object.
 */
const BRAND_PHRASE_STOPS =
  "linear-gradient(90deg, #0891B2 0%, #4353C9 52%, #7C3AED 100%)";

/**
 * The `index`-th of `total` phrase words, painted with the share of the sweep
 * it would have shown under a single whole-phrase gradient.
 *
 * `background-size` stretches the gradient across `total` word widths and
 * `background-position` slides each word its own step over it, so the
 * cyan → violet progression runs once across the phrase instead of restarting
 * on every word.
 */
export function brandPhraseWordStyle(index: number, total: number): CSSProperties {
  return {
    backgroundImage: BRAND_PHRASE_STOPS,
    backgroundSize: `${total * 100}% 100%`,
    backgroundPosition: `${total > 1 ? (index / (total - 1)) * 100 : 0}% 0`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
  };
}

/**
 * How many leading words paint on the first frame.
 *
 * A service-page H1 is that page's likely LCP element, and a `.hero-word`
 * still waiting on its stagger delay is painted at `opacity: 0`. The same
 * three-word exemption the Home hero uses, for the same measured reason.
 */
const LCP_IMMEDIATE_WORDS = 3;

/**
 * Per-word spans so the CSS reveal can stagger a headline, with an optional
 * brand phrase carrying its slice of the sweep.
 *
 * @param brandFromWord Index (within `text`) of the first brand-phrase word.
 *   A negative value — which is what `Array.indexOf` returns when the approved
 *   headline no longer contains the expected word — disables the phrase and
 *   renders the whole headline in ink. A silent, safe fallback rather than a
 *   mis-painted headline.
 */
export function BrandRevealWords({
  text,
  step = "45ms",
  offset = 0,
  brandFromWord,
}: {
  text: string;
  step?: string;
  offset?: number;
  brandFromWord?: number;
}) {
  const words = text.split(" ");
  const brandAt = brandFromWord === undefined ? -1 : brandFromWord;
  const brandTotal = brandAt >= 0 ? words.length - brandAt : 0;

  return (
    <>
      {words.map((word, i) => {
        const index = i + offset;
        const inPhrase = brandAt >= 0 && i >= brandAt;

        return (
          <span
            key={`${i}-${word}`}
            className={`hero-word inline-block${inPhrase ? " brand-word-on-paper" : ""}`}
            style={
              {
                "--word-index": index,
                "--word-step": step,
                ...(index < LCP_IMMEDIATE_WORDS ? { animationDelay: "0ms" } : null),
                ...(inPhrase ? brandPhraseWordStyle(i - brandAt, brandTotal) : null),
              } as CSSProperties
            }
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        );
      })}
    </>
  );
}
