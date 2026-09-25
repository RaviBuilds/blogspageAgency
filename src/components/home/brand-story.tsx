"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { BRAND_CHAPTER_ONE, BRAND_CHAPTER_TWO } from "@/lib/brand-story-data";
import {
  BrandOrbit,
  PhysicalToDigitalPanel,
  TouchpointRow,
} from "@/components/home/brand-story-visuals";
import { useStaggerReveal } from "@/components/home/scroll-reveal";

/* ─────────────────────────────────────────────────────────────────────────────
   BRAND STORY — "Why does your business need a brand?" (homepage
   storytelling sequence, inserted between DigitalPresenceStory and
   ServiceVerticals).

   Two connected chapters sharing ONE scroll-linked progress value (the same
   architecture as `process-timeline.tsx`): scrolling down constructs the
   story — business → brand → touchpoints → physical office → digital
   office — and scrolling back up reverses it. Reduced motion collapses every
   window to its settled end state; nothing here is a card grid.
   ───────────────────────────────────────────────────────────────────────── */

const SPRING = { type: "spring", stiffness: 100, damping: 20, mass: 1 } as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

/* `hidden` is instant on purpose. These blocks arm their hidden state *after*
   hydration (see `useStaggerReveal`), so a timed `hidden` transition would read
   as a visible animation out of the already-painted server composition. Only
   `show` carries the spring. */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, transition: { duration: 0 } },
  show: { opacity: 1, y: 0, transition: SPRING },
};

/** Shorter rise, for the standalone blocks between the chapter headers. */
const riseIn: Variants = {
  hidden: { opacity: 0, y: 20, transition: { duration: 0 } },
  show: { opacity: 1, y: 0, transition: SPRING },
};

const BRAND_TEXT_GRADIENT = {
  backgroundImage: "linear-gradient(90deg, #0891B2 0%, #4353C9 52%, #7C3AED 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text",
  color: "transparent",
} as const;

export function BrandStory() {
  const sectionRef = useRef<HTMLDivElement>(null);

  /* One reveal gate per block. Each is SSR-safe: the prerendered HTML carries
     the settled, readable composition, and the hidden state arms only after
     hydration — so no heading or paragraph here ever ships at `opacity: 0`. */
  const chapterOneHeader = useStaggerReveal();
  const insightBridge = useStaggerReveal({ margin: "-80px" });
  const chapterTwoCopy = useStaggerReveal();
  const officePanel = useStaggerReveal();
  const examples = useStaggerReveal({ margin: "-80px" });
  const closing = useStaggerReveal({ margin: "-80px" });

  /* ONE section-level progress value drives both chapters' visuals — fully
     reversible, matching `process-timeline.tsx`'s scroll architecture. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "end 0.35"],
  });

  return (
    <div ref={sectionRef}>
      {/* ── Chapter 1 — Built for the long run ─────────────────────────── */}
      <section
        id={BRAND_CHAPTER_ONE.anchorId}
        className="scroll-mt-24 border-t border-border-subtle bg-background py-24 lg:py-32"
      >
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <motion.div
            variants={container}
            {...chapterOneHeader}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.p variants={fadeUp} className="text-sm font-medium text-primary">
              {BRAND_CHAPTER_ONE.eyebrow}
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
            >
              {BRAND_CHAPTER_ONE.question}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-xl font-semibold tracking-tight text-foreground"
            >
              {BRAND_CHAPTER_ONE.answer}
            </motion.p>
            <motion.p variants={fadeUp} className="mt-3 text-muted-foreground">
              {BRAND_CHAPTER_ONE.lead}
            </motion.p>
            <motion.p variants={fadeUp} className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
              <span style={BRAND_TEXT_GRADIENT}>{BRAND_CHAPTER_ONE.bridgeToBrand}</span>
            </motion.p>
            <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
              {BRAND_CHAPTER_ONE.explanation}
            </motion.p>
          </motion.div>

          {/* Brand orbit — decorative; sr-only list below carries the words
              as real text for assistive technology and search engines. */}
          <div className="mt-14">
            <BrandOrbit progress={scrollYProgress} />
            <span className="sr-only">
              A brand is built from: {BRAND_CHAPTER_ONE.dimensions.map((d) => d.label).join(", ")}.
            </span>
          </div>

          {/* Insight bridge → touchpoints, closing chapter 1. */}
          <motion.div
            variants={riseIn}
            {...insightBridge}
            className="mx-auto mt-16 max-w-2xl text-center"
          >
            <p className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {BRAND_CHAPTER_ONE.insight}
            </p>
            <div className="mt-6">
              <TouchpointRow progress={scrollYProgress} />
              <span className="sr-only">
                Touchpoints: {BRAND_CHAPTER_ONE.touchpoints.join(" → ")}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Chapter 2 — Your website is your digital office ────────────── */}
      <section
        id={BRAND_CHAPTER_TWO.anchorId}
        className="scroll-mt-24 border-t border-border-subtle bg-background-subtle py-24 lg:py-32"
      >
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            {/* Copy column — narrower, asymmetric composition. */}
            <motion.div
              variants={container}
              {...chapterTwoCopy}
              className="lg:col-span-5"
            >
              <motion.p variants={fadeUp} className="text-sm font-medium text-primary">
                {BRAND_CHAPTER_TWO.eyebrow}
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
              >
                {BRAND_CHAPTER_TWO.question}
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
                {BRAND_CHAPTER_TWO.lead}
              </motion.p>
            </motion.div>

            {/* Physical → digital transformation panel — the chapter's
                strongest visual moment; sr-only text below describes it. */}
            <motion.div
              variants={fadeUp}
              {...officePanel}
              className="lg:col-span-7"
            >
              <PhysicalToDigitalPanel progress={scrollYProgress} />
              <span className="sr-only">
                A physical office introduces your brand in person; your website carries the
                same brand identity online, presented as: {BRAND_CHAPTER_TWO.officeLayers.join(", ")}.
              </span>
            </motion.div>
          </div>

          {/* Real-world examples — short labels, no paragraphs. */}
          <motion.div
            variants={riseIn}
            {...examples}
            className="mx-auto mt-20 max-w-3xl text-center"
          >
            <p className="text-muted-foreground">{BRAND_CHAPTER_TWO.examplesLead}</p>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {BRAND_CHAPTER_TWO.examples.map((example) => (
                <li
                  key={example.label}
                  className="rounded-xl border border-border bg-card px-3 py-4 text-center"
                >
                  <span className="block text-sm font-semibold text-foreground">
                    {example.label}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {example.detail}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-lg font-semibold tracking-tight text-foreground">
              {BRAND_CHAPTER_TWO.examplesTransition}
            </p>
          </motion.div>

          {/* Final statement + restrained CTA. */}
          <motion.div
            variants={riseIn}
            {...closing}
            className="mx-auto mt-20 max-w-2xl text-center"
          >
            <p className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {BRAND_CHAPTER_TWO.final.line1}
            </p>
            <p className="mt-4 text-muted-foreground">{BRAND_CHAPTER_TWO.final.line2}</p>
            <p className="mt-4 text-lg font-semibold tracking-tight text-foreground">
              {BRAND_CHAPTER_TWO.final.line3}
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href={BRAND_CHAPTER_TWO.final.cta.href}
                onClick={() =>
                  trackEvent("contact_cta_click", {
                    cta_location: "brand-story",
                    cta_label: "start-building-your-digital-office",
                    destination: BRAND_CHAPTER_TWO.final.cta.href,
                  })
                }
                className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
              >
                {BRAND_CHAPTER_TWO.final.cta.label}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
