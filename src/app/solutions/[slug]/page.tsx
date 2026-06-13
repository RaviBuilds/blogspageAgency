import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SolutionTemplate } from "@/components/solutions/solution-template";
import { allNicheParams, getNicheBySlug } from "@/lib/niches";

type SolutionPageProps = {
  params: Promise<{ slug: string }>;
};

const SITE_URL = "https://blogspage.com";

const titleCase = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export function generateStaticParams() {
  return allNicheParams();
}

export async function generateMetadata({
  params,
}: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = getNicheBySlug(slug);

  if (!resolved) {
    return { title: "Solution Not Found | Blogspage Agency" };
  }

  const { niche, city } = resolved;
  const cityLabel = titleCase(city);
  const title = `${niche.title} Business Solution Website in ${cityLabel} | Blogspage`;
  const description = `${niche.hero.subhead} ${niche.seoLabel}`;
  const canonical = `${SITE_URL}/solutions/${slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Blogspage",
      type: "website",
    },
  };
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug } = await params;
  const resolved = getNicheBySlug(slug);

  if (!resolved) {
    notFound();
  }

  const { niche, city } = resolved;
  const cityLabel = titleCase(city);

  // LocalBusiness / ProfessionalService JSON-LD per the SEO routing contract.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${niche.title} Business Solution — ${cityLabel}`,
    description: `${niche.hero.subhead} ${niche.seoLabel}`,
    url: `${SITE_URL}/solutions/${slug}`,
    areaServed: { "@type": "City", name: cityLabel },
    provider: {
      "@type": "Organization",
      name: "Blogspage",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SolutionTemplate niche={niche} city={city} />
    </>
  );
}
