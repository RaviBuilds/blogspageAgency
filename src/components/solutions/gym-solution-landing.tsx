"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Boxes,
  Dumbbell,
  Globe,
  LayoutDashboard,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

/* -------------------------------------------------------------------------- */
/*  Motion primitives — blueprint spring physics + cubic-bezier easing        */
/* -------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1] as const;

/** Kinetic word-reveal container: staggers each word of the headline. */
const headlineContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const headlineWord: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { type: "spring", damping: 18, stiffness: 140, mass: 0.9 },
  },
};

/** Generic scroll-in reveal used for pillar entrances. */
const reveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

/** Parent that staggers its children as the group enters the viewport. */
const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* -------------------------------------------------------------------------- */
/*  Pillar data                                                               */
/* -------------------------------------------------------------------------- */

type Pillar = {
  index: string;
  badge: string;
  icon: typeof Globe;
  title: string;
  tagline: string;
  copy: string;
  features: { icon: typeof Globe; label: string }[];
  image: string;
  imageAlt: string;
  /** Optional preview chrome label shown in the browser window bar. */
  url: string;
};

const PILLARS: Pillar[] = [
  {
    index: "01",
    badge: "The Growth Engine",
    icon: Globe,
    title: "Website & AI Sales Agent",
    tagline: "Your 24/7 front-desk employee that never sleeps.",
    copy: "A local-SEO dominant, Awwwards-grade public website engineered to rank and convert. At its core sits a custom AI Sales Agent that acts as a round-the-clock front-desk employee — fielding inquiries, qualifying prospects, capturing leads, and funneling them straight into your management pipeline.",
    features: [
      { icon: Globe, label: "Local-SEO dominant public site" },
      { icon: Bot, label: "Custom AI sales & front-desk agent" },
      { icon: Sparkles, label: "Automated lead capture & routing" },
    ],
    image: "/gym-website-placeholder.svg",
    imageAlt: "Award-winning gym marketing website with embedded AI sales agent",
    url: "elitefitness.club",
  },
  {
    index: "02",
    badge: "The Member Experience",
    icon: Users,
    title: "Member Portal & App",
    tagline: "A premium app your members actually want to open.",
    copy: "A dedicated app and portal that puts the entire membership in your members' pockets. They manage their plan, request BMI and health checks, upgrade into specialized high-weight strength or calisthenics programs, and order supplements — whey protein, pre-workout, and more — for seamless front-desk pickup.",
    features: [
      { icon: Users, label: "Self-serve membership management" },
      { icon: Dumbbell, label: "BMI checks & specialized training upgrades" },
      { icon: ShoppingBag, label: "In-app supplement ordering & pickup" },
    ],
    image: "/gym-member-placeholder.svg",
    imageAlt: "Gym member portal dashboard on a dark interface",
    url: "app.elitefitness.club",
  },
  {
    index: "03",
    badge: "The Admin OS",
    icon: LayoutDashboard,
    title: "Operations Command Center",
    tagline: "Run the entire floor from a single control plane.",
    copy: "The daily command center your staff lives in. Track every piece of equipment, build and manage custom training packages, handle member billing, and run e-commerce operations end to end — from supplement stock levels to order fulfillment — without a single spreadsheet.",
    features: [
      { icon: Boxes, label: "Equipment & package management" },
      { icon: ShoppingBag, label: "Inventory & order fulfillment" },
      { icon: ShieldCheck, label: "Member billing & access control" },
    ],
    image: "/gym-admin-placeholder.svg",
    imageAlt: "Gym admin operations dashboard with inventory and billing panels",
    url: "admin.elitefitness.club",
  },
  {
    index: "04",
    badge: "The Owner's Dashboard",
    icon: BarChart3,
    title: "Executive Analytics",
    tagline: "Total visibility, zero micromanagement.",
    copy: "High-level executive oversight built for owners. Track revenue in real time, surface daily, weekly, and monthly audit logs, and keep a finger on operational health across every location — the clarity to lead the business without getting buried in the day-to-day.",
    features: [
      { icon: BarChart3, label: "Real-time revenue tracking" },
      { icon: ShieldCheck, label: "Daily / weekly / monthly audit logs" },
      { icon: LayoutDashboard, label: "Multi-location operational oversight" },
    ],
    image: "/gym-owner-placeholder.svg",
    imageAlt: "Gym owner executive analytics dashboard with revenue charts",
    url: "owner.elitefitness.club",
  },
];

/* -------------------------------------------------------------------------- */
/*  Browser window mockup — dark macOS chrome + "muted reveal" image          */
/* -------------------------------------------------------------------------- */

function BrowserMock({
  src,
  alt,
  url,
}: {
  src: string;
  alt: string;
  url: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0b] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
      {/* glow that warms on hover */}
      <div className="pointer-events-none absolute -inset-px -z-10 rounded-2xl bg-[radial-gradient(circle_at_top,rgba(94,106,210,0.25),transparent_60%)] opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />

      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#141516] px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <div className="ml-3 hidden h-6 flex-1 items-center rounded-md border border-white/[0.06] bg-black/40 px-3 text-[11px] text-muted-foreground sm:flex">
          {url}
        </div>
      </div>

      {/* muted-reveal viewport */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[linear-gradient(135deg,#141516,#010102)]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover opacity-80 brightness-[0.7] grayscale-[40%] transition-all duration-700 ease-out group-hover:scale-[1.02] group-hover:opacity-100 group-hover:brightness-100 group-hover:grayscale-0"
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export function GymSolutionLanding({ cityLabel }: { cityLabel: string }) {
  const headline = [
    "The",
    "AI-Powered",
    "Operating",
    "System",
    "for",
    "Elite",
    "Fitness",
    "Clubs.",
  ];

  return (
    <div className="relative overflow-hidden bg-[#050505]">
      {/* ambient hero glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 size-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(94,106,210,0.30),rgba(147,51,234,0.12)_42%,transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_74%)]" />

      {/* ----------------------------------------------------------------- */}
      {/*  HERO — kinetic word reveal                                       */}
      {/* ----------------------------------------------------------------- */}
      <section className="mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-6 py-28 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-muted-foreground"
        >
          <Dumbbell className="size-3.5 text-primary" />
          Enterprise gym ecosystem · {cityLabel}
        </motion.div>

        <motion.h1
          variants={headlineContainer}
          initial="hidden"
          animate="visible"
          className="max-w-5xl text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl"
        >
          {headline.map((word, i) => {
            const isAccent = word === "AI-Powered" || word === "Elite";
            return (
              <span
                key={`${word}-${i}`}
                className="mr-[0.25em] inline-block overflow-hidden align-bottom"
              >
                <motion.span
                  variants={headlineWord}
                  className={`inline-block ${isAccent ? "text-gradient" : ""}`}
                >
                  {word}
                </motion.span>
              </span>
            );
          })}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground lg:text-xl"
        >
          We engineer end-to-end ecosystems. From award-winning websites with AI
          sales agents that capture leads, to complete management portals for
          members, admins, and owners.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85, ease: EASE }}
          className="mt-12 flex flex-col gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            className="glow-border h-12 bg-white px-7 text-black transition-transform hover:bg-white/90 active:scale-[0.98]"
            asChild
          >
            <Link href="/#contact?niche=gym-fitness">
              Book an architecture review
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 border-white/10 bg-transparent px-7 hover:bg-white/[0.04]"
            asChild
          >
            <Link href="#ecosystem">Explore the ecosystem</Link>
          </Button>
        </motion.div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/*  SECTION INTRO                                                    */}
      {/* ----------------------------------------------------------------- */}
      <section
        id="ecosystem"
        className="border-t border-white/[0.06] py-24 lg:py-32"
      >
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-3xl"
          >
            <p className="text-sm font-medium text-primary">
              The Four-Pillar Ecosystem
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
              One connected platform. Four systems working as one.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Most studios stitch together a website, a billing tool, and a
              spreadsheet. We replace all of it with a single, AI-native
              operating system — purpose-built for the way elite fitness clubs
              actually run.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/*  PILLARS — vertical staggered layout                              */}
      {/* ----------------------------------------------------------------- */}
      <section className="pb-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-24 px-6 lg:gap-36 lg:px-8">
          {PILLARS.map((pillar, i) => {
            const imageFirst = i % 2 === 1;
            return (
              <motion.div
                key={pillar.index}
                variants={staggerParent}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-120px" }}
                className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20"
              >
                {/* Copy column */}
                <motion.div
                  variants={reveal}
                  className={imageFirst ? "lg:order-2" : ""}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium tabular-nums text-primary/70">
                      {pillar.index}
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-muted-foreground">
                      <pillar.icon className="size-3.5 text-primary" />
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-lg font-medium text-foreground/80">
                    {pillar.tagline}
                  </p>
                  <p className="mt-5 leading-relaxed text-muted-foreground">
                    {pillar.copy}
                  </p>

                  <ul className="mt-8 grid gap-3">
                    {pillar.features.map((feature) => (
                      <li
                        key={feature.label}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-sm text-foreground/85 transition-colors hover:border-white/[0.14] hover:bg-white/[0.04]"
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-primary/10">
                          <feature.icon className="size-4 text-primary" />
                        </span>
                        {feature.label}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Visual column */}
                <motion.div
                  variants={reveal}
                  className={imageFirst ? "lg:order-1" : ""}
                >
                  <BrowserMock
                    src={pillar.image}
                    alt={pillar.imageAlt}
                    url={pillar.url}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/*  CTA                                                              */}
      {/* ----------------------------------------------------------------- */}
      <section className="border-t border-white/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0a0a0b] p-10 text-center lg:p-16"
          >
            <div className="pointer-events-none absolute -right-32 -top-32 size-80 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 size-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
                Build the operating system your club deserves.
              </h2>
              <p className="mt-5 text-lg text-muted-foreground">
                From the public website to the owner&apos;s dashboard, we ship a
                single production-grade ecosystem for fitness clubs in{" "}
                {cityLabel}. Let&apos;s map your architecture.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="glow-border h-12 bg-primary px-7 text-primary-foreground transition-transform hover:bg-primary/90 active:scale-[0.98]"
                  asChild
                >
                  <Link href="/#contact?niche=gym-fitness">
                    Start your project
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/10 bg-transparent px-7 hover:bg-white/[0.04]"
                  asChild
                >
                  <Link href="/#process">See our process</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
