import { LayoutTemplate, MapPinOff, Smartphone, type LucideIcon } from "lucide-react";
import { WEB_DESIGN_PROBLEMS } from "@/lib/web-design-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutTemplate,
  MapPinOff,
  Smartphone,
};

export function BusinessProblemSection() {
  const { eyebrow, h2, lead, cards } = WEB_DESIGN_PROBLEMS;

  return (
    <section className="border-b border-border bg-background-subtle/50 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-wider text-accent-cyan uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl text-balance">
            {h2}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {lead}
          </p>
        </div>

        {/* 3 Problem Cards Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = ICON_MAP[card.iconName];

            return (
              <Card
                key={card.id}
                className="relative overflow-hidden border-border bg-card shadow-xs transition-all duration-200 hover:border-border-strong hover:shadow-md"
              >
                <CardHeader className="p-6 pb-2">
                  <div className="flex size-11 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 text-destructive">
                    {Icon ? <Icon className="size-5" /> : null}
                  </div>
                  <CardTitle className="mt-4 text-lg font-semibold leading-snug tracking-tight text-foreground">
                    <h3>{card.title}</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-2">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
