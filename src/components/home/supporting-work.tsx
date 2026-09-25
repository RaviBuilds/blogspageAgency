import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { projects, type FeaturedProject } from "@/lib/featured-work-data";
import { SUPPORTING, SUPPORTING_PROJECT_IDS } from "@/lib/homepage-data";
import { TrackedLink } from "@/components/home/tracked-link";
import { ProgressReveal } from "@/components/home/progress-reveal";
import { SectionSeam } from "@/components/home/section-seam";
import { RHYTHM_CONTINUE } from "@/lib/section-rhythm";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 4b — Supporting work (Blueprint §14, R6)

   "More systems we've built." — the quieter archive after the three flagship
   stories. Server component by design: no Framer Motion, no client boundary,
   no pinned scroll. It exists to be complete and cheap; the only client
   island is the `TrackedLink` wrapper that gives each card its real link.

   R6 changes:
   - Light archive composition: a wide + narrow asymmetric pair instead of a
     repetitive portfolio grid. Deliberately lighter than the flagship
     stories — no browser chrome, smaller type scale, no motion choreography.
   - Every card links into its project's existing solution / Service_Route
     destination from `featured-work-data.ts` (no invented routes) and fires
     the existing `work_cta_click` event with `cta_location: "supporting-work"`.

   Contracts preserved:
   - `id="more-work"` is created here (the verticals proof links depend on it).
   - Projects are derived by filtering `featured-work-data.ts` against
     SUPPORTING_PROJECT_IDS — never hardcoded — and the section renders
     nothing at all when that filter is empty (no placeholder cards).
   ──────────────────────────────────────────────────────────────────────────── */

export function SupportingWork() {
  const supporting = SUPPORTING_PROJECT_IDS.map((id) =>
    projects.find((project) => project.id === id),
  ).filter((project): project is FeaturedProject => Boolean(project));

  if (supporting.length === 0) {
    return null;
  }

  return (
    <section
      id="more-work"
      className={cn(
        "dark relative scroll-mt-24 border-t border-border-subtle bg-background",
        /* CONTINUE: the archive is the second half of the flagship gallery
           above, not a new movement. The tight top pad binds the two. */
        RHYTHM_CONTINUE,
      )}
    >
      {/* R6.1: a slightly cooler tonal band opens the archive — a quiet shift
          out of the flagship chapters, still one dark language. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.015] to-transparent"
      />
      {/* Section seam — the dark island dissolves back into the light page
          tone as its bottom edge rises toward mid-viewport, so the handoff
          into By Industry reads as one continuous tonal shift instead of a
          hard theme flip. `neighbour="subtle"` is BentoGrid's surface directly
          below. Decorative, behind content. */}
      <SectionSeam edge="bottom" neighbour="subtle" depth="md" />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <ProgressReveal distance={20}>
          <div className="flex items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {SUPPORTING.heading}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground lg:text-base">
                {SUPPORTING.sub}
              </p>
            </div>
            {/* Editorial hairline — the archive reads as a curated index. */}
            <div
              aria-hidden
              className="mb-2 hidden h-px flex-1 bg-gradient-to-r from-border to-transparent lg:block"
            />
          </div>
        </ProgressReveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-5">
          {supporting.map((project, index) => (
            <ProgressReveal
              key={project.id}
              className={index === 0 ? "lg:col-span-3" : "lg:col-span-2"}
              enterAt={index * 0.12}
              completeBy={0.55 + index * 0.12}
              distance={20}
            >
              <SupportingCard project={project} wide={index === 0} />
            </ProgressReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SupportingCard({
  project,
  wide,
}: {
  project: FeaturedProject;
  wide: boolean;
}) {
  const cardClassName = cn(
    "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-card/70 p-5 transition-colors hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  );

  const body = (
    <>
      {/* Localized per-project accent field — quiet, static, decorative. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(72% 55% at 16% 0%, rgba(${project.accent}, 0.08), transparent 70%)`,
        }}
      />

      <div className="relative aspect-[16/9] w-full">
        <Image
          src={project.image}
          alt={`${project.headline} — live product screenshot`}
          fill
          sizes={
            wide
              ? "(min-width: 1024px) 660px, 100vw"
              : "(min-width: 1024px) 440px, 100vw"
          }
          className="object-contain object-center brightness-90 transition-all duration-500 group-hover:brightness-100"
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col pt-5">
        <span
          /* 12px floor — real content, see featured-work.tsx. */
          className="inline-block w-fit rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-[0.16em]"
          style={{
            borderColor: `rgba(${project.accent}, 0.3)`,
            color: `rgba(${project.accent}, 0.9)`,
          }}
        >
          {project.tag}
        </span>

        <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
          {project.headline}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {project.description}
        </p>

        <ul className="mt-4 flex flex-col gap-1">
          {project.metrics.map((metric) => (
            <li
              key={metric.label}
              className="text-xs font-medium text-muted-foreground"
            >
              {metric.label}:{" "}
              <span className="text-foreground">{metric.value}</span>{" "}
              <span className="text-text-subtle">({metric.basis})</span>
            </li>
          ))}
        </ul>

        {/* The card IS the link — this label tells the visitor where it goes. */}
        {project.solutionCta ? (
          <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-foreground/80 transition-colors group-hover:text-foreground">
            {project.solutionCta}
            <ArrowUpRight
              aria-hidden
              className="size-4"
              style={{ color: `rgba(${project.accent}, 0.9)` }}
            />
          </span>
        ) : null}
      </div>
    </>
  );

  if (!project.solutionHref) {
    return (
      <article
        className={cardClassName}
        style={{ "--card-accent": project.accent } as React.CSSProperties}
      >
        {body}
      </article>
    );
  }

  return (
    <TrackedLink
      href={project.solutionHref}
      ctaLabel={project.id}
      ctaLocation="supporting-work"
      aria-label={`${project.headline} — ${project.solutionCta}`}
      className={cardClassName}
      style={{ "--card-accent": project.accent } as React.CSSProperties}
    >
      {body}
    </TrackedLink>
  );
}
