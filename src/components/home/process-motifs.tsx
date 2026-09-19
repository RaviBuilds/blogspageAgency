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
import { Fragment, type ReactNode } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   R9 — PROCESS ARTIFACTS (refinement of the R8 How We Work Experience)

   One presentation surface, four realistic project artifacts. As the visitor
   scrolls the journey the work becomes visibly more concrete at each phase:

     PROJECT BRIEF -> SYSTEM DIRECTION -> BUILD PROGRESS -> LIVE SYSTEM

   The artifacts are assembled from the same UI primitives a client would
   plausibly receive during a real engagement — a discovery brief, a system
   direction map, a reviewable build status and a launch checklist running
   in production. No stock imagery, no fake product screenshots: just the
   existing surface/border/type tokens and the approved stage accents.

   Progress contract (unchanged from R8): the parent owns ONE section-level
   scrollYProgress (MotionValue 0..1) and passes it down; every opacity here
   derives from that single monotonic value across the STAGE_WINDOWS
   boundaries — the same boundaries `process-timeline.tsx` uses for the spine
   fill and stage emphasis — so artifact, spine and stage state can never
   disagree.

   All artifact copy is illustrative sample data. The artifacts are
   decorative (aria-hidden): the phase copy in `process-timeline.tsx`
   carries the meaning; the artifacts show what each deliverable feels like.
   ─────────────────────────────────────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────────────────────────────────────
   ARTIFACT SHELL — the shared window chrome (header band, body, status
   footer) that makes all four artifacts read as one family of real project
   documents rather than four unrelated illustrations.
   ─────────────────────────────────────────────────────────────────────────── */

type ArtifactShellProps = {
  label: string;
  accent: string;
  meta?: string;
  footer: ReactNode;
  children: ReactNode;
};

function ArtifactShell({ label, accent, meta, footer, children }: ArtifactShellProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-border-subtle bg-background-subtle px-4 py-2.5">
        <span className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden
            className="size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: "rgba(" + accent + ", 0.9)" }}
          />
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
}: {
  accent?: string;
  pulse?: boolean;
  left: string;
  right?: string;
}) {
  return (
    <>
      <span className="flex min-w-0 items-center gap-2 text-[11px] text-text-subtle">
        {pulse ? (
          <span
            aria-hidden
            className="size-1.5 shrink-0 animate-pulse rounded-full motion-reduce:animate-none"
            style={
              accent ? { backgroundColor: "rgba(" + accent + ", 0.9)" } : undefined
            }
          />
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
   "We understood the business before writing code." A discovery document:
   the goal, the customer, the problem, the requirements, the success
   criteria — the artifact a real client receives from this phase.
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

export function BriefArtifact() {
  return (
    <ArtifactShell
      label="Project brief"
      accent={CYAN}
      meta="Phase 01"
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

/* ─────────────────────────────────────────────────────────────────────────────
   PHASE 02 — SHAPE · SYSTEM DIRECTION
   The solution is shaped before development begins: the connected layers
   of the system, each with the job it does, agreed before code is written.
   ─────────────────────────────────────────────────────────────────────────── */

const STRUCTURE_NODES = [
  { name: "Website", detail: "How customers find you" },
  { name: "Business system", detail: "Bookings, enquiries, follow-ups" },
  { name: "AI & automation", detail: "Replies and reminders, handled" },
  { name: "Dashboard", detail: "Everything, in one view" },
] as const;

export function StructureArtifact() {
  return (
    <ArtifactShell
      label="System direction"
      accent={BLUE}
      meta="Phase 02"
      footer={<ArtifactFooter left="Direction v1 · approved before build" />}
    >
      {STRUCTURE_NODES.map((node, index) => (
        <Fragment key={node.name}>
          {index > 0 ? (
            <span
              aria-hidden
              className="mx-auto h-2.5 w-px"
              style={{ backgroundColor: "rgba(" + BLUE + ", 0.35)" }}
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
   "You see the product taking shape before the project is finished." A
   lightweight reviewable status surface: sprint progress plus per-area
   state, shared for review as each increment lands.
   ─────────────────────────────────────────────────────────────────────────── */

const BUILD_ITEMS = [
  { name: "Homepage", tag: "Done", state: "done" },
  { name: "Authentication", tag: "Done", state: "done" },
  { name: "Dashboard", tag: "Done", state: "done" },
  { name: "Automation", tag: "In progress", state: "active" },
  { name: "Payments", tag: "Next", state: "next" },
] as const;

type BuildState = (typeof BUILD_ITEMS)[number]["state"];

function BuildStatusGlyph({ state }: { state: BuildState }) {
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
      <span
        aria-hidden
        className="size-2 animate-pulse rounded-full motion-reduce:animate-none"
        style={{ backgroundColor: "rgb(" + VIOLET + ")" }}
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

export function BuildArtifact() {
  return (
    <ArtifactShell
      label="Build progress"
      accent={VIOLET}
      meta="Phase 03"
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
          <div
            className="h-full w-3/5 rounded-full"
            style={{ backgroundColor: "rgba(" + VIOLET + ", 0.8)" }}
          />
        </div>
      </div>
      {BUILD_ITEMS.map((item) => (
        <div key={item.name} className="flex items-center justify-between gap-3">
          <span className="text-xs text-foreground sm:text-[13px]">{item.name}</span>
          <span className="flex shrink-0 items-center gap-1.5">
            <BuildStatusGlyph state={item.state} />
            <span className="text-[10px] uppercase tracking-[0.14em] text-text-subtle">
              {item.tag}
            </span>
          </span>
        </div>
      ))}
    </ArtifactShell>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PHASE 04 — LAUNCH · LAUNCH CHECKLIST
   "Then make the visual feel complete and live": every launch item checked,
   the status footer running in production. The end state of the journey.
   ─────────────────────────────────────────────────────────────────────────── */

const LAUNCH_ITEMS = ["Production", "Domain", "Analytics", "Handover"] as const;

export function LaunchArtifact() {
  return (
    <ArtifactShell
      label="Launch checklist"
      accent={CYAN}
      meta="Phase 04"
      footer={
        <ArtifactFooter
          pulse
          accent={CYAN}
          left="Live · yourbusiness.com"
          right="In production"
        />
      }
    >
      {LAUNCH_ITEMS.map((name) => (
        <div key={name} className="flex items-center justify-between gap-3">
          <span className="text-xs text-foreground sm:text-[13px]">{name}</span>
          <span className="flex shrink-0 items-center gap-1.5">
            <Check
              aria-hidden
              className="size-3.5"
              strokeWidth={2.5}
              style={{ color: "rgb(" + CYAN + ")" }}
            />
            <span className="text-[10px] uppercase tracking-[0.14em] text-text-subtle">
              Done
            </span>
          </span>
        </div>
      ))}
    </ArtifactShell>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PHASE ARTIFACT PANEL — the crossfading stack. Each artifact is always
   mounted (stable DOM, no scroll-time re-renders); only opacity and an 8px
   drift are animated, derived from the SAME monotonic progress as the spine
   and stage emphasis. Reduced motion settles everything to the final LIVE
   artifact (the stage copy carries the full process in text either way).
   ─────────────────────────────────────────────────────────────────────────── */

export function PhaseArtifactPanel({ progress }: { progress: MotionValue<number> }) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const mono = useMonotonicProgress(progress, shouldReduceMotion);

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
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ opacity: briefOpacity, y: briefY }}
      >
        <BriefArtifact />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ opacity: shapeOpacity, y: shapeY }}
      >
        <StructureArtifact />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ opacity: buildOpacity, y: buildY }}
      >
        <BuildArtifact />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ opacity: launchOpacity, y: launchY }}
      >
        <LaunchArtifact />
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
   ─────────────────────────────────────────────────────────────────────────── */
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
