/**
 * Real portfolio project data for the "Featured Systems" section.
 *
 * Split out from `src/components/home/featured-work.tsx` (a `"use client"`
 * module) into its own plain module so `/about` (Requirement 8.4, 8.6, 8.7)
 * can import the same data from a server component. A client component's
 * non-default exports are not safely importable from server components, so
 * this is the single source both consumers read from.
 *
 * Pure module: no I/O, no React, no framework imports.
 */

/**
 * Requirement 8.6, 8.7: each outcome is a metric name plus a numeric value
 * with its unit, and the literal word "measured" or "estimated" must render
 * in the same visible block as the figure. No production analytics
 * dashboards are wired into this repository, so every figure below is a
 * conservative, description-consistent estimate rather than a claimed
 * measurement — hence "estimated" on all four, never "measured".
 */
export type ProjectMetric = {
  label: string;
  value: string;
  basis: "measured" | "estimated";
};

export type FeaturedProject = {
  id: string;
  image: string;
  tag: string;
  headline: string;
  description: string;
  tech: string[];
  metrics: ProjectMetric[];
  accent: string;
  gradient: string;
  /**
   * V2.0 story frame (Blueprint §13) — the one-line "why this project
   * existed" sentence. Optional so supporting cards may omit it.
   */
  storyFrame?: string;
  /**
   * V2.0 visual sequence (Blueprint §13) — the problem → build → system
   * narrative steps, rendered as chips. Every step must describe structure
   * that already exists in `description`; never a result or outcome claim.
   */
  visualSequence?: string[];
  /**
   * R6 — the capability pillar this project proves, rendered as the
   * featured story's category pill. Wording mirrors `homepage-verticals.ts`
   * titles so the WHAT-WE-BUILD triangle stays legible. Optional: the
   * featured component falls back to `tag` when absent.
   */
  category?: string;
  /**
   * R6 project → solution link. The destination must be an **existing**
   * route (`/solutions/<generated-slug>` or a `/services/<slug>`
   * Service_Route) — never an invented URL. `solutionCta` is the visible
   * CTA wording. Both fields ship together or not at all.
   */
  solutionHref?: string;
  solutionCta?: string;
};

export const projects: FeaturedProject[] = [
  {
    id: "phixl-ai",
    image: "/phixlAI.jpg",
    tag: "AI-Powered SaaS",
    headline: "Phixl AI - Photo Restoration Platform",
    description:
      "A fully monetized generative AI platform that breathes new life into damaged photographs. Features a scalable user credit system with free-tier onboarding, seamless Razorpay checkout for credit top-ups, and instant, high-fidelity image processing.",
    storyFrame: "A product built around AI.",
    visualSequence: ["Upload", "AI Processing", "Result", "Account / Credits", "Payment"],
    category: "AI & Automation",
    solutionHref: "/services/ai-automation",
    solutionCta: "Explore AI & Automation",
    tech: ["Next.js", "Replicate AI", "Supabase", "TypeScript", "Tailwind", "Razorpay"],
    metrics: [
      { label: "Manual restoration time saved", value: "~80%", basis: "estimated" },
    ],
    accent: "99,102,241",
    gradient: "from-indigo-500/20 via-violet-500/10 to-transparent",
  },
  {
    id: "nextinn",
    image: "/NextInn.jpg",
    tag: "Hospitality Management",
    headline: "NextInn Booking & Operations",
    description:
      "A secure, all-in-one hotel platform designed to drive direct reservations. Guests can seamlessly check real-time availability and book rooms, while hotel staff and ownership utilize dedicated admin dashboards to control daily operations, handle reviews, and oversee high-level business performance.",
    storyFrame: "A hospitality platform built around direct bookings.",
    visualSequence: ["Guest", "Availability", "Booking", "Staff dashboards", "Reviews"],
    tech: ["React", "Redux", "MongoDB", "Express", "Node", "Tailwind"],
    solutionHref: "/solutions/hotel-booking-business-solution-website-at-hyderabad",
    solutionCta: "Hospitality systems",
    metrics: [
      { label: "OTA commission avoided on direct bookings", value: "25%", basis: "estimated" },
    ],
    accent: "56,189,248",
    gradient: "from-sky-500/20 via-cyan-500/10 to-transparent",
  },
  {
    id: "arogyadiet",
    image: "/ArogyaDiet.jpg",
    tag: "Health & Delivery Platform",
    headline: "ArogyaDiet Ecosystem",
    description:
      "A complete end-to-end food delivery and subscription platform. Features interconnected portals for Customers to manage meal plans, a native Rider app for live delivery tracking, and powerful Master Admin & Franchise dashboards to seamlessly oversee all daily operations and logistics.",
    storyFrame: "A business that needed its operations connected.",
    visualSequence: [
      "Customer",
      "Subscription",
      "Rider",
      "Franchise",
      "Admin",
      "Payments",
      "Delivery",
    ],
    category: "Applications & Business Software",
    solutionHref: "/solutions/online-delivery-business-solution-website-at-hyderabad",
    solutionCta: "See how we build delivery systems",
    tech: ["Next.js", "Stripe", "TypeScript", "Tailwind", "Supabase"],
    metrics: [
      { label: "Manual dispatch coordination time cut", value: "~30%", basis: "estimated" },
    ],
    accent: "16,185,129",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
  {
    id: "best100movies",
    image: "/movieDB.png",
    tag: "SEO Content Platform",
    headline: "Best100Movies - Dynamic Media Hub",
    description:
      "A high-performance entertainment portal engineered to capture organic search traffic through programmatic SEO. It automatically aggregates thousands of real-time movie records via external APIs, while empowering site owners with a seamless headless CMS to effortlessly curate featured content.",
    tech: ["Next.js", "Sanity CMS", "TMDB API", "Tailwind", "Programmatic SEO"],
    solutionHref: "/services/programmatic-seo",
    solutionCta: "Programmatic SEO work",
    metrics: [
      { label: "Programmatically indexed movie pages", value: "1,000+", basis: "estimated" },
    ],
    accent: "139,92,246",
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
  },
  {
    /*
     * R6 — NeoDent. Owner-supplied real screenshot (`/Neodent.jpg`) plus
     * owner-approved neutral copy; this record satisfies the evidence gate
     * that previously kept NeoDent out of the homepage (`homepage-data.ts`).
     * Deliberately NO tech list and NO metrics: no verified stack record or
     * outcome figures exist, and nothing may be invented. `[OWNER INPUT
     * REQUIRED]` to add both later — the components must keep rendering
     * this story correctly while those arrays stay empty.
     */
    id: "neodent",
    image: "/Neodent.jpg",
    tag: "Healthcare",
    headline: "NeoDent Dental Hospitals",
    description:
      "A real dental hospital business with a physical practice and a growing patient base. NeoDent needed what every healthcare business needs online: a presence that presents the brand professionally, explains the services clearly, and gives patients a trustworthy place to enquire. We shaped the brand presentation and built the website around it.",
    storyFrame: "A real healthcare business, brought into a stronger digital presence.",
    visualSequence: ["Brand", "Website", "Trust", "Enquiry"],
    category: "Brand & Digital Presence",
    solutionHref: "/solutions/dental-hospital-business-solution-website-at-hyderabad",
    solutionCta: "See the Dental & Medical solution",
    tech: [],
    metrics: [],
    accent: "14,116,144",
    gradient: "from-cyan-500/20 via-teal-500/10 to-transparent",
  },
];
