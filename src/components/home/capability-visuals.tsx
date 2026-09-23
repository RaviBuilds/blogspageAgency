"use client";

import { Fragment, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   R5 — THREE VERTICALS capability visuals (Movement 3, services-bento.tsx)

   One section-local visual system, three progressively evolving worlds:

     START  (cyan)   Business → website → discovery → enquiry
                     human, approachable, customer-facing
     GROW   (blue)   Customer → portal → business software → operations
                     structured, operational, system-oriented
     SCALE  (violet) New enquiry → AI → qualify / follow-up → opportunity
                     intelligent, connected, automated

   Motion rules (same contract as the R4 Digital Home visual):
   - one-shot timelines driven by the card's `show` variant; nothing loops;
     every visual settles into a complete, readable rest state
   - travelling signals end invisible; only quiet hairlines remain
   - compositor-friendly: opacity / transform / SVG path drawing only
   - hover/focus strengthening is pure CSS (`group-hover:` on persistent
     accent layers), so keyboard focus produces the same state

   All visuals are `aria-hidden` — the card's real copy (stage, title,
   promise, vocabulary, proof) carries the meaning.

   Color semantics follow the approved triad:
     cyan   = presence / website / incoming attention
     blue   = business / customer / software
     violet = intelligence / automation
   ───────────────────────────────────────────────────────────────────────────── */

/**
 * Section-progress thresholds where GROW / SCALE activate
 * (guideline split: 0–30% START, 30–65% GROW, 65–100% SCALE).
 */
export const STAGE_THRESHOLDS = [0.3, 0.65] as const;
/** Section-progress point where the whole composition is considered complete. */
export const STAGE_COMPLETE_AT = 0.985;

/** Scroll-linked progress (0 → 1) for one capability world. */
export type StageProgress = MotionValue<number>;

/** Inline (flex-child) scroll reveal — used for small pills and labels. */
function InlineReveal({
  progress,
  from,
  to,
  y = 8,
  className,
  children,
}: {
  progress: StageProgress;
  from: number;
  to: number;
  y?: number;
  className?: string;
  children: ReactNode;
}) {
  const opacity = useTransform(progress, [from, to], [0, 1]);
  const ty = useTransform(progress, [from, to], [y, 0]);
  return (
    <motion.span style={{ opacity, y: ty }} className={className}>
      {children}
    </motion.span>
  );
}

/** Row-level scroll reveal (block flex row) — used for the GROW app rows. */
function RowReveal({
  progress,
  from,
  to,
  className,
  children,
}: {
  progress: StageProgress;
  from: number;
  to: number;
  className?: string;
  children: ReactNode;
}) {
  const opacity = useTransform(progress, [from, to], [0, 1]);
  const y = useTransform(progress, [from, to], [6, 0]);
  return (
    <motion.span style={{ opacity, y }} className={className}>
      {children}
    </motion.span>
  );
}

/**
 * A bar that *constructs* with progress (origin-left scaleX) — the data/state
 * inside a visual world fills in rather than fades in. Restrained: only
 * meaningful structural bars use it.
 */
function BuildBar({
  progress,
  from,
  to,
  className,
}: {
  progress: StageProgress;
  from: number;
  to: number;
  className?: string;
}) {
  const scaleX = useTransform(progress, [from, to], [0, 1]);
  return (
    <motion.span style={{ scaleX }} className={cn("origin-left", className)} />
  );
}

/**
 * One meaningful state, not decoration: the row that is currently "live" in
 * the business app gains a quiet stage-colored edge once its data has filled
 * in — opacity is scroll-driven and persists at rest.
 */
function RowActiveRing({
  progress,
  from,
  to,
  className,
}: {
  progress: StageProgress;
  from: number;
  to: number;
  className?: string;
}) {
  const opacity = useTransform(progress, [from, to], [0, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={cn(
        "pointer-events-none absolute -inset-px rounded-md border",
        className,
      )}
    />
  );
}

/**
 * The primary surface of a visual world (START website, GROW business app).
 * Reveals with a lift, then its stage-colored activation ring resolves on top
 * (ring opacity is scroll-driven; its hover strengthening is pure CSS on an
 * inner element, so the two drivers never fight over the same property).
 */
function StageSurface({
  progress,
  from,
  to,
  ringFrom,
  ringTo,
  ringClass,
  surfaceClass,
  children,
}: {
  progress: StageProgress;
  from: number;
  to: number;
  ringFrom: number;
  ringTo: number;
  ringClass: string;
  surfaceClass: string;
  children: ReactNode;
}) {
  const opacity = useTransform(progress, [from, to], [0, 1]);
  const y = useTransform(progress, [from, to], [14, 0]);
  const ringOpacity = useTransform(progress, [ringFrom, ringTo], [0, 1]);
  return (
    <motion.div style={{ opacity, y }} className="relative">
      <motion.span
        style={{ opacity: ringOpacity }}
        className="pointer-events-none absolute inset-0 z-10 block"
      >
        <span
          className={cn(
            "block h-full w-full rounded-xl border transition-colors duration-300",
            ringClass,
          )}
        />
      </motion.span>
      <div className={surfaceClass}>{children}</div>
    </motion.div>
  );
}

/** Small labelled node — the shared vocabulary of all three visuals. */
function NodeChip({
  label,
  dotClass,
  progress,
  from,
  to,
  emphasized = false,
  className,
}: {
  label: string;
  dotClass: string;
  progress: StageProgress;
  from: number;
  to: number;
  emphasized?: boolean;
  className?: string;
}) {
  const opacity = useTransform(progress, [from, to], [0, 1]);
  const y = useTransform(progress, [from, to], [8, 0]);
  return (
    <motion.span
      style={{ opacity, y }}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full border bg-card px-3 text-[11px] font-medium text-foreground transition-colors duration-300 group-hover:border-border-strong",
        emphasized
          ? "border-border-strong shadow-md"
          : "border-border shadow-sm",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full transition-transform duration-300 group-hover:scale-125",
          dotClass,
        )}
      />
      {label}
    </motion.span>
  );
}

/**
 * Vertical connector: quiet hairline + one-shot travelling signal + a hover
 * accent overlay (CSS-only, so focus/hover strengthening needs no JS).
 */
/**
 * Vertical connector between two story beats: the structural hairline draws
 * with progress, a short accent signal rides the draw and dissolves, and the
 * accent layer strengthens on hover/focus (CSS only).
 */
function FlowLine({
  height,
  from,
  to,
  color,
  progress,
}: {
  height: number;
  from: number;
  to: number;
  color: string;
  progress: StageProgress;
}) {
  const span = to - from;
  const d = `M 2 0 L 2 ${height}`;
  const trackLength = useTransform(progress, [from, from + span * 0.55], [0, 1]);
  const signalTravel = useTransform(progress, [from + span * 0.1, to], [0, 1]);
  const signalOffset = useTransform(signalTravel, (v) =>
    Math.min(0.84, Math.max(0, v - 0.16)),
  );
  const signalOpacity = useTransform(
    progress,
    [from, from + span * 0.25, to - span * 0.2, to],
    [0, 1, 1, 0],
  );
  return (
    <svg
      className="mx-auto block"
      width="4"
      height={height}
      viewBox={`0 0 4 ${height}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Structural hairline — draws with scroll progress. */}
      <motion.path
        d={d}
        stroke="var(--border-strong)"
        strokeWidth={1.75}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: trackLength }}
      />
      {/* Persistent accent layer — appears on hover/focus of the card. */}
      <path
        d={d}
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className="opacity-0 transition-opacity duration-300 group-hover:opacity-80"
      />
      {/* One-pass signal: rides the draw, dissolves at the window's end. */}
      <motion.path
        d={d}
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{
          pathLength: 0.16,
          pathOffset: signalOffset,
          opacity: signalOpacity,
        }}
      />
    </svg>
  );
}

/** SVG branch path (SCALE fork) — draws with progress, accent on hover.
    `persistentAccent` keeps a quiet violet draw on the path at rest so the
    AI → Follow-up flow reads without any interaction. */
function BranchPath({
  progress,
  from,
  to,
  d,
  color = "var(--accent-violet)",
  persistentAccent = false,
}: {
  progress: StageProgress;
  from: number;
  to: number;
  d: string;
  color?: string;
  persistentAccent?: boolean;
}) {
  const pathLength = useTransform(progress, [from, to], [0, 1]);
  return (
    <Fragment key={d}>
      <motion.path
        d={d}
        stroke="var(--border-strong)"
        strokeWidth={1.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength }}
      />
      {persistentAccent && (
        <motion.path
          d={d}
          stroke={color}
          strokeWidth={1.75}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="opacity-45"
          style={{ pathLength }}
        />
      )}
      <path
        d={d}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className="opacity-0 transition-opacity duration-300 group-hover:opacity-80"
      />
    </Fragment>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   START — Brand & Digital Presence (cyan)
   Business → website → discovery → enquiry.
   A compact, customer-facing website surface (R4 vocabulary, new composition).
   ───────────────────────────────────────────────────────────────────────────── */

const START_SITE_TILES = ["Services", "Work", "Contact"];

export function StartVisual({ progress }: { progress: StageProgress }) {
  return (
    <div className="relative" aria-hidden="true">
      {/* Business identity + discovery sources */}
      <div className="flex items-center justify-between gap-2">
        <NodeChip
          label="Business"
          dotClass="bg-accent-blue"
          progress={progress}
          from={0}
          to={0.12}
        />
        <InlineReveal
          progress={progress}
          from={0.06}
          to={0.2}
          className="inline-flex h-7 items-center gap-2 whitespace-nowrap rounded-full border border-border-subtle bg-background-subtle px-3 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground"
        >
          Google · Instagram
          <span className="size-1.5 rounded-full bg-accent-cyan/70" />
        </InlineReveal>
      </div>

      <FlowLine
        height={14}
        from={0.08}
        to={0.28}
        color="var(--accent-cyan)"
        progress={progress}
      />

      {/* The website — a real customer-facing surface (the primary object).
          The frame resolves first, then its internals build in sequence:
          chrome → identity/nav → hero → ENQUIRE → site sections. */}
      <StageSurface
        progress={progress}
        from={0.22}
        to={0.42}
        ringFrom={0.4}
        ringTo={0.56}
        ringClass="rounded-xl border-accent-cyan/35 group-hover:border-accent-cyan/70"
        surfaceClass="relative overflow-hidden rounded-xl border border-border-strong bg-card shadow-lg shadow-primary/10"
      >
        {/* Browser chrome */}
        <RowReveal
          progress={progress}
          from={0.36}
          to={0.5}
          className="flex items-center border-b border-border-subtle bg-background-subtle/60 px-3 py-1.5"
        >
          <span className="flex gap-1">
            <span className="size-1.5 rounded-full bg-border" />
            <span className="size-1.5 rounded-full bg-border" />
            <span className="size-1.5 rounded-full bg-border" />
          </span>
          <span className="mx-auto inline-flex items-center rounded border border-border bg-card px-2 py-0.5 text-[9px] font-medium text-muted-foreground shadow-sm">
            yourbusiness.com
          </span>
          <span className="w-[14px]" aria-hidden="true" />
        </RowReveal>

        {/* Brand identity + site nav */}
        <RowReveal
          progress={progress}
          from={0.44}
          to={0.58}
          className="flex items-center justify-between gap-2 border-b border-border-subtle px-3 py-2"
        >
          <span className="text-[10px] font-semibold tracking-tight text-foreground">
            Your business
          </span>
          <span className="flex items-center gap-1.5 text-[8px] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:gap-2">
            <span>Services</span>
            <span>About</span>
            <span>Contact</span>
          </span>
        </RowReveal>

        {/* Hero + enquiry action */}
        <RowReveal
          progress={progress}
          from={0.52}
          to={0.66}
          className="px-3 py-3 text-center"
        >
          <p className="text-xs font-semibold tracking-tight text-foreground">
            Your business, online.
          </p>
          <BuildBar
            progress={progress}
            from={0.56}
            to={0.7}
            className="mx-auto mt-1.5 block h-1 w-24 rounded-full bg-muted-foreground/20"
          />
          <InlineReveal
            progress={progress}
            from={0.68}
            to={0.82}
            className="mt-2.5 inline-flex h-6 items-center rounded-full border border-accent-cyan/35 bg-accent-cyan/15 px-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-accent-cyan transition-colors duration-300 group-hover:border-accent-cyan/60"
          >
            Enquire
          </InlineReveal>
        </RowReveal>

        {/* Site sections */}
        <RowReveal
          progress={progress}
          from={0.74}
          to={0.88}
          className="grid grid-cols-3 gap-px border-t border-border-subtle bg-border-subtle"
        >
          {START_SITE_TILES.map((tile) => (
            <div key={tile} className="bg-card px-2 py-2 text-center">
              <span className="mx-auto block h-1 w-6 rounded-full bg-muted-foreground/20" />
              <span className="mt-1 block text-[8px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                {tile}
              </span>
            </div>
          ))}
        </RowReveal>
      </StageSurface>

      <FlowLine
        height={14}
        from={0.8}
        to={0.94}
        color="var(--accent-cyan)"
        progress={progress}
      />

      {/* The outcome: an enquiry arrives */}
      <div className="flex justify-center">
        <NodeChip
          label="Enquiry"
          dotClass="bg-accent-cyan"
          progress={progress}
          from={0.88}
          to={1}
          emphasized
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   GROW — Applications & Business Software (blue)
   Customer → portal → business software → operations.
   Two linked operational surfaces; permission-like separation via role dots.
   ───────────────────────────────────────────────────────────────────────────── */

const GROW_APP_ROWS: {
  barWidth: string;
  status: string;
  statusClass: string;
}[] = [
  {
    barWidth: "w-16",
    status: "New",
    statusClass: "border-accent-cyan/25 bg-accent-cyan/10 text-accent-cyan",
  },
  {
    barWidth: "w-12",
    status: "Confirmed",
    statusClass: "border-accent-blue/25 bg-accent-blue/10 text-accent-blue",
  },
  {
    barWidth: "w-14",
    status: "Ready",
    statusClass: "border-accent-blue/25 bg-accent-blue/10 text-accent-blue",
  },
];

export function GrowVisual({ progress }: { progress: StageProgress }) {
  return (
    <div className="relative" aria-hidden="true">
      {/* Customer + request */}
      <div className="flex items-center justify-between gap-2">
        <NodeChip
          label="Customer"
          dotClass="bg-accent-blue"
          progress={progress}
          from={0}
          to={0.16}
        />
        <InlineReveal
          progress={progress}
          from={0.08}
          to={0.26}
          className="inline-flex h-7 items-center gap-2 rounded-full border border-border-subtle bg-background-subtle px-3"
        >
          <span className="h-1 w-10 rounded-full bg-muted-foreground/20" />
          <span className="size-1.5 rounded-full bg-accent-blue/70" />
        </InlineReveal>
      </div>

      <FlowLine
        height={12}
        from={0.1}
        to={0.34}
        color="var(--accent-blue)"
        progress={progress}
      />

      {/* Customer portal — what the customer sees (secondary surface) */}
      <RowReveal
        progress={progress}
        from={0.26}
        to={0.5}
        className="relative flex items-center justify-between gap-2 overflow-hidden rounded-lg border border-border-subtle bg-background-subtle/60 px-3 py-2"
      >
        <span className="absolute inset-y-0 left-0 w-0.5 bg-accent-blue/40 transition-colors duration-300 group-hover:bg-accent-blue/70" />
        <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Customer portal
        </span>
        <span className="flex items-center gap-2">
          <BuildBar
            progress={progress}
            from={0.36}
            to={0.5}
            className="h-1 w-8 rounded-full bg-muted-foreground/20"
          />
          <span className="inline-flex h-5 items-center rounded-full border border-accent-blue/25 bg-accent-blue/10 px-2 text-[9px] font-semibold text-accent-blue">
            Confirmed
          </span>
        </span>
      </RowReveal>

      <FlowLine
        height={12}
        from={0.48}
        to={0.64}
        color="var(--accent-blue)"
        progress={progress}
      />

      {/* The business app — what the team operates (the primary object) */}
      <StageSurface
        progress={progress}
        from={0.5}
        to={0.74}
        ringFrom={0.64}
        ringTo={0.8}
        ringClass="rounded-xl border-accent-blue/35 group-hover:border-accent-blue/70"
        surfaceClass="relative overflow-hidden rounded-xl border border-border-strong bg-card shadow-lg shadow-primary/10"
      >
        {/* Header: app identity + team/role separation */}
        <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2">
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="size-3 rounded-[4px] border border-accent-blue/40 bg-accent-blue/20"
            />
            <span className="text-[11px] font-semibold tracking-tight text-foreground">
              Business app
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-[8px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Team
            </span>
            <span className="size-1.5 rounded-full bg-accent-blue" />
            <span className="size-1.5 rounded-full border border-accent-blue/50" />
          </span>
        </div>

        {/* Operational rows — the system "fills" in sequence; the first row
            settles as the app's one meaningful live state (a quiet blue edge,
            not a decoration: it reads as "this order is being worked"). */}
        <div className="space-y-1.5 px-3 py-2.5">
          {GROW_APP_ROWS.map((row, i) => (
            <RowReveal
              key={row.status}
              progress={progress}
              from={0.66 + i * 0.05}
              to={0.8 + i * 0.05}
              className={cn(
                "flex items-center justify-between rounded-md border bg-background-subtle/50 px-2 py-1",
                i === 0
                  ? "relative border-transparent"
                  : "border-border-subtle",
              )}
            >
              {i === 0 && (
                <RowActiveRing
                  progress={progress}
                  from={0.7}
                  to={0.78}
                  className="border-accent-blue/45"
                />
              )}
              <BuildBar
                progress={progress}
                from={0.68 + i * 0.05}
                to={0.78 + i * 0.05}
                className={cn("h-1.5 rounded-full bg-muted-foreground/20", row.barWidth)}
              />
              <span
                className={cn(
                  "inline-flex h-4.5 items-center rounded-full border px-1.5 text-[8px] font-semibold",
                  row.statusClass,
                )}
              >
                {row.status}
              </span>
            </RowReveal>
          ))}
        </div>

        {/* Operations footer */}
        <RowReveal
          progress={progress}
          from={0.9}
          to={1}
          className="flex items-center justify-between border-t border-border-subtle px-3 py-1.5"
        >
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-accent-blue transition-transform duration-300 group-hover:scale-125" />
            <span className="text-[8px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              Operations
            </span>
          </span>
          <BuildBar
            progress={progress}
            from={0.92}
            to={1}
            className="h-1 w-10 rounded-full bg-muted-foreground/20"
          />
        </RowReveal>
      </StageSurface>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCALE — AI & Automation (blue / violet)
   New enquiry → AI → qualify / follow-up → opportunity.
   A business automation pipeline — no robots, no sci-fi.
   ───────────────────────────────────────────────────────────────────────────── */

export function ScaleVisual({ progress }: { progress: StageProgress }) {
  const aiOpacity = useTransform(progress, [0.22, 0.4], [0, 1]);
  const aiY = useTransform(progress, [0.22, 0.4], [8, 0]);
  const ringOpacity = useTransform(
    progress,
    [0.36, 0.42, 0.56, 0.64],
    [0, 0.85, 0.85, 0],
  );
  const ringScale = useTransform(progress, [0.36, 0.64], [1, 1.85]);
  return (
    <div className="relative" aria-hidden="true">
      {/* Incoming enquiry */}
      <div className="flex justify-center">
        <NodeChip
          label="New enquiry"
          dotClass="bg-accent-cyan"
          progress={progress}
          from={0}
          to={0.14}
        />
      </div>

      <FlowLine
        height={12}
        from={0.08}
        to={0.26}
        color="var(--accent-cyan)"
        progress={progress}
      />

      {/* AI node — the primary object; one scroll-linked pulse, then it rests */}
      <div className="flex justify-center">
        <motion.span
          style={{ opacity: aiOpacity, y: aiY }}
          className="relative inline-flex"
        >
          <motion.span
            style={{ opacity: ringOpacity, scale: ringScale }}
            className="absolute -inset-2 rounded-lg border border-accent-violet/50"
          />
          <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-accent-violet/50 bg-card shadow-lg shadow-primary/10 transition-colors duration-300 group-hover:border-accent-violet/80">
            <span className="text-[11px] font-semibold tracking-tight text-foreground">
              AI
            </span>
          </span>
        </motion.span>
      </div>

      {/* Branch: qualify / follow-up */}
      <div className="mx-auto w-full max-w-[240px]">
        <svg
          className="block h-6 w-full"
          viewBox="0 0 280 26"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          {[
            // Qualified branch — supporting, stays quiet.
            { d: "M 140 2 C 140 18, 70 12, 70 26", from: 0.46, to: 0.6, accent: false },
            // Follow-up branch — the AI → Follow-up flow is the primary path,
            // so its draw keeps a persistent violet trace at rest.
            { d: "M 140 2 C 140 18, 210 12, 210 26", from: 0.5, to: 0.64, accent: true },
          ].map((branch) => (
            <BranchPath
              key={branch.d}
              progress={progress}
              from={branch.from}
              to={branch.to}
              d={branch.d}
              persistentAccent={branch.accent}
            />
          ))}
        </svg>

        <div className="flex items-center justify-between">
          <NodeChip
            label="Qualified"
            dotClass="bg-accent-blue"
            progress={progress}
            from={0.56}
            to={0.7}
          />
          <NodeChip
            label="Follow-up sent"
            dotClass="bg-accent-violet"
            progress={progress}
            from={0.64}
            to={0.78}
          />
        </div>
      </div>

      <FlowLine
        height={12}
        from={0.76}
        to={0.9}
        color="var(--accent-violet)"
        progress={progress}
      />

      {/* The kept opportunity */}
      <div className="flex justify-center">
        <NodeChip
          label="Opportunity"
          dotClass="bg-accent-violet"
          progress={progress}
          from={0.86}
          to={1}
          emphasized
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Shared spine — START ●──── GROW ●──── SCALE
   R5.1: a real progression indicator driven by the section's scroll progress.
   Nodes activate at the stage thresholds, a stage's node completes when the
   next activates, the connecting segments draw as brand-gradient paths (with
   a subtle signal riding each fill), and once every stage has run the spine
   settles: colored nodes, filled segments, no further motion. Horizontal on
   desktop, vertical on mobile.
   ───────────────────────────────────────────────────────────────────────────── */

const SPINE_STAGES = ["START", "GROW", "SCALE"] as const;
const SPINE_DOTS = ["bg-accent-cyan", "bg-accent-blue", "bg-accent-violet"] as const;
const SPINE_RGB = ["14,116,144", "67,83,201", "124,58,237"] as const;

/** Segment draw windows (R5.3): each segment fills in one short, deliberate
    sweep right as the next stage activates — the visible handoff moment. */
const SPINE_SEGMENTS: [number, number][] = [
  [0.24, 0.34],
  [0.6, 0.68],
];

/** Derive node states from section progress (pure, so it can seed state). */
function spineState(v: number): { activeIdx: number; doneCount: number } {
  const doneCount =
    v >= STAGE_COMPLETE_AT
      ? 3
      : v >= STAGE_THRESHOLDS[1] + 0.02
        ? 2
        : v >= STAGE_THRESHOLDS[0] + 0.02
          ? 1
          : 0;
  const activeIdx =
    v >= STAGE_COMPLETE_AT
      ? -1
      : v >= STAGE_THRESHOLDS[1]
        ? 2
        : v >= STAGE_THRESHOLDS[0]
          ? 1
          : 0;
  return { activeIdx, doneCount };
}

/** One stage node: upcoming → active (emphasized) → completed (stabilized). */
function SpineNode({
  label,
  index,
  state,
  progress,
}: {
  label: string;
  index: number;
  state: { activeIdx: number; doneCount: number };
  progress: StageProgress;
}) {
  const opacity = useTransform(
    progress,
    [0.02 + index * 0.05, 0.14 + index * 0.05],
    [0, 1],
  );
  const done = state.doneCount > index;
  const active = state.activeIdx === index;
  return (
    <motion.span
      style={{ opacity }}
      className="relative z-10 inline-flex items-center gap-2"
    >
      <span className="relative inline-flex">
        <span
          className={cn(
            "absolute -inset-1.5 rounded-full transition-opacity duration-500",
            active ? "opacity-100" : "opacity-0",
          )}
          style={{
            background: `radial-gradient(closest-side, rgba(${SPINE_RGB[index]},0.25), transparent)`,
          }}
        />
        <span
          className={cn(
            "size-2 rounded-full transition-[background-color,transform] duration-500",
            done || active ? SPINE_DOTS[index] : "bg-border",
            active && "scale-125",
          )}
        />
      </span>
      <span
        className={cn(
          "text-[11px] font-semibold tracking-[0.18em] transition-colors duration-500",
          done || active ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
    </motion.span>
  );
}

/**
 * One connecting segment: the track is a quiet hairline, the brand-gradient
 * fill draws with progress, a short signal rides the leading edge and
 * dissolves — the completed segment then rests as a stabilized gradient line.
 */
function SpineSegment({
  progress,
  window: segmentWindow,
  gradientId,
  fromColor,
  toColor,
  vertical = false,
}: {
  progress: StageProgress;
  window: [number, number];
  gradientId: string;
  fromColor: string;
  toColor: string;
  vertical?: boolean;
}) {
  const [from, to] = segmentWindow;
  const fill = useTransform(progress, [from, to], [0, 1]);
  const signalTravel = useTransform(progress, [from, to], [0, 1]);
  const signalOffset = useTransform(signalTravel, (v) =>
    Math.min(0.9, Math.max(0, v - 0.1)),
  );
  const signalOpacity = useTransform(
    progress,
    [from, from + (to - from) * 0.3, to - (to - from) * 0.25, to],
    [0, 1, 1, 0],
  );
  const d = vertical ? "M 1 0 L 1 20" : "M 0 1 L 100 1";
  return (
    <svg
      className={vertical ? "ml-[3px] block h-5 w-0.5" : "mx-4 block h-2 flex-1"}
      viewBox={vertical ? "0 0 2 20" : "0 0 100 2"}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2={vertical ? "0" : "1"}
          y2={vertical ? "1" : "0"}
        >
          <stop offset="0%" stopColor={fromColor} />
          <stop offset="100%" stopColor={toColor} />
        </linearGradient>
      </defs>
      <path
        d={d}
        stroke="var(--border)"
        strokeWidth={vertical ? 2 : 1.5}
        vectorEffect="non-scaling-stroke"
      />
      <motion.path
        d={d}
        stroke={`url(#${gradientId})`}
        strokeWidth={vertical ? 2.5 : 2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: fill }}
      />
      <motion.path
        d={d}
        stroke={toColor}
        strokeWidth={vertical ? 3.5 : 3}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{
          pathLength: 0.14,
          pathOffset: signalOffset,
          opacity: signalOpacity,
        }}
      />
    </svg>
  );
}

export function CapabilitySpine({
  progress,
  className,
}: {
  progress: StageProgress;
  className?: string;
}) {
  // Seed from the current value so a completed / reduced-motion progress (a
  // static 1) renders the finished spine immediately, with no scroll event.
  const [state, setState] = useState(() => spineState(progress.get()));

  useMotionValueEvent(progress, "change", (v) => {
    const next = spineState(v);
    setState((prev) =>
      prev.activeIdx === next.activeIdx && prev.doneCount === next.doneCount
        ? prev
        : next,
    );
  });

  return (
    <div aria-hidden="true" className={className}>
      {/* Desktop: horizontal progression */}
      <div className="relative hidden items-center md:flex">
        {SPINE_STAGES.map((stage, i) => (
          <Fragment key={stage}>
            <SpineNode label={stage} index={i} state={state} progress={progress} />
            {i < SPINE_STAGES.length - 1 && (
              <SpineSegment
                progress={progress}
                window={SPINE_SEGMENTS[i]}
                gradientId={`r5-spine-${i}-h`}
                fromColor={`rgba(${SPINE_RGB[i]},0.9)`}
                toColor={`rgba(${SPINE_RGB[i + 1]},0.9)`}
              />
            )}
          </Fragment>
        ))}
      </div>

      {/* Mobile: the same progression, stacked */}
      <div className="relative mx-auto flex w-fit flex-col items-start md:hidden">
        {SPINE_STAGES.map((stage, i) => (
          <Fragment key={stage}>
            <SpineNode label={stage} index={i} state={state} progress={progress} />
            {i < SPINE_STAGES.length - 1 && (
              <SpineSegment
                progress={progress}
                window={SPINE_SEGMENTS[i]}
                gradientId={`r5-spine-${i}-v`}
                fromColor={`rgba(${SPINE_RGB[i]},0.9)`}
                toColor={`rgba(${SPINE_RGB[i + 1]},0.9)`}
                vertical
              />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}




