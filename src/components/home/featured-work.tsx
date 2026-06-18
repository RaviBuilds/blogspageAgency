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

/* "Muted Reveal" — image blends into the dark canvas, blooms to full fidelity
   on card hover. */
const MUTED_REVEAL =
  "grayscale-[40%] brightness-[0.7] opacity-80 transition-all duration-[700ms] ease-out group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100";

/* ─────────────────────────────────────────────────────────────────────────────
   PROJECT DATA — real portfolio assets
   ───────────────────────────────────────────────────────────────────────────── */
const projects = [
  {
    id: "phixl-ai",
    image: "/phixlAI.jpg",
    tag: "AI-Powered SaaS",
    headline: "Phixl AI - Photo Restoration Platform",
    description:
      "A fully monetized generative AI platform that breathes new life into damaged photographs. Features a scalable user credit system with free-tier onboarding, seamless Razorpay checkout for credit top-ups, and instant, high-fidelity image processing.",
    tech: ["Next.js", "Replicate AI", "Supabase", "TypeScript", "Tailwind", "Razorpay"],
    accent: "99,102,241",
    gradient: "from-indigo-500/20 via-violet-500/10 to-transparent",
  },
  {
    id: "nextinn",
    image: "/NextInn.jpg",
    tag: "Hospitality Management",
    headline: "NextInn Booking & Operations",
    description:
      "A secure, all-in-one hotel platform designed to drive direct reservations. Guests can seamlessly check real-time availability and book rooms, while hotel staff and ownership utilize dedicated admin dashboards to control daily operations, handle reviews, and oversee high-level business performance.",
    tech: ["React", "Redux", "MongoDB", "Express", "Node", "Tailwind"],
    accent: "56,189,248",
    gradient: "from-sky-500/20 via-cyan-500/10 to-transparent",
  },
  {
    id: "arogyadiet",
    image: "/ArogyaDiet.jpg",
    tag: "Health & Delivery Platform",
    headline: "ArogyaDiet Ecosystem",
    description:
      "A complete end-to-end food delivery and subscription platform. Features interconnected portals for Customers to manage meal plans, a native Rider app for live delivery tracking, and powerful Master Admin & Franchise dashboards to seamlessly oversee all daily operations and logistics.",
    tech: ["Next.js","Stripe", "TypeScript", "Tailwind", "Supabase"],
    accent: "16,185,129",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
  {
    id: "best100movies",
    image: "/movieDB.png",
    tag: "SEO Content Platform",
    headline: "Best100Movies - Dynamic Media Hub",
    description:
      "A high-performance entertainment portal engineered to capture organic search traffic through programmatic SEO. It automatically aggregates thousands of real-time movie records via external APIs, while empowering site owners with a seamless headless CMS to effortlessly curate featured content.",
    tech: ["Next.js", "Sanity CMS", "TMDB API", "Tailwind", "Programmatic SEO"],
    accent: "139,92,246",
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   TECH STACK PILLS
   ───────────────────────────────────────────────────────────────────────────── */
function TechPills({ stack }: { stack: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
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
   BROWSER WINDOW — macOS-style chrome wrapper. Sized by its parent box.
   ───────────────────────────────────────────────────────────────────────────── */
function BrowserChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-white/[0.08] bg-[#111]/50 shadow-2xl shadow-black/50">
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
   DESKTOP CARD — asymmetric 35 / 65 split (copy | system mockup)
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
  // Subtle inner parallax on the screenshot.
  const imgScale = useTransform(progress, [0, 1], [1.02, 1.08]);
  const imgX = useTransform(progress, [0, 1], ["-2.5%", "2.5%"]);

  return (
    <article
      className="group relative mx-6 flex h-[75vh] min-h-[500px] w-[85vw] flex-shrink-0 flex-row items-center gap-12 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/40 p-8 backdrop-blur-md"
      style={{ "--card-accent": project.accent } as React.CSSProperties}
    >
      {/* Background gradient glow */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40`}
      />

      {/* ── LEFT COLUMN (35%) — technical copy ── */}
      <div className="relative z-10 flex w-[35%] flex-col items-start justify-center space-y-6">
        <span
          className="inline-block rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]"
          style={{
            borderColor: `rgba(${project.accent}, 0.3)`,
            color: `rgba(${project.accent}, 0.9)`,
          }}
        >
          {project.tag}
        </span>

        <h3 className="text-3xl font-semibold uppercase leading-[1.05] tracking-tight lg:text-4xl xl:text-5xl">
          {project.headline}
        </h3>

        <p className="text-sm leading-relaxed text-white/50 lg:text-base">
          {project.description}
        </p>

        <TechPills stack={project.tech} />
      </div>

      {/* ── RIGHT COLUMN (65%) — system mockup ── */}
      <div className="relative flex h-full w-[65%] items-center justify-center">
        <div className="relative aspect-[16/10] max-h-[90%] w-full">
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
                sizes="55vw"
                priority={index === 0}
                className={`object-contain object-center ${MUTED_REVEAL}`}
              />
            </motion.div>

            {/* Brand color-grade tint — fades out on hover */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-indigo-900/20 mix-blend-overlay transition-opacity duration-[700ms] ease-out group-hover:opacity-0"
            />
          </BrowserChrome>
        </div>
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

  // 4 cards × 85vw + per-card mx-6 spacing ≈ 350vw track.
  // Translate so the final card lands fully inside the 100vw viewport.
  const trackX = useTransform(scrollYProgress, [0, 1], ["0vw", "-252vw"]);

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
        <motion.div style={{ x: trackX }} className="flex pl-6 pr-[10vw]">
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
   MOBILE: Vertical stacked cards (flex-col), native scroll, no overflow.
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
            className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a]/60 p-4 backdrop-blur-sm"
            style={{ "--card-accent": project.accent } as React.CSSProperties}
          >
            {/* Background gradient */}
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40`}
            />

            {/* Aspect-locked browser window */}
            <div className="relative aspect-[16/10] w-full">
              <BrowserChrome>
                <div className="relative h-full w-full">
                  <Image
                    src={project.image}
                    alt={project.headline}
                    fill
                    sizes="100vw"
                    className="object-contain object-center brightness-90"
                  />
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-indigo-900/15 mix-blend-overlay"
                />
              </BrowserChrome>
            </div>

            {/* Text content */}
            <div className="relative z-10 px-1 pt-5">
              <span
                className="inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em]"
                style={{
                  borderColor: `rgba(${project.accent}, 0.3)`,
                  color: `rgba(${project.accent}, 0.9)`,
                }}
              >
                {project.tag}
              </span>

              <h3 className="mt-3 text-xl font-semibold uppercase leading-tight tracking-tight sm:text-2xl">
                {project.headline}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-white/50">
                {project.description}
              </p>

              <div className="mt-4">
                <TechPills stack={project.tech} />
              </div>
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
