import { Hero } from "@/components/home/hero";
import { Manifesto } from "@/components/home/manifesto";
import { AudiencePathways } from "@/components/home/audience-pathways";
import { DigitalPresenceStory } from "@/components/home/digital-presence-story";
import { BrandStory } from "@/components/home/brand-story";
import { ServiceVerticals } from "@/components/home/services-bento";
import { FeaturedProof } from "@/components/home/featured-work";
import { SupportingWork } from "@/components/home/supporting-work";
import { BentoGrid } from "@/components/home/bento-grid";
import { GrowthPathways } from "@/components/home/growth-pathways";
import { ProcessTimeline } from "@/components/home/process-timeline";
import { Testimonials } from "@/components/home/testimonials";
import { ConversationExperience } from "@/components/home/contact-form";
import { FinalCTA } from "@/components/home/cta-section";
import { LatestBlogs } from "@/components/home/latest-blogs";
import { JsonLd } from "@/components/seo/json-ld";
import { webSiteNode } from "@/lib/structured-data";

/*
 * Homepage v2.0 composition (R1).
 *
 * Narrative order follows the approved plan / Blueprint §44 storyboard:
 *   Movement 1  Hero (dark island, untouched isolation wrapper)
 *   Movement 1b Manifesto — the page's belief, stated once before it asks the
 *               visitor anything. The copy is the promoted opening of
 *               BrandStory chapter 1 (see `manifesto.tsx`); it is not
 *               duplicated there.
 *   Movement 2  AudiencePathways — "Where are you right now?"
 *   Movement 2b DigitalPresenceStory — starting-from-zero story
 *   Movement 2c BrandStory (id="brand" + id="digital-office") — the
 *               business→brand→physical-office→digital-office storytelling
 *               sequence; one shared reversible scroll progress across both
 *               chapters (see `brand-story.tsx`)
 *   Movement 3  ServiceVerticals (id="services")
 *   Movement 4  FeaturedProof (id="work") + SupportingWork (id="more-work")
 *   Bridge      BentoGrid (id="solutions") — the ten solution links
 *   Movement 5  ProcessTimeline (id="process") + GrowthPathways (id="models")
 *               — the three-pillar growth story; DeliveryModels stays in the
 *               repo for /about's DELIVERY_MODELS import
 *   Interlude   LatestBlogs — the journal, in the QUIET register
 *   Movement 6/7 ConversationExperience (id="contact") + FinalCTA
 *
 * P0-4 ordering: the page used to end
 * `Testimonials → Contact → FinalCTA → LatestBlogs`, so the last thing a
 * visitor saw was an index of blog posts — the closing argument was buried one
 * section above an archive. The journal now sits between the trust movement and
 * the conversation, where it reads as a quiet interlude, and the page closes on
 * its own final call. `#contact` is unchanged and still lives on
 * `contact-form.tsx`; only the order around it moved.
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
      <Manifesto />
      <AudiencePathways />
      <DigitalPresenceStory />
      <BrandStory />
      <ServiceVerticals />
      <FeaturedProof />
      <SupportingWork />
      <BentoGrid />
      <ProcessTimeline />
      <GrowthPathways />
      <Testimonials />
      <LatestBlogs />
      <ConversationExperience />
      <FinalCTA />
    </>
  );
}

