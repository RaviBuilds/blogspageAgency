"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   MOTION PRIMITIVES — design system §5
   ───────────────────────────────────────────────────────────────────────────── */
const SPRING = { type: "spring", stiffness: 100, damping: 20, mass: 1 } as const;

const mobileContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const mobileFadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECT DATA
   ───────────────────────────────────────────────────────────────────────────── */
const projects = [
  {
    id: "phixl-ai",
    tag: "AI SaaS Product",
    headline: "Phixl AI Restoration Engine",
    description:
      "A production-grade SaaS leveraging Next.js and the Replicate API to autonomously restore and upscale historical imagery. Users upload damaged photos and receive cinematic, AI-enhanced outputs in seconds — no manual intervention, no Photoshop.",
    accent: "99,102,241",
    gradient: "from-indigo-500/20 via-violet-500/10 to-transparent",
  },
  {
    id: "nextinn",
    tag: "Enterprise Cloud System",
    headline: "NextInn Hotel Management SaaS",
    description:
      "A comprehensive MERN stack architecture featuring role-based dashboards, super-admin controls, and automated booking workflows. Multi-property operators manage rooms, revenue, and guest communications from a single command center.",
    accent: "56,189,248",
    gradient: "from-sky-500/20 via-cyan-500/10 to-transparent",
  },
  {
    id: "ecopetkit",
    tag: "Headless E-Commerce",
    headline: "EcoPetKit B2B Platform",
    description:
      "A high-performance headless architecture utilizing Next.js and WordPress as a data layer for multilingual product showcasing and programmatic SEO. Thousands of auto-generated, schema-rich pages drive organic traffic at scale.",
    accent: "16,185,129",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECT CARD — used in both mobile (vertical) and desktop (horizontal)
   ───────────────────────────────────────────────────────────────────────────── */
function ProjectCardInner({
  project,
}: {
  project: (typeof projects)[number];
}) {
  return (
    <>
      {/* Background gradient glow */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-60`}
      />

      {/* Abstract "product screen" placeholder */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative h-[55%] w-[65%] rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-2xl shadow-black/40 md:h-[60%] md:w-[70%]">
          <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-4 py-3">
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/20" />
            <span className="ml-3 h-2 w-24 rounded-full bg-white/[0.06]" />
          </div>
          <div className="space-y-3 p-4 md:p-6">
            <div className="h-3 w-2/3 rounded bg-white/[0.04]" />
            <div className="h-3 w-1/2 rounded bg-white/[0.04]" />
            <div className="mt-4 h-16 w-full rounded-lg bg-white/[0.03] md:mt-6 md:h-24" />
            <div className="flex gap-3">
              <div className="h-7 w-16 rounded-md bg-white/[0.04] md:h-8 md:w-20" />
              <div className="h-7 w-16 rounded-md bg-white/[0.03] md:h-8 md:w-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Text overlay at bottom */}
      <div className="relative z-10 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent p-6 pt-20 md:p-12 md:pt-32">
        <span
          className="inline-block rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] md:text-xs"
          style={{
            borderColor: `rgba(${project.accent}, 0.3)`,
            color: `rgba(${project.accent}, 0.9)`,
          }}
        >
          {project.tag}
        </span>

        <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl md:mt-4 md:text-5xl lg:text-6xl">
          {project.headline}
        </h3>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/50 md:mt-4 md:text-base">
          {project.description}
        </p>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DESKTOP: Horizontal pinned card with parallax
   ───────────────────────────────────────────────────────────────────────────── */
function DesktopCard({
  project,
  progress,
  index,
}: {
  project: (typeof projects)[number];
  progress: ReturnType<typeof useTransform<number, number>>;
  index: number;
}) {
  const parallaxX = useTransform(
    progress,
    [0, 1],
    [30 * (index + 1), -30 * (index + 1)],
  );

  return (
    <article
      className="relative flex h-[75vh] w-[80vw] flex-shrink-0 flex-col justify-end overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0a0a]/50 backdrop-blur-sm"
      style={{ "--card-accent": project.accent } as React.CSSProperties}
    >
      {/* Background gradient glow */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-60`}
      />

      {/* Parallax image layer */}
      <motion.div
        style={{ x: parallaxX }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="relative h-[60%] w-[70%] rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-2xl shadow-black/40">
          <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-4 py-3">
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/20" />
            <span className="ml-3 h-2 w-24 rounded-full bg-white/[0.06]" />
          </div>
          <div className="space-y-3 p-6">
            <div className="h-3 w-2/3 rounded bg-white/[0.04]" />
            <div className="h-3 w-1/2 rounded bg-white/[0.04]" />
            <div className="mt-6 h-24 w-full rounded-lg bg-white/[0.03]" />
            <div className="flex gap-3">
              <div className="h-8 w-20 rounded-md bg-white/[0.04]" />
              <div className="h-8 w-20 rounded-md bg-white/[0.03]" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Text overlay */}
      <div className="relative z-10 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent p-12 pt-32">
        <span
          className="inline-block rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]"
          style={{
            borderColor: `rgba(${project.accent}, 0.3)`,
            color: `rgba(${project.accent}, 0.9)`,
          }}
        >
          {project.tag}
        </span>
        <h3 className="mt-4 text-5xl font-semibold leading-tight tracking-tight lg:text-6xl">
          {project.headline}
        </h3>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/50">
          {project.description}
        </p>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DESKTOP: Horizontal Scroll Pinned Section
   ───────────────────────────────────────────────────────────────────────────── */
function DesktopHorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const trackX = useTransform(scrollYProgress, [0, 1], ["0%", "-66.666%"]);

  return (
    <section ref={sectionRef} className="relative hidden h-[300vh] md:block">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {/* Section header */}
        <div className="absolute left-0 top-12 z-10 px-6 lg:px-12">
          <p className="text-sm font-medium text-primary">Featured Systems</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Proof, not promises.
          </h2>
        </div>

        {/* Horizontal track */}
        <motion.div
          style={{ x: trackX }}
          className="flex gap-8 pl-12 pr-[20vw]"
        >
          {projects.map((project, index) => (
            <DesktopCard
              key={project.id}
              project={project}
              progress={scrollYProgress}
              index={index}
            />
          ))}
        </motion.div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <p className="text-xs uppercase tracking-[0.2em] text-white/20">
            Scroll to explore
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MOBILE: Vertical stacked cards with whileInView fade-ins
   ───────────────────────────────────────────────────────────────────────────── */
function MobileVerticalStack() {
  return (
    <section id="work" className="border-t border-white/[0.08] py-16 md:hidden">
      <div className="px-5">
        <p className="text-sm font-medium text-primary">Featured Systems</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Proof, not promises.
        </h2>
      </div>

      <motion.div
        variants={mobileContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="mt-10 flex flex-col gap-6 px-4"
      >
        {projects.map((project) => (
          <motion.article
            key={project.id}
            variants={mobileFadeUp}
            className="relative flex min-h-[420px] w-full flex-col justify-end overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/50 backdrop-blur-sm"
            style={{ "--card-accent": project.accent } as React.CSSProperties}
          >
            <ProjectCardInner project={project} />
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FEATURED WORK — responsive wrapper
   ───────────────────────────────────────────────────────────────────────────── */
export function FeaturedWork() {
  return (
    <>
      <MobileVerticalStack />
      <DesktopHorizontalScroll />
    </>
  );
}
