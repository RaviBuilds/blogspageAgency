"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { BRAND_CHAPTER_ONE, BRAND_CHAPTER_TWO } from "@/lib/brand-story-data";
import { TYPE_LEAD, TYPE_MICRO_LABEL, TYPE_SECTION } from "@/lib/brand-type";
import { RHYTHM_CONTINUE } from "@/lib/section-rhythm";
import { RISE_DEFAULT, RISE_TIGHT, SPRING, STAGGER_COPY } from "@/lib/motion";
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

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER_COPY } },
};

/* `hidden` is instant on purpose. These blocks arm their hidden state *after*
   hydration (see `useStaggerReveal`), so a timed `hidden` transition would read
   as a visible animation out of the already-painted server composition. Only
   `show` carries the spring. */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: RISE_DEFAULT, transition: { duration: 0 } },
  show: { opacity: 1, y: 0, transition: SPRING },
};

/** Shorter rise, for the standalone blocks between the chapter headers. */
const riseIn: Variants = {
  hidden: { opacity: 0, y: RISE_TIGHT, transition: { duration: 0 } },
  show: { opacity: 1, y: 0, transition: SPRING },
};

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
     reversible, matching `process-timeline.tsx`'s scroll architecture.

     Both offset endpoints track the wrapper's START (top) edge rather than
     start→end, so progress 0→1 completes over a fixed, viewport-relative
     scroll distance instead of the combined height of both chapters. With
     `end` pinned to the wrapper's bottom, `scrollYProgress` only reached 1
     once the *entire two-chapter block* had scrolled past — the orbit and
     the physical→digital panel were still mid-animation long after they had
     scrolled out of view. Pinning both endpoints to `start` means the whole
     timeline resolves within roughly half a viewport-height of scroll from
     first appearance, so the visuals are effectively settled by the time
     the block is 40–50% through the viewport. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "start 0.35"],
  });

  return (
    <div ref={sectionRef}>
      {/* ── Chapter 1 — Built for the long run ─────────────────────────── */}
      <section
        id={BRAND_CHAPTER_ONE.anchorId}
        /* CONTINUE, and no top border: this is the second beat of the teaching
           movement that DigitalPresenceStory opens (see that file). A border
           here would re-announce a lesson the reader is already inside. */
        className={`scroll-mt-24 bg-background ${RHYTHM_CONTINUE}`}
      >
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <motion.div
            variants={container}
            {...chapterOneHeader}
            /* Left-aligned: centered headers are now reserved for the three
               scanning anchors and the closing call. A narrative movement reads
               as prose, so it starts at the measure's left edge. */
            className="max-w-2xl"
          >
            {/* Chapter mark. The two brand chapters are the page's only numbered
                sequence, and numbering them is what makes them read as two parts
                of one story rather than two more sections. The numeral is set as
                a quiet tabular figure against a rule, not a display element —
                the chapter's thesis is still the loudest thing in this block. */}
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <span
                aria-hidden
                className="text-xs font-medium tabular-nums text-text-disabled"
              >
                01
              </span>
              <span aria-hidden className="h-px w-10 bg-border" />
              {/* Not a scanning anchor — muted micro label, see bento-grid. */}
              <p className={TYPE_MICRO_LABEL}>{BRAND_CHAPTER_ONE.eyebrow}</p>
            </motion.div>
            {/* P0-1: `question` / `answer` / `bridgeToBrand` were promoted out
                of this header into the Manifesto beat directly below the hero
                (see `manifesto.tsx`) — they are the page's belief, and they
                were being rendered at section size in the middle of a teaching
                movement. The copy is not duplicated here.

                What remains is the chapter's own job: explaining what a brand
                actually is. `insight` becomes that heading — it was already
                written, and it was already the chapter's thesis; it simply sat
                below the orbit instead of leading. It is removed from the
                bridge block further down, so it still renders exactly once. */}
            <motion.h2 variants={fadeUp} className={`mt-6 ${TYPE_SECTION}`}>
              {BRAND_CHAPTER_ONE.insight}
            </motion.h2>
            {/* The chapter's lead carries the LEAD tier; the paragraph after it
                stays at body size. Two paragraphs at identical size read as a
                wall — the step down is what marks the first one as the lead. */}
            <motion.p variants={fadeUp} className={`mt-6 ${TYPE_LEAD}`}>
              {BRAND_CHAPTER_ONE.lead}
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="mt-5 leading-relaxed text-muted-foreground"
            >
              {BRAND_CHAPTER_ONE.explanation}
            </motion.p>
          </motion.div>

          {/* Brand orbit — decorative; sr-only list below carries the words
              as real text for assistive technology and search engines. */}
          <div className="mt-14">
            <BrandOrbit />
            <span className="sr-only">
              A brand is built from: {BRAND_CHAPTER_ONE.dimensions.map((d) => d.label).join(", ")}.
            </span>
          </div>

          {/* Touchpoints, closing chapter 1. The insight line that used to
              introduce this row is now the chapter heading above — the row is
              the evidence for it, so it no longer needs its own restatement. */}
          <motion.div
            variants={riseIn}
            {...insightBridge}
            className="mx-auto mt-16 max-w-2xl text-center"
          >
            <TouchpointRow progress={scrollYProgress} />
            <span className="sr-only">
              Touchpoints: {BRAND_CHAPTER_ONE.touchpoints.join(" → ")}
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── Chapter 2 — Your website is your digital office ────────────── */}
      <section
        id={BRAND_CHAPTER_TWO.anchorId}
        /* CONTINUE, and no top border: chapter 2 is literally the same story as
           chapter 1 — they already share one scroll progress value. The surface
           change to `background-subtle` is the only boundary cue needed. */
        className={`scroll-mt-24 bg-background-subtle ${RHYTHM_CONTINUE}`}
      >
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
            {/* Copy column — narrower, asymmetric composition. */}
            <motion.div
              variants={container}
              {...chapterTwoCopy}
              className="lg:col-span-5"
            >
              {/* Chapter mark — the second half of the pair opened in chapter 1
                  above. Same treatment, incremented numeral: that repetition is
                  the whole point, since it is what tells the reader these two
                  sections are one story. */}
              <motion.div variants={fadeUp} className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="text-xs font-medium tabular-nums text-text-disabled"
                >
                  02
                </span>
                <span aria-hidden className="h-px w-10 bg-border" />
                {/* Not a scanning anchor — muted micro label, see bento-grid. */}
                <p className={TYPE_MICRO_LABEL}>{BRAND_CHAPTER_TWO.eyebrow}</p>
              </motion.div>
              <motion.h2 variants={fadeUp} className={`mt-6 ${TYPE_SECTION}`}>
                {BRAND_CHAPTER_TWO.question}
              </motion.h2>
              <motion.p variants={fadeUp} className={`mt-6 ${TYPE_LEAD}`}>
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
              <PhysicalToDigitalPanel />
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
