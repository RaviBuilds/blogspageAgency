"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Bot,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Globe,
  MapPin,
  Sparkles,
  Star,
  Stethoscope,
  TrendingDown,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

import { Button } from "@/components/ui/button";
import { BookingCta } from "@/components/booking/booking-cta";
import { FadeUp } from "@/components/solutions/fade-up";
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

const METRICS = [
  { value: "3x", label: "More patient enquiries" },
  { value: "40%", label: "Fewer no-shows" },
  { value: "24/7", label: "Online booking" },
  { value: "14", label: "Days to launch" },
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
  "Page 1 for 'dentist in your area'",
  "Premium branded site patients trust instantly",
  "24/7 online booking — patients schedule anytime",
  "Google reviews prominently displayed with live rating",
  "Analytics dashboard showing patient sources and ROI",
  "Organic search + Google Maps + AI follow-ups compounding",
];

const BENEFITS = [
  { icon: Globe, title: "Premium Clinic Website", description: "A fast, beautifully designed website that positions your practice as the trusted, modern choice." },
  { icon: CalendarCheck, title: "Online Booking System", description: "Patients book appointments anytime — midnight, lunch breaks, weekends. No phone calls needed." },
  { icon: MapPin, title: "Local SEO & Google Visibility", description: "Optimized pages that rank for searches like 'dentist in Banjara Hills' or 'dental implants Hyderabad'." },
  { icon: Bell, title: "Automated Reminders", description: "WhatsApp and SMS reminders that cut no-shows by up to 40%. Patients confirm or reschedule automatically." },
  { icon: Star, title: "Google Reviews Integration", description: "A system that makes collecting and displaying patient reviews effortless. Your Google rating becomes your trust signal." },
  { icon: BarChart3, title: "Analytics Dashboard", description: "Know exactly where your patients come from — Google, Maps, referral, or ads. Every rupee becomes measurable." },
  { icon: Bot, title: "AI-Powered Patient Chat", description: "An intelligent chatbot answering common questions instantly — treatment costs, hours, directions, insurance." },
];

const TIMELINE = [
  { window: "Days 1–2", title: "Discovery & Clinic Audit", detail: "A 45-minute call where we learn your clinic: services, target patients, competitive landscape, and brand positioning." },
  { window: "Days 3–5", title: "Design & Brand", detail: "We design your website's look, feel, and content architecture. You review once and approve." },
  { window: "Days 6–9", title: "Build & Integrate", detail: "Custom development: the website, online booking system, review integration, analytics, and SEO foundations." },
  { window: "Days 10–12", title: "Content, SEO & Testing", detail: "Service pages written, Google Business optimized, automated reminders configured, full device testing." },
  { window: "Days 13–14", title: "Launch & Handover", detail: "Go live. Team walkthrough, receptionist training on the booking system, and complete ownership transfer." },
];

const CASE_STUDY = {
  title: "How a 4-chair clinic in Jubilee Hills went from 12 to 45 enquiries per week",
  narrative: "A multi-specialty dental clinic in Jubilee Hills had been open for three years with excellent care but a 5-year-old WordPress template invisible on Google and phone-only booking. Within 60 days of launching their new platform, organic search enquiries tripled and no-shows dropped by 38% through automated WhatsApp reminders.",
  stack: ["Next.js", "Vercel", "Supabase", "WhatsApp Business API"],
  outcomes: [
    "3.7x increase in weekly patient enquiries (12 → 45).",
    "Page 1 Google ranking for 5 target keywords within 60 days.",
    "38% reduction in no-shows via automated reminders.",
    "24/7 online booking generating 30% of new appointments.",
  ],
  testimonial: {
    quote: "We went from relying entirely on word-of-mouth to getting 3–4 new patient enquiries every day through the website. The WhatsApp reminders alone saved us hours of phone calls.",
    author: "Dr. Meera S.",
    role: "Clinic Director, Jubilee Hills",
    placeholder: true,
  },
};


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

      {/* SECTION 2: METRICS */}
      <section className="border-t border-border-subtle py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {METRICS.map((m) => (<div key={m.label} className="rounded-xl border border-border bg-card p-6 text-center"><p className="text-4xl font-semibold tracking-tight text-primary">{m.value}</p><p className="mt-2 text-sm text-muted-foreground">{m.label}</p></div>))}
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground/50">Based on results from dental clinic projects in Hyderabad.</p>
          </FadeUp>
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

      {/* SECTION 7: CASE STUDY */}
      <section className="border-t border-border-subtle py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 lg:p-10">
              <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-primary/15 blur-3xl" />
              <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium text-primary"><Sparkles className="size-4" />Case Study</p>
                  <h2 id={headingIds[CASE_STUDY.title]} className="mt-3 text-3xl font-semibold tracking-tight">{CASE_STUDY.title}</h2>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{CASE_STUDY.narrative}</p>
                  <blockquote className="mt-6 border-l-2 border-primary/40 pl-4">
                    <p className="text-sm italic leading-relaxed text-foreground/80">&ldquo;{CASE_STUDY.testimonial.quote}&rdquo;</p>
                    <footer className="mt-2 text-xs text-muted-foreground">— {CASE_STUDY.testimonial.author}, {CASE_STUDY.testimonial.role}{CASE_STUDY.testimonial.placeholder && (<span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground/50">Placeholder</span>)}</footer>
                  </blockquote>
                  <div className="mt-6 flex flex-wrap gap-2">{CASE_STUDY.stack.map((t) => (<span key={t} className="rounded-full border border-border-subtle bg-muted px-3 py-1 text-xs text-foreground/80">{t}</span>))}</div>
                </div>
                <ul className="grid content-start gap-3">{CASE_STUDY.outcomes.map((o) => (<li key={o} className="flex gap-3 rounded-xl border border-border bg-popover p-4 text-sm text-muted-foreground"><Check className="mt-0.5 size-4 shrink-0 text-primary" /><span>{o}</span></li>))}</ul>
              </div>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}><div className="mt-10 flex justify-center"><Button size="lg" className="glow-border h-11 bg-primary px-6 text-primary-foreground transition-transform hover:bg-primary/90 active:scale-[0.98]" asChild><Link href="/#contact?niche=dental-medical&city=hyderabad">Get results like this for your clinic<ArrowRight className="size-4" /></Link></Button></div></FadeUp>
        </div>
      </section>

      {/* SECTION 8: INVESTMENT */}
      <section className="border-t border-border-subtle py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 text-center lg:p-14">
              <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative mx-auto max-w-2xl">
                <p className="text-sm font-medium text-primary">Investment</p>
                <h2 id={headingIds["One new patient per week pays for everything."]} className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">One new patient per week pays for everything.</h2>
                <p className="mt-4 text-muted-foreground">A single dental implant in Hyderabad: ₹25,000–₹60,000. A root canal: ₹3,000–₹8,000. If your new digital presence brings just 2–3 additional patients per week, the investment pays for itself within the first month.</p>
                <p className="mt-3 text-sm font-medium text-foreground/90">Typical dental clinic projects: custom-scoped based on clinic size, practitioners, and integrations needed.</p>
                <ul className="mx-auto mt-8 grid max-w-md gap-3 text-left">
                  {["Custom-designed premium website","Online booking system","Local SEO + Google Business optimization","Automated reminder system (WhatsApp + SMS)","Analytics dashboard","14-day delivery","Full ownership — no lock-in, no monthly fees"].map((item) => (<li key={item} className="flex gap-3 text-sm text-muted-foreground"><Check className="mt-0.5 size-4 shrink-0 text-primary" /><span>{item}</span></li>))}
                </ul>
                <div className="mt-10"><Button size="lg" className="glow-border h-11 bg-primary px-6 text-primary-foreground transition-transform hover:bg-primary/90 active:scale-[0.98]" asChild><Link href="/#contact?niche=dental-medical&city=hyderabad">Talk to Us About Your Clinic<ArrowRight className="size-4" /></Link></Button></div>
                <p className="mt-4 text-xs text-muted-foreground/60">You own everything. No monthly platform fees. No lock-in contracts. Scope and pricing confirmed on discovery call.</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* SECTION 8b: PACKAGES TEASER → dedicated pricing page */}
      <section className="border-t border-border-subtle py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <p className="text-sm font-medium text-primary">Pricing &amp; Packages</p>
            <h2 id={headingIds["Packages that fit your clinic and your budget."]} className="mt-3 text-3xl font-semibold tracking-tight">Packages that fit your clinic and your budget.</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">Five plans, from a premium storytelling landing page to a fully automated AI practice. Here are the three most clinics choose.</p>
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
          <FadeUp><div className="max-w-2xl"><p className="text-sm font-medium text-primary">How It Works</p><h2 id={headingIds["Live in 14 days. Hands-off for you."]} className="mt-3 text-3xl font-semibold tracking-tight">Live in 14 days. Hands-off for you.</h2><p className="mt-4 text-muted-foreground">You run your clinic. We handle everything else.</p></div></FadeUp>
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
                <p className="mt-6 text-xs text-muted-foreground/60">Free consultation · 14-day delivery · Full ownership · No lock-in</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
