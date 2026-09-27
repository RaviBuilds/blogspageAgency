import { WEB_DESIGN_PROCESS } from "@/lib/web-design-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProcessSection() {
  const { eyebrow, h2, lead, steps } = WEB_DESIGN_PROCESS;

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

        {/* 5-Stage Process Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((item) => (
            <Card
              key={item.step}
              className="flex flex-col justify-between overflow-hidden border-border bg-card p-5 shadow-xs transition-all duration-200 hover:border-border-strong hover:shadow-md"
            >
              <div>
                <span className="text-2xl font-bold tracking-tight text-accent-blue sm:text-3xl">
                  {item.step}
                </span>

                <CardHeader className="p-0 mt-3">
                  <CardTitle className="text-base font-semibold leading-snug tracking-tight text-foreground">
                    <h3>{item.title}</h3>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-0 mt-2.5">
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {item.description}
                  </p>
                </CardContent>
              </div>

              <div className="mt-4 pt-3 border-t border-border-subtle">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-text-subtle">
                  Deliverable
                </span>
                <span className="mt-1 block text-xs font-medium text-foreground">
                  {item.deliverable}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
