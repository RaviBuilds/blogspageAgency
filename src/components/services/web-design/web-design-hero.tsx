import Link from "next/link";
import { ArrowDown, Sparkles } from "lucide-react";
import { WEB_DESIGN_HERO } from "@/lib/web-design-data";
import { WebDesignChatTrigger } from "./web-design-chat-trigger";
import { Button } from "@/components/ui/button";

export function WebDesignHero() {
  const {
    eyebrow,
    h1,
    subhead,
    lead,
    primaryCtaLabel,
    secondaryCtaLabel,
    microcopy,
    pillarsSummary,
  } = WEB_DESIGN_HERO;

  return (
    <section className="relative overflow-hidden border-b border-border bg-background pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32">
      {/* Background radial gradient accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/10 via-accent-cyan/5 to-transparent blur-3xl"
      />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-semibold tracking-wider text-text-subtle uppercase shadow-xs">
            <span className="size-1.5 rounded-full bg-accent-blue" />
            <span>{eyebrow}</span>
          </div>

          {/* Single canonical H1 */}
          <h1 className="mt-8 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            {h1}
          </h1>

          {/* Subheading H2 */}
          <h2 className="mt-6 text-xl font-medium tracking-tight text-text-subtle sm:text-2xl text-balance">
            {subhead}
          </h2>

          {/* Lead paragraph */}
          <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {lead}
          </p>

          {/* CTA Actions */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <WebDesignChatTrigger
              label={primaryCtaLabel}
              variant="hero"
              showSparkle
            />
            <Button
              variant="outline"
              size="lg"
              asChild
              className="h-12 rounded-full border-border bg-card px-6 text-sm font-semibold text-foreground transition-all duration-200 hover:border-border-strong hover:bg-background-subtle"
            >
              <Link href="#design-scope">
                <span>{secondaryCtaLabel}</span>
                <ArrowDown className="size-4 text-muted-foreground" />
              </Link>
            </Button>
          </div>

          {/* Microcopy reassurance */}
          <p className="mt-4 text-xs text-text-disabled">{microcopy}</p>

          {/* 70/20/10 Summary Chips */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {pillarsSummary.map((pill) => {
              const accentStyles = {
                blue: "border-accent-blue/20 bg-accent-blue/5 text-accent-blue",
                violet:
                  "border-accent-violet/20 bg-accent-violet/5 text-accent-violet",
                cyan: "border-accent-cyan/20 bg-accent-cyan/5 text-accent-cyan",
              }[pill.accent];

              return (
                <div
                  key={pill.label}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium sm:text-sm ${accentStyles}`}
                >
                  <span className="font-semibold">{pill.percentage}</span>
                  <span className="text-foreground/70">{pill.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
