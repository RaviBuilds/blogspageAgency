"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { trackEvent } from "@/lib/analytics";
import { FINAL_CTA } from "@/lib/homepage-data";
import {
  BRAND_TEXT_GRADIENT,
  TYPE_DISPLAY,
  TYPE_LEAD,
  TYPE_META,
  TYPE_MICRO_LABEL,
} from "@/lib/brand-type";
import { RHYTHM_CHAPTER } from "@/lib/section-rhythm";
import { RISE_DISPLAY, SPRING, STAGGER_COPY } from "@/lib/motion";
import { useStaggerReveal } from "@/components/home/scroll-reveal";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 7 — Final conversion (Blueprint §20)

   "Tell us where you want your business to go." with four understandable
   starting paths. Replaces the marquee + magnetic-button section: the
   perpetual marquee animation is retired (motion rules) and the old
   "scale without headcount / deploy your AI system" voice is replaced by
   the business-owner narrative.

   Each choice navigates to the conversation section carrying its context
   (`#contact?need=…`), which the ConversationExperience parses out of the
   hash. Nobody is forced into the chat; every path is a real link.

   ## The closing frame

   This is the last thing on the page, and it used to be a centered `max-w-4xl`
   block above a 2×2 of rounded cards — visually indistinguishable from the nine
   other card sections above it. The page's closing argument read as one more
   conversion component, so the page didn't end so much as stop.

   It is now composed as the page's second bookend, deliberately mirroring the
   Manifesto:

   - `TYPE_DISPLAY`, the tier used in exactly these two places.
   - The same left-inset 12-column field and the same opening accent hairline,
     so the beginning and the end of the argument are recognisably one gesture.
   - `RHYTHM_CHAPTER`, the widest spacing on the page.
   - The four paths as hairline-ruled rows rather than cards, because a card
     grid is the language the rest of the page already exhausted.

   The section stays on `background-subtle` rather than going dark: the Footer
   directly below it is already a `.dark` surface, so a dark ending here would
   merge the closing statement into the footer chrome and lose the boundary
   entirely. The light surface plus the rising brand-blue field is what makes
   the dark footer read as *after* the page rather than part of it.
   ───────────────────────────────────────────────────────────────────────────── */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER_COPY } },
};

/* `hidden` is instant: it arms after hydration (see `useStaggerReveal`), so a
   timed hidden transition would animate *away* from the painted server
   composition. Only `show` carries the spring. */
/* RISE_DISPLAY: this section and the Manifesto are the page's two DISPLAY-scale
   moments, and at that type size the default 24px rise is nearly imperceptible.
   The longer travel is what gives the closing statement a real arrival. */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: RISE_DISPLAY, transition: { duration: 0 } },
  show: { opacity: 1, y: 0, transition: SPRING },
};

/**
 * Section heading treatment — parity with the other homepage sections: the
 * neutral headline stays neutral; the meaningful final phrase carries the
 * restrained brand text sweep. No data change — the phrase is sliced from
 * the existing `FINAL_CTA.heading` string, with a safe whole-heading fallback.
 */
const HEADING_TEXT = FINAL_CTA.heading;
const HEADING_ACCENT = "your business to go.";
const HEADING_MAIN = HEADING_TEXT.endsWith(HEADING_ACCENT)
  ? HEADING_TEXT.slice(0, HEADING_TEXT.length - HEADING_ACCENT.length)
  : "";

export function FinalCTA() {
  /* SSR-safe reveal gate — the prerendered HTML carries the settled, readable
     composition; the hidden state arms only after hydration. */
  const reveal = useStaggerReveal();

  return (
    <section
      className={cn(
        "relative overflow-hidden border-t border-border-subtle bg-background-subtle",
        RHYTHM_CHAPTER,
      )}
    >
      {/* Closing light. One soft field rising from the bottom of the page, in
          the brand's own blue-violet, so the last frame has a source of light
          instead of being flat paper. Static, decorative, aria-hidden. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[32rem]"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 118%, rgba(67, 83, 201, 0.09), transparent 72%), radial-gradient(40% 80% at 72% 108%, rgba(124, 58, 237, 0.06), transparent 74%)",
        }}
      />

      <motion.div
        variants={container}
        {...reveal}
        className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8"
      >
        {/* The statement. Left-aligned and inset one column, mirroring the
            manifesto's composition so the page's two bookends are visibly the
            same gesture — the argument opened here and closes here. */}
        <div className="lg:grid lg:grid-cols-12">
          <div className="lg:col-span-11 lg:col-start-2">
            <motion.span
              variants={fadeUp}
              aria-hidden
              className="block h-px w-16 bg-gradient-to-r from-primary/70 to-transparent"
            />

            <motion.p variants={fadeUp} className={`mt-10 ${TYPE_MICRO_LABEL}`}>
              {FINAL_CTA.eyebrow}
            </motion.p>

            {/* DISPLAY tier — the page's closing argument, and one of only two
                uses on the page (the other is the manifesto). */}
            <motion.h2
              variants={fadeUp}
              className={`mt-6 max-w-[20ch] ${TYPE_DISPLAY}`}
            >
              {HEADING_MAIN || FINAL_CTA.heading}
              {HEADING_MAIN && (
                <span style={BRAND_TEXT_GRADIENT}>{HEADING_ACCENT}</span>
              )}
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className={`mt-10 max-w-xl ${TYPE_LEAD}`}
            >
              {FINAL_CTA.sub}
            </motion.p>
          </div>
        </div>

        {/*
          The four paths as a ruled register, not a card grid.

          These were four `rounded-xl` bordered cards in a 2×2 — the exact
          component language the page had already spent on services, pathways,
          industries, benefits and the work archive. Reusing it for the final
          gesture made the ending read as one more UI block to evaluate.

          A ruled list reads as a set of choices instead: hairline-separated
          rows, the label carrying each row at a real size, the arrow as the
          only affordance. It also scales honestly to a phone, where a 2×2 grid
          of cards collapses into four stacked boxes anyway.
        */}
        <div className="mt-20 lg:grid lg:grid-cols-12">
          <ul className="border-t border-border lg:col-span-10 lg:col-start-3">
            {FINAL_CTA.choices.map((choice) => (
              <motion.li
                key={choice.need}
                variants={fadeUp}
                className="border-b border-border"
              >
                <Link
                  href={`#contact?need=${choice.need}`}
                  onClick={() =>
                    trackEvent("contact_cta_click", {
                      cta_location: "final-cta",
                      need: choice.need,
                      destination: `#contact?need=${choice.need}`,
                    })
                  }
                  className="group flex items-center justify-between gap-6 py-6 transition-colors duration-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span className="text-xl font-semibold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-2xl">
                    {choice.label}
                  </span>
                  <ArrowRight className="size-5 shrink-0 text-text-subtle transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-primary" />
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* The footnote, set as metadata rather than another paragraph. This is
            the last text on the page before the footer; it should read as a
            closing note, not a final pitch. */}
        <div className="mt-12 lg:grid lg:grid-cols-12">
          <motion.p
            variants={fadeUp}
            className={`max-w-sm lg:col-span-10 lg:col-start-3 ${TYPE_META}`}
          >
            {FINAL_CTA.footnote}
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
