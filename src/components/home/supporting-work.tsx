import Image from "next/image";

import { projects, type FeaturedProject } from "@/lib/featured-work-data";
import { SUPPORTING, SUPPORTING_PROJECT_IDS } from "@/lib/homepage-data";

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 4b — Supporting work (Blueprint §14)

   "More systems we've built." — the quieter compact field after the flagship
   stories. Server component by design: no Framer Motion, no client boundary,
   no pinned scroll. It exists to be complete and cheap.

   Contracts:
   - `id="more-work"` is created here, repairing the two proof links in the
     verticals section that previously resolved to the page top.
   - Projects are derived by filtering `featured-work-data.ts` against
     SUPPORTING_PROJECT_IDS — never hardcoded — and the section renders
     nothing at all when that filter is empty (same data-gated pattern as
     the rest of the site; no placeholder cards).
   ───────────────────────────────────────────────────────────────────────────── */

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
      className="dark scroll-mt-24 border-t border-border-subtle bg-background py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {SUPPORTING.heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground lg:text-base">
            {SUPPORTING.sub}
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {supporting.map((project) => (
            <article
              key={project.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-dark-raised/60 p-5"
              style={{ "--card-accent": project.accent } as React.CSSProperties}
            >
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-30`}
              />

              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={project.image}
                  alt={project.headline}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-contain object-center brightness-90"
                />
              </div>

              <div className="relative z-10 flex flex-1 flex-col pt-5">
                <span
                  className="inline-block w-fit rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em]"
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

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border-subtle bg-card px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

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
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
