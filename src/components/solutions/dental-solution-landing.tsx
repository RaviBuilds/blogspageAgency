"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Bot,
  Building2,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  FileText,
  Globe,
  Hospital,
  MapPin,
  Sparkles,
  Star,
  Stethoscope,
  TrendingDown,
  UserRound,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

import { Button } from "@/components/ui/button";
import { BookingCta } from "@/components/booking/booking-cta";
import { FadeUp } from "@/components/solutions/fade-up";
import { NeodentCaseStudy } from "@/components/solutions/neodent-case-study";
import type { FaqPair } from "@/lib/structured-data";
import type { LatestPost } from "@/sanity/lib/queries";

/* -------------------------------------------------------------------------- */
/*  Motion primitives — design system §5                                      */
/* -------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: EASE },
  }),
};

const reveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};


/* -------------------------------------------------------------------------- */
/*  Static data                                                               */
/* -------------------------------------------------------------------------- */

/** The dedicated pricing route (`src/app/(site)/solutions/dental-clinic-website-packages`). */
const PACKAGES_HREF = "/solutions/dental-clinic-website-packages";

/**
 * The three headline tiers, teased here and detailed in full on
 * {@link PACKAGES_HREF}. Kept to price, delivery, and a one-line summary so
 * there is a single owner of the full scope: the packages page itself.
 */
const PACKAGE_TEASERS = [
  {
    name: "Launch Story Website",
    price: "₹14,900",
    delivery: "3–5 working days",
    pages: "1 premium storytelling page",
    summary: "A single-page clinic website built to earn trust and generate enquiries.",
  },
  {
    name: "Premium Practice",
    price: "₹29,900",
    delivery: "7–10 working days",
    pages: "Up to 5 premium pages",
    summary: "Premium storytelling design, before & after gallery, and 24/7 online appointment booking.",
    popular: true,
  },
  {
    name: "Signature AI Practice",
    price: "From ₹1,25,000",
    delivery: "3–6 weeks",
    pages: "Unlimited / custom pages",
    summary: "AI receptionist that books, reschedules, and follows up on appointments automatically.",
  },
];

const PAIN_POINTS = [
  "Patients search 'dentist near me' — your clinic doesn't appear in the top results.",
  "Your website looks outdated compared to newer clinics in the area.",
  "Phone-only booking means you lose every after-hours patient.",
  "No Google reviews visible means zero social proof for new patients.",
  "You have no idea which marketing channel actually brings patients through the door.",
];

const TRANSFORMATION_WITHOUT = [
  "Invisible on Google Maps and search",
  "Template website that looks like everyone else",
  "Phone-only booking during office hours",
  "No reviews visible to new patients",
  "Zero visibility into what's working",
  "Word-of-mouth is your only channel",
];

const TRANSFORMATION_WITH = [
  "Built to compete for 'dentist near me' searches",
  "Premium branded site patients trust instantly",
  "24/7 online booking — patients schedule anytime",
  "Google reviews prominently displayed with live rating",
  "Analytics dashboard showing patient sources and ROI",
  "Organic search + Google Maps + AI follow-ups compounding",
];

const BENEFITS = [
  { icon: Globe, title: "Premium Clinic Website", description: "A fast, beautifully designed website that positions your practice as the trusted, modern choice." },
  { icon: FileText, title: "Dedicated Treatment Pages", description: "A page for every treatment you want to be found for — implants, root canal, braces, whitening — each one answering the patient's actual question." },
  { icon: CalendarCheck, title: "Online Booking System", description: "Patients book appointments anytime — midnight, lunch breaks, weekends. No phone calls needed." },
  { icon: UserRound, title: "Doctor & Team Profiles", description: "Credentials, specialities, and experience presented properly, so patients choose your clinic before they ever call." },
  { icon: MapPin, title: "Local SEO & Google Visibility", description: "Optimized pages and Google Business Profile integration that put your clinic in front of nearby searches." },
  { icon: Bell, title: "Automated Reminders", description: "WhatsApp and SMS confirmations and reminders that reduce missed appointments without staff phone calls." },
  { icon: Star, title: "Google Reviews Integration", description: "A system that makes collecting and displaying patient reviews effortless. Your Google rating becomes your trust signal." },
  { icon: BarChart3, title: "Analytics Dashboard", description: "Know exactly where your patients come from — Google, Maps, referral, or ads. Every rupee becomes measurable." },
  { icon: Bot, title: "AI-Powered Patient Chat", description: "An intelligent chatbot answering common questions instantly — treatment costs, hours, directions, insurance." },
];

/**
 * Who the dental solution is built for — from a first clinic website to a
 * multi-location hospital system. Kept to capability framing only; no client
 * claims and no invented outcomes.
 */
const WHO_THIS_IS_FOR = [
  {
    icon: UserRound,
    title: "Solo dentists & new clinics",
    body: "You need a credible first presence: a premium website that explains your treatments, shows who you are, and starts capturing enquiries instead of losing them to newer clinics nearby.",
    startingPoint: "Typical starting point: the Launch Story Website package.",
  },
  {
    icon: Building2,
    title: "Growing multi-chair practices",
    body: "You have several doctors and a wider treatment mix. You need dedicated treatment pages, doctor profiles, online booking, and the local-SEO foundations that make each speciality findable.",
    startingPoint: "Typical starting point: the Essential or Premium Practice packages.",
  },
  {
    icon: Hospital,
    title: "Dental hospitals & multi-location brands",
    body: "Reputation earned over decades needs to be presented properly: treatment architecture across specialities, doctor credentials, press and testimonial proof, booking pathways per location, and an AI-assisted front desk as you scale.",
    startingPoint: "Typical starting point: Practice Growth or Signature AI Practice.",
  },
] as const;

/**
 * The patient journey the system is engineered around: how a stranger on
 * Google becomes a booked appointment and returns for the next one. Every
 * step maps to a capability actually included in the packages.
 */
const PATIENT_JOURNEY = [
  {
    title: "A patient searches",
    detail:
      "Someone searches 'dentist near me' or a specific treatment. Optimized pages and Google Business Profile integration put your clinic in front of that search.",
  },
  {
    title: "They land on a treatment page",
    detail:
      "Instead of a generic homepage, they reach a page that answers their question — the treatment, the process, and what it involves — and shows the doctors who perform it.",
  },
  {
    title: "Trust is built on the page",
    detail:
      "Doctor credentials, patient testimonials, clinic photos, and visible Google reviews answer the unspoken question: can I trust this clinic?",
  },
  {
    title: "They book — their way",
    detail:
      "Enquiry form, WhatsApp, click-to-call, or full online appointment booking. The patient picks the channel they prefer, day or night.",
  },
  {
    title: "Reminders keep them coming",
    detail:
      "Automated WhatsApp and SMS confirmations and reminders keep appointments on the calendar and support follow-up treatments without staff making phone calls.",
  },
] as const;

/**
 * The content and local-SEO foundations a dental website stands on. Grounded
 * in the published package scopes and add-ons on the packages page.
 */
const SEO_FOUNDATIONS = {
  website: [
    "Dedicated pages for each treatment you want to rank for",
    "Meta titles, descriptions, and search-friendly structure",
    "XML sitemap and image optimization",
    "Structured data and internal SEO strategy on higher packages",
    "A blog engine (Practice Growth and above) that compounds rankings",
  ],
  discovery: [
    "Google Business Profile integration and local SEO setup",
    "Google Analytics and Search Console connected",
    "Google Reviews integration for visible social proof",
    "Conversion tracking so enquiries are attributable",
    "Optional monthly SEO and GBP optimization add-ons",
  ],
} as const;

const TIMELINE = [
  { window: "Step 1", title: "Discovery & Clinic Audit", detail: "A call where we learn your clinic: services, target patients, competitive landscape, and brand positioning." },
  { window: "Step 2", title: "Design & Brand", detail: "We design your website's look, feel, and content architecture. You review once and approve." },
  { window: "Step 3", title: "Build & Integrate", detail: "Custom development: the website, online booking system, review integration, analytics, and SEO foundations." },
  { window: "Step 4", title: "Content, SEO & Testing", detail: "Treatment pages written, Google Business optimized, automated reminders configured, full device testing." },
  { window: "Step 5", title: "Launch & Handover", detail: "Go live. Team walkthrough, receptionist training on the booking system, and complete ownership transfer." },
];

/* The real-client case study is rendered by <NeodentCaseStudy /> (NeoDent
 * Dental Hospitals — owner-supplied facts only). See
 * docs/canonical/BLOGSPAGE_AI_DENTAL_SOLUTIONS_PAGES_REFINEMENT_BLUEPRINT_v1.0.md.
 */



/* -------------------------------------------------------------------------- */
/*  FAQ Accordion item                                                        */
/* -------------------------------------------------------------------------- */

function FaqItem({ item, defaultOpen = false }: { item: FaqPair; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border-subtle last:border-b-0">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-start justify-between gap-4 py-5 text-left">
        <span className="font-medium text-foreground">{item.question}</span>
        <ChevronDown className={`mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: EASE }} className="overflow-hidden">
            <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Props                                                                     */
/* -------------------------------------------------------------------------- */

type DentalSolutionLandingProps = {
  cityLabel: string;
  faq?: FaqPair[];
  headingIds: Record<string, string>;
  relatedPosts?: LatestPost[];
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function DentalSolutionLanding({ cityLabel, faq = [], headingIds, relatedPosts = [] }: DentalSolutionLandingProps) {
  return (
    <div className="relative overflow-hidden">
      {/* SECTION 1: HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="gradient-mesh pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_72%)]" />
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
          <div className="max-w-3xl">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-xs text-muted-foreground">
              <Stethoscope className="size-3.5 text-primary" />
              Dental & Medical solution · {cityLabel}
            </motion.div>
            <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={0.06} className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Get more patients walking through your door.
              <span className="mt-2 block text-2xl font-medium text-muted-foreground sm:text-3xl">Serving dental clinics in {cityLabel}.</span>
            </motion.h1>
            <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0.12} className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              A premium digital presence that builds trust, ranks on Google, and books appointments around the clock. Built for dental clinics in {cityLabel}.
            </motion.p>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.18} className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="glow-border h-11 bg-primary px-6 text-primary-foreground transition-transform hover:bg-primary/90 active:scale-[0.98]" asChild>
                <Link href="/#contact?niche=dental-medical&city=hyderabad">Book a Free Clinic Audit<ArrowRight className="size-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="h-11 px-6" asChild>
                <Link href={PACKAGES_HREF}>View Packages<ArrowRight className="size-4" /></Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: WHO THIS IS FOR */}
      <section className="border-t border-border-subtle py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <p className="text-sm font-medium text-primary">Who it&apos;s built for</p>
            <h2 id={headingIds["From single-chair clinics to multi-specialty dental hospitals."]} className="mt-3 text-3xl font-semibold tracking-tight">From single-chair clinics to multi-specialty dental hospitals.</h2>
            <p className="mt-4 max-w-3xl text-muted-foreground">The same system scales from a dentist&apos;s first website to a hospital&apos;s full digital presence. What changes is the architecture: how many treatment pages, how many doctors, how many locations, and how much of the front desk runs itself.</p>
          </FadeUp>
          <motion.div variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="mt-12 grid gap-4 lg:grid-cols-3">
            {WHO_THIS_IS_FOR.map((card) => { const Icon = card.icon; return (
              <motion.div key={card.title} variants={staggerChild} className="flex flex-col rounded-xl border border-border bg-card p-6">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-primary/10"><Icon className="size-5 text-primary" /></span>
                <h3 className="mt-4 text-lg font-medium">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                <p className="mt-4 text-xs text-muted-foreground/70">{card.startingPoint}</p>
              </motion.div>
            ); })}
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: PROBLEM */}
      <section className="border-t border-border-subtle py-20 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <FadeUp>
            <p className="text-sm font-medium text-primary">The Problem</p>
            <h2 id={headingIds["Your clinic is invisible to the patients searching for you."]} className="mt-3 text-3xl font-semibold tracking-tight">Your clinic is invisible to the patients searching for you.</h2>
            <p className="mt-4 text-muted-foreground">Every day, patients within 5 kilometres of your clinic search for a dentist. They find whoever shows up first — and right now, that isn&apos;t you.</p>
          </FadeUp>
          <div className="grid gap-4">
            {PAIN_POINTS.map((point, i) => (<FadeUp key={point} delay={i * 0.08}><div className="flex gap-3 rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground"><TrendingDown className="mt-0.5 size-4 shrink-0 text-primary" /><span>{point}</span></div></FadeUp>))}
          </div>
        </div>
      </section>

      {/* SECTION 4: TRANSFORMATION */}
      <section className="border-t border-border-subtle py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <p className="text-sm font-medium text-primary">The Transformation</p>
            <h2 id={headingIds["From invisible to fully booked."]} className="mt-3 text-3xl font-semibold tracking-tight">From invisible to fully booked.</h2>
          </FadeUp>
          <motion.div variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="mt-12 grid gap-5 lg:grid-cols-2">
            <motion.div variants={staggerChild} className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 backdrop-blur-md">
              <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-red-500/10 blur-3xl" />
              <div className="relative">
                <div className="flex size-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10"><XCircle className="size-5 text-red-400" /></div>
                <h3 className="mt-5 text-xl font-semibold">Without a digital presence</h3>
                <ul className="mt-5 space-y-3">{TRANSFORMATION_WITHOUT.map((item) => (<li key={item} className="flex gap-3 text-sm text-muted-foreground"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-red-400" />{item}</li>))}</ul>
              </div>
            </motion.div>
            <motion.div variants={staggerChild} className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 backdrop-blur-md">
              <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-indigo-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 size-56 rounded-full bg-emerald-500/10 blur-3xl" />
              <div className="relative">
                <div className="flex size-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10"><CheckCircle2 className="size-5 text-emerald-300" /></div>
                <h3 className="mt-5 text-xl font-semibold">With Blogspage</h3>
                <ul className="mt-5 space-y-3">{TRANSFORMATION_WITH.map((item) => (<li key={item} className="flex gap-3 text-sm text-foreground"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" />{item}</li>))}</ul>
              </div>
            </motion.div>
          </motion.div>
          <FadeUp delay={0.12}>
            <p className="mt-10 text-center text-sm text-muted-foreground">Ready to talk?{" "}<Link href="/#contact?niche=dental-medical&city=hyderabad" className="font-medium text-primary transition-colors hover:text-foreground">Book a free clinic audit →</Link></p>
          </FadeUp>
        </div>
      </section>

      {/* SECTION 5: BENEFITS */}
      <section id="packages" className="border-t border-border-subtle py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <p className="text-sm font-medium text-primary">What You Get</p>
            <h2 id={headingIds["Everything a premium dental clinic needs online."]} className="mt-3 text-3xl font-semibold tracking-tight">Everything a premium dental clinic needs online.</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">A complete digital presence built for one purpose: turning local searchers into booked appointments.</p>
          </FadeUp>
          <motion.div variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => { const Icon = b.icon; return (
              <motion.div key={b.title} variants={staggerChild} className="flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-border-strong hover:bg-accent">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-primary/10"><Icon className="size-5 text-primary" /></span>
                <h3 className="mt-4 text-lg font-medium">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.description}</p>
              </motion.div>
            ); })}
          </motion.div>
        </div>
      </section>

      {/* SECTION 6: VISUAL PREVIEW */}
      <section className="border-t border-border-subtle py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp><div className="max-w-2xl"><p className="text-sm font-medium text-primary">Preview</p><h2 id={headingIds["The interface your patients and team actually use."]} className="mt-3 text-3xl font-semibold tracking-tight">The interface your patients and team actually use.</h2></div></FadeUp>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <FadeUp>
              <article className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-border-strong">
                <div className="border-b border-border-subtle bg-popover px-4 py-3"><div className="flex gap-1.5"><span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" /></div></div>
                <div className="relative aspect-[16/10] bg-[linear-gradient(135deg,var(--popover),var(--background))]" aria-hidden><div className="absolute inset-0 p-5"><div className="h-3 w-1/4 rounded-full bg-muted" /><div className="mt-4 grid grid-cols-7 gap-1">{Array.from({ length: 14 }).map((_, i) => (<div key={i} className={`h-6 rounded border border-border-subtle ${i === 4 || i === 9 ? "bg-primary/20" : "bg-muted"}`} />))}</div><div className="mt-4 h-8 w-1/3 rounded-lg border border-primary/30 bg-primary/10" /></div></div>
                <div className="p-6"><h3 className="text-lg font-medium">Patient booking flow</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">What your patients see: a clean, fast, trustworthy booking experience that works on any device.</p></div>
              </article>
            </FadeUp>
            <FadeUp delay={0.08}>
              <article className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-border-strong">
                <div className="border-b border-border-subtle bg-popover px-4 py-3"><div className="flex gap-1.5"><span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" /><span className="size-2.5 rounded-full bg-border" /></div></div>
                <div className="relative aspect-[16/10] bg-[linear-gradient(135deg,var(--popover),var(--background))]" aria-hidden><div className="absolute inset-0 p-5"><div className="h-3 w-1/3 rounded-full bg-muted" /><div className="mt-4 grid grid-cols-3 gap-3"><div className="h-16 rounded-lg border border-border-subtle bg-muted" /><div className="h-16 rounded-lg border border-border-subtle bg-muted" /><div className="h-16 rounded-lg border border-border-subtle bg-primary/15" /></div><div className="mt-3 h-20 rounded-lg border border-border-subtle bg-background-subtle" /></div></div>
                <div className="p-6"><h3 className="text-lg font-medium">Clinic command centre</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Your team&apos;s view: appointments, patient sources, review alerts, and revenue tracking in one place.</p></div>
              </article>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* SECTION 7: PATIENT JOURNEY */}
      <section className="border-t border-border-subtle py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">Patient journey</p>
              <h2 id={headingIds["How a patient finds you, trusts you, and books."]} className="mt-3 text-3xl font-semibold tracking-tight">How a patient finds you, trusts you, and books.</h2>
              <p className="mt-4 text-muted-foreground">A dental website is not a brochure — it is the path a stranger takes from a Google search to a booked appointment. Each step below is engineered deliberately.</p>
            </div>
          </FadeUp>
          <ol className="mt-12 flex flex-col">
            {PATIENT_JOURNEY.map((step, i) => (<FadeUp key={step.title} delay={i * 0.06}><li className="relative flex gap-6 border-l border-border pb-8 pl-6 last:pb-0"><span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-primary" /><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Step {i + 1}</p><h3 className="mt-1 text-lg font-medium tracking-tight">{step.title}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.detail}</p></div></li></FadeUp>))}
          </ol>
        </div>
      </section>

      {/* SECTION 8: REAL CLIENT CASE STUDY (NeoDent — owner-supplied facts only) */}
      <section className="border-t border-border-subtle py-20 lg:py-24">
        <NeodentCaseStudy />
      </section>

      {/* SECTION 9: CONTENT & LOCAL SEO FOUNDATIONS */}
      <section className="border-t border-border-subtle py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">Foundations</p>
              <h2 id={headingIds["Content and local SEO foundations, built in."]} className="mt-3 text-3xl font-semibold tracking-tight">Content and local SEO foundations, built in.</h2>
              <p className="mt-4 text-muted-foreground">Ranking for &lsquo;dentist near me&rsquo; or a treatment search is not luck. It comes from the right pages existing, being structured correctly, and being connected to how Google understands local businesses.</p>
            </div>
          </FadeUp>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <FadeUp>
              <div className="h-full rounded-xl border border-border bg-card p-6">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">On the website</p>
                <ul className="mt-3 grid gap-2">{SEO_FOUNDATIONS.website.map((item) => (<li key={item} className="flex gap-2.5 text-sm text-muted-foreground"><Check className="mt-0.5 size-3.5 shrink-0 text-primary" /><span>{item}</span></li>))}</ul>
              </div>
            </FadeUp>
            <FadeUp delay={0.08}>
              <div className="h-full rounded-xl border border-border bg-card p-6">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Around the website</p>
                <ul className="mt-3 grid gap-2">{SEO_FOUNDATIONS.discovery.map((item) => (<li key={item} className="flex gap-2.5 text-sm text-muted-foreground"><Check className="mt-0.5 size-3.5 shrink-0 text-primary" /><span>{item}</span></li>))}</ul>
              </div>
            </FadeUp>
          </div>
          <FadeUp delay={0.12}>
            <p className="mt-6 text-sm text-muted-foreground">Ongoing monthly SEO and Google Business Profile optimization are available as add-ons — <Link href={PACKAGES_HREF} className="font-medium text-primary transition-colors hover:text-foreground">see add-on pricing on the packages page</Link>.</p>
          </FadeUp>
        </div>
      </section>

      {/* SECTION 10: PACKAGES TEASER → dedicated pricing page */}
      <section className="border-t border-border-subtle py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <p className="text-sm font-medium text-primary">Pricing &amp; Packages</p>
            <h2 id={headingIds["Packages that fit your clinic and your budget."]} className="mt-3 text-3xl font-semibold tracking-tight">Packages that fit your clinic and your budget.</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">Five plans, from a premium storytelling landing page to a fully automated AI practice. Here are the three clinics most often start with.</p>
          </FadeUp>
          <motion.div variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="mt-12 grid items-start gap-4 lg:grid-cols-3">
            {PACKAGE_TEASERS.map((pkg) => (
              <motion.div key={pkg.name} variants={staggerChild} className={`flex h-full flex-col rounded-xl border p-6 transition-colors ${pkg.popular ? "border-primary/40 bg-primary/[0.04]" : "border-border bg-card hover:border-border-strong"}`}>
                {pkg.popular && (<span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"><Sparkles className="size-3" />Most popular</span>)}
                <h3 className="text-lg font-medium tracking-tight">{pkg.name}</h3>
                <p className="mt-3 text-3xl font-semibold tracking-tight">{pkg.price}</p>
                <p className="mt-1 text-xs text-muted-foreground">{pkg.pages} · {pkg.delivery}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{pkg.summary}</p>
              </motion.div>
            ))}
          </motion.div>
          <FadeUp delay={0.12}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="glow-border h-11 bg-primary px-6 text-primary-foreground transition-transform hover:bg-primary/90 active:scale-[0.98]" asChild>
                <Link href={PACKAGES_HREF}>View All Packages &amp; Pricing<ArrowRight className="size-4" /></Link>
              </Button>
              <BookingCta fallbackHref="/#contact?niche=dental-medical&city=hyderabad" size="lg" variant="outline" className="h-11 px-6" frameTitle="Schedule a consultation">Schedule Consultation</BookingCta>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground/60">Add-ons, AI chatbot and AI receptionist pricing, and payment terms are all on the packages page.</p>
          </FadeUp>
        </div>
      </section>

      {/* SECTION 9: TIMELINE */}
      <section className="border-t border-border-subtle py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp><div className="max-w-2xl"><p className="text-sm font-medium text-primary">How It Works</p><h2 id={headingIds["Live in as little as 3–5 working days. Hands-off for you."]} className="mt-3 text-3xl font-semibold tracking-tight">Live in as little as 3–5 working days. Hands-off for you.</h2><p className="mt-4 text-muted-foreground">Delivery depends on the package you choose — from 3–5 working days for the Launch Story Website to 3–6 weeks for Signature AI Practice. Either way: you run your clinic. We handle everything else.</p></div></FadeUp>
          <ol className="mt-12 flex flex-col">
            {TIMELINE.map((phase, i) => (<FadeUp key={phase.window} delay={i * 0.06}><li className="relative flex gap-6 border-l border-border pb-8 pl-6 last:pb-0"><span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-primary" /><div><p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">{phase.window}</p><h3 className="mt-1 text-lg font-medium tracking-tight">{phase.title}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{phase.detail}</p></div></li></FadeUp>))}
          </ol>
        </div>
      </section>

      {/* SECTION 10: FAQ (Accordion) */}
      {faq.length > 0 && (
        <section className="border-t border-border-subtle py-20 lg:py-24">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
              <h2 id={headingIds["Questions dental clinics ask before starting."]} className="text-3xl font-semibold tracking-tight">Questions dental clinics ask before starting.</h2>
              <div className="mt-8">{faq.map((item, i) => (<FaqItem key={i} item={item} defaultOpen={i === 0} />))}</div>
            </motion.div>
          </div>
        </section>
      )}

      {/* SECTION 11: RELATED READING (before Final CTA) */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-border-subtle py-20 lg:py-24">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
              <h2 id={headingIds["Related reading"]} className="text-3xl font-semibold tracking-tight">Related reading</h2>
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((post) => (<li key={post._id}><Link href={`/blogs/${post.slug}`} className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-border-strong"><p className="text-xs text-muted-foreground">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : null}</p><h3 className="mt-2 font-medium tracking-tight transition-colors group-hover:text-primary">{post.title}</h3></Link></li>))}
              </ul>
            </motion.div>
          </div>
        </section>
      )}

      {/* SECTION 12: FINAL CTA (always last) */}
      <section className="border-t border-border-subtle py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 text-center lg:p-14">
              <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative mx-auto max-w-2xl">
                <h2 id={headingIds["Ready to become the most visible dental clinic in Hyderabad?"]} className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Ready to become the most visible dental clinic in {cityLabel}?</h2>
                <p className="mt-4 text-muted-foreground">Your future patients should be able to book an appointment in under one minute. A 15-minute call to understand your clinic, your goals, and whether we&apos;re the right fit. No pitch decks. No pressure. Just clarity.</p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <BookingCta fallbackHref="/#contact?niche=dental-medical&city=hyderabad" size="lg" className="glow-border h-11 bg-primary px-6 text-primary-foreground transition-transform hover:bg-primary/90 active:scale-[0.98]" frameTitle="Book a free clinic audit">Book a Free Clinic Audit<ArrowRight className="size-4" /></BookingCta>
                  <Button size="lg" variant="outline" className="h-11 px-6" asChild><Link href={PACKAGES_HREF}>View Website Packages</Link></Button>
                </div>
                <p className="mt-6 text-xs text-muted-foreground/60">Free consultation · Package-based delivery · Full ownership · No lock-in</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
