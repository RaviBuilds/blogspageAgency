import {
  Bike,
  Hotel,
  PawPrint,
  Briefcase,
  GraduationCap,
  Dumbbell,
  Stethoscope,
  ShoppingCart,
  Layers,
  FileText,
  type LucideIcon,
} from "lucide-react";

/**
 * Default geographic target for the local-SEO routing engine.
 * The blueprint defines the slug pattern as:
 *   /[business-niche]-...-business-solution-website-at-[city]
 * Keep this centralized so it can later be driven dynamically per city.
 */
export const DEFAULT_CITY = "hyderabad";

export type Niche = {
  /** Stable internal id from the blueprint vertical matrix. */
  id: string;
  /** Short label used in the bento card heading. */
  title: string;
  /** One-line value proposition (elevated from blueprint copy). */
  description: string;
  /** Core focus / conversion angle from the matrix. */
  focus: string;
  icon: LucideIcon;
  /** Tailwind grid span classes that build the bento rhythm. */
  className: string;
  /** Whether the card gets the larger featured treatment. */
  featured?: boolean;
  /**
   * Builds the canonical, SEO-optimized solution route.
   * Lowercased, hyphenated, special chars stripped (per SEO rules).
   */
  href: (city?: string) => string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const route = (template: string) => (city: string = DEFAULT_CITY) =>
  `/solutions/${slugify(template.replace("[city]", city))}`;

/**
 * The 10 Business Vertical Matrix (agency-context-blueprint.md §4).
 * Slug templates mirror the blueprint exactly so routing stays deterministic.
 */
export const NICHES: Niche[] = [
  {
    id: "online-delivery",
    title: "Online Delivery",
    focus: "Third-party disintermediation",
    description:
      "Escape 25-30% aggregator commissions with a white-label ordering app and a live driver-tracking dispatch.",
    icon: Bike,
    href: route("online-delivery-business-solution-website-at-[city]"),
    className: "md:col-span-2 md:row-span-2",
    featured: true,
  },
  {
    id: "hotel-booking",
    title: "Hotel Booking",
    focus: "OTA fee mitigation",
    description:
      "Reclaim margin from global OTAs with direct booking, a live room matrix, and multi-role staff scheduling.",
    icon: Hotel,
    href: route("hotel-booking-business-solution-website-at-[city]"),
    className: "md:col-span-1 md:row-span-2",
  },
  {
    id: "pet-care",
    title: "Pet Care",
    focus: "Fragmented service booking",
    description:
      "A unified pet medical and lifestyle reservation wizard that ends scattered, fragmented bookings.",
    icon: PawPrint,
    href: route("pet-cares-online-business-solution-website-at-[city]"),
    className: "md:col-span-1",
  },
  {
    id: "consulting",
    title: "Consulting",
    focus: "High-value inbound authority",
    description:
      "Convert authority into pipeline with an embedded ROI discovery calculator built for high-value inbound.",
    icon: Briefcase,
    href: route("consulting-firm-business-solution-website-at-[city]"),
    className: "md:col-span-2",
  },
  {
    id: "education",
    title: "Education",
    focus: "Engagement & retention",
    description:
      "An interactive syllabus builder and progressive player engineered for engagement and retention.",
    icon: GraduationCap,
    href: route("educational-platform-business-solution-website-at-[city]"),
    className: "md:col-span-1",
  },
  {
    id: "gym-fitness",
    title: "Gym & Fitness",
    focus: "Churn defense & retention",
    description:
      "Defend against churn with a dynamic pause-credit engine that recalculates contracts in real time.",
    icon: Dumbbell,
    href: route("gym-business-solution-website-at-[city]"),
    className: "md:col-span-1 md:row-span-2",
  },
  {
    id: "dental-medical",
    title: "Dental & Medical",
    focus: "Frictionless patient pipeline",
    description:
      "A HIPAA-aligned calendar orchestration view that removes friction from the patient booking pipeline.",
    icon: Stethoscope,
    href: route("dental-hospital-business-solution-website-at-[city]"),
    className: "md:col-span-1",
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    focus: "Frictionless transactions",
    description:
      "Optimized multi-step checkouts engineered to keep transaction pipelines fast and frictionless.",
    icon: ShoppingCart,
    href: route("product-selling-online-ecommerce-website-at-[city]"),
    className: "md:col-span-1",
  },
  {
    id: "saas-platform",
    title: "SaaS Platforms",
    focus: "Recurring subscription models",
    description:
      "Tiered pricing toggles and a metered-usage simulator built for recurring subscription revenue.",
    icon: Layers,
    href: route("subscription-saas-business-website-at-[city]"),
    className: "md:col-span-1",
  },
  {
    id: "seo-blogs",
    title: "SEO Blogs",
    focus: "Core Web Vital preservation",
    description:
      "An instant edge-delivery MDX reading canvas that preserves Core Web Vitals at scale.",
    icon: FileText,
    href: route("seo-enabled-blogs-website-at-[city]"),
    className: "md:col-span-2",
  },
];
