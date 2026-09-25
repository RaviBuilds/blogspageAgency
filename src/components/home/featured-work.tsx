"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { projects, type FeaturedProject } from "@/lib/featured-work-data";
import { FLAGSHIP_PROJECT_IDS, PROOF } from "@/lib/homepage-data";
import {
  BRAND_TEXT_GRADIENT_ISLAND,
  TYPE_EYEBROW,
  TYPE_SECTION,
} from "@/lib/brand-type";
import { RHYTHM_MOVEMENT } from "@/lib/section-rhythm";
import { trackEvent } from "@/lib/analytics";
import { SystemFlow } from "@/components/home/system-flow";
import {
  ProgressReveal,
  useMotionReady,
  useStage,
} from "@/components/home/progress-reveal";
import { SectionSeam } from "@/components/home/section-seam";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 4 — Real proof / R6 (Blueprint §13)

   Three flagship stories, one narrative system, three art-directed
   compositions (never a repeated card):

     01 ArogyaDiet  — "system"     screenshot-first + vertical system map
     02 Phixl AI    — "narrative"  story-first + horizontal flow under shot
     03 NeoDent     — "brand"      full-width brand plate + ribbon flow

   Scroll language is PROBLEM → BUILD → SYSTEM: each story runs its own
   once-only `whileInView` stage sequence (category → title → problem →
   screenshot → system flow → evidence → CTA) in normal document flow.
   No pinning, no scroll hijack, no timers. Reduced motion renders the
   whole chain statically visible.

   Preserved contracts:
   - `id="work"` stays on this section for every breakpoint.
   - Data stays in `featured-work-data.ts`, still shared with `/about`.
   - Only FLAGSHIP_PROJECT_IDS render; the list now resolves arogyadiet,
     phixl-ai and neodent (NeoDent's evidence gate was satisfied at R6 with
     the owner-supplied asset `/Neodent.jpg` + approved neutral copy).
   - NeoDent carries empty `tech` / `metrics`; every evidence block
     tolerates empty arrays — no placeholders, no invented claims.
   - Project CTAs point only at pre-existing solution / Service_Route URLs
     from the data layer and fire the existing `work_cta_click` event with
     a `cta_location` discriminator — no new analytics contract.
   ──────────────────────────────────────────────────────────────────────────── */

/* ── R9 scroll choreography ──────────────────────────────────────────────────
   Each flagship story is driven by its own scroll progress (0 when the
   article's top enters at 85% of the viewport, 1 when its bottom reaches
   75%). The narrative stages below are slices of that progress, so the
   chapter builds in reading order while scrolling down and dissolves back in
   exactly the reverse order when scrolling up. Pure MotionValues — no
   per-frame React state, no pinning, no timers. Reduced motion resolves
   every slice to its settled state. */

const STORY_STAGE_RANGES: Record<
  | "atmosphere"
  | "category"
  | "title"
  | "problem"
  | "media"
  | "flow"
  | "description"
  | "evidence"
  | "cta",
  [number, number]
> = {
  atmosphere: [0.04, 0.38],
  category: [0.0, 0.12],
  title: [0.05, 0.2],
  problem: [0.1, 0.26],
  media: [0.12, 0.34],
  flow: [0.28, 0.62],
  description: [0.32, 0.52],
  evidence: [0.42, 0.62],
  cta: [0.5, 0.7],
};

/* One scroll progress per story article, shared by every stage inside it. */
function useStoryProgress() {
  const articleRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const settled = useMotionValue(1);
  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start 0.85", "end 0.75"],
  });
  return {
    articleRef,
    progress: shouldReduceMotion ? settled : scrollYProgress,
  };
}

/**
 * R6.1 heading treatment — parity with the other homepage sections: the
 * neutral headline stays neutral; the meaningful final phrase carries the
 * brand text sweep. This section is dark-surface, so the sweep uses the
 * Hero's light-signal gradient (the same values the dark Hero uses), not
 * the darker light-surface triad. No data change — the phrase is sliced
 * from the existing `PROOF.heading` string, with a safe whole-heading
 * fallback if the data ever drifts.
 */
const HEADING_TEXT = PROOF.heading;
const HEADING_ACCENT = "the back office.";
const HEADING_MAIN = HEADING_TEXT.endsWith(HEADING_ACCENT)
  ? HEADING_TEXT.slice(0, HEADING_TEXT.length - HEADING_ACCENT.length)
  : "";





type StoryLayout = "system" | "narrative" | "brand";

/* One art-directed composition per flagship story (R6 controlled asymmetry).
   Unknown ids fall back to alternating layouts so the section never breaks. */
const STORY_LAYOUTS: Record<string, StoryLayout> = {
  arogyadiet: "system",
  "phixl-ai": "narrative",
  neodent: "brand",
};

/* ── R6.1 environment — dark editorial product gallery ────────────────────── */

/* Localized atmospheric field for one project chapter: a subtle light in a
   dark room (≈5–8% perceived influence), positioned over the screenshot side
   of the story. Desktop-only — mobile keeps the same dark language but drops
   the field complexity. Static; never animated; aria-hidden. */
function ChapterAtmosphere({
  accent,
  side,
  opacity,
}: {
  accent: string;
  /** Which side of the chapter the light sits on (the screenshot side). */
  side: "left" | "right" | "center";
  /** R9: scroll-linked presence — the light rides the chapter's progress. */
  opacity?: MotionValue<number>;
}) {
  const x = side === "left" ? "30%" : side === "right" ? "70%" : "50%";
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-[-6%] -top-16 bottom-0 hidden lg:block"
      style={{
        background: `radial-gradient(48% 42% at ${x} 34%, rgba(${accent}, 0.07), transparent 70%)`,
        ...(opacity ? { opacity } : {}),
      }}
    />
  );
}

/* Ghosted chapter numeral — the subconscious "chapter 01/02/03" marker.
   Decorative; derived from story position; carries no copy. R9: its presence
   fades in with the chapter's scroll progress instead of being always-on. */
function GhostIndex({
  chapter,
  opacity,
}: {
  chapter: number;
  opacity?: MotionValue<number>;
}) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute -top-8 right-0 hidden select-none text-[8rem] font-semibold leading-none tracking-tighter text-white/[0.035] lg:block"
      style={opacity ? { opacity } : undefined}
    >
      {String(chapter).padStart(2, "0")}
    </motion.div>
  );
}

/* Edge-lit product plinth. A hairline gradient edge (project accent → quiet
   white) separates the real screenshot from the dark environment, a soft
   floor shadow grounds it, and a tight local glow lifts the screenshot's
   immediate surroundings. The screenshot itself is never dimmed or
   recolored. Pass `className="h-full"` when the stage must fill a fixed
   aspect box (browser-chrome presentations). */
function ScreenshotStage({
  accent,
  className,
  children,
}: {
  accent: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("relative", className)}>
      {/* Floor shadow — grounds the exhibit without a fake reflection. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-10 -bottom-5 h-8 rounded-[100%] bg-black/70 blur-2xl"
      />
      {/* Tight local glow immediately behind the frame. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-3xl"
        style={{
          background: `radial-gradient(60% 55% at 50% 45%, rgba(${accent}, 0.09), transparent 75%)`,
        }}
      />
      {/* Edge-lit plinth: 1px gradient hairline as the frame's edge light. */}
      <div
        className="relative flex h-full w-full flex-col rounded-2xl p-[1px]"
        style={{
          background: `linear-gradient(155deg, rgba(${accent}, 0.38) 0%, rgba(255, 255, 255, 0.06) 45%, rgba(${accent}, 0.1) 100%)`,
        }}
      >
        <div className="flex h-full w-full flex-col overflow-hidden rounded-[15px] bg-surface-dark-raised">
          {children}
        </div>
      </div>
    </div>
  );
}

/* The numeric figure and its "estimated" basis always share one visible
   block — the honesty pattern from featured-work-data.ts, preserved.
   An empty list (e.g. NeoDent, which has no verified figures) renders
   nothing — never a placeholder claim. */
function MetricLine({
  metrics,
  progress,
}: {
  metrics: FeaturedProject["metrics"];
  progress: MotionValue<number>;
}) {
  const ready = useMotionReady();
  const reveal = useStage(progress, STORY_STAGE_RANGES.evidence);
  if (metrics.length === 0) {
    return null;
  }
  return (
    <motion.ul
      style={ready ? { opacity: reveal.opacity, y: reveal.y } : undefined}
      className="flex flex-col gap-1"
    >
      {metrics.map((metric) => (
        <li
          key={metric.label}
          className="text-xs font-medium text-muted-foreground md:text-sm"
        >
          {metric.label}: <span className="text-foreground">{metric.value}</span>{" "}
          <span className="text-text-subtle">({metric.basis})</span>
        </li>
      ))}
    </motion.ul>
  );
}

function BrowserChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-surface-dark-raised">
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

/* ── Story atoms ─────────────────────────────────────────────────────────── */

function StoryHeader({
  project,
  progress,
}: {
  project: FeaturedProject;
  progress: MotionValue<number>;
}) {
  const ready = useMotionReady();
  const category = useStage(progress, STORY_STAGE_RANGES.category);
  const title = useStage(progress, STORY_STAGE_RANGES.title);
  const problem = useStage(progress, STORY_STAGE_RANGES.problem);

  return (
    <>
      {/* CATEGORY — the capability pillar this project proves */}
      <motion.span
        className="inline-block w-fit rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]"
        style={
          ready
            ? {
                opacity: category.opacity,
                y: category.y,
                borderColor: `rgba(${project.accent}, 0.3)`,
                color: `rgba(${project.accent}, 0.9)`,
              }
            : {
                borderColor: `rgba(${project.accent}, 0.3)`,
                color: `rgba(${project.accent}, 0.9)`,
              }
        }
      >
        {project.category ?? project.tag}
      </motion.span>

      <motion.h3
        className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        style={ready ? { opacity: title.opacity, y: title.y } : undefined}
      >
        {project.headline}
      </motion.h3>

      {/* PROBLEM — why the project existed */}
      {project.storyFrame ? (
        <motion.p
          className="mt-3 max-w-xl border-l-2 pl-4 text-base font-medium text-foreground/90"
          style={
            ready
              ? {
                  opacity: problem.opacity,
                  y: problem.y,
                  borderColor: `rgba(${project.accent}, 0.4)`,
                }
              : { borderColor: `rgba(${project.accent}, 0.4)` }
          }
        >
          {project.storyFrame}
        </motion.p>
      ) : null}
    </>
  );
}

/* PROOF — technology as secondary evidence: one quiet "Built with" line,
   never a logo wall. Empty stack (NeoDent) renders nothing at all. */
function StoryEvidence({
  project,
  progress,
}: {
  project: FeaturedProject;
  progress: MotionValue<number>;
}) {
  const ready = useMotionReady();
  const reveal = useStage(progress, STORY_STAGE_RANGES.evidence);
  return (
    <>
      {project.tech.length > 0 ? (
        <motion.div
          style={ready ? { opacity: reveal.opacity, y: reveal.y } : undefined}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-subtle">
            Built with
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {project.tech.join(" · ")}
          </p>
        </motion.div>
      ) : null}
      <MetricLine metrics={project.metrics} progress={progress} />
    </>
  );
}

/* Where can I learn more? — every flagship story links into an existing
   solution / Service_Route destination carried by the data layer. */
function StoryCta({
  project,
  progress,
}: {
  project: FeaturedProject;
  progress: MotionValue<number>;
}) {
  const ready = useMotionReady();
  const reveal = useStage(progress, STORY_STAGE_RANGES.cta);
  const href = project.solutionHref;
  if (!href || !project.solutionCta) {
    return null;
  }
  return (
    <motion.div
      style={ready ? { opacity: reveal.opacity, y: reveal.y } : undefined}
    >
      <Link
        href={href}
        onClick={() =>
          trackEvent("work_cta_click", {
            cta_location: "featured-work",
            cta_label: `${project.id}-cta`,
            destination: href,
          })
        }
        className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        style={{ borderColor: `rgba(${project.accent}, 0.35)` }}
      >
        {project.solutionCta}
        <ArrowUpRight
          aria-hidden
          className="size-4"
          style={{ color: `rgba(${project.accent}, 0.9)` }}
        />
      </Link>
    </motion.div>
  );
}

function StoryArticle({
  project,
  layout,
  chapter,
}: {
  project: FeaturedProject;
  layout: StoryLayout;
  chapter: number;
}) {
  /* NeoDent routes to its own art-directed composition. */
  if (layout === "brand") {
    return <BrandCaseStory project={project} chapter={chapter} />;
  }
  return <SequenceStory project={project} layout={layout} chapter={chapter} />;
}

/* "system" (ArogyaDiet) / "narrative" (Phixl) compositions, now driven by the
   article's own scroll progress: the narrative order — CATEGORY → TITLE →
   PROBLEM → SCREENSHOT → FLOW → BUILT → PROOF → CTA — builds as slices of
   that progress on the way down and dissolves in reverse on the way up. */
function SequenceStory({
  project,
  layout,
  chapter,
}: {
  project: FeaturedProject;
  layout: StoryLayout;
  chapter: number;
}) {
  const ready = useMotionReady();
  const { articleRef, progress } = useStoryProgress();

  /* "system" (ArogyaDiet): screenshot leads on desktop, vertical system map
     in the story column. "narrative" (Phixl): story leads on desktop,
     horizontal flow directly under the screenshot. Mobile stacks every
     variant as CATEGORY → TITLE → PROBLEM → SCREENSHOT → FLOW → BUILT →
     PROOF → CTA via the order utilities. */
  const mediaFirstOnDesktop = layout === "system";

  const atmosphere = useStage(progress, STORY_STAGE_RANGES.atmosphere, 0);
  const media = useStage(progress, STORY_STAGE_RANGES.media, 28);
  const mediaScale = useTransform(
    progress,
    STORY_STAGE_RANGES.media,
    [0.985, 1],
    { clamp: true },
  );
  const flowProgress = useTransform(
    progress,
    STORY_STAGE_RANGES.flow,
    [0, 1],
    { clamp: true },
  );
  const description = useStage(progress, STORY_STAGE_RANGES.description);

  const mediaStyle = ready
    ? { opacity: media.opacity, y: media.y, scale: mediaScale }
    : undefined;
  const descriptionStyle = ready
    ? { opacity: description.opacity, y: description.y }
    : undefined;

  return (
    <motion.article
      ref={articleRef}
      className="relative flex flex-col gap-8"
      style={{ "--card-accent": project.accent } as React.CSSProperties}
    >
      {/* R6.1 chapter environment: localized light over the screenshot side
          + a ghosted chapter numeral. Desktop-only; R9: both ride the
          chapter's scroll progress instead of being always-on. */}
      <ChapterAtmosphere
        accent={project.accent}
        side={mediaFirstOnDesktop ? "left" : "right"}
        opacity={atmosphere.opacity}
      />
      <GhostIndex chapter={chapter} opacity={atmosphere.opacity} />

      <div className="relative max-w-2xl">
        <StoryHeader project={project} progress={progress} />
      </div>

      <div className="relative grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        {/* BUILD — the real screenshot */}
        <motion.div
          style={mediaStyle}
          className={cn(
            "order-2",
            mediaFirstOnDesktop
              ? "lg:order-1 lg:col-span-7"
              : "lg:order-2 lg:col-span-7",
          )}
        >
          <div className="relative aspect-[16/10] w-full">
            <ScreenshotStage accent={project.accent} className="h-full">
              <BrowserChrome>
                <div className="relative h-full w-full">
                  {/* No `priority`. This gallery sits well below the fold —
                      preloading the first screenshot competed with the hero for
                      bandwidth during the LCP window without ever being the LCP
                      element itself. `next/image` lazy-loads by default, which
                      is the correct behaviour here. */}
                  <Image
                    src={project.image}
                    alt={`${project.headline} — live product screenshot`}
                    fill
                    sizes="(min-width: 1024px) 640px, 100vw"
                    className="object-contain object-center"
                  />
                </div>
              </BrowserChrome>
            </ScreenshotStage>
          </div>
          {layout === "narrative" ? (
            <SystemFlow
              steps={project.visualSequence ?? []}
              orientation="horizontal"
              accent={project.accent}
              progress={flowProgress}
              className="mt-6"
            />
          ) : null}
        </motion.div>

        {/* SYSTEM — the flow connects, then evidence and CTA settle */}
        <div
          className={cn(
            "flex flex-col gap-6",
            mediaFirstOnDesktop
              ? "lg:order-2 lg:col-span-5"
              : "lg:order-1 lg:col-span-5",
          )}
        >
          {layout === "system" ? (
            <div
              className="relative order-2 rounded-xl border bg-card/50 p-4 lg:order-3"
              style={{ borderColor: `rgba(${project.accent}, 0.18)` }}
            >
              {/* The signal rail — the operations story visibly receives
                  from the real product screenshot beside it. */}
              <span
                aria-hidden
                className="absolute left-0 top-4 h-[calc(100%-2rem)] w-[2px] rounded-full"
                style={{
                  background: `linear-gradient(180deg, rgba(${project.accent}, 0.45), rgba(${project.accent}, 0.05))`,
                }}
              />
              <SystemFlow
                steps={project.visualSequence ?? []}
                orientation="vertical"
                accent={project.accent}
                progress={flowProgress}
                className="pl-3"
              />
            </div>
          ) : null}
          <motion.p
            style={descriptionStyle}
            className={cn(
              "text-sm leading-relaxed text-muted-foreground lg:text-base",
              layout === "system" ? "order-3 lg:order-2" : "",
            )}
          >
            {project.description}
          </motion.p>
          <div className="order-4 flex flex-col gap-5">
            <StoryEvidence project={project} progress={progress} />
            <StoryCta project={project} progress={progress} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* NeoDent "brand" composition: header → full-width brand plate → detail band
   + horizontal Brand → Website → Trust → Enquiry ribbon. R9: the whole
   chapter is driven by the article's own scroll progress.

   Named `BrandCaseStory`, not `BrandStory`: the homepage now also has a
   top-level `BrandStory` section (`brand-story.tsx`, the business→brand→
   digital-office narrative). They are unrelated, and two components with the
   same name in the same feature folder is a trap for the next reader. This one
   is a *case study* layout variant, hence the name. */
function BrandCaseStory({
  project,
  chapter,
}: {
  project: FeaturedProject;
  chapter: number;
}) {
  const ready = useMotionReady();
  const { articleRef, progress } = useStoryProgress();

  const atmosphere = useStage(progress, STORY_STAGE_RANGES.atmosphere, 0);
  const media = useStage(progress, STORY_STAGE_RANGES.media, 28);
  const mediaScale = useTransform(
    progress,
    STORY_STAGE_RANGES.media,
    [0.985, 1],
    { clamp: true },
  );
  const flowProgress = useTransform(
    progress,
    STORY_STAGE_RANGES.flow,
    [0, 1],
    { clamp: true },
  );
  const description = useStage(progress, STORY_STAGE_RANGES.description);

  const mediaStyle = ready
    ? { opacity: media.opacity, y: media.y, scale: mediaScale }
    : undefined;
  const descriptionStyle = ready
    ? { opacity: description.opacity, y: description.y }
    : undefined;

  return (
    <motion.article
      ref={articleRef}
      className="relative flex flex-col gap-8"
      style={{ "--card-accent": project.accent } as React.CSSProperties}
    >
      {/* R6.1 chapter environment (presence chapter: centered light). */}
      <ChapterAtmosphere
        accent={project.accent}
        side="center"
        opacity={atmosphere.opacity}
      />
      <GhostIndex chapter={chapter} opacity={atmosphere.opacity} />

      <div className="relative max-w-2xl">
        <StoryHeader project={project} progress={progress} />
      </div>

      {/* The page's ONE full-bleed moment.

          Breakout rather than a wider max-width: the story's own header and
          detail band stay on the `max-w-6xl` measure, and only the product
          image crosses it, so the edge-to-edge width reads as deliberate
          emphasis instead of a different container. Safe because the `#work`
          section carries `overflow-hidden` — a `100vw` child cannot introduce
          a horizontal scrollbar. */}
      <motion.div
        style={mediaStyle}
        className="relative left-1/2 w-screen -translate-x-1/2"
      >
        <BrandPlate project={project} />
      </motion.div>

      <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="order-2 lg:order-1">
          <motion.p
            style={descriptionStyle}
            className="text-sm leading-relaxed text-muted-foreground lg:text-base"
          >
            {project.description}
          </motion.p>
          <div className="mt-6 flex flex-col gap-5">
            <StoryEvidence project={project} progress={progress} />
            <StoryCta project={project} progress={progress} />
          </div>
        </div>
        <SystemFlow
          steps={project.visualSequence ?? []}
          orientation="horizontal"
          accent={project.accent}
          progress={flowProgress}
          className="order-1 self-start lg:order-2 lg:pt-2"
        />
      </div>
    </motion.article>
  );
}

/* NeoDent "brand" frame — the page's one full-bleed product moment.
   The real screenshot stays the visual authority: full fidelity from the
   moment it enters, never dimmed or recolored.

   No `ScreenshotStage` plinth here, unlike the contained stories above. A
   floor shadow, an edge-lit hairline and rounded corners all say "this is an
   object sitting on a surface" — which is exactly right for an exhibit inside
   a measure, and wrong for an image that runs to both edges of the viewport.
   Full bleed means the image *is* the surface, so the framing drops away and
   only the horizontal hairlines above and below remain to seat it in the
   dark section.

   The aspect ratio also has to change with the width: at `100vw` a 3/2 crop
   would stand ~900px tall on a desktop and swallow the whole viewport, so the
   plate flattens progressively as it widens. */
function BrandPlate({ project }: { project: FeaturedProject }) {
  return (
    <figure className="relative border-y border-white/[0.07]">
      {/* Accent wash bleeding from the section into the image edges, so the
          full-bleed plate is seated rather than pasted on. Decorative. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: `linear-gradient(90deg, rgba(${project.accent}, 0.10) 0%, transparent 18%, transparent 82%, rgba(${project.accent}, 0.10) 100%)`,
        }}
      />
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
        <Image
          src={project.image}
          alt={`${project.headline} — live website`}
          fill
          /* Full-bleed at every breakpoint, so the hint is simply the
             viewport width. No `priority`: this is the third story in a
             below-the-fold gallery and must never compete with the hero for
             the LCP window. `next/image` lazy-loads by default. */
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>
      <figcaption className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3 lg:px-8">
        <span className="text-xs font-medium text-muted-foreground">
          {project.headline} — live site
        </span>
        {/* 12px floor, per the P0-2 label pass. */}
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-text-subtle">
          Real screenshot
        </span>
      </figcaption>
    </figure>
  );
}

export function FeaturedProof() {
  // Resolve the evidence-gated flagship list against the real project data.
  // An unknown id can only mean the two modules drifted; dropping it beats
  // rendering an empty card shell.
  const flagship = FLAGSHIP_PROJECT_IDS.map((id) =>
    projects.find((project) => project.id === id),
  ).filter((project): project is FeaturedProject => Boolean(project));

  return (
    <section
      id="work"
      className={cn(
        "dark relative scroll-mt-24 overflow-hidden border-t border-border bg-background",
        RHYTHM_MOVEMENT,
      )}
    >
      {/* Section seam — the light page tone dissolves into the gallery as the
          section enters, and re-forms on the way back up, so the dark island
          no longer starts as a hard cut behind a hairline. `neighbour="page"`
          is ServiceVerticals' surface directly above. Decorative, behind
          content. */}
      <SectionSeam edge="top" neighbour="page" depth="lg" />

      {/* R6.1 environment: a tonal entry band plus a soft blue-violet field
          behind the opening — the visitor enters a designed gallery, not
          another black rectangle. Static, decorative, aria-hidden. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/[0.02] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[64rem] max-w-none -translate-x-1/2"
        style={{
          background:
            "radial-gradient(50% 55% at 50% 20%, rgba(130, 143, 255, 0.06), transparent 70%), radial-gradient(40% 45% at 58% 24%, rgba(167, 139, 250, 0.04), transparent 72%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        {/* R9: the opening establishes with scroll — typography emphasis
            builds as the gallery arrives, reverses on the way up. */}
        <ProgressReveal distance={28} className="mx-auto max-w-2xl text-center">
          {/* Scanning anchor — Work keeps its eyebrow. */}
          <p className={TYPE_EYEBROW}>{PROOF.eyebrow}</p>
          <h2 className={`mt-3 ${TYPE_SECTION}`}>
            {HEADING_MAIN || PROOF.heading}
            {HEADING_MAIN && (
              <span style={BRAND_TEXT_GRADIENT_ISLAND}>{HEADING_ACCENT}</span>
            )}
          </h2>
          <p className="mt-4 text-muted-foreground">{PROOF.sub}</p>
        </ProgressReveal>

        <div className="mt-20 flex flex-col gap-24 lg:gap-36">
          {flagship.map((project, index) => (
            <StoryArticle
              key={project.id}
              project={project}
              layout={
                STORY_LAYOUTS[project.id] ??
                (index % 2 === 0 ? "system" : "narrative")
              }
              chapter={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
