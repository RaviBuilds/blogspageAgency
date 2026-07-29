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
};

export const projects: FeaturedProject[] = [
  {
    id: "phixl-ai",
    image: "/phixlAI.jpg",
    tag: "AI-Powered SaaS",
    headline: "Phixl AI - Photo Restoration Platform",
    description:
      "A fully monetized generative AI platform that breathes new life into damaged photographs. Features a scalable user credit system with free-tier onboarding, seamless Razorpay checkout for credit top-ups, and instant, high-fidelity image processing.",
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
    tech: ["React", "Redux", "MongoDB", "Express", "Node", "Tailwind"],
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
    metrics: [
      { label: "Programmatically indexed movie pages", value: "1,000+", basis: "estimated" },
    ],
    accent: "139,92,246",
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
  },
];
