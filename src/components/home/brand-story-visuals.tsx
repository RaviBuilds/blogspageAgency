"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { BRAND_CHAPTER_ONE, BRAND_CHAPTER_TWO } from "@/lib/brand-story-data";

/* ─────────────────────────────────────────────────────────────────────────────
   BRAND STORY VISUALS — decorative compositions for the two-chapter
   "why does your business need a brand?" sequence.

   Every visual here is `aria-hidden`; the section's real copy (headings,
   paragraphs, `sr-only` lists) carries the meaning, matching the house
   convention already used by `digital-home-visual.tsx` and
   `process-motifs.tsx`.

   Driven entirely by ONE shared, reversible `scrollYProgress` MotionValue
   passed down from `brand-story.tsx` — no independent `useScroll` calls,
   opacity/transform only, and every window collapses to its settled value
   under reduced motion (the caller passes an already-windowed constant
   MotionValue in that case; see `useWindow` below).
   ───────────────────────────────────────────────────────────────────────── */

export const ACCENT_RGB = {
  cyan: "14,116,144",
  blue: "67,83,201",
  violet: "124,58,237",
} as const;

type Win = readonly [number, number];

/** Maps one slice of the shared progress to 0→1, clamped. */
function useWindow(progress: MotionValue<number>, win: Win): MotionValue<number> {
  return useTransform(progress, [win[0], win[1]], [0, 1], { clamp: true });
}

/* ─────────────────────────────────────────────────────────────────────────────
   CHAPTER 1 — BRAND ORBIT

   Five brand-dimension satellites (Identity, Experience, Trust, Culture,
   Reputation) arranged in a pentagon around a central "Brand" node.
   Connecting lines draw in from center to each satellite as the shared
   progress advances, then the satellite labels fade up — the visual
   accumulation the brief asks for, without five separate cards.
   ───────────────────────────────────────────────────────────────────────── */

/** Pentagon positions (percent), satellite index 0..4, radius ~38% from center. */
const SATELLITE_POSITIONS: readonly { x: number; y: number }[] = [
  { x: 50, y: 12 },
  { x: 86.1, y: 38.3 },
  { x: 72.3, y: 80.7 },
  { x: 27.7, y: 80.7 },
  { x: 13.9, y: 38.3 },
];

function OrbitSatellite({
  index,
  progress,
  entryWindow,
}: {
  index: number;
  progress: MotionValue<number>;
  entryWindow: Win;
}) {
  const dim = BRAND_CHAPTER_ONE.dimensions[index];
  const pos = SATELLITE_POSITIONS[index];
  const reveal = useWindow(progress, entryWindow);
  const scale = useTransform(reveal, [0, 1], [0.6, 1]);
  const rgb = ACCENT_RGB[dim.accent];

  return (
    <motion.div
      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, opacity: reveal, scale }}
    >
      <span className="size-2.5 rounded-full" style={{ backgroundColor: `rgb(${rgb})` }} />
      <span className="whitespace-nowrap rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground shadow-sm">
        {dim.label}
      </span>
    </motion.div>
  );
}

function OrbitConnectors({ progress }: { progress: MotionValue<number> }) {
  const draw = useWindow(progress, [0.15, 0.42]);

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
          pathLength={1}
          strokeDasharray={1}
          style={{ pathLength: draw }}
        />
      ))}
    </svg>
  );
}

function BrandCenterNode({ progress }: { progress: MotionValue<number> }) {
  const reveal = useWindow(progress, [0.05, 0.22]);
  const scale = useTransform(reveal, [0, 1], [0.8, 1]);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      style={{ opacity: reveal, scale }}
    >
      <div className="flex size-24 items-center justify-center rounded-full border border-border-strong bg-card text-sm font-semibold tracking-tight text-foreground shadow-sm sm:size-28">
        {BRAND_CHAPTER_ONE.centerLabel}
      </div>
    </motion.div>
  );
}

export function BrandOrbit({ progress }: { progress: MotionValue<number> }) {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-[22rem] sm:max-w-sm"
    >
      <OrbitConnectors progress={progress} />
      <BrandCenterNode progress={progress} />
      {BRAND_CHAPTER_ONE.dimensions.map((_, i) => (
        <OrbitSatellite
          key={i}
          index={i}
          progress={progress}
          entryWindow={[0.2 + i * 0.045, 0.34 + i * 0.045]}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CHAPTER 1 → 2 BRIDGE — touchpoint row

   The six touchpoints (physical environment, people, service, communication,
   product, website) fade up as a single connected row beneath the insight
   line, closing chapter 1 and opening the question chapter 2 answers.
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
   ───────────────────────────────────────────────────────────────────────── */
function EnvironmentLayer({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.45], [1, 0], { clamp: true });

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity }}
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

function DigitalOfficeRow({
  layer,
  index,
  total,
  layerReveal,
}: {
  layer: string;
  index: number;
  total: number;
  layerReveal: MotionValue<number>;
}) {
  const rowOpacity = useTransform(
    layerReveal,
    [index / total, (index + 1) / total],
    [0, 1],
    { clamp: true },
  );
  return (
    <motion.div
      style={{ opacity: rowOpacity }}
      className="flex items-center gap-2 rounded-md border border-border-subtle bg-background-subtle/60 px-2.5 py-1.5"
    >
      <span className="size-1.5 shrink-0 rounded-full bg-primary/70" />
      <span className="text-[11px] font-medium text-foreground">{layer}</span>
    </motion.div>
  );
}

function DigitalLayer({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.35, 0.7], [0, 1], { clamp: true });
  const layerReveal = useTransform(progress, [0.6, 0.95], [0, 1], { clamp: true });
  const layers = BRAND_CHAPTER_TWO.officeLayers;

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity }}
      className="absolute inset-0 flex flex-col overflow-hidden rounded-lg border border-border bg-card"
    >
      <div className="flex items-center gap-2 border-b border-border-subtle px-3 py-2">
        <span className="size-2 rounded-full bg-destructive/50" />
        <span className="size-2 rounded-full bg-accent-cyan/50" />
        <span className="size-2 rounded-full bg-success/50" />
        <span className="ml-2 h-4 max-w-40 flex-1 rounded-full bg-background-subtle" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {layers.map((layer, i) => (
          <DigitalOfficeRow
            key={layer}
            layer={layer}
            index={i}
            total={layers.length}
            layerReveal={layerReveal}
          />
        ))}
      </div>
    </motion.div>
  );
}

export function PhysicalToDigitalPanel({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border-subtle bg-background shadow-sm sm:aspect-[3/2]">
      <EnvironmentLayer progress={progress} />
      <DigitalLayer progress={progress} />
    </div>
  );
}
