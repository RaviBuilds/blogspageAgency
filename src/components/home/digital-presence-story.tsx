"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { PRESENCE_STORY } from "@/lib/homepage-data";

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 2b — The "starting from zero" story (Blueprint §10)

   Why a website matters, in business language: the channels a business
   already uses converge into the business, the website becomes its digital
   home, and the website feeds enquiries now and content/commerce/SEO later.

   The diagram is Motion 2 of the signature-motion set ("digital presence
   connection"): SVG connectors draw on scroll via `pathLength`. The whole
   diagram is `aria-hidden` — the headline, lead and benefits carry the
   meaning as real text; the illustration is a reward, never a requirement.
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

/* Converging connectors: one path per channel, drawn top-to-centre.
   Percent coordinates keep the curves responsive without measuring DOM. */
function ChannelConnectors({ animate }: { animate: boolean }) {
  const starts = [9, 30, 70, 91];
  return (
    <svg
      className="h-12 w-full max-w-xl"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      {starts.map((x, i) => (
        <motion.path
          key={x}
          d={`M ${x} 2 C ${x} 22, 50 18, 50 38`}
          stroke="var(--border-strong, var(--border))"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          initial={animate ? { pathLength: 0 } : false}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}

/* Short vertical connector between stacked diagram nodes. */
function VerticalConnector({ animate, delay }: { animate: boolean; delay: number }) {
  return (
    <div className="flex justify-center py-1">
      <svg className="h-10 w-4" viewBox="0 0 4 40" fill="none" aria-hidden>
        <motion.path
          d="M 2 0 L 2 40"
          stroke="var(--border-strong, var(--border))"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          initial={animate ? { pathLength: 0 } : false}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

export function DigitalPresenceStory() {
  const shouldReduceMotion = useReducedMotion();
  const animate = !shouldReduceMotion;

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
            {PRESENCE_STORY.heading}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            {PRESENCE_STORY.lead}
          </motion.p>
        </motion.div>

        {/* Connection diagram — decorative; copy above/below carries meaning */}
        <div aria-hidden className="mx-auto mt-14 max-w-xl">
          <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-center sm:gap-4">
            {PRESENCE_STORY.channels.map((channel) => (
              <motion.span
                key={channel}
                variants={fadeUp}
                initial={shouldReduceMotion ? "show" : "hidden"}
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground"
              >
                {channel}
              </motion.span>
            ))}
          </div>

          <div className="mt-1 flex justify-center">
            <ChannelConnectors animate={animate} />
          </div>

          <div className="flex justify-center">
            <motion.span
              variants={fadeUp}
              initial={shouldReduceMotion ? "show" : "hidden"}
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-5 text-sm font-semibold text-foreground"
            >
              {PRESENCE_STORY.hub}
            </motion.span>
          </div>

          <VerticalConnector animate={animate} delay={0.1} />

          <div className="flex justify-center">
            <motion.div
              variants={fadeUp}
              initial={shouldReduceMotion ? "show" : "hidden"}
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="inline-flex flex-col items-center rounded-2xl border border-primary/40 bg-card px-8 py-4 shadow-lg shadow-primary/5"
            >
              <span className="text-lg font-semibold tracking-tight text-foreground">
                {PRESENCE_STORY.siteNode}
              </span>
              <span className="mt-0.5 text-xs text-muted-foreground">
                your digital home
              </span>
            </motion.div>
          </div>

          <VerticalConnector animate={animate} delay={0.1} />

          <div className="grid grid-cols-2 gap-3 sm:flex sm:justify-center sm:gap-4">
            {PRESENCE_STORY.outputs.map((output) => (
              <motion.span
                key={output}
                variants={fadeUp}
                initial={shouldReduceMotion ? "show" : "hidden"}
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                className="inline-flex h-10 items-center justify-center rounded-full border border-border-subtle bg-card/60 px-4 text-sm text-muted-foreground"
              >
                {output}
              </motion.span>
            ))}
          </div>
        </div>

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
