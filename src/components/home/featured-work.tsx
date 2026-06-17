"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
    accent: "99,102,241", // indigo
    gradient: "from-indigo-500/20 via-violet-500/10 to-transparent",
  },
  {
    id: "nextinn",
    tag: "Enterprise Cloud System",
    headline: "NextInn Hotel Management SaaS",
    description:
      "A comprehensive MERN stack architecture featuring role-based dashboards, super-admin controls, and automated booking workflows. Multi-property operators manage rooms, revenue, and guest communications from a single command center.",
    accent: "56,189,248", // sky
    gradient: "from-sky-500/20 via-cyan-500/10 to-transparent",
  },
  {
    id: "ecopetkit",
    tag: "Headless E-Commerce",
    headline: "EcoPetKit B2B Platform",
    description:
      "A high-performance headless architecture utilizing Next.js and WordPress as a data layer for multilingual product showcasing and programmatic SEO. Thousands of auto-generated, schema-rich pages drive organic traffic at scale.",
    accent: "16,185,129", // emerald
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECT CARD
   Massive, cinematic card with inner image-parallax placeholder.
   ───────────────────────────────────────────────────────────────────────────── */
function ProjectCard({
  project,
  progress,
  index,
}: {
  project: (typeof projects)[number];
  progress: ReturnType<typeof useTransform<number, number>>;
  index: number;
}) {
  // Inner parallax: each card's image shifts slightly opposite to scroll
  const parallaxX = useTransform(
    progress,
    [0, 1],
    [30 * (index + 1), -30 * (index + 1)],
  );

  return (
    <article
      className="relative flex h-[75vh] w-[85vw] flex-shrink-0 flex-col justify-end overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0a0a]/50 backdrop-blur-sm md:w-[80vw]"
      style={{ "--card-accent": project.accent } as React.CSSProperties}
    >
      {/* Background gradient glow */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-60`}
      />

      {/* Parallax "image" layer — abstract geometric placeholder */}
      <motion.div
        style={{ x: parallaxX }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        {/* Large abstract shape representing the product screen */}
        <div className="relative h-[60%] w-[70%] rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-2xl shadow-black/40">
          {/* Simulated UI chrome */}
          <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-4 py-3">
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/20" />
            <span className="ml-3 h-2 w-24 rounded-full bg-white/[0.06]" />
          </div>
          {/* Content skeleton */}
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

      {/* Text overlay at bottom */}
      <div className="relative z-10 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent p-8 pt-24 md:p-12 md:pt-32">
        <span
          className="inline-block rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]"
          style={{
            borderColor: `rgba(${project.accent}, 0.3)`,
            color: `rgba(${project.accent}, 0.9)`,
          }}
        >
          {project.tag}
        </span>

        <h3 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl">
          {project.headline}
        </h3>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50 md:text-base">
          {project.description}
        </p>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FEATURED WORK — HORIZONTAL SCROLL PINNED SECTION
   300vh height gives scroll runway. A sticky inner container pins to viewport.
   useScroll + useTransform maps vertical progress to horizontal translation.
   ───────────────────────────────────────────────────────────────────────────── */
export function FeaturedWork() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Map vertical scroll progress → horizontal track offset.
  // With 3 cards, we need to translate roughly 66% to reveal the last card.
  const trackX = useTransform(scrollYProgress, [0, 1], ["0%", "-66.666%"]);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative h-[300vh]"
    >
      {/* Sticky viewport container */}
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {/* Section header — absolutely positioned at top */}
        <div className="absolute left-0 top-8 z-10 px-6 md:top-12 lg:px-12">
          <p className="text-sm font-medium text-primary">Featured Systems</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Proof, not promises.
          </h2>
        </div>

        {/* Horizontal scroll track */}
        <motion.div
          style={{ x: trackX }}
          className="flex gap-6 pl-6 pr-[20vw] md:gap-8 md:pl-12"
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              progress={scrollYProgress}
              index={index}
            />
          ))}
        </motion.div>

        {/* Scroll hint at bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <p className="text-xs tracking-[0.2em] text-white/20 uppercase">
            Scroll to explore
          </p>
        </div>
      </div>
    </section>
  );
}
