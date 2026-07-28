import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { buildMetadata } from "@/lib/seo";
import { faqNode } from "@/lib/structured-data";
import { findServiceRouteBySlug, SERVICE_ROUTES } from "@/lib/service-routes";
import { serviceRoutes } from "@/lib/routes";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { createHeadingSlugger } from "@/lib/heading-slug";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

// The generated static params are the entire served route space; any slug
// outside the four Service_Routes 404s at the routing layer before this
// module runs.
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_ROUTES.map((route) => ({ slug: route.slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = findServiceRouteBySlug(slug);

  if (!route) {
    return {
      title: "Service Not Found | Blogspage",
      robots: { index: false, follow: false },
    };
  }

  return buildMetadata({
    path: `/services/${route.slug}`,
    title: route.h1,
    description: route.metaDescription,
    type: "website",
    keywordPhrase: route.keywordPhrase,
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const route = findServiceRouteBySlug(slug);

  if (!route) {
    notFound();
  }

  // Short anchor label from the route registry (e.g. "Workflow Automation")
  // rather than the long `h1`, matching the footer/nav copy this route
  // replaces (Requirement 12.10).
  const label =
    serviceRoutes().find((descriptor) => descriptor.serviceRouteId === route.id)
      ?.label ?? route.h1;

  // The site-wide Organization node is already emitted by the shared
  // `(site)/layout.tsx`, so only this route's own FAQPage node is added
  // here. `faqNode` returns `null` when fewer than `minPairs` usable pairs
  // are supplied; `service-routes.ts` enforces at least three at module
  // load, so this is always non-null in practice, but the `null` case is
  // still handled per the type signature.
  const faqJsonLd = faqNode(route.faq, { minPairs: 3 });

  // One heading slugger per rendered route, so `h2` ids stay deterministic
  // and route-scoped (Requirement 9.5).
  const slugger = createHeadingSlugger();

  return (
    <>
      {faqJsonLd ? <JsonLd nodes={[faqJsonLd]} /> : null}

      <article className="mx-auto max-w-3xl px-6 py-16 lg:px-8 lg:py-24">
        <Breadcrumb
          trail={[{ name: label, path: `/services/${route.slug}` }]}
        />

        <header className="mt-6 mb-10 border-b border-border pb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {route.h1}
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            {route.summary}
          </p>
        </header>

        <div className="space-y-10">
          {route.sections.map((section) => (
            <section key={section.heading}>
              <h2
                id={slugger(section.heading)}
                className="text-2xl font-semibold tracking-tight"
              >
                {section.heading}
              </h2>
              <p className="mt-3 text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-16 border-t border-border pt-10">
          <h2
            id={slugger("Frequently asked questions")}
            className="text-2xl font-semibold tracking-tight"
          >
            Frequently asked questions
          </h2>
          <dl className="mt-6 space-y-6">
            {route.faq.map((item, index) => (
              <div key={index}>
                <dt className="font-medium text-foreground">
                  {item.question}
                </dt>
                <dd className="mt-2 text-muted-foreground">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </>
  );
}
