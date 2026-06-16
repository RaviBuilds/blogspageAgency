"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";

const trustedLogos = ["Next.js", "Supabase", "Vercel", "Stripe", "Sanity"];

// Premium spring from the design system (§5 Motion Physics).
const SPRING = { type: "spring", stiffness: 100, damping: 20, mass: 1 } as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const wordReveal: Variants = {
  hidden: { opacity: 0, y: "0.45em", rotateX: 40 },
  show: {
    opacity: 1,
    y: "0em",
    rotateX: 0,
    transition: SPRING,
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

// Kinetic helper: splits a heading string into animatable word spans WITHOUT
// altering the copy. Each token is wrapped for the stagger; spacing preserved.
function KineticWords({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
          style={{ perspective: "800px" }}
        >
          <motion.span variants={wordReveal} className="inline-block will-change-transform">
            {word}
          </motion.span>
          {i < words.length - 1 ? "\u00A0" : null}
        </span>
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
              Premium product engineering for founders who need momentum
            </motion.div>

            <h1 className="max-w-5xl text-5xl font-semibold leading-[0.85] tracking-tighter text-balance sm:text-7xl lg:text-[7.5rem]">
              <span className="block">
                <KineticWords text="SaaS & Digital Systems for" />
              </span>
              <span className="mt-2 block text-gradient">
                <KineticWords text="Ambitious Founders." />
              </span>
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
              We turn high-stakes ideas into polished SaaS products, workflow
              automations, and internal operating systems with senior technical
              strategy from day one.
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
                    Book a strategy call
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
                  <Link href="#models">Explore delivery models</Link>
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
            Trusted by teams building with
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
