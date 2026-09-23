"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  Clock,
  MapPin,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

import { FadeUp } from "@/components/solutions/fade-up";

/* -------------------------------------------------------------------------- */
/*  Motion primitives — design system §5 (mirrors dental-solution-landing)     */
/* -------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1] as const;

const reveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/* -------------------------------------------------------------------------- */
/*  Content — owner-supplied facts only.                                       */
/*                                                                            */
/*  Every statement below is either an owner-approved fact about NeoDent       */
/*  Dental Hospitals or a verified implementation fact about the website       */
/*  Blogspage delivered. No performance metrics, no stack list, no invented    */
/*  testimonial. See docs/canonical/                                           */
/*  BLOGSPAGE_AI_DENTAL_SOLUTIONS_PAGES_REFINEMENT_BLUEPRINT_v1.0.md §5.      */
/* -------------------------------------------------------------------------- */

const NEODENT_URL = "https://www.neodentdentalhospitals.com/";

const BEFORE_TEXT =
  "NeoDent Dental Hospitals has been practising dentistry since 1994, founded by Dr. Mohd. Siraj Ur Rahman. Over more than three decades the hospital built a strong reputation, a deep bench of specialist credentials, and a genuine press presence across its two Hyderabad locations — Mehdipatnam and Nampally. Its previous digital presence did not reflect that authority.";

const AFTER_TEXT =
  "The website Blogspage built presents that authority properly: a stronger brand identity, doctor credentials surfaced clearly, treatment and service pages that explain the hospital's specialities, a press and media section, patient testimonials, and appointment booking pathways for patients across both locations.";

const WHAT_WAS_BUILT = [
  "Stronger brand identity across the website",
  "Doctor credentials surfaced clearly",
  "Treatment and service presentation with dedicated treatment pages",
  "Press and media section showcasing the hospital's coverage",
  "Patient testimonial section",
  "Appointment booking pathways for patients",
  "Location presentation for Mehdipatnam and Nampally",
];

const HOSPITAL_FACTS = [
  { icon: Clock, label: "Founded", value: "1994" },
  { icon: UserRound, label: "Founder", value: "Dr. Mohd. Siraj Ur Rahman" },
  { icon: MapPin, label: "Locations", value: "Mehdipatnam · Nampally, Hyderabad" },
  {
    icon: Stethoscope,
    label: "Specialist-led care",
    value: "Prosthodontics · Implants · Restorative dentistry",
  },
];

/**
 * Evidence gallery — real owner-supplied screenshots under
 * `public/case-studies/neodent/`. Intentionally empty until the owner's
 * screenshots land in the repository: a filename must never be referenced
 * before its file exists. When assets arrive, add entries here (with `.png`
 * / `.jpg` extensions matching the delivered files) and the gallery below
 * renders them in case-study order:
 *
 * { src: "/case-studies/neodent/hero", caption: "Website hero" },
 * { src: "/case-studies/neodent/legacy", caption: "Legacy section — 30 years of practice history" },
 * { src: "/case-studies/neodent/treatment-atlas", caption: "Treatment atlas — specialist services" },
 * { src: "/case-studies/neodent/testimonials", caption: "Patient testimonials section" },
 * { src: "/case-studies/neodent/press", caption: "Press and media coverage" },
 * { src: "/case-studies/neodent/google-search-proof", caption: "Google search presence" },
 * { src: "/case-studies/neodent/mobile", caption: "Mobile experience" },
 *
 * Captions state what the screenshot shows — nothing more. The screenshots
 * are real project evidence and are never recolored or used to imply
 * performance outcomes.
 */
type GalleryItem = { src: string; caption: string };

const GALLERY: GalleryItem[] = [];

/**
 * Owner-pending testimonial slot. Deliberately NOT a quote: no quotation
 * marks, no invented text, no attribution. When the owner approves the real
 * quote from Dr. Siraj, replace this constant with
 * `{ status: "received" as const, quote, role }` and swap the placeholder
 * card below for a real blockquote rendering.
 */
const TESTIMONIAL: { status: "pending-owner" } = { status: "pending-owner" };

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export function NeodentCaseStudy() {
  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8">
      <FadeUp>
        <p className="text-sm font-medium text-primary">Real client proof</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          A real client. A real transformation.
        </h2>
      </FadeUp>

      <motion.div
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mt-10"
      >
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 lg:p-10">
          <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 size-56 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Narrative + what was built */}
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-primary">
                <BadgeCheck className="size-4" />
                NeoDent Dental Hospitals
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {BEFORE_TEXT}
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {AFTER_TEXT}
              </p>
              <div className="mt-6">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                  What the website includes
                </p>
                <ul className="mt-3 grid gap-2">
                  {WHAT_WAS_BUILT.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-sm text-muted-foreground"
                    >
                      <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-6 text-sm">
                See the live website:{" "}
                <a
                  href={NEODENT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-primary transition-colors hover:text-foreground"
                >
                  neodentdentalhospitals.com
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </p>
            </div>

            {/* Facts panel + owner-pending testimonial slot */}
            <div className="grid content-start gap-4">
              <div className="grid gap-4 rounded-xl border border-border bg-popover p-6">
                {HOSPITAL_FACTS.map((fact) => {
                  const Icon = fact.icon;
                  return (
                    <div key={fact.label} className="flex gap-3">
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-primary/10">
                        <Icon className="size-4 text-primary" />
                      </span>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          {fact.label}
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {fact.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {TESTIMONIAL.status === "pending-owner" && (
                <div className="rounded-xl border border-dashed border-border-strong bg-popover p-6">
                  <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    <CalendarCheck className="size-3.5" />
                    Testimonial — awaiting owner approval
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground/70">
                    A verified quote from Dr. Mohd. Siraj Ur Rahman will be
                    placed here once approved by the hospital&apos;s owner. We
                    do not publish placeholder quotations.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Evidence gallery — renders only when real screenshots exist. */}
      {GALLERY.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {GALLERY.map((item, i) => (
            <FadeUp key={item.src} delay={Math.min(i * 0.06, 0.3)}>
              <figure className="overflow-hidden rounded-xl border border-border bg-card">
                <Image
                  src={item.src}
                  alt={`NeoDent Dental Hospitals website — ${item.caption}`}
                  width={1280}
                  height={800}
                  sizes="(min-width: 1024px) 576px, 100vw"
                  className="h-auto w-full"
                />
                <figcaption className="border-t border-border-subtle px-4 py-3 text-xs text-muted-foreground">
                  {item.caption}
                </figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
      )}

      <FadeUp delay={0.1}>
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Want your hospital&apos;s authority presented properly online?{" "}
          <Link
            href="/#contact?niche=dental-medical&city=hyderabad"
            className="inline-flex items-center gap-1 font-medium text-primary transition-colors hover:text-foreground"
          >
            Book a free clinic audit
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </p>
      </FadeUp>
    </div>
  );
}

