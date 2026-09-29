import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowDown } from "lucide-react";

import { WEB_DESIGN_CORE_POSITIONING, WEB_DESIGN_HERO } from "@/lib/web-design-data";
import { PILLAR_PLAIN } from "@/lib/web-design-plain-language";
import { PILLAR_WEIGHT, type PillarAccent } from "@/lib/web-design-visual-system";
import { TYPE_MICRO } from "@/lib/brand-type";
import { Button } from "@/components/ui/button";

import { WebDesignChatTrigger } from "./web-design-chat-trigger";
import { HeroComposition } from "./visuals/hero-composition";
import { PillarRatioBar, type RatioSegment } from "./visuals/pillar-ratio-bar";

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 1 — HERO.

   ## What changed and why

   The previous hero was a centred `max-w-3xl` column: badge, H1, H2, paragraph,
   two buttons, microcopy, three chips. Eight stacked elements on one axis, all
   competing, with the H1 at `text-6xl` — the same shape as every SaaS template
   landing page, and a composition in which the headline was not the largest
   thing on screen for long.

   This is an asymmetric editorial split. Copy holds a seven-column measure on
   the page's left axis; the device composition occupies the right and breaks out
   of the container on wide viewports so the page feels wider than its own grid.

   ## FINAL PASS — the Home page's typographic DNA

   The composition stays; the headline's *voice* changed, because that was the
   one thing making this page read as a different website from the Home page.

   Three properties carry the Home H1's identity, and none of them is its size:

   1. `leading-[0.92]` — Home sets 0.88. The previous 1.02 here is paragraph
      leading, and paragraph leading is what made a 4.35rem headline read as
      large body copy rather than as display type. This is the single most
      recognisable half of the DNA.
   2. `tracking-tighter` — the same token Home uses, rather than this page's
      hand-rolled `-0.025em`.
   3. One brand-emphasised phrase. Home paints the meaningful tail of its H1
      ("find, trust and use.") in the approved cyan → blue → violet sweep and
      leaves the rest at full-strength ink. Here the meaningful tail is
      "Hyderabad Businesses" — the whole commercial point of the page — and it
      gets the same treatment against the light-surface stops.

   The ceiling stays below Home's (4.75rem vs 5.75rem) on purpose: this is a
   sibling, and the site's largest type belongs to the site's front door.

   ## Why the sweep is sliced per word, not applied to a wrapper

   Verbatim the reason documented in `home/hero.tsx`: the words are individual
   `will-change: transform` compositing layers, and Chrome drops a
   `background-clip: text` mask owned by an ancestor of those layers — which
   silently deletes the glyphs, because the mask is the only thing painting them.
   Declaring the clip on the word span that owns the layer keeps mask and glyphs
   in one paint layer. `globals.css` carries a `@supports` fallback
   (`.brand-word-on-paper`, contrast-checked at 6.29:1 on white) for engines that
   cannot clip a background to text at all, so the headline can never lose its
   tail.

   ## The 70/20/10 promise

   It used to be three pill-shaped chips, which is the weakest possible reading
   of a proportional model. It is now the `PillarRatioBar` — one object, split by
   the real weights, sitting on the page's left axis as the hero's closing line.
   The same component reappears at display scale in section 3, so the promise and
   the explanation are visibly the same instrument.

   The final pass added the plain-language layer: each segment now leads with
   what the pillar *is* to a business owner ("The Website", "The Brand", "The
   Launch") and keeps the deck's own label beneath it. A visitor who reads only
   the bar still leaves understanding the model.

   ## SSR and motion

   Every word here is a plain server-rendered text node: the H1, H2, lead,
   microcopy and pillar labels all exist in the served HTML with no inline
   opacity. The two client islands are the decorative `HeroComposition`
   (`aria-hidden`) and the ratio bar, whose labels are real text and whose
   animated part is the `aria-hidden` bar itself.

   The headline uses the page-wide CSS word reveal (`.hero-word` in globals.css)
   rather than a JS animation: it is fill-mode `both`, so the words are in the
   HTML, and it is already disabled under `prefers-reduced-motion`. That is how
   the homepage hero solved the identical problem, and reusing it means the
   service page's headline entrance cannot drift from the site's.
   ──────────────────────────────────────────────────────────────────────────── */

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
 * The `index`-th of `total` phrase words, painted with the share of the sweep it
 * would have shown under a single whole-phrase gradient.
 *
 * `background-size` stretches the gradient across `total` word widths and
 * `background-position` slides each word its own step over it, so the
 * cyan → violet progression runs once across the phrase instead of restarting on
 * every word.
 */
function brandPhraseWordStyle(index: number, total: number): CSSProperties {
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
 * The first word of the H1's meaningful tail.
 *
 * Resolved against the real word order rather than hardcoded as an index, so the
 * sweep cannot land on the wrong words if the deck's approved headline is ever
 * re-approved with different wording. If the word is absent the phrase simply
 * does not start and the H1 renders entirely in ink — a silent, safe fallback
 * rather than a mis-painted headline.
 */
const BRAND_PHRASE_FIRST_WORD = "Hyderabad";

/**
 * How many leading words paint on the first frame.
 *
 * The H1 is this page's likely LCP element and a `.hero-word` still waiting on
 * its stagger delay is painted at `opacity: 0`. The same three-word exemption
 * the Home hero uses, for the same measured reason.
 */
const LCP_IMMEDIATE_WORDS = 3;

/**
 * Per-word spans so the CSS reveal can stagger the headline, with the brand
 * phrase carrying its slice of the sweep.
 *
 * The clip is declared on the same span that carries the `hero-word` transform —
 * never on a wrapper around the phrase — for the compositing reason documented
 * above.
 */
function RevealWords({
  text,
  step = "45ms",
  offset = 0,
  brandFromWord,
}: {
  text: string;
  step?: string;
  offset?: number;
  /** Index (within this text) of the first brand-phrase word. -1 disables. */
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
                ...(index < LCP_IMMEDIATE_WORDS
                  ? { animationDelay: "0ms" }
                  : null),
                ...(inPhrase
                  ? brandPhraseWordStyle(i - brandAt, brandTotal)
                  : null),
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

export function WebDesignHero() {
  const {
    eyebrow,
    h1,
    subhead,
    lead,
    primaryCtaLabel,
    secondaryCtaLabel,
    microcopy,
    pillarsSummary,
  } = WEB_DESIGN_HERO;

  const brandFromWord = h1.split(" ").indexOf(BRAND_PHRASE_FIRST_WORD);

  /* The bar's segments are assembled from the copy deck's own summary plus the
     shared weight table, so the hero cannot describe a different ratio from the
     framework section. The plain-language name is looked up from the same pillar
     id the weight is, so the two layers cannot fall out of step. */
  const segments: RatioSegment[] = pillarsSummary.map((pill, i) => {
    const pillarId =
      ["web-design", "branding", "local-launch"][i] ?? "web-design";
    return {
      id: `${pill.percentage}-${i}`,
      label: pill.label,
      plainName: PILLAR_PLAIN[pillarId]?.name,
      percentage: pill.percentage,
      accent: pill.accent as PillarAccent,
      weight: PILLAR_WEIGHT[pillarId] ?? 10,
    };
  });

  return (
    <section className="relative overflow-hidden bg-background pt-6 pb-24 sm:pt-8 sm:pb-32 lg:pt-10 lg:pb-40">
      {/* ATMOSPHERE. A single wide, very low-alpha wash anchored top-right,
          behind everything, so the hero reads as lit rather than gradient-washed.
          Decorative and inert. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 60% at 78% -8%, rgba(67, 83, 201, 0.13), transparent 68%), radial-gradient(48% 50% at 8% 8%, rgba(14, 116, 144, 0.07), transparent 70%)",
        }}
      />
      {/* A hairline grid, at 3% opacity. Provides the faint sense of an
          underlying design grid without becoming a visible pattern. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #0E1524 1px, transparent 1px), linear-gradient(to bottom, #0E1524 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(80% 60% at 50% 0%, black 10%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(80% 60% at 50% 0%, black 10%, transparent 75%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
          {/* ── COPY ─────────────────────────────────────────────────────── */}
          <div className="lg:col-span-6 xl:col-span-6">
            {/* The eyebrow is long-form keyword copy from the deck; it is set as
                a two-line micro label rather than squeezed into a pill, which is
                what forced it to `text-xs` truncation pressure before. */}
            <p className={`${TYPE_MICRO} flex items-start gap-2.5 text-text-subtle`}>
              <span
                aria-hidden
                className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-accent-blue"
              />
              <span className="max-w-[34ch] leading-relaxed">{eyebrow}</span>
            </p>

            {/* THE PRIMARY OBJECT.

                `leading-[0.92]` and `tracking-tighter` are the Home H1's own
                values (0.88 / tracking-tighter), lifted a hair because this
                headline sits in a six-column measure rather than seven and wraps
                to three lines at the cap. The ceiling stays below Home's
                5.75rem: the site's largest type belongs to the site's front
                door, and a sibling that out-shouts it is not a sibling.

                The tail — "Hyderabad Businesses" — carries the approved
                light-surface sweep, one word-slice at a time, exactly as Home
                paints "find, trust and use." The rest of the headline stays at
                full-strength ink, so the page has one typographic brand moment
                rather than a gradient wall. */}
            <h1
              className="mt-7 text-[clamp(2.5rem,5.8vw,4.75rem)] font-semibold leading-[0.92] tracking-tighter text-foreground text-balance"
              style={{ opacity: 1 }}
            >
              <RevealWords text={h1} brandFromWord={brandFromWord} />
            </h1>

            {/* The subhead drops hard in scale — the beat between the two is
                what makes the H1 read as display type rather than as a big
                paragraph. It also carries the page's whole promise in nine
                words, which is why it is the one supporting line set at full
                foreground weight. */}
            <h2 className="mt-7 max-w-[32ch] text-xl font-medium leading-snug tracking-tight text-foreground/80 sm:text-2xl">
              {subhead}
            </h2>

            <p className="mt-6 max-w-[54ch] text-base leading-[1.7] text-muted-foreground sm:text-lg">
              {lead}
            </p>

            <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <WebDesignChatTrigger
                label={primaryCtaLabel}
                variant="hero"
                showSparkle
              />
              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-12 rounded-full border-border bg-card/70 px-6 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-200 hover:border-border-strong hover:bg-card"
              >
                <Link href="#design-scope">
                  <span>{secondaryCtaLabel}</span>
                  <ArrowDown className="size-4 text-muted-foreground" />
                </Link>
              </Button>
            </div>

            <p className="mt-5 max-w-[48ch] text-xs leading-relaxed text-text-disabled">
              {microcopy}
            </p>
          </div>

          {/* ── COMPOSITION ──────────────────────────────────────────────── */}
          {/* Breaks the container on `xl`: the stack reaches past the grid's
              right edge so the hero feels wider than the page, which is the
              cheapest way to make a composition feel art-directed rather than
              placed in a column. */}
          <div className="lg:col-span-6 xl:-mr-16 2xl:-mr-28">
            <HeroComposition />
          </div>
        </div>

        {/* ── THE MODEL ────────────────────────────────────────────────────
            Sits below both columns on the page's left axis, closing the hero
            with the proportional claim the rest of the page then unpacks.

            The label is the framework's own name, read from the copy deck rather
            than written here, so the hero cannot introduce a second name for the
            model that section 3 explains. */}
        <div className="mt-24 border-t border-border-subtle pt-10 sm:mt-28 lg:mt-32">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-[22ch] text-sm font-semibold leading-relaxed tracking-tight text-text-subtle">
              {WEB_DESIGN_CORE_POSITIONING.h2}
            </p>
            <PillarRatioBar segments={segments} className="lg:max-w-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
