"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { projects, type FeaturedProject } from "@/lib/featured-work-data";
import { FLAGSHIP_PROJECT_IDS, PROOF } from "@/lib/homepage-data";
import { trackEvent } from "@/lib/analytics";
import { SystemFlow } from "@/components/home/system-flow";
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

const BRAND_TEXT_GRADIENT = {
  backgroundImage:
    "linear-gradient(94deg, #67E8F9 0%, #828FFF 48%, #A78BFA 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text",
  color: "transparent",
} as const;

/* R6 story choreography. The article staggers its direct motion children in
   DOM order, which is deliberately the narrative order: the real screenshot
   enters before the system flow connects, and evidence/CTA resolve last. */
const storyStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const stage: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

const mediaStage: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 20, mass: 1 },
  },
};

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
}: {
  accent: string;
  /** Which side of the chapter the light sits on (the screenshot side). */
  side: "left" | "right" | "center";
}) {
  const x = side === "left" ? "30%" : side === "right" ? "70%" : "50%";
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-[-6%] -top-16 bottom-0 hidden lg:block"
      style={{
        background: `radial-gradient(48% 42% at ${x} 34%, rgba(${accent}, 0.07), transparent 70%)`,
      }}
    />
  );
}

/* Ghosted chapter numeral — the subconscious "chapter 01/02/03" marker.
   Decorative; derived from story position; carries no copy. */
function GhostIndex({ chapter }: { chapter: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -top-8 right-0 hidden select-none text-[8rem] font-semibold leading-none tracking-tighter text-white/[0.035] lg:block"
    >
      {String(chapter).padStart(2, "0")}
    </div>
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
}: {
  metrics: FeaturedProject["metrics"];
}) {
  if (metrics.length === 0) {
    return null;
  }
  return (
    <motion.ul variants={stage} className="flex flex-col gap-1">
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

function StoryHeader({ project }: { project: FeaturedProject }) {
  return (
    <>
      {/* CATEGORY — the capability pillar this project proves */}
      <motion.span
        variants={stage}
        className="inline-block w-fit rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]"
        style={{
          borderColor: `rgba(${project.accent}, 0.3)`,
          color: `rgba(${project.accent}, 0.9)`,
        }}
      >
        {project.category ?? project.tag}
      </motion.span>

      <motion.h3
        variants={stage}
        className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
      >
        {project.headline}
      </motion.h3>

      {/* PROBLEM — why the project existed */}
      {project.storyFrame ? (
        <motion.p
          variants={stage}
          className="mt-3 max-w-xl border-l-2 pl-4 text-base font-medium text-foreground/90"
          style={{ borderColor: `rgba(${project.accent}, 0.4)` }}
        >
          {project.storyFrame}
        </motion.p>
      ) : null}
    </>
  );
}

/* PROOF — technology as secondary evidence: one quiet "Built with" line,
   never a logo wall. Empty stack (NeoDent) renders nothing at all. */
function StoryEvidence({ project }: { project: FeaturedProject }) {
  return (
    <>
      {project.tech.length > 0 ? (
        <motion.div variants={stage}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-subtle">
            Built with
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {project.tech.join(" · ")}
          </p>
        </motion.div>
      ) : null}
      <MetricLine metrics={project.metrics} />
    </>
  );
}

/* Where can I learn more? — every flagship story links into an existing
   solution / Service_Route destination carried by the data layer. */
function StoryCta({ project }: { project: FeaturedProject }) {
  const href = project.solutionHref;
  if (!href || !project.solutionCta) {
    return null;
  }
  return (
    <motion.div variants={stage}>
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
  priority,
  chapter,
}: {
  project: FeaturedProject;
  layout: StoryLayout;
  priority: boolean;
  chapter: number;
}) {
  /* NeoDent routes to its own art-directed composition. */
  if (layout === "brand") {
    return <BrandStory project={project} chapter={chapter} />;
  }

  const accentStyle = { "--card-accent": project.accent } as React.CSSProperties;

  /* "system" (ArogyaDiet): screenshot leads on desktop, vertical system map
     in the story column. "narrative" (Phixl): story leads on desktop,
     horizontal flow directly under the screenshot. Mobile stacks every
     variant as CATEGORY → TITLE → PROBLEM → SCREENSHOT → FLOW → BUILT →
     PROOF → CTA via the order utilities. */
  const mediaFirstOnDesktop = layout === "system";

  return (
    <motion.article
      variants={storyStagger}
      className="relative flex flex-col gap-8"
      style={accentStyle}
    >
      {/* R6.1 chapter environment: localized light over the screenshot side
          + a ghosted chapter numeral. Static, decorative, desktop-only. */}
      <ChapterAtmosphere
        accent={project.accent}
        side={mediaFirstOnDesktop ? "left" : "right"}
      />
      <GhostIndex chapter={chapter} />

      <div className="relative max-w-2xl">
        <StoryHeader project={project} />
      </div>

      <div className="relative grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        {/* BUILD — the real screenshot */}
        <motion.div
          variants={mediaStage}
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
                  <Image
                    src={project.image}
                    alt={`${project.headline} — live product screenshot`}
                    fill
                    priority={priority}
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
                className="pl-3"
              />
            </div>
          ) : null}
          <motion.p
            variants={stage}
            className={cn(
              "text-sm leading-relaxed text-muted-foreground lg:text-base",
              layout === "system" ? "order-3 lg:order-2" : "",
            )}
          >
            {project.description}
          </motion.p>
          <div className="order-4 flex flex-col gap-5">
            <StoryEvidence project={project} />
            <StoryCta project={project} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* NeoDent "brand" composition: header → full-width brand plate → detail band
   + horizontal Brand → Website → Trust → Enquiry ribbon. */
function BrandStory({
  project,
  chapter,
}: {
  project: FeaturedProject;
  chapter: number;
}) {
  return (
    <motion.article
      variants={storyStagger}
      className="relative flex flex-col gap-8"
      style={{ "--card-accent": project.accent } as React.CSSProperties}
    >
      {/* R6.1 chapter environment (presence chapter: centered light). */}
      <ChapterAtmosphere accent={project.accent} side="center" />
      <GhostIndex chapter={chapter} />

      <div className="relative max-w-2xl">
        <StoryHeader project={project} />
      </div>

      <motion.div variants={mediaStage} className="relative">
        <BrandPlate project={project} />
      </motion.div>

      <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="order-2 lg:order-1">
          <motion.p
            variants={stage}
            className="text-sm leading-relaxed text-muted-foreground lg:text-base"
          >
            {project.description}
          </motion.p>
          <div className="mt-6 flex flex-col gap-5">
            <StoryEvidence project={project} />
            <StoryCta project={project} />
          </div>
        </div>
        <SystemFlow
          steps={project.visualSequence ?? []}
          orientation="horizontal"
          accent={project.accent}
          className="order-1 self-start lg:order-2 lg:pt-2"
        />
      </div>
    </motion.article>
  );
}

/* NeoDent "brand" frame — a cleaner brand plate instead of mac browser
   chrome on a healthcare brand story. The real screenshot stays the visual
   authority: full fidelity from the moment it enters, never dimmed. */
function BrandPlate({ project }: { project: FeaturedProject }) {
  return (
    <ScreenshotStage accent={project.accent}>
      <div className="relative aspect-[3/2] w-full">
        <Image
          src={project.image}
          alt={`${project.headline} — live website`}
          fill
          sizes="(min-width: 1024px) 1100px, 100vw"
          className="object-cover object-top"
        />
      </div>
      <div className="relative flex items-center justify-between border-t border-border-subtle bg-white/[0.02] px-4 py-2.5">
        <span className="text-xs font-medium text-muted-foreground">
          {project.headline} — live site
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-text-subtle">
          Real screenshot
        </span>
      </div>
    </ScreenshotStage>
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
      className="dark relative scroll-mt-24 overflow-hidden border-t border-border bg-background py-24 lg:py-32"
    >
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
            {HEADING_MAIN || PROOF.heading}
            {HEADING_MAIN && (
              <span style={BRAND_TEXT_GRADIENT}>{HEADING_ACCENT}</span>
            )}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            {PROOF.sub}
          </motion.p>
        </motion.div>

        <div className="mt-20 flex flex-col gap-24 lg:gap-36">
          {flagship.map((project, index) => (
            <StoryArticle
              key={project.id}
              project={project}
              layout={
                STORY_LAYOUTS[project.id] ??
                (index % 2 === 0 ? "system" : "narrative")
              }
              priority={index === 0}
              chapter={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
