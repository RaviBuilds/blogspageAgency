"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { NICHES } from "@/lib/niches";
import { trackEvent } from "@/lib/analytics";
import { BRIDGE, FLAGSHIP_PROJECT_IDS } from "@/lib/homepage-data";
import {
  BRAND_TEXT_GRADIENT,
  TYPE_MICRO_LABEL,
  TYPE_SECTION,
} from "@/lib/brand-type";
import { RHYTHM_SECTION } from "@/lib/section-rhythm";
import { SPRING, STAGGER_FIELD } from "@/lib/motion";
import { projects } from "@/lib/featured-work-data";
import {
  DEFAULT_INDUSTRY_ACCENT,
  getIndustryStory,
} from "@/lib/industry-discovery";
import { IndustryStoryStrip, RealWorkVisual } from "@/components/home/industry-visual";
import { ConceptVisual } from "@/components/home/industry-system-visuals";
import { ProgressReveal } from "@/components/home/progress-reveal";
import { useStaggerReveal } from "@/components/home/scroll-reveal";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   R7 — INDUSTRY SOLUTION DISCOVERY (Blueprint §15 bridge, rebuilt)

   The old ten-card bento grid becomes a business-recognition field:
   DISCOVER (ten-industry editorial index, every entry a real link to its
   existing /solutions/<slug> route) → CONNECT (the selected industry's
   story panel: verified benefit line from the niche's own hero copy, a
   decorative micro-story, and how the three R5 capabilities apply) →
   ENTER ("Explore <Industry> →" onto the existing solution page).

   Preserved contracts: `id="solutions"`; the canonically approved Blueprint
   §15 `BRIDGE` header wording (no data change); all ten NICHES links firing
   `niche_card_click` with the same `{ niche, destination }` properties; the
   proof chip reusing `work_cta_click`. Hover/focus never gate information —
   the panel resolves a default industry at rest and keyboard focus drives
   selection. No scroll hijack, no pinning: §5 spring/stagger entry, once.

   Presentation data: `industry-discovery.ts` (pure map) +
   `featured-work-data.ts` (proof). `niches.ts` data is consumed, never
   rewritten.
   ──────────────────────────────────────────────────────────────────────────── */

const fieldVariants: Variants = {
  hidden: {},
  /* FIELD: ten industry entries — the shortest interval, so the index reads as
     one surface resolving rather than ten items queueing. */
  show: { transition: { staggerChildren: STAGGER_FIELD } },
};

/* `hidden` is instant: it arms after hydration (see `useStaggerReveal`), so a
   timed hidden transition would animate *away* from the painted server
   composition. Only `show` carries the spring. */
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16, transition: { duration: 0 } },
  show: { opacity: 1, y: 0, transition: SPRING },
};

const panelVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

/**
 * Section heading treatment — parity with the other homepage sections: the
 * neutral headline stays neutral; the meaningful final phrase carries the
 * restrained brand text sweep. No data change — the phrase is sliced from
 * the existing `BRIDGE.heading` string, with a safe whole-heading fallback.
 */
const HEADING_TEXT = BRIDGE.heading;
const HEADING_ACCENT = "different kinds of businesses.";
const HEADING_MAIN = HEADING_TEXT.endsWith(HEADING_ACCENT)
  ? HEADING_TEXT.slice(0, HEADING_TEXT.length - HEADING_ACCENT.length)
  : "";

/**
 * The industry resolved into the story panel at rest — Dental & Medical,
 * the proof-backed flagship (NeoDent). Hover is never required: the panel
 * already carries a complete, meaningful story before any interaction.
 */
const DEFAULT_SELECTED_ID = "dental-medical";

/** Proof chips route to the R6 field the project lives in. */
function proofDestination(projectId: string): "#work" | "#more-work" {
  return (FLAGSHIP_PROJECT_IDS as readonly string[]).includes(projectId)
    ? "#work"
    : "#more-work";
}

export function BentoGrid() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_SELECTED_ID);

  /* SSR-safe reveal gate — the ten industry links ship visible and crawlable in
     the prerendered HTML; the hidden state arms only after hydration.
     `shouldReduceMotion` above is still needed for the atmosphere opacity and
     the panel crossfade. */
  const field = useStaggerReveal<HTMLOListElement>();

  /* R9: the section's cyan/blue atmosphere builds with scroll as the light
     page tone takes over from the dark island above — the boundary breathes
     instead of snapping. Decorative opacity only. */
  const sectionRef = useRef<HTMLElement | null>(null);
  const settledAtmosphere = useMotionValue(1);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.35"],
  });
  const atmosphereReveal = useTransform(
    scrollYProgress,
    [0.12, 0.65],
    [0, 1],
    { clamp: true },
  );
  const atmosphereOpacity = shouldReduceMotion
    ? settledAtmosphere
    : atmosphereReveal;

  const selected = NICHES.find((niche) => niche.id === selectedId) ?? NICHES[0];
  const story = getIndustryStory(selected.id);
  const accent = story?.accent ?? DEFAULT_INDUSTRY_ACCENT;
  const proof = story?.proofProjectId
    ? projects.find((project) => project.id === story.proofProjectId)
    : undefined;

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className={cn(
        "relative scroll-mt-24 overflow-hidden border-t border-border-subtle bg-background-subtle",
        RHYTHM_SECTION,
      )}
    >
      {/* R7 environment: light editorial field with a restrained cyan/blue
          atmosphere behind the opening — decorative, aria-hidden; R9: its
          presence is scroll-linked instead of always-on. */}
      <motion.div
        aria-hidden
        style={{ opacity: atmosphereOpacity }}
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/[0.03] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[24rem] w-[56rem] max-w-none -translate-x-1/2"
      >
        <motion.div
          aria-hidden
          style={{
            opacity: atmosphereOpacity,
            background:
              "radial-gradient(45% 50% at 50% 15%, rgba(14, 116, 144, 0.05), transparent 70%), radial-gradient(38% 42% at 58% 20%, rgba(67, 83, 201, 0.04), transparent 72%)",
          }}
          className="h-full w-full"
        />
      </div>
      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        {/* Section header (Blueprint §15 approved wording). R9: establishes
            with scroll, like every other section on the page. */}
        {/* Left-aligned — a bridge into the solution index, not a scanning
            anchor. See brand-story.tsx. */}
        <ProgressReveal className="max-w-2xl">
          {/* Not a scanning anchor — demoted to the muted micro label so the
              primary eyebrow stays reserved for Services, Work and Process. */}
          <p className={TYPE_MICRO_LABEL}>{BRIDGE.eyebrow}</p>
          <h2 className={`mt-3 ${TYPE_SECTION}`}>
            {HEADING_MAIN || BRIDGE.heading}
            {HEADING_MAIN && (
              <span style={BRAND_TEXT_GRADIENT}>{HEADING_ACCENT}</span>
            )}
          </h2>
          <p className="mt-4 text-muted-foreground">{BRIDGE.sub}</p>
        </ProgressReveal>

        <div className="mt-16 grid items-stretch gap-10 lg:grid-cols-12">
          {/* ── Industry recognition field (DISCOVER) ──
              Every entry is a real link to its existing solution route.
              Hover/focus preview the industry in the story panel; keyboard
              focus drives the same selection. The panel carries the depth,
              so nothing here is hover-only. */}
          <motion.ol
            variants={fieldVariants}
            {...field}
            className="order-2 grid list-none content-start gap-1.5 md:grid-cols-2 md:gap-x-6 lg:order-1 lg:col-span-5 lg:grid-cols-1"
          >
            {NICHES.map((niche, index) => {
              const isSelected = niche.id === selected.id;
              const nicheStory = getIndustryStory(niche.id);
              const itemAccent = nicheStory?.accent ?? DEFAULT_INDUSTRY_ACCENT;

              return (
                <motion.li key={niche.id} variants={itemVariants}>
                  <Link
                    href={niche.href()}
                    aria-current={isSelected ? "true" : undefined}
                    onMouseEnter={() => setSelectedId(niche.id)}
                    onFocus={() => setSelectedId(niche.id)}
                    onClick={() =>
                      trackEvent("niche_card_click", {
                        niche: niche.id,
                        destination: niche.href(),
                      })
                    }
                    className={cn(
                      "group relative flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                      isSelected
                        ? "border-border-strong bg-card"
                        : "border-transparent hover:border-border-subtle hover:bg-card/60",
                    )}
                  >
                    {/* Stage-color signal line (paired with border + type
                        changes — never color-only meaning). */}
                    {isSelected && (
                      <span
                        aria-hidden
                        className="absolute inset-y-3 left-0 w-0.5 rounded-full"
                        style={{ backgroundColor: `rgb(${itemAccent})` }}
                      />
                    )}
                    <span
                      className={cn(
                        "pt-0.5 text-xs font-medium tabular-nums",
                        isSelected
                          ? "text-foreground"
                          : "text-text-subtle",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block text-sm font-semibold tracking-tight transition-colors",
                          isSelected
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-foreground group-focus-visible:text-foreground",
                        )}
                      >
                        {niche.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-text-subtle">
                        {niche.focus}
                      </span>
                      {/* Mobile-only: the story panel is desktop, so the
                          proof-backed industries carry their verified benefit
                          line in the rail itself below md. */}
                      {nicheStory?.proofProjectId && (
                        <span className="mt-1.5 block text-sm leading-snug text-muted-foreground md:hidden">
                          {niche.hero.headline}
                        </span>
                      )}
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className={cn(
                        "mt-0.5 size-4 shrink-0 transition-all",
                        isSelected
                          ? "text-foreground opacity-100"
                          : "opacity-0 group-hover:opacity-60 group-focus-visible:opacity-100",
                      )}
                    />
                  </Link>
                </motion.li>
              );
            })}
          </motion.ol>

          {/* ── Business story panel (CONNECT → ENTER) ──
              Resolved at rest for the default industry; crossfades on
              selection. Content is the niche's own verified hero copy plus
              the capability application lines from the presentation map
              (falling back to each vertical's approved plainPromise). */}
          <div className="order-1 hidden md:order-1 md:block md:col-span-12 lg:order-2 lg:col-span-7">
            <div aria-live="polite" className="h-full">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selected.id}
                  variants={panelVariants}
                  initial={shouldReduceMotion ? false : "initial"}
                  animate="animate"
                  exit="exit"
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.18,
                    ease: "easeOut",
                  }}
                  className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-8"
                >
                  {/* Stage-color wash for the selected industry — static,
                      decorative, restrained. */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `radial-gradient(60% 45% at 85% 0%, rgba(${accent}, 0.07), transparent 70%)`,
                    }}
                  />

                  <div className="relative">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-text-subtle">
                      {selected.focus}
                    </p>
                    <h3 className="mt-2 text-balance text-2xl font-semibold tracking-tight text-foreground xl:text-3xl">
                      {selected.hero.headline}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {selected.description}
                    </p>
                  </div>

                  {/* R7.1 -- the industry's main visual artifact: a verified
                      project screenshot rendered as authentic proof, or a
                      clearly conceptual product/system representation for
                      industries without verified client work. */}
                  <div className="relative mt-6">
                    {story?.visual.kind === "real" ? (
                      <RealWorkVisual
                        image={story.visual.image}
                        alt={story.visual.alt}
                        width={story.visual.width}
                        height={story.visual.height}
                      />
                    ) : (
                      <ConceptVisual id={selected.id} />
                    )}
                  </div>

                  {/* System flow: the journey the digital system enables. */}
                  {story && (
                    <div className="relative mt-5">
                      <IndustryStoryStrip labels={story.story} accent={accent} />
                    </div>
                  )}

                  <div className="relative mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
                    {/* Small proof reference — project evidence, never a
                        duplicate case study; industries without a real
                        project render no proof line. */}
                    {proof && (
                      <Link
                        href={proofDestination(proof.id)}
                        onClick={() =>
                          trackEvent("work_cta_click", {
                            cta_location: "industry-discovery",
                            cta_label: `${proof.id}-proof`,
                          })
                        }
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                      >
                        <span
                          aria-hidden
                          className="size-1.5 rounded-full"
                          style={{ backgroundColor: `rgb(${accent})` }}
                        />
                        Real work: {proof.headline}
                        <ArrowUpRight aria-hidden className="size-3.5" />
                      </Link>
                    )}
                    <Link
                      href={selected.href()}
                      onClick={() =>
                        trackEvent("niche_card_click", {
                          niche: selected.id,
                          destination: selected.href(),
                        })
                      }
                      className="ml-auto inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform duration-200 hover:scale-[1.02] motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      Explore {selected.title}
                      <ArrowRight aria-hidden className="size-4" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
