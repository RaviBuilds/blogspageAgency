"use client";

import { useRef, type MouseEvent } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NICHES, type Niche } from "@/lib/niches";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   1. ACCENT COLOR MAP
   Muted jewel-tone / pastel-neon accent per niche.
   Each entry provides Tailwind-compatible values for icon color and
   a raw CSS color for the radial glow (to avoid arbitrary-value issues).
   ───────────────────────────────────────────────────────────────────────────── */
const ACCENT_MAP: Record<string, { tw: string; raw: string }> = {
  "online-delivery": { tw: "text-rose-500", raw: "244,63,94" }, // rose-500
  "hotel-booking": { tw: "text-teal-500", raw: "20,184,166" }, // teal-500
  "pet-care": { tw: "text-rose-400", raw: "251,113,133" }, // rose-400
  consulting: { tw: "text-sky-500", raw: "14,165,233" }, // sky-500
  education: { tw: "text-emerald-500", raw: "16,185,129" }, // emerald-500
  "gym-fitness": { tw: "text-teal-400", raw: "45,212,191" }, // teal-400
  "dental-medical": { tw: "text-indigo-400", raw: "129,140,248" }, // indigo-400
  ecommerce: { tw: "text-amber-500", raw: "245,158,11" }, // amber-500
  "saas-platform": { tw: "text-violet-500", raw: "139,92,246" }, // violet-500
  "seo-blogs": { tw: "text-violet-400", raw: "167,139,250" }, // violet-400
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
  const accent = ACCENT_MAP[niche.id] ?? { tw: "text-primary", raw: "94,106,210" };
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
    <Link
      ref={cardRef}
      href={niche.href()}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-950 p-6",
        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:scale-[1.015] hover:border-white/[0.15]",
        "motion-reduce:transition-none motion-reduce:hover:scale-100",
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
          background: `radial-gradient(220px circle at var(--x,50%) var(--y,50%), rgba(var(--card-accent),0.6), transparent 65%)`,
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
          background: `radial-gradient(300px circle at var(--x,50%) var(--y,50%), rgba(var(--card-accent),0.12), transparent 55%)`,
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
        <div className="flex size-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
          <Icon className={cn("size-5", accent.tw)} />
        </div>

        {/* Focus label */}
        <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
          {niche.focus}
        </p>

        {/* Title */}
        <h3 className="mt-1 text-lg font-semibold tracking-tight text-white/90">
          {niche.title}
        </h3>

        {/* Description */}
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {niche.description}
        </p>

        {/* CTA */}
        <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-foreground/60 transition-colors group-hover:text-foreground">
          View solution
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   4. BENTO GRID SECTION
   ───────────────────────────────────────────────────────────────────────────── */
export function BentoGrid() {
  return (
    <section id="solutions" className="border-t border-white/[0.06] py-24 lg:py-32">
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

        {/* Bento grid — 1 col mobile, 3 col md+ */}
        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
          {NICHES.map((niche) => (
            <NicheCard key={niche.id} niche={niche} />
          ))}
        </div>
      </div>
    </section>
  );
}
