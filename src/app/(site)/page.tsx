import { Hero } from "@/components/home/hero";
import { AudiencePathways } from "@/components/home/audience-pathways";
import { DigitalPresenceStory } from "@/components/home/digital-presence-story";
import { ServiceVerticals } from "@/components/home/services-bento";
import { BentoGrid } from "@/components/home/bento-grid";
import { ComparisonSection } from "@/components/home/comparison-section";
import { DeliveryModels } from "@/components/home/delivery-models";
import { ProcessTimeline } from "@/components/home/process-timeline";
import { FeaturedWork } from "@/components/home/featured-work";
import { LatestBlogs } from "@/components/home/latest-blogs";
import { CtaSection } from "@/components/home/cta-section";
import { ContactForm } from "@/components/home/contact-form";
import { JsonLd } from "@/components/seo/json-ld";
import { webSiteNode } from "@/lib/structured-data";

export default function HomePage() {
  return (
    <>
      <JsonLd nodes={[webSiteNode()]} />
      {/*
        Phase 1 Hero island — the only composition-level change on this page.

        The global `html.dark` default has been removed, so the approved light
        tokens are the site default. The Hero is visually locked, and this
        wrapper is the minimum isolation that preserves it exactly: `.dark`
        scopes the approved dark island palette onto the Hero's subtree (and
        keeps the `dark:` utility variants inside `Button` resolving as
        before), while `.hero-island` — defined in `globals.css` — pins the
        exact pre-migration values the Hero's subtree actually resolves.
        The Active Blueprint (`hero-system/**`) is module-scoped and sits
        inside the same boundary, untouched.

        No other section is wrapped: migrating them onto the light token
        system belongs to later phases.
      */}
      <div className="dark hero-island">
        <Hero />
      </div>
      <AudiencePathways />
      <DigitalPresenceStory />
      <ServiceVerticals />
      <BentoGrid />
      <ComparisonSection />
      <DeliveryModels />
      <ProcessTimeline />
      <FeaturedWork />
      <LatestBlogs />
      <CtaSection />
      <ContactForm />
    </>
  );
}
