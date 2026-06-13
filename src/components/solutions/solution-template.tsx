import Link from "next/link";
import { ArrowRight, Check, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/solutions/fade-up";
import { SolutionHero } from "@/components/solutions/solution-hero";
import type { Niche } from "@/lib/niches";

type SolutionTemplateProps = {
  niche: Niche;
  /** Raw city slug, e.g. "hyderabad". */
  city: string;
};

const titleCase = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export function SolutionTemplate({ niche, city }: SolutionTemplateProps) {
  const cityLabel = titleCase(city);

  return (
    <div className="relative overflow-hidden">
      <SolutionHero niche={niche} city={city} cityLabel={cityLabel} />

      {/* The Problem — Financial Bleed */}
      <section className="border-t border-white/[0.06] py-20 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <FadeUp>
            <p className="text-sm font-medium text-primary">The Problem</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              {niche.problem.heading}
            </h2>
            <p className="mt-4 text-muted-foreground">{niche.problem.lead}</p>
          </FadeUp>
          <div className="grid gap-4">
            {niche.problem.points.map((point, index) => (
              <FadeUp key={point} delay={index * 0.08}>
                <div className="flex gap-3 rounded-xl border border-white/[0.08] bg-card p-5 text-sm leading-relaxed text-muted-foreground">
                  <TrendingDown className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{point}</span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* The Custom Solution */}
      <section className="border-t border-white/[0.06] py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <div className="grid gap-10 rounded-2xl border border-white/[0.08] bg-card p-8 lg:grid-cols-[0.8fr_1.2fr] lg:p-10">
              <div>
                <p className="text-sm font-medium text-primary">The Solution</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  {niche.solution.heading}
                </h2>
              </div>
              <div>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {niche.solution.lead}
                </p>
                <ul className="mt-6 grid gap-3">
                  {niche.solution.capabilities.map((capability) => (
                    <li
                      key={capability}
                      className="flex gap-3 text-sm text-muted-foreground"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Dashboard Previews — mockup containers */}
      <section className="border-t border-white/[0.06] py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">Dashboard Previews</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                The interface your team actually operates.
              </h2>
            </div>
          </FadeUp>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {niche.dashboards.map((dashboard, index) => (
              <FadeUp key={dashboard.title} delay={index * 0.08}>
                <article className="overflow-hidden rounded-xl border border-white/[0.08] bg-card transition-colors hover:border-white/[0.16]">
                  {/* Mockup container: window chrome + skeleton surface */}
                  <div className="border-b border-white/[0.06] bg-popover px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="size-2.5 rounded-full bg-white/15" />
                      <span className="size-2.5 rounded-full bg-white/15" />
                      <span className="size-2.5 rounded-full bg-white/15" />
                    </div>
                  </div>
                  <div
                    className="relative aspect-[16/10] bg-[linear-gradient(135deg,var(--popover),var(--background))]"
                    aria-hidden
                  >
                    <div className="absolute inset-0 p-5">
                      <div className="h-3 w-1/3 rounded-full bg-white/10" />
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        <div className="h-16 rounded-lg border border-white/[0.06] bg-white/[0.03]" />
                        <div className="h-16 rounded-lg border border-white/[0.06] bg-white/[0.03]" />
                        <div className="h-16 rounded-lg border border-white/[0.06] bg-primary/15" />
                      </div>
                      <div className="mt-3 h-20 rounded-lg border border-white/[0.06] bg-white/[0.02]" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium">{dashboard.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {dashboard.description}
                    </p>
                  </div>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Localized conversion metrics */}
      <section className="border-t border-white/[0.06] py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <div className="grid gap-4 sm:grid-cols-3">
              {niche.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-white/[0.08] bg-card p-6 text-center"
                >
                  <p className="text-4xl font-semibold tracking-tight text-primary">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Step-by-step launch schedule */}
      <section className="border-t border-white/[0.06] py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">Launch Schedule</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                From kickoff to live in {niche.launchSchedule.length >= 5 ? "under three weeks" : "two weeks"}.
              </h2>
            </div>
          </FadeUp>

          <ol className="mt-12 flex flex-col">
            {niche.launchSchedule.map((phase, index) => (
              <FadeUp key={phase.window} delay={index * 0.06}>
                <li className="relative flex gap-6 border-l border-white/[0.1] pb-8 pl-6 last:pb-0">
                  <span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-primary" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                      {phase.window}
                    </p>
                    <h3 className="mt-1 text-lg font-medium tracking-tight">
                      {phase.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {phase.detail}
                    </p>
                  </div>
                </li>
              </FadeUp>
            ))}
          </ol>
        </div>
      </section>

      {/* Local SEO CTA */}
      <section className="border-t border-white/[0.06] py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-card p-10 text-center lg:p-14">
              <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative mx-auto max-w-2xl">
                <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  Build your {niche.title.toLowerCase()} platform in {cityLabel}.
                </h2>
                <p className="mt-4 text-muted-foreground">
                  {niche.seoLabel} Partner with a team that ships
                  production-grade systems for {cityLabel} businesses.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    className="glow-border h-11 bg-primary px-6 text-primary-foreground transition-transform hover:bg-primary/90 active:scale-[0.98]"
                    asChild
                  >
                    <Link href={`/#contact?niche=${niche.id}&city=${city}`}>
                      Start a Project
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-11 border-white/10 bg-transparent px-6 hover:bg-white/[0.04]"
                    asChild
                  >
                    <Link href="/#process">See our process</Link>
                  </Button>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
