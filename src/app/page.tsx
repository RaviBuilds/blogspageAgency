import { Hero } from "@/components/home/hero";
import { BentoGrid } from "@/components/home/bento-grid";
import { ComparisonSection } from "@/components/home/comparison-section";
import { DeliveryModels } from "@/components/home/delivery-models";
import { ProcessTimeline } from "@/components/home/process-timeline";
import { ContactCTA } from "@/components/home/contact-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BentoGrid />
      <ComparisonSection />
      <DeliveryModels />
      <ProcessTimeline />
      <ContactCTA />
    </>
  );
}
