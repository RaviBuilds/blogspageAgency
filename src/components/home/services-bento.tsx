"use client";

import { useRef, type MouseEvent } from "react";
import { Bot, Workflow, Code2, Search } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   MOTION PRIMITIVES — design system §5
   ───────────────────────────────────────────────────────────────────────────── */
const SPRING = { type: "spring", stiffness: 100, damping: 20, mass: 1 } as const;

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
   SERVICE DEFINITIONS
   ───────────────────────────────────────────────────────────────────────────── */
const services = [
  {
    id: "ai-agents",
    icon: Bot,
    title: "Conversational AI Agents",
    description:
      "Custom LLM-powered chatbots that qualify leads, answer objections, and book strategy calls for you — 24 hours a day, 7 days a week, without a single salary on payroll.",
    accent: "99,102,241", // indigo
    className: "md:col-span-2 md:row-span-2",
    featured: true,
  },
  {
    id: "workflow-automation",
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "We connect your APIs, databases, and third-party tools into seamless pipelines that eliminate manual data entry, reduce human error, and remove operational bottlenecks overnight.",
    accent: "56,189,248", // sky
    className: "md:col-span-1 md:row-span-2",
    featured: false,
  },
  {
    id: "saas-development",
    icon: Code2,
    title: "Custom SaaS Development",
    description:
      "Scalable, headless web applications built on Next.js and Supabase — from MVPs that validate in weeks to full-scale platforms handling thousands of concurrent users.",
    accent: "139,92,246", // violet
    className: "md:col-span-2",
    featured: false,
  },
  {
    id: "programmatic-seo",
    icon: Search,
    title: "Programmatic SEO Architectures",
    description:
      "Templatized content engines powered by structured data that generate thousands of optimized pages — designed to dominate organic search and compound traffic while you sleep.",
    accent: "16,185,129", // emerald
    className: "md:col-span-1",
    featured: false,
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   SERVICE CARD with Hover Spotlight
   ───────────────────────────────────────────────────────────────────────────── */
function ServiceCard({
  service,
}: {
  service: (typeof services)[number];
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--y", `${event.clientY - rect.top}px`);
  };

  const Icon = service.icon;

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      whileHover={{ scale: 1.015 }}
      transition={SPRING}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl p-6",
        // Glassmorphism (§1 Depth & Materials)
        "border border-white/[0.08] bg-white/[0.02] backdrop-blur-md",
        // Debossed inner shadow (§6)
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]",
        // Hover upgrade
        "transition-colors duration-300 hover:border-white/[0.15] hover:bg-white/[0.04]",
        service.className,
        service.featured && "min-h-[18rem]",
      )}
      style={{ "--card-accent": service.accent } as React.CSSProperties}
    >
      {/* Border spotlight on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(220px circle at var(--x,50%) var(--y,50%), rgba(${service.accent},0.55), transparent 65%)`,
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
          background: `radial-gradient(300px circle at var(--x,50%) var(--y,50%), rgba(${service.accent},0.1), transparent 55%)`,
        }}
      />

      {/* Featured corner glow */}
      {service.featured && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full opacity-[0.08] blur-3xl"
          style={{
            background: `radial-gradient(circle, rgba(${service.accent},1) 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
          <Icon className="size-5 text-primary" />
        </div>

        <h3 className="mt-5 text-xl font-semibold tracking-tight text-white/90">
          {service.title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SERVICES BENTO SECTION
   ───────────────────────────────────────────────────────────────────────────── */
export function ServicesBento() {
  return (
    <section id="services" className="border-t border-white/[0.08] py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Section header with stagger */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p variants={fadeUp} className="text-sm font-medium text-primary">
            Core Capabilities
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            AI-powered systems that sell, qualify, and operate — so you don&apos;t have to.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            We don&apos;t build brochure sites. We engineer intelligent platforms
            that automate revenue, eliminate busywork, and compound growth from
            day one.
          </motion.p>
        </motion.div>

        {/* Bento grid — 3 col on md+, staggered spring reveal (§5) */}
        <motion.div
          className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3"
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
