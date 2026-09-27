import { WEB_DESIGN_LAUNCH_FOUNDATION } from "@/lib/web-design-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DigitalLaunchFoundationSection() {
  const { eyebrow, h2, lead, items, ownershipNote } =
    WEB_DESIGN_LAUNCH_FOUNDATION;

  return (
    <section className="border-b border-border bg-background py-20 sm:py-24 lg:py-28">
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

        {/* 6 Launch Infrastructure Items Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col justify-between overflow-hidden border-border bg-card p-6 shadow-xs transition-all duration-200 hover:border-border-strong hover:shadow-md"
            >
              <div>
                <CardHeader className="p-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent-cyan">
                    Setup & Deploy
                  </span>
                  <CardTitle className="mt-2 text-base font-semibold tracking-tight text-foreground sm:text-lg">
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

        {/* Ownership Transparency Note */}
        <div className="mt-12 text-center">
          <p className="mx-auto max-w-2xl text-xs text-text-subtle sm:text-sm">
            {ownershipNote}
          </p>
        </div>
      </div>
    </section>
  );
}
