import { Hero } from "@/components/home/hero";
import { AudiencePathways } from "@/components/home/audience-pathways";
import { DigitalPresenceStory } from "@/components/home/digital-presence-story";
import { ServiceVerticals } from "@/components/home/services-bento";
import { FeaturedProof } from "@/components/home/featured-work";
import { SupportingWork } from "@/components/home/supporting-work";
import { BentoGrid } from "@/components/home/bento-grid";
import { DeliveryModels } from "@/components/home/delivery-models";
import { ProcessTimeline } from "@/components/home/process-timeline";
import { Testimonials } from "@/components/home/testimonials";
import { LatestBlogs } from "@/components/home/latest-blogs";
import { CtaSection } from "@/components/home/cta-section";
import { ContactForm } from "@/components/home/contact-form";
import { JsonLd } from "@/components/seo/json-ld";
import { webSiteNode } from "@/lib/structured-data";

/*
 * Homepage v2.0 composition (R1).
 *
 * Narrative order follows the approved plan / Blueprint §44 storyboard:
 *   Movement 1  Hero (dark island, untouched isolation wrapper)
 *   Movement 2  AudiencePathways — "Where are you right now?"
 *   Movement 2b DigitalPresenceStory — starting-from-zero story
 *   Movement 3  ServiceVerticals (id="services")
 *   Movement 4  FeaturedProof (id="work") + SupportingWork (id="more-work")
 *   Bridge      BentoGrid (id="solutions") — the ten solution links
 *   Movement 5  ProcessTimeline (id="process") + DeliveryModels (id="models")
 *   Movement 6/7 ConversationExperience (id="contact") + FinalCTA + journal
 *
 * Protected contracts honoured here: the `webSiteNode` JSON-LD stays rendered
 * on this page; every section keeps its anchor id; ComparisonSection is
 * retired from the composition (zero inbound `#comparison` links verified at
 * plan time; the file stays in the repo, deprecated, not deleted).
 */
export default function HomePage() {
  return (
    <>
      <JsonLd nodes={[webSiteNode()]} />
      {/*
        Hero island isolation: `.dark` scopes the approved dark island
        palette onto the Hero's subtree, while `.hero-island` — defined in
        `globals.css` — pins the exact values the Hero's subtree resolves.
        The Active Blueprint (`hero-system/**`) is module-scoped and sits
        inside the same boundary, untouched.
      */}
      <div className="dark hero-island">
        <Hero />
      </div>
      <AudiencePathways />
      <DigitalPresenceStory />
      <ServiceVerticals />
      <FeaturedProof />
      <SupportingWork />
      <BentoGrid />
      <ProcessTimeline />
      <DeliveryModels />
      <Testimonials />
      <LatestBlogs />
      <CtaSection />
      <ContactForm />
    </>
  );
}

