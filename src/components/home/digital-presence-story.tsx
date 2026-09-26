"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, type Variants } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { PRESENCE_STORY } from "@/lib/homepage-data";
import {
  BRAND_TEXT_GRADIENT,
  TYPE_LEAD,
  TYPE_MICRO_LABEL,
  TYPE_SECTION,
} from "@/lib/brand-type";
import { RHYTHM_MOVEMENT } from "@/lib/section-rhythm";
import { RISE_DEFAULT, SPRING, STAGGER_COPY } from "@/lib/motion";
import { useStaggerReveal } from "@/components/home/scroll-reveal";
import { DigitalHomeVisual } from "./digital-home-visual";

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 2b — The "starting from zero" story (Blueprint §10, R4)

   Why a website matters, in business language: the channels a business
   already uses converge into the business, the website becomes its digital
   home, and the website feeds enquiries now and content/commerce/SEO later.

   R4: the diagram is now the DIGITAL HOME visual — a custom DOM/SVG
   composition (see `digital-home-visual.tsx`) where discovery signals
   converge into the business, the website activates as the focal surface,
   and outcomes appear from it. One calm one-shot timeline; complete at rest;
   static final composition under reduced motion. The visual is `aria-hidden`
   — the headline, lead and benefits carry the meaning as real text.
   ───────────────────────────────────────────────────────────────────────────── */

/**
 * R5.2 brand text treatment — the section heading's meaningful phrase
 * ("That's okay.") carries the same restrained cyan → blue → violet sweep as
 * the Hero and the R5 section heading ("Build from there."): same inline
 * background-clip mechanism and the same light-signal values, declared inline
 * because the locked `.text-gradient` island override still points the class
 * at the legacy near-white gradient. No data change — the phrase is sliced
 * from the existing `PRESENCE_STORY.heading` string, with a safe fallback.
 */
const HEADING_ACCENT = "That's okay.";
const HEADING_MAIN = PRESENCE_STORY.heading.endsWith(HEADING_ACCENT)
  ? PRESENCE_STORY.heading.slice(
      0,
      PRESENCE_STORY.heading.length - HEADING_ACCENT.length,
    )
  : "";
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER_COPY } },
};

/* `hidden` is instant: it arms after hydration (see `useStaggerReveal`), so a
   timed hidden transition would animate *away* from the painted server
   composition. Only `show` carries the spring. */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: RISE_DEFAULT, transition: { duration: 0 } },
  show: { opacity: 1, y: 0, transition: SPRING },
};

export function DigitalPresenceStory() {
  /* SSR-safe reveal gates — the prerendered HTML carries the settled, readable
     composition; the hidden state arms only after hydration. */
  const header = useStaggerReveal();
  const benefits = useStaggerReveal<HTMLUListElement>({ margin: "-80px" });
  const cta = useStaggerReveal({ margin: "-60px" });

  /* R12: one scroll-linked progress value drives the digital home visual —
     fully reversible, matching `brand-story.tsx`'s `scrollYProgress`
     architecture. Both offset endpoints track the wrapper's own start/end
     edges so the sequence resolves over the visual's natural scroll
     distance through the viewport. */
  const visualRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: visualRef,
    offset: ["start 0.85", "end 0.3"],
  });

  return (
    <section
      id={PRESENCE_STORY.anchorId}
      /* MOVEMENT: this opens the page's teaching block. BrandStory's two
         chapters below both sit at CONTINUE and drop their top borders, so the
         three sections read as one movement with three beats rather than three
         separate lessons each announcing itself. */
      className={`scroll-mt-24 border-t border-border-subtle bg-background-subtle ${RHYTHM_MOVEMENT}`}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/*
          Heading left, lead right, on one baseline.

          The teaching movement opens here, and it used to open with the page's
          default stacked block (label → h2 → lead in a single `max-w-2xl`
          column). Splitting the heading and the lead across the field gives this
          movement its own opening gesture, distinct from the numbered chapter
          marks in `brand-story.tsx` below it and from the eyebrow-led split
          headers on the Services and Work anchors.

          `lg:items-baseline` deliberately aligns the lead's first line to the
          heading's last, so the two columns read as one line of the composition
          rather than as two blocks that happen to be side by side.
        */}
        <motion.div variants={container} {...header}>
          <div className="lg:grid lg:grid-cols-12 lg:items-baseline lg:gap-10">
            <div className="lg:col-span-7">
              {/* Not a scanning anchor — muted micro label, see bento-grid. */}
              <motion.p variants={fadeUp} className={TYPE_MICRO_LABEL}>
                {PRESENCE_STORY.eyebrow}
              </motion.p>
              <motion.h2 variants={fadeUp} className={`mt-4 ${TYPE_SECTION}`}>
                {HEADING_MAIN || PRESENCE_STORY.heading}
                {HEADING_MAIN && (
                  <span style={BRAND_TEXT_GRADIENT}>{HEADING_ACCENT}</span>
                )}
              </motion.h2>
            </div>
            <motion.p
              variants={fadeUp}
              className={`mt-6 lg:col-span-5 lg:col-start-8 lg:mt-0 ${TYPE_LEAD}`}
            >
              {PRESENCE_STORY.lead}
            </motion.p>
          </div>
        </motion.div>

        {/* Connection diagram — decorative; copy above/below carries meaning */}
        <div ref={visualRef}>
          <DigitalHomeVisual progress={scrollYProgress} />
        </div>

        {/* Benefits — real text, business language (Blueprint §10) */}
        <motion.ul
          variants={container}
          {...benefits}
          className="mx-auto mt-14 grid max-w-3xl gap-3 sm:grid-cols-2"
        >
          {PRESENCE_STORY.benefits.map((benefit) => (
            <motion.li
              key={benefit}
              variants={fadeUp}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-foreground"
            >
              <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              {benefit}
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          variants={fadeUp}
          {...cta}
          className="mt-10 flex justify-center"
        >
          <Link
            href={PRESENCE_STORY.cta.href}
            onClick={() =>
              trackEvent("contact_cta_click", {
                cta_location: "online-presence",
                cta_label: "start-with-your-website",
                destination: PRESENCE_STORY.cta.href,
              })
            }
            className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
          >
            {PRESENCE_STORY.cta.label}
            <ArrowRight className="size-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
