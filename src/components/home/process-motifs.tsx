"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   R8 — TRANSFORMATION CANVAS (Blueprint: R8 How We Work Experience v1.0 §6-8)

   One continuous visual subject -- a plain business brief -- morphs through
   five canonical states as the visitor moves through the four stages:

     BRIEF (problem) -> UNDERSTOOD -> SHAPED -> BUILT -> LIVE

   The sheet primitives persist across every state so the continuity of the
   transformation is visible; per-state elements emerge inside their stage's
   progress window and persist once reached (monotonic progress -- no reverse
   churn on fast scroll). The whole canvas is decorative (aria-hidden): the
   stage copy in `process-timeline.tsx` carries all meaning on its own.

   Progress contract: the parent owns ONE section-level scrollYProgress
   (MotionValue 0..1) and passes it down; every visual here derives from that
   single value (Blueprint §8: never independent animations).
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
 * once shown (Blueprint §8/§10 -- no reverse churn on fast scroll). Under
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

/* ─────────────────────────────────────────────────────────────────────────────
   TRANSFORMATION CANVAS
   One SVG composition; five state-groups layered over persistent sheet
   primitives. Each state fades in inside its stage window (monotonic) and
   persists. Decorative: the root is aria-hidden and every shape inherits it.
   ─────────────────────────────────────────────────────────────────────────── */

const CYAN = STAGE_ACCENTS.cyan;
const BLUE = STAGE_ACCENTS.blue;
const VIOLET = STAGE_ACCENTS.violet;
const INK = "var(--border-strong)";
const HAIR = "var(--border-subtle)";

export function TransformationCanvas({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const mono = useMonotonicProgress(progress, shouldReduceMotion);

  /* Dominant-state contrast (R8.1): each state rises inside its stage
     window, then settles to a faint TRACE when the next state completes --
     except LIVE (full) and the BUILT interface (near-full, it is LIVE's
     substrate). At any scroll position exactly ONE state is the figure;
     history is a ghost. Monotonic input = no reverse churn. */
  const understoodOpacity = useTransform(
    mono,
    [0.1, 0.16, 0.32, 0.38],
    [0, 1, 1, 0.22],
    { clamp: true },
  );
  const shapedOpacity = useTransform(
    mono,
    [0.32, 0.38, 0.54, 0.6],
    [0, 1, 1, 0.22],
    { clamp: true },
  );
  const builtOpacity = useTransform(
    mono,
    [0.54, 0.6, 0.9, 0.96],
    [0, 1, 1, 0.9],
    { clamp: true },
  );
  const liveOpacity = useTransform(mono, [0.76, 0.82], [0, 1], { clamp: true });
  const ringOpacity = useReached(mono, 0.9, 0.1);

  /* The BRIEF notes resolve (dim) as SHAPE brings order. */
  const scatterOpacity = useTransform(mono, [0.32, 0.44], [1, 0.22], {
    clamp: true,
  });

  /* One shared sheet transform across the whole journey -- the continuity
     cue (strengthened in R8.1 so it is actually perceptible). */
  const sheetY = useTransform(mono, [0, 1], [0, -10]);
  const sheetRotate = useTransform(mono, [0, 1], [0, -1.5]);

  /* LIVE details: border tint on the sheet + customer dot travel. */
  const liveBorder = useReached(mono, 0.9, 0.1);
  const dotX = useTransform(mono, [0.8, 0.98], [236, 322]);

  return (
    <div aria-hidden className="relative">
      <svg
        viewBox="0 0 400 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-full"
        focusable="false"
      >
        {/* Persistent sheet -- the business brief. The one subject that never
            changes identity across states. */}
        <motion.g style={{ y: sheetY, rotate: sheetRotate }}>
          <rect
            x="60"
            y="48"
            width="280"
            height="264"
            rx="14"
            style={{ fill: "var(--card)", stroke: "var(--border)" }}
            strokeWidth="1.5"
          />
          {/* LIVE border tint: the artifact itself goes live. */}
          <motion.rect
            x="60"
            y="48"
            width="280"
            height="264"
            rx="14"
            style={{
              stroke: "rgba(" + CYAN + ", 0.45)",
              opacity: liveBorder,
            }}
            strokeWidth="1.5"
          />
          {/* Document header band (sheet furniture, always present). */}
          <rect x="60" y="48" width="280" height="20" rx="14" style={{ fill: "var(--background-subtle)" }} />
        </motion.g>

        {/* BRIEF -- a real, dense business brief: title, notes, margins. */}
        <motion.g style={{ opacity: scatterOpacity }}>
          <line x1="84" y1="92" x2="210" y2="92" style={{ stroke: INK }} strokeWidth="3" strokeLinecap="round" />
          <line x1="84" y1="116" x2="196" y2="116" style={{ stroke: HAIR }} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="84" y1="136" x2="252" y2="136" style={{ stroke: HAIR }} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="84" y1="156" x2="228" y2="156" style={{ stroke: HAIR }} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="84" y1="176" x2="264" y2="176" style={{ stroke: HAIR }} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="84" y1="196" x2="188" y2="196" style={{ stroke: HAIR }} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="84" y1="216" x2="240" y2="216" style={{ stroke: HAIR }} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="322" y1="116" x2="322" y2="132" style={{ stroke: HAIR }} strokeWidth="2" strokeLinecap="round" />
          <line x1="322" y1="156" x2="322" y2="168" style={{ stroke: HAIR }} strokeWidth="2" strokeLinecap="round" />
        </motion.g>

        {/* UNDERSTOOD (cyan) -- signals organized: highlights, brackets and
            customer relationships drawn onto the same brief. */}
        <motion.g style={{ opacity: understoodOpacity }}>
          <path d="M78 108 h-8 v40 h8" style={{ stroke: CYAN + "0.55)" }} strokeWidth="1.5" strokeLinecap="round" />
          <rect x="84" y="121" width="64" height="6" rx="3" style={{ fill: CYAN + "0.18)" }} />
          <rect x="84" y="141" width="84" height="6" rx="3" style={{ fill: CYAN + "0.14)" }} />
          <circle cx="298" cy="120" r="4" style={{ fill: CYAN + "0.75)" }} />
          <circle cx="284" cy="144" r="4" style={{ fill: CYAN + "0.55)" }} />
          <circle cx="308" cy="164" r="4" style={{ fill: CYAN + "0.65)" }} />
          <path d="M298 124 Q306 140 288 148" style={{ stroke: CYAN + "0.4)" }} strokeWidth="1.25" />
          <path d="M316 118 l5 5 10 -11" style={{ stroke: CYAN + "0.8)" }} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>


        {/* SHAPED (blue) -- the notes snap onto a grid: structure emerging. */}
        <motion.g style={{ opacity: shapedOpacity }}>
          <line x1="140" y1="56" x2="140" y2="304" style={{ stroke: BLUE + "0.18)" }} strokeWidth="1" />
          <line x1="200" y1="56" x2="200" y2="304" style={{ stroke: BLUE + "0.18)" }} strokeWidth="1" />
          <line x1="260" y1="56" x2="260" y2="304" style={{ stroke: BLUE + "0.18)" }} strokeWidth="1" />
          <rect x="84" y="96" width="112" height="22" rx="4" style={{ fill: BLUE + "0.12)", stroke: BLUE + "0.6)" }} strokeWidth="1.5" />
          <rect x="84" y="130" width="152" height="22" rx="4" style={{ stroke: BLUE + "0.45)" }} strokeWidth="1.5" />
          <rect x="84" y="164" width="92" height="22" rx="4" style={{ stroke: BLUE + "0.6)" }} strokeWidth="1.5" />
          <path d="M74 90 v96 h10" style={{ stroke: BLUE + "0.35)" }} strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>

        {/* BUILT (blue + violet) -- filled, layered interface surfaces: the
            working product. Stays near-full as LIVE's substrate. */}
        <motion.g style={{ opacity: builtOpacity }}>
          <rect x="130" y="148" width="182" height="140" rx="10" style={{ stroke: HAIR }} strokeWidth="1" />
          <rect x="122" y="140" width="182" height="140" rx="10" style={{ fill: VIOLET + "0.05)", stroke: VIOLET + "0.6)" }} strokeWidth="1.5" />
          <rect x="122" y="140" width="182" height="26" rx="10" style={{ fill: VIOLET + "0.1)" }} />
          <rect x="138" y="178" width="94" height="40" rx="4" style={{ fill: BLUE + "0.08)", stroke: BLUE + "0.45)" }} strokeWidth="1.25" />
          <rect x="138" y="228" width="94" height="32" rx="4" style={{ fill: BLUE + "0.05)", stroke: BLUE + "0.35)" }} strokeWidth="1.25" />
          <rect x="272" y="174" width="16" height="92" rx="4" style={{ stroke: VIOLET + "0.5)" }} strokeWidth="1.25" />
          <line x1="138" y1="272" x2="240" y2="272" style={{ stroke: VIOLET + "0.55)" }} strokeWidth="2" strokeLinecap="round" />
        </motion.g>

        {/* LIVE (cyan + blue) -- visibly active: status, address bar, signal
            ring completing, customer dot arriving. */}
        <motion.g style={{ opacity: liveOpacity }}>
          <circle cx="134" cy="153" r="3.5" style={{ fill: CYAN + "0.9)" }} />
          <rect x="146" y="146" width="84" height="13" rx="6" style={{ fill: CYAN + "0.1)" }} />
          <line x1="152" y1="152" x2="196" y2="152" style={{ stroke: CYAN + "0.5)" }} strokeWidth="1.5" strokeLinecap="round" />
          <motion.circle
            cx="296"
            cy="180"
            r="24"
            style={{
              stroke: CYAN + "0.6)",
              scale: ringOpacity,
              opacity: ringOpacity,
            }}
            strokeWidth="1.5"
          />
          <motion.circle
            cx="0"
            cy="180"
            r="5"
            style={{
              x: dotX,
              fill: CYAN + "0.85)",
              opacity: liveOpacity,
            }}
          />
          <line x1="138" y1="268" x2="214" y2="268" style={{ stroke: CYAN + "0.65)" }} strokeWidth="2" strokeLinecap="round" />
        </motion.g>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STATE CAPTION — a small editorial status marker (figure-caption language:
   uppercase micro-label + accent dot, no pill/border/badge chrome). It is
   decorative redundancy for the canvas state, aria-hidden, driven by the
   SAME monotonic progress as the canvas and spine so they can never
   disagree. Reduced motion resolves it to the LIVE caption.
   ─────────────────────────────────────────────────────────────────────────── */
export function CanvasStateCaption({
  monotonic,
}: {
  monotonic: MotionValue<number>;
}) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const mono = useMonotonicProgress(monotonic, shouldReduceMotion);

  const briefOpacity = useTransform(mono, [0.1, 0.16], [1, 0], { clamp: true });
  const understandOpacity = useTransform(
    mono,
    [0.1, 0.16, 0.32, 0.38],
    [0, 1, 1, 0],
    { clamp: true },
  );
  const shapeOpacity = useTransform(
    mono,
    [0.32, 0.38, 0.54, 0.6],
    [0, 1, 1, 0],
    { clamp: true },
  );
  const buildOpacity = useTransform(
    mono,
    [0.54, 0.6, 0.76, 0.82],
    [0, 1, 1, 0],
    { clamp: true },
  );
  const liveOpacity = useTransform(mono, [0.76, 0.82], [0, 1], { clamp: true });

  const states = [
    {
      label: "Brief",
      dot: "var(--border-strong)",
      opacity: briefOpacity,
    },
    {
      label: "Understand",
      dot: "rgb(" + STAGE_ACCENTS.cyan + ")",
      opacity: understandOpacity,
    },
    {
      label: "Shape",
      dot: "rgb(" + STAGE_ACCENTS.blue + ")",
      opacity: shapeOpacity,
    },
    {
      label: "Build",
      dot: "rgb(" + STAGE_ACCENTS.violet + ")",
      opacity: buildOpacity,
    },
    {
      label: "Live",
      dot: "rgb(" + STAGE_ACCENTS.cyan + ")",
      opacity: liveOpacity,
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
