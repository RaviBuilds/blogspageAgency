"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { AUDIENCE } from "@/lib/homepage-data";

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 2 — "Where are you right now?" (Blueprint §9)

   Self-selection with the simplest mechanism that creates clarity: three
   cards whose meaning is complete without any interaction (title + line
   always render server-side); selecting a card only reveals the supporting
   detail and the path's CTA. Each CTA is a real `<Link>`, so every path
   navigates even before hydration and without JavaScript.

   The R2.0 spec's comprehension rule holds: nothing essential is hidden
   behind interaction or animation.
   ───────────────────────────────────────────────────────────────────────────── */

/**
 * R5.2 brand text treatment — the section heading's meaningful phrase
 * ("right now?") carries the same restrained cyan → blue → violet sweep as
 * the Hero and the R5 section heading ("Build from there."): same inline
 * background-clip mechanism and the same light-signal values, declared inline
 * because the locked `.text-gradient` island override still points the class
 * at the legacy near-white gradient. No data change — the phrase is sliced
 * from the existing `AUDIENCE.heading` string, with a safe fallback.
 */
const HEADING_ACCENT = "right now?";
const HEADING_MAIN = AUDIENCE.heading.endsWith(HEADING_ACCENT)
  ? AUDIENCE.heading.slice(0, AUDIENCE.heading.length - HEADING_ACCENT.length)
  : "";
const BRAND_TEXT_GRADIENT = {
  backgroundImage:
    "linear-gradient(90deg, #0891B2 0%, #4353C9 52%, #7C3AED 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text",
  color: "transparent",
} as const;

const SPRING = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 1,
} as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

/**
 * R3A pathway vocabulary — one three-stage journey per card, and the kicker
 * word that names the stage of the business the card represents. Kept here
 * rather than in `homepage-data.ts` because the existing `journey` pairs
 * (and every other AUDIENCE field) stay exactly as authored; this is the
 * presentation vocabulary for the pathway visuals.
 *
 * Light-surface accents follow the canonical signal triad in its on-paper
 * family: cyan #0891b2 (presence / enquiry in), primary blue (business /
 * customers), violet #7c3aed (automation / AI).
 */
const PATH_JOURNEYS: Record<
  string,
  { kicker: string; stages: readonly [string, string, string] }
> = {
  "no-website": { kicker: "Start", stages: ["Business", "Website", "Enquiry"] },
  "have-website": {
    kicker: "Improve",
    stages: ["Website", "Presence", "Enquiries"],
  },
  "need-software": {
    kicker: "Expand",
    stages: ["Website", "Software", "Automation"],
  },
};

const KICKER_DOT: Record<string, string> = {
  "no-website": "bg-[#0891b2]",
  "have-website": "bg-primary",
  "need-software": "bg-[#7c3aed]",
};

/* --- Pathway diagram primitives (all decorative, aria-hidden at the root) -- */

/** Node/line stroke defaults shared by every diagram element. */
const STROKE = {
  fill: "none",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
};

/**
 * The neutral connector every diagram shares: a hairline with a small
 * chevron, reading as direction without being an arrow icon. The accent
 * overlay above it is invisible at rest (its dash equals its length) and
 * draws itself in on card hover/focus — the "activate subtly" motion. The
 * `delay` staggers multi-hop journeys so the eye follows the transaction.
 *
 * `dash` carries the static arbitrary utilities ("[stroke-dasharray:46]
 * [stroke-dashoffset:46]") as a literal at the call site — Tailwind's
 * scanner only sees literal class strings, so a template literal here would
 * silently compile to nothing.
 */
function Connector({
  d,
  chevron,
  dash,
  accentClass,
  delay,
}: {
  d: string;
  chevron: string;
  dash: string;
  accentClass: string;
  delay?: string;
}) {
  return (
    <>
      <path d={d} {...STROKE} className="stroke-border-strong" />
      <path
        d={chevron}
        {...STROKE}
        strokeLinejoin="round"
        className="stroke-border-strong"
      />
      <path
        d={d}
        {...STROKE}
        className={cn(
          "opacity-90",
          dash,
          "transition-[stroke-dashoffset] duration-700 ease-out",
          "group-hover/card:[stroke-dashoffset:0] group-focus-within/card:[stroke-dashoffset:0]",
          delay,
          "motion-reduce:transition-none",
          accentClass
        )}
      />
    </>
  );
}

/** The journey's travelling signal: a static dot at rest, a short nudge on hover. */
function Packet({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <circle
      cx={x}
      cy={y}
      r={2.2}
      fill={fill}
      opacity={0.75}
      className={cn(
        "transition-transform duration-500 ease-out",
        "group-hover/card:translate-x-5 group-focus-within/card:translate-x-5",
        "motion-reduce:transition-none motion-reduce:transform-none"
      )}
    />
  );
}

/** Stage micro-label under a node. A decorative duplicate of real text. */
function StageLabel({ x, y = 58, text }: { x: number; y?: number; text: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize={6.2}
      letterSpacing={1.1}
      className="fill-muted-foreground"
      style={{ textTransform: "uppercase" }}
    >
      {text}
    </text>
  );
}

/** Small browser-chrome dots for the website surfaces. */
function ChromeDots({ x, cy = 11.8 }: { x: number; cy?: number }) {
  return (
    <>
      <circle cx={x} cy={cy} r={0.9} className="fill-muted-foreground/50" />
      <circle cx={x + 4} cy={cy} r={0.9} className="fill-muted-foreground/50" />
      <circle cx={x + 8} cy={cy} r={0.9} className="fill-muted-foreground/50" />
    </>
  );
}

/**
 * PATH 1 — START. Business → Website → Enquiry (cyan/blue).
 * The website node is the composition's small echo of the hero's light
 * surface: a mini browser. The enquiry arrives as a cyan signal with arcs.
 */
function StartDiagram() {
  return (
    <svg viewBox="0 0 240 66" aria-hidden="true" focusable="false" className="w-full">
      {/* Business node: a small surface footprint with a core dot. */}
      <rect x={6} y={14} width={36} height={24} rx={5} className="fill-muted stroke-border" {...STROKE} />
      <circle cx={24} cy={26} r={2.4} className="fill-muted-foreground/60" />

      {/* Website node: the light mini browser — chrome dots, divider, content. */}
      <rect
        x={98}
        y={8}
        width={44}
        height={36}
        rx={5}
        className={cn(
          "fill-card stroke-border transition-[stroke] duration-500",
          "group-hover/card:stroke-[#0891b2] group-focus-within/card:stroke-[#0891b2]",
          "motion-reduce:transition-none"
        )}
        {...STROKE}
      />
      <path d="M98 15.5 H142" strokeWidth={1} fill="none" className="stroke-border" />
      <ChromeDots x={103.5} />
      <rect x={104} y={21} width={26} height={2.5} rx={1.25} className="fill-muted-foreground/30" />
      <rect x={104} y={27} width={20} height={2.5} rx={1.25} className="fill-muted-foreground/30" />

      {/* Enquiry: the incoming cyan signal. */}
      <g
        className={cn(
          "opacity-70 transition-opacity duration-500",
          "group-hover/card:opacity-100 group-focus-within/card:opacity-100",
          "motion-reduce:transition-none"
        )}
      >
        <path d="M204 21 A7 7 0 0 0 204 31" stroke="#0891b2" fill="none" strokeWidth={1.4} strokeLinecap="round" />
        <path d="M199 17 A12 12 0 0 0 199 35" stroke="#0891b2" strokeOpacity={0.6} fill="none" strokeWidth={1.4} strokeLinecap="round" />
        <circle cx={210} cy={26} r={3.2} fill="#0891b2" />
      </g>

      <Connector
        d="M46 26 H92"
        chevron="M88 22 L92.5 26 L88 30"
        dash="[stroke-dasharray:46] [stroke-dashoffset:46]"
        accentClass="stroke-primary"
      />
      <Connector
        d="M146 26 H200"
        chevron="M196 22 L200.5 26 L196 30"
        dash="[stroke-dasharray:54] [stroke-dashoffset:54]"
        delay="delay-150"
        accentClass="stroke-[#0891b2]"
      />
      <Packet x={172} y={26} fill="#0891b2" />

      <StageLabel x={24} text="Business" />
      <StageLabel x={120} text="Website" />
      <StageLabel x={210} text="Enquiry" />
    </svg>
  );
}

/**
 * PATH 2 — IMPROVE. Website → Stronger presence → Enquiries (blue).
 * R3A.1: the scene grew a second band so the card's unused vertical space
 * tells the rest of the story — the presence signal fans out to three
 * receiving surfaces (the places the improved presence reaches). The story
 * is amplification, not a build, and it is complete at rest.
 */
function ImproveDiagram() {
  return (
    <svg viewBox="0 0 240 84" aria-hidden="true" focusable="false" className="w-full">
      {/* Row 1 — the pathway: fuller website surface, arcs, enquiries. */}
      <rect
        x={6}
        y={4}
        width={44}
        height={34}
        rx={5}
        className={cn(
          "fill-card stroke-border transition-[stroke] duration-500",
          "group-hover/card:stroke-primary group-focus-within/card:stroke-primary",
          "motion-reduce:transition-none"
        )}
        {...STROKE}
      />
      <path d="M6 11.5 H50" strokeWidth={1} fill="none" className="stroke-border" />
      <ChromeDots x={11.5} cy={7.8} />
      <rect x={12} y={16} width={30} height={2.5} rx={1.25} className="fill-muted-foreground/30" />
      <rect x={12} y={21} width={24} height={2.5} rx={1.25} className="fill-muted-foreground/30" />
      <rect x={12} y={26} width={18} height={2.5} rx={1.25} className="fill-muted-foreground/30" />

      <g
        className={cn(
          "opacity-70 transition-opacity duration-500 stroke-primary",
          "group-hover/card:opacity-100 group-focus-within/card:opacity-100",
          "motion-reduce:transition-none"
        )}
      >
        <path d="M123 16.5 A6 6 0 0 1 123 25.5" fill="none" strokeWidth={1.4} strokeLinecap="round" />
        <path d="M127 12.5 A11.5 11.5 0 0 1 127 29.5" fill="none" strokeWidth={1.4} strokeLinecap="round" strokeOpacity={0.6} />
        <path d="M131 8.5 A17 17 0 0 1 131 33.5" fill="none" strokeWidth={1.4} strokeLinecap="round" strokeOpacity={0.35} />
      </g>

      <circle cx={206} cy={17} r={2.6} className="fill-primary" />
      <circle
        cx={212}
        cy={26}
        r={2.6}
        className={cn(
          "fill-primary opacity-50 transition-opacity duration-500",
          "group-hover/card:opacity-100 group-focus-within/card:opacity-100",
          "motion-reduce:transition-none"
        )}
      />

      <Connector
        d="M54 21 H96"
        chevron="M92 17 L96.5 21 L92 25"
        dash="[stroke-dasharray:42] [stroke-dashoffset:42]"
        accentClass="stroke-primary"
      />
      <Connector
        d="M140 21 H198"
        chevron="M196 17 L200.5 21 L196 25"
        dash="[stroke-dasharray:60] [stroke-dashoffset:60]"
        delay="delay-150"
        accentClass="stroke-primary"
      />
      <Packet x={75} y={21} fill="var(--color-primary)" />

      <StageLabel x={28} y={42} text="Website" />
      <StageLabel x={122} y={42} text="Presence" />
      <StageLabel x={210} y={42} text="Enquiries" />

      {/* Row 2 — the presence signal fans out to three reached surfaces. */}
      <path d="M120 46 L40 58" strokeWidth={1} fill="none" className="stroke-border" />
      <path d="M120 46 V58" strokeWidth={1} fill="none" className="stroke-border" />
      <path d="M120 46 L200 58" strokeWidth={1} fill="none" className="stroke-border" />
      <path
        d="M120 46 L40 58"
        {...STROKE}
        className={cn(
          "opacity-80 [stroke-dasharray:81] [stroke-dashoffset:81] stroke-primary",
          "transition-[stroke-dashoffset] duration-700 ease-out",
          "group-hover/card:[stroke-dashoffset:0] group-focus-within/card:[stroke-dashoffset:0]",
          "motion-reduce:transition-none"
        )}
      />
      <path
        d="M120 46 V58"
        {...STROKE}
        className={cn(
          "opacity-80 [stroke-dasharray:12] [stroke-dashoffset:12] stroke-primary",
          "transition-[stroke-dashoffset] duration-700 ease-out",
          "group-hover/card:[stroke-dashoffset:0] group-focus-within/card:[stroke-dashoffset:0]",
          "motion-reduce:transition-none"
        )}
      />
      <path
        d="M120 46 L200 58"
        {...STROKE}
        className={cn(
          "opacity-80 [stroke-dasharray:81] [stroke-dashoffset:81] stroke-primary",
          "transition-[stroke-dashoffset] duration-700 ease-out",
          "group-hover/card:[stroke-dashoffset:0] group-focus-within/card:[stroke-dashoffset:0]",
          "motion-reduce:transition-none"
        )}
      />

      {[24, 104, 184].map((x) => (
        <g key={x}>
          <rect
            x={x}
            y={58}
            width={32}
            height={20}
            rx={4}
            className={cn(
              "fill-card stroke-border transition-[stroke] duration-500",
              "group-hover/card:stroke-primary group-focus-within/card:stroke-primary",
              "motion-reduce:transition-none"
            )}
            {...STROKE}
          />
          <rect x={x + 6} y={65} width={18} height={2} rx={1} className="fill-muted-foreground/30" />
          <rect x={x + 6} y={70} width={12} height={2} rx={1} className="fill-muted-foreground/20" />
        </g>
      ))}
    </svg>
  );
}

/**
 * PATH 3 — EXPAND. Website → Business software → Automation/AI (blue/violet).
 * R3A.1: the scene grew a second band — the AI node's signal drops into a
 * small workflow track where three work items sit, the automation-active one
 * tinted violet. The most advanced of the three journeys, visibly.
 */
function ExpandDiagram() {
  return (
    <svg viewBox="0 0 240 84" aria-hidden="true" focusable="false" className="w-full">
      {/* Row 1 — the pathway: website front door, software surface, AI node. */}
      <rect
        x={6}
        y={9}
        width={36}
        height={30}
        rx={5}
        className={cn(
          "fill-card stroke-border transition-[stroke] duration-500",
          "group-hover/card:stroke-primary group-focus-within/card:stroke-primary",
          "motion-reduce:transition-none"
        )}
        {...STROKE}
      />
      <path d="M6 16.5 H42" strokeWidth={1} fill="none" className="stroke-border" />
      <rect x={11} y={22} width={20} height={2.5} rx={1.25} className="fill-muted-foreground/30" />

      <rect
        x={100}
        y={4}
        width={52}
        height={40}
        rx={5}
        className={cn(
          "fill-card stroke-border transition-[stroke] duration-500",
          "group-hover/card:stroke-primary group-focus-within/card:stroke-primary",
          "motion-reduce:transition-none"
        )}
        {...STROKE}
      />
      <path d="M126 8 V40" strokeWidth={1} fill="none" className="stroke-border" />
      <path d="M104 24 H148" strokeWidth={1} fill="none" className="stroke-border" />
      <rect
        x={104.5}
        y={25}
        width={20.5}
        height={16}
        className={cn(
          "fill-[#7c3aed]/15 transition-[fill] duration-500",
          "group-hover/card:fill-[#7c3aed]/35 group-focus-within/card:fill-[#7c3aed]/35",
          "motion-reduce:transition-none"
        )}
      />

      <g
        className={cn(
          "opacity-70 transition-opacity duration-500",
          "group-hover/card:opacity-100 group-focus-within/card:opacity-100",
          "motion-reduce:transition-none"
        )}
      >
        <circle cx={210} cy={24} r={7} fill="var(--color-card)" stroke="#7c3aed" strokeWidth={1.5} />
        <circle cx={210} cy={24} r={2} fill="#7c3aed" />
        <path d="M219.5 24 H223" stroke="#7c3aed" fill="none" strokeWidth={1.4} strokeLinecap="round" />
        <path d="M205 19 L202.6 16.6" stroke="#7c3aed" fill="none" strokeWidth={1.4} strokeLinecap="round" />
        <path d="M205 29 L202.6 31.4" stroke="#7c3aed" fill="none" strokeWidth={1.4} strokeLinecap="round" />
      </g>

      <Connector
        d="M46 24 H96"
        chevron="M92 20 L96.5 24 L92 28"
        dash="[stroke-dasharray:48] [stroke-dashoffset:48]"
        accentClass="stroke-primary"
      />
      <Connector
        d="M156 24 H198"
        chevron="M194 20 L198.5 24 L194 28"
        dash="[stroke-dasharray:48] [stroke-dashoffset:48]"
        delay="delay-150"
        accentClass="stroke-[#7c3aed]"
      />

      <StageLabel x={24} y={50} text="Website" />
      <StageLabel x={126} y={50} text="Software" />
      <StageLabel x={210} y={50} text="Automation" />

      {/* Row 2 — automation runs the work: signal drops into a workflow track. */}
      <path d="M210 31 V58" strokeWidth={1} fill="none" className="stroke-border" />
      <path
        d="M210 31 V58"
        {...STROKE}
        className={cn(
          "opacity-80 [stroke-dasharray:27] [stroke-dashoffset:27] stroke-[#7c3aed]",
          "transition-[stroke-dashoffset] duration-700 ease-out",
          "group-hover/card:[stroke-dashoffset:0] group-focus-within/card:[stroke-dashoffset:0]",
          "motion-reduce:transition-none"
        )}
      />

      <path d="M40 64 H202" strokeWidth={1} fill="none" className="stroke-border-strong" />
      <rect x={64} y={56} width={26} height={16} rx={3} className="fill-muted stroke-border" {...STROKE} strokeWidth={1} />
      <rect x={120} y={56} width={26} height={16} rx={3} className="fill-muted stroke-border" {...STROKE} strokeWidth={1} />
      <rect
        x={176}
        y={56}
        width={26}
        height={16}
        rx={3}
        className={cn(
          "fill-[#7c3aed]/10 stroke-[#7c3aed]/40 transition-[fill] duration-500",
          "group-hover/card:fill-[#7c3aed]/25 group-focus-within/card:fill-[#7c3aed]/25",
          "motion-reduce:transition-none"
        )}
        strokeWidth={1}
        fill="none"
      />
      <circle cx={189} cy={64} r={2} className="fill-[#7c3aed]" />
    </svg>
  );
}

function PathwayDiagram({ pathId }: { pathId: string }) {
  if (pathId === "no-website") return <StartDiagram />;
  if (pathId === "have-website") return <ImproveDiagram />;
  return <ExpandDiagram />;
}

export function AudiencePathways() {
  const shouldReduceMotion = useReducedMotion();
  // Pre-select the first path so the reveal pattern is discoverable and no
  // card renders an empty detail state on first paint.
  const [selected, setSelected] = useState<string>(AUDIENCE.paths[0].id);

  return (
    <section className="relative overflow-hidden border-t border-border bg-background py-24 lg:py-32">
      {/*
        R3A.1 — editorial technology atmosphere. Pure CSS, zero JS, zero
        animation, `aria-hidden` and pointer-inert. Three barely-there layers
        on the same light neutral: a faint technical grid that fades out below
        the fold line, a cyan key light continuing the hero's website signal
        under the seam, and two ambient fields (blue right, violet left) at
        the edge of perception. At rest the section reads as calm editorial
        paper; the atmosphere is something you notice second.
      */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_bottom,black_0%,transparent_52%)]" />
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(560px_260px_at_50%_-40px,rgba(8,145,178,0.07),transparent_70%)]" />
        <div className="absolute -right-40 bottom-0 size-[34rem] rounded-full bg-[radial-gradient(circle,rgba(130,143,255,0.05),transparent_65%)]" />
        <div className="absolute -left-40 bottom-0 size-[30rem] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.04),transparent_65%)]" />
      </div>

      {/*
        The receiving half of the hero's connector motif (creative blueprint
        §19): the same visual thread continues out of the dark hero, through
        this seam, into the first scene's heading. Purely decorative.
      */}
      <div
        aria-hidden
        className="mx-auto -mt-16 mb-10 h-16 w-px bg-gradient-to-b from-transparent via-primary/25 to-primary/40 lg:-mt-20"
      />
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          variants={container}
          initial={shouldReduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p variants={fadeUp} className="text-sm font-medium text-primary">
            {AUDIENCE.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {HEADING_MAIN || AUDIENCE.heading}
            {HEADING_MAIN && (
              <span style={BRAND_TEXT_GRADIENT}>{HEADING_ACCENT}</span>
            )}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            {AUDIENCE.sub}
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial={shouldReduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-4 md:grid-cols-3"
        >
          {AUDIENCE.paths.map((path) => {
            const isSelected = selected === path.id;
            const journeyMeta = PATH_JOURNEYS[path.id];
            return (
              <motion.div
                key={path.id}
                variants={fadeUp}
                onClick={() => setSelected(path.id)}
                className={cn(
                  "group/card relative flex h-full cursor-pointer flex-col rounded-2xl border bg-card p-6 transition-colors duration-300",
                  isSelected
                    ? "border-border-strong"
                    : "border-border hover:border-border-strong",
                )}
              >
                {/* Signal accent (Motif C) — marks the active pathway only. */}
                {isSelected ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-primary"
                  />
                ) : null}

                {/*
                  Header row: the quiet stage-of-business kicker (Start /
                  Improve / Expand) with its signal dot, and — on the first
                  card — the strategically important marker, kept intact.
                */}
                <div className="flex items-start justify-between gap-3">
                  <span className="flex items-center gap-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    <span
                      aria-hidden
                      className={cn("size-1.5 rounded-full", KICKER_DOT[path.id])}
                    />
                    {journeyMeta.kicker}
                  </span>
                  {path.featured ? (
                    <span className="inline-flex shrink-0 items-center rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[10px] font-medium text-primary">
                      Most common starting point
                    </span>
                  ) : null}
                </div>

                {/*
                  The pathway visual (R3A/R3A.1). Fully readable at rest —
                  the journey never depends on hover. The wrapper fills the
                  card's flexible space and centers the scene, so residual
                  height reads as balanced breathing room around the story
                  rather than an empty band at the bottom of the card.
                */}
                <div className="mt-5 flex flex-1 flex-col justify-center">
                  <PathwayDiagram pathId={path.id} />
                  <span className="sr-only">
                    Journey: {journeyMeta.stages.join(" → ")}
                  </span>
                </div>

                {/*
                  Selection toggle — reveals context; never the only carrier
                  of the message (title + line are always visible).

                  R3A.1 usability fix: the *entire card* is clickable (the
                  container's `onClick`), so activating a pathway no longer
                  requires aiming at the title. This button remains the
                  keyboard/screen-reader control for the same action, and the
                  CTA `<Link>` below keeps its own handler — clicking it
                  simply re-selects the already-selected card, which is a
                  no-op.
                */}
                <button
                  type="button"
                  aria-pressed={isSelected}
                  aria-expanded={isSelected}
                  onClick={() => setSelected(path.id)}
                  className="-m-2 mt-3 cursor-pointer rounded-xl p-2 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  <span className="block text-lg font-semibold tracking-tight text-foreground">
                    {path.title}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                    {path.line}
                  </span>
                </button>

                {isSelected ? (
                  <div className="mt-5 flex flex-1 flex-col border-t border-border-subtle pt-5">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {path.detail}
                    </p>
                    <div className="mt-auto pt-5">
                      <Link
                        href={path.cta.href}
                        onClick={() =>
                          trackEvent("problem_selector_click", {
                            path: path.id,
                            destination: path.cta.href,
                          })
                        }
                        className="-my-2 inline-block py-2 text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                      >
                        {path.cta.label}
                        <ArrowRight className="ml-1.5 inline size-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
