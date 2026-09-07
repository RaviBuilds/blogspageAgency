"use client";

import { useRef, type MouseEvent } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { NICHES, type Niche } from "@/lib/niches";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   0. MOTION PRIMITIVES (design system §5)
   Premium spring + staggered reveal variants shared by the grid and cards.
   ───────────────────────────────────────────────────────────────────────────── */
const SPRING = { type: "spring", stiffness: 100, damping: 20, mass: 1 } as const;

const gridVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

/* Motion-enabled Link: keeps next/link routing + ref, gains motion props. */
const MotionLink = motion.create(Link);

/* ─────────────────────────────────────────────────────────────────────────────
   1. ACCENT COLOR MAP
   Category accent per niche — one hue family per vertical, tuned to the
   readable 600 step for light surfaces (Phase 5B).
   Each entry provides Tailwind-compatible values for icon color and
   a raw CSS color for the radial glow (to avoid arbitrary-value issues).
   ───────────────────────────────────────────────────────────────────────────── */
const ACCENT_MAP: Record<string, { tw: string; raw: string }> = {
  "online-delivery": { tw: "text-rose-600", raw: "244,63,94" }, // rose-600
  "hotel-booking": { tw: "text-teal-600", raw: "20,184,166" }, // teal-600
  "pet-care": { tw: "text-rose-600", raw: "251,113,133" }, // rose-600
  consulting: { tw: "text-sky-600", raw: "14,165,233" }, // sky-600
  education: { tw: "text-emerald-600", raw: "16,185,129" }, // emerald-600
  "gym-fitness": { tw: "text-teal-600", raw: "45,212,191" }, // teal-600
  "dental-medical": { tw: "text-indigo-600", raw: "129,140,248" }, // indigo-600
  ecommerce: { tw: "text-amber-600", raw: "245,158,11" }, // amber-600
  "saas-platform": { tw: "text-violet-600", raw: "139,92,246" }, // violet-600
  "seo-blogs": { tw: "text-violet-600", raw: "167,139,250" }, // violet-600
};

/* ─────────────────────────────────────────────────────────────────────────────
   2. BENTO GRID SPAN MAP
   Controls the dynamic col-span rhythm on md+ screens (3-col grid).
   Row 1 : Online Delivery (2) + Hotel (1)
   Row 2 : Pet Care (1) + Consulting (2)
   Row 3 : Education (1) + Gym (1) + Dental (1)
   Row 4 : E-commerce (2) + SaaS (1)
   Row 5 : SEO Blogs (2) + ... fills naturally
   ───────────────────────────────────────────────────────────────────────────── */
const SPAN_MAP: Record<string, string> = {
  "online-delivery": "md:col-span-2",
  "hotel-booking": "md:col-span-1",
  "pet-care": "md:col-span-1",
  consulting: "md:col-span-2",
  education: "md:col-span-1",
  "gym-fitness": "md:col-span-1",
  "dental-medical": "md:col-span-1",
  ecommerce: "md:col-span-2",
  "saas-platform": "md:col-span-1",
  "seo-blogs": "md:col-span-2",
};

/* Featured niches get extra visual treatment (watermark + taller card) */
const FEATURED_IDS = new Set([
  "online-delivery",
  "hotel-booking",
  "ecommerce",
  "saas-platform",
  "consulting",
  "seo-blogs",
]);

/* ─────────────────────────────────────────────────────────────────────────────
   3. NICHE CARD
   ───────────────────────────────────────────────────────────────────────────── */
function NicheCard({ niche }: { niche: Niche }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const accent = ACCENT_MAP[niche.id] ?? { tw: "text-primary", raw: "67,83,201" };
  const isFeatured = FEATURED_IDS.has(niche.id);
  const span = SPAN_MAP[niche.id] ?? "md:col-span-1";

  /* Mouse-tracking glow — writes cursor position into CSS custom props */
  const handleMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--y", `${event.clientY - rect.top}px`);
  };

  const Icon = niche.icon;

  return (
    <MotionLink
      ref={cardRef}
      href={niche.href()}
      onMouseMove={handleMouseMove}
      variants={cardVariants}
      whileHover={{ scale: 1.015 }}
      transition={SPRING}
      className={cn(
        // White instrument card (Phase 5B light system)
        "group relative flex flex-col overflow-hidden rounded-2xl p-6",
        "border border-border bg-card",
        // Border illumination on hover (spring-driven scale above)
        "transition-colors duration-300 hover:border-border-strong",
        "motion-reduce:hover:scale-100",
        "col-span-1",
        span,
        isFeatured && "min-h-[15rem]",
      )}
      style={
        {
          "--card-accent": accent.raw,
        } as React.CSSProperties
      }
    >
      {/* ── Layer 1: mouse-tracked BORDER glow (uses accent color) ── */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(220px circle at var(--x,50%) var(--y,50%), rgba(var(--card-accent),0.50), transparent 65%)`,
          padding: "1px",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* ── Layer 2: mouse-tracked BACKGROUND wash (uses accent color) ── */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(300px circle at var(--x,50%) var(--y,50%), rgba(var(--card-accent),0.08), transparent 55%)`,
        }}
      />

      {/* ── Layer 3: featured watermark / geometric background detail ── */}
      {isFeatured && (
        <>
          {/* Subtle diagonal geometric lines */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                135deg,
                rgba(var(--card-accent), 0.5) 0px,
                rgba(var(--card-accent), 0.5) 1px,
                transparent 1px,
                transparent 40px
              )`,
            }}
          />
          {/* Corner gradient wash */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-[0.06] blur-3xl"
            style={{
              background: `radial-gradient(circle, rgba(var(--card-accent),1) 0%, transparent 70%)`,
            }}
          />
        </>
      )}

      {/* ── Card content ── */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Icon badge */}
        <div className="flex size-10 items-center justify-center rounded-lg border border-border-subtle bg-muted">
          <Icon className={cn("size-5", accent.tw)} />
        </div>

        {/* Focus label */}
        <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-text-subtle">
          {niche.focus}
        </p>

        {/* Title */}
        <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
          {niche.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {niche.description}
        </p>

        {/* CTA */}
        <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
          View solution
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </MotionLink>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   4. BENTO GRID SECTION
   ───────────────────────────────────────────────────────────────────────────── */
export function BentoGrid() {
  return (
    <section id="solutions" className="border-t border-border-subtle bg-background-subtle py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Solutions</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Ten industries. One engineering standard.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Purpose-built digital ecosystems for the verticals we know best,
            each tuned to the exact way that business makes and keeps revenue.
          </p>
        </div>

        {/* Bento grid — 1 col mobile, 3 col md+. Staggered spring reveal (§5). */}
        <motion.div
          className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {NICHES.map((niche) => (
            <NicheCard key={niche.id} niche={niche} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
