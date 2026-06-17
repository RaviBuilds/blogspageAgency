"use client";

import { useRef } from "react";
import Image from "next/image";
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

/* Shared filter classes for the "Muted Reveal" interaction.
   Default: pushed into the dark canvas. Hover: full fidelity. */
const MUTED_REVEAL =
  "grayscale-[40%] brightness-[0.7] opacity-80 transition-all duration-[800ms] ease-out group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100";

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECT DATA — real portfolio assets
   ───────────────────────────────────────────────────────────────────────────── */
const projects = [
  {
    id: "phixl-ai",
    image: "/phixlAI.jpg",
    tag: "AI SaaS Product",
    headline: "Phixl AI Restoration Engine",
    description:
      "Autonomous photo restoration SaaS. Users upload damaged imagery and receive cinematic, AI-enhanced outputs in seconds via headless infrastructure.",
    tech: ["Next.js", "Replicate API", "Tailwind", "Supabase"],
    accent: "99,102,241",
    gradient: "from-indigo-500/20 via-violet-500/10 to-transparent",
  },
  {
    id: "nextinn",
    image: "/NextInn.jpg",
    tag: "Enterprise SaaS",
    headline: "NextInn Hotel OS",
    description:
      "Comprehensive hotel management architecture featuring role-based super-admin dashboards, real-time availability sync, and automated booking workflows.",
    tech: ["MERN Stack", "Redux", "Stripe", "WebSockets"],
    accent: "56,189,248",
    gradient: "from-sky-500/20 via-cyan-500/10 to-transparent",
  },
  {
    id: "arogyadiet",
    image: "/ArogyaDiet.jpg",
    tag: "HealthTech Dashboard",
    headline: "ArogyaDiet Analytics",
    description:
      "High-performance data visualization interface for dietary tracking and patient analytics, built for seamless scale and instant data mutation.",
    tech: ["React", "TypeScript", "Tailwind", "Data Viz"],
    accent: "16,185,129",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
  {
    id: "best100movies",
    image: "/movieDB.png",
    tag: "Programmatic Media",
    headline: "Best100Movies Engine",
    description:
      "A lightning-fast, visually immersive media directory with programmatic SEO architectures, infinite scroll, and dynamic API routing.",
    tech: ["Next.js", "REST APIs", "Framer Motion", "SEO"],
    accent: "139,92,246",
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   TECH STACK PILLS
   ───────────────────────────────────────────────────────────────────────────── */
function TechPills({ stack }: { stack: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {stack.map((t) => (
        <span
          key={t}
          className="rounded-full border border-white/[0.05] bg-white/[0.03] px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white/60 md:text-xs"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   BROWSER WINDOW — macOS-style chrome wrapper.
   Aspect-locked by the caller; this just supplies the title bar + content frame.
   ───────────────────────────────────────────────────────────────────────────── */
function BrowserChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-[#0c0c0c] shadow-2xl shadow-black/50">
      {/* Title bar */}
      <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-white/[0.05] bg-white/[0.04] px-3">
        <span className="size-2 rounded-full bg-[#ff5f57]/70" />
        <span className="size-2 rounded-full bg-[#febc2e]/70" />
        <span className="size-2 rounded-full bg-[#28c840]/70" />
      </div>
      {/* Content area — relative + overflow-hidden so the fill image is framed */}
      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#0c0c0c]">
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DESKTOP CARD — horizontal pinned with inner image parallax + muted reveal
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
  // Inner image parallax. Base scale stays > 1 so the horizontal pan never
  // exposes the frame edges (the scale overscan always covers the x offset).
  const imgScale = useTransform(progress, [0, 1], [1.1, 1.18]);
  const imgX = useTransform(progress, [0, 1], ["-3%", "3%"]);

  return (
    <article
      className="group relative flex h-[78vh] w-[80vw] flex-shrink-0 flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0a0a]/60 backdrop-blur-sm"
      style={{ "--card-accent": project.accent } as React.CSSProperties}
    >
      {/* Background gradient glow */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-50`}
      />

      {/* Image region — aspect-locked browser window, centered */}
      <div className="relative flex flex-1 items-center justify-center px-8 pt-12 md:px-14 md:pt-14">
        <div className="aspect-[16/10] w-full max-w-4xl">
          <BrowserChrome>
            {/* Parallax layer */}
            <motion.div
              style={{ scale: imgScale, x: imgX }}
              className="relative h-full w-full"
            >
              <Image
                src={project.image}
                alt={project.headline}
                fill
                sizes="80vw"
                priority={index === 0}
                className={`object-cover object-top ${MUTED_REVEAL}`}
              />
            </motion.div>

            {/* Brand color-grade tint — fades out on hover */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-indigo-900/20 mix-blend-overlay transition-opacity duration-[800ms] ease-out group-hover:opacity-0"
            />
          </BrowserChrome>
        </div>
      </div>

      {/* Text block */}
      <div className="relative z-10 px-10 pb-10 pt-6 md:px-14 md:pb-12">
        <span
          className="inline-block rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]"
          style={{
            borderColor: `rgba(${project.accent}, 0.3)`,
            color: `rgba(${project.accent}, 0.9)`,
          }}
        >
          {project.tag}
        </span>

        <h3 className="mt-4 text-3xl font-semibold leading-tight tracking-tight lg:text-4xl xl:text-5xl">
          {project.headline}
        </h3>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/50 md:text-base">
          {project.description}
        </p>

        <TechPills stack={project.tech} />
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

  // 4 cards × 80vw + 3 gaps × 2rem + 12 left-pad ≈ 326vw track.
  // Translate to land the last card comfortably inside the 100vw viewport.
  const trackX = useTransform(scrollYProgress, [0, 1], ["0vw", "-232vw"]);

  return (
    <section ref={sectionRef} className="relative hidden h-[400vh] md:block">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {/* Section header */}
        <div className="absolute left-0 top-10 z-10 px-6 lg:px-12">
          <p className="text-sm font-medium text-primary">Featured Systems</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Proof, not promises.
          </h2>
        </div>

        {/* Horizontal track */}
        <motion.div style={{ x: trackX }} className="flex gap-8 pl-12 pr-[20vw]">
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
   MOBILE: Vertical stacked cards with whileInView fade-ins.
   Images render at full fidelity (no hover on touch devices to trigger reveal).
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
            className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/60 backdrop-blur-sm"
            style={{ "--card-accent": project.accent } as React.CSSProperties}
          >
            {/* Background gradient */}
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40`}
            />

            {/* Aspect-locked browser window */}
            <div className="relative mx-4 mt-4">
              <div className="aspect-[16/10] w-full">
                <BrowserChrome>
                  <div className="relative h-full w-full">
                    <Image
                      src={project.image}
                      alt={project.headline}
                      fill
                      sizes="100vw"
                      className="object-cover object-top brightness-90"
                    />
                  </div>
                  {/* Light brand tint for canvas consistency */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-indigo-900/15 mix-blend-overlay"
                  />
                </BrowserChrome>
              </div>
            </div>

            {/* Text content */}
            <div className="relative z-10 p-5 pt-4">
              <span
                className="inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em]"
                style={{
                  borderColor: `rgba(${project.accent}, 0.3)`,
                  color: `rgba(${project.accent}, 0.9)`,
                }}
              >
                {project.tag}
              </span>

              <h3 className="mt-3 text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
                {project.headline}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-white/50">
                {project.description}
              </p>

              <TechPills stack={project.tech} />
            </div>
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
