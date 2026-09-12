"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type MouseEvent,
} from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import {
  HOME_VERTICALS,
  VERTICALS_SECTION,
  type HomeVertical,
  type HomeVerticalId,
} from "@/lib/homepage-verticals";
import { projects } from "@/lib/featured-work-data";
import {
  CapabilitySpine,
  GrowVisual,
  ScaleVisual,
  STAGE_COMPLETE_AT,
  STAGE_THRESHOLDS,
  StartVisual,
  type StageProgress,
} from "./capability-visuals";

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 3 — "Start with what your business needs today." (Blueprint §11–12)

   R5 — capability experience. The three permanent verticals, rendered from the
   presentation-layer model in `homepage-verticals.ts` — never from the SEO
   catalog. Each vertical is now a connected capability world:

     01 START (cyan)  — presence: business → website → enquiry
     02 GROW  (blue)  — systems: customer → portal → software → operations
     03 SCALE (violet)— intelligence: enquiry → AI → follow-up → opportunity

   R5.2 — VISUAL HIERARCHY + SCROLL PROGRESSION (refinement, same architecture):

   SCROLL CHOREOGRAPHY (user requirement, overrides staged storytelling)
   One `useScroll` tracks the section (0 when the section top enters at 90% of
   the viewport). All three capability worlds build in a quick staggered
   cascade during that entry — each world still constructs sequentially
   (frame → chrome → nav → hero → action, etc.), compressed into its slice —
   and ALL SVGs are fully built by the time the section has risen ~20% of the
   viewport from the bottom edge (VISUALS_BUILT_AT). No card is ever left
   half-built lower down the page or after the section scrolls past. The
   spine and per-stage chapter emphasis still follow the deeper scroll
   (0–30% START, 30–65% GROW, 65–100% SCALE) as quiet narrative signal.
   Everything is scroll-linked: fast scrolling catches up instantly, nothing
   pins or hijacks the page, no timers.

   ONE-TIME COMPLETION
   The built state is remembered for the page session (in-memory): returning
   to the section shows the completed, calm composition — no restart.
   Reduced-motion users get the completed composition immediately.

   LOCAL DETAIL (hover/focus) stays CSS-only (`group-hover:` / focus), so
   keyboard focus produces the same strengthening as hover.

   SURFACE HIERARCHY
   Cards keep the light editorial system but gain: a constant faint
   stage-colored wash + a stage-colored top hairline (identity at a glance),
   a slightly stronger rest shadow, and — while the scroll journey is running
   — the currently active stage's card receives a subtle deeper tint and
   border. At completion everything settles back to the quiet rest state.

   Preserved contracts: `id="services"` (navbar), the spotlight-hover card
   pattern, the §5 spring motion system, all copy in `homepage-verticals.ts`,
   and the `solution_cta_click` event name with its `pillar`/`destination`
   properties. Heading strategy unchanged (one `h2`, one `h3` per vertical);
   the h2's meaningful phrase ("Build from there.") carries the same restrained
   cyan→blue→violet brand sweep the Hero established (declared inline for the
   same reason the Hero declares it inline — the locked `.text-gradient`
   override still points at the legacy near-white gradient).
   ───────────────────────────────────────────────────────────────────────────── */

const SPRING = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 1,
} as const;

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.35 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

/** Each vertical owns its evolving visual world (R5), now scroll-driven. */
const VERTICAL_VISUALS: Record<
  HomeVerticalId,
  ComponentType<{ progress: StageProgress }>
> = {
  "brand-digital-presence": StartVisual,
  "applications-software": GrowVisual,
  "ai-automation": ScaleVisual,
};

/**
 * R5.1 heading treatment: the neutral headline stays neutral; the meaningful
 * final phrase carries the restrained cyan → blue → violet sweep (the same
 * inline mechanism the Hero uses). No data change — the phrase is sliced from
 * the existing `VERTICALS_SECTION.heading` string, with a safe fallback.
 */
const HEADING_TEXT = VERTICALS_SECTION.heading;
const HEADING_ACCENT = "Build from there.";
const HEADING_MAIN = HEADING_TEXT.endsWith(HEADING_ACCENT)
  ? HEADING_TEXT.slice(0, HEADING_TEXT.length - HEADING_ACCENT.length)
  : "";

/**
 * USER REQUIREMENT (re-applied) — section progress at which every capability
 * visual is fully built. The section's progress starts when its top enters at
 * 90% of the viewport, so the section is ~20% risen into view at roughly 0.06
 * progress on common desktop sizes; 0.055 completes the cascade just before
 * that point, so no card SVG is ever left half-built lower down the page (or
 * after the section has scrolled past). The build is then locked for the page
 * session. This takes precedence over the staged START→GROW→SCALE
 * construction — the sequential builds play compressed inside this entry
 * window instead of across the whole section scroll.
 */
const VISUALS_BUILT_AT = 0.055;

/**
 * R5.2 brand text treatment — the one restrained triad sweep (the Hero's and
 * the section heading's light-signal values), shared by the section heading's
 * accent phrase and each capability title's meaningful phrase. Declared
 * inline rather than via `.text-gradient` for the same documented reason the
 * Hero declares it inline: the locked `.text-gradient` island override still
 * points the class at the legacy near-white gradient.
 */
const BRAND_TEXT_GRADIENT = {
  backgroundImage:
    "linear-gradient(90deg, #0891B2 0%, #4353C9 52%, #7C3AED 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text",
  color: "transparent",
} as const;

/** The meaningful phrase of each capability title (phrase-level emphasis —
    never a whole-heading gradient gimmick). Sliced from the existing title
    strings, with a safe whole-title fallback. */
const TITLE_ACCENT_PHRASES: Record<HomeVerticalId, string> = {
  "brand-digital-presence": "Digital Presence",
  "applications-software": "Business Software",
  "ai-automation": "AI & Automation",
};

function VerticalCard({
  vertical,
  selected,
  dimmed,
  stageActive,
  progress,
  onActivate,
  onDeactivate,
}: {
  vertical: HomeVertical;
  selected: boolean;
  dimmed: boolean;
  /** True while this card's stage is the scroll journey's active stage. */
  stageActive: boolean;
  progress: StageProgress;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--y", `${event.clientY - rect.top}px`);
  };

  const Visual = VERTICAL_VISUALS[vertical.id];
  const proofName =
    projects.find((project) => project.id === vertical.proofProjectId)
      ?.headline ?? vertical.proofProjectId;

  // R5.2 — title emphasis: slice the meaningful phrase off the existing title
  // string (no data change) and carry it in the shared brand sweep.
  const titleAccent = TITLE_ACCENT_PHRASES[vertical.id];
  const titleHasAccent = vertical.title.endsWith(titleAccent);
  const titleMain = titleHasAccent
    ? vertical.title.slice(0, vertical.title.length - titleAccent.length)
    : "";

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      whileHover={{ scale: 1.012 }}
      transition={SPRING}
      onMouseMove={handleMouseMove}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl p-6",
        "border bg-card",
        "transition-[border-color,box-shadow,opacity] duration-500",
        selected || stageActive
          ? "shadow-lg shadow-primary/10"
          : "shadow-[0_1px_3px_rgba(15,23,42,0.05)]",
        selected ? "border-border-strong" : "border-border",
        dimmed ? "opacity-[0.88]" : "opacity-100",
      )}
      style={
        {
          "--card-accent": vertical.accent,
          // R5.2 surface identity: a whisper of the stage color in the resting
          // border separates the card from the page (and its siblings) at a
          // glance; the active chapter deepens it without scaling the card.
          ...(selected
            ? null
            : {
                borderColor: `rgba(${vertical.accent},${stageActive ? 0.42 : 0.15})`,
              }),
        } as React.CSSProperties
      }
    >
      {/* R5.2 surface hierarchy — constant faint stage wash (localized ambient
          light over the visual world, ~7%: the card stays predominantly
          white). */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(70% 50% at 50% 4%, rgba(${vertical.accent},0.07), transparent 72%)`,
        }}
      />

      {/* Scroll-stage emphasis — a slightly deeper local tint while this
          stage is the journey's active chapter; fades out at completion. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 transition-opacity duration-700",
          stageActive && !selected ? "opacity-100" : "opacity-0",
        )}
        style={{
          background: `radial-gradient(80% 60% at 50% 6%, rgba(${vertical.accent},0.09), transparent 75%)`,
        }}
      />

      {/* Stage-colored top hairline + signal node — the card's identity and
          its "port" on the section's progression system. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent 4%, rgba(${vertical.accent},0.55), transparent 96%)`,
        }}
      />
      <span
        aria-hidden
        className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[box-shadow] duration-500"
        style={{
          backgroundColor: `rgb(${vertical.accent})`,
          boxShadow: `0 0 0 3px rgba(${vertical.accent},${stageActive ? 0.22 : 0.12})`,
        }}
      />

      {/* Border spotlight on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(220px circle at var(--x,50%) var(--y,50%), rgba(${vertical.accent},0.50), transparent 65%)`,
          padding: "1px",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Background wash on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(300px circle at var(--x,50%) var(--y,50%), rgba(${vertical.accent},0.08), transparent 55%)`,
        }}
      />

      <div className="relative z-10 flex h-full flex-col">
        {/* 1 — START / GROW / SCALE marker */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-foreground">
            <span
              className={cn(
                "size-1.5 rounded-full transition-transform duration-500",
                stageActive && !selected && "scale-125",
              )}
              style={{ backgroundColor: `rgb(${vertical.accent})` }}
            />
            {vertical.stage}
          </span>
          <span
            className="text-xs font-semibold tracking-wider"
            style={{ color: `rgba(${vertical.accent},0.65)` }}
          >
            {vertical.number}
          </span>
        </div>

        {/* 2 — the capability visual. R5.2: the world leads — it sits directly
            under the stage marker so the eye travels visual → title → promise,
            and the dead gap between visual and content is closed. */}
        <div className="mt-4">
          <Visual progress={progress} />
        </div>

        {/* 3 — capability title. R5.2: the meaningful phrase carries the same
            restrained triad sweep as the section heading's accent phrase
            ("Build from there.") — same values, same single brand moment per
            title. Falls back to the plain title if the phrase doesn't match. */}
        <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
          {titleHasAccent ? (
            <>
              {titleMain}
              <span style={BRAND_TEXT_GRADIENT}>{titleAccent}</span>
            </>
          ) : (
            vertical.title
          )}
        </h3>

        {/* 4 — one-line promise */}
        <p className="mt-2 text-sm font-medium text-primary">
          {vertical.plainPromise}
        </p>

        {/* 5 — capability vocabulary */}
        <ul className="mt-4 flex flex-wrap gap-x-1 gap-y-1 text-xs font-medium uppercase tracking-wider text-text-subtle [&>li:not(:last-child)]:after:ml-2 [&>li:not(:last-child)]:after:text-text-disabled [&>li:not(:last-child)]:after:content-['·']">
          {vertical.capabilities.map((capability) => (
            <li key={capability}>{capability}</li>
          ))}
        </ul>

        {/* 6 — short business explanation */}
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground lg:text-base">
          {vertical.body}
        </p>

        {/* 7 — real project proof. R5.2: anchored by a stage-accent rule so it
            reads as evidence tied to this capability, not a stray footnote. */}
        <p
          className="mt-4 border-l-2 pl-3 text-sm"
          style={{ borderColor: `rgba(${vertical.accent},0.35)` }}
        >
          <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-text-subtle">
            Built with
          </span>
          <Link
            href={vertical.proofDestination}
            onClick={() =>
              trackEvent("solution_cta_click", {
                cta_location: "vertical-proof",
                pillar: vertical.id,
                destination: vertical.proofDestination,
              })
            }
            className="underline-offset-4 transition-colors hover:text-foreground"
          >
            <span className="text-[15px] font-semibold text-foreground hover:underline">
              {proofName}
            </span>
            <span className="text-muted-foreground">
              {" "}
              — {vertical.proofDetail}
            </span>
          </Link>
        </p>

        {/* 8 — contextual CTA */}
        <div className="mt-auto pt-6">
          <Link
            href={vertical.href}
            onClick={() =>
              trackEvent("solution_cta_click", {
                cta_location: "vertical-cta",
                pillar: vertical.id,
                destination: vertical.href,
              })
            }
            className="group/cta -my-2 inline-flex items-center gap-1.5 py-2 text-sm font-semibold text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
          >
            {vertical.ctaLabel}
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover/cta:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function ServiceVerticals() {
  const shouldReduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<HomeVerticalId | null>(null);

  /* R5.1 — scroll-driven START → GROW → SCALE progression.
     One scroll listener for the whole section (the established Framer Motion
     pattern, as in process-timeline.tsx). No pinning, no scroll hijacking:
     progress is a pure read of the page scroll. */
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollStage, setScrollStage] = useState(0);
  const [journeyComplete, setJourneyComplete] = useState(false);
  const [visualsBuilt, setVisualsBuilt] = useState(false);
  const stageRef = useRef(0);
  const completeRef = useRef(false);
  const builtRef = useRef(false);
  const completedProgress = useMotionValue(1);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "end 0.55"],
  });

  const applyProgress = (v: number) => {
    // USER REQUIREMENT: all three worlds build during the section's entry;
    // once built, they are remembered as complete for the page session —
    // never rebuilt, never half-built lower down the page.
    if (!builtRef.current && v >= VISUALS_BUILT_AT) {
      builtRef.current = true;
      setVisualsBuilt(true);
    }
    if (!completeRef.current && v >= STAGE_COMPLETE_AT) {
      // One-time completion: remembered for the page session. Returning to
      // the section shows the completed composition — no restart.
      completeRef.current = true;
      setJourneyComplete(true);
      return;
    }
    if (completeRef.current) return;
    const stage =
      v >= STAGE_THRESHOLDS[1] ? 2 : v >= STAGE_THRESHOLDS[0] ? 1 : 0;
    if (stage !== stageRef.current) {
      stageRef.current = stage;
      setScrollStage(stage);
    }
  };

  useMotionValueEvent(scrollYProgress, "change", applyProgress);
  // Loading deep-linked / mid-scroll: settle state from the current value.
  useEffect(() => {
    applyProgress(scrollYProgress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const journeyDone = journeyComplete || Boolean(shouldReduceMotion);
  const spineProgress = journeyDone ? completedProgress : scrollYProgress;

  // USER REQUIREMENT — the three worlds build in a quick staggered cascade
  // while the section enters the viewport (START first, then GROW, then
  // SCALE), all completing at VISUALS_BUILT_AT — before the section is ~20%
  // in view. Each world's internal sequential construction (R5.3) plays
  // compressed inside its slice.
  const startProgress = useTransform(scrollYProgress, [0, 0.022], [0, 1]);
  const growProgress = useTransform(
    scrollYProgress,
    [0.014, 0.038],
    [0, 1],
  );
  const scaleProgress = useTransform(
    scrollYProgress,
    [0.03, 0.055],
    [0, 1],
  );

  const visualProgress: Record<HomeVerticalId, StageProgress> =
    journeyDone || visualsBuilt
      ? {
          "brand-digital-presence": completedProgress,
          "applications-software": completedProgress,
          "ai-automation": completedProgress,
        }
      : {
          "brand-digital-presence": startProgress,
          "applications-software": growProgress,
          "ai-automation": scaleProgress,
        };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative scroll-mt-24 overflow-hidden border-t border-border bg-background py-24 lg:py-32"
    >
      {/* R5.2 brand atmosphere — one very light triad wash across the whole
          section, in the same cyan → blue → violet sweep and the same light
          signal hex values as the "Build from there." heading phrase (~4–5%
          alpha: the section stays editorial and predominantly light). It runs
          left-to-right in step with START → GROW → SCALE, and shows on every
          breakpoint because it costs nothing and never saturates. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(8,145,178,0.05) 0%, rgba(67,83,201,0.04) 52%, rgba(124,58,237,0.05) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          variants={gridVariants}
          initial={shouldReduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p variants={fadeUp} className="text-sm font-medium text-primary">
            {VERTICALS_SECTION.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {HEADING_MAIN || HEADING_TEXT}
            {HEADING_MAIN && (
              <span style={BRAND_TEXT_GRADIENT}>{HEADING_ACCENT}</span>
            )}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            {VERTICALS_SECTION.sub}
          </motion.p>
        </motion.div>

        {/* START → GROW → SCALE spine: a scroll-driven progression indicator.
            Horizontal on desktop, vertical on mobile; it settles complete. */}
        <div className="mx-auto mt-12 max-w-3xl">
          <CapabilitySpine progress={spineProgress} />
        </div>

        <motion.div
          className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3"
          variants={gridVariants}
          initial={shouldReduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {HOME_VERTICALS.map((vertical, index) => (
            <VerticalCard
              key={vertical.id}
              vertical={vertical}
              progress={visualProgress[vertical.id]}
              stageActive={!journeyDone && scrollStage === index}
              selected={activeId === vertical.id}
              dimmed={activeId !== null && activeId !== vertical.id}
              onActivate={() => setActiveId(vertical.id)}
              onDeactivate={() =>
                setActiveId((current) =>
                  current === vertical.id ? null : current,
                )
              }
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}


