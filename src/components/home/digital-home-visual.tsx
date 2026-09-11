"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { PRESENCE_STORY } from "@/lib/homepage-data";

/* ─────────────────────────────────────────────────────────────────────────────
   R4 — DIGITAL HOME visual (Movement 2b, Blueprint §10)

   One custom DOM/SVG composition that makes the business value of a website
   immediately understandable:

     discovery (Instagram · Google · WhatsApp · YouTube)
       → signals converge into YOUR BUSINESS
       → the website activates as the digital home (the focal surface)
       → one signal enters the site
       → outcomes appear: Enquiries · Bookings · Content · SEO foundation

   Motion rules:
   - a single one-shot timeline, driven by one parent `whileInView` trigger;
     every descendant inherits the hidden/show variant labels from it
   - nothing loops; after the sequence the system settles into a complete
     rest state (channels, business, website and outcomes are all visible)
   - compositor-friendly: opacity / transform / SVG path drawing only

   The whole visual is `aria-hidden` — the section's real copy (heading,
   lead, benefits, CTA) carries the meaning; this is the illustrated echo.

   Color semantics follow the approved signal triad:
   cyan = discovery / incoming attention / website entry
   blue = business / customer action
   violet = intelligence / future capability (content)
   ───────────────────────────────────────────────────────────────────────────── */

/** Staggered entrance helper — each call site owns its place in the timeline. */
function fadeUp(delay: number, y = 14): Variants {
  return {
    hidden: { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.55, ease: "easeOut" },
    },
  };
}

/* --- Act 1: discovery ----------------------------------------------------------- */

/** Capsule centres on the 560-unit field the convergence curves share. */
const CHANNEL_STARTS = [70, 210, 350, 490];

function DiscoveryChannels() {
  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-3">
      {PRESENCE_STORY.channels.map((channel, i) => (
        <motion.span
          key={channel}
          variants={fadeUp(0.05 + i * 0.08)}
          className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full border border-border bg-card px-2 text-xs font-medium text-foreground shadow-sm sm:px-4"
        >
          <span className="mr-1.5 hidden size-1.5 rounded-full bg-accent-cyan/80 sm:block" />
          {channel}
        </motion.span>
      ))}
    </div>
  );
}

/* --- Act 1 → 2: convergence into the business ------------------------------------ */

/**
 * Four hairline curves draw in, then one cyan signal per channel travels
 * inward and dissolves into the business node. After the sequence the
 * signals are gone — only the quiet hairlines remain at rest.
 */
function ConvergenceField() {
  return (
    <svg
      className="h-24 w-full"
      viewBox="0 0 560 96"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {CHANNEL_STARTS.map((x, i) => (
        <motion.path
          key={`base-${x}`}
          d={`M ${x} 3 C ${x} 52, 280 40, 280 93`}
          stroke="var(--border-strong)"
          strokeWidth={1.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          variants={{
            hidden: { pathLength: 0 },
            show: {
              pathLength: 1,
              transition: { delay: 0.55 + i * 0.08, duration: 0.6, ease: "easeOut" },
            },
          }}
        />
      ))}
      {CHANNEL_STARTS.map((x, i) => (
        <motion.path
          key={`signal-${x}`}
          d={`M ${x} 3 C ${x} 52, 280 40, 280 93`}
          stroke="var(--accent-cyan)"
          strokeWidth={1.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          variants={{
            hidden: { pathLength: 0.14, pathOffset: 0, opacity: 0 },
            show: {
              pathLength: 0.14,
              pathOffset: 0.86,
              opacity: [0, 1, 1, 0],
              transition: {
                delay: 1.05 + i * 0.1,
                duration: 0.85,
                ease: "linear",
                opacity: {
                  delay: 1.05 + i * 0.1,
                  duration: 0.85,
                  times: [0, 0.12, 0.78, 1],
                },
              },
            },
          }}
        />
      ))}
    </svg>
  );
}

function BusinessNode() {
  return (
    <motion.div variants={fadeUp(1.5)} className="flex justify-center">
      <span className="relative inline-flex">
        {/* One-shot convergence ring: pulses once as the signals land, then rests. */}
        <motion.span
          variants={{
            hidden: { opacity: 0.5, scale: 1 },
            show: {
              opacity: 0,
              scale: 2,
              transition: { delay: 1.85, duration: 1.1, ease: "easeOut" },
            },
          }}
          className="absolute -inset-1 rounded-full border border-accent-blue/50"
        />
        {/* Activation edge: the node's border quietly turns blue once connected. */}
        <motion.span
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { delay: 1.95, duration: 0.6 } },
          }}
          className="absolute -inset-px rounded-full border border-accent-blue/40"
        />
        <span className="relative inline-flex h-11 items-center gap-2 rounded-full border border-border-strong bg-card px-5 text-sm font-semibold text-foreground shadow-sm">
          <span className="size-1.5 rounded-full bg-accent-blue" />
          {PRESENCE_STORY.hub}
        </span>
      </span>
    </motion.div>
  );
}


/* --- Connectors ------------------------------------------------------------------- */

/** Short vertical hairline whose travelling signal enters the next surface. */
function SignalLine({
  height,
  delay,
  color,
}: {
  height: number;
  delay: number;
  color: string;
}) {
  return (
    <svg
      className="mx-auto block"
      width="4"
      height={height}
      viewBox={`0 0 4 ${height}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <motion.path
        d={`M 2 0 L 2 ${height}`}
        stroke="var(--border-strong)"
        strokeWidth={1.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        variants={{
          hidden: { pathLength: 0 },
          show: {
            pathLength: 1,
            transition: { delay: Math.max(delay - 0.3, 0), duration: 0.4, ease: "easeOut" },
          },
        }}
      />
      <motion.path
        d={`M 2 0 L 2 ${height}`}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        variants={{
          hidden: { pathLength: 0.2, pathOffset: 0, opacity: 0 },
          show: {
            pathLength: 0.2,
            pathOffset: 0.8,
            opacity: [0, 1, 1, 0],
            transition: {
              delay,
              duration: 0.7,
              ease: "linear",
              opacity: { delay, duration: 0.7, times: [0, 0.15, 0.8, 1] },
            },
          },
        }}
      />
    </svg>
  );
}


/* --- Act 3: the website — the focal surface ---------------------------------------- */

const SITE_NAV = ["Services", "About", "Reviews", "Contact"];
const SITE_TILES = ["Services", "About", "Reviews"];

function WebsiteSurface() {
  return (
    <motion.div variants={fadeUp(2.55, 20)} className="relative mx-auto w-full max-w-lg">
      {/* Activation halo — a faint cyan atmosphere, painted only once active. */}
      <motion.span
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { delay: 3.1, duration: 1.0 } },
        }}
        className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-[radial-gradient(closest-side,rgba(14,116,144,0.07),transparent)]"
      />
      {/* Activation edge — a quiet cyan border over the resting hairline. */}
      <motion.span
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { delay: 3.1, duration: 0.8 } },
        }}
        className="pointer-events-none absolute -inset-px rounded-2xl border border-accent-cyan/50"
      />

      <div className="relative overflow-hidden rounded-2xl border border-border-strong bg-card shadow-xl shadow-primary/5">
        {/* Browser chrome */}
        <div className="flex items-center border-b border-border-subtle bg-background-subtle/60 px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="size-2 rounded-full bg-border" />
            <span className="size-2 rounded-full bg-border" />
            <span className="size-2 rounded-full bg-border" />
          </span>
          <span className="mx-auto inline-flex items-center rounded-md border border-border-subtle bg-card px-3 py-1 text-[10px] text-muted-foreground">
            yourbusiness.com
          </span>
          {/* Balance for the centered address pill */}
          <span className="w-[22px]" aria-hidden="true" />
        </div>


        {/* Site navigation */}
        <div className="flex items-center justify-between gap-2 border-b border-border-subtle px-4 py-3 sm:px-5">
          <span className="text-xs font-semibold tracking-tight text-foreground">
            {PRESENCE_STORY.hub}
          </span>
          <span className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:gap-3 sm:text-[10px]">
            {SITE_NAV.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </span>
        </div>

        {/* Hero */}
        <div className="px-5 py-7 text-center sm:px-6 sm:py-9">
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {PRESENCE_STORY.siteNode}
          </span>
          <p className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Your business, online.
          </p>
          <span className="mx-auto mt-3 block h-1.5 w-40 rounded-full bg-muted-foreground/15" />
          <span className="mx-auto mt-2 block h-1.5 w-28 rounded-full bg-muted-foreground/10" />

          {/* Primary action — subdued at rest, becomes active with the site. */}
          <div className="mt-5 flex justify-center">
            <span className="relative inline-flex h-9 items-center rounded-full bg-primary/10 px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              Enquire
              <motion.span
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { delay: 3.25, duration: 0.5 } },
                }}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                Enquire
              </motion.span>
            </span>
          </div>
        </div>

        {/* Site sections */}
        <div className="grid grid-cols-3 gap-px border-t border-border-subtle bg-border-subtle">
          {SITE_TILES.map((tile) => (
            <div key={tile} className="bg-card px-3 py-3.5 text-center">
              <span className="mx-auto block h-1.5 w-8 rounded-full bg-muted-foreground/20" />
              <span className="mt-2 block text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {tile}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}


/* --- Act 4: outcomes ----------------------------------------------------------------- */

/** Dot semantics: enquiries arrive (cyan), bookings/action (blue),
    content as future capability (violet), SEO as foundation (blue). */
const OUTPUT_DOTS = [
  "bg-accent-cyan",
  "bg-accent-blue",
  "bg-accent-violet",
  "bg-accent-blue",
] as const;

function Outcomes() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {PRESENCE_STORY.outputs.map((output, i) => (
        <motion.span
          key={output}
          variants={fadeUp(3.8 + i * 0.13)}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground shadow-sm"
        >
          <span className={`size-1.5 rounded-full ${OUTPUT_DOTS[i % OUTPUT_DOTS.length]}`} />
          {output}
        </motion.span>
      ))}
    </div>
  );
}

/* --- Composition ------------------------------------------------------------------------ */

export function DigitalHomeVisual() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      aria-hidden="true"
      className="relative mx-auto mt-14 max-w-xl"
    >
      {/* Restrained atmospheric depth: a faint blue light over discovery,
          a faint cyan light around the website. Mostly neutral overall. */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(67,83,201,0.05),transparent)]" />
        <div className="absolute bottom-0 left-1/2 h-80 w-[40rem] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(14,116,144,0.05),transparent)]" />
      </div>

      <div className="relative">
        <DiscoveryChannels />
        <ConvergenceField />
        <BusinessNode />

        {/* One signal leaves the business and enters the website. */}
        <div className="py-1">
          <SignalLine height={48} delay={2.5} color="var(--accent-cyan)" />
        </div>

        <WebsiteSurface />

        <div className="py-1">
          <SignalLine height={32} delay={3.55} color="var(--accent-blue)" />
        </div>

        <Outcomes />
      </div>
    </motion.div>
  );
}

