"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { projects, type FeaturedProject } from "@/lib/featured-work-data";
import { FLAGSHIP_PROJECT_IDS, PROOF } from "@/lib/homepage-data";

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 4 — Real proof (Blueprint §13)

   The flagship portfolio becomes problem → build → system storytelling:
   each card frames *why the project existed*, then shows the delivered
   structure via `visualSequence` chips. Replaces the h-[400vh] pinned
   horizontal gallery (the costliest client-side section in the old page)
   with staged, viewport-gated reveals.

   Preserved contracts:
   - `id="work"` now lives on THIS section for every breakpoint (previously
     only the mobile variant carried it, so /#work scrolled to the page top
     on desktop — the documented D-6 defect).
   - Data stays in `featured-work-data.ts`, still shared with `/about`.
   - Only projects listed in FLAGSHIP_PROJECT_IDS render; NeoDent and the
     gym/dental builds stay absent until their owner-evidence records exist.
   ───────────────────────────────────────────────────────────────────────────── */

const SPRING = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 1,
} as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

/* "Muted reveal" — the screenshot blends into the dark canvas, blooms to
   full fidelity on card hover. Kept from the previous design. */
const MUTED_REVEAL =
  "grayscale-[40%] brightness-[0.7] opacity-80 transition-all duration-[700ms] ease-out group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100";

function TechPills({ stack }: { stack: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {stack.map((t) => (
        <span
          key={t}
          className="rounded-full border border-border-subtle bg-card px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground md:text-xs"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

/* The numeric figure and its "estimated" basis always share one visible
   block — the honesty pattern from featured-work-data.ts, preserved. */
function MetricLine({
  metrics,
}: {
  metrics: FeaturedProject["metrics"];
}) {
  return (
    <ul className="flex flex-col gap-1">
      {metrics.map((metric) => (
        <li
          key={metric.label}
          className="text-xs font-medium text-muted-foreground md:text-sm"
        >
          {metric.label}: <span className="text-foreground">{metric.value}</span>{" "}
          <span className="text-text-subtle">({metric.basis})</span>
        </li>
      ))}
    </ul>
  );
}

function BrowserChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-border bg-surface-dark-raised shadow-2xl shadow-black/50">
      <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-border-subtle bg-white/[0.04] px-3">
        <span className="size-2 rounded-full bg-[#ff5f57]/70" />
        <span className="size-2 rounded-full bg-[#febc2e]/70" />
        <span className="size-2 rounded-full bg-[#28c840]/70" />
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden bg-surface-dark">
        {children}
      </div>
    </div>
  );
}

function StoryCard({
  project,
  index,
}: {
  project: FeaturedProject;
  index: number;
}) {
  const imageFirst = index % 2 === 0;

  return (
    <motion.article
      variants={fadeUp}
      className="group relative grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
      style={{ "--card-accent": project.accent } as React.CSSProperties}
    >
      {/* Screenshot in browser chrome */}
      <div
        className={imageFirst ? "relative order-1" : "relative order-1 lg:order-2"}
      >
        <div className="relative aspect-[16/10] w-full">
          <BrowserChrome>
            <div className="relative h-full w-full">
              <Image
                src={project.image}
                alt={project.headline}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority={index === 0}
                className={`object-contain object-center ${MUTED_REVEAL}`}
              />
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-indigo-900/15 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-0"
            />
          </BrowserChrome>
        </div>
      </div>

      {/* Story copy */}
      <div className={imageFirst ? "order-2" : "order-2 lg:order-1"}>
        <span
          className="inline-block rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]"
          style={{
            borderColor: `rgba(${project.accent}, 0.3)`,
            color: `rgba(${project.accent}, 0.9)`,
          }}
        >
          {project.tag}
        </span>

        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {project.headline}
        </h3>

        {project.storyFrame ? (
          <p className="mt-3 border-l-2 border-primary/40 pl-4 text-base font-medium text-foreground/90">
            {project.storyFrame}
          </p>
        ) : null}

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground lg:text-base">
          {project.description}
        </p>

        {project.visualSequence && project.visualSequence.length > 0 ? (
          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2">
            {project.visualSequence.map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                {i > 0 ? (
                  <span aria-hidden className="text-text-disabled">
                    →
                  </span>
                ) : null}
                <span className="rounded-md border border-border-subtle bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {step}
                </span>
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-5">
          <TechPills stack={project.tech} />
        </div>
        <div className="mt-4">
          <MetricLine metrics={project.metrics} />
        </div>
      </div>
    </motion.article>
  );
}

export function FeaturedProof() {
  const shouldReduceMotion = useReducedMotion();

  // Resolve the evidence-gated flagship list against the real project data.
  // An unknown id can only mean the two modules drifted; dropping it beats
  // rendering an empty card shell.
  const flagship = FLAGSHIP_PROJECT_IDS.map((id) =>
    projects.find((project) => project.id === id),
  ).filter((project): project is FeaturedProject => Boolean(project));

  return (
    <section
      id="work"
      className="dark scroll-mt-24 border-t border-border bg-background py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          variants={container}
          initial={shouldReduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p variants={fadeUp} className="text-sm font-medium text-primary">
            {PROOF.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {PROOF.heading}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            {PROOF.sub}
          </motion.p>
        </motion.div>

        <div className="mt-20 flex flex-col gap-20 lg:gap-28">
          {flagship.map((project, index) => (
            <StoryCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
