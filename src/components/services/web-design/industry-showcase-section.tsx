import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WEB_DESIGN_INDUSTRY_ROUTER } from "@/lib/web-design-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function IndustryShowcaseSection() {
  const { eyebrow, h2, lead, supportingCopy, industries } =
    WEB_DESIGN_INDUSTRY_ROUTER;

  return (
    <section className="border-b border-border bg-background-subtle/30 py-20 sm:py-24 lg:py-28">
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

        {/* 10 Verified Industry Cards Grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((item) => (
            <Card
              key={item.id}
              className="group flex flex-col justify-between overflow-hidden border-border bg-card p-6 shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-accent-cyan">
                    {item.focus}
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                </div>

                <CardHeader className="p-0 mt-3">
                  <CardTitle className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    <h3>{item.name}</h3>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-0 mt-2.5">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </div>

              <div className="mt-5 pt-4 border-t border-border-subtle">
                <Link
                  href={item.route}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  <span>Explore {item.name} Blueprint</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Router Supporting Copy */}
        <div className="mt-12 text-center">
          <p className="text-sm text-text-subtle">{supportingCopy}</p>
        </div>
      </div>
    </section>
  );
}
