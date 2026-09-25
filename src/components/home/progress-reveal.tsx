"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   R9 — SCROLL CONTINUITY PRIMITIVES

   Restrained scroll-choreography building blocks shared by the homepage's
   "one continuous narrative" refinement (Real Work island → By Industry):

   - useMotionReady: SSR/hydration gate. Scroll-linked MotionValues must never
     ship `opacity: 0` inline styles in server HTML (the same SSR-visibility
     class of bug the hero `<h1>` audit fixed), so every reveal attaches its
     MotionValues only after mount — the server always ships visible content.
   - useStage: maps one slice of a parent scroll progress to { opacity, y }.
   - ProgressReveal: self-contained reveal wrapper for one content block.

   Section-boundary transitions live in `section-seam.tsx` (`SectionSeam`) and
   share this file's SSR and reduced-motion contract.

   Performance contract: opacity / transform only; MotionValues flow outside
   React state; one `useScroll` per primitive; no layout animation.
   Reduced motion: every primitive resolves to its settled state (fully
   visible content).
   ──────────────────────────────────────────────────────────────────────────── */

const useIsomorphicLayoutEffect =
  typeof document !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Arms scroll-linked styles after hydration. Server HTML (and the first
 * client render) always shows the settled composition; the layout-effect
 * flip happens before paint, so there is no flash.
 */
export function useMotionReady(): boolean {
  const [armed, setArmed] = useState(false);
  useIsomorphicLayoutEffect(() => setArmed(true), []);
  return armed;
}

export type StageRange = readonly [number, number];

/** Map one slice of scroll progress to a restrained opacity + rise reveal. */
export function useStage(
  progress: MotionValue<number>,
  range: StageRange,
  distance = 24,
): { opacity: MotionValue<number>; y: MotionValue<number> } {
  const opacity = useTransform(progress, [range[0], range[1]], [0, 1], {
    clamp: true,
  });
  const y = useTransform(progress, [range[0], range[1]], [distance, 0], {
    clamp: true,
  });
  return { opacity, y };
}

/**
 * Scroll-linked reveal for one content block. Progress runs from the block's
 * top entering at 95% of the viewport to it reaching 55% — content completes
 * shortly after it becomes comfortably readable, and reverses with scroll.
 */
export function ProgressReveal({
  children,
  className,
  enterAt = 0,
  completeBy = 0.6,
  distance = 24,
}: {
  children: ReactNode;
  className?: string;
  enterAt?: number;
  completeBy?: number;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const armed = useMotionReady();
  const shouldReduceMotion = useReducedMotion();
  const settled = useMotionValue(1);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.55"],
  });
  const progress = shouldReduceMotion ? settled : scrollYProgress;
  const { opacity, y } = useStage(progress, [enterAt, completeBy], distance);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={armed ? { opacity, y } : undefined}
    >
      {children}
    </motion.div>
  );
}

/* `BoundaryVeil` used to live here. It is now `SectionSeam` in
   `section-seam.tsx`, which names the neighbouring surface through a shared
   token map instead of taking a raw hex per call site, and fixes the height
   being passed two different ways at once. */