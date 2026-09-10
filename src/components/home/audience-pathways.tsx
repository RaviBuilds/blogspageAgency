"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { AUDIENCE } from "@/lib/homepage-data";

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 2 — "Where are you right now?" (Blueprint §9)

   Self-selection with the simplest mechanism that creates clarity: three
   cards whose meaning is complete without any interaction (title + line
   always render server-side); selecting a card only reveals the supporting
   detail and the path's CTA. Each CTA is a real `<Link>`, so every path
   navigates even before hydration and without JavaScript.

   The R2.0 spec's comprehension rule holds: nothing essential is hidden
   behind interaction or animation.
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
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

export function AudiencePathways() {
  const shouldReduceMotion = useReducedMotion();
  // Pre-select the first path so the reveal pattern is discoverable and no
  // card renders an empty detail state on first paint.
  const [selected, setSelected] = useState<string>(AUDIENCE.paths[0].id);

  return (
    <section className="border-t border-border bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          variants={container}
          initial={shouldReduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p variants={fadeUp} className="text-sm font-medium text-primary">
            {AUDIENCE.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {AUDIENCE.heading}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            {AUDIENCE.sub}
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial={shouldReduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-4 md:grid-cols-3"
        >
          {AUDIENCE.paths.map((path) => {
            const isSelected = selected === path.id;
            return (
              <motion.div
                key={path.id}
                variants={fadeUp}
                className={cn(
                  "flex h-full flex-col rounded-2xl border bg-card p-6 transition-colors duration-300",
                  isSelected
                    ? "border-border-strong"
                    : "border-border hover:border-border-strong",
                )}
              >
                {/* Selection toggle — reveals context; never the only carrier
                    of the message (title + line are always visible). */}
                <button
                  type="button"
                  aria-pressed={isSelected}
                  aria-expanded={isSelected}
                  onClick={() => setSelected(path.id)}
                  className="-m-2 cursor-pointer rounded-xl p-2 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  <span className="block text-lg font-semibold tracking-tight text-foreground">
                    {path.title}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                    {path.line}
                  </span>
                </button>

                {isSelected ? (
                  <div className="mt-5 flex flex-1 flex-col border-t border-border-subtle pt-5">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {path.detail}
                    </p>
                    <div className="mt-auto pt-5">
                      <Link
                        href={path.cta.href}
                        onClick={() =>
                          trackEvent("problem_selector_click", {
                            path: path.id,
                            destination: path.cta.href,
                          })
                        }
                        className="-my-2 inline-block py-2 text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                      >
                        {path.cta.label}
                        <ArrowRight className="ml-1.5 inline size-3.5" />
                      </Link>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
