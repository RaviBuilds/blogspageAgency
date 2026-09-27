"use client";

/**
 * Hero composition — the page's signature visual.
 *
 * A layered device stack standing in for "a premium business website, designed":
 * a desktop browser window carrying an abstract high-end business interface, a
 * phone overlapping its lower-left corner carrying the same design at mobile
 * measure, and two design-file fragments (a colour token strip, a type
 * specimen) floating at the edges.
 *
 * ## Why this and not a screenshot
 *
 * A stock screenshot of someone else's website is the one thing a design agency
 * cannot put in its own hero. A real client screenshot belongs in the proof
 * gallery, where it is evidence rather than decoration. So the hero shows an
 * *intentionally designed Blogspage AI concept* — which also makes the 70/20/10
 * argument visually: the desktop surface is the design (70%), the fragments are
 * the brand system (20%), the deploy rail under the phone is the launch layer
 * (10%).
 *
 * ## Motion
 *
 * Two behaviours, both extremely restrained:
 *
 * 1. Entrance — the stack rises and settles once, slightly after the headline,
 *    on the page's house spring, each layer offset so the composition assembles
 *    rather than appearing.
 * 2. Float — the two fragments drift 6–8px on a long, offset loop. This is the
 *    only looping animation on the page. It exists because a perfectly still
 *    composition reads as a flat illustration, and it is small enough that a
 *    visitor notices dimensionality rather than movement.
 *
 * Under `prefers-reduced-motion` both resolve to the settled state and the loop
 * never starts.
 *
 * The whole composition is `aria-hidden`: it carries no information the headline
 * and the pillar bar beneath it do not already state in text.
 */

import { motion, useReducedMotion } from "framer-motion";

import { EASE, SPRING } from "@/lib/motion";
import { PILLAR_TONE } from "@/lib/web-design-visual-system";

import {
  BrowserFrame,
  FloatingFragment,
  Line,
  MockNav,
  Paragraph,
  PhoneFrame,
  Pill,
  alpha,
} from "./frames";

const BLUE = PILLAR_TONE.blue;
const VIOLET = PILLAR_TONE.violet;
const CYAN = PILLAR_TONE.cyan;

/* -------------------------------------------------------------------------- */
/* The designed surface inside the browser window                             */
/* -------------------------------------------------------------------------- */

/**
 * The abstract "premium business website" the hero is showing.
 *
 * Composed rather than generic: an inked hero band with a gradient wash, a
 * headline at two weights, a primary action, a trust rail, then a three-tile
 * service row and a conversion strip. It is the shape of the thing the page is
 * selling, at a glance.
 */
function DesignedSurface() {
  return (
    <div className="bg-card">
      <MockNav accent={BLUE} />

      {/* Hero band. */}
      <div
        className="relative overflow-hidden px-5 pb-6 pt-5"
        style={{
          background: `linear-gradient(135deg, ${alpha(BLUE, 0.1)} 0%, ${alpha(CYAN, 0.06)} 42%, transparent 78%)`,
        }}
      >
        <div className="flex gap-5">
          <div className="flex flex-[3] flex-col gap-2">
            <span
              className="flex h-3.5 w-24 items-center gap-1 rounded-full border px-1.5"
              style={{
                borderColor: alpha(BLUE, 0.25),
                backgroundColor: alpha(BLUE, 0.06),
              }}
            >
              <span
                className="size-1 rounded-full"
                style={{ backgroundColor: BLUE }}
              />
              <Line w="w-12" h="h-1" color={alpha(BLUE, 0.45)} />
            </span>
            <Line w="w-full" h="h-3.5" tone="ink" />
            <Line w="w-[72%]" h="h-3.5" color={alpha(BLUE, 0.8)} />
            <Paragraph lines={2} className="mt-1 max-w-[88%]" />
            <span className="mt-2 flex items-center gap-2">
              <Pill accent={BLUE} w="w-24" h="h-6" className="rounded-full" />
              <span className="h-6 w-20 rounded-full border border-border-strong" />
            </span>
          </div>

          {/* Enquiry panel — the conversion mechanism, always in the first view. */}
          <div className="flex flex-[2] flex-col gap-2 rounded-lg border border-border bg-card p-2.5 shadow-sm">
            <Line w="w-2/3" h="h-1.5" tone="strong" />
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-4 rounded border border-border-subtle bg-background-subtle"
              />
            ))}
            <Pill accent={VIOLET} w="w-full" h="h-4.5" className="mt-0.5 rounded-md" />
          </div>
        </div>
      </div>

      {/* Service tiles. */}
      <div className="grid grid-cols-3 gap-2.5 border-t border-border-subtle px-5 py-4">
        {[BLUE, VIOLET, CYAN].map((tone, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <span
              className="size-4 rounded-[0.3rem]"
              style={{ backgroundColor: alpha(tone, 0.16) }}
            />
            <Line w="w-3/4" h="h-1.5" tone="strong" />
            <Line w="w-full" h="h-1" tone="faint" />
            <Line w="w-[60%]" h="h-1" tone="faint" />
          </div>
        ))}
      </div>

      {/* Conversion strip. */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-3.5"
        style={{ backgroundColor: alpha(BLUE, 0.05) }}
      >
        <span className="flex flex-col gap-1">
          <Line w="w-36" h="h-1.5" tone="strong" />
          <Line w="w-24" h="h-1" tone="faint" />
        </span>
        <Pill accent={BLUE} w="w-20" h="h-5" />
      </div>
    </div>
  );
}

/** The same design at mobile measure — the responsive half of the story. */
function MobileSurface() {
  return (
    <div className="flex flex-col gap-2 px-2.5 pb-3 pt-2.5">
      <span className="flex items-center justify-between">
        <span
          className="size-2.5 rounded-[0.2rem]"
          style={{ backgroundColor: BLUE }}
        />
        <span className="flex flex-col gap-[3px]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-[2px] w-3.5 rounded-full bg-border-strong" />
          ))}
        </span>
      </span>
      <div
        className="mt-1 flex flex-col gap-1.5 rounded-md p-2"
        style={{
          background: `linear-gradient(160deg, ${alpha(BLUE, 0.12)}, transparent)`,
        }}
      >
        <Line w="w-full" h="h-2" tone="ink" />
        <Line w="w-2/3" h="h-2" color={alpha(BLUE, 0.7)} />
        <Line w="w-full" h="h-1" tone="faint" />
        <Pill accent={BLUE} w="w-full" h="h-4" className="mt-1 rounded-full" />
      </div>
      {[0, 1].map((i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span
            className="size-4 shrink-0 rounded"
            style={{ backgroundColor: alpha(i ? VIOLET : CYAN, 0.16) }}
          />
          <span className="flex flex-1 flex-col gap-1">
            <Line w="w-2/3" h="h-1" tone="strong" />
            <Line w="w-full" h="h-1" tone="faint" />
          </span>
        </span>
      ))}
      {/* Thumb-zone action: the mobile conversion rule this page argues for. */}
      <Pill accent={VIOLET} w="w-full" h="h-4" className="mt-auto rounded-full" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Composition                                                                */
/* -------------------------------------------------------------------------- */

export function HeroComposition() {
  const reduce = Boolean(useReducedMotion());

  /**
   * Entrance props for one layer of the stack.
   *
   * This is the one place on the page that uses a serialised `initial` rather
   * than the `useMotionReady` gate. That is deliberate and it is the documented
   * exemption, not an oversight: the whole composition is `aria-hidden`
   * decoration, so the SSR-visibility contract (`tests/seo/ssr-visibility.spec.ts`)
   * exempts it, and no word a visitor needs is inside it. Using the gate here
   * would cost a painted frame of settled artwork before the entrance begins,
   * which is exactly the flash the gate exists to prevent elsewhere.
   *
   * Under reduced motion `initial` collapses to `false`, so the layer renders
   * settled and nothing animates.
   */
  const enter = (delay: number, from: { y?: number; x?: number; rotateX?: number }) =>
    reduce
      ? ({
          initial: false as const,
          animate: { opacity: 1, y: 0, x: 0, rotateX: 0 },
          transition: { duration: 0 },
        } as const)
      : ({
          initial: { opacity: 0, y: 0, x: 0, rotateX: 0, ...from },
          animate: { opacity: 1, y: 0, x: 0, rotateX: 0 },
          transition: { ...SPRING, delay },
        } as const);

  /** The float loop, offset per fragment so the two never move in lockstep. */
  const float = (delay: number) =>
    reduce
      ? undefined
      : {
          y: [0, -7, 0],
          transition: {
            duration: 9,
            delay,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        };

  return (
    <div aria-hidden className="relative">
      {/* Ambient field behind the stack. Two soft washes, no mesh: the hero's
          atmosphere should suggest depth, not announce a gradient. */}
      <div
        className="pointer-events-none absolute -inset-x-16 -inset-y-20 -z-10"
        style={{
          background: `radial-gradient(60% 55% at 72% 22%, ${alpha(BLUE, 0.16)}, transparent 70%), radial-gradient(48% 48% at 22% 78%, ${alpha(VIOLET, 0.12)}, transparent 72%)`,
        }}
      />

      {/* Desktop window. Slight perspective so the stack has an axis; the tilt
          is small enough that the interface inside stays legible. */}
      <motion.div
        {...enter(0.34, { y: 30, rotateX: 5 })}
        style={{ transformPerspective: 1400 }}
        className="origin-bottom"
      >
        <BrowserFrame elevation="hero" className="rounded-2xl">
          <DesignedSurface />
        </BrowserFrame>
      </motion.div>

      {/* Phone, overlapping the window's lower-left corner. Hidden below `sm`,
          where it would crop the desktop surface it is meant to annotate. */}
      <motion.div
        className="absolute -bottom-10 -left-6 hidden w-[124px] sm:block lg:-left-12 lg:w-[142px]"
        {...enter(0.5, { y: 24, x: -12 })}
      >
        <PhoneFrame bodyClassName="aspect-[9/17]">
          <MobileSurface />
        </PhoneFrame>
      </motion.div>

      {/* Fragment 1 — the brand token strip (the 20% pillar, made visible). */}
      <motion.div
        className="absolute -right-4 top-14 hidden w-[128px] md:block lg:-right-10"
        {...enter(0.62, { y: 18 })}
      >
        <motion.div animate={float(0)}>
          <FloatingFragment label="Brand tokens">
            <span className="mt-2 flex gap-1">
              {[BLUE, VIOLET, CYAN, "#0E1524", "#EDF1F6"].map((tone) => (
                <span
                  key={tone}
                  className="size-4 rounded-[0.25rem] ring-1 ring-black/5"
                  style={{ backgroundColor: tone }}
                />
              ))}
            </span>
            <span className="mt-2.5 flex flex-col gap-1">
              <Line w="w-full" h="h-1" tone="faint" />
              <Line w="w-2/3" h="h-1" tone="faint" />
            </span>
          </FloatingFragment>
        </motion.div>
      </motion.div>

      {/* Fragment 2 — the launch rail (the 10% pillar, made visible). */}
      <motion.div
        className="absolute -bottom-6 right-6 hidden w-[164px] lg:block"
        {...enter(0.74, { y: 18 })}
      >
        <motion.div animate={float(1.6)}>
          <FloatingFragment label="Launch ready">
            <span className="mt-2 flex flex-col gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: CYAN }}
                  />
                  <Line w={i === 1 ? "w-2/3" : "w-full"} h="h-1" tone="faint" />
                </span>
              ))}
            </span>
            <span
              className="mt-2.5 block h-1 w-full overflow-hidden rounded-full"
              style={{ backgroundColor: alpha(CYAN, 0.15) }}
            >
              <motion.span
                className="block h-full origin-left rounded-full"
                style={{ backgroundColor: CYAN }}
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={
                  reduce ? { duration: 0 } : { duration: 1.1, delay: 0.95, ease: EASE }
                }
              />
            </span>
          </FloatingFragment>
        </motion.div>
      </motion.div>
    </div>
  );
}
