"use client";

/**
 * PROCESS SPINE — the vertical line that draws itself as the process is read.
 *
 * The line is the section's continuity: five stages sharing one spine read as a
 * progression, five stages in five boxes read as five options. Drawing it with
 * scroll progress rather than on a timer means the visitor's own reading pace
 * advances the process, which is the closest a static page gets to showing
 * sequence.
 *
 * ## SSR and reduced motion
 *
 * The scroll-linked transform attaches only after `useMotionReady` flips, so the
 * server ships a fully drawn line and there is nothing to flash. Under
 * `prefers-reduced-motion` progress is pinned to 1 — the line is simply already
 * complete. Decorative throughout: `aria-hidden`, no text, opacity/transform only.
 */

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

import { useMotionReady } from "@/components/home/progress-reveal";
import { cn } from "@/lib/utils";

export function ProcessSpine({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const armed = useMotionReady();
  const shouldReduceMotion = useReducedMotion();
  const complete = useMotionValue(1);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });
  const progress = shouldReduceMotion ? complete : scrollYProgress;
  const scaleY = useTransform(progress, [0, 1], [0, 1], { clamp: true });

  return (
    <span
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute w-px bg-border-subtle", className)}
    >
      <motion.span
        className="block h-full w-full origin-top"
        style={{
          background:
            "linear-gradient(180deg, #4353C9 0%, #4353C9 55%, #0E7490 100%)",
          ...(armed ? { scaleY } : null),
        }}
      />
    </span>
  );
}
