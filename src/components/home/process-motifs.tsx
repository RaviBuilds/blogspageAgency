"use client";

import {
  motion,
  motionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   R11 — PROCESS ARTIFACTS (reversible scroll narrative)

   R10 drove the artifacts with DISCRETE React state (an `activePhase` number plus
   `armed`/`isActive` booleans) on top of a MONOTONIC progress clamp. The result
   was four separate screens that swapped and never rolled back.

   R11 removes both mechanisms. Every visual in this file is now a pure
   `useTransform` of ONE reversible source — the section's own
   `scrollYProgress` — so:

     scroll DOWN  -> every value advances
     scroll UP    -> every value reverses, frame for frame
     stop         -> every value holds (nothing animates on its own)

   Consequences worth stating explicitly:
   - The R10 contract "states persist / no reverse churn" is REPLACED by
     "reversible and scroll-locked" for this section. That is a deliberate
     product decision: the visitor must be able to scroll the project back.
   - No React state and no `useMotionValueEvent` remain here, so scrolling the
     section causes ZERO React re-renders — only MotionValue -> style writes.
   - Nothing loops: the `repeat`-based flicker and both `animate-pulse` dots
     are gone. Activity is expressed by a pending -> active interpolation that
     is tied to scroll position and therefore stops when the visitor stops.

   Colour progression (restrained, semantic, pre-painted):
     neutral  -> not started        accent   -> in progress
     strong   -> active             success  -> complete / live
   Colour is applied as the OPACITY of pre-painted layers (border tint, body
   wash, node fill, completion layer), never by animating `border-color` or a
   filter — see the performance note in the section report.

   Progress contract: the parent owns the one `scrollYProgress` and passes it
   down. Crossfade windows are centred on the STAGE_WINDOWS boundaries so the
   left artifact and the right timeline can never disagree. All artifact copy is
   illustrative sample data and the artifacts are decorative (aria-hidden); the
   phase copy in `process-timeline.tsx` carries the meaning.
   ─────────────────────────────────────────────────────────────────────────── */

/* Approved accent triplets (globals.css tokens; Blueprint §17). `success` is
   the existing semantic success token (--success), used only for the completed
   launch state. */
export const STAGE_ACCENTS = {
  cyan: "14,116,144",
  blue: "67,83,201",
  violet: "124,58,237",
  success: "4,120,87",
} as const;

/**
 * Section progress windows — the boundaries shared with `process-timeline.tsx`
 * (the stage nodes use `useReached(progress, 0.06 + i * 0.22)`), so the left
 * artifact and the right timeline advance together.
 */
export const STAGE_WINDOWS = {
  entry: [0, 0.06],
  understand: [0.06, 0.28],
  shape: [0.28, 0.5],
  build: [0.5, 0.74],
  launch: [0.74, 0.92],
  live: [0.92, 1],
} as const;

/**
 * Static, fully-concrete progress for the non-scroll-linked renderings (the
 * inline mobile artifacts): a MotionValue constant of 1 means every window
 * resolves to its completed value with no animation at all.
 */
export const COMPLETE_PROGRESS = motionValue(1);

/**
 * A stage/window "reached" value: 0 before `from`, easing to 1 across the
 * settle span, then clamped at 1. Derived from the shared progress, so it now
 * reverses naturally when the visitor scrolls back up.
 */
export function useReached(
  progress: MotionValue<number>,
  from: number,
  settle = 0.05,
): MotionValue<number> {
  return useTransform(progress, [from, Math.min(1, from + settle)], [0, 1], {
    clamp: true,
  });
}

const CYAN = STAGE_ACCENTS.cyan;
const BLUE = STAGE_ACCENTS.blue;
const VIOLET = STAGE_ACCENTS.violet;
const SUCCESS = STAGE_ACCENTS.success;

/** A progress window, always ascending and inside [0, 1]. */
type Win = readonly [number, number];

/**
 * Reduced motion: collapse an interpolation window into a hard step that snaps
 * at the window's MIDPOINT. Because the crossfade windows are centred on the
 * phase boundaries (0.28 / 0.50 / 0.74), that midpoint IS the boundary — so
 * under reduced motion the artifact still changes at exactly the moment the
 * timeline's stage node does, it simply changes without interpolating.
 */
function win(reduce: boolean, from: number, to: number): Win {
  if (!reduce) return [from, to] as const;
  const at = (from + to) / 2;
  return [at, Math.min(1, at + 0.001)] as const;
}

/** Window used where a value must never activate but a hook call is required. */
const INERT_WINDOW: Win = [0.998, 0.999];

/*
 * Crossfade windows — centred on the 0.28 / 0.50 / 0.74 boundaries and widened
 * to 0.08 so consecutive artifacts genuinely OVERLAP: the outgoing artifact is
 * still fading while the incoming one is already rising, which is what turns
 * four screens into one continuous morph. The y-drift and micro-scale are
 * symmetric, so the morph reads the same in both scroll directions.
 */
const CROSS = {
  briefOut: [0.24, 0.32],
  shapeIn: [0.24, 0.32],
  shapeOut: [0.46, 0.54],
  buildIn: [0.46, 0.54],
  buildOut: [0.7, 0.78],
  launchIn: [0.7, 0.78],
} as const;

const RAIL_GRADIENT = {
  backgroundImage:
    "linear-gradient(90deg, rgba(14,116,144,0.9) 0%, rgba(67,83,201,0.85) 55%, rgba(124,58,237,0.8) 100%)",
} as const;

/* ─────────────────────────────────────────────────────────────────────────────
   ARTIFACT SHELL — the shared window chrome. R11 renders three pre-painted
   layers whose OPACITY is scroll-linked:

     wash        body tint          (very low alpha, warm the flat white card)
     tint        accent border      (the phase's accent, <= 0.5 per Blueprint)
     completion  success border     (launch only: "complete / live")

   The header status dot interpolates pending -> active with the same window,
   so the top of the window reads as an interface waking up.
   ─────────────────────────────────────────────────────────────────────────── */

type ArtifactShellProps = {
  label: string;
  accent: string;
  meta?: string;
  /** Soft window over which this phase's accent engages. */
  engage: Win;
  tintAlpha: number;
  washAlpha: number;
  reduce: boolean;
  progress: MotionValue<number>;
  /** Optional completed-state layer (launch). */
  completion?: { accent: string; window: Win; alpha: number };
  footer: ReactNode;
  children: ReactNode;
};

function ArtifactShell({
  label,
  accent,
  meta,
  engage,
  tintAlpha,
  washAlpha,
  reduce,
  progress,
  completion,
  footer,
  children,
}: ArtifactShellProps) {
  const engageWin = win(reduce, engage[0], engage[1]);
  const completionWindow = completion ? completion.window : INERT_WINDOW;
  const completionWin = win(reduce, completionWindow[0], completionWindow[1]);
  const completionAlpha = completion ? completion.alpha : 0;

  const tintOpacity = useTransform(progress, [...engageWin], [0, tintAlpha], {
    clamp: true,
  });
  const washOpacity = useTransform(progress, [...engageWin], [0, washAlpha], {
    clamp: true,
  });
  const completionOpacity = useTransform(
    progress,
    [...completionWin],
    [0, completionAlpha],
    { clamp: true },
  );
  const dotOpacity = useTransform(progress, [...engageWin], [0.35, 1], {
    clamp: true,
  });
  const dotScale = useTransform(progress, [...engageWin], [0.85, 1], {
    clamp: true,
  });

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      {/* Body wash — warms the flat white as the phase engages. */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{ backgroundColor: "rgba(" + accent + ", 1)", opacity: washOpacity }}
      />
      {/* Accent border — pre-painted; only its opacity animates. */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          border: "1.5px solid rgba(" + accent + ", " + tintAlpha + ")",
          opacity: tintOpacity,
        }}
      />
      {/* Completed / live border (launch only). */}
      {completion ? (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            border: "1.5px solid rgba(" + completion.accent + ", " + completion.alpha + ")",
            opacity: completionOpacity,
          }}
        />
      ) : null}

      <div className="relative flex items-center justify-between gap-2 border-b border-border-subtle bg-background-subtle px-4 py-2.5">
        <span className="flex min-w-0 items-center gap-2">
          {/* Status dot: resting faint dot + accent overlay that wakes up. */}
          <span
            aria-hidden
            className="relative size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: "rgba(" + accent + ", 0.35)" }}
          >
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: "rgb(" + accent + ")",
                opacity: dotOpacity,
                scale: dotScale,
              }}
            />
          </span>
          <span className="truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-text-subtle">
            {label}
          </span>
        </span>
        {meta ? (
          <span className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-text-disabled">
            {meta}
          </span>
        ) : null}
      </div>
      <div className="relative flex flex-1 flex-col justify-center gap-3 px-4 py-4">
        {children}
      </div>
      <div className="relative flex items-center justify-between gap-3 border-t border-border-subtle px-4 py-2.5">
        {footer}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ARTIFACT FOOTER — status line. The live dot (launch only) interpolates from
   pending to active across the scroll window instead of pulsing forever.
   ─────────────────────────────────────────────────────────────────────────── */

function ArtifactFooter({
  accent,
  pulse = false,
  reduce,
  progress,
  dotWindow = INERT_WINDOW,
  dotBase = 0.35,
  left,
  right,
}: {
  accent?: string;
  pulse?: boolean;
  reduce: boolean;
  progress: MotionValue<number>;
  dotWindow?: Win;
  dotBase?: number;
  left: string;
  right?: string;
}) {
  const win_ = win(reduce, dotWindow[0], dotWindow[1]);
  const dotOpacity = useTransform(progress, [...win_], [dotBase, 1], {
    clamp: true,
  });
  const dotScale = useTransform(progress, [...win_], [0.85, 1], { clamp: true });

  return (
    <>
      <span className="flex min-w-0 items-center gap-2 text-[11px] text-text-subtle">
        {pulse ? (
          <span
            aria-hidden
            className="relative size-1.5 shrink-0 rounded-full"
            style={
              accent ? { backgroundColor: "rgba(" + accent + ", 0.3)" } : undefined
            }
          >
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: accent
                  ? "rgb(" + accent + ")"
                  : "var(--border-strong)",
                opacity: dotOpacity,
                scale: dotScale,
              }}
            />
          </span>
        ) : null}
        <span className="truncate">{left}</span>
      </span>
      {right ? (
        <span className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-text-disabled">
          {right}
        </span>
      ) : null}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PHASE 01 — UNDERSTAND · PROJECT BRIEF
   Mostly neutral (wash ~0.02, tint 0.18). The brief "clarifies" as the visitor
   scrolls: the five fields reveal in three consecutive windows, so the
   document reads as incomplete at the start and legible by the end.
   ────────────────────────────────────────────────────────────────────────── */

const BRIEF_ROWS = [
  { label: "Goal", value: "More quote-ready enquiries every month", group: 0 },
  { label: "Customer", value: "Local business owners, mostly on mobile", group: 0 },
  {
    label: "Problem",
    value: "Enquiries get lost between WhatsApp, calls and email",
    group: 1,
  },
  { label: "Needs", value: "Website, booking flow, automatic follow-up", group: 1 },
  { label: "Success", value: "Every enquiry answered the same day", group: 2 },
] as const;

const BRIEF_GROUP_WINDOWS: readonly Win[] = [
  [0.08, 0.17],
  [0.13, 0.22],
  [0.18, 0.26],
];

function BriefRow({
  progress,
  reduce,
  from,
  to,
  label,
  value,
}: {
  progress: MotionValue<number>;
  reduce: boolean;
  from: number;
  to: number;
  label: string;
  value: string;
}) {
  const clarity = useTransform(progress, [...win(reduce, from, to)], [0.45, 1], {
    clamp: true,
  });

  return (
    <motion.div
      className="grid grid-cols-[4.5rem_1fr] gap-3 sm:grid-cols-[5.5rem_1fr]"
      style={{ opacity: clarity }}
    >
      <span className="pt-0.5 text-[10px] font-medium uppercase leading-relaxed tracking-[0.12em] text-text-subtle">
        {label}
      </span>
      <span className="text-xs leading-snug text-foreground sm:text-[13px]">
        {value}
      </span>
    </motion.div>
  );
}

export function BriefArtifact({ progress }: { progress: MotionValue<number> }) {
  const reduce = Boolean(useReducedMotion());

  return (
    <ArtifactShell
      label="Project brief"
      accent={CYAN}
      meta="Phase 01"
      engage={[0.06, 0.16]}
      tintAlpha={0.18}
      washAlpha={0.02}
      reduce={reduce}
      progress={progress}
      footer={
        <ArtifactFooter
          reduce={reduce}
          progress={progress}
          dotWindow={[0.14, 0.26]}
          accent={CYAN}
          pulse
          left="Scope v1 · agreed with you"
        />
      }
    >
      {BRIEF_ROWS.map((row) => {
        const group = BRIEF_GROUP_WINDOWS[row.group];
        return (
          <BriefRow
            key={row.label}
            progress={progress}
            reduce={reduce}
            from={group[0]}
            to={group[1]}
            label={row.label}
            value={row.value}
          />
        );
      })}
    </ArtifactShell>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PHASE 02 — SHAPE · SYSTEM DIRECTION
   Accent begins appearing. The links between the layers DRAW as you scroll
   (scaleY, origin top) and two of the four nodes take a selective accent fill
   — hierarchy, not a colour wash over everything.
   ─────────────────────────────────────────────────────────────────────────── */

const CONNECTOR_WINDOWS: readonly Win[] = [
  [0.32, 0.4],
  [0.36, 0.44],
  [0.4, 0.48],
];

const STRUCTURE_NODES = [
  {
    name: "Website",
    detail: "How customers find you",
    tint: [0.3, 0.38] as Win,
    fill: 0.03,
  },
  {
    name: "Business system",
    detail: "Bookings, enquiries, follow-ups",
    tint: [0.32, 0.42] as Win,
    fill: 0.07,
  },
  {
    name: "AI & automation",
    detail: "Replies and reminders, handled",
    tint: [0.4, 0.5] as Win,
    fill: 0.07,
  },
  {
    name: "Dashboard",
    detail: "Everything, in one view",
    tint: [0.44, 0.54] as Win,
    fill: 0.03,
  },
] as const;

function StructureNode({
  progress,
  reduce,
  node,
  index,
}: {
  progress: MotionValue<number>;
  reduce: boolean;
  node: (typeof STRUCTURE_NODES)[number];
  index: number;
}) {
  const connector = CONNECTOR_WINDOWS[Math.max(0, index - 1)];
  const connectorWin = win(reduce, connector[0], connector[1]);
  const tintWin = win(reduce, node.tint[0], node.tint[1]);

  const connectorScale = useTransform(progress, [...connectorWin], [0, 1], {
    clamp: true,
  });
  const tintOpacity = useTransform(progress, [...tintWin], [0, node.fill], {
    clamp: true,
  });

  return (
    <>
      {index > 0 ? (
        <motion.span
          aria-hidden
          className="mx-auto h-2.5 w-px"
          style={{
            backgroundColor: "rgba(" + BLUE + ", 0.4)",
            transformOrigin: "top",
            scaleY: connectorScale,
          }}
        />
      ) : null}
      <div className="relative flex items-center justify-between gap-3 overflow-hidden rounded-lg border border-border-subtle bg-background px-3 py-2.5">
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg"
          style={{ backgroundColor: "rgb(" + BLUE + ")", opacity: tintOpacity }}
        />
        <span className="relative text-xs font-medium text-foreground sm:text-[13px]">
          {node.name}
        </span>
        <span className="relative truncate text-[11px] text-muted-foreground">
          {node.detail}
        </span>
      </div>
    </>
  );
}

export function StructureArtifact({ progress }: { progress: MotionValue<number> }) {
  const reduce = Boolean(useReducedMotion());

  return (
    <ArtifactShell
      label="System direction"
      accent={BLUE}
      meta="Phase 02"
      engage={[0.28, 0.4]}
      tintAlpha={0.3}
      washAlpha={0.05}
      reduce={reduce}
      progress={progress}
      footer={
        <ArtifactFooter
          reduce={reduce}
          progress={progress}
          left="Direction v1 · approved before build"
        />
      }
    >
      {STRUCTURE_NODES.map((node, index) => (
        <StructureNode
          key={node.name}
          progress={progress}
          reduce={reduce}
          node={node}
          index={index}
        />
      ))}
    </ArtifactShell>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PHASE 03 — BUILD · BUILD PROGRESS
   Strongest accent on the ACTIVE elements only: the sprint bar fills, the three
   completed areas land in sequence, and the in-progress dot interpolates from
   pending to active. "Payments" stays deliberately recessive.
   ─────────────────────────────────────────────────────────────────────────── */

const BUILD_ITEMS = [
  { name: "Homepage", tag: "Done", state: "done", window: [0.55, 0.6] as Win, base: 0 },
  {
    name: "Authentication",
    tag: "Done",
    state: "done",
    window: [0.58, 0.63] as Win,
    base: 0,
  },
  { name: "Dashboard", tag: "Done", state: "done", window: [0.61, 0.66] as Win, base: 0 },
  {
    name: "Automation",
    tag: "In progress",
    state: "active",
    window: [0.63, 0.7] as Win,
    base: 0.35,
  },
  { name: "Payments", tag: "Next", state: "next", window: [0.68, 0.78] as Win, base: 0.45 },
] as const;

function BuildRow({
  progress,
  reduce,
  item,
}: {
  progress: MotionValue<number>;
  reduce: boolean;
  item: (typeof BUILD_ITEMS)[number];
}) {
  const rowWin = win(reduce, item.window[0], item.window[1]);
  const markOpacity = useTransform(progress, [...rowWin], [item.base, 1], {
    clamp: true,
  });
  const markScale = useTransform(progress, [...rowWin], [0.9, 1], { clamp: true });

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-foreground sm:text-[13px]">{item.name}</span>
      <span className="flex shrink-0 items-center gap-1.5">
        {item.state === "done" ? (
          <motion.span
            aria-hidden
            className="flex items-center"
            style={{ opacity: markOpacity, scale: markScale }}
          >
            <Check
              className="size-3.5"
              strokeWidth={2.5}
              style={{ color: "rgb(" + VIOLET + ")" }}
            />
          </motion.span>
        ) : item.state === "active" ? (
          <motion.span
            aria-hidden
            className="size-2 rounded-full"
            style={{
              backgroundColor: "rgb(" + VIOLET + ")",
              opacity: markOpacity,
              scale: markScale,
            }}
          />
        ) : (
          <motion.span
            aria-hidden
            className="size-2 rounded-full border-[1.5px]"
            style={{
              borderColor: "var(--border-strong)",
              opacity: markOpacity,
            }}
          />
        )}
        <span className="text-[10px] uppercase tracking-[0.14em] text-text-subtle">
          {item.tag}
        </span>
      </span>
    </div>
  );
}

export function BuildArtifact({ progress }: { progress: MotionValue<number> }) {
  const reduce = Boolean(useReducedMotion());

  const barScale = useTransform(progress, [...win(reduce, 0.53, 0.71)], [0, 1], {
    clamp: true,
  });
  const rowsOpacity = useTransform(
    progress,
    [...win(reduce, 0.52, 0.62)],
    [0.6, 1],
    { clamp: true },
  );

  return (
    <ArtifactShell
      label="Build progress"
      accent={VIOLET}
      meta="Phase 03"
      engage={[0.5, 0.63]}
      tintAlpha={0.4}
      washAlpha={0.06}
      reduce={reduce}
      progress={progress}
      footer={
        <ArtifactFooter
          reduce={reduce}
          progress={progress}
          left="Increment 3 · shared for your review"
        />
      }
    >
      <div>
        <div className="flex items-baseline justify-between">
          <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-text-subtle">
            Sprint 3 of 4
          </span>
          <span className="text-[11px] font-medium text-foreground">60%</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-background-subtle">
          <motion.div
            className="h-full w-3/5 rounded-full"
            style={{
              backgroundColor: "rgba(" + VIOLET + ", 0.85)",
              transformOrigin: "left",
              scaleX: barScale,
            }}
          />
        </div>
      </div>
      <motion.div className="flex flex-col gap-3" style={{ opacity: rowsOpacity }}>
        {BUILD_ITEMS.map((item) => (
          <BuildRow
            key={item.name}
            progress={progress}
            reduce={reduce}
            item={item}
          />
        ))}
      </motion.div>
    </ArtifactShell>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PHASE 04 — LAUNCH · LAUNCH CHECKLIST
   The completed state: the four items land in sequence, the live status dot
   activates, and the shell acquires a persistent success treatment that says
   "this is running in production". Nothing loops.
   ─────────────────────────────────────────────────────────────────────────── */

const LAUNCH_ITEMS = [
  { name: "Production", window: [0.76, 0.81] as Win },
  { name: "Domain", window: [0.785, 0.835] as Win },
  { name: "Analytics", window: [0.81, 0.86] as Win },
  { name: "Handover", window: [0.835, 0.885] as Win },
] as const;

function LaunchRow({
  progress,
  reduce,
  name,
  window: rowWindow,
}: {
  progress: MotionValue<number>;
  reduce: boolean;
  name: string;
  window: Win;
}) {
  const w = win(reduce, rowWindow[0], rowWindow[1]);
  const opacity = useTransform(progress, [...w], [0, 1], { clamp: true });
  const scale = useTransform(progress, [...w], [0.92, 1], { clamp: true });

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-foreground sm:text-[13px]">{name}</span>
      <motion.span
        className="flex shrink-0 items-center gap-1.5"
        style={{ opacity, scale }}
      >
        <Check
          aria-hidden
          className="size-3.5"
          strokeWidth={2.5}
          style={{ color: "rgb(" + SUCCESS + ")" }}
        />
        <span className="text-[10px] uppercase tracking-[0.14em] text-text-subtle">
          Done
        </span>
      </motion.span>
    </div>
  );
}

export function LaunchArtifact({ progress }: { progress: MotionValue<number> }) {
  const reduce = Boolean(useReducedMotion());

  return (
    <ArtifactShell
      label="Launch checklist"
      accent={CYAN}
      meta="Phase 04"
      engage={[0.74, 0.88]}
      tintAlpha={0.5}
      washAlpha={0.05}
      reduce={reduce}
      progress={progress}
      completion={{ accent: SUCCESS, window: [0.86, 0.96], alpha: 0.5 }}
      footer={
        <ArtifactFooter
          pulse
          accent={SUCCESS}
          reduce={reduce}
          progress={progress}
          dotWindow={[0.88, 0.94]}
          dotBase={0.3}
          left="Live · yourbusiness.com"
          right="In production"
        />
      }
    >
      {LAUNCH_ITEMS.map((item) => (
        <LaunchRow
          key={item.name}
          progress={progress}
          reduce={reduce}
          name={item.name}
          window={item.window}
        />
      ))}
    </ArtifactShell>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   JOURNEY RAIL — the persistent continuity device. It is NOT crossfaded: it
   spans the whole section, so the visitor always sees one story advancing.
   The fill is a direct readout of scroll position (like a scrollbar) and the
   four numbered ticks light up as their phase is entered — in both directions.
   ────────────────────────────────────────────────────────────────────────── */

const RAIL_TICKS = [
  { label: "01", from: 0.06, to: 0.1 },
  { label: "02", from: 0.26, to: 0.3 },
  { label: "03", from: 0.48, to: 0.52 },
  { label: "04", from: 0.72, to: 0.76 },
] as const;

function RailTick({
  progress,
  label,
  from,
  to,
}: {
  progress: MotionValue<number>;
  label: string;
  from: number;
  to: number;
}) {
  const reduce = Boolean(useReducedMotion());
  const on = useTransform(progress, [...win(reduce, from, to)], [0.3, 1], {
    clamp: true,
  });

  return (
    <motion.span className="flex items-center gap-1" style={{ opacity: on }}>
      <span className="size-1 rounded-full bg-foreground" />
      <span className="text-[9px] font-medium tracking-[0.14em] text-text-subtle">
        {label}
      </span>
    </motion.span>
  );
}

function JourneyRail({ progress }: { progress: MotionValue<number> }) {
  const railScale = useTransform(progress, [0.06, 0.96], [0, 1], {
    clamp: true,
  });

  return (
    <div className="absolute inset-x-0 top-0 flex h-7 items-center gap-3">
      <span className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-background-subtle">
        <motion.span
          className="absolute inset-0 origin-left rounded-full"
          style={{ ...RAIL_GRADIENT, scaleX: railScale }}
        />
      </span>
      <span className="flex shrink-0 items-center gap-2.5">
        {RAIL_TICKS.map((tick) => (
          <RailTick
            key={tick.label}
            progress={progress}
            label={tick.label}
            from={tick.from}
            to={tick.to}
          />
        ))}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PHASE ARTIFACT PANEL

   - One reversible source: every value below is a `useTransform` of the
     section's `scrollYProgress`, so scrolling up reverses the whole narrative.
   - Overlapping crossfades on the 0.28 / 0.50 / 0.74 boundaries with symmetric
     y-drift and micro-scale: the artifacts MORPH into one another instead of
     replacing one another.
   - Depth: two pre-painted shadow layers (one scroll-linked, one triggered once
     by the sticky dock) create the cinematic "landed" moment without animating
     a blur or a filter.
   - No React state, no scroll listener and no re-render during scrolling.
   ─────────────────────────────────────────────────────────────────────────── */

export function PhaseArtifactPanel({
  progress,
  settled = false,
}: {
  progress: MotionValue<number>;
  settled?: boolean;
}) {
  const reduce = Boolean(useReducedMotion());

  const briefOut = win(reduce, CROSS.briefOut[0], CROSS.briefOut[1]);
  const shapeIn = win(reduce, CROSS.shapeIn[0], CROSS.shapeIn[1]);
  const shapeOut = win(reduce, CROSS.shapeOut[0], CROSS.shapeOut[1]);
  const buildIn = win(reduce, CROSS.buildIn[0], CROSS.buildIn[1]);
  const buildOut = win(reduce, CROSS.buildOut[0], CROSS.buildOut[1]);
  const launchIn = win(reduce, CROSS.launchIn[0], CROSS.launchIn[1]);

  const briefOpacity = useTransform(progress, [...briefOut], [1, 0], { clamp: true });
  const shapeOpacity = useTransform(
    progress,
    [...shapeIn, ...shapeOut],
    [0, 1, 1, 0],
    { clamp: true },
  );
  const buildOpacity = useTransform(
    progress,
    [...buildIn, ...buildOut],
    [0, 1, 1, 0],
    { clamp: true },
  );
  const launchOpacity = useTransform(progress, [...launchIn], [0, 1], {
    clamp: true,
  });

  const briefY = useTransform(progress, [...briefOut], [0, -8], { clamp: true });
  const shapeY = useTransform(
    progress,
    [...shapeIn, ...shapeOut],
    [8, 0, 0, -8],
    { clamp: true },
  );
  const buildY = useTransform(
    progress,
    [...buildIn, ...buildOut],
    [8, 0, 0, -8],
    { clamp: true },
  );
  const launchY = useTransform(progress, [...launchIn], [8, 0], { clamp: true });

  const briefScale = useTransform(progress, [...briefOut], [1, 0.992], {
    clamp: true,
  });
  const shapeScale = useTransform(
    progress,
    [...shapeIn, ...shapeOut],
    [0.992, 1, 1, 0.992],
    { clamp: true },
  );
  const buildScale = useTransform(
    progress,
    [...buildIn, ...buildOut],
    [0.992, 1, 1, 0.992],
    { clamp: true },
  );
  const launchScale = useTransform(progress, [...launchIn], [0.992, 1], {
    clamp: true,
  });

  const depthScroll = useTransform(progress, [0.1, 0.32], [0, 0.45], {
    clamp: true,
  });

  const lens = (mv: MotionValue<number>) => (reduce ? 0 : mv);
  const lensScale = (mv: MotionValue<number>) => (reduce ? 1 : mv);

  return (
    <div aria-hidden className="relative h-[24rem] sm:h-[26rem] lg:h-[27rem]">
      <JourneyRail progress={progress} />

      {/* Artifact area — same height the panel had before the rail was added. */}
      <div className="absolute inset-x-0 bottom-0 top-8">
        {/* Depth, scroll-linked. */}
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-xl border border-border-strong bg-card shadow-xl shadow-primary/5"
          style={{ opacity: lens(depthScroll) }}
        />
        {/* Depth, one-shot on sticky dock — the panel "lands". */}
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-xl border border-border-strong bg-card shadow-xl shadow-primary/5"
          initial={false}
          animate={{ opacity: reduce || settled ? 0.25 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
        />

        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={
            reduce || settled
              ? { scale: 1, y: 0, opacity: 1 }
              : { scale: 0.985, y: 6, opacity: 0.94 }
          }
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 120, damping: 20, mass: 1 }
          }
        >
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: briefOpacity,
              y: lens(briefY),
              scale: lensScale(briefScale),
            }}
          >
            <BriefArtifact progress={progress} />
          </motion.div>
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: shapeOpacity,
              y: lens(shapeY),
              scale: lensScale(shapeScale),
            }}
          >
            <StructureArtifact progress={progress} />
          </motion.div>
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: buildOpacity,
              y: lens(buildY),
              scale: lensScale(buildScale),
            }}
          >
            <BuildArtifact progress={progress} />
          </motion.div>
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: launchOpacity,
              y: lens(launchY),
              scale: lensScale(launchScale),
            }}
          >
            <LaunchArtifact progress={progress} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STATE CAPTION — a small editorial status marker (figure-caption language:
   uppercase micro-label + accent dot, no pill/border/badge chrome). Decorative
   redundancy for the active artifact, aria-hidden, driven by the SAME progress
   as the panel and the spine so they can never disagree.
   ─────────────────────────────────────────────────────────────────────────── */
export function CanvasStateCaption({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const reduce = Boolean(useReducedMotion());

  const briefOut = win(reduce, CROSS.briefOut[0], CROSS.briefOut[1]);
  const shapeIn = win(reduce, CROSS.shapeIn[0], CROSS.shapeIn[1]);
  const shapeOut = win(reduce, CROSS.shapeOut[0], CROSS.shapeOut[1]);
  const buildIn = win(reduce, CROSS.buildIn[0], CROSS.buildIn[1]);
  const buildOut = win(reduce, CROSS.buildOut[0], CROSS.buildOut[1]);
  const launchIn = win(reduce, CROSS.launchIn[0], CROSS.launchIn[1]);

  const briefOpacity = useTransform(progress, [...briefOut], [1, 0], { clamp: true });
  const shapeOpacity = useTransform(
    progress,
    [...shapeIn, ...shapeOut],
    [0, 1, 1, 0],
    { clamp: true },
  );
  const buildOpacity = useTransform(
    progress,
    [...buildIn, ...buildOut],
    [0, 1, 1, 0],
    { clamp: true },
  );
  const launchOpacity = useTransform(progress, [...launchIn], [0, 1], {
    clamp: true,
  });

  const states = [
    {
      label: "Project brief",
      dot: "var(--border-strong)",
      opacity: briefOpacity,
    },
    {
      label: "System direction",
      dot: "rgb(" + STAGE_ACCENTS.blue + ")",
      opacity: shapeOpacity,
    },
    {
      label: "Build progress",
      dot: "rgb(" + STAGE_ACCENTS.violet + ")",
      opacity: buildOpacity,
    },
    {
      label: "Live system",
      dot: "rgb(" + STAGE_ACCENTS.success + ")",
      opacity: launchOpacity,
    },
  ];

  return (
    <span aria-hidden className="inline-flex items-center gap-2">
      <span className="relative block h-4 w-32">
        {states.map((state) => (
          <motion.span
            key={state.label}
            className="absolute inset-0 flex items-center gap-2"
            style={{ opacity: state.opacity }}
          >
            <span
              className="size-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: state.dot }}
            />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-subtle">
              {state.label}
            </span>
          </motion.span>
        ))}
      </span>
    </span>
  );
}
