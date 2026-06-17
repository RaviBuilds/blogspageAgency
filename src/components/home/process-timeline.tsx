"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   MOTION PRIMITIVES — design system §5
   ───────────────────────────────────────────────────────────────────────────── */
const SPRING = { type: "spring", stiffness: 100, damping: 20, mass: 1 } as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

/* ─────────────────────────────────────────────────────────────────────────────
   PROCESS STEPS — AI-first engineering firm positioning
   ───────────────────────────────────────────────────────────────────────────── */
const steps = [
  {
    number: "01",
    title: "Architecture & Data Strategy",
    description:
      "We map backend contracts, data flows, AI model constraints, and integration boundaries before writing a single line of code. Every decision is grounded in your business model and unit economics.",
  },
  {
    number: "02",
    title: "AI & System Integration",
    description:
      "We wire up the LLMs, configure webhook pipelines, connect your headless CMS and CRM, and build the automated workflows that turn raw user intent into qualified pipeline — all on a tested, observable infrastructure layer.",
  },
  {
    number: "03",
    title: "Front-End Polish & Cinematic UI",
    description:
      "We deliver an Awwwards-level interface with spring-physics interactions, kinetic typography, and buttery 60 fps scroll narratives — because premium positioning demands a premium digital experience.",
  },
  {
    number: "04",
    title: "Launch, Monitor & Scale",
    description:
      "We deploy with analytics, error budgets, and automated alerting from day one. Post-launch, we iterate on conversion data and scale the AI agents as your lead volume compounds.",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   STEP CARD — reveals as the scroll line reaches it
   ───────────────────────────────────────────────────────────────────────────── */
function StepCard({
  step,
  index,
}: {
  step: (typeof steps)[number];
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...SPRING, delay: index * 0.05 }}
      className="relative pl-12 md:pl-16"
    >
      {/* Timeline node */}
      <div className="absolute left-0 top-1 flex size-8 items-center justify-center rounded-full border border-primary/30 bg-background shadow-[0_0_24px_rgba(99,102,241,0.35)]">
        <div className="size-2.5 rounded-full bg-primary" />
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
        <span className="text-xs font-medium uppercase tracking-[0.24em] text-primary">
          Phase {step.number}
        </span>
        <h3 className="mt-3 text-xl font-semibold tracking-tight">
          {step.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {step.description}
        </p>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCROLL-DRIVEN SVG LINE
   Uses `useScroll` + `useTransform` to animate `strokeDashoffset` as the
   user scrolls through the section, drawing the vertical line downward.
   ───────────────────────────────────────────────────────────────────────────── */
function ScrollLine() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.6"],
  });

  // Animate from full offset (hidden) to 0 (fully drawn).
  const strokeDashoffset = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div ref={containerRef} className="absolute left-[15px] top-0 h-full md:left-[15px]">
      <svg
        className="h-full w-[2px]"
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background track */}
        <line
          x1="1"
          y1="0"
          x2="1"
          y2="100"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {/* Animated foreground */}
        <motion.line
          x1="1"
          y1="0"
          x2="1"
          y2="100"
          stroke="url(#line-gradient)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeDasharray="1"
          pathLength="1"
          style={{ pathLength: strokeDashoffset }}
        />
        <defs>
          <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(99,102,241,0.9)" />
            <stop offset="60%" stopColor="rgba(139,92,246,0.6)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0.3)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROCESS TIMELINE SECTION
   ───────────────────────────────────────────────────────────────────────────── */
export function ProcessTimeline() {
  return (
    <section id="process" className="border-t border-white/[0.08] py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Section header with stagger */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p variants={fadeUp} className="text-sm font-medium text-primary">
            Our Process
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            Engineered like an elite product team.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            Four phases. Zero ambiguity. From data strategy to launch-day
            analytics — every sprint moves revenue closer.
          </motion.p>
        </motion.div>

        {/* Vertical timeline with scroll-driven SVG line */}
        <div className="relative mx-auto mt-16 max-w-3xl">
          <ScrollLine />

          <div className="flex flex-col gap-10">
            {steps.map((step, index) => (
              <StepCard key={step.number} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
