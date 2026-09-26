"use client";

import { motion, useReducedMotion, useTransform, type MotionValue, type Variants } from "framer-motion";
import { BRAND_CHAPTER_ONE, BRAND_CHAPTER_TWO } from "@/lib/brand-story-data";
import { EASE, SPRING } from "@/lib/motion";

/* ─────────────────────────────────────────────────────────────────────────────
   BRAND STORY VISUALS — decorative compositions for the two-chapter
   "why does your business need a brand?" sequence.

   Every visual here is `aria-hidden`; the section's real copy (headings,
   paragraphs, `sr-only` lists) carries the meaning, matching the house
   convention already used by `digital-home-visual.tsx` and
   `process-motifs.tsx`.

   `BrandOrbit` and `PhysicalToDigitalPanel` are each a single, self-contained
   `whileInView` timeline — the same one-shot storyboard architecture as
   `digital-home-visual.tsx`: a parent `motion` element carries
   `initial`/`whileInView` variant labels, every descendant just declares
   `variants` and inherits the label through Framer's variant-propagation
   context, and every delay/duration is a fixed wall-clock value. That is a
   deliberate departure from this file's previous scroll-scrubbed
   `scrollYProgress` windows: a scrub only ever showed as much of the
   sequence as however far the reader happened to scroll, and reversed again
   on the way back. `viewport={{ once: true, amount: 0.35 }}` fires the
   timeline once the visual is ~35% into the viewport, and from that instant
   the sequence runs to completion on its own clock — the reader can keep
   scrolling at any speed and the composition still finishes settled.

   `TouchpointRow` (the chapter 1 → 2 bridge) is untouched and keeps reading
   the shared `scrollYProgress` passed down from `brand-story.tsx`; only the
   two diagram-style visuals moved to the self-contained pattern.
   ───────────────────────────────────────────────────────────────────────── */

export const ACCENT_RGB = {
  cyan: "14,116,144",
  blue: "67,83,201",
  violet: "124,58,237",
} as const;

type Win = readonly [number, number];

/** Maps one slice of the shared progress to 0→1, clamped. Used by `TouchpointRow` only. */
function useWindow(progress: MotionValue<number>, win: Win): MotionValue<number> {
  return useTransform(progress, [win[0], win[1]], [0, 1], { clamp: true });
}


/* ─────────────────────────────────────────────────────────────────────────────
   CHAPTER 1 — BRAND ORBIT

   Five brand-dimension satellites (Identity, Experience, Trust, Culture,
   Reputation) arranged in a pentagon around a central "Brand" node.

   Cinematic sequence: the Brand node establishes the composition first, then
   each connector draws in just ahead of its satellite, sweeping clockwise
   from the top position — the pentagon's own physical layout already reads
   as a clockwise sweep, so the reveal order follows it rather than fighting
   it. Restrained entrance per satellite: opacity + a few px of rise + a very
   slight scale + a short blur-to-sharp settle, using the house spring
   (`SPRING`, from `lib/motion.ts`) for the node arrivals and the house
   cubic-bezier (`EASE`) for the connector draws — the same two tokens every
   other homepage arrival uses.
   ───────────────────────────────────────────────────────────────────────── */

/** Pentagon positions (percent), satellite index 0..4, radius ~38% from center. */
const SATELLITE_POSITIONS: readonly { x: number; y: number }[] = [
  { x: 50, y: 12 },
  { x: 86.1, y: 38.3 },
  { x: 72.3, y: 80.7 },
  { x: 27.7, y: 80.7 },
  { x: 13.9, y: 38.3 },
];

/** Seconds between each satellite's entrance — the pace of the clockwise sweep. */
const ORBIT_STAGGER = 0.16;
/** The Brand node's own settle time before the first connector starts drawing. */
const CONNECTOR_LEAD = 0.25;
/** Gap between a connector starting to draw and its satellite starting to arrive. */
const NODE_LEAD = 0.12;

const centerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, filter: "blur(6px)" },
  show: { opacity: 1, scale: 1, filter: "blur(0px)", transition: SPRING },
};

function connectorVariants(index: number): Variants {
  const delay = CONNECTOR_LEAD + index * ORBIT_STAGGER;
  return {
    hidden: { pathLength: 0 },
    show: { pathLength: 1, transition: { delay, duration: 0.35, ease: EASE } },
  };
}

function satelliteVariants(index: number): Variants {
  const delay = CONNECTOR_LEAD + NODE_LEAD + index * ORBIT_STAGGER;
  return {
    hidden: { opacity: 0, y: 10, scale: 0.88, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { ...SPRING, delay },
    },
  };
}

function OrbitSatellite({ index }: { index: number }) {
  const dim = BRAND_CHAPTER_ONE.dimensions[index];
  const pos = SATELLITE_POSITIONS[index];
  const rgb = ACCENT_RGB[dim.accent];

  return (
    <motion.div
      variants={satelliteVariants(index)}
      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
    >
      <span className="size-2.5 rounded-full" style={{ backgroundColor: `rgb(${rgb})` }} />
      <span className="whitespace-nowrap rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm">
        {dim.label}
      </span>
    </motion.div>
  );
}

function OrbitConnectors() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {SATELLITE_POSITIONS.map((pos, i) => (
        <motion.line
          key={i}
          x1={50}
          y1={50}
          x2={pos.x}
          y2={pos.y}
          stroke="var(--border-strong)"
          strokeWidth={0.5}
          vectorEffect="non-scaling-stroke"
          variants={connectorVariants(i)}
        />
      ))}
    </svg>
  );
}

function BrandCenterNode() {
  return (
    <motion.div
      variants={centerVariants}
      className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
    >
      <div className="flex size-24 items-center justify-center rounded-full border border-border-strong bg-card text-sm font-semibold tracking-tight text-foreground shadow-sm sm:size-28">
        {BRAND_CHAPTER_ONE.centerLabel}
      </div>
    </motion.div>
  );
}

export function BrandOrbit() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      initial={shouldReduceMotion ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      className="relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-sm"
    >
      <OrbitConnectors />
      <BrandCenterNode />
      {BRAND_CHAPTER_ONE.dimensions.map((_, i) => (
        <OrbitSatellite key={i} index={i} />
      ))}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CHAPTER 1 → 2 BRIDGE — touchpoint row

   The six touchpoints (physical environment, people, service, communication,
   product, website) fade up as a single connected row beneath the insight
   line, closing chapter 1 and opening the question chapter 2 answers. Still
   driven by the shared, reversible `scrollYProgress` from `brand-story.tsx`.
   ───────────────────────────────────────────────────────────────────────── */
export function TouchpointRow({ progress }: { progress: MotionValue<number> }) {
  const reveal = useWindow(progress, [0.55, 0.75]);

  return (
    <div aria-hidden="true" className="flex flex-wrap items-center justify-center gap-2">
      {BRAND_CHAPTER_ONE.touchpoints.map((point, i) => {
        const isWebsite = i === BRAND_CHAPTER_ONE.touchpoints.length - 1;
        return (
          <motion.span
            key={point}
            style={{ opacity: reveal }}
            className={`inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium ${
              isWebsite
                ? "border-primary/30 bg-primary/5 text-primary"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            {point}
          </motion.span>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CHAPTER 2 — PHYSICAL → DIGITAL TRANSFORMATION PANEL

   A single connected scene, not a left-image/right-laptop split: an
   environment abstraction (structural blocks suggesting a signage wall,
   reception counter and floor plan) dissolves as a browser-chrome surface
   assembles in the same footprint — "same brand, different room" rendered
   visually. Both layers occupy the same box; the crossfade IS the
   transformation.

   R-cinematic: this panel is now one self-contained `whileInView` timeline —
   same architecture as `BrandOrbit` above and `digital-home-visual.tsx` —
   instead of reading the chapter's shared `scrollYProgress`. The browser
   frame establishes itself first, then the six office layers (Your story /
   services / people / work / proof / brand identity) assemble as a varied,
   website-shaped composition — a hero block, two paired cards, a large
   visual + a small proof metric, and a closing identity strip — rather than
   six identical rows. `viewport={{ once: true, amount: 0.35 }}` triggers the
   sequence at ~35% visibility and it runs to completion on its own clock.
   ───────────────────────────────────────────────────────────────────────── */

/** Wall-clock seconds, in the same spirit as `digital-home-visual.tsx`'s TIME_SCALE. */
const OFFICE_TIMING = {
  environmentOut: 0,
  chromeIn: 0.12,
  story: 0.32,
  pairStart: 0.54,
  pairStagger: 0.09,
  lowerStart: 0.82,
  lowerStagger: 0.09,
  identity: 1.1,
} as const;

const environmentVariants: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 0,
    transition: { delay: OFFICE_TIMING.environmentOut, duration: 0.35, ease: EASE },
  },
};

const chromeVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { delay: OFFICE_TIMING.chromeIn, duration: 0.3, ease: EASE },
  },
};

function blockVariants(delay: number): Variants {
  return {
    hidden: { opacity: 0, y: 10, scale: 0.94, filter: "blur(4px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { ...SPRING, delay },
    },
  };
}

/** A short group of skeleton text lines — the abstract stand-in for copy. */
function TextLines({ widths, className = "" }: { widths: number[]; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {widths.map((w, i) => (
        <span
          key={i}
          className="h-1.5 rounded-full bg-border-strong/60"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

/** Micro caption identifying the office layer a block represents. */
function BlockLabel({ label }: { label: string }) {
  return (
    <span className="text-[8px] font-semibold uppercase tracking-wide text-muted-foreground/70">
      {label}
    </span>
  );
}

function EnvironmentLayer() {
  return (
    <motion.div
      variants={environmentVariants}
      aria-hidden="true"
      className="absolute inset-0 flex flex-col gap-2 p-4"
    >
      <div className="flex h-10 items-center gap-2 rounded-lg border border-border bg-background-subtle px-3">
        <span className="size-2.5 rounded-full bg-accent-blue/60" />
        <span className="h-2 w-24 rounded-full bg-border-strong/70" />
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2">
        <div className="col-span-2 rounded-lg border border-border bg-background-subtle" />
        <div className="rounded-lg border border-border bg-background-subtle" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-6 rounded-md border border-border bg-background-subtle" />
        ))}
      </div>
    </motion.div>
  );
}

/**
 * The browser interior — a miniature editorial website layout standing in
 * for the six office layers, composed with varied weights rather than six
 * equal rows: a hero block (Your story), a paired services/people row, a
 * large work visual next to a small proof metric, and a closing brand
 * identity strip. `BRAND_CHAPTER_TWO.officeLayers` stays the single source
 * of the six labels; only their visual treatment changed.
 */
function DigitalLayer() {
  const [story, services, people, work, proof, identity] = BRAND_CHAPTER_TWO.officeLayers;

  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 flex flex-col overflow-hidden rounded-lg border border-border bg-card"
    >
      {/* Browser chrome — establishes the frame before any content assembles. */}
      <motion.div
        variants={chromeVariants}
        className="flex items-center gap-2 border-b border-border-subtle px-3 py-2"
      >
        <span className="size-2 rounded-full bg-destructive/50" />
        <span className="size-2 rounded-full bg-accent-cyan/50" />
        <span className="size-2 rounded-full bg-success/50" />
        <span className="ml-2 h-4 max-w-40 flex-1 rounded-full bg-background-subtle" />
      </motion.div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        {/* Your story — hero block: image placeholder + a short headline stack. */}
        <motion.div
          variants={blockVariants(OFFICE_TIMING.story)}
          className="flex h-[34%] items-center gap-3 rounded-lg border border-border-subtle bg-background-subtle/60 p-2.5"
        >
          <div className="h-full w-[38%] shrink-0 rounded-md bg-gradient-to-br from-accent-blue/25 via-accent-cyan/15 to-transparent" />
          <div className="flex h-full flex-1 flex-col justify-center gap-1.5">
            <BlockLabel label={story} />
            <TextLines widths={[70, 45]} />
            <span className="mt-1 h-4 w-14 rounded-full bg-primary/25" />
          </div>
        </motion.div>

        {/* Your services + Your people — two distinct paired cards. */}
        <div className="flex h-[22%] gap-2">
          <motion.div
            variants={blockVariants(OFFICE_TIMING.pairStart)}
            className="flex flex-1 flex-col justify-between rounded-lg border border-border-subtle bg-background-subtle/60 p-2"
          >
            <BlockLabel label={services} />
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="h-3.5 rounded-sm bg-border-strong/50" />
              ))}
            </div>
          </motion.div>
          <motion.div
            variants={blockVariants(OFFICE_TIMING.pairStart + OFFICE_TIMING.pairStagger)}
            className="flex flex-1 flex-col justify-between rounded-lg border border-border-subtle bg-background-subtle/60 p-2"
          >
            <BlockLabel label={people} />
            <div className="flex gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="size-3.5 rounded-full bg-accent-blue/30" />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Your work (large visual) + Your proof (small metric) — uneven weights. */}
        <div className="flex h-[24%] gap-2">
          <motion.div
            variants={blockVariants(OFFICE_TIMING.lowerStart)}
            className="flex flex-[2] flex-col gap-1 rounded-lg border border-border-subtle bg-background-subtle/60 p-2"
          >
            <BlockLabel label={work} />
            <div className="grid flex-1 grid-cols-3 gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className="rounded-sm bg-accent-cyan/20" />
              ))}
            </div>
          </motion.div>
          <motion.div
            variants={blockVariants(OFFICE_TIMING.lowerStart + OFFICE_TIMING.lowerStagger)}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg border border-border-subtle bg-background-subtle/60 p-2"
          >
            <BlockLabel label={proof} />
            <span className="text-sm font-semibold tabular-nums text-foreground">4.9★</span>
          </motion.div>
        </div>

        {/* Your brand identity — closing strip, completes the composition. */}
        <motion.div
          variants={blockVariants(OFFICE_TIMING.identity)}
          className="flex h-[12%] items-center gap-2 rounded-lg border border-border-subtle bg-background-subtle/60 px-2.5"
        >
          <span className="size-2 shrink-0 rounded-full bg-primary/60" />
          <BlockLabel label={identity} />
          <span className="ml-auto h-1.5 w-10 rounded-full bg-border-strong/50" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function PhysicalToDigitalPanel() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border-subtle bg-background shadow-sm sm:aspect-[3/2]"
    >
      <EnvironmentLayer />
      <DigitalLayer />
    </motion.div>
  );
}
