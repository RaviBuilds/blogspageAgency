"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { useMotionReady } from "@/components/home/progress-reveal";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   R6 / R6.1 / R9 — SystemFlow

   The single signal language shared by all three flagship chapters
   (ArogyaDiet operations, Phixl pipeline, NeoDent presence chain):
   one connector style, one node style, one motion quality, one line weight —
   while each project's meaning stays its own.

   Architecture:
   - The node chips ARE the accessible content (DOM order = story order);
     the SVG connectors and the one-time travel signal are decorative only
     (`aria-hidden`; no meaning is carried by the animation layer).
   - R9: motion is scroll-driven. The parent story hands down its own scroll
     progress; each node reveals and each connector draws within its own
     slice of that progress, so the chain assembles while the chapter scrolls
     into view — and un-assembles in exactly the reverse order when scrolling
     back up. Transforms / opacity / SVG pathLength only — no canvas, no
     continuous animation.
   - The one-time travel signal is a decorative flourish, not narrative
     state: it plays exactly once once the chain is mostly assembled, then
     rests invisible. It never plays under reduced motion.
   - Reduced motion: the parent passes a settled progress, so nodes and
     drawn connectors appear immediately as the complete composition.

   Pure presentation: no data, no routes, no tracking.
   ──────────────────────────────────────────────────────────────────────────── */

/* Node/connector choreography windows — fractions of the flow's progress. */
const NODE_WINDOW = 0.14;
const NODE_BASE = 0.06;
const NODE_TRAVEL = 0.62;
const CONNECTOR_LEAD = 0.09;
const SIGNAL_AT = 0.55;

function nodeWindow(index: number, total: number): [number, number] {
  const safeTotal = Math.max(total, 1);
  const start = NODE_BASE + (index / safeTotal) * NODE_TRAVEL;
  return [start, Math.min(start + NODE_WINDOW, 1)];
}

function connectorWindow(index: number, total: number): [number, number] {
  const [nodeStart] = nodeWindow(index, total);
  return [Math.max(nodeStart - CONNECTOR_LEAD, 0), nodeStart];
}

/* The travel signal: one soft accent band crosses the finished chain and
   fades. The final keyframe is invisible, so the settled state stays quiet.
   `x`/`y` percentages resolve against the signal's own full-cover box, so
   the sweep always spans the whole chain regardless of chain length. */
const travelX: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 1, 1, 0],
    x: ["-100%", "100%"],
    transition: { delay: 1.15, duration: 1.4, ease: "easeInOut", times: [0, 0.2, 0.8, 1] },
  },
};

const travelY: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 1, 1, 0],
    y: ["-100%", "100%"],
    transition: { delay: 1.15, duration: 1.4, ease: "easeInOut", times: [0, 0.2, 0.8, 1] },
  },
};

function FlowNode({
  label,
  accent,
  index,
  total,
  progress,
}: {
  label: string;
  accent: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const ready = useMotionReady();
  const [from, to] = nodeWindow(index, total);
  const opacity = useTransform(progress, [from, to], [0, 1], { clamp: true });
  const y = useTransform(progress, [from, to], [10, 0], { clamp: true });

  const staticStyle = {
    borderColor: `rgba(${accent}, 0.28)`,
    backgroundColor: `rgba(${accent}, 0.06)`,
  };

  return (
    <motion.span
      className="rounded-md border px-2.5 py-1 text-xs font-medium text-muted-foreground"
      style={ready ? { ...staticStyle, opacity, y } : staticStyle}
    >
      {label}
    </motion.span>
  );
}

function ConnectorVertical({
  accent,
  progress,
  range,
}: {
  accent: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const stroke = `rgba(${accent}, 0.5)`;
  const pathLength = useTransform(progress, range, [0, 1], { clamp: true });
  const headOpacity = useTransform(
    progress,
    [Math.max(range[1] - 0.04, 0), Math.min(range[1] + 0.02, 1)],
    [0, 1],
    { clamp: true },
  );
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 12 24"
      className="ml-4 h-5 w-3"
      fill="none"
    >
      <motion.path
        d="M6 1 V19"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{ pathLength }}
      />
      <motion.path
        d="M2.5 15.5 L6 19.5 L9.5 15.5"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: headOpacity }}
      />
    </motion.svg>
  );
}

function ConnectorHorizontal({
  accent,
  progress,
  range,
}: {
  accent: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const stroke = `rgba(${accent}, 0.5)`;
  const pathLength = useTransform(progress, range, [0, 1], { clamp: true });
  const headOpacity = useTransform(
    progress,
    [Math.max(range[1] - 0.04, 0), Math.min(range[1] + 0.02, 1)],
    [0, 1],
    { clamp: true },
  );
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 24 12"
      className="h-3 w-5 shrink-0"
      fill="none"
    >
      <motion.path
        d="M1 6 H19"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{ pathLength }}
      />
      <motion.path
        d="M15.5 2.5 L19.5 6 L15.5 9.5"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: headOpacity }}
      />
    </motion.svg>
  );
}

export function SystemFlow({
  steps,
  orientation,
  accent,
  className,
  progress,
}: {
  /** Business-readable system steps (the project's `visualSequence`). */
  steps: string[];
  /** "vertical" stacks the chain beside itself; "horizontal" flows across. */
  orientation: "vertical" | "horizontal";
  /** Raw `r,g,b` accent triple matching the project card system. */
  accent: string;
  className?: string;
  /** The parent story's scroll progress (0–1). Required — the chain's
      assembly is a slice of it, so it reverses with the scroll. */
  progress: MotionValue<number>;
}) {
  const shouldReduceMotion = useReducedMotion();
  const settled = useMotionValue(1);
  const effective = shouldReduceMotion ? settled : progress;

  /* One-time travel signal: fires once per page session when the chain is
     mostly assembled, then rests (decorative, never under reduced motion). */
  const [signalArmed, setSignalArmed] = useState(false);
  const firedRef = useRef(false);
  useEffect(() => {
    if (shouldReduceMotion || steps.length === 0) return;
    const fire = (value: number) => {
      if (!firedRef.current && value >= SIGNAL_AT) {
        firedRef.current = true;
        setSignalArmed(true);
      }
    };
    fire(progress.get());
    return progress.on("change", fire);
  }, [progress, shouldReduceMotion, steps.length]);

  if (steps.length === 0) {
    return null;
  }

  const total = steps.length;

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        orientation === "vertical"
          ? "flex flex-col items-start"
          : "flex flex-wrap items-center gap-y-2",
        className,
      )}
      aria-label={`How the system works: ${steps.join(" → ")}`}
    >
      {/* One signal travels the finished chain, then rests (decorative). */}
      {signalArmed ? (
        orientation === "vertical" ? (
          <motion.span
            aria-hidden
            variants={travelY}
            initial="hidden"
            animate="show"
            className="pointer-events-none absolute inset-x-0 top-0 h-full"
            style={{
              background: `linear-gradient(180deg, transparent, rgba(${accent}, 0.22), transparent)`,
            }}
          />
        ) : (
          <motion.span
            aria-hidden
            variants={travelX}
            initial="hidden"
            animate="show"
            className="pointer-events-none absolute inset-y-0 left-0 w-full"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(${accent}, 0.25), transparent)`,
            }}
          />
        )
      ) : null}

      {steps.map((step, index) => (
        <Fragment key={step}>
          {orientation === "horizontal" && index > 0 ? (
            <ConnectorHorizontal
              accent={accent}
              progress={effective}
              range={connectorWindow(index, total)}
            />
          ) : null}
          <FlowNode
            label={step}
            accent={accent}
            index={index}
            total={total}
            progress={effective}
          />
          {orientation === "vertical" && index < total - 1 ? (
            <ConnectorVertical
              accent={accent}
              progress={effective}
              range={connectorWindow(index + 1, total)}
            />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}
