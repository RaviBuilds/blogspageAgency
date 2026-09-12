"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { PRESENCE_STORY } from "@/lib/homepage-data";
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
const BRAND_TEXT_GRADIENT = {
  backgroundImage:
    "linear-gradient(90deg, #0891B2 0%, #4353C9 52%, #7C3AED 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text",
  color: "transparent",
} as const;

const SPRING = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 1,
} as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

export function DigitalPresenceStory() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id={PRESENCE_STORY.anchorId}
      className="scroll-mt-24 border-t border-border-subtle bg-background-subtle py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          variants={container}
          initial={shouldReduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p variants={fadeUp} className="text-sm font-medium text-primary">
            {PRESENCE_STORY.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {HEADING_MAIN || PRESENCE_STORY.heading}
            {HEADING_MAIN && (
              <span style={BRAND_TEXT_GRADIENT}>{HEADING_ACCENT}</span>
            )}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            {PRESENCE_STORY.lead}
          </motion.p>
        </motion.div>

        {/* Connection diagram — decorative; copy above/below carries meaning */}
        <DigitalHomeVisual />

        {/* Benefits — real text, business language (Blueprint §10) */}
        <motion.ul
          variants={container}
          initial={shouldReduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
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
          initial={shouldReduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
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
