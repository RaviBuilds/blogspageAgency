"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  Crown,
  Headset,
  Rocket,
  Sparkles,
  Stethoscope,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

import { Button } from "@/components/ui/button";
import { BookingCta } from "@/components/booking/booking-cta";
import { FadeUp } from "@/components/solutions/fade-up";

/* -------------------------------------------------------------------------- */
/*  Motion primitives — design system §5 (mirrors dental-solution-landing)     */
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

const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const CONTACT_HREF = "/#contact?niche=dental-medical&city=hyderabad";

/* -------------------------------------------------------------------------- */
/*  Plan data — one source for the cards, the accordion, and the table         */
/* -------------------------------------------------------------------------- */

type FeatureGroup = {
  label: string;
  /**
   * Optional one-line benefit statement under the group label. Used where a
   * capability needs framing in patient outcomes rather than a bare list —
   * appointment booking above all.
   */
  description?: string;
  items: string[];
};

type Plan = {
  id: string;
  /** Tier name shown on the card, in the accordion, and in the comparison table. */
  name: string;
  icon: typeof Rocket;
  /** One-line positioning statement. */
  tagline: string;
  price: string;
  priceNote?: string;
  delivery: string;
  /**
   * Website type and page count are specifications, not headlines — the
   * single-page Launch tier is sold on the storytelling outcome, with "1 page"
   * stated here in the spec list rather than set large on the card.
   */
  websiteType: string;
  pageCount: string;
  /** Typical page structure, when the plan spans more than one page. */
  structure?: { label: string; pages: string[] }[];
  /** "Everything in <x> PLUS" line, when the plan builds on another. */
  inherits?: string;
  groups: FeatureGroup[];
  /** "Best For" chips. */
  bestFor: string[];
  /** Rendered as a headline card; the rest live in the accordion. */
  featured?: boolean;
  popular?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "launch",
    name: "Launch Story Website",
    icon: Rocket,
    tagline:
      "Premium storytelling landing page designed to build trust and generate patient enquiries.",
    price: "₹14,900",
    delivery: "3–5 working days",
    websiteType: "Single-page premium website",
    pageCount: "1 professionally designed page",
    featured: true,
    groups: [
      {
        label: "Website design",
        items: [
          "Premium custom design (no templates)",
          "Storytelling-based layout",
          "Mobile-first responsive design",
          "Premium UI/UX",
          "Fast loading",
          "Basic animations",
        ],
      },
      {
        label: "Sections included",
        items: [
          "Hero banner",
          "About the doctor",
          "Services overview",
          "Why choose us",
          "Patient testimonials",
          "FAQ",
          "Contact section",
          "Google Maps",
        ],
      },
      {
        label: "Patient enquiry",
        description:
          "Patients can quickly submit their enquiry and receive a response from the clinic.",
        items: ["Lead capture form", "WhatsApp CTA", "Click-to-call"],
      },
      {
        label: "SEO",
        items: [
          "Basic technical SEO",
          "Meta titles & descriptions",
          "Google-friendly structure",
          "XML sitemap",
          "Image optimization",
        ],
      },
      {
        label: "Integrations",
        items: ["WhatsApp", "Google Maps", "Social media links"],
      },
      {
        label: "Support",
        items: ["1 month support", "Minor content changes"],
      },
    ],
    bestFor: [
      "New dental clinics",
      "Solo dentists",
      "Budget-conscious clinics",
      "First time online",
    ],
  },
  {
    id: "essential",
    name: "Essential",
    icon: Zap,
    tagline:
      "Room for your treatments and your story across dedicated pages, with local SEO switched on.",
    price: "₹19,900",
    delivery: "5–7 working days",
    websiteType: "Multi-page premium website",
    pageCount: "Up to 3 premium pages",
    structure: [
      { label: "Example", pages: ["Home", "Treatments", "Contact"] },
      { label: "Or", pages: ["Home", "About", "Contact"] },
    ],
    inherits: "Launch",
    groups: [
      {
        label: "Additional features",
        items: [
          "Dedicated About page",
          "Dedicated Treatments page",
          "Expanded service information",
          "Clinic gallery",
          "Trust indicators",
          "Patient reviews",
        ],
      },
      {
        label: "Marketing",
        items: [
          "Google Analytics",
          "Google Search Console",
          "Local SEO setup",
          "Google Business Profile integration",
        ],
      },
      {
        label: "Appointment booking",
        description:
          "Online appointment booking is available on this plan as an optional upgrade.",
        items: ["Lead capture form", "WhatsApp CTA", "Click-to-call"],
      },
      {
        label: "Performance",
        items: ["Enhanced speed optimization", "Better conversion layout"],
      },
      { label: "Support", items: ["2 months support", "2 design revisions"] },
    ],
    bestFor: [
      "Clinics with multiple services",
      "Growing practices",
      "Dentists wanting a stronger online presence",
    ],
  },
  {
    id: "premium-practice",
    name: "Premium Practice",
    icon: Sparkles,
    tagline:
      "A high-end, conversion-engineered practice website built to win the patient before the first call.",
    price: "₹29,900",
    delivery: "7–10 working days",
    websiteType: "Premium multi-page website",
    pageCount: "Up to 5 premium pages",
    structure: [
      {
        label: "Typical structure",
        pages: [
          "Home",
          "About Clinic",
          "Treatments",
          "Gallery / Testimonials",
          "Contact",
        ],
      },
      {
        label: "Or",
        pages: [
          "Home",
          "About Doctor",
          "Treatments",
          "Before & After",
          "Contact",
        ],
      },
    ],
    inherits: "Essential",
    featured: true,
    popular: true,
    groups: [
      {
        label: "Premium experience",
        items: [
          "Premium storytelling design",
          "High-end UI/UX",
          "Modern animations",
          "Interactive sections",
          "Before & after gallery",
          "Awards & certifications",
          "Doctor experience showcase",
        ],
      },
      {
        label: "24/7 online appointment booking",
        description:
          "Patients can book appointments directly from the website at any time using an integrated scheduling experience.",
        items: [
          "Online appointment booking",
          "Google Calendar integration",
          "Appointment confirmation emails",
          "Mobile-friendly booking experience",
        ],
      },
      {
        label: "Conversion optimization",
        items: [
          "Sticky mobile CTA",
          "Conversion-focused layout",
          "Appointment-focused design",
          "Trust-building sections",
          "Premium call-to-action strategy",
        ],
      },
      {
        label: "SEO",
        items: [
          "Technical SEO",
          "Schema markup",
          "Image optimization",
          "Internal linking",
          "Meta optimization",
        ],
      },
      {
        label: "Performance",
        items: [
          "Premium PageSpeed optimization",
          "Core Web Vitals optimization",
        ],
      },
      { label: "Support", items: ["3 months support", "3 design revisions"] },
    ],
    bestFor: [
      "Cosmetic dentists",
      "Implant clinics",
      "Orthodontists",
      "Established clinics",
    ],
  },
  {
    id: "practice-growth",
    name: "Practice Growth",
    icon: Stethoscope,
    tagline:
      "A dedicated page for every treatment you want to rank for, plus a blog engine to compound it.",
    price: "₹49,900",
    delivery: "10–14 working days",
    websiteType: "SEO-led multi-page website",
    pageCount: "Up to 12 premium pages",
    structure: [
      {
        label: "Example structure",
        pages: [
          "Home",
          "About",
          "Doctors",
          "Treatments",
          "Dental Implants",
          "Root Canal",
          "Braces",
          "Invisalign",
          "Teeth Whitening",
          "Gallery",
          "Blog",
          "Contact",
        ],
      },
    ],
    inherits: "Premium Practice",
    groups: [
      {
        label: "Dedicated SEO pages",
        items: [
          "Dental implants",
          "Root canal",
          "Braces",
          "Invisalign",
          "Teeth whitening",
          "Smile makeover",
          "Pediatric dentistry",
        ],
      },
      {
        label: "Appointment experience",
        description:
          "Booking runs through the whole website, not just one contact page.",
        items: [
          "Appointment scheduling",
          "Calendar synchronization",
          "Booking CTA throughout the website",
          "Consultation request workflow",
        ],
      },
      {
        label: "Marketing",
        items: [
          "Blog CMS",
          "Google Reviews integration",
          "Local SEO optimization",
          "Conversion tracking",
        ],
      },
      {
        label: "Premium features",
        items: [
          "Blog system",
          "Dynamic content",
          "Premium animations",
          "Structured data",
          "Internal SEO strategy",
        ],
      },
      { label: "Support", items: ["3 months support", "SEO guidance"] },
    ],
    bestFor: [
      "Clinics targeting Google rankings",
      "Long-term patient acquisition",
      "Competitive city markets",
    ],
  },
  {
    id: "signature-ai",
    name: "Signature AI Practice",
    icon: Crown,
    tagline:
      "The full growth system: a custom website architecture with an AI chatbot and AI receptionist running your front desk.",
    price: "From ₹1,25,000",
    priceNote:
      "Final quotation depends on workflow complexity and integrations.",
    delivery: "3–6 weeks",
    websiteType: "Custom website architecture",
    pageCount: "Unlimited / custom page count",
    inherits: "Practice Growth",
    featured: true,
    groups: [
      {
        label: "AI systems",
        description:
          "The AI receptionist automatically handles appointment booking, rescheduling, and follow-up conversations.",
        items: [
          "AI chatbot",
          "AI receptionist",
          "AI-assisted appointment booking & rescheduling",
          "WhatsApp automation",
          "Appointment reminder automation",
          "Google review automation",
        ],
      },
      {
        label: "Growth infrastructure",
        items: [
          "CRM integration",
          "Lead dashboard",
          "Google Ads landing pages",
          "Analytics dashboard",
          "Monthly performance reports",
        ],
      },
      { label: "Operations", items: ["Security & maintenance"] },
    ],
    bestFor: [
      "Premium clinics",
      "Multi-location practices",
      "Dental brands automating the front desk",
    ],
  },
];

const FEATURED_PLANS = PLANS.filter((plan) => plan.featured);
const OTHER_PLANS = PLANS.filter((plan) => !plan.featured);

/* Comparison table: one row per capability, one value per plan, in PLANS order. */
const COMPARISON_ROWS: { label: string; values: string[] }[] = [
  {
    label: "Investment",
    values: ["₹14,900", "₹19,900", "₹29,900", "₹49,900", "From ₹1,25,000"],
  },
  {
    label: "Delivery",
    values: ["3–5 days", "5–7 days", "7–10 days", "10–14 days", "3–6 weeks"],
  },
  {
    label: "Website type",
    values: [
      "Single-page storytelling",
      "Multi-page",
      "Premium multi-page",
      "SEO-led multi-page",
      "Custom architecture",
    ],
  },
  {
    label: "Page count",
    values: ["1 page", "Up to 3", "Up to 5", "Up to 12", "Unlimited / custom"],
  },
  {
    label: "Treatment SEO pages",
    values: ["—", "—", "—", "7 pages", "7+ pages"],
  },
  {
    label: "Local SEO & Google Business",
    values: ["Basic", "Yes", "Yes", "Advanced", "Advanced"],
  },
  {
    label: "Gallery & social proof",
    values: [
      "Testimonials",
      "+ Clinic gallery",
      "+ Before & after",
      "+ Google Reviews",
      "+ Review automation",
    ],
  },
  { label: "Blog CMS", values: ["—", "—", "—", "Yes", "Yes"] },
  {
    label: "Online appointment booking",
    values: [
      "—",
      "Optional",
      "Included",
      "Included",
      "Included + AI assisted",
    ],
  },
  {
    label: "Appointment automation",
    values: ["—", "—", "—", "Basic", "AI powered"],
  },
  {
    label: "AI chatbot",
    values: ["Add-on", "Add-on", "Add-on", "Add-on", "Included"],
  },
  {
    label: "AI receptionist",
    values: ["Add-on", "Add-on", "Add-on", "Add-on", "Included"],
  },
  {
    label: "Support",
    values: [
      "1 month",
      "2 months",
      "3 months",
      "3 months + SEO guidance",
      "Ongoing",
    ],
  },
  {
    label: "Design revisions",
    values: ["Minor changes", "2", "3", "3", "Custom scope"],
  },
];

/* -------------------------------------------------------------------------- */
/*  AI add-on data                                                            */
/* -------------------------------------------------------------------------- */

const AI_CHATBOT = {
  icon: Bot,
  name: "AI Chatbot",
  price: "Starting from ₹15,000",
  summary:
    "An always-on assistant that answers patient questions the moment they land on your website.",
  features: [
    "Answers patient FAQs",
    "Treatment information",
    "Clinic timings",
    "Pricing guidance",
    "Location assistance",
    "Captures enquiries",
    "Suggests treatments",
    "Hands over to staff when required",
  ],
  useCases: [
    "24×7 patient support",
    "Website engagement",
    "Lead capture",
    "FAQ automation",
    "Reducing repetitive calls",
  ],
};

const AI_RECEPTIONIST = {
  icon: Headset,
  name: "AI Receptionist",
  price: "Starting from ₹40,000+",
  priceNote:
    "Pricing varies with voice, WhatsApp, CRM, calendar, and automation integrations.",
  summary:
    "A virtual front desk that manages patient conversations from first enquiry through a booked appointment.",
  features: [
    "Greets every patient automatically",
    "Answers enquiries",
    "Qualifies patients",
    "Collects patient information",
    "Books appointments",
    "Reschedules appointments",
    "Cancels appointments",
    "Sends reminders",
    "Sends WhatsApp confirmations",
    "Requests Google reviews",
    "Transfers conversations to staff",
    "Maintains patient conversation history",
    "Available 24×7",
  ],
  appointmentAutomation: [
    "Answer booking enquiries",
    "Check availability",
    "Schedule appointments",
    "Reschedule appointments",
    "Cancel appointments",
    "Send reminders",
    "Send confirmation messages",
    "Follow up with patients",
    "Reduce missed appointments",
  ],
  integrations: [
    "Google Calendar",
    "WhatsApp Business",
    "Email",
    "SMS",
    "CRM",
    "Voice calling",
    "Clinic management software",
    "Google Sheets",
    "Custom APIs",
  ],
  useCases: [
    "Busy reception desks",
    "Clinics missing incoming calls",
    "Multi-doctor practices",
    "Implant consultation bookings",
    "Cosmetic dentistry enquiries",
    "Weekend & after-hours support",
    "Appointment reminder automation",
    "Follow-up with potential patients",
    "Review collection after treatment",
    "Reducing receptionist workload",
  ],
  benefits: [
    "Never miss a patient enquiry",
    "Increase appointment bookings",
    "Reduce staff workload",
    "Faster response times",
    "Improve patient experience",
    "Reduce no-shows",
    "Scale without hiring extra reception staff",
  ],
};

/** Everything the Signature AI Practice plan bundles beyond the website build. */
const SIGNATURE_INCLUSIONS = [
  "AI Chatbot",
  "AI Receptionist",
  "AI-Assisted Appointment Booking",
  "WhatsApp Automation",
  "Appointment Reminder Automation",
  "Google Review Automation",
  "CRM Integration",
  "Lead Dashboard",
  "Google Ads Landing Pages",
  "Analytics Dashboard",
  "Monthly Performance Reports",
  "Security & Maintenance",
];

const ADD_ONS = [
  { service: "Additional premium page", price: "₹2,500 / page" },
  { service: "Online appointment booking setup", price: "On request" },
  { service: "Professional content writing", price: "₹6,000" },
  { service: "Blog setup", price: "₹7,500" },
  { service: "Google Business Profile optimization", price: "₹5,000" },
  { service: "Monthly SEO", price: "₹12,000–₹20,000 / month" },
  { service: "AI chatbot", price: "Starting from ₹15,000" },
  { service: "AI receptionist", price: "Starting from ₹40,000+" },
  { service: "WhatsApp automation", price: "₹10,000" },
  { service: "Website maintenance", price: "₹1,500 / month" },
  { service: "Hosting & domain management", price: "₹3,000 / year" },
];

const PAYMENT_TERMS = [
  { share: "50%", label: "Advance", detail: "To begin the project." },
  {
    share: "30%",
    label: "After design approval",
    detail: "Once you sign off on the design.",
  },
  {
    share: "20%",
    label: "Before go-live",
    detail: "Just before the website goes live.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

function FeatureList({ group }: { group: FeatureGroup }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
        {group.label}
      </p>
      {group.description && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground/80">
          {group.description}
        </p>
      )}
      <ul className="mt-3 grid gap-2">
        {group.items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
            <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Website type, page count, and delivery as specifications rather than
 * headlines, so a single-page plan reads on its outcome and not on "1 page".
 */
function SpecList({ plan }: { plan: Plan }) {
  const specs = [
    { term: "Website type", value: plan.websiteType },
    { term: "Page count", value: plan.pageCount },
    { term: "Delivery", value: plan.delivery },
  ];

  return (
    <dl className="grid gap-2.5">
      {specs.map((spec) => (
        <div
          key={spec.term}
          className="flex items-baseline justify-between gap-4 text-sm"
        >
          <dt className="text-muted-foreground">{spec.term}</dt>
          <dd className="text-right font-medium text-foreground/90">
            {spec.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function StructureBlock({ plan }: { plan: Plan }) {
  if (!plan.structure) return null;

  return (
    <div className="mt-5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
      {plan.structure.map((option) => (
        <div key={option.label} className="mt-3 first:mt-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
            {option.label}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {option.pages.map((page) => (
              <span
                key={page}
                className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-xs text-foreground/80"
              >
                {page}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function BestForChips({ items }: { items: string[] }) {
  return (
    <div className="mt-6">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
        Best for
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1 text-xs text-foreground/80"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function PlanAccordionItem({ plan }: { plan: Plan }) {
  const [open, setOpen] = useState(false);
  const Icon = plan.icon;

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-white/[0.03]"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-primary/10">
          <Icon className="size-5 text-primary" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-medium tracking-tight">{plan.name}</span>
          <span className="mt-0.5 block text-sm text-muted-foreground">
            {plan.pageCount} · {plan.delivery}
          </span>
        </span>
        <span className="hidden shrink-0 text-right sm:block">
          <span className="block text-lg font-semibold tracking-tight">
            {plan.price}
          </span>
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.06] p-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {plan.tagline}
              </p>
              <p className="mt-4 text-lg font-semibold tracking-tight sm:hidden">
                {plan.price}
              </p>
              <div className="mt-5 max-w-md">
                <SpecList plan={plan} />
              </div>
              <StructureBlock plan={plan} />
              {plan.inherits && (
                <p className="mt-5 text-sm font-medium text-foreground/90">
                  Everything in {plan.inherits}, plus:
                </p>
              )}
              <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {plan.groups.map((group) => (
                  <FeatureList key={group.label} group={group} />
                ))}
              </div>
              <BestForChips items={plan.bestFor} />
              <BookingCta
                fallbackHref={CONTACT_HREF}
                size="default"
                variant="outline"
                className="mt-6 h-10 border-white/10 bg-transparent px-5 hover:bg-white/[0.04]"
                frameTitle={`Schedule a consultation about ${plan.name}`}
              >
                Schedule Consultation
                <span className="sr-only"> about {plan.name}</span>
                <ArrowRight className="size-4" />
              </BookingCta>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Props                                                                     */
/* -------------------------------------------------------------------------- */

type DentalPackagesLandingProps = {
  cityLabel: string;
  /** Path back to the dental solution landing page. */
  solutionPath: string;
  headingIds: Record<string, string>;
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function DentalPackagesLanding({
  cityLabel,
  solutionPath,
  headingIds,
}: DentalPackagesLandingProps) {
  return (
    <div className="relative overflow-hidden">
      {/* SECTION 1: HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="gradient-mesh pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_72%)]" />
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-16 lg:px-8 lg:pb-20 lg:pt-24">
          <div className="max-w-3xl">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-muted-foreground"
            >
              <Stethoscope className="size-3.5 text-primary" />
              Dental growth solutions · {cityLabel}
            </motion.div>
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.06}
              className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              Dental website packages &amp; pricing.
              <span className="mt-2 block text-2xl font-medium text-muted-foreground sm:text-3xl">
                Fixed scope. Fixed price. No surprises.
              </span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.12}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            >
              Premium websites designed to build trust, attract more patients,
              and grow your dental practice — from a storytelling landing page
              to a fully automated AI practice. Premium plans and above let
              patients book appointments 24/7, straight from your website.
            </motion.p>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.18}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <BookingCta
                fallbackHref={CONTACT_HREF}
                size="lg"
                className="glow-border h-11 bg-primary px-6 text-primary-foreground transition-transform hover:bg-primary/90 active:scale-[0.98]"
                frameTitle="Book a free clinic audit"
              >
                Book a Free Clinic Audit
                <ArrowRight className="size-4" />
              </BookingCta>
              <Button
                size="lg"
                variant="outline"
                className="h-11 border-white/10 bg-transparent px-6 hover:bg-white/[0.04]"
                asChild
              >
                <Link href={solutionPath}>
                  <ArrowLeft className="size-4" />
                  Back to dental solution
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURED PACKAGES */}
      <section id="packages" className="border-t border-white/[0.06] py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <p className="text-sm font-medium text-primary">Packages</p>
            <h2
              id={headingIds["Three ways to start. One goal: more patients."]}
              className="mt-3 text-3xl font-semibold tracking-tight"
            >
              Three ways to start. One goal: more patients.
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Most clinics pick one of these three. Two more plans sit between
              them if you need a different fit.
            </p>
          </FadeUp>

          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-12 grid items-start gap-5 lg:grid-cols-3"
          >
            {FEATURED_PLANS.map((plan) => {
              const Icon = plan.icon;
              return (
                <motion.article
                  key={plan.id}
                  variants={staggerChild}
                  className={`relative flex h-full flex-col overflow-hidden rounded-2xl border p-7 backdrop-blur-md transition-colors ${
                    plan.popular
                      ? "border-primary/40 bg-primary/[0.04]"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16]"
                  }`}
                >
                  {plan.popular && (
                    <>
                      <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-primary/20 blur-3xl" />
                      <span className="relative mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        <Sparkles className="size-3" />
                        Most popular
                      </span>
                    </>
                  )}
                  <div className="relative flex flex-1 flex-col">
                    <span className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </span>
                    <h3 className="mt-5 text-xl font-semibold tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {plan.tagline}
                    </p>

                    <div className="mt-6 border-y border-white/[0.06] py-5">
                      <p className="text-3xl font-semibold tracking-tight text-foreground">
                        {plan.price}
                      </p>
                      {plan.priceNote && (
                        <p className="mt-2 text-xs text-muted-foreground/60">
                          {plan.priceNote}
                        </p>
                      )}
                      <div className="mt-4">
                        <SpecList plan={plan} />
                      </div>
                    </div>

                    <StructureBlock plan={plan} />

                    {plan.inherits && (
                      <p className="mt-5 text-sm font-medium text-foreground/90">
                        Everything in {plan.inherits}, plus:
                      </p>
                    )}

                    <div className="mt-5 grid flex-1 gap-5">
                      {plan.groups.map((group) => (
                        <FeatureList key={group.label} group={group} />
                      ))}
                    </div>

                    <BestForChips items={plan.bestFor} />

                    <BookingCta
                      fallbackHref={CONTACT_HREF}
                      size="lg"
                      variant={plan.popular ? "default" : "outline"}
                      className={
                        plan.popular
                          ? "glow-border mt-7 h-11 bg-primary px-6 text-primary-foreground transition-transform hover:bg-primary/90 active:scale-[0.98]"
                          : "mt-7 h-11 border-white/10 bg-transparent px-6 hover:bg-white/[0.04]"
                      }
                      frameTitle={`Schedule a consultation about ${plan.name}`}
                    >
                      Schedule Consultation
                      <span className="sr-only"> about {plan.name}</span>
                      <ArrowRight className="size-4" />
                    </BookingCta>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: REMAINING PLANS (accordion) */}
      <section id="all-plans" className="border-t border-white/[0.06] py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <p className="text-sm font-medium text-primary">Explore all plans</p>
            <h2
              id={headingIds["Explore all five plans."]}
              className="mt-3 text-3xl font-semibold tracking-tight"
            >
              Explore all five plans.
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Essential and Practice Growth sit between the headline three.
              Expand either one for the full scope.
            </p>
          </FadeUp>
          <div className="mt-10 grid gap-3">
            {OTHER_PLANS.map((plan, i) => (
              <FadeUp key={plan.id} delay={i * 0.06}>
                <PlanAccordionItem plan={plan} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: COMPARISON TABLE */}
      <section className="border-t border-white/[0.06] py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <p className="text-sm font-medium text-primary">Compare</p>
            <h2
              id={headingIds["Compare every plan side by side."]}
              className="mt-3 text-3xl font-semibold tracking-tight"
            >
              Compare every plan side by side.
            </h2>
          </FadeUp>
          <FadeUp delay={0.08}>
            <div className="mt-10 overflow-x-auto rounded-2xl border border-white/[0.08] bg-card">
              <table className="w-full min-w-[900px] border-collapse text-sm">
                <caption className="sr-only">
                  Dental website plan comparison: specifications and features by
                  package
                </caption>
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th
                      scope="col"
                      className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      Feature
                    </th>
                    {PLANS.map((plan) => (
                      <th
                        scope="col"
                        key={plan.id}
                        className={`px-5 py-4 text-left font-medium tracking-tight ${plan.popular ? "text-primary" : "text-foreground"}`}
                      >
                        {plan.name}
                        {plan.popular && (
                          <span className="mt-1 block text-[10px] font-normal uppercase tracking-wider text-primary/70">
                            Most popular
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row) => (
                    <tr
                      key={row.label}
                      className="border-b border-white/[0.05] last:border-b-0"
                    >
                      <th
                        scope="row"
                        className="px-5 py-4 text-left font-normal text-muted-foreground"
                      >
                        {row.label}
                      </th>
                      {row.values.map((value, i) => (
                        <td
                          key={`${row.label}-${PLANS[i].id}`}
                          className={`px-5 py-4 ${
                            value === "—"
                              ? "text-muted-foreground/40"
                              : PLANS[i].popular
                                ? "text-foreground"
                                : "text-foreground/80"
                          }`}
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* SECTION 5: AI CHATBOT + AI RECEPTIONIST */}
      <section id="ai-add-ons" className="border-t border-white/[0.06] py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <p className="text-sm font-medium text-primary">AI systems</p>
            <h2
              id={headingIds["AI that answers, books, and follows up."]}
              className="mt-3 text-3xl font-semibold tracking-tight"
            >
              AI that answers, books, and follows up.
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Both are included in Signature AI Practice, and both can be added
              to any other plan.
            </p>
          </FadeUp>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <FadeUp>
              <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-md">
                <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-indigo-500/15 blur-3xl" />
                <div className="relative">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] bg-primary/10">
                    <AI_CHATBOT.icon className="size-5 text-primary" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight">
                    {AI_CHATBOT.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {AI_CHATBOT.summary}
                  </p>
                  <p className="mt-5 text-2xl font-semibold tracking-tight">
                    {AI_CHATBOT.price}
                  </p>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <FeatureList
                      group={{ label: "Features", items: AI_CHATBOT.features }}
                    />
                    <FeatureList
                      group={{
                        label: "Best use cases",
                        items: AI_CHATBOT.useCases,
                      }}
                    />
                  </div>
                </div>
              </article>
            </FadeUp>

            <FadeUp delay={0.08}>
              <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-md">
                <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-primary/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 size-56 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="relative">
                  <span className="flex size-11 items-center justify-center rounded-xl border border-white/[0.08] bg-primary/10">
                    <AI_RECEPTIONIST.icon className="size-5 text-primary" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold tracking-tight">
                    {AI_RECEPTIONIST.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {AI_RECEPTIONIST.summary}
                  </p>
                  <p className="mt-5 text-2xl font-semibold tracking-tight">
                    {AI_RECEPTIONIST.price}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground/60">
                    {AI_RECEPTIONIST.priceNote}
                  </p>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <FeatureList
                      group={{
                        label: "Features",
                        items: AI_RECEPTIONIST.features,
                      }}
                    />
                    <div className="grid gap-6">
                      <FeatureList
                        group={{
                          label: "Business benefits",
                          items: AI_RECEPTIONIST.benefits,
                        }}
                      />
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                          Integrations
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {AI_RECEPTIONIST.integrations.map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1 text-xs text-foreground/80"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <FeatureList
                      group={{
                        label: "Appointment automation",
                        description:
                          "Booking, rescheduling, and reminders handled in conversation, day or night.",
                        items: AI_RECEPTIONIST.appointmentAutomation,
                      }}
                    />
                    <FeatureList
                      group={{
                        label: "Best use cases",
                        items: AI_RECEPTIONIST.useCases,
                      }}
                    />
                  </div>
                </div>
              </article>
            </FadeUp>
          </div>

          <FadeUp delay={0.12}>
            <div className="mt-5 rounded-2xl border border-primary/25 bg-primary/[0.04] p-7">
              <p className="flex items-center gap-2 text-sm font-medium text-primary">
                <Crown className="size-4" />
                Included in Signature AI Practice
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {SIGNATURE_INCLUSIONS.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-xs text-foreground/85"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* SECTION 6: OPTIONAL ADD-ONS */}
      <section id="add-ons" className="border-t border-white/[0.06] py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <p className="text-sm font-medium text-primary">Add-ons</p>
            <h2
              id={headingIds["Optional add-ons."]}
              className="mt-3 text-3xl font-semibold tracking-tight"
            >
              Optional add-ons.
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Bolt any of these onto any plan, before or after launch.
            </p>
          </FadeUp>
          <FadeUp delay={0.08}>
            <div className="mt-10 overflow-hidden rounded-2xl border border-white/[0.08] bg-card">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">
                  Optional add-on services and investment
                </caption>
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th
                      scope="col"
                      className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      Service
                    </th>
                    <th
                      scope="col"
                      className="px-5 py-4 text-right text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                    >
                      Investment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ADD_ONS.map((addOn) => (
                    <tr
                      key={addOn.service}
                      className="border-b border-white/[0.05] last:border-b-0"
                    >
                      <th
                        scope="row"
                        className="px-5 py-4 text-left font-normal text-foreground/80"
                      >
                        {addOn.service}
                      </th>
                      <td className="px-5 py-4 text-right font-medium text-foreground">
                        {addOn.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* SECTION 7: PAYMENT TERMS */}
      <section className="border-t border-white/[0.06] py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <p className="text-sm font-medium text-primary">Payment terms</p>
            <h2
              id={headingIds["Simple payment terms."]}
              className="mt-3 text-3xl font-semibold tracking-tight"
            >
              Simple payment terms.
            </h2>
          </FadeUp>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {PAYMENT_TERMS.map((term, i) => (
              <FadeUp key={term.share} delay={i * 0.08}>
                <div className="h-full rounded-xl border border-white/[0.08] bg-card p-6">
                  <p className="text-4xl font-semibold tracking-tight text-primary">
                    {term.share}
                  </p>
                  <p className="mt-3 font-medium tracking-tight">{term.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {term.detail}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.12}>
            <p className="mt-6 text-xs text-muted-foreground/60">
              All prices are one-time unless marked monthly or yearly. GST
              applicable where relevant. You own everything we build — no
              lock-in contracts.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* SECTION 8: FINAL CTA */}
      <section className="border-t border-white/[0.06] py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <FadeUp>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-card p-10 text-center lg:p-14">
              <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative mx-auto max-w-2xl">
                <h2
                  id={headingIds["Not sure which plan fits your clinic?"]}
                  className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
                >
                  Not sure which plan fits your clinic?
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Your future patients should be able to book an appointment in
                  under one minute. Tell us your clinic size, treatments, and
                  target patients in {cityLabel} — we will recommend the
                  smallest plan that gets you there.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <BookingCta
                    fallbackHref={CONTACT_HREF}
                    size="lg"
                    className="glow-border h-11 bg-primary px-6 text-primary-foreground transition-transform hover:bg-primary/90 active:scale-[0.98]"
                    frameTitle="Book a free clinic audit"
                  >
                    Book a Free Clinic Audit
                    <ArrowRight className="size-4" />
                  </BookingCta>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-11 border-white/10 bg-transparent px-6 hover:bg-white/[0.04]"
                    asChild
                  >
                    <Link href={solutionPath}>
                      <ArrowLeft className="size-4" />
                      Back to dental solution
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
