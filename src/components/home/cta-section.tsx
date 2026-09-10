"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { trackEvent } from "@/lib/analytics";
import { FINAL_CTA } from "@/lib/homepage-data";

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
   ───────────────────────────────────────────────────────────────────────────── */

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
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

export function FinalCTA() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="border-t border-border-subtle bg-background-subtle py-24 lg:py-32">
      <motion.div
        variants={container}
        initial={shouldReduceMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8"
      >
        <motion.p variants={fadeUp} className="text-sm font-medium text-primary">
          {FINAL_CTA.eyebrow}
        </motion.p>

        <motion.h2
          variants={fadeUp}
          className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
        >
          {FINAL_CTA.heading}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
        >
          {FINAL_CTA.sub}
        </motion.p>

        <div className="mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-2">
          {FINAL_CTA.choices.map((choice) => (
            <motion.div key={choice.need} variants={fadeUp}>
              <Link
                href={`#contact?need=${choice.need}`}
                onClick={() =>
                  trackEvent("contact_cta_click", {
                    cta_location: "final-cta",
                    need: choice.need,
                    destination: `#contact?need=${choice.need}`,
                  })
                }
                className="group flex h-14 items-center justify-between rounded-xl border border-border bg-card px-5 text-sm font-semibold text-foreground transition-colors duration-300 hover:border-border-strong hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {choice.label}
                <ArrowRight className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p variants={fadeUp} className="mt-8 text-sm text-muted-foreground">
          {FINAL_CTA.footnote}
        </motion.p>
      </motion.div>
    </section>
  );
}
