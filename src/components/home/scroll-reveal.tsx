"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

import { useMotionReady } from "@/components/home/progress-reveal";
import { EASE, RISE_TIGHT } from "@/lib/motion";

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

/**
 * SSR-safe reveal wiring for a *staggered* container.
 *
 * The sibling `ScrollReveal` covers a single block. This covers the other
 * homepage pattern: a `motion.div` holding `variants={container}` whose
 * children carry `variants={fadeUp}` and inherit the parent's variant label.
 *
 * ## Why `initial` cannot be a variant label here
 *
 * The pattern this replaces was:
 *
 * ```tsx
 * initial={shouldReduceMotion ? "show" : "hidden"}
 * whileInView="show"
 * ```
 *
 * `useReducedMotion()` returns `false` on the server, so `initial` resolved to
 * `"hidden"` during SSR and Framer Motion serialised the hidden variant into
 * inline styles on every child — shipping section `<h2>` elements as
 * `style="opacity:0;transform:translateY(24px)"` in the prerendered HTML. That
 * is the same SSR-visibility defect the hero `<h1>` audit fixed, reintroduced
 * one level down. Gating `initial` on a mount flag does not help, because
 * Framer Motion reads `initial` once on mount and never again.
 *
 * So `initial` is `false` and the reveal is driven through `animate`, which is
 * reactive. The server and the first client render resolve to `"show"`, meaning
 * the prerendered HTML always carries visible, readable content. The hidden
 * state arms only after `useMotionReady` flips — in a layout effect, before
 * paint — so there is no flash of settled content.
 *
 * The `hidden` variant must therefore be instant (`transition: { duration: 0 }`)
 * so that arming is a pre-paint state change rather than a visible animation
 * out. `show` keeps its spring and its `staggerChildren`.
 *
 * Reduced motion never arms at all: content simply stays settled.
 *
 * @example
 * const reveal = useStaggerReveal();
 * <motion.div variants={container} {...reveal}>…</motion.div>
 */
/**
 * `useInView`'s margin type is a template-literal union, not `string`. Derived
 * from the library rather than restated, so it cannot drift.
 */
type InViewMargin = NonNullable<Parameters<typeof useInView>[1]>["margin"];

export function useStaggerReveal<T extends HTMLElement = HTMLDivElement>({
  margin = "-100px",
  shownLabel = "show",
  hiddenLabel = "hidden",
  once = true,
}: {
  margin?: InViewMargin;
  shownLabel?: string;
  hiddenLabel?: string;
  /**
   * `false` re-arms the hidden state when the block leaves the viewport, so an
   * upward scroll replays the reveal. Used by the reversible scroll scenes.
   */
  once?: boolean;
} = {}) {
  const ref = useRef<T>(null);
  const reduce = Boolean(useReducedMotion());
  const armed = useMotionReady();
  const inView = useInView(ref, { once, margin });
  const settled = reduce || !armed;
  return {
    ref,
    initial: false as const,
    animate: settled || inView ? shownLabel : hiddenLabel,
  };
}

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
    hidden: { opacity: 0, y: RISE_TIGHT, x, transition: { duration: 0 } },
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
