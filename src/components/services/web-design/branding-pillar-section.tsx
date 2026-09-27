import { Info } from "lucide-react";
import { WEB_DESIGN_BRANDING } from "@/lib/web-design-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BrandingPillarSection() {
  const { eyebrow, h2, lead, elements, boundaryNote } = WEB_DESIGN_BRANDING;

  return (
    <section className="border-b border-border bg-background py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-wider text-accent-violet uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl text-balance">
            {h2}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {lead}
          </p>
        </div>

        {/* 4 Brand Application Cards Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {elements.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col justify-between overflow-hidden border-border bg-card p-6 shadow-xs transition-all duration-200 hover:border-border-strong hover:shadow-md"
            >
              <div>
                <CardHeader className="p-0">
                  <div className="size-2 rounded-full bg-accent-violet" />
                  <CardTitle className="mt-3 text-base font-semibold tracking-tight text-foreground">
                    <h3>{item.title}</h3>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-3">
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {item.description}
                  </p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Boundary Disclaimer Box */}
        <div className="mx-auto mt-12 max-w-3xl rounded-xl border border-accent-violet/20 bg-accent-violet/5 p-4.5 sm:p-5">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 size-4 shrink-0 text-accent-violet" />
            <div className="text-xs leading-relaxed text-foreground/80 sm:text-sm">
              <span className="font-semibold text-foreground">
                {boundaryNote.title}{" "}
              </span>
              <span>{boundaryNote.text}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
