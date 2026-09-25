"use client";

import { Fragment } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Building2,
  ChevronRight,
  Globe,
  LayoutDashboard,
  Search,
  Send,
  Settings,
  User,
  UserPlus,
  Users,
  Workflow,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  GROWTH_PILLARS,
  GROWTH_SECTION,
  TRUST,
  type GrowthPillar,
  type GrowthPillarId,
} from "@/lib/homepage-data";
import {
  BRAND_TEXT_GRADIENT,
  TYPE_MICRO_LABEL,
  TYPE_SECTION,
} from "@/lib/brand-type";
import { RHYTHM_CONTINUE } from "@/lib/section-rhythm";
import { EASE, STAGGER_COPY } from "@/lib/motion";
import { useStaggerReveal } from "@/components/home/scroll-reveal";

/**
 * MOVEMENT 5b — "How your business grows" (`id="models"`).
 *
 * Refinement Plan §21 (Scene 04 — "Three Vertical Growth System") and the
 * Motion Blueprint's Signature 3 ("Digital journey grows: START → BUILD →
 * SCALE"): the homepage's engagement-model section is reframed as the
 * three-pillar growth trajectory — one rail, three connected worlds. The old
 * `delivery-models.tsx` stays in the repo for `/about`'s `DELIVERY_MODELS`
 * import; this component now carries the blueprint-mandated `#models` anchor.
 *
 * Relationship to ServiceVerticals (the WHAT-WE-BUILD section): capability
 * wording mirrors `homepage-verticals.ts`, but this section answers a
 * different question — how a business *moves through* the pillars over time —
 * so it carries one section-level conversation CTA and no per-pillar routes.
 *
 * Motion contract (Blueprint: meaningful motion only): `whileInView` reveals
 * with `once: false` so the sequence reverses on upward scroll; transform +
 * opacity only; hover is a pre-painted accent layer crossfade (never
 * `border-color` animation); gated by `useReducedMotion()` — when reduced,
 * every element mounts in its final state with no transform or fade. No
 * scroll-progress system here: `#process` owns the page's one scroll system.
 */

/** The continuous START → BUILD → SCALE rail (cyan → blue → violet). */
const RAIL_GRADIENT =
  "linear-gradient(90deg, rgba(14,116,144,0.55), rgba(67,83,201,0.55), rgba(124,58,237,0.55))";
const RAIL_GRADIENT_VERTICAL =
  "linear-gradient(180deg, rgba(14,116,144,0.45), rgba(124,58,237,0.45))";

/** Chain icons — mapped in the component, never stored in data. */
type IconComponent = typeof Building2;
const PILLAR_CHAIN_ICONS: Record<
  GrowthPillarId,
  readonly [IconComponent, IconComponent, IconComponent, IconComponent]
> = {
  "brand-digital-presence": [Building2, Globe, Search, User],
  "applications-software": [User, Users, LayoutDashboard, Settings],
  "ai-automation": [UserPlus, Bot, Workflow, Send],
};

/* Motion variants — a function variant lets each world join the sequence with
   its index-based delay (START → BUILD → SCALE) when they share a viewport. */
/* Every `hidden` below is instant. These scenes arm their hidden state *after*
   hydration (see `useStaggerReveal`), so a timed `hidden` would read as an
   animation away from the already-painted server composition. Only `visible`
   carries a duration. */
const worldRise: Variants = {
  hidden: { opacity: 0, y: 24, transition: { duration: 0 } },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE, delay: index * 0.18 },
  }),
};

const chainStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER_COPY, delayChildren: 0.3 } },
};

const chainNodeRise: Variants = {
  hidden: { opacity: 0, y: 8, transition: { duration: 0 } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

/** Section intro + closing blocks: one shared rise. */
const introRise: Variants = {
  hidden: { opacity: 0, y: 16, transition: { duration: 0 } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const quietRise: Variants = {
  hidden: { opacity: 0, y: 12, transition: { duration: 0 } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/**
 * These scenes re-arm when they leave the viewport, so an upward scroll
 * reverses them. `SEQUENCE_VIEWPORT` still drives the decorative rails below;
 * the text-bearing blocks pass the same `once: false` through the SSR-safe
 * reveal gate instead, which is what keeps their headings out of the server
 * HTML's hidden state.
 */
const SEQUENCE_VIEWPORT = { once: false as const, margin: "-100px" };

/** Shared options for this section's reversible, text-bearing reveals. */
const SEQUENCE_REVEAL = {
  once: false,
  margin: "-100px",
  shownLabel: "visible",
} as const;

export function GrowthPathways() {
  return (
    <section
      id="models"
      /* CONTINUE: the growth pillars answer the process narrative directly
         above — how a business moves through the stages it just watched being
         built. Tight top pad reads the two as one movement. */
      className={`scroll-mt-24 border-t border-border-subtle bg-background-subtle ${RHYTHM_CONTINUE}`}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <GrowthIntro />
        <div className="mt-16">
          <PathwayRail />
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-6">
            {GROWTH_PILLARS.map((pillar, index) => (
              <GrowthWorld key={pillar.id} pillar={pillar} index={index} />
            ))}
          </div>
        </div>
        <TrustLine />
        <SectionCta />
      </div>
    </section>
  );
}

function GrowthIntro() {
  const { heading, headingAccent } = GROWTH_SECTION;
  const headingMain = heading.startsWith(headingAccent)
    ? heading.slice(headingAccent.length)
    : "";
  /* SSR-safe gate: this block holds the section's `<h2>`, so the server HTML
     must ship it visible. */
  const reveal = useStaggerReveal(SEQUENCE_REVEAL);

  return (
    <motion.div
      variants={introRise}
      {...reveal}
      /* Left-aligned — narrative movement, see brand-story.tsx. */
      className="max-w-2xl"
    >
      {/* Not a scanning anchor — muted micro label, see bento-grid. */}
      <p className={TYPE_MICRO_LABEL}>{GROWTH_SECTION.eyebrow}</p>
      <h2 className={`mt-3 ${TYPE_SECTION}`}>
        {headingMain ? (
          <>
            <span style={BRAND_TEXT_GRADIENT}>{headingAccent}</span>
            {headingMain}
          </>
        ) : (
          heading
        )}
      </h2>
      <p className="mt-4 text-muted-foreground">{GROWTH_SECTION.sub}</p>

      {/* START → BUILD → SCALE legend — quiet and decorative (the worlds
          below carry the same stages as real text). */}
      <div
        aria-hidden
        className="mt-6 flex items-center justify-center gap-2 text-xs font-medium tracking-wide text-muted-foreground"
      >
        {GROWTH_PILLARS.map((pillar, index) => (
          <Fragment key={pillar.id}>
            {index > 0 && <ChevronRight className="size-3 text-muted-foreground/60" />}
            <span className="inline-flex items-center gap-1.5">
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: `rgb(${pillar.accent})` }}
              />
              {pillar.stage}
            </span>
          </Fragment>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Desktop rail: one continuous line across the top of the pathway with a
 * per-pillar node aligned to each column centre (1/6, 3/6, 5/6). Draws on
 * entry and reverses with upward scroll. Mobile replaces it with the
 * per-world connectors inside `GrowthWorld`.
 */
function PathwayRail() {
  const reduce = Boolean(useReducedMotion());

  return (
    <div aria-hidden className="relative mb-10 hidden h-3 lg:block">
      <motion.div
        className="absolute inset-x-0 top-1/2 h-px origin-left"
        style={{ backgroundImage: RAIL_GRADIENT }}
        initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={SEQUENCE_VIEWPORT}
        transition={{ duration: 0.9, ease: EASE }}
      />
      {GROWTH_PILLARS.map((pillar, index) => (
        <motion.span
          key={pillar.id}
          className="absolute top-1/2 size-3 rounded-full border-2 border-background-subtle"
          style={{
            left: `${((index * 2 + 1) / 6) * 100}%`,
            backgroundColor: `rgb(${pillar.accent})`,
          }}
          initial={
            reduce
              ? { opacity: 1, scale: 1, x: "-50%" }
              : { opacity: 0.25, scale: 0.6, x: "-50%" }
          }
          whileInView={{ opacity: 1, scale: 1, x: "-50%" }}
          viewport={SEQUENCE_VIEWPORT}
          transition={{
            duration: 0.45,
            ease: EASE,
            delay: reduce ? 0 : 0.2 + index * 0.18,
          }}
        />
      ))}
    </div>
  );
}

function GrowthWorld({
  pillar,
  index,
}: {
  pillar: GrowthPillar;
  index: number;
}) {
  const reduce = Boolean(useReducedMotion());
  const icons = PILLAR_CHAIN_ICONS[pillar.id];
  /* SSR-safe gate: this article holds the pillar's `<h3>` and promise copy, so
     the server HTML must ship it visible. `reduce` above still drives the
     decorative rails, which carry no text. */
  const worldReveal = useStaggerReveal<HTMLElement>(SEQUENCE_REVEAL);
  const chainReveal = useStaggerReveal(SEQUENCE_REVEAL);

  return (
    <div className="relative">
      {/* Mobile connector — the vertical rail between stacked worlds. */}
      {index > 0 && (
        <motion.span
          aria-hidden
          className="mx-auto mb-8 block h-10 w-px origin-top lg:hidden"
          style={{ backgroundImage: RAIL_GRADIENT_VERTICAL }}
          initial={reduce ? { scaleY: 1 } : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={SEQUENCE_VIEWPORT}
          transition={{ duration: 0.5, ease: EASE }}
        />
      )}

      <motion.article
        custom={index}
        variants={worldRise}
        {...worldReveal}
        className="group relative rounded-2xl border border-border bg-card p-6 sm:p-8"
      >
        {/* Hover activation — pre-painted accent layers, opacity-only. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ border: `1px solid rgba(${pillar.accent}, 0.35)` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent, rgba(${pillar.accent}, 0.5), transparent)`,
          }}
        />

        {/* Oversized, quiet stage word — the narrative spine. */}
        <span
          aria-hidden
          className="pointer-events-none absolute right-5 top-4 select-none text-5xl font-semibold tracking-tight text-foreground/[0.05]"
        >
          {pillar.stage}
        </span>

        <div className="relative flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            {pillar.number}
          </span>
          <span
            className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide"
            style={{
              borderColor: `rgba(${pillar.accent}, 0.35)`,
              color: `rgb(${pillar.accent})`,
            }}
          >
            {pillar.stage}
          </span>
        </div>

        <h3 className="relative mt-4 text-xl font-semibold tracking-tight text-foreground">
          {pillar.title}
        </h3>
        <p className="relative mt-2 text-base leading-relaxed text-muted-foreground">
          {pillar.promise}
        </p>

        {/* The world's chain — a dark product-environment window, the one
            piece of imagery per world. The final node carries the pillar
            accent: colour for meaning (destination), not decoration. */}
        <div className="relative mt-6 rounded-xl border border-white/[0.08] bg-[#0a0a0b] p-4">
          <p className="text-[11px] uppercase tracking-wider text-neutral-400">
            {pillar.chainFacing}
          </p>
          <motion.div
            variants={chainStagger}
            {...chainReveal}
            className="mt-3 flex items-start justify-between gap-1"
          >
            {pillar.chain.map((step, stepIndex) => {
              const StepIcon = icons[stepIndex];
              const isLast = stepIndex === pillar.chain.length - 1;
              return (
                <Fragment key={step}>
                  <motion.div
                    variants={chainNodeRise}
                    className="flex w-12 flex-col items-center gap-1.5 text-center sm:w-14"
                  >
                    <span
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg border"
                      style={
                        isLast
                          ? {
                              borderColor: `rgba(${pillar.accent}, 0.5)`,
                              backgroundColor: `rgba(${pillar.accent}, 0.12)`,
                            }
                          : {
                              borderColor: "rgba(255,255,255,0.1)",
                              backgroundColor: "rgba(255,255,255,0.04)",
                            }
                      }
                    >
                      <StepIcon
                        className="size-4"
                        style={{
                          color: isLast
                            ? `rgb(${pillar.accent})`
                            : "rgb(212,212,216)",
                        }}
                      />
                    </span>
                    <span className="text-[10px] leading-tight text-neutral-400">
                      {step}
                    </span>
                  </motion.div>
                  {!isLast && (
                    <span
                      aria-hidden
                      className="mt-[18px] h-px min-w-2 flex-1 bg-white/10"
                    />
                  )}
                </Fragment>
              );
            })}
          </motion.div>
        </div>

        <ul className="relative mt-6 flex flex-wrap gap-2">
          {pillar.capabilities.map((capability) => (
            <li
              key={capability}
              className="rounded-full border border-border-subtle bg-muted px-3 py-1 text-xs text-muted-foreground"
            >
              {capability}
            </li>
          ))}
        </ul>

        {/* Proof — verified project name + story frame, linked to the
            project's existing route. Supporting credibility only; the
            portfolio sections own the full portfolio job. */}
        <div className="relative mt-6 border-t border-border-subtle pt-4">
          <p className="text-xs text-muted-foreground">
            Real work:{" "}
            <Link
              href={pillar.proofHref}
              className="font-medium text-foreground underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
            >
              {pillar.proofProject}
            </Link>
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {pillar.proofLine}
          </p>
        </div>
      </motion.article>
    </div>
  );
}

/** The three assurances, as one quiet line — reuses the existing TRUST titles. */
function TrustLine() {
  /* SSR-safe gate: this is real trust copy, so it ships visible. */
  const reveal = useStaggerReveal<HTMLParagraphElement>(SEQUENCE_REVEAL);

  return (
    <motion.p
      variants={quietRise}
      {...reveal}
      className="mt-14 text-center text-sm text-muted-foreground"
    >
      {TRUST.assurances.map((assurance) => assurance.title).join("  ·  ")}
    </motion.p>
  );
}

/** One section-level conversation CTA — no per-pillar routes (ServiceVerticals owns those). */
function SectionCta() {
  /* SSR-safe gate: the CTA is a real crawlable link. */
  const reveal = useStaggerReveal(SEQUENCE_REVEAL);

  return (
    <motion.div variants={quietRise} {...reveal} className="mt-8 text-center">
      <Button variant="outline" asChild>
        <Link href={GROWTH_SECTION.ctaHref}>
          {GROWTH_SECTION.ctaLabel}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </motion.div>
  );
}
