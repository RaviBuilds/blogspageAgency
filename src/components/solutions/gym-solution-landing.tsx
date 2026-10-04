import { ArrowDown, Dumbbell } from "lucide-react";
import type { ReactNode } from "react";

import { ScrollReveal } from "@/components/home/scroll-reveal";
import type { FaqPair } from "@/lib/structured-data";
import type { LatestPost } from "@/sanity/lib/queries";

import { ChapterRail } from "./gym/chapter-rail";
import { EXAMPLE_ENQUIRY, PLANNER_ANCHOR } from "./gym/content";
import { AnswersSection, FinalCtaSection, ProcessSection, RelatedSection } from "./gym/sections-close";
import { BuildSection, EnquirySection, GuidanceSection, WebsiteSection } from "./gym/sections-offer";
import { ChannelsSection, DiscoverySection, QuestionsSection } from "./gym/sections-story";
import { GrowSection, LifecycleSection } from "./gym/sections-system";
import { StickyWhatsApp } from "./gym/sticky-whatsapp";
import { HeroComposition } from "./gym/visuals";
import { WhatsAppCta } from "./gym/whatsapp-cta";

type GymSolutionLandingProps = {
  cityLabel: string;
  /**
   * The route's breadcrumb band. Rendered inside the page's dark surface (not
   * above it) so it shares the background, glow and token scope of the hero.
   */
  breadcrumb?: ReactNode;
  /** Question-and-answer pairs; also emitted as FAQPage JSON-LD by the route. */
  faq?: FaqPair[];
  /**
   * Heading text -> `id`, precomputed by the parent page's single
   * `createHeadingSlugger` instance (Requirement 9.5).
   */
  headingIds: Record<string, string>;
  /** Fallback "related reading" posts (Requirement 7.8). */
  relatedPosts?: LatestPost[];
};

/**
 * The gym solution page.
 *
 * A server component: the narrative renders as plain HTML, and only the
 * genuinely interactive pieces are client islands (discovery phone, website
 * anatomy, member-tools demo, lifecycle rail, chapter rail, CTAs, sticky CTA).
 * All reveals are SSR-safe: content ships visible and motion arms after
 * hydration (`ScrollReveal`, `InView`).
 *
 * Five acts, each with its own surface and picture:
 * I   The visitor    — 01 hero trail · 02 research journey · 03 questions · 04 channel system
 * II  The website    — 05 anatomy blueprint · 06 guidance product stage
 * III The handoff    — 07 WhatsApp conversation (+ AI add-on)
 * IV  The foundation — 08 layered deliverables
 * V   The system     — 09 growth staircase · 10 lifecycle rail
 * then trust on paper (11 answers, 12 process) and the invitation (13).
 */
export function GymSolutionLanding({ cityLabel, breadcrumb, faq = [], headingIds, relatedPosts = [] }: GymSolutionLandingProps) {
  const hid = (text: string) => headingIds[text];

  return (
    <div className="dark relative overflow-x-clip bg-[#050505]">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[720px] bg-[radial-gradient(ellipse_60%_50%_at_70%_20%,rgba(94,106,210,0.16),transparent_70%)]" />

      {breadcrumb}

      {/* 01 — Hero: the research trail */}
      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-10 lg:px-8 lg:pb-32 lg:pt-14">
        <div className="grid items-center gap-14 xl:grid-cols-[minmax(0,1fr)_540px] xl:gap-12">
          <ScrollReveal>
            <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-foreground/75">
              <Dumbbell className="size-3.5 text-primary" />
              Gym websites &amp; digital presence · {cityLabel}
            </div>

            <h1 className="max-w-[15ch] text-[clamp(2.6rem,6.4vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-balance xl:max-w-none">
              Before they walk into your gym,{" "}
              <span className="text-gradient">they&apos;ve already started evaluating it.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Potential members discover gyms through Google, Instagram and search, then look for answers before they contact
              anyone. BLOGSPAGE AI builds the gym website and guidance tools that turn that research into a better-prepared
              conversation with your team.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <WhatsAppCta location="hero-quote" intent="quote" tone="white">
                Get a Quote
              </WhatsAppCta>
              <WhatsAppCta location="hero" tone="outline">
                Show Me What This Could Look Like
              </WhatsAppCta>
            </div>
            <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>Both buttons open a WhatsApp chat with BLOGSPAGE AI.</span>
              <a
                href={`#${PLANNER_ANCHOR}`}
                className="inline-flex min-h-11 items-center gap-1 font-medium text-foreground/80 underline-offset-4 hover:text-foreground hover:underline"
              >
                or try the 30-day planner <ArrowDown className="size-3.5" />
              </a>
            </p>
          </ScrollReveal>

          <div className="xl:justify-self-end">
            <p className="sr-only">
              Illustration: a potential member searches for a beginner gym, checks the Maps listing and reviews, looks at the
              gym&apos;s Instagram, finds a personalized starting point on the gym&apos;s website, and sends a WhatsApp enquiry
              that reaches the gym team with that context.
            </p>
            <HeroComposition enquiry={EXAMPLE_ENQUIRY} />
          </div>
        </div>
      </section>

      <DiscoverySection hid={hid} />
      <QuestionsSection hid={hid} />
      <ChannelsSection hid={hid} />
      <WebsiteSection hid={hid} />
      <GuidanceSection hid={hid} />
      <EnquirySection hid={hid} />
      <BuildSection hid={hid} />
      <GrowSection hid={hid} />
      <LifecycleSection hid={hid} />
      <AnswersSection hid={hid} faq={faq} />
      <ProcessSection hid={hid} />
      <FinalCtaSection hid={hid} />
      <RelatedSection hid={hid} posts={relatedPosts} />

      <ChapterRail />
      <StickyWhatsApp />
    </div>
  );
}
