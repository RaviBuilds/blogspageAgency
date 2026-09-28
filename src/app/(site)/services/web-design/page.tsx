import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { faqNode, serviceNode } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/seo/breadcrumb";

import {
  WEB_DESIGN_META,
  WEB_DESIGN_FAQS,
} from "@/lib/web-design-data";

import { WebDesignHero } from "@/components/services/web-design/web-design-hero";
import { BusinessProblemSection } from "@/components/services/web-design/business-problem-section";
import { CorePositioningSection } from "@/components/services/web-design/core-positioning-section";
import { WebDesignPillarSection } from "@/components/services/web-design/web-design-pillar-section";
import { BrandingPillarSection } from "@/components/services/web-design/branding-pillar-section";
import { LocalVisibilitySection } from "@/components/services/web-design/local-visibility-section";
import { DigitalLaunchFoundationSection } from "@/components/services/web-design/digital-launch-foundation-section";
import { IndustryShowcaseSection } from "@/components/services/web-design/industry-showcase-section";
import { ProcessSection } from "@/components/services/web-design/process-section";
import { ProofSection } from "@/components/services/web-design/proof-section";
import { FAQAndFinalCTASection } from "@/components/services/web-design/faq-and-final-cta-section";

export const metadata: Metadata = buildMetadata({
  path: WEB_DESIGN_META.path,
  title: WEB_DESIGN_META.title,
  description: WEB_DESIGN_META.description,
  type: "website",
  keywordPhrase: WEB_DESIGN_META.keywordPhrase,
  /* The blueprint's approved title already carries the brand
     ("Web Design Agency Hyderabad | Blogspage AI"), so the builder must not
     append `TITLE_TEMPLATE_SUFFIX` on top of it. Without this flag the served
     HTML shipped `og:title` / `twitter:title` as
     "... | Blogspage AI | Blogspage AI" while `<title>` was correct — a social
     preview defect invisible from the JSX and only visible in the response.
     `titleAbsolute` exists for exactly this case (see `seo.ts`): it is what the
     root layout uses for its own already-branded title. */
  titleAbsolute: true,
});

export default function WebDesignPage() {
  const serviceJsonLd = serviceNode(
    {
      id: "web-design",
      name: "Web Design Agency Hyderabad",
      description: WEB_DESIGN_META.description,
      serviceType: "Website Design & Digital Brand Presence",
    },
    {
      areaServed: ["Hyderabad", "Telangana", "India"],
      url: WEB_DESIGN_META.path,
    }
  );

  const faqJsonLd = faqNode(WEB_DESIGN_FAQS, { minPairs: 3 });

  const structuredDataNodes = [serviceJsonLd, faqJsonLd].filter(
    (node): node is NonNullable<typeof node> => node !== null
  );

  return (
    <>
      <JsonLd nodes={structuredDataNodes} />

      {/* `(site)/layout.tsx` already provides the document's single
          `<main id="main">` landmark (it is the skip-link target). This page
          previously opened a second `<main>` inside it, which nests a landmark
          inside itself: invalid HTML, and two "main" landmarks for assistive
          technology. Every other route in the app renders one, so this was
          local to this page. A plain wrapper keeps the surface colour without
          re-declaring the landmark. */}
      <div className="bg-background">
        {/* Breadcrumb Navigation (Home → Web Design).

            Borderless, and sharing the hero's surface: the previous hairline
            rule cut a line across the top of the page and made the crumb read as
            a separate band above the composition rather than as the hero's own
            first line.

            The top padding clears the fixed navbar. At `pt-6` the crumb
            rendered at y 24-44 while the floating header occupies y 16-74, so
            the trail the blueprint specifies was painted *behind* the navbar and
            invisible at every viewport — measured in the browser, not inferred.
            The hero's own top padding is reduced by the same amount below, so
            the distance from the navbar to the H1 is unchanged. */}
        <div className="bg-background px-6 pt-24 sm:pt-28 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Breadcrumb
              trail={[{ name: "Web Design", path: "/services/web-design" }]}
            />
          </div>
        </div>

        {/* ── 11 CANONICAL SECTIONS ─────────────────────────────────────────
            Unchanged in order, content and semantics. What changed is the visual
            rhythm they now form, which alternates surface and register rather
            than repeating one centred-header-plus-card-grid eleven times:

              1  Hero                  light   · asymmetric device composition
              2  Problem diagnosis     subtle  · alternating failure-state rows
              3  70/20/10 framework    light   · proportional instrument
              4  Core web design 70%   subtle  · full-width design showcase
              5  Brand presentation    light   · one brand board
              6  Local visibility      subtle  · ecosystem chain
              7  Digital launch        DARK    · infrastructure rack
              8  Industry showcase     light   · ten distinct site previews
              9  Process               subtle  · scroll-drawn journey
              10 Proof                 DARK    · case-study gallery
              11 FAQ + Final CTA       light + DARK close

            The three dark islands are scoped with `dark` and seamed at both
            edges, the same mechanism the homepage uses for its Real Work island. */}

        {/* Section 1: Hero */}
        <WebDesignHero />

        {/* Section 2: Business Problems */}
        <BusinessProblemSection />

        {/* Section 3: Core Positioning (70/20/10) */}
        <CorePositioningSection />

        {/* Section 4: Web Design Pillar (70%) */}
        <WebDesignPillarSection />

        {/* Section 5: Branding Pillar (20%) */}
        <BrandingPillarSection />

        {/* Section 6: Local Visibility Pillar (10% Part A) */}
        <LocalVisibilitySection />

        {/* Section 7: Digital Launch Foundation (10% Part B) */}
        <DigitalLaunchFoundationSection />

        {/* Section 8: Industry Showcase Router */}
        <IndustryShowcaseSection />

        {/* Section 9: Process */}
        <ProcessSection />

        {/* Section 10: Proof / Work */}
        <ProofSection />

        {/* Section 11: FAQ + Final CTA */}
        <FAQAndFinalCTASection />
      </div>
    </>
  );
}
