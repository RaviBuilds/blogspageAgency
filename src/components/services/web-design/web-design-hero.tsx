import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowDown } from "lucide-react";

import { WEB_DESIGN_CORE_POSITIONING, WEB_DESIGN_HERO } from "@/lib/web-design-data";
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
   The H1 is fluid to 4.5rem and is unambiguously the primary object.

   ## The 70/20/10 promise

   It used to be three pill-shaped chips, which is the weakest possible reading
   of a proportional model. It is now the `PillarRatioBar` — one object, split by
   the real weights, sitting on the page's left axis as the hero's closing line.
   The same component reappears at display scale in section 3, so the promise and
   the explanation are visibly the same instrument.

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

/** Per-word spans so the CSS reveal can stagger the headline. */
function RevealWords({
  text,
  step = "70ms",
  offset = 0,
}: {
  text: string;
  step?: string;
  offset?: number;
}) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span
          key={`${i}-${word}`}
          className="hero-word inline-block"
          style={
            {
              "--word-index": i + offset,
              "--word-step": step,
            } as CSSProperties
          }
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
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

  /* The bar's segments are assembled from the copy deck's own summary plus the
     shared weight table, so the hero cannot describe a different ratio from the
     framework section. */
  const segments: RatioSegment[] = pillarsSummary.map((pill, i) => ({
    id: `${pill.percentage}-${i}`,
    label: pill.label,
    percentage: pill.percentage,
    accent: pill.accent as PillarAccent,
    weight:
      PILLAR_WEIGHT[
        ["web-design", "branding", "local-launch"][i] ?? "web-design"
      ] ?? 10,
  }));

  return (
    <section className="relative overflow-hidden bg-background pt-14 pb-24 sm:pt-20 sm:pb-32 lg:pt-24 lg:pb-40">
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

            {/* THE PRIMARY OBJECT. Fluid to 4.5rem, tight leading, and the one
                phrase that carries meaning ("Hyderabad Businesses") is not
                gradient-treated here: on this light surface the full-strength
                ink headline is the stronger statement, and the page's brand
                sweep is spent on the framework and the closing CTA instead. */}
            <h1 className="mt-7 text-[clamp(2.35rem,5.4vw,4.35rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-foreground text-balance">
              <RevealWords text={h1} />
            </h1>

            {/* The subhead drops hard in scale — the beat between the two is
                what makes the H1 read as display type rather than as a big
                paragraph. */}
            <h2 className="mt-6 max-w-[30ch] text-xl font-medium leading-snug tracking-tight text-text-subtle sm:text-2xl">
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
