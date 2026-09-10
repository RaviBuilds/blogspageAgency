"use client";

import { useRef, type MouseEvent } from "react";
import Link from "next/link";
import { Bot, Globe, LayoutDashboard, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import {
  HOME_VERTICALS,
  VERTICALS_SECTION,
  type HomeVertical,
} from "@/lib/homepage-verticals";
import { projects } from "@/lib/featured-work-data";

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 3 — "Start with what your business needs today." (Blueprint §11–12)

   The three permanent verticals, rendered from the presentation-layer model
   in `homepage-verticals.ts` — never from the SEO catalog. When the future
   service hubs ship, only that module's `href`/`hrefMode` values change.

   Preserved contracts: `id="services"` (navbar), the spotlight-hover card
   pattern, the §5 spring/stagger motion system, and the `solution_cta_click`
   event name (the `pillar` property now carries the vertical id).
   ───────────────────────────────────────────────────────────────────────────── */

const VERTICAL_ICONS: Record<HomeVertical["id"], LucideIcon> = {
  "brand-digital-presence": Globe,
  "applications-software": LayoutDashboard,
  "ai-automation": Bot,
};

const SPRING = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 1,
} as const;

const gridVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

function VerticalCard({ vertical }: { vertical: HomeVertical }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--y", `${event.clientY - rect.top}px`);
  };

  const Icon = VERTICAL_ICONS[vertical.id];
  const proofName =
    projects.find((project) => project.id === vertical.proofProjectId)
      ?.headline ?? vertical.proofProjectId;

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      whileHover={{ scale: 1.015 }}
      transition={SPRING}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl p-6",
        "border border-border bg-card",
        "transition-colors duration-300 hover:border-border-strong",
      )}
      style={{ "--card-accent": vertical.accent } as React.CSSProperties}
    >
      {/* Border spotlight on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(220px circle at var(--x,50%) var(--y,50%), rgba(${vertical.accent},0.50), transparent 65%)`,
          padding: "1px",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Background wash on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(300px circle at var(--x,50%) var(--y,50%), rgba(${vertical.accent},0.08), transparent 55%)`,
        }}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-muted">
            <Icon className="size-5 text-primary" />
          </div>
          <span className="rounded-full border border-border-subtle bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {vertical.stage}
          </span>
        </div>

        <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
          <span aria-hidden className="mr-2 text-sm font-medium text-text-disabled">
            {vertical.number}
          </span>
          {vertical.title}
        </h3>

        <p className="mt-2 text-sm font-medium text-primary">
          {vertical.plainPromise}
        </p>

        <ul className="mt-4 flex flex-wrap gap-x-1 gap-y-1 text-xs font-medium uppercase tracking-wider text-text-subtle [&>li:not(:last-child)]:after:ml-2 [&>li:not(:last-child)]:after:text-text-disabled [&>li:not(:last-child)]:after:content-['·']">
          {vertical.capabilities.map((capability) => (
            <li key={capability}>{capability}</li>
          ))}
        </ul>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground lg:text-base">
          {vertical.body}
        </p>

        <p className="mt-4 text-sm text-muted-foreground">
          Built with this:{" "}
          <Link
            href={vertical.proofDestination}
            onClick={() =>
              trackEvent("solution_cta_click", {
                cta_location: "vertical-proof",
                pillar: vertical.id,
                destination: vertical.proofDestination,
              })
            }
            className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            {proofName} — {vertical.proofDetail}
          </Link>
        </p>

        <div className="mt-auto pt-6">
          <Link
            href={vertical.href}
            onClick={() =>
              trackEvent("solution_cta_click", {
                cta_location: "vertical-cta",
                pillar: vertical.id,
                destination: vertical.href,
              })
            }
            className="-my-2 inline-block py-2 text-sm font-semibold text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
          >
            {vertical.ctaLabel}
            <span aria-hidden> →</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function ServiceVerticals() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="services"
      className="scroll-mt-24 border-t border-border bg-background py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          variants={gridVariants}
          initial={shouldReduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p variants={fadeUp} className="text-sm font-medium text-primary">
            {VERTICALS_SECTION.eyebrow}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {VERTICALS_SECTION.heading}
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            {VERTICALS_SECTION.sub}
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3"
          variants={gridVariants}
          initial={shouldReduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {HOME_VERTICALS.map((vertical) => (
            <VerticalCard key={vertical.id} vertical={vertical} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
