import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GymSolutionLanding } from "@/components/solutions/gym-solution-landing";
import { GYM_LANDING_HEADINGS } from "@/components/solutions/gym-landing-headings";
import { DentalSolutionLanding } from "@/components/solutions/dental-solution-landing";
import { DENTAL_LANDING_HEADINGS } from "@/components/solutions/dental-landing-headings";
import { SolutionTemplate } from "@/components/solutions/solution-template";
import { allNicheParams, getNicheBySlug } from "@/lib/niches";
import {
  buildMetadata,
  clampDescription,
  TITLE_MAX,
  TITLE_TEMPLATE_SUFFIX,
} from "@/lib/seo";
import { findKeywordPhrase } from "@/lib/keyword-map";
import { faqNode, MIN_SOLUTION_FAQ_PAIRS, serviceNode } from "@/lib/structured-data";
import { createHeadingSlugger } from "@/lib/heading-slug";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { client } from "@/sanity/lib/client";
import { LATEST_POSTS_QUERY, type LatestPost } from "@/sanity/lib/queries";

type SolutionPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Derive every heading `id` `<GymSolutionLanding>` needs through the page's
 * single shared slugger. That component is `"use client"`, so a function
 * cannot cross the server -> client boundary as a prop (Requirement 9.5);
 * this precomputed lookup is passed down as plain data instead.
 */
function gymHeadingIds(
  slugger: (text: string) => string,
): Record<string, string> {
  const ids: Record<string, string> = {};
  for (const heading of GYM_LANDING_HEADINGS) {
    ids[heading] = slugger(heading);
  }
  return ids;
}

/**
 * Same pattern as `gymHeadingIds` — derive heading `id`s for the dental
 * landing through the page's shared slugger (Requirement 9.5).
 */
function dentalHeadingIds(
  slugger: (text: string) => string,
): Record<string, string> {
  const ids: Record<string, string> = {};
  for (const heading of DENTAL_LANDING_HEADINGS) {
    ids[heading] = slugger(heading);
  }
  return ids;
}

// The generated static params are the entire served route space; any slug
// outside it 404s at the routing layer before this module runs.
export const dynamicParams = false;

export function generateStaticParams() {
  return allNicheParams();
}

/**
 * Characters available to a pre-template title before the root template's
 * `" | Blogspage"` suffix pushes the rendered `<title>` past Requirement 4.4's
 * upper bound.
 */
const TITLE_BUDGET = TITLE_MAX - TITLE_TEMPLATE_SUFFIX.length;

/**
 * The pre-template title for a solution route, kept inside Requirement 4.4's
 * bounds for every niche-by-city pair.
 *
 * The mapped phrase is the whole title; a capitalised niche label is prefixed
 * only when it earns its characters. It is dropped in two cases:
 *
 * - The phrase already carries the label ("Online Delivery" in front of
 *   "online delivery app development hyderabad"), where the prefix is pure
 *   repetition and also pushed the rendered title to exactly the 70-character
 *   ceiling.
 * - The combined form overflows the budget, as it does for `dental-medical`
 *   (a 16-character label plus a 43-character phrase runs to 61 against a
 *   budget of 58). The label yields rather than the phrase, which has to
 *   survive verbatim for Requirement 12.5.
 *
 * Every mapped phrase already ends in its city, so the city never appears
 * twice. The shortest phrase is 33 characters, so the 30-character lower bound
 * holds once the suffix is added even when the label is dropped.
 */
function solutionTitle(
  nicheTitle: string,
  cityName: string,
  keywordPhrase: string | undefined,
): string {
  if (!keywordPhrase) {
    return `${nicheTitle} Business Solution Website in ${cityName}`;
  }

  if (keywordPhrase.toLowerCase().includes(nicheTitle.toLowerCase())) {
    return keywordPhrase;
  }

  const labelled = `${nicheTitle}: ${keywordPhrase}`;
  return labelled.length <= TITLE_BUDGET ? labelled : keywordPhrase;
}

export async function generateMetadata({
  params,
}: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = getNicheBySlug(slug);

  if (!resolved) {
    return {
      title: "Solution Not Found | Blogspage",
      robots: { index: false, follow: false },
    };
  }

  const { niche, city } = resolved;
  const keywordPhrase = findKeywordPhrase(`/solutions/${slug}`) ?? undefined;
  const title = solutionTitle(niche.title, city.displayName, keywordPhrase);
  // The city mention is placed first so it survives `clampDescription`'s
  // 160-character window regardless of how long the niche copy runs
  // (Requirement 12.7).
  const description = clampDescription(
    `Serving ${city.displayName} businesses. ${niche.hero.subhead} ${niche.seoLabel}`,
  );

  return buildMetadata({
    path: `/solutions/${slug}`,
    title,
    description,
    type: "website",
    keywordPhrase,
  });
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug } = await params;
  const resolved = getNicheBySlug(slug);

  if (!resolved) {
    notFound();
  }

  const { niche, city } = resolved;

  // Niches carry no per-niche editorial post association today, so the
  // "three most recently published posts" fallback (Requirement 7.8) is
  // effectively always what renders. `LATEST_POSTS_QUERY` already returns
  // exactly the shape this section needs, sliced to 3.
  let relatedPosts: LatestPost[] = [];
  try {
    relatedPosts = await client.fetch<LatestPost[]>(LATEST_POSTS_QUERY);
  } catch {
    relatedPosts = [];
  }

  // One heading slugger per rendered route, shared by whichever template
  // renders below, so `h2`/`h3` ids stay deterministic and route-scoped
  // (Requirement 9.5).
  const slugger = createHeadingSlugger();

  // The site-wide Organization node is already emitted by the shared
  // `(site)/layout.tsx`, so only this route's own Service and FAQPage nodes
  // are added here. `serviceNode` links `provider` to the Organization `@id`
  // rather than inlining an anonymous duplicate. The breadcrumb's
  // `BreadcrumbList` node is emitted by `<Breadcrumb>` below, driven from the
  // same trail as the visible rendering, so this route emits exactly one
  // `BreadcrumbList`. `faqNode` is computed once here (not per branch) so it
  // lands in `nodes` whether the gym or the generic template renders.
  const nodes = [
    serviceNode(
      {
        id: niche.id,
        name: niche.title,
        description: niche.description,
        serviceType: niche.title,
      },
      { areaServed: [city.displayName], url: `/solutions/${slug}` },
    ),
  ];

  const faq = faqNode(niche.faq, { minPairs: MIN_SOLUTION_FAQ_PAIRS });
  if (faq) nodes.push(faq);

  return (
    <>
      <JsonLd nodes={nodes} />
      <div className="mx-auto max-w-6xl px-6 pt-6 lg:px-8">
        <Breadcrumb
          trail={[
            { name: "Solutions", path: "/solutions" },
            {
              name: `${niche.title} in ${city.displayName}`,
              path: `/solutions/${slug}`,
            },
          ]}
        />
      </div>
      {niche.id === "gym-fitness" ? (
        <GymSolutionLanding
          cityLabel={city.displayName}
          faq={niche.faq}
          headingIds={gymHeadingIds(slugger)}
          relatedPosts={relatedPosts}
        />
      ) : niche.id === "dental-medical" ? (
        <DentalSolutionLanding
          cityLabel={city.displayName}
          faq={niche.faq}
          headingIds={dentalHeadingIds(slugger)}
          relatedPosts={relatedPosts}
        />
      ) : (
        <SolutionTemplate
          niche={niche}
          city={city.token}
          cityLabel={city.displayName}
          slugger={slugger}
          relatedPosts={relatedPosts}
        />
      )}
    </>
  );
}
