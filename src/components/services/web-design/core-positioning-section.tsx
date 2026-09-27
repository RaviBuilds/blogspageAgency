import { Check } from "lucide-react";
import { WEB_DESIGN_CORE_POSITIONING } from "@/lib/web-design-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CorePositioningSection() {
  const { eyebrow, h2, lead, supportingCopy, pillars } =
    WEB_DESIGN_CORE_POSITIONING;

  return (
    <section className="border-b border-border bg-background py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-wider text-accent-blue uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl text-balance">
            {h2}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {lead}
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {pillars.map((pillar) => {
            const isPrimary = pillar.id === "web-design";

            const badgeStyles = {
              blue: "border-accent-blue/30 bg-accent-blue/10 text-accent-blue",
              violet:
                "border-accent-violet/30 bg-accent-violet/10 text-accent-violet",
              cyan: "border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan",
            }[pillar.accent];

            const borderHighlight = isPrimary
              ? "border-primary/40 ring-1 ring-primary/20 shadow-md"
              : "border-border shadow-xs";

            return (
              <Card
                key={pillar.id}
                className={`relative flex flex-col justify-between overflow-hidden bg-card p-6 sm:p-8 transition-all duration-200 hover:border-border-strong ${borderHighlight}`}
              >
                <div>
                  {/* Top row with Percentage and Role */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                      {pillar.percentage}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${badgeStyles}`}
                    >
                      {pillar.role}
                    </span>
                  </div>

                  <CardHeader className="p-0 mt-6">
                    <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
                      <h3>{pillar.title}</h3>
                    </CardTitle>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {pillar.description}
                    </p>
                  </CardHeader>

                  <CardContent className="p-0 mt-6 pt-6 border-t border-border-subtle">
                    <ul className="space-y-2.5 text-sm text-foreground/80">
                      {pillar.capabilities.map((cap) => (
                        <li key={cap} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 size-4 shrink-0 text-accent-blue" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Supporting Copy Summary */}
        <div className="mt-12 text-center">
          <p className="mx-auto max-w-2xl text-sm italic text-text-subtle">
            {supportingCopy}
          </p>
        </div>
      </div>
    </section>
  );
}
