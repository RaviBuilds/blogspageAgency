"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION SEAM — the homepage's section-to-section transition primitive.

   Extracted from the two one-off `BoundaryVeil` instances that previously lived
   in `featured-work.tsx` and `supporting-work.tsx`. A seam dissolves the edge
   between two sections whose surfaces differ, so a theme handoff reads as a
   tonal shift rather than a hard cut behind a hairline border.

   ## Why a seam cannot use `var(--background)`

   A seam paints the tone of the section *next to* it, which is by definition
   outside its own cascade scope. The dark island's top seam has to paint the
   light page tone while sitting inside a `.dark` subtree where `--background`
   resolves to the dark value. So the neighbouring surface is named explicitly
   through `SEAM_SURFACE` — these are the same literal values `globals.css`
   declares, kept in one place instead of being retyped per call site.

   ## Contract

   - Decorative only: always `aria-hidden`, never a landmark, never a heading,
     never an anchor target, and it carries no text. Nothing here is crawlable
     content and nothing here is load-bearing for comprehension.
   - Opacity + a static gradient. No layout animation, no filter, no blur.
   - Sits behind content: the seam is absolutely positioned and the section's
     own `relative` children paint above it.
   - Reduced motion resolves to fully invisible at both edges, so a visitor who
     opts out simply gets the plain section boundary.
   - SSR-safe: no `opacity: 0` on meaningful content is ever serialised, because
     a seam never wraps content in the first place.
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * The homepage's three section surfaces, as literal tones.
 *
 * Mirrors `globals.css`: `page` / `subtle` are the light `--background` and
 * `--background-subtle`; `island` is the dark-scope `--background` shared by
 * the Real Work and Supporting Work sections.
 */
export const SEAM_SURFACE = {
  page: "#F7F8FA",
  subtle: "#EDF1F6",
  island: "#0B0E14",
} as const;

export type SeamSurface = keyof typeof SEAM_SURFACE;

/**
 * How far the seam reaches into its section. Named rather than free-form so the
 * page keeps a consistent transition rhythm instead of accumulating arbitrary
 * viewport fractions.
 */
const SEAM_DEPTH = {
  sm: "28vh",
  md: "38vh",
  lg: "46vh",
} as const;

export type SeamDepth = keyof typeof SEAM_DEPTH;

/**
 * A scroll-linked tonal seam at the top or bottom edge of a section.
 *
 * `edge="top"` is strongest while the section is arriving and clears as its top
 * reaches 30% of the viewport — the incoming surface "wins" progressively.
 * `edge="bottom"` is the mirror: absent until the section's bottom edge rises
 * from the fold, reaching full strength at 45% of the viewport, handing off to
 * whatever comes next.
 *
 * Both directions are driven by scroll position rather than a one-shot
 * animation, so the transition is reversible on the way back up.
 *
 * @param neighbour Which adjacent surface this seam paints. This is the tone of
 *   the section on the *other* side of the boundary, not this section's own.
 */
export function SectionSeam({
  edge,
  neighbour,
  depth = "md",
  className,
}: {
  edge: "top" | "bottom";
  neighbour: SeamSurface;
  depth?: SeamDepth;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  /* Settled values chosen so that *both* edges resolve to opacity 0 once the
     transform below is applied — reduced motion means no seam at all, never a
     permanently tinted band across the section. */
  const settled = useMotionValue(edge === "top" ? 1 : 0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: edge === "top" ? ["start end", "start 0.3"] : ["end end", "end 0.45"],
  });
  const progress = shouldReduceMotion ? settled : scrollYProgress;
  const opacity = useTransform(progress, [0, 1], edge === "top" ? [1, 0] : [0, 1], {
    clamp: true,
  });

  const tone = SEAM_SURFACE[neighbour];

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0",
        edge === "top" ? "top-0" : "bottom-0",
        className,
      )}
      style={{
        height: SEAM_DEPTH[depth],
        opacity,
        background:
          edge === "top"
            ? `linear-gradient(180deg, ${tone} 0%, transparent 100%)`
            : `linear-gradient(0deg, ${tone} 0%, transparent 100%)`,
      }}
    />
  );
}
