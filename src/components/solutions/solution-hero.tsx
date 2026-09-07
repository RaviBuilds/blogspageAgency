import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/solutions/fade-up";
import type { Niche } from "@/lib/niches";

type SolutionHeroProps = {
  niche: Niche;
  city: string;
  cityLabel: string;
};

export function SolutionHero({ niche, city, cityLabel }: SolutionHeroProps) {
  const Icon = niche.icon;

  return (
    <section className="relative isolate overflow-hidden">
      <div className="gradient-mesh pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_72%)]" />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="max-w-3xl">
          <FadeUp>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-xs text-muted-foreground">
              <Icon className="size-3.5 text-primary" />
              {niche.title} solution · {cityLabel}
            </div>
          </FadeUp>

          <FadeUp delay={0.06}>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {niche.hero.headline}
              <span className="mt-2 block text-2xl font-medium text-muted-foreground sm:text-3xl">
                Serving {cityLabel} businesses.
              </span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.12}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {niche.hero.subhead} Built for businesses in {cityLabel}.
            </p>
          </FadeUp>

          <FadeUp delay={0.18}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="glow-border h-11 bg-primary px-6 text-primary-foreground transition-transform hover:bg-primary/90 active:scale-[0.98]"
                asChild
              >
                <Link href={`/#contact?niche=${niche.id}&city=${city}`}>
                  Start a project in {cityLabel}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 px-6"
                asChild
              >
                <Link href="/solutions">View all solutions</Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
