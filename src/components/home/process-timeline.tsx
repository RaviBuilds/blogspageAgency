"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
  type Variants,
} from "framer-motion";

import { PROCESS } from "@/lib/homepage-data";
import {
  STAGE_ACCENTS,
  STAGE_WINDOWS,
  TransformationCanvas,
  useMonotonicProgress,
  useReached,
} from "@/components/home/process-motifs";

/* ─────────────────────────────────────────────────────────────────────────────
   R8 — HOW WE WORK EXPERIENCE (Blueprint: R8 How We Work Experience v1.0)

   The four near-identical process cards become one continuous journey:

     YOUR BUSINESS -> UNDERSTAND -> SHAPE -> BUILD -> LAUNCH -> READY FOR
     YOUR CUSTOMERS

   Visual architecture (Blueprint §6-8):
   - ONE section-level scroll progress value drives everything: the
     transformation canvas (a plain business brief morphing into a live
     system), the spine fill, the traveling emphasis and each stage's
     "reached" state.
   - Stage entries are typographic (no card chrome) so the section reads as
     one journey, not four tiles beside a line.
   - Copy stays canonical: PROCESS (homepage-data.ts) renders verbatim;
     heading keeps the established selective-gradient treatment.
   - Preserved contracts: `id="process"` (navbar, footer, solution pages),
     the `You end with:` outcome rows, §5 spring system, reduced-motion
     full-static rendering, no analytics (none existed here).
   ─────────────────────────────────────────────────────────────────────────── */
const SPRING = { type: "spring", stiffness: 100, damping: 20, mass: 1 } as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

/*
 * Section heading treatment — parity with the other homepage sections: the
 * neutral headline stays neutral; the meaningful final sentence carries the
 * restrained brand text sweep. No data change — sliced from the existing
 * PROCESS.heading with a safe whole-heading fallback.
 */
const HEADING_TEXT = PROCESS.heading;
const HEADING_ACCENT = "You need to know what happens next.";
const HEADING_MAIN = HEADING_TEXT.endsWith(HEADING_ACCENT)
  ? HEADING_TEXT.slice(0, HEADING_TEXT.length - HEADING_ACCENT.length)
  : "";

const BRAND_TEXT_GRADIENT = {
  backgroundImage:
    "linear-gradient(90deg, #0891B2 0%, #4353C9 52%, #7C3AED 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text",
  color: "transparent",
} as const;

/* Stage accents in journey order (Blueprint §17 semantic progression). */
const STAGE_META = [
  { accent: STAGE_ACCENTS.cyan, ring: STAGE_ACCENTS.cyan },
  { accent: STAGE_ACCENTS.blue, ring: STAGE_ACCENTS.blue },
  { accent: STAGE_ACCENTS.violet, ring: STAGE_ACCENTS.violet },
  { accent: STAGE_ACCENTS.cyan, ring: STAGE_ACCENTS.blue },
] as const;

/* ─────────────────────────────────────────────────────────────────────────────
   JOURNEY SPINE — the single progress visual connecting every stage.
   Track + gradient fill + traveling signal, all derived from the shared
   monotonic progress. Decorative (aria-hidden).
   ─────────────────────────────────────────────────────────────────────────── */
function JourneySpine({ monotonic }: { monotonic: MotionValue<number> }) {
  const fill = useTransform(monotonic, [0.06, 0.92], [0, 1], { clamp: true });

  return (
    <div aria-hidden className="absolute bottom-6 left-[15px] top-6 w-[2px]">
      <svg
        className="h-full w-[2px]"
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
      >
        <line
          x1="1"
          y1="0"
          x2="1"
          y2="100"
          style={{ stroke: "var(--border-subtle)" }}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <motion.line
          x1="1"
          y1="0"
          x2="1"
          y2="100"
          stroke="url(#r8-spine-gradient)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeDasharray="1"
          pathLength="1"
          style={{ pathLength: fill }}
        />
        <defs>
          <linearGradient id="r8-spine-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(14,116,144,0.9)" />
            <stop offset="55%" stopColor="rgba(67,83,201,0.7)" />
            <stop offset="100%" stopColor="rgba(124,58,237,0.45)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STAGE ROW — typographic entry (no card chrome). The spine node fills in
   the stage accent as the stage's progress window is reached; everything
   else is static, readable document content.
   ─────────────────────────────────────────────────────────────────────────── */
function StageRow({
  step,
  index,
  monotonic,
}: {
  step: (typeof PROCESS.steps)[number];
  index: number;
  monotonic: MotionValue<number>;
}) {
  const meta = STAGE_META[index];
  const reached = useReached(monotonic, STAGE_WINDOWS["understand"][0] + index * 0.22);

  return (
    <motion.article
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...SPRING, delay: index * 0.05 }}
      className="relative pl-12 md:pl-16"
    >
      {/* Spine node: neutral ring; the accent dot + ring fill on reach. */}
      <span
        aria-hidden
        className="absolute left-0 top-1 flex size-8 items-center justify-center rounded-full border bg-card"
        style={{ borderColor: "var(--border)" }}
      >
        <motion.span
          className="absolute inset-0 rounded-full border"
          style={{
            borderColor: "rgba(" + meta.ring + ", 0.45)",
            opacity: reached,
          }}
        />
        <motion.span
          className="size-2.5 rounded-full"
          style={{
            backgroundColor: "rgb(" + meta.accent + ")",
            opacity: reached,
          }}
        />
      </span>

      <span
        className="text-xs font-medium uppercase tracking-[0.24em]"
        style={{ color: "var(--text-subtle)" }}
      >
        Phase {step.number}
      </span>
      <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
        {step.title}
      </h3>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
        {step.description}
      </p>
      <p className="mt-4 max-w-xl border-t border-border-subtle pt-3 text-sm">
        <span className="font-semibold text-foreground">You end with:</span>{" "}
        <span className="text-muted-foreground">{step.outcome}</span>
      </p>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   JOURNEY FRAMES — entry (business problem) and terminal (live business)
   frame nodes framing the four stages (Blueprint §4). Labels are the
   owner-approved presentation labels; they carry no commercial claims.
   ─────────────────────────────────────────────────────────────────────────── */
function EntryFrame() {
  return (
    <div className="relative flex items-center gap-3 pl-12 md:pl-16">
      <span
        aria-hidden
        className="absolute left-0 flex size-8 items-center justify-center rounded-full border bg-card"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="size-2 rounded-full" style={{ backgroundColor: "var(--border-strong)" }} />
      </span>
      <p className="text-sm font-medium text-muted-foreground">Your business</p>
    </div>
  );
}

function TerminalFrame({ monotonic }: { monotonic: MotionValue<number> }) {
  const reached = useReached(monotonic, STAGE_WINDOWS.live[0], 0.08);

  return (
    <div className="relative flex items-center gap-3 pl-12 md:pl-16">
      <span
        aria-hidden
        className="absolute left-0 flex size-8 items-center justify-center rounded-full border bg-card"
        style={{ borderColor: "var(--border)" }}
      >
        <motion.span
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: "rgba(" + STAGE_ACCENTS.blue + ", 0.45)", opacity: reached }}
        />
        <motion.span
          className="absolute inset-1 rounded-full border"
          style={{ borderColor: "rgba(" + STAGE_ACCENTS.cyan + ", 0.5)", opacity: reached }}
        />
        <motion.span
          className="size-2 rounded-full"
          style={{ backgroundColor: "rgb(" + STAGE_ACCENTS.cyan + ")", opacity: reached }}
        />
      </span>
      <p className="text-sm font-semibold text-foreground">Ready for your customers</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROCESS TIMELINE SECTION
   ─────────────────────────────────────────────────────────────────────────── */
export function ProcessTimeline() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  /* ONE section-level progress value drives canvas, spine and stage states
     (Blueprint §8: the canvas state, spine fill and stage emphasis advance
     together; monotonic clamping keeps reached states persistent). */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "end 0.5"],
  });

  const monotonic = useMonotonicProgress(
    scrollYProgress,
    Boolean(shouldReduceMotion),
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      className="scroll-mt-24 border-t border-border-subtle bg-background py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Section header — canonical copy, staggered once. */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p variants={fadeUp} className="text-sm font-medium text-primary">
            {PROCESS.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {HEADING_MAIN || PROCESS.heading}
            {HEADING_MAIN && (
              <span style={BRAND_TEXT_GRADIENT}>{HEADING_ACCENT}</span>
            )}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            {PROCESS.sub}
          </motion.p>
        </motion.div>

        {/* Journey: the transformation canvas beside the typographic stage
            list, framed by the business-problem and live-business nodes. */}
        <div className="mt-16 grid items-start gap-12 lg:mt-20 lg:grid-cols-12">
          <div className="order-1 lg:col-span-5">
            <TransformationCanvas progress={scrollYProgress} />
          </div>

          <div className="relative order-2 lg:col-span-7">
            <JourneySpine monotonic={monotonic} />
            <div className="flex flex-col gap-10">
              <EntryFrame />
              {PROCESS.steps.map((step, index) => (
                <StageRow
                  key={step.number}
                  step={step}
                  index={index}
                  monotonic={monotonic}
                />
              ))}
              <TerminalFrame monotonic={monotonic} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
