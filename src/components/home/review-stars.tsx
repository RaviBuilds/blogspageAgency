"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Star } from "lucide-react";
import { useRef, type ReactNode } from "react";

import { useMotionReady } from "@/components/home/progress-reveal";
import { EASE } from "@/lib/motion";

/* ─────────────────────────────────────────────────────────────────────────────
   Evidence-shelf micro-choreography (client primitives).

   Both primitives follow ScrollReveal's SSR-safe contract exactly: the
   server (and the first client render) always ship the settled state; the
   hidden state is applied pre-paint through the R9 `useMotionReady`
   hydration gate, so there is no flash and the evidence exists in the HTML
   even if the client bundle never runs. Motion is `opacity` + a small
   `transform` only, the house cubic-bezier, `once: true` (a review never
   fades back out on upward scroll), and `prefers-reduced-motion` resolves
   to the settled state with no delay.

   - ReviewStars: the rating's five stars settle in sequence (70ms/star).
   - AmbientFade: the section's atmosphere fades in ahead of the copy.
   ───────────────────────────────────────────────────────────────────────────── */

/** `hidden` carries `duration: 0` so the pre-paint armed flip is instant —
    exactly the mechanism ScrollReveal's hidden variant uses. */
const starVariants: Variants = {
  hidden: { opacity: 0, y: 4, transition: { duration: 0 } },
  shown: { opacity: 1, y: 0 },
};

const ambientVariants: Variants = {
  hidden: { opacity: 0, transition: { duration: 0 } },
  shown: { opacity: 1 },
};

export function ReviewStars({ rating }: { rating: 1 | 2 | 3 | 4 | 5 }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = Boolean(useReducedMotion());
  const armed = useMotionReady();
  const inView = useInView(ref, { once: true, margin: "-100px" });
  /** Before arming — and under reduced motion — the stars render settled. */
  const settled = reduce || !armed;

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`Rated ${rating} out of 5 on Google`}
      className="flex gap-0.5"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          variants={starVariants}
          initial={false}
          animate={settled || inView ? "shown" : "hidden"}
          transition={{
            duration: settled ? 0 : 0.45,
            delay: settled ? 0 : i * 0.07,
            ease: EASE,
          }}
          className="flex"
        >
          <Star
            className={
              i < rating
                ? "size-4 fill-[#FBBC05] text-[#FBBC05]"
                : "size-4 text-border-strong"
            }
          />
        </motion.span>
      ))}
    </div>
  );
}

export function AmbientFade({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = Boolean(useReducedMotion());
  const armed = useMotionReady();
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const settled = reduce || !armed;

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={ambientVariants}
      initial={false}
      animate={settled || inView ? "shown" : "hidden"}
      transition={{ duration: settled ? 0 : 1.1, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
