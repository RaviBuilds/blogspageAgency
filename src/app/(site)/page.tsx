import { Hero } from "@/components/home/hero";
import { ServicesBento } from "@/components/home/services-bento";
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
      <Hero />
      <ServicesBento />
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
