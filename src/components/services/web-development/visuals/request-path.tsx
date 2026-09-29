"use client";

/**
 * REQUEST PATH — the hero's composition.
 *
 * ## What it is, and why it is not the flow chain
 *
 * The hero previously rendered `SystemFlow` — the same six-node horizontal
 * chain the architecture section renders — inside a plain card below the copy.
 * Two problems, both visible rather than theoretical: at hero width six nodes
 * compress to roughly 120px each, so the longest label ("Payment /
 * Notification") wrapped to three lines; and the page's opening visual was the
 * identical object as its middle visual, which meant the hero had no identity
 * of its own.
 *
 * This is the hero's own register: the same six stages, run **vertically** as a
 * signed path, each carrying the one sentence that says what happens there. The
 * stages arrive in order and light up in order, so the motion is the
 * explanation — a request entering at the top and leaving as an outcome at the
 * bottom — rather than decoration around it.
 *
 * ## Motion contract
 *
 * One-shot, on entry, once. No infinite loop, no float, no particle, no glow:
 * the "packet" is the sequential activation of the nodes themselves, which is
 * the system-node-activation register the brief asks for and costs two animated
 * properties per row (`opacity`, `scale`).
 *
 * Under `prefers-reduced-motion` — and before the `useMotionReady` hydration
 * gate flips — every row renders in its settled, fully-activated state. Nothing
 * here is ever serialised at `opacity: 0` around real text: the stage labels and
 * sentences are plain server-rendered content in an `<ol>`, and only the rails,
 * dots and chevrons are `aria-hidden` and animated.
 */

import { motion } from "framer-motion";

import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { alpha, SYSTEM_TONE } from "@/lib/web-development-visual-system";

import { useDrawGate } from "./system-nodes";

/** Seconds between two stages activating. Slow enough that the order reads. */
const STEP = 0.16;

export interface RequestStage {
  id: string;
  label: string;
  plain: string;
}

export function RequestPath({
  stages,
  outcomes,
  caption,
  outcomesLabel,
  className,
}: {
  stages: readonly RequestStage[];
  outcomes: readonly string[];
  /** The micro label above the path. Real text — it names what the diagram is. */
  caption: string;
  outcomesLabel: string;
  className?: string;
}) {
  const { ref, settled, drawn } = useDrawGate<HTMLDivElement>("-60px");
  const accent = SYSTEM_TONE.blue;
  const last = stages.length - 1;

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-sm sm:p-6",
        "shadow-[0_44px_90px_-46px_rgb(14_21_36/0.34),0_10px_24px_-16px_rgb(14_21_36/0.16)]",
        className,
      )}
    >
      <p className="flex items-center gap-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-text-disabled">
        <span
          aria-hidden
          className="size-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: alpha(accent, 0.8) }}
        />
        {caption}
      </p>

      <ol className="mt-5">
        {stages.map((stage, i) => {
          const delay = 0.1 + i * STEP;
          const isEdge = i === 0 || i === last;

          return (
            <li key={stage.id} className="relative flex gap-4">
              {/* ── RAIL ────────────────────────────────────────────────
                  The node marker plus the segment that connects it to the
                  next stage. Decorative: the sequence survives in the `<ol>`
                  ordering and the labels themselves. */}
              <span aria-hidden className="relative flex w-3 shrink-0 flex-col items-center">
                <motion.span
                  className="mt-[0.4rem] flex size-3 items-center justify-center rounded-full border"
                  style={{
                    borderColor: alpha(accent, isEdge ? 0.55 : 0.28),
                    backgroundColor: alpha(accent, isEdge ? 0.14 : 0.06),
                  }}
                  initial={false}
                  animate={{ scale: drawn ? 1 : 0.55, opacity: drawn ? 1 : 0.35 }}
                  transition={settled ? { duration: 0 } : { duration: 0.34, delay, ease: EASE }}
                >
                  <motion.span
                    className="block size-1.5 rounded-full"
                    style={{ backgroundColor: accent }}
                    initial={false}
                    animate={{ opacity: drawn ? 1 : 0 }}
                    transition={
                      settled ? { duration: 0 } : { duration: 0.24, delay: delay + 0.1, ease: EASE }
                    }
                  />
                </motion.span>

                {i < last ? (
                  <motion.span
                    className="mt-1 w-px flex-1 origin-top"
                    style={{
                      background: `linear-gradient(180deg, ${alpha(accent, 0.45)}, ${alpha(accent, 0.18)})`,
                    }}
                    initial={false}
                    animate={{ scaleY: drawn ? 1 : 0 }}
                    transition={
                      settled
                        ? { duration: 0 }
                        : { duration: STEP + 0.08, delay: delay + 0.14, ease: "linear" }
                    }
                  />
                ) : null}
              </span>

              {/* ── STAGE ───────────────────────────────────────────────
                  Real text, always present and always visible in the served
                  HTML. */}
              <div className={cn("min-w-0 flex-1", i < last ? "pb-5" : "pb-0")}>
                <p className="text-sm font-semibold leading-snug tracking-tight text-foreground">
                  {stage.label}
                </p>
                <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {stage.plain}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* ── OUTCOME ───────────────────────────────────────────────────────
          What the business is left holding. Real text; only the arrival is
          animated, and it lands after the last stage has activated. */}
      <motion.div
        className="mt-1 border-t border-border-subtle pt-4"
        initial={false}
        animate={{ opacity: drawn ? 1 : 0, y: drawn ? 0 : 6 }}
        transition={
          settled ? { duration: 0 } : { duration: 0.4, delay: 0.1 + stages.length * STEP, ease: EASE }
        }
      >
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-text-disabled">
          {outcomesLabel}
        </p>
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {outcomes.map((outcome) => (
            <li
              key={outcome}
              className="rounded-full border px-2.5 py-1 text-xs font-medium text-foreground/80"
              style={{
                borderColor: alpha(SYSTEM_TONE.cyan, 0.3),
                backgroundColor: alpha(SYSTEM_TONE.cyan, 0.06),
              }}
            >
              {outcome}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
