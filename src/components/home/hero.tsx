"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";

const trustedLogos = ["OpenAI", "Vercel", "Supabase", "Next.js", "Stripe"];

// Premium spring from the design system (§5 Motion Physics).
const SPRING = { type: "spring", stiffness: 100, damping: 20, mass: 1 } as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const lineReveal: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const wordReveal: Variants = {
  hidden: { opacity: 0, y: "100%", rotateX: -55 },
  show: {
    opacity: 1,
    y: "0%",
    rotateX: 0,
    transition: SPRING,
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

// Kinetic helper: handles multi-line headlines.
// The `overflow-hidden` mask lives at the LINE level with generous padding
// so the 3D-rotated words rise into view from behind an invisible floor.
// Each line is a motion.span (block) so variant propagation flows from the
// parent container → line → words without breaks.
function KineticHeadline({ lines, className }: { lines: string[]; className?: string }) {
  return (
    <>
      {lines.map((line, lineIdx) => (
        <motion.span
          key={lineIdx}
          variants={lineReveal}
          className={`block overflow-hidden pb-3 ${lineIdx > 0 ? "mt-2" : ""} ${className ?? ""}`}
        >
          {line.split(" ").map((word, i, arr) => (
            <span
              key={`${word}-${lineIdx}-${i}`}
              className="inline-block align-bottom"
              style={{ perspective: "1000px" }}
            >
              <motion.span
                variants={wordReveal}
                className="inline-block origin-bottom will-change-transform"
              >
                {word}
              </motion.span>
              {i < arr.length - 1 ? "\u00A0" : null}
            </span>
          ))}
        </motion.span>
      ))}
    </>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* Ethereal, breathing radial gradient — §4 Color & Lighting. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0.25, scale: 0.9 }}
        animate={{ opacity: [0.25, 0.45, 0.25], scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-24 left-[58%] -z-10 size-[44rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.38),rgba(147,51,234,0.2)_34%,transparent_66%)] blur-[120px]"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0.18, scale: 1.1 }}
        animate={{ opacity: [0.18, 0.32, 0.18], scale: [1.1, 0.95, 1.1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="pointer-events-none absolute -bottom-40 left-[12%] -z-10 size-[36rem] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.22),transparent_64%)] blur-[120px]"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(9,9,11,0.15),#09090b_78%)]" />

      {/* Extreme negative space + structural asymmetry (§1). */}
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-32 lg:px-8 lg:pb-48 lg:pt-44">
        <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-11 lg:col-start-1"
          >
            <motion.div
              variants={fadeUp}
              className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/4 px-4 py-1.5 text-xs text-muted-foreground shadow-2xl shadow-indigo-500/10 backdrop-blur"
            >
              <Sparkles className="size-3.5 text-primary" />
              AI automation & product engineering for category-defining founders
            </motion.div>

            <h1 className="max-w-5xl text-5xl font-semibold leading-[0.85] tracking-tighter text-balance sm:text-7xl lg:text-[7.5rem]">
              <KineticHeadline
                lines={[
                  "We Build AI Systems That",
                  "Sell While You Sleep.",
                ]}
                className="last:text-gradient"
              />
            </h1>
          </motion.div>

          {/* Asymmetric body block, offset right into the grid. */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="lg:col-span-6 lg:col-start-6"
          >
            <motion.p
              variants={fadeUp}
              className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              We engineer intelligent SaaS platforms and custom AI sales agents
              that capture leads, automate your follow-ups, and run revenue
              operations around the clock — so growth stops depending on
              headcount.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-10 flex flex-col items-start gap-4 sm:flex-row"
            >
              <motion.div whileTap={{ scale: 0.95 }} transition={SPRING}>
                <Button
                  size="lg"
                  className="glow-border h-11 bg-white px-6 text-black hover:bg-white/90"
                  asChild
                >
                  <Link href="#contact">
                    Deploy your AI system
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileTap={{ scale: 0.95 }} transition={SPRING}>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 border-white/[0.08] bg-white/2 px-6 hover:bg-white/6"
                  asChild
                >
                  <Link href="#models">See what we automate</Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust strip — scroll-reveal stagger per §5. */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-28 max-w-3xl rounded-2xl border border-white/[0.08] bg-white/2.5 px-5 py-5 backdrop-blur"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground"
          >
            AI-native systems built on
          </motion.p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {trustedLogos.map((logo) => (
              <motion.div
                key={logo}
                variants={fadeUp}
                className="flex h-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/2.5 px-3 text-sm font-semibold tracking-tight text-white/45 grayscale transition-colors hover:text-white/70"
              >
                {logo}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
