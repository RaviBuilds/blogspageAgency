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
  /**
   * The plain-language name of the pillar ("The Website"), from
   * `web-design-plain-language.ts`.
   *
   * When present it becomes the legend's primary line and the deck's own
   * `label` drops to a secondary one. That ordering is the point: a visitor who
   * reads nothing but this bar should still be able to repeat the model back,
   * and "Core Web Design" does not survive that test the way "The Website"
   * does. Optional, so a caller without a mapping renders exactly as before.
   */
  plainName?: string;
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
          segment it names — the relationship is spatial, not colour-coded only.

          That mapping only survives while a 10%-wide column is still wide enough
          to set a five-word label in. At 390px it is 39px: the browser overflowed
          "Local Visibility & Launch Infrastructure" out of its column and across
          the neighbouring one, and clipped the tail at the viewport edge. Below
          `sm` the legend therefore becomes three rows — percentage then label on
          one baseline — which loses the spatial mapping but keeps the words
          readable, and the proportional bar directly above still carries the
          ratio. From `sm` up the proportional columns return, with a floor under
          the narrow ones so the 10% label cannot be squeezed into a one-word
          column again in a narrower container. */}
      <div className="mt-3 flex w-full flex-col gap-2.5 sm:flex-row sm:gap-1.5">
        {segments.map((segment) => (
          <div
            key={segment.id}
            className={cn(
              "flex min-w-0 items-baseline gap-2.5 sm:block",
              display ? "sm:min-w-28" : "sm:min-w-24",
            )}
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

            {/* THE PLAIN-LANGUAGE LINE, where the caller supplies one. It takes
                the legend's primary position — weight, foreground colour — and
                the deck's own label becomes the technical line beneath it. */}
            {segment.plainName ? (
              <span className="min-w-0 sm:mt-1 sm:block">
                <span
                  className={cn(
                    "block font-semibold leading-snug tracking-tight text-foreground",
                    display ? "text-base sm:text-lg" : "text-xs sm:text-sm",
                  )}
                >
                  {segment.plainName}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block leading-snug text-text-disabled",
                    display ? "text-xs sm:text-sm" : "text-[0.625rem] sm:text-[0.6875rem]",
                  )}
                >
                  {segment.label}
                </span>
              </span>
            ) : (
              <span
                className={cn(
                  "block leading-snug text-text-subtle sm:mt-0.5",
                  display ? "text-sm sm:text-base" : "text-[0.6875rem] sm:text-xs",
                )}
              >
                {segment.label}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
