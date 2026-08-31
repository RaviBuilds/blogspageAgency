"use client";

import { useRef, type MouseEvent } from "react";
import Link from "next/link";
import { Globe, LayoutDashboard, Bot } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

/* ─────────────────────────────────────────────────────────────────────────────
   MOTION PRIMITIVES — design system §5
   ───────────────────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────────────────
   TASK H3 — "What We Build"

   Replaces the four AI-marketing service cards with the approved
   three-pillar capability model. Each pillar is anchored to a real,
   shipped project from `featured-work-data.ts` (Class B / descriptive
   proof only — no outcome, uplift or figure is asserted here).

   Proof-link destinations point at the in-page project sections owned by
   TASK H6 (`#work`, flagship projects) and TASK H7 (`#more-work`,
   supporting projects). Until those sections ship this sprint, both
   anchors resolve to the top of the page — acceptable mid-sprint per the
   implementation spec (plans/homepage-implementation-spec-v1.0.md, §8).
   ───────────────────────────────────────────────────────────────────────────── */
type Pillar = {
  id:
    | "digital-infrastructure"
    | "operational-software"
    | "intelligent-automation";
  number: string;
  icon: typeof Globe;
  title: string;
  capabilities: string[];
  body: string;
  proofName: string;
  proofDetail: string;
  destination: "#work" | "#more-work";
  accent: string;
};

const pillars: Pillar[] = [
  {
    id: "digital-infrastructure",
    number: "01",
    icon: Globe,
    title: "Digital Infrastructure",
    capabilities: ["Websites", "Web apps", "Headless CMS", "SEO architecture"],
    body: "The digital layer your customers see, search and interact with.",
    proofName: "Best100Movies",
    proofDetail: "a Sanity-backed content platform with programmatic routes.",
    destination: "#more-work",
    accent: "139,92,246", // violet
  },
  {
    id: "operational-software",
    number: "02",
    icon: LayoutDashboard,
    title: "Operational Software",
    capabilities: ["SaaS", "Dashboards", "Portals", "Business workflows"],
    body: "The systems your team uses to run the business.",
    proofName: "ArogyaDiet",
    proofDetail:
      "customer, rider, franchise and master-admin portals on shared data.",
    destination: "#work",
    accent: "16,185,129", // emerald
  },
  {
    id: "intelligent-automation",
    number: "03",
    icon: Bot,
    title: "Intelligent Automation",
    capabilities: [
      "AI agents",
      "Workflow automation",
      "Lead capture",
      "Customer follow-up",
    ],
    body: "The intelligence layer that removes repetitive work and keeps opportunities moving.",
    proofName: "Phixl AI",
    proofDetail:
      "AI image restoration with credits, checkout and processing pipeline.",
    destination: "#work",
    accent: "99,102,241", // indigo
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   PILLAR CARD with Hover Spotlight
   ───────────────────────────────────────────────────────────────────────────── */
function PillarCard({ pillar }: { pillar: Pillar }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--y", `${event.clientY - rect.top}px`);
  };

  const Icon = pillar.icon;

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      whileHover={{ scale: 1.015 }}
      transition={SPRING}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl p-6",
        // Glassmorphism (§1 Depth & Materials)
        "border border-white/[0.08] bg-white/[0.02] backdrop-blur-md",
        // Debossed inner shadow (§6)
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]",
        // Hover upgrade
        "transition-colors duration-300 hover:border-white/[0.15] hover:bg-white/[0.04]",
      )}
      style={{ "--card-accent": pillar.accent } as React.CSSProperties}
    >
      {/* Border spotlight on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(220px circle at var(--x,50%) var(--y,50%), rgba(${pillar.accent},0.55), transparent 65%)`,
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
          background: `radial-gradient(300px circle at var(--x,50%) var(--y,50%), rgba(${pillar.accent},0.1), transparent 55%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
          <Icon className="size-5 text-primary" />
        </div>

        <h3 className="mt-5 text-xl font-semibold tracking-tight text-white/90">
          <span aria-hidden className="mr-2 text-sm font-medium text-white/30">
            {pillar.number}
          </span>
          {pillar.title}
        </h3>

        <ul
          className={cn(
            "mt-4 flex flex-wrap gap-x-1 gap-y-1 text-xs font-medium uppercase tracking-wider text-white/50",
            "[&>li:not(:last-child)]:after:ml-2 [&>li:not(:last-child)]:after:text-white/25",
            "[&>li:not(:last-child)]:after:content-['·']",
          )}
        >
          {pillar.capabilities.map((capability) => (
            <li key={capability}>{capability}</li>
          ))}
        </ul>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground lg:text-base">
          {pillar.body}
        </p>

        <div className="mt-auto pt-6">
          <Link
            href={pillar.destination}
            onClick={() =>
              trackEvent("solution_cta_click", {
                cta_location: "what-we-build",
                pillar: pillar.id,
                destination: pillar.destination,
              })
            }
            className="-my-2 inline-block py-2 text-sm font-medium text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Built with this: {pillar.proofName} — {pillar.proofDetail}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SERVICES BENTO SECTION — "What We Build"
   ───────────────────────────────────────────────────────────────────────────── */
export function ServicesBento() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="services"
      className="border-t border-white/[0.08] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Section header with stagger */}
        <motion.div
          variants={gridVariants}
          initial={shouldReduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-sm font-medium text-primary"
          >
            What we build
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            One connected system, not four disconnected vendors.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            Your website, your internal software and your automation layer are
            the same system seen from three angles. We build all three.
          </motion.p>
        </motion.div>

        {/* Three equal pillars, staggered spring reveal (§5) */}
        <motion.div
          className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3"
          variants={gridVariants}
          initial={shouldReduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {pillars.map((pillar) => (
            <PillarCard key={pillar.id} pillar={pillar} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
