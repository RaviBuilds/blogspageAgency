"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

import { useMotionReady } from "@/components/home/progress-reveal";

/* ─────────────────────────────────────────────────────────────────────────────
   ScrollReveal — a mount-safe fade-up for one content block.

   The hidden state is applied through the R9 `useMotionReady` SSR/hydration
   gate (`progress-reveal.tsx`), which flips in a layout effect *before paint*,
   so the server always ships visible content and there is no flash. That
   contract matters for evidence sections: the review text has to exist in the
   HTML even if the client bundle never runs.

   Motion contract: `opacity` + `transform` only, the house cubic-bezier, and
   `prefers-reduced-motion` resolves to the settled state with no delay.
   `once: true` — a review never fades back out on upward scroll.
   ───────────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;

export function ScrollReveal({
  children,
  delay = 0,
  className,
  x = 0,
}: {
  children: ReactNode;
  /** Stagger delay in seconds. */
  delay?: number;
  className?: string;
  /** Optional horizontal entrance offset in px (e.g. subtle editorial stack). */
  x?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = Boolean(useReducedMotion());
  const armed = useMotionReady();
  const inView = useInView(ref, { once: true, margin: "-100px" });
  /** Before arming — and under reduced motion — the block renders settled. */
  const settled = reduce || !armed;

  /** Hidden is instant (pre-paint only, never animated); settled x resolves to 0. */
  const revealVariants: Variants = {
    hidden: { opacity: 0, y: 20, x, transition: { duration: 0 } },
    shown: { opacity: 1, y: 0, x: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={revealVariants}
      initial={false}
      animate={settled || inView ? "shown" : "hidden"}
      transition={{
        duration: settled ? 0 : 0.55,
        delay: settled ? 0 : delay,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}
