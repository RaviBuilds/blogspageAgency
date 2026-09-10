"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { PROOF_STRIP } from "@/lib/homepage-data";

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
 * Instrumented hero CTA pair (TASK H1 / §19). Real crawlable `<Link>`
 * anchors wrapped by `Button` with `asChild`, exactly as before — only the
 * `onClick` analytics call is new. Lives here, not in the server `Hero`,
 * because firing `trackEvent` requires a client component.
 */
export function HeroCtas() {
  return (
    <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row">
      <Button
        size="lg"
        className="glow-border h-11 w-full bg-white px-6 text-black hover:bg-white/90 sm:w-auto"
        asChild
      >
        <Link
          href="#contact"
          onClick={() =>
            trackEvent("hero_cta_click", {
              cta_location: "hero",
              cta_label: "tell-us-what-youre-building",
              destination: "#contact",
            })
          }
        >
          Tell Us What You&apos;re Building
          <ArrowRight className="size-4" />
        </Link>
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="h-11 w-full border-white/[0.08] bg-white/2 px-6 hover:bg-white/6 sm:w-auto"
        asChild
      >
        <Link
          href="#work"
          onClick={() =>
            trackEvent("work_cta_click", {
              cta_location: "hero",
              cta_label: "see-our-work",
              destination: "#work",
            })
          }
        >
          See Our Work
        </Link>
      </Button>
    </div>
  );
}

/**
 * Client-side ambience for the hero: the two breathing radial-gradient blobs
 * behind the content. Purely decorative, `aria-hidden`, and has no bearing on
 * the server-rendered `<h1>` or summary paragraph living in `Hero`.
 */
export function HeroGradients() {
  return (
    <>
      {/*
        Hero V2 re-aimed and re-coloured both blobs.

        The first now sits behind the system column (left 76%, vertically level
        with it) rather than drifting near the headline at left 58%. Its job
        changed: it is no longer generic hero ambience, it is the atmosphere the
        Active Blueprint is lit against, which is what stops the modules reading
        as cut-outs floating in flat black. Electric Violet `#7c3aed` replaces the
        old violet/fuchsia pair so the hero resolves to one accent.

        The second was sky blue — a second accent competing with the first for a
        hero that should have exactly one. It is now a very faint indigo (the
        existing `--primary`), low enough to read as depth in the bottom-left
        rather than as a colour of its own.
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
        className="pointer-events-none absolute -bottom-40 left-[12%] -z-10 size-[36rem] rounded-full bg-[radial-gradient(circle,rgba(94,106,210,0.16),transparent_64%)] blur-[120px]"
      />
    </>
  );
}

/**
 * Client-side ambience for the hero: the scroll-revealed proof strip
 * (Blueprint §8). Two layers — the sectors genuinely shipped (each
 * substantiated by a project in `featured-work-data.ts`), then technology as
 * one restrained text line rather than a logo wall.
 *
 * `useReducedMotion()` gates the entrance animation: when the visitor has
 * requested reduced motion, `initial` matches the `show` variant state so
 * the strip mounts fully visible with no transform or fade, satisfying the
 * same guarantee `.hero-word`'s media-query guard gives the headline.
 */
export function HeroProofStrip() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={container}
      initial={shouldReduceMotion ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="mt-16 max-w-3xl rounded-2xl border border-white/[0.08] bg-white/2.5 px-5 py-5 backdrop-blur lg:mt-28"
    >
      <motion.p
        variants={fadeUp}
        className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground"
      >
        {PROOF_STRIP.label}
      </motion.p>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PROOF_STRIP.sectors.map((sector) => (
          <motion.li
            key={sector}
            variants={fadeUp}
            className="flex h-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/2.5 px-3 text-center text-sm font-semibold tracking-tight text-muted-foreground transition-colors hover:text-foreground"
          >
            {sector}
          </motion.li>
        ))}
      </ul>

      <motion.p
        variants={fadeUp}
        className="mt-6 border-t border-white/[0.06] pt-4 text-xs tracking-wide text-muted-foreground"
      >
        {PROOF_STRIP.techLine}
      </motion.p>
    </motion.div>
  );
}
