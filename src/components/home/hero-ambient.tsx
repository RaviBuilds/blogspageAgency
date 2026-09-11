"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { HERO_JOURNEY } from "@/lib/homepage-data";

// Premium spring from the design system (§5 Motion Physics).
const SPRING = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 1,
} as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

/**
 * Instrumented hero CTA pair (analytics contract §32, creative blueprint).
 * Event names are untouched — only the labels and their payload values
 * evolve with the R2.1 copy. Real crawlable `<Link>` anchors wrapped by
 * `Button` with `asChild`; `trackEvent` requires a client component.
 *
 * R2.1 FINAL polish: the primary stays a plain white button — the strongest
 * clickable element precisely because it is not decorated — with only an
 * arrow that travels a few pixels on hover and the site-wide active press.
 * The signal on the CTA is the `glow-border` halo, not a gradient fill.
 */
export function HeroCtas() {
  return (
    <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
      <Button
        size="lg"
        className="glow-border h-11 w-full bg-white px-6 text-black transition-transform hover:bg-white/90 active:scale-[0.98] sm:w-auto"
        asChild
      >
        <Link
          href="#contact"
          className="group"
          onClick={() =>
            trackEvent("hero_cta_click", {
              cta_location: "hero",
              cta_label: "tell-us-what-your-business-needs",
              destination: "#contact",
            })
          }
        >
          Tell Us What Your Business Needs
          <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
        </Link>
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="h-11 w-full border-white/[0.08] bg-white/2 px-6 text-muted-foreground transition-colors hover:bg-white/6 hover:text-foreground sm:w-auto"
        asChild
      >
        <Link
          href="#work"
          onClick={() =>
            trackEvent("work_cta_click", {
              cta_location: "hero",
              cta_label: "see-what-weve-built",
              destination: "#work",
            })
          }
        >
          See What We&apos;ve Built
        </Link>
      </Button>
    </div>
  );
}

/**
 * Signature motif A — the connector line (creative blueprint §19).
 *
 * A single quiet vertical line dropping from the centre of the hero's bottom
 * edge, fading as it crosses into the light section below, where the matching
 * stub in `AudiencePathways` receives it. Purely decorative CSS (`aria-hidden`,
 * zero JS, zero listeners) — it reads as one visual thread from the system
 * into "Where are you right now?" without any scroll machinery.
 */
export function HeroConnector() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center"
    >
      {/*
        The signal dot: the same gradient triad the system's packets speak,
        compressed to one point. It marks the thread's origin — the business
        story leaving the hero — without adding a second visual voice.

        R2.1 FINAL-POLISH: the filament is a step longer and slightly firmer at
        its origin, so the thread spans the tightened lower rhythm and visibly
        hands the visitor into "Where are you right now?" rather than dissolving
        halfway. Still pure CSS, zero JS, and the matching stub in
        AudiencePathways receives it unchanged.
      */}
      <span className="size-1.5 rounded-full bg-[linear-gradient(135deg,#67E8F9,#828FFF,#A78BFA)] shadow-[0_0_10px_rgba(130,143,255,0.6)]" />
      {/*
        R2.2 polish: the filament's origin is now website cyan, easing into
        the signal blue — the hero's Website concept visibly continues down
        into "Where are you right now?" instead of the thread starting from a
        generic triad glow. Same geometry, same zero-JS CSS.
      */}
      <div className="mt-1 h-20 w-px bg-gradient-to-b from-[#67E8F9]/55 via-[#828FFF]/22 to-transparent md:h-28" />
    </div>
  );
}

/**
 * Client-side ambience for the hero: the breathing radial-gradient light
 * behind the content. Purely decorative, `aria-hidden`, and has no bearing on
 * the server-rendered `<h1>` or summary paragraph living in `Hero`.
 */
export function HeroGradients() {
  return (
    <>
      {/*
        Hero V2 aimed both blobs at the system visual; R2.1 FINAL completes
        the atmosphere with the full canonical triad, one hue per region and
        every one of them barely-there:

        - Violet keeps its seat behind the Active Blueprint — the atmosphere
          the system is lit against, which is what stops the modules reading
          as cut-outs floating in flat black.
        - Blue holds the lower-left, faint enough to read as depth rather
          than as a colour of its own (it replaces the old indigo with the
          canonical dark-signal blue).
        - Cyan enters as a small cool key light above the system, so the
          WEBSITE side of the composition sits in the hue it carries.

        None of them floods the frame: each stays at or under a third of its
        already-low peak alpha, blurred past recognition, breathing on its
        own long period so the light never syncs into a visible rhythm.
      */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0.22, scale: 0.9 }}
        animate={{ opacity: [0.22, 0.4, 0.22], scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[76%] top-20 -z-10 size-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.32),rgba(124,58,237,0.13)_38%,transparent_68%)] blur-[110px]"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0.18, scale: 1.1 }}
        animate={{ opacity: [0.18, 0.3, 0.18], scale: [1.1, 0.95, 1.1] }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="pointer-events-none absolute -bottom-40 left-[12%] -z-10 size-[36rem] rounded-full bg-[radial-gradient(circle,rgba(130,143,255,0.14),transparent_64%)] blur-[120px]"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0.12, scale: 0.95 }}
        animate={{ opacity: [0.12, 0.24, 0.12], scale: [0.95, 1.06, 0.95] }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="pointer-events-none absolute left-[86%] top-[4%] -z-10 size-[30rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(103,232,249,0.11),transparent_62%)] blur-[100px]"
      />
    </>
  );
}

/**
 * Client-side ambience for the hero: the business-journey proof line (R2.2).
 *
 * Replaces R2.1's "Systems shipped across" card, which competed with the H1
 * and the system visual for attention and read as the hero's second-strongest
 * element. The replacement is deliberately quiet and editorial — no bordered
 * container, no grid, no technology names. One micro-label, one hairline, one
 * chain of words naming the journey the system visual beside them animates:
 * Brand → Website → Enquiries → Operations → Automation.
 *
 * "Website" carries the signal cyan so the proof line and the light website
 * surface speak the same hue, and so the hero's last beat before the connector
 * hands off to "Where are you right now?" is already website-shaped — the
 * scroll reads as one continuing narrative rather than two unrelated sections.
 *
 * `useReducedMotion()` gates the entrance animation: when the visitor has
 * requested reduced motion, `initial` matches the `show` variant state so
 * the strip mounts fully visible with no transform or fade, satisfying the
 * same guarantee `.hero-word`'s media-query guard gives the headline.
 */
export function HeroJourneyProof() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={container}
      initial={shouldReduceMotion ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="mt-10 lg:mt-12"
    >
      <motion.p
        variants={fadeUp}
        className="flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-muted-foreground"
      >
        {/*
          R2.2 polish: the hairline is the signal line — it starts in the
          website cyan the light surface above speaks and settles to neutral,
          so the proof reads as the same story the system is animating rather
          than a caption tacked on underneath it.
        */}
        <span
          aria-hidden
          className="h-px w-8 shrink-0 bg-[linear-gradient(90deg,rgba(103,232,249,0.55),rgba(255,255,255,0.15))]"
        />
        {HERO_JOURNEY.label}
      </motion.p>

      <motion.p
        variants={fadeUp}
        className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm tracking-tight text-muted-foreground"
      >
        {HERO_JOURNEY.steps.map((step, i) => (
          <span key={step} className="flex items-center gap-x-2.5">
            {i > 0 && (
              <ArrowRight
                aria-hidden
                strokeWidth={1.5}
                className="size-3 text-white/25"
              />
            )}
            {step === HERO_JOURNEY.highlight ? (
              <span className="flex items-center gap-1.5 font-medium text-[#67E8F9]">
                {/* The journey's current point: the same signal dot the
                    connector drops from the hero's bottom edge, one hue. */}
                <span
                  aria-hidden
                  className="size-1 rounded-full bg-[#67E8F9] shadow-[0_0_6px_rgba(103,232,249,0.7)]"
                />
                {step}
              </span>
            ) : (
              <span>{step}</span>
            )}
          </span>
        ))}
      </motion.p>
    </motion.div>
  );
}
