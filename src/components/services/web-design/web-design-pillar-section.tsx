import { ArrowRight, Sparkles } from "lucide-react";
import { WEB_DESIGN_PILLAR } from "@/lib/web-design-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WebDesignChatTrigger } from "./web-design-chat-trigger";

export function WebDesignPillarSection() {
  const { eyebrow, h2, lead, capabilities, ctaLabel } = WEB_DESIGN_PILLAR;

  return (
    <section
      id="design-scope"
      className="border-b border-border bg-background-subtle/30 py-20 sm:py-24 lg:py-28"
    >
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

        {/* 6 Capabilities Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col justify-between overflow-hidden border-border bg-card p-6 shadow-xs transition-all duration-200 hover:border-border-strong hover:shadow-md"
            >
              <div>
                <span className="inline-flex items-center rounded-full border border-border bg-background-subtle px-2.5 py-0.5 text-[11px] font-medium text-text-subtle">
                  {item.tag}
                </span>

                <CardHeader className="p-0 mt-4">
                  <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
                    <h3>{item.title}</h3>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-0 mt-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Mid-Section Chat Trigger */}
        <div className="mt-14 flex justify-center">
          <WebDesignChatTrigger
            label={ctaLabel}
            variant="outline"
            showSparkle
          />
        </div>
      </div>
    </section>
  );
}
