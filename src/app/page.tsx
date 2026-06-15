import { Hero } from "@/components/home/hero";
import { BentoGrid } from "@/components/home/bento-grid";
import { ComparisonSection } from "@/components/home/comparison-section";
import { DeliveryModels } from "@/components/home/delivery-models";
import { ProcessTimeline } from "@/components/home/process-timeline";
import { LatestBlogs } from "@/components/home/latest-blogs";
import { ContactForm } from "@/components/home/contact-form";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BentoGrid />
      <ComparisonSection />
      <DeliveryModels />
      <ProcessTimeline />
      <LatestBlogs />
      <ContactForm />
    </>
  );
}
