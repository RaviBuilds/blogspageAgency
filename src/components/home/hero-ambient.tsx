"use client";

import { motion, type Variants } from "framer-motion";

const trustedLogos = ["OpenAI", "Vercel", "Supabase", "Next.js", "Stripe"];

// Premium spring from the design system (§5 Motion Physics).
const SPRING = { type: "spring", stiffness: 100, damping: 20, mass: 1 } as const;

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
 * Client-side ambience for the hero: the two breathing radial-gradient blobs
 * behind the content. Purely decorative, `aria-hidden`, and has no bearing on
 * the server-rendered `<h1>` or summary paragraph living in `Hero`.
 */
export function HeroGradients() {
  return (
    <>
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
    </>
  );
}

/**
 * Client-side ambience for the hero: the scroll-revealed "trusted logos"
 * trust strip. Moved out of the server `Hero` because it depends on
 * Framer Motion's `whileInView` viewport tracking.
 */
export function HeroTrustStrip() {
  return (
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
  );
}
