"use client";

/**
 * PILLAR RATIO BAR — the 70 / 20 / 10 model as one object.
 *
 * Used twice, at two scales: compact under the hero (the promise), and large in
 * the framework section (the explanation). Same component, so the two can never
 * disagree about the model they describe.
 *
 * ## Why a bar
 *
 * Three equal chips state three percentages and show nothing. A single bar
 * divided 70/20/10 *is* the argument — the eye reads the dominance of core design
 * before it reads a number, which is the three-second comprehension the brief
 * asks for. The segments grow from the left on arrival, so the proportion is
 * also performed rather than just presented.
 *
 * ## Contract
 *
 * The bar is `aria-hidden` and every label beside it is real text rendered by
 * the caller from the copy deck. Percentages are read from `PILLAR_WEIGHT`,
 * which mirrors the copy deck's own `percentage` strings — nothing here invents
 * a ratio.
 */

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

import { useMotionReady } from "@/components/home/progress-reveal";
import { EASE } from "@/lib/motion";
import { PILLAR_TONE, type PillarAccent } from "@/lib/web-design-visual-system";
import { cn } from "@/lib/utils";

import { alpha } from "./frames";

export interface RatioSegment {
  id: string;
  label: string;
  percentage: string;
  weight: number;
  accent: PillarAccent;
}

export function PillarRatioBar({
  segments,
  size = "compact",
  className,
}: {
  segments: readonly RatioSegment[];
  size?: "compact" | "display";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = Boolean(useReducedMotion());
  const armed = useMotionReady();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const settled = reduce || !armed;
  const grown = settled || inView;

  const display = size === "display";

  return (
    <div ref={ref} className={cn("w-full", className)}>
      {/* THE BAR. Segments are flex-weighted, so the ratio is expressed by
          layout rather than by hardcoded widths that could drift from the data. */}
      <div
        aria-hidden
        className={cn(
          "flex w-full gap-1.5 overflow-hidden",
          display ? "h-3" : "h-2",
        )}
      >
        {segments.map((segment, i) => {
          const tone = PILLAR_TONE[segment.accent];
          return (
            <span
              key={segment.id}
              className="block overflow-hidden rounded-full"
              style={{
                flexGrow: segment.weight,
                flexBasis: 0,
                backgroundColor: alpha(tone, 0.14),
              }}
            >
              <motion.span
                className="block h-full w-full origin-left rounded-full"
                style={{ backgroundColor: tone }}
                initial={false}
                animate={{ scaleX: grown ? 1 : 0 }}
                transition={
                  settled
                    ? { duration: 0 }
                    : { duration: 0.9, delay: 0.1 + i * 0.12, ease: EASE }
                }
              />
            </span>
          );
        })}
      </div>

      {/* THE LEGEND. Mirrors the bar's proportions so a label sits above the
          segment it names — the relationship is spatial, not colour-coded only. */}
      <div className="mt-3 flex w-full gap-1.5">
        {segments.map((segment) => (
          <div
            key={segment.id}
            className="min-w-0"
            style={{ flexGrow: segment.weight, flexBasis: 0 }}
          >
            <span
              className={cn(
                "block font-semibold tracking-tight",
                display ? "text-2xl sm:text-3xl" : "text-base",
              )}
              style={{ color: PILLAR_TONE[segment.accent] }}
            >
              {segment.percentage}
            </span>
            <span
              className={cn(
                "mt-0.5 block leading-snug text-text-subtle",
                display ? "text-sm sm:text-base" : "text-[0.6875rem] sm:text-xs",
              )}
            >
              {segment.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
