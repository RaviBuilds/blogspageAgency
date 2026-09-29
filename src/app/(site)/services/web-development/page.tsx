import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { faqNode, serviceNode } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/seo/breadcrumb";

import { WEB_DEVELOPMENT_META, WEB_DEVELOPMENT_FAQS } from "@/lib/web-development-data";

import { WebDevelopmentHero } from "@/components/services/web-development/web-development-hero";
import { DesignVsDevelopmentSection } from "@/components/services/web-development/design-vs-development-section";
import { CapabilityLadderSection } from "@/components/services/web-development/capability-ladder-section";
import { ArchitectureSection } from "@/components/services/web-development/architecture-section";
import { ProofSection } from "@/components/services/web-development/proof-section";
import { CapabilitiesSection } from "@/components/services/web-development/capabilities-section";
import { TrustSection } from "@/components/services/web-development/trust-section";
import { ProcessSection } from "@/components/services/web-development/process-section";
import { FaqAndFinalCtaSection } from "@/components/services/web-development/faq-and-final-cta-section";

export const metadata: Metadata = buildMetadata({
  path: WEB_DEVELOPMENT_META.path,
  title: WEB_DEVELOPMENT_META.title,
  description: WEB_DEVELOPMENT_META.description,
  type: "website",
  keywordPhrase: WEB_DEVELOPMENT_META.keywordPhrase,
  /* The approved title already carries the brand ("... | Blogspage AI"), so
     the builder must not append TITLE_TEMPLATE_SUFFIX on top of it — the
     identical reason `/services/web-design` sets this flag. */
  titleAbsolute: true,
});

export default function WebDevelopmentPage() {
  const serviceJsonLd = serviceNode(
    {
      id: "web-development",
      name: "Web Development Company in Hyderabad",
      description: WEB_DEVELOPMENT_META.description,
      serviceType: "Custom Web Development & Business Systems",
    },
    {
      areaServed: ["Hyderabad", "Telangana", "India"],
      url: WEB_DEVELOPMENT_META.path,
    }
  );

  const faqJsonLd = faqNode(WEB_DEVELOPMENT_FAQS, { minPairs: 3 });

  const structuredDataNodes = [serviceJsonLd, faqJsonLd].filter(
    (node): node is NonNullable<typeof node> => node !== null
  );

  return (
    <>
      <JsonLd nodes={structuredDataNodes} />

      {/* `(site)/layout.tsx` already provides the document's single <main>
          landmark — this page renders a plain wrapper, matching the
          web-design page's own fix for the same defect class. */}
      <div className="bg-background">
        <div className="bg-background px-6 pt-24 sm:pt-28 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Breadcrumb
              trail={[{ name: "Web Development", path: "/services/web-development" }]}
            />
          </div>
        </div>

        {/* ── 10 CANONICAL SECTIONS (WEB-DEVELOPMENT-PAGE-SPECIFICATION.md §43) ──
            Unchanged in order, content and semantics. What the final polish pass
            changed is the rhythm they form — surface and register now alternate
            instead of repeating one centred-header-plus-card-grid nine times:

              01 Hero                 light   · asymmetric request-path composition
              02 Design vs Dev        light   · two-sided boundary + interface/system stack
              03 Capability ladder    subtle  · scroll-drawn climb up one spine
              04 Architecture         DARK    · seamed island, request path, RBAC focal band
              05 Proof                light   · alternating full-row system gallery
              06 Capabilities         subtle  · one hairline-divided instrument
              07 Trust + stack        light   · open pillars, quiet technology strip
              08 Process              subtle  · spine journey with build artefacts
              09 FAQ                  light   · crawlable native <details> list
              10 Final CTA            DARK    · display-scale close, seamed at the top

            The two dark islands are scoped with `dark` and seamed at their edges,
            the same mechanism the homepage and the Web Design page use. */}

        {/* 01 Hero */}
        <WebDevelopmentHero />

        {/* 02 Design vs Development */}
        <DesignVsDevelopmentSection />

        {/* 03 Capability Ladder */}
        <CapabilityLadderSection />

        {/* 04 Architecture — dark island, the page's central section */}
        <ArchitectureSection />

        {/* 05 Proof — Systems We've Built */}
        <ProofSection />

        {/* 06 Capabilities — What We Can Connect & Build */}
        <CapabilitiesSection />

        {/* 07 Trust / Durability — Built to Run, Own & Evolve (+ stack strip) */}
        <TrustSection />

        {/* 08 Process — How We Build */}
        <ProcessSection />

        {/* 09 + 10 FAQ (Right-Sizing) + Final CTA */}
        <FaqAndFinalCtaSection />
      </div>
    </>
  );
}
