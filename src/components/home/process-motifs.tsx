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

export function TransformationCanvas({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const mono = useMonotonicProgress(progress, shouldReduceMotion);

  /* State opacities -- each emerges inside its stage window, then persists. */
  const understoodOpacity = useReached(mono, 0.1);
  const shapedOpacity = useReached(mono, 0.32);
  const builtOpacity = useReached(mono, 0.54);
  const liveOpacity = useReached(mono, 0.76);
  const ringOpacity = useReached(mono, 0.9, 0.1);

  /* The BRIEF scatter resolves (dims) as SHAPE brings order. */
  const scatterOpacity = useTransform(mono, [0.32, 0.44], [1, 0.15], {
    clamp: true,
  });

  /* One shared sheet transform across the whole journey -- the continuity cue. */
  const sheetY = useTransform(mono, [0, 1], [0, -8]);
  const sheetRotate = useTransform(mono, [0, 1], [0, -1.2]);

  /* The LIVE customer dot travels outward from the interface window. */
  const dotX = useTransform(mono, [0.8, 0.98], [236, 322]);

  return (
    <div aria-hidden className="relative">
      <svg
        viewBox="0 0 400 320"
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
            y="36"
            width="280"
            height="232"
            rx="14"
            style={{ fill: "var(--card)", stroke: "var(--border)" }}
            strokeWidth="1.5"
          />
        </motion.g>

        {/* BRIEF -- the unstructured problem: scattered strokes. */}
        <motion.g style={{ opacity: scatterOpacity }}>
          <line x1="95" y1="92" x2="182" y2="88" style={{ stroke: "var(--border-strong)" }} strokeWidth="2" strokeLinecap="round" />
          <line x1="112" y1="122" x2="236" y2="119" style={{ stroke: "var(--border-strong)" }} strokeWidth="2" strokeLinecap="round" />
          <line x1="96" y1="152" x2="204" y2="155" style={{ stroke: "var(--border-strong)" }} strokeWidth="2" strokeLinecap="round" />
          <line x1="124" y1="182" x2="262" y2="179" style={{ stroke: "var(--border-strong)" }} strokeWidth="2" strokeLinecap="round" />
          <line x1="102" y1="212" x2="194" y2="208" style={{ stroke: "var(--border-strong)" }} strokeWidth="2" strokeLinecap="round" />
        </motion.g>

        {/* UNDERSTOOD (cyan) -- the business mapped: annotation + customers. */}
        <motion.g style={{ opacity: understoodOpacity }}>
          <ellipse cx="142" cy="102" rx="58" ry="22" style={{ stroke: "rgba(" + CYAN + ", 0.55)" }} strokeWidth="1.5" />
          <circle cx="298" cy="108" r="4" style={{ fill: "rgba(" + CYAN + ", 0.75)" }} />
          <circle cx="284" cy="134" r="4" style={{ fill: "rgba(" + CYAN + ", 0.55)" }} />
          <circle cx="308" cy="158" r="4" style={{ fill: "rgba(" + CYAN + ", 0.65)" }} />
          <line x1="96" y1="236" x2="158" y2="234" style={{ stroke: "rgba(" + CYAN + ", 0.5)" }} strokeWidth="2" strokeLinecap="round" />
        </motion.g>

        {/* SHAPED (blue) -- loose ideas resolve onto a grid: the plan. */}
        <motion.g style={{ opacity: shapedOpacity }}>
          <line x1="140" y1="56" x2="140" y2="252" style={{ stroke: "rgba(" + BLUE + ", 0.18)" }} strokeWidth="1" />
          <line x1="200" y1="56" x2="200" y2="252" style={{ stroke: "rgba(" + BLUE + ", 0.18)" }} strokeWidth="1" />
          <line x1="260" y1="56" x2="260" y2="252" style={{ stroke: "rgba(" + BLUE + ", 0.18)" }} strokeWidth="1" />
          <rect x="82" y="84" width="112" height="22" rx="4" style={{ stroke: "rgba(" + BLUE + ", 0.6)" }} strokeWidth="1.5" />
          <rect x="82" y="118" width="152" height="22" rx="4" style={{ stroke: "rgba(" + BLUE + ", 0.45)" }} strokeWidth="1.5" />
          <rect x="82" y="152" width="92" height="22" rx="4" style={{ stroke: "rgba(" + BLUE + ", 0.6)" }} strokeWidth="1.5" />
        </motion.g>

        {/* BUILT (blue + violet) -- surfaces assemble: the working product. */}
        <motion.g style={{ opacity: builtOpacity }}>
          <rect x="122" y="118" width="182" height="116" rx="10" style={{ fill: "rgba(" + VIOLET + ", 0.05)", stroke: "rgba(" + VIOLET + ", 0.6)" }} strokeWidth="1.5" />
          <rect x="138" y="136" width="94" height="16" rx="4" style={{ stroke: "rgba(" + BLUE + ", 0.55)" }} strokeWidth="1.5" />
          <rect x="138" y="162" width="126" height="16" rx="4" style={{ stroke: "rgba(" + BLUE + ", 0.4)" }} strokeWidth="1.5" />
          <rect x="272" y="136" width="16" height="78" rx="4" style={{ stroke: "rgba(" + VIOLET + ", 0.5)" }} strokeWidth="1.5" />
          <line x1="138" y1="204" x2="214" y2="204" style={{ stroke: "rgba(" + VIOLET + ", 0.55)" }} strokeWidth="2" strokeLinecap="round" />
        </motion.g>

        {/* LIVE (cyan + blue) -- the deployed window, one calm signal ring,
            and a customer dot arriving from outside. */}
        <motion.g style={{ opacity: liveOpacity }}>
          <motion.circle
            cx="296"
            cy="150"
            r="24"
            style={{
              stroke: "rgba(" + CYAN + ", 0.6)",
              scale: ringOpacity,
              opacity: ringOpacity,
            }}
            strokeWidth="1.5"
          />
          <motion.circle
            cx="0"
            cy="150"
            r="5"
            style={{
              x: dotX,
              fill: "rgba(" + CYAN + ", 0.85)",
              opacity: liveOpacity,
            }}
          />
          <line x1="138" y1="204" x2="214" y2="204" style={{ stroke: "rgba(" + CYAN + ", 0.65)" }} strokeWidth="2" strokeLinecap="round" />
        </motion.g>
      </svg>
    </div>
  );
}
