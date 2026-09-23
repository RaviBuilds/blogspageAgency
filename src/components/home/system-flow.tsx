"use client";

import { Fragment } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   R6 / R6.1 — SystemFlow

   The single signal language shared by all three flagship chapters
   (ArogyaDiet operations, Phixl pipeline, NeoDent presence chain):
   one connector style, one node style, one motion quality, one line weight —
   while each project's meaning stays its own.

   Architecture:
   - The node chips ARE the accessible content (DOM order = story order);
     the SVG connectors and the one-time travel signal are decorative only
     (`aria-hidden`; no meaning is carried by the animation layer).
   - Motion is variant-driven: the parent story's `whileInView` container
     propagates "show" down, so the flow draws only after the real
     screenshot has entered, then ONE signal travels the finished chain
     and the system rests. No loops, no pulses, no particles.
   - Performance contract: CSS transforms / opacity / SVG pathLength only —
     no canvas, no continuous animation.
   - Reduced motion: the parent renders with `initial="show"`, so no
     animation runs — nodes and drawn connectors appear immediately as the
     complete composition, and the settled signal state is invisible.

   Pure presentation: no data, no routes, no tracking.
   ──────────────────────────────────────────────────────────────────────────── */

const SPRING = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 1,
} as const;

const flowStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const nodeStage: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

const connectorLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

const connectorHead: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { delay: 0.3, duration: 0.15 } },
};

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

function FlowNode({ label, accent }: { label: string; accent: string }) {
  return (
    <motion.span
      variants={nodeStage}
      className="rounded-md border px-2.5 py-1 text-xs font-medium text-muted-foreground"
      style={{
        borderColor: `rgba(${accent}, 0.28)`,
        backgroundColor: `rgba(${accent}, 0.06)`,
      }}
    >
      {label}
    </motion.span>
  );
}

function ConnectorVertical({ accent }: { accent: string }) {
  const stroke = `rgba(${accent}, 0.5)`;
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 12 24"
      className="ml-4 h-5 w-3"
      fill="none"
    >
      <motion.path
        variants={connectorLine}
        d="M6 1 V19"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <motion.path
        variants={connectorHead}
        d="M2.5 15.5 L6 19.5 L9.5 15.5"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

function ConnectorHorizontal({ accent }: { accent: string }) {
  const stroke = `rgba(${accent}, 0.5)`;
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 24 12"
      className="h-3 w-5 shrink-0"
      fill="none"
    >
      <motion.path
        variants={connectorLine}
        d="M1 6 H19"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <motion.path
        variants={connectorHead}
        d="M15.5 2.5 L19.5 6 L15.5 9.5"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

export function SystemFlow({
  steps,
  orientation,
  accent,
  className,
}: {
  /** Business-readable system steps (the project's `visualSequence`). */
  steps: string[];
  /** "vertical" stacks the chain beside itself; "horizontal" flows across. */
  orientation: "vertical" | "horizontal";
  /** Raw `r,g,b` accent triple matching the project card system. */
  accent: string;
  className?: string;
}) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <motion.div
      variants={flowStagger}
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
      {orientation === "vertical" ? (
        <motion.span
          aria-hidden
          variants={travelY}
          className="pointer-events-none absolute inset-x-0 top-0 h-full"
          style={{
            background: `linear-gradient(180deg, transparent, rgba(${accent}, 0.22), transparent)`,
          }}
        />
      ) : (
        <motion.span
          aria-hidden
          variants={travelX}
          className="pointer-events-none absolute inset-y-0 left-0 w-full"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(${accent}, 0.25), transparent)`,
          }}
        />
      )}

      {steps.map((step, index) => (
        <Fragment key={step}>
          {orientation === "horizontal" && index > 0 ? (
            <ConnectorHorizontal accent={accent} />
          ) : null}
          <FlowNode label={step} accent={accent} />
          {orientation === "vertical" && index < steps.length - 1 ? (
            <ConnectorVertical accent={accent} />
          ) : null}
        </Fragment>
      ))}
    </motion.div>
  );
}
