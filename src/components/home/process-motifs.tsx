"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Check } from "lucide-react";
import { Fragment, useState, type ReactNode } from "react";

/* ────────────────────────────────────────────────────────────────────────────
   R10 — PROCESS ARTIFACTS (refinement of the R9 How We Work Experience)

   The four realistic project artifacts (brief -> system direction -> build
   progress -> live system) and their scroll-driven crossfade are unchanged.
   R10 adds the phase-ACTIVATION layer that makes the sticky panel feel like
   a real artifact coming alive as the active phase advances:

   - PhaseArtifactPanel derives ONE discrete activePhase (0..3) from the SAME
     monotonic section progress the spine and stage emphasis use (thresholds
     = STAGE_WINDOWS starts), so artifact state and timeline state can never
     disagree. It re-renders only at phase boundaries (<= 4 per pass).
   - Each artifact receives `active`: undefined = static presentation
     (inline/mobile — renders at rest, no motion); boolean = armed, and the
     shell accent + one-shot inner motion play when the phase becomes active,
     then SETTLE. Nothing loops (the old animate-pulse dots are now finite
     3-cycle flickers / single pops).
   - The accent "color transition" is the opacity of a pre-painted tinted
     border layer — transform/opacity only, GPU-friendly; border-color itself
     is never animated.
   - The panel plays a single 0.985 -> 1 settle spring when the sticky
     wrapper docks (settled comes from the timeline's one-shot dock check).

   Reduced motion: every new animation resolves instantly to its final value;
   phase correctness is preserved (mono settles to 1 -> phase 04 at rest).

   Progress contract (unchanged): the parent owns ONE section-level
   scrollYProgress; every opacity here derives from that single monotonic
   value across the STAGE_WINDOWS boundaries. All artifact copy is
   illustrative sample data; the artifacts are decorative (aria-hidden) —
   the phase copy in `process-timeline.tsx` carries the meaning.
   ────────────────────────────────────────────────────────────────────────── */

/* Approved accent triplets (globals.css tokens; Blueprint §17). */
export const STAGE_ACCENTS = {
  cyan: "14,116,144",
  blue: "67,83,201",
  violet: "124,58,237",
} as const;

/**
 * Section progress windows (Blueprint plan C): entry establishes the BRIEF;
 * each stage owns a window; the LIVE state resolves at the end. Windows are
 * exported so `process-timeline.tsx` drives the spine and stage emphasis
 * from the exact same boundaries.
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
 * Monotonic progress: clamps to the highest value reached so states persist
 * once shown (Blueprint §8/§10 — no reverse churn on fast scroll). Under
 * reduced motion the caller settles this to 1 immediately.
 */
export function useMonotonicProgress(
  progress: MotionValue<number>,
  shouldReduceMotion: boolean,
): MotionValue<number> {
  const settled = useMotionValue(shouldReduceMotion ? 1 : 0);

  useMotionValueEvent(progress, "change", (value) => {
    if (shouldReduceMotion) {
      settled.set(1);
      return;
    }
    if (value > settled.get()) {
      settled.set(value);
    }
  });

  return settled;
}

/**
 * A stage/window "reached" value: 0 before `from`, easing to 1 across the
 * settle span, then clamped at 1 (persist). Derived from the monotonic
 * progress so reached states never regress.
 */
export function useReached(
  monotonic: MotionValue<number>,
  from: number,
  settle = 0.05,
): MotionValue<number> {
  return useTransform(monotonic, [from, Math.min(1, from + settle)], [0, 1], {
    clamp: true,
  });
}

const CYAN = STAGE_ACCENTS.cyan;
const BLUE = STAGE_ACCENTS.blue;
const VIOLET = STAGE_ACCENTS.violet;

/*
 * Crossfade boundaries — each artifact hands over to the next across the
 * stage boundary it belongs to (understand|shape = 0.28, shape|build = 0.5,
 * build|launch = 0.74), so the active artifact always matches the active
 * timeline stage. The values sit just inside those boundaries on purpose.
 */
const FADE = {
  briefOut: [0.25, 0.31],
  shapeIn: [0.25, 0.31],
  shapeOut: [0.47, 0.53],
  buildIn: [0.47, 0.53],
  buildOut: [0.71, 0.77],
  launchIn: [0.71, 0.77],
} as const;

/* Per-phase accent tint alphas for the activation border layer
   (Blueprint §17: restrained, strokes stay <= 0.5). */
const TINT_ALPHA = {
  brief: 0.22,
  shape: 0.32,
  build: 0.42,
  launch: 0.5,
} as const;

/**
 * Shared activation state for one artifact:
 *   armed    — this artifact lives inside the animated panel (desktop); when
 *              `active` is undefined it renders fully at rest with no motion
 *              (this is what keeps the inline/mobile artifacts static).
 *   isActive — the artifact's phase is the currently active one.
 *   reduce   — prefers-reduced-motion: every transition resolves instantly.
 */
function useActivation(active: boolean | undefined) {
  const reduce = Boolean(useReducedMotion());
  const armed = active !== undefined;
  const isActive = armed ? Boolean(active) : true;
  return { reduce, armed, isActive };
}

/* ─────────────────────────────────────────────────────────────────────────────
   ARTIFACT SHELL — the shared window chrome (header band, body, status
   footer). R10: an accent activation layer (pre-painted tinted border whose
   OPACITY animates) and a stacked header status dot (resting faint dot plus
   an accent overlay that fades in and pops ONCE when the phase activates).
   ─────────────────────────────────────────────────────────────────────────── */

type ArtifactShellProps = {
  label: string;
  accent: string;
  meta?: string;
  tintAlpha: number;
  active?: boolean;
  footer: ReactNode;
  children: ReactNode;
};

function ArtifactShell({
  label,
  accent,
  meta,
  tintAlpha,
  active,
  footer,
  children,
}: ArtifactShellProps) {
  const { reduce, armed, isActive } = useActivation(active);

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      {/* Accent activation layer: pre-painted tinted border; only its opacity
          animates (0 -> tintAlpha), one-shot, then it rests. */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{ border: "1.5px solid rgba(" + accent + ", " + tintAlpha + ")" }}
        initial={false}
        animate={{ opacity: armed && isActive ? 1 : 0 }}
        transition={{
          duration: reduce ? 0 : 0.5,
          delay: armed && isActive ? 0.1 : 0,
        }}
      />
      <div className="flex items-center justify-between gap-2 border-b border-border-subtle bg-background-subtle px-4 py-2.5">
        <span className="flex min-w-0 items-center gap-2">
          {/* Status dot activation: resting faint dot + accent overlay that
              pops once (never pulses) when the phase becomes active. */}
          <span
            aria-hidden
            className="relative size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: "rgba(" + accent + ", 0.35)" }}
          >
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: "rgb(" + accent + ")" }}
              initial={false}
              animate={
                armed
                  ? {
                      opacity: isActive ? 1 : 0,
                      scale: isActive && !reduce ? [1, 1.4, 1] : 1,
                    }
                  : { opacity: 1, scale: 1 }
              }
              transition={{
                duration: reduce ? 0 : 0.45,
                delay: armed && isActive ? 0.1 : 0,
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
      <div className="flex flex-1 flex-col justify-center gap-3 px-4 py-4">{children}</div>
      <div className="flex items-center justify-between gap-3 border-t border-border-subtle px-4 py-2.5">
        {footer}
      </div>
    </div>
  );
}

function ArtifactFooter({
  accent,
  pulse = false,
  left,
  right,
  active,
}: {
  accent?: string;
  pulse?: boolean;
  left: string;
  right?: string;
  active?: boolean;
}) {
  const { reduce, armed, isActive } = useActivation(active);
  const pop = Boolean(pulse && armed && isActive && !reduce);

  return (
    <>
      <span className="flex min-w-0 items-center gap-2 text-[11px] text-text-subtle">
        {pulse ? (
          <span
            aria-hidden
            className="relative size-1.5 shrink-0 rounded-full"
            style={
              accent ? { backgroundColor: "rgba(" + accent + ", 0.35)" } : undefined
            }
          >
            <motion.span
              className="absolute inset-0 rounded-full"
              style={
                accent
                  ? { backgroundColor: "rgb(" + accent + ")" }
                  : { backgroundColor: "var(--border-strong)" }
              }
              initial={false}
              animate={
                pop
                  ? { scale: [1, 1.5, 1], opacity: [0.6, 1, 1] }
                  : { scale: 1, opacity: armed && !isActive ? 0 : 1 }
              }
              transition={
                pop
                  ? { duration: 0.5, delay: 0.4 }
                  : { duration: reduce ? 0 : 0.3 }
              }
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
   Mostly neutral visual treatment: the activation is the subtle tint layer
   and the header dot — the brief is already "clear" the moment it appears.
   ─────────────────────────────────────────────────────────────────────────── */

const BRIEF_ROWS = [
  { label: "Goal", value: "More quote-ready enquiries every month" },
  { label: "Customer", value: "Local business owners, mostly on mobile" },
  {
    label: "Problem",
    value: "Enquiries get lost between WhatsApp, calls and email",
  },
  { label: "Needs", value: "Website, booking flow, automatic follow-up" },
  { label: "Success", value: "Every enquiry answered the same day" },
] as const;

export function BriefArtifact({ active }: { active?: boolean }) {
  return (
    <ArtifactShell
      label="Project brief"
      accent={CYAN}
      meta="Phase 01"
      tintAlpha={TINT_ALPHA.brief}
      active={active}
      footer={<ArtifactFooter left="Scope v1 · agreed with you" />}
    >
      {BRIEF_ROWS.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[4.5rem_1fr] gap-3 sm:grid-cols-[5.5rem_1fr]"
        >
          <span className="pt-0.5 text-[10px] font-medium uppercase leading-relaxed tracking-[0.12em] text-text-subtle">
            {row.label}
          </span>
          <span className="text-xs leading-snug text-foreground sm:text-[13px]">
            {row.value}
          </span>
        </div>
      ))}
    </ArtifactShell>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   PHASE 02 — SHAPE · SYSTEM DIRECTION
   Activation: the connectors between Website -> Business system ->
   AI & automation -> Dashboard DRAW once (scaleY, origin top) as the phase
   becomes active — "the solution becomes visible" — then rest.
   ─────────────────────────────────────────────────────────────────────────── */

const STRUCTURE_NODES = [
  { name: "Website", detail: "How customers find you" },
  { name: "Business system", detail: "Bookings, enquiries, follow-ups" },
  { name: "AI & automation", detail: "Replies and reminders, handled" },
  { name: "Dashboard", detail: "Everything, in one view" },
] as const;

export function StructureArtifact({ active }: { active?: boolean }) {
  const { reduce, armed, isActive } = useActivation(active);

  return (
    <ArtifactShell
      label="System direction"
      accent={BLUE}
      meta="Phase 02"
      tintAlpha={TINT_ALPHA.shape}
      active={active}
      footer={<ArtifactFooter left="Direction v1 · approved before build" />}
    >
      {STRUCTURE_NODES.map((node, index) => (
        <Fragment key={node.name}>
          {index > 0 ? (
            <motion.span
              aria-hidden
              className="mx-auto h-2.5 w-px"
              style={{
                backgroundColor: "rgba(" + BLUE + ", 0.35)",
                transformOrigin: "top",
              }}
              initial={{ scaleY: armed ? 0 : 1 }}
              animate={{ scaleY: !armed || isActive ? 1 : 0 }}
              transition={{
                duration: reduce ? 0 : 0.3,
                delay: armed && isActive ? 0.2 + (index - 1) * 0.08 : 0,
              }}
            />
          ) : null}
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border-subtle bg-background px-3 py-2.5">
            <span className="text-xs font-medium text-foreground sm:text-[13px]">
              {node.name}
            </span>
            <span className="truncate text-[11px] text-muted-foreground">
              {node.detail}
            </span>
          </div>
        </Fragment>
      ))}
    </ArtifactShell>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PHASE 03 — BUILD · BUILD PROGRESS
   Activation: the sprint bar fills (scaleX, origin left), the checklist rows
   ease in with a short stagger, and the in-progress dot flickers a FINITE
   three cycles (then rests) — activity, never a permanent pulse.
   ─────────────────────────────────────────────────────────────────────────── */

const BUILD_ITEMS = [
  { name: "Homepage", tag: "Done", state: "done" },
  { name: "Authentication", tag: "Done", state: "done" },
  { name: "Dashboard", tag: "Done", state: "done" },
  { name: "Automation", tag: "In progress", state: "active" },
  { name: "Payments", tag: "Next", state: "next" },
] as const;

type BuildState = (typeof BUILD_ITEMS)[number]["state"];

function BuildStatusGlyph({
  state,
  flicker,
}: {
  state: BuildState;
  flicker: boolean;
}) {
  if (state === "done") {
    return (
      <Check
        aria-hidden
        className="size-3.5"
        strokeWidth={2.5}
        style={{ color: "rgb(" + VIOLET + ")" }}
      />
    );
  }
  if (state === "active") {
    return (
      <motion.span
        aria-hidden
        className="size-2 rounded-full"
        style={{ backgroundColor: "rgb(" + VIOLET + ")" }}
        initial={false}
        animate={flicker ? { opacity: [1, 0.3, 1, 0.3, 1] } : { opacity: 1 }}
        transition={
          flicker
            ? { duration: 0.8, repeat: 2, repeatDelay: 0.25, delay: 0.45 }
            : { duration: 0.3 }
        }
      />
    );
  }
  return (
    <span
      aria-hidden
      className="size-2 rounded-full border-[1.5px]"
      style={{ borderColor: "var(--border-strong)" }}
    />
  );
}

export function BuildArtifact({ active }: { active?: boolean }) {
  const { reduce, armed, isActive } = useActivation(active);
  const flicker = armed && isActive && !reduce;

  return (
    <ArtifactShell
      label="Build progress"
      accent={VIOLET}
      meta="Phase 03"
      tintAlpha={TINT_ALPHA.build}
      active={active}
      footer={<ArtifactFooter left="Increment 3 · shared for your review" />}
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
              backgroundColor: "rgba(" + VIOLET + ", 0.8)",
              transformOrigin: "left",
            }}
            initial={{ scaleX: armed ? 0 : 1 }}
            animate={{ scaleX: !armed || isActive ? 1 : 0 }}
            transition={{
              duration: reduce ? 0 : 0.5,
              delay: armed && isActive ? 0.25 : 0,
            }}
          />
        </div>
      </div>
      {BUILD_ITEMS.map((item, index) => (
        <motion.div
          key={item.name}
          className="flex items-center justify-between gap-3"
          initial={false}
          animate={{ opacity: armed && !isActive ? 0.55 : 1 }}
          transition={{
            duration: reduce ? 0 : 0.35,
            delay: armed && isActive ? 0.15 + index * 0.05 : 0,
          }}
        >
          <span className="text-xs text-foreground sm:text-[13px]">{item.name}</span>
          <span className="flex shrink-0 items-center gap-1.5">
            <BuildStatusGlyph state={item.state} flicker={flicker} />
            <span className="text-[10px] uppercase tracking-[0.14em] text-text-subtle">
              {item.tag}
            </span>
          </span>
        </motion.div>
      ))}
    </ArtifactShell>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PHASE 04 — LAUNCH · LAUNCH CHECKLIST
   Activation: each check springs in with a short stagger (the system becoming
   ready), the live-status dot pops ONCE, and the shell keeps a persistent
   (never looping) cyan tint — the completed state stays lit.
   ─────────────────────────────────────────────────────────────────────────── */

const LAUNCH_ITEMS = ["Production", "Domain", "Analytics", "Handover"] as const;

export function LaunchArtifact({ active }: { active?: boolean }) {
  const { reduce, armed, isActive } = useActivation(active);
  const on = !armed || isActive;
  const stagger = armed && isActive && !reduce;

  return (
    <ArtifactShell
      label="Launch checklist"
      accent={CYAN}
      meta="Phase 04"
      tintAlpha={TINT_ALPHA.launch}
      active={active}
      footer={
        <ArtifactFooter
          pulse
          accent={CYAN}
          active={active}
          left="Live · yourbusiness.com"
          right="In production"
        />
      }
    >
      {LAUNCH_ITEMS.map((name, index) => (
        <div key={name} className="flex items-center justify-between gap-3">
          <span className="text-xs text-foreground sm:text-[13px]">{name}</span>
          <motion.span
            className="flex shrink-0 items-center gap-1.5"
            initial={false}
            animate={
              stagger
                ? { opacity: [0, 1], scale: [0.6, 1] }
                : { opacity: on ? 1 : 0.55, scale: 1 }
            }
            transition={{
              duration: reduce ? 0 : 0.32,
              delay: stagger ? 0.18 + index * 0.07 : 0,
            }}
          >
            <Check
              aria-hidden
              className="size-3.5"
              strokeWidth={2.5}
              style={{ color: "rgb(" + CYAN + ")" }}
            />
            <span className="text-[10px] uppercase tracking-[0.14em] text-text-subtle">
              Done
            </span>
          </motion.span>
        </div>
      ))}
    </ArtifactShell>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PHASE ARTIFACT PANEL — the crossfading stack. Each artifact is always
   mounted (stable DOM, no scroll-time re-renders); opacity crossfades derive
   from the SAME monotonic progress as the spine and stage emphasis.

   R10 additions:
   - activePhase: ONE discrete 0..3 state derived from that same monotonic
     value at the STAGE_WINDOWS starts. Lazy-initialised from mono.get() so a
     reduced-motion session (mono starts at 1) lands on phase 04 immediately.
     Forward-only: phases never regress. Re-renders only at boundaries.
   - Panel settle: a single 0.985 -> 1 / y 6 -> 0 / opacity 0.94 -> 1 spring
     when the sticky wrapper docks (`settled`, one-shot from the timeline).
     Under reduced motion the panel renders at rest immediately.
   ─────────────────────────────────────────────────────────────────────────── */

function phaseFromProgress(value: number): number {
  if (value >= STAGE_WINDOWS.launch[0]) return 3;
  if (value >= STAGE_WINDOWS.build[0]) return 2;
  if (value >= STAGE_WINDOWS.shape[0]) return 1;
  return 0;
}

const SPRING_SETTLE = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 1,
} as const;

export function PhaseArtifactPanel({
  progress,
  settled = false,
}: {
  progress: MotionValue<number>;
  settled?: boolean;
}) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const mono = useMonotonicProgress(progress, shouldReduceMotion);

  const [activePhase, setActivePhase] = useState(() => phaseFromProgress(mono.get()));

  useMotionValueEvent(mono, "change", (value) => {
    setActivePhase((prev) => {
      const next = phaseFromProgress(value);
      return next > prev ? next : prev;
    });
  });

  const briefOpacity = useTransform(mono, [...FADE.briefOut], [1, 0], { clamp: true });
  const briefY = useTransform(mono, [...FADE.briefOut], [0, -8], { clamp: true });
  const shapeOpacity = useTransform(
    mono,
    [...FADE.shapeIn, ...FADE.shapeOut],
    [0, 1, 1, 0],
    { clamp: true },
  );
  const shapeY = useTransform(
    mono,
    [...FADE.shapeIn, ...FADE.shapeOut],
    [8, 0, 0, -8],
    { clamp: true },
  );
  const buildOpacity = useTransform(
    mono,
    [...FADE.buildIn, ...FADE.buildOut],
    [0, 1, 1, 0],
    { clamp: true },
  );
  const buildY = useTransform(
    mono,
    [...FADE.buildIn, ...FADE.buildOut],
    [8, 0, 0, -8],
    { clamp: true },
  );
  const launchOpacity = useTransform(mono, [...FADE.launchIn], [0, 1], { clamp: true });
  const launchY = useTransform(mono, [...FADE.launchIn], [8, 0], { clamp: true });

  return (
    <div aria-hidden className="relative h-[22rem] sm:h-[24rem] lg:h-[25rem]">
      {/* One-shot settle wrapper (R10): docks once, then rests. */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={
          shouldReduceMotion || settled
            ? { scale: 1, y: 0, opacity: 1 }
            : { scale: 0.985, y: 6, opacity: 0.94 }
        }
        transition={shouldReduceMotion ? { duration: 0 } : SPRING_SETTLE}
      >
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: briefOpacity, y: briefY }}
        >
          <BriefArtifact active={settled ? activePhase === 0 : undefined} />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: shapeOpacity, y: shapeY }}
        >
          <StructureArtifact active={activePhase === 1} />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: buildOpacity, y: buildY }}
        >
          <BuildArtifact active={activePhase === 2} />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ opacity: launchOpacity, y: launchY }}
        >
          <LaunchArtifact active={activePhase === 3} />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STATE CAPTION — a small editorial status marker (figure-caption language:
   uppercase micro-label + accent dot, no pill/border/badge chrome). It is
   decorative redundancy for the active artifact, aria-hidden, driven by the
   SAME monotonic progress as the panel and spine so they can never
   disagree. Reduced motion resolves it to the LIVE SYSTEM caption.
   ────────────────────────────────────────────────────────────────────────── */
export function CanvasStateCaption({
  monotonic,
}: {
  monotonic: MotionValue<number>;
}) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const mono = useMonotonicProgress(monotonic, shouldReduceMotion);

  const briefOpacity = useTransform(mono, [...FADE.briefOut], [1, 0], { clamp: true });
  const shapeOpacity = useTransform(
    mono,
    [...FADE.shapeIn, ...FADE.shapeOut],
    [0, 1, 1, 0],
    { clamp: true },
  );
  const buildOpacity = useTransform(
    mono,
    [...FADE.buildIn, ...FADE.buildOut],
    [0, 1, 1, 0],
    { clamp: true },
  );
  const launchOpacity = useTransform(mono, [...FADE.launchIn], [0, 1], {
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
      dot: "rgb(" + STAGE_ACCENTS.cyan + ")",
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
