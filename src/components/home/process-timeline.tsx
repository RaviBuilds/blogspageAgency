"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";

import { PROCESS } from "@/lib/homepage-data";
import {
  BRAND_TEXT_GRADIENT,
  TYPE_EYEBROW,
  TYPE_LEAD,
  TYPE_META,
  TYPE_SECTION,
} from "@/lib/brand-type";
import { RHYTHM_MOVEMENT } from "@/lib/section-rhythm";
import { RISE_DEFAULT, SPRING, STAGGER_SEQUENCE } from "@/lib/motion";
import { useStaggerReveal } from "@/components/home/scroll-reveal";
import {
  BriefArtifact,
  BuildArtifact,
  CanvasStateCaption,
  COMPLETE_PROGRESS,
  LaunchArtifact,
  PhaseArtifactPanel,
  STAGE_ACCENTS,
  STAGE_WINDOWS,
  StructureArtifact,
  useReached,
} from "@/components/home/process-motifs";

/* ─────────────────────────────────────────────────────────────────────────────
   R11 — HOW WE WORK EXPERIENCE (reversible scroll narrative)

   The journey spine, typographic stage entries, entry/terminal frames and the
   four project artifacts stay as they are. R11 changes only HOW the left visual
   is driven:

     YOUR BUSINESS -> UNDERSTAND -> SHAPE -> BUILD -> LAUNCH -> READY FOR
     YOUR CUSTOMERS

   - ONE reversible source of truth: the section's `scrollYProgress` is passed
     straight to the spine, the stage nodes and the artifact panel. Scrolling
     down winds the whole narrative forward; scrolling UP winds it backwards,
     frame for frame. (The previous monotonic clamp and the discrete
     phase/`active` state machine are gone — they made the visual one-way and
     turned the four artifacts into four separate screens.)
   - The panel's crossfades are centred on the same 0.06 / 0.28 / 0.50 / 0.74
     boundaries the stage nodes use, so the left artifact and the right timeline
     can never disagree.
   - Desktop (lg+): the artifact panel is a sticky left column; a one-shot dock
     check adds a single cinematic settle when it lands.
   - Mobile: no shrunken desktop layout — each stage carries its own artifact
     inline, rendered at its completed state with no motion at all.
   - Each stage answers "You see:" alongside the established "You end
     with:" outcome row; the journey closes with one quiet trust note.

   Preserved contracts: `id="process"` (navbar, footer, solution pages),
   the heading + selective-gradient treatment, the `You end with:` outcome
   rows, §5 spring system, reduced-motion readability.
   ─────────────────────────────────────────────────────────────────────────── */
const container: Variants = {
  hidden: {},
  /* SEQUENCE: the arrival order of the journey stages is information here, so
     it is worth the extra beat between children. */
  show: { transition: { staggerChildren: STAGGER_SEQUENCE } },
};

/* `hidden` is instant: it arms after hydration (see `useStaggerReveal`), so a
   timed hidden transition would animate *away* from the painted server
   composition. Only `show` carries the spring. */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: RISE_DEFAULT, transition: { duration: 0 } },
  show: { opacity: 1, y: 0, transition: SPRING },
};

/**
 * Stage-row entrance, as variants rather than a raw `initial` object.
 *
 * A literal `initial={{ opacity: 0, x: -20 }}` is unconditional, so Framer
 * Motion serialised it into the server HTML and every phase `<article>` — each
 * containing an `<h3>` and the phase copy — shipped invisible. Variants let the
 * SSR-safe gate resolve to `show` on the server instead. `custom` carries the
 * per-row stagger delay that used to live in the inline `transition`.
 */
const stageRise: Variants = {
  hidden: { opacity: 0, x: -20, transition: { duration: 0 } },
  show: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: { ...SPRING, delay: index * 0.05 },
  }),
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

/* Stage accents in journey order (Blueprint §17 semantic progression). */
const STAGE_META = [
  { accent: STAGE_ACCENTS.cyan, ring: STAGE_ACCENTS.cyan },
  { accent: STAGE_ACCENTS.blue, ring: STAGE_ACCENTS.blue },
  { accent: STAGE_ACCENTS.violet, ring: STAGE_ACCENTS.violet },
  { accent: STAGE_ACCENTS.cyan, ring: STAGE_ACCENTS.blue },
] as const;

/* The artifact each phase carries — same order as PROCESS.steps, so the
   inline mobile artifact is always the one the phase describes. */
const PHASE_ARTIFACTS = [
  BriefArtifact,
  StructureArtifact,
  BuildArtifact,
  LaunchArtifact,
] as const;

/* ─────────────────────────────────────────────────────────────────────────────
   JOURNEY SPINE — the single progress visual connecting every stage.
   Track + gradient fill, both derived from the shared scroll progress, so the
   spine winds forward and backward with the artifact. Decorative (aria-hidden).
   ─────────────────────────────────────────────────────────────────────────── */
function JourneySpine({ progress }: { progress: MotionValue<number> }) {
  const fill = useTransform(progress, [0.06, 0.92], [0, 1], { clamp: true });

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
   else is static, readable document content. Each stage answers, in order:
   what we do, what you see, what you end with. On mobile (<lg) the phase's
   artifact renders inline below the copy — static and always readable, so
   the mobile journey reads phase → artifact → phase → artifact.
   ─────────────────────────────────────────────────────────────────────────── */
function StageRow({
  step,
  index,
  progress,
}: {
  step: (typeof PROCESS.steps)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const meta = STAGE_META[index];
  const reached = useReached(progress, STAGE_WINDOWS["understand"][0] + index * 0.22);
  const Artifact = PHASE_ARTIFACTS[index];
  /* SSR-safe gate: the phase heading and copy ship visible and crawlable; the
     hidden state arms only after hydration. */
  const reveal = useStaggerReveal<HTMLElement>({ margin: "-80px" });

  return (
    <motion.article
      custom={index}
      variants={stageRise}
      {...reveal}
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
      <p className="mt-3 max-w-xl text-sm">
        <span className="font-medium text-foreground">You see:</span>{" "}
        <span className="text-muted-foreground">{step.see}</span>
      </p>
      <p className="mt-4 max-w-xl border-t border-border-subtle pt-3 text-sm">
        <span className="font-semibold text-foreground">You end with:</span>{" "}
        <span className="text-muted-foreground">{step.outcome}</span>
      </p>

      {/* Mobile: this phase's artifact in normal flow, rendered at its
          completed state with no motion at all (COMPLETE_PROGRESS). Desktop
          shows the scroll-linked crossfading panel instead. */}
      <div aria-hidden className="mt-6 lg:hidden">
        <Artifact progress={COMPLETE_PROGRESS} />
      </div>
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

function TerminalFrame({ progress }: { progress: MotionValue<number> }) {
  const reached = useReached(progress, STAGE_WINDOWS.live[0], 0.08);

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
  const sectionRef = useRef<HTMLElement>(null);

  /* SSR-safe reveal gate — the prerendered HTML carries the settled, readable
     header; the hidden state arms only after hydration. */
  const header = useStaggerReveal();

  /* ONE section-level progress value drives the artifact panel, spine and
      stage states, and it is deliberately REVERSIBLE: scrolling back up winds
      the whole narrative backwards. Reduced motion is handled inside the
      panel and the stage nodes, by collapsing their interpolation windows. */
  const { scrollY, scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "end 0.5"],
  });

  /* One-shot sticky "dock" detection for the artifact panel. The sticky
     column's natural document offset minus the lg:top-24 (96px) sticky offset
     is measured (on mount, once more for late layout shifts, and on resize;
     skipped while the column is display:none on mobile), and the SHARED page
     scrollY MotionValue is watched for crossing it — no new scroll
     infrastructure, no IntersectionObserver, no second scroll system.
     Fires once and stays set: it is the panel's one non-reversible state, a
     landing rather than a progress value (every stage/artifact visual is
     fully reversible and derived from scrollYProgress). */
  const stickyColumnRef = useRef<HTMLDivElement>(null);
  const stickyThresholdRef = useRef(Number.POSITIVE_INFINITY);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const measure = () => {
      const el = stickyColumnRef.current;
      if (!el || el.offsetParent === null) return;
      stickyThresholdRef.current =
        el.getBoundingClientRect().top + window.scrollY - 96;
    };
    measure();
    if (window.scrollY >= stickyThresholdRef.current) setSettled(true);
    const late = window.setTimeout(measure, 800);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(late);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    if (y >= stickyThresholdRef.current) {
      setSettled(true);
    }
  });

  return (
    <section
      ref={sectionRef}
      id="process"
      className={`scroll-mt-24 border-t border-border-subtle bg-background ${RHYTHM_MOVEMENT}`}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Section header — canonical copy, staggered once. The scopeNote
            keeps the process relevant to every kind of build without
            becoming a second service list. */}
        {/* Heading left, lead right — the same split composition as the
            teaching movement's opening, because this section does the same job
            at the other end of the page: it narrates rather than indexes. The
            scope note stays with the lead as genuine metadata (TYPE_META), not
            as a third paragraph competing with it. */}
        <motion.div variants={container} {...header}>
          <div className="lg:grid lg:grid-cols-12 lg:items-baseline lg:gap-10">
            <div className="lg:col-span-7">
              {/* Scanning anchor — Process keeps its eyebrow. */}
              <motion.p variants={fadeUp} className={TYPE_EYEBROW}>
                {PROCESS.eyebrow}
              </motion.p>
              <motion.h2 variants={fadeUp} className={`mt-4 ${TYPE_SECTION}`}>
                {HEADING_MAIN || PROCESS.heading}
                {HEADING_MAIN && (
                  <span style={BRAND_TEXT_GRADIENT}>{HEADING_ACCENT}</span>
                )}
              </motion.h2>
            </div>
            <div className="mt-6 lg:col-span-5 lg:col-start-8 lg:mt-0">
              <motion.p variants={fadeUp} className={TYPE_LEAD}>
                {PROCESS.sub}
              </motion.p>
              <motion.p variants={fadeUp} className={`mt-4 ${TYPE_META}`}>
                {PROCESS.scopeNote}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Journey: the evolving artifact beside the typographic stage list,
            framed by the business-problem and live-business nodes. */}
        <div className="mt-16 lg:mt-20 lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* Desktop (lg+): the artifact panel is the journey's left column —
              sticky, so the evolving artifact stays in view while the stages
              scroll past, crossfading at each stage boundary in lockstep with
              the active stage's emphasis. Mobile does not shrink this
              layout: each stage carries its own artifact inline (StageRow). */}
          <div
            ref={stickyColumnRef}
            className="hidden lg:sticky lg:top-24 lg:col-span-6 lg:block"
          >
            {/* R8.1 presentation surface: an unboxed, ruled frame for the
                evolving artifact — corner registration ticks, no card chrome
                (the artifact itself is the subject). */}
            <div className="relative mx-auto max-w-md pt-1">
              <span aria-hidden className="pointer-events-none absolute left-0 top-0 size-3 border-l border-t border-border" />
              <span aria-hidden className="pointer-events-none absolute right-0 top-0 size-3 border-r border-t border-border" />
              <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 size-3 border-b border-l border-border" />
              <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 size-3 border-b border-r border-border" />
              <PhaseArtifactPanel progress={scrollYProgress} settled={settled} />
              {/* Baseline rule + editorial state caption. */}
              <div aria-hidden className="mt-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-border-subtle" />
                <CanvasStateCaption progress={scrollYProgress} />
              </div>
            </div>
          </div>

          <div className="relative mt-10 max-lg:mt-6 lg:col-span-6 lg:mt-0">
            <JourneySpine progress={scrollYProgress} />
            <div className="flex flex-col gap-10">
              <EntryFrame />
              {PROCESS.steps.map((step, index) => (
                <StageRow
                  key={step.number}
                  step={step}
                  index={index}
                  progress={scrollYProgress}
                />
              ))}
              <TerminalFrame progress={scrollYProgress} />
              {/* The section's single quiet trust signal: the client is never
                  kept in the dark — work is reviewed before it advances. */}
              <p className="pl-12 text-sm text-text-subtle md:pl-16">
                {PROCESS.reviewNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
