"use client";

import { useRef, type MouseEvent } from "react";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   MOTION PRIMITIVES — design system §5
   ───────────────────────────────────────────────────────────────────────────── */
const SPRING = { type: "spring", stiffness: 100, damping: 20, mass: 1 } as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

/* ─────────────────────────────────────────────────────────────────────────────
   INFINITE MARQUEE
   Massive, uppercase, transparent stroke text scrolling infinitely.
   Uses a duplicated string + `animate={{ x: ["0%", "-50%"] }}` so the
   seam is invisible (the content repeats at 50%).
   ───────────────────────────────────────────────────────────────────────────── */
const MARQUEE_TEXT =
  "AI SALES AGENTS • WORKFLOW AUTOMATION • CUSTOM SAAS • PROGRAMMATIC SEO • ";

function InfiniteMarquee() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden">
      <motion.div
        className="flex shrink-0 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {/* Duplicate the text so the loop is seamless */}
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="mx-4 text-[clamp(4rem,10vw,10rem)] font-bold uppercase leading-none tracking-tighter"
            style={{
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.08)",
            }}
          >
            {MARQUEE_TEXT}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAGNETIC BUTTON
   Pulls gently toward the cursor within a bounding area, snaps back
   with premium spring on mouse leave. No jitter — uses `useSpring`.
   ───────────────────────────────────────────────────────────────────────────── */
function MagneticButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Raw motion values updated on mousemove
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springy output (magnetic snap-back)
  const springConfig = { stiffness: 150, damping: 15, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Subtle scale up while cursor is within bounding box
  const distance = useMotionValue(0);
  const scale = useTransform(distance, [0, 1], [1.05, 1]);

  const handleMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;

    // Pull strength: 30% of distance
    mouseX.set(deltaX * 0.3);
    mouseY.set(deltaY * 0.3);
    distance.set(0);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    distance.set(1);
  };

  const handleClick = () => {
    window.dispatchEvent(new Event("open-ai-chat"));
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y, scale }}
      whileTap={{ scale: 0.95 }}
      className="group relative inline-flex h-14 items-center gap-3 rounded-full border border-white/[0.12] bg-white px-8 text-base font-semibold text-black shadow-2xl shadow-indigo-500/20 transition-colors hover:bg-white/95"
    >
      {/* Glow ring on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-[2px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "conic-gradient(from 180deg, rgba(99,102,241,0.5), rgba(139,92,246,0.3), rgba(56,189,248,0.4), rgba(99,102,241,0.5))",
          filter: "blur(6px)",
          zIndex: -1,
        }}
      />
      Deploy Your AI System
      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   IMMERSIVE CTA SECTION
   ───────────────────────────────────────────────────────────────────────────── */
export function CtaSection() {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/[0.05] py-48">
      {/* Background glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.15),transparent_60%)] blur-[100px]"
      />

      {/* Infinite marquee — behind the content */}
      <InfiniteMarquee />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8"
      >
        <motion.h2
          variants={fadeUp}
          className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
        >
          Ready to scale without the headcount?
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
        >
          Let&apos;s architect your AI automation engine — so revenue grows
          while your team stays lean.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-12 flex justify-center">
          <MagneticButton />
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mt-8 text-sm text-muted-foreground/60"
        >
          Free strategy call · No commitment · Response in 24h
        </motion.p>
      </motion.div>
    </section>
  );
}
