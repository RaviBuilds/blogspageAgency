import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { serviceNode } from "@/lib/structured-data";
import { NICHES } from "@/lib/niches";
import { solutionRoutes } from "@/lib/routes";
import { findApprovedCity } from "@/lib/cities";

export const metadata: Metadata = buildMetadata({
  path: "/solutions",
  title: "Solutions Hub: ai business solutions by industry",
  description:
    "Explore ten AI-powered business solution websites for delivery, hotels, pet care, consulting, education, fitness, and more, built for Hyderabad businesses.",
  keywordPhrase: "ai business solutions by industry",
});

export default function SolutionsPage() {
  // `solutionRoutes()` is the single source of every resolvable
  // `/solutions/<slug>` path (the Service_Catalog x Approved_City_List cross
  // product). Grouping by `nicheId` here rather than hand-building URLs from
  // `niche.href(...)` is what guarantees this hub can never render an anchor
  // to an unapproved-city or unresolvable slug.
  const allRoutes = solutionRoutes();
  const routesByNiche = new Map<string, (typeof allRoutes)[number][]>();
  for (const route of allRoutes) {
    const existing = routesByNiche.get(route.nicheId) ?? [];
    existing.push(route);
    routesByNiche.set(route.nicheId, existing);
  }

  // One `Service` node per Service_Catalog entry (Requirement 5.5). The
  // `Organization` node is already emitted site-wide by `(site)/layout.tsx`,
  // so it is not duplicated here.
  const serviceNodes = NICHES.map((niche) => {
    const routes = routesByNiche.get(niche.id) ?? [];
    const areaServed = routes
      .map((route) => findApprovedCity(route.cityToken)?.displayName)
      .filter((name): name is string => Boolean(name));

    return serviceNode(
      {
        id: niche.id,
        name: niche.title,
        description: niche.description,
        serviceType: niche.title,
      },
      { areaServed, url: routes[0]?.path },
    );
  });

  return (
    <>
      <JsonLd nodes={serviceNodes} />

      {/* Hero */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
          <Breadcrumb trail={[{ name: "Solutions", path: "/solutions" }]} />
          <p className="mt-6 text-sm font-medium tracking-wide text-primary">
            Solutions
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            AI-powered business solutions, by industry.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Ten production-grade business solution websites, each engineered
            around the specific problems that vertical faces: commission
            drain, booking friction, churn, or a fragmented pipeline. Pick
            your industry to see the full build.
          </p>
        </div>
      </section>

      {/* Solutions grid. Rendered one card per `solutionRoutes()` entry —
          the niche x approved-city cross product — rather than one per
          niche, so a future second approved city automatically gets its own
          card and anchor instead of being silently dropped. */}
      <section className="mx-auto max-w-6xl bg-background px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allRoutes.map((route) => {
            const niche = NICHES.find((entry) => entry.id === route.nicheId);
            if (!niche) return null;

            const city = findApprovedCity(route.cityToken);
            const Icon = niche.icon;

            return (
              <Link
                key={route.path}
                href={route.path}
                className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-muted">
                  <Icon className="size-4 text-primary" aria-hidden />
                </div>
                <h2 className="mt-4 text-lg font-semibold tracking-tight">
                  {niche.title}
                  {city ? ` in ${city.displayName}` : ""}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {niche.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  View solution
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
