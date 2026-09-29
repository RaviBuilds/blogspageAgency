import Link from "next/link";
import { ArrowDown } from "lucide-react";

import {
  WEB_DEVELOPMENT_CAPABILITY_LADDER,
  WEB_DEVELOPMENT_HERO,
} from "@/lib/web-development-data";
import { LADDER_WEIGHT } from "@/lib/web-development-visual-system";
import { TYPE_MICRO } from "@/lib/brand-type";
import { Button } from "@/components/ui/button";
import { BrandRevealWords } from "@/components/services/shared/brand-reveal-words";

import { WebDevelopmentChatTrigger } from "./web-development-chat-trigger";
import { RequestPath } from "./visuals/request-path";
import { LadderRail } from "./visuals/ladder-rail";

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 01 — HERO.

   ## Same brand, different subject

   The composition is deliberately the *shape* of the Web Design hero — an
   asymmetric editorial split with copy on the page's left axis, artwork on the
   right breaking the container on wide viewports, and one instrument closing the
   hero below both columns — because those three decisions are what make the two
   pages read as siblings rather than as two templates.

   What differs is what fills them. Web Design puts a browser window and a phone
   in the right column and a proportional bar at the bottom. This page puts the
   **request path** there (a customer action travelling through interface →
   rules → data → dashboard → payment/notification) and closes on the **level
   ladder**, because this page's model is a progression, not a ratio. No browser
   chrome, no phone frame, no device mockup: that register belongs to the other
   page.

   ## Typography

   The H1 carries the site's headline DNA — `tracking-tighter`, sub-1.0 leading,
   and one brand-emphasised phrase in the approved cyan → blue → violet sweep,
   painted per word through the shared `BrandRevealWords` primitive. The
   meaningful tail here is "Business Systems", which is the whole commercial
   point of the page. The ceiling stays below the Home hero's, for the same
   reason the Web Design hero's does: the site's largest type belongs to the
   site's front door.

   The subhead is the page's thesis in nine words and is the one supporting line
   set at full foreground weight; it renders as a `<p>` rather than an `<h2>`, so
   the section headings below it own the document's h2 level uninterrupted.

   ## SSR and motion

   Every word in this section is a plain server-rendered text node. The single
   client island is `RequestPath`, whose labels and sentences are real text and
   whose animated parts (rails, node dots) are `aria-hidden`. The headline
   entrance is the page-wide CSS word reveal, already disabled under
   `prefers-reduced-motion`.
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * The first word of the H1's meaningful tail.
 *
 * Resolved against the real word order rather than hardcoded as an index, so the
 * sweep cannot land on the wrong words if the approved headline is re-approved
 * with different wording. If the word is absent the phrase simply does not start
 * and the H1 renders entirely in ink.
 */
const BRAND_PHRASE_FIRST_WORD = "Business";

export function WebDevelopmentHero() {
  const {
    eyebrow,
    h1,
    subhead,
    lead,
    primaryCtaLabel,
    secondaryCtaLabel,
    microcopy,
    requestPath,
    outcomes,
    requestPathCaption,
    outcomesLabel,
  } = WEB_DEVELOPMENT_HERO;

  const brandFromWord = h1.split(" ").indexOf(BRAND_PHRASE_FIRST_WORD);

  /* The rail's rungs are assembled from the ladder section's own levels plus the
     shared weight table, so the hero cannot promise a different progression from
     the one section 03 explains. */
  const rungs = WEB_DEVELOPMENT_CAPABILITY_LADDER.levels.map((level, i) => ({
    id: level.id,
    label: level.railLabel,
    weight: LADDER_WEIGHT[level.id] ?? i + 1,
  }));

  return (
    <section className="relative overflow-hidden bg-background pt-6 pb-24 sm:pt-8 sm:pb-32 lg:pt-10 lg:pb-40">
      {/* ATMOSPHERE — a restrained blueprint wash, distinct from Web Design's
          top-right radial: this one is anchored top-left, so the two heroes are
          lit from opposite sides and never read as the same image. Decorative
          and inert. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 55% at 12% -6%, rgba(67, 83, 201, 0.11), transparent 68%), radial-gradient(45% 45% at 92% 10%, rgba(124, 58, 237, 0.06), transparent 70%)",
        }}
      />
      {/* A hairline grid — the page's "blueprint" signature. Slightly tighter
          and slightly stronger than Web Design's 72px/3.5% grid, because a
          system page may show its construction lines. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #0E1524 1px, transparent 1px), linear-gradient(to bottom, #0E1524 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(75% 55% at 50% 0%, black 10%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(75% 55% at 50% 0%, black 10%, transparent 75%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
          {/* ── COPY ─────────────────────────────────────────────────────── */}
          <div className="lg:col-span-7">
            <p className={`${TYPE_MICRO} flex items-start gap-2.5 text-text-subtle`}>
              <span
                aria-hidden
                className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-accent-violet"
              />
              <span className="max-w-[38ch] leading-relaxed">{eyebrow}</span>
            </p>

            <h1
              className="mt-7 text-[clamp(2.375rem,5.4vw,4.5rem)] font-semibold leading-[0.95] tracking-tighter text-foreground text-balance"
              style={{ opacity: 1 }}
            >
              <BrandRevealWords text={h1} brandFromWord={brandFromWord} />
            </h1>

            {/* The hard drop in scale after the H1 is what makes the headline
                read as display type rather than as large body copy. */}
            <p className="mt-7 max-w-[34ch] text-xl font-medium leading-snug tracking-tight text-foreground/80 sm:text-2xl">
              {subhead}
            </p>

            <p className="mt-6 max-w-[56ch] text-base leading-[1.7] text-muted-foreground sm:text-lg">
              {lead}
            </p>

            <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <WebDevelopmentChatTrigger
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
                <Link href="#proof">
                  <span>{secondaryCtaLabel}</span>
                  <ArrowDown aria-hidden className="size-4 text-muted-foreground" />
                </Link>
              </Button>
            </div>

            <p className="mt-5 max-w-[48ch] text-xs leading-relaxed text-text-disabled">
              {microcopy}
            </p>
          </div>

          {/* ── COMPOSITION ──────────────────────────────────────────────── */}
          {/* Breaks the container on `xl`, the same device the Web Design hero
              uses, so the hero feels wider than its own grid. */}
          <div className="lg:col-span-5 xl:-mr-10 2xl:-mr-20">
            <RequestPath
              stages={requestPath}
              outcomes={outcomes}
              caption={requestPathCaption}
              outcomesLabel={outcomesLabel}
            />
          </div>
        </div>

        {/* ── THE MODEL ────────────────────────────────────────────────────
            Below both columns on the page's left axis, closing the hero with the
            progression the rest of the page unpacks. The label is the ladder
            section's own heading, read from the copy deck rather than written
            here, so the hero cannot introduce a second name for the model. */}
        <div className="mt-20 border-t border-border-subtle pt-10 sm:mt-24 lg:mt-28">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <p className="max-w-[24ch] text-sm font-semibold leading-relaxed tracking-tight text-text-subtle">
              {WEB_DEVELOPMENT_CAPABILITY_LADDER.h2}
            </p>
            <LadderRail
              rungs={rungs}
              href="#capability-ladder"
              hrefLabel="Find your level"
              className="lg:max-w-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
