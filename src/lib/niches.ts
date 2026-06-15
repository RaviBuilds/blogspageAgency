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

export type NicheDashboard = {
  title: string;
  description: string;
};

export type NicheMetric = {
  /** The headline figure, e.g. "30%" or "<1.2s". */
  value: string;
  /** What the figure represents. */
  label: string;
};

export type LaunchPhase = {
  /** Day range, e.g. "Days 1-2". */
  window: string;
  title: string;
  detail: string;
};

export type CaseStudy = {
  /** Project headline. */
  title: string;
  /** Technologies in the delivered architecture. */
  stack: string[];
  /** Production-grade technical narrative. */
  narrative: string;
  /** Measurable outcomes. */
  outcomes: string[];
};

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
   * The canonical slug template from the blueprint, with the [city] token.
   * This is the single source of the SEO routing contract.
   */
  slugTemplate: string;
  /** Short SEO sentence reused in the solution-page local CTA. */
  seoLabel: string;
  hero: {
    headline: string;
    subhead: string;
  };
  problem: {
    heading: string;
    lead: string;
    points: string[];
  };
  solution: {
    heading: string;
    lead: string;
    capabilities: string[];
  };
  dashboards: NicheDashboard[];
  /** Localized conversion metrics shown on the solution page. */
  metrics: NicheMetric[];
  /** Step-by-step 10-15 day launch schedule. */
  launchSchedule: LaunchPhase[];
  /** Optional real-world case study narrative. */
  caseStudy?: CaseStudy;
  /**
   * Builds the canonical, SEO-optimized solution route.
   * Lowercased, hyphenated, special chars stripped (per SEO rules).
   */
  href: (city?: string) => string;
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

/** Resolve a niche's full slug for a given city. */
export const nicheSlug = (niche: Niche, city: string = DEFAULT_CITY) =>
  slugify(niche.slugTemplate.replace("[city]", city));

type NicheSeed = Omit<Niche, "href" | "metrics" | "launchSchedule">;

/**
 * The 10 Business Vertical Matrix (agency-context-blueprint.md §4).
 * Slug templates mirror the blueprint exactly so routing stays deterministic.
 */
const NICHE_SEEDS: NicheSeed[] = [
  {
    id: "online-delivery",
    title: "Online Delivery",
    focus: "Third-party disintermediation",
    description:
      "Escape 25-30% aggregator commissions with a white-label ordering app and a live driver-tracking dispatch.",
    icon: Bike,
    slugTemplate: "online-delivery-business-solution-website-at-[city]",
    seoLabel:
      "Commission-free online delivery and dispatch software, engineered for local operators.",
    className: "md:col-span-2 md:row-span-2",
    featured: true,
    hero: {
      headline: "Own your delivery channel. Keep every rupee of margin.",
      subhead:
        "A high-speed progressive web app with absolute white-label dispatch, so you stop renting your customers from aggregators.",
    },
    problem: {
      heading: "Aggregators take 25-30% of every order, and your customers.",
      lead: "Marketplace commissions erode margin while you lose all retention control and courier coordination.",
      points: [
        "Extreme aggregator commission structures of 25-30% on every single order.",
        "Zero user retention control — the customer belongs to the platform, not you.",
        "Uncoordinated courier coordination across disconnected, manual tools.",
      ],
    },
    solution: {
      heading: "A white-label ordering and dispatch system you fully own.",
      lead: "Direct checkout optimization paired with a real-time dispatch map so orders and drivers stay coordinated in one place.",
      capabilities: [
        "Commission Avoidance Calculator tracking lifetime savings vs. aggregators.",
        "Real-time delivery dispatch map simulator using secure server-sent events.",
        "Direct checkout optimization that keeps the customer relationship yours.",
        "White-label branding across web and Capacitor-wrapped native apps.",
      ],
    },
    dashboards: [
      {
        title: "Live dispatch map",
        description:
          "Track every active courier and order in real time with server-sent event updates.",
      },
      {
        title: "Commission savings ledger",
        description:
          "See aggregate lifetime savings versus commercial aggregators at a glance.",
      },
    ],
  },
  {
    id: "hotel-booking",
    title: "Hotel Booking",
    focus: "OTA fee mitigation",
    description:
      "Reclaim margin from global OTAs with direct booking, a live room matrix, and multi-role staff scheduling.",
    icon: Hotel,
    slugTemplate: "hotel-booking-business-solution-website-at-[city]",
    seoLabel:
      "Commission-free hotel booking and property management software for local properties.",
    className: "md:col-span-1 md:row-span-2",
    hero: {
      headline: "Win direct bookings. End the OTA commission drain.",
      subhead:
        "A multi-tiered booking and property management system with a real-time room matrix and role-based access.",
    },
    problem: {
      heading: "OTAs and disconnected tools quietly drain your profit.",
      lead: "Over-reliance on global marketplaces plus manual operations creates leakage and sync errors.",
      points: [
        "Over-reliance on global OTAs that take a heavy cut of every booking.",
        "Inventory synchronization race conditions that cause double-bookings.",
        "Disconnected internal operational tools across front desk and management.",
      ],
    },
    solution: {
      heading: "One system for bookings, rooms, payments, guests, and staff.",
      lead: "A multi-tiered secure dashboard split by permission — Global Admin, Property Manager, Frontdesk Staff, and Verified Guest.",
      capabilities: [
        "Atomic room allocation that eliminates sync race conditions.",
        "Real-time multi-role scheduling and a live room matrix map.",
        "Direct booking engine that keeps revenue out of OTA hands.",
        "Permission-split access for admins, managers, front desk, and guests.",
      ],
    },
    dashboards: [
      {
        title: "Live room matrix",
        description:
          "A real-time availability grid with atomic allocation across every booking channel.",
      },
      {
        title: "Multi-role operations",
        description:
          "Permission-aware views for global admin, property manager, front desk, and guests.",
      },
    ],
  },
  {
    id: "pet-care",
    title: "Pet Care",
    focus: "Fragmented service booking",
    description:
      "A unified pet medical and lifestyle reservation wizard that ends scattered, fragmented bookings.",
    icon: PawPrint,
    slugTemplate: "pet-cares-online-business-solution-website-at-[city]",
    seoLabel:
      "Unified pet care booking software covering medical and lifestyle services.",
    className: "md:col-span-1",
    hero: {
      headline: "Every pet service, booked in one place.",
      subhead:
        "A unified medical and lifestyle reservation wizard that replaces scattered, fragmented booking flows.",
    },
    problem: {
      heading: "Pet owners juggle a dozen disconnected booking flows.",
      lead: "Fragmented service booking pushes owners to competitors and leaves revenue on the table.",
      points: [
        "Medical, grooming, boarding, and lifestyle bookings live in separate systems.",
        "No single record of a pet's history across services.",
        "Manual scheduling creates gaps, double-bookings, and no-shows.",
      ],
    },
    solution: {
      heading: "A unified reservation wizard for every pet service.",
      lead: "One guided flow that books medical and lifestyle services against a single, shared pet profile.",
      capabilities: [
        "Unified pet medical and lifestyle reservation wizard.",
        "Single shared pet profile and service history.",
        "Smart scheduling that prevents gaps and double-bookings.",
        "Automated reminders to cut no-shows.",
      ],
    },
    dashboards: [
      {
        title: "Reservation wizard",
        description:
          "A guided multi-step flow booking medical and lifestyle services in one pass.",
      },
      {
        title: "Unified pet profile",
        description:
          "A single record of every booking, visit, and service across the business.",
      },
    ],
  },
  {
    id: "consulting",
    title: "Consulting",
    focus: "High-value inbound authority",
    description:
      "Convert authority into pipeline with an embedded ROI discovery calculator built for high-value inbound.",
    icon: Briefcase,
    slugTemplate: "consulting-firm-business-solution-website-at-[city]",
    seoLabel:
      "High-authority consulting websites with embedded ROI discovery tools.",
    className: "md:col-span-2",
    hero: {
      headline: "Turn authority into a qualified inbound pipeline.",
      subhead:
        "An embedded ROI discovery calculator that converts high-intent visitors into booked discovery calls.",
    },
    problem: {
      heading: "Expertise is hard to monetize without a conversion path.",
      lead: "High-value inbound traffic arrives, but there is no tool to qualify and convert it.",
      points: [
        "Authority content attracts visitors but no structured conversion mechanism.",
        "High-value leads are qualified manually, slowly, and inconsistently.",
        "No quantified ROI story to anchor a premium engagement.",
      ],
    },
    solution: {
      heading: "An ROI discovery calculator at the heart of the funnel.",
      lead: "Visitors self-qualify by modelling their own ROI, arriving at a call already convinced.",
      capabilities: [
        "Embedded ROI discovery calculator tuned to your engagement model.",
        "Lead capture wired directly to your discovery-call pipeline.",
        "Authority-first content architecture for high-value inbound.",
        "Quantified, shareable ROI outputs that anchor premium pricing.",
      ],
    },
    dashboards: [
      {
        title: "ROI discovery calculator",
        description:
          "An interactive model that lets prospects quantify the value of working with you.",
      },
      {
        title: "Inbound lead pipeline",
        description:
          "A clean view of qualified inbound leads and their projected engagement value.",
      },
    ],
  },
  {
    id: "education",
    title: "Education",
    focus: "Engagement & retention",
    description:
      "An interactive syllabus builder and progressive player engineered for engagement and retention.",
    icon: GraduationCap,
    slugTemplate: "educational-platform-business-solution-website-at-[city]",
    seoLabel:
      "Interactive educational platforms engineered for learner engagement and retention.",
    className: "md:col-span-1",
    hero: {
      headline: "Keep learners engaged from first lesson to last.",
      subhead:
        "An interactive syllabus builder and progressive player designed to maximize completion and retention.",
    },
    problem: {
      heading: "Learners enroll, then quietly disengage.",
      lead: "Static content and rigid structure drive drop-off before learners reach the outcome.",
      points: [
        "Flat, static course content fails to hold attention.",
        "No progressive structure to guide learners forward.",
        "Low completion rates undermine reputation and referrals.",
      ],
    },
    solution: {
      heading: "An interactive, progressive learning experience.",
      lead: "A syllabus builder plus a progressive player that adapts pacing and keeps momentum high.",
      capabilities: [
        "Interactive syllabus builder for fast course assembly.",
        "Progressive player that paces content for retention.",
        "Progress tracking that surfaces at-risk learners early.",
        "Engagement mechanics that lift completion rates.",
      ],
    },
    dashboards: [
      {
        title: "Syllabus builder",
        description:
          "Assemble interactive courses from modular lessons in a visual builder.",
      },
      {
        title: "Learner progress",
        description:
          "Monitor engagement and completion, with early signals for at-risk learners.",
      },
    ],
  },
  {
    id: "gym-fitness",
    title: "Gym & Fitness",
    focus: "Churn defense & retention",
    description:
      "Defend against churn with a dynamic pause-credit engine that recalculates contracts in real time.",
    icon: Dumbbell,
    slugTemplate: "gym-business-solution-website-at-[city]",
    seoLabel:
      "Gym and fitness platforms with a dynamic pause-credit retention engine.",
    className: "md:col-span-1 md:row-span-2",
    hero: {
      headline: "Defend membership revenue against churn.",
      subhead:
        "A dynamic pause-credit engine that lets members freeze fairly while protecting your contract value.",
    },
    problem: {
      heading: "Churn and seasonal dips erode recurring revenue.",
      lead: "Rigid contracts and fragmented systems push members to cancel instead of pausing.",
      points: [
        "High subscription churn and seasonal attendance drops.",
        "Friction in handling member pauses pushes cancellations.",
        "Fragmented internal systems across packages, app, and accounting.",
      ],
    },
    solution: {
      heading: "A unified ecosystem with a pause-credit engine at its core.",
      lead: "A high-conversion interface linked to an admin panel bridging packages, mobile engagement, and accounting.",
      capabilities: [
        "Dynamic Pause-Credit Engine that recalculates expiry in real time.",
        "Each active pause day injects an extension record into the ledger.",
        "Capacitor native bridge for QR check-ins and re-engagement alerts.",
        "Live floor occupancy and conversion dashboards for owners.",
      ],
    },
    dashboards: [
      {
        title: "Pause-credit ledger",
        description:
          "Real-time contract recalculation as members freeze and resume their plans.",
      },
      {
        title: "Floor occupancy",
        description:
          "Live attendance, conversion uplift, and lead-capture widgets in one view.",
      },
    ],
  },
  {
    id: "dental-medical",
    title: "Dental & Medical",
    focus: "Frictionless patient pipeline",
    description:
      "A HIPAA-aligned calendar orchestration view that removes friction from the patient booking pipeline.",
    icon: Stethoscope,
    slugTemplate: "dental-hospital-business-solution-website-at-[city]",
    seoLabel:
      "HIPAA-aligned dental and medical booking platforms with calendar orchestration.",
    className: "md:col-span-1",
    hero: {
      headline: "A frictionless, compliant patient booking pipeline.",
      subhead:
        "A HIPAA-aligned calendar orchestration view that turns scattered scheduling into one clear pipeline.",
    },
    problem: {
      heading: "Patient scheduling is fragmented and compliance-sensitive.",
      lead: "Manual booking introduces friction, errors, and avoidable compliance risk.",
      points: [
        "Friction in the patient booking pipeline drives drop-off.",
        "Scheduling spread across phone, paper, and disconnected tools.",
        "Compliance-sensitive data handled without a structured system.",
      ],
    },
    solution: {
      heading: "A HIPAA-aligned calendar orchestration view.",
      lead: "One orchestrated calendar that coordinates practitioners, rooms, and patients with compliance built in.",
      capabilities: [
        "HIPAA-aligned calendar orchestration across practitioners and rooms.",
        "Frictionless self-service patient booking.",
        "Automated reminders that reduce no-shows.",
        "Structured, compliance-aware patient data handling.",
      ],
    },
    dashboards: [
      {
        title: "Calendar orchestration",
        description:
          "A unified, compliance-aware schedule across practitioners, rooms, and patients.",
      },
      {
        title: "Patient pipeline",
        description:
          "Track bookings from request to visit with automated reminders.",
      },
    ],
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    focus: "Frictionless transactions",
    description:
      "Optimized multi-step checkouts engineered to keep transaction pipelines fast and frictionless.",
    icon: ShoppingCart,
    slugTemplate: "product-selling-online-ecommerce-website-at-[city]",
    seoLabel:
      "High-conversion e-commerce websites with optimized multi-step checkout.",
    className: "md:col-span-1",
    hero: {
      headline: "Sell more by removing every checkout obstacle.",
      subhead:
        "Optimized multi-step checkouts engineered to keep your transaction pipeline fast and frictionless.",
    },
    problem: {
      heading: "Friction in the funnel quietly kills conversions.",
      lead: "Clunky checkouts and slow pipelines abandon carts that were ready to convert.",
      points: [
        "Multi-step checkouts that lose buyers at each added step.",
        "Slow, heavy storefronts that hurt conversion and Core Web Vitals.",
        "Disjointed payment and fulfillment flows.",
      ],
    },
    solution: {
      heading: "A frictionless, optimized transaction pipeline.",
      lead: "Streamlined multi-step checkout tuned for speed and completion across every device.",
      capabilities: [
        "Optimized multi-step checkout that minimizes drop-off.",
        "Fast, image-optimized storefront tuned for Core Web Vitals.",
        "Integrated payments and fulfillment in one pipeline.",
        "Capacitor-wrapped native apps from a single codebase.",
      ],
    },
    dashboards: [
      {
        title: "Checkout funnel",
        description:
          "Step-by-step conversion analytics that pinpoint where buyers drop off.",
      },
      {
        title: "Orders & fulfillment",
        description:
          "A single view of payments, orders, and fulfillment status.",
      },
    ],
  },
  {
    id: "saas-platform",
    title: "SaaS Platforms",
    focus: "Recurring subscription models",
    description:
      "Tiered pricing toggles and a metered-usage simulator built for recurring subscription revenue.",
    icon: Layers,
    slugTemplate: "subscription-saas-business-website-at-[city]",
    seoLabel:
      "Subscription SaaS platforms with tiered pricing and metered usage.",
    className: "md:col-span-1",
    hero: {
      headline: "Launch a subscription business that scales.",
      subhead:
        "Tiered pricing toggles and a metered-usage simulator built for predictable recurring revenue.",
    },
    problem: {
      heading: "Recurring revenue needs the right pricing machinery.",
      lead: "Without flexible tiers and metering, monetization stalls and growth plateaus.",
      points: [
        "No flexible tiered pricing to capture different segments.",
        "Usage is hard to meter, model, and bill accurately.",
        "Subscription lifecycle management is manual and brittle.",
      ],
    },
    solution: {
      heading: "Tiered pricing and metered usage, productized.",
      lead: "Pricing toggles and a usage simulator that make monetization legible to customers and to you.",
      capabilities: [
        "Tiered pricing toggles for monthly and annual plans.",
        "Metered-usage simulator that previews cost transparently.",
        "Subscription lifecycle automation on Supabase with RLS.",
        "Optimized relational indexing for fast billing queries.",
      ],
    },
    dashboards: [
      {
        title: "Pricing & tiers",
        description:
          "Configurable tier toggles with a live metered-usage simulator.",
      },
      {
        title: "Subscription metrics",
        description:
          "MRR, churn, and usage trends across your subscriber base.",
      },
    ],
  },
  {
    id: "seo-blogs",
    title: "SEO Blogs",
    focus: "Core Web Vital preservation",
    description:
      "An instant edge-delivery MDX reading canvas that preserves Core Web Vitals at scale.",
    icon: FileText,
    slugTemplate: "seo-enabled-blogs-website-at-[city]",
    seoLabel:
      "SEO-optimized, edge-delivered blog platforms that preserve Core Web Vitals.",
    className: "md:col-span-2",
    hero: {
      headline: "Publish content that ranks and loads instantly.",
      subhead:
        "An instant edge-delivery MDX reading canvas engineered to preserve Core Web Vitals at scale.",
    },
    problem: {
      heading: "Most blogs sacrifice speed for content, or rankings for both.",
      lead: "Heavy CMS stacks degrade Core Web Vitals and quietly suppress organic reach.",
      points: [
        "Bloated page weight that fails Core Web Vital targets.",
        "Slow, non-edge delivery that hurts both UX and rankings.",
        "Content tooling disconnected from performance discipline.",
      ],
    },
    solution: {
      heading: "An edge-delivered MDX reading canvas.",
      lead: "Instant, edge-cached delivery with a clean reading experience tuned for Core Web Vitals.",
      capabilities: [
        "Instant edge-delivery MDX reading canvas.",
        "Core Web Vital preservation as a first-class constraint.",
        "Edge-to-edge reading layout for premium readability.",
        "AVIF image strategy with explicit dimensioning for zero CLS.",
      ],
    },
    dashboards: [
      {
        title: "Reading canvas",
        description:
          "An edge-to-edge MDX layout optimized for readability and speed.",
      },
      {
        title: "Web Vitals monitor",
        description:
          "Track LCP, INP, and CLS against the blueprint's performance targets.",
      },
    ],
  },
];

/**
 * Deep enrichment keyed by niche id: localized conversion metrics and a
 * step-by-step 10-15 day launch schedule. Kept separate from the seed
 * objects so the core content model stays readable.
 *
 * NOTE: the blueprint (§5) only fully specifies Gym, Online Delivery, and a
 * truncated Hotel. The Gym schedule encodes the blueprint's exact
 * Pause-Credit mechanics; remaining figures/timelines are agency estimates
 * and should be replaced with verified numbers where available.
 */
const NICHE_ENRICHMENT: Record<
  string,
  { metrics: NicheMetric[]; launchSchedule: LaunchPhase[] }
> = {
  "online-delivery": {
    metrics: [
      { value: "0%", label: "Marketplace commission on direct orders" },
      { value: "25-30%", label: "Aggregator fee eliminated per order" },
      { value: "100%", label: "Customer data owned by you" },
    ],
    launchSchedule: [
      { window: "Days 1-2", title: "Discovery & menu modelling", detail: "Map catalogue, zones, and courier roster into the data model." },
      { window: "Days 3-6", title: "Ordering PWA build", detail: "White-label storefront with direct-checkout optimization." },
      { window: "Days 7-9", title: "Dispatch map & SSE", detail: "Real-time driver tracking via secure server-sent events." },
      { window: "Days 10-12", title: "Payments & savings calculator", detail: "Local gateway plus the commission-avoidance ledger." },
      { window: "Days 13-15", title: "Launch & native wrap", detail: "QA, Capacitor iOS/Android wrap, and go-live." },
    ],
  },
  "hotel-booking": {
    metrics: [
      { value: "0%", label: "OTA commission on direct bookings" },
      { value: "4", label: "Permission-split access roles" },
      { value: "0", label: "Double-bookings via atomic allocation" },
    ],
    launchSchedule: [
      { window: "Days 1-2", title: "Property & rate modelling", detail: "Room types, rate plans, and role permissions." },
      { window: "Days 3-6", title: "Booking engine", detail: "Direct booking flow with atomic room allocation." },
      { window: "Days 7-9", title: "Room matrix & scheduling", detail: "Live availability grid and multi-role scheduling." },
      { window: "Days 10-12", title: "Payments & guest comms", detail: "Deposits, full payment, and automated notifications." },
      { window: "Days 13-15", title: "Launch & handover", detail: "Staff onboarding, QA, and go-live." },
    ],
  },
  "pet-care": {
    metrics: [
      { value: "1", label: "Unified profile per pet" },
      { value: "100%", label: "Services bookable in one flow" },
      { value: "↓", label: "No-shows via automated reminders" },
    ],
    launchSchedule: [
      { window: "Days 1-2", title: "Service & profile modelling", detail: "Medical and lifestyle services against a shared pet record." },
      { window: "Days 3-6", title: "Reservation wizard", detail: "Guided multi-step booking flow build." },
      { window: "Days 7-9", title: "Scheduling engine", detail: "Conflict-free slots and provider calendars." },
      { window: "Days 10-12", title: "Reminders & payments", detail: "Automated reminders and deposit collection." },
      { window: "Days 13-14", title: "Launch", detail: "QA and go-live." },
    ],
  },
  consulting: {
    metrics: [
      { value: "1", label: "ROI calculator at funnel core" },
      { value: "↑", label: "Qualified discovery calls booked" },
      { value: "24h", label: "Inbound lead response window" },
    ],
    launchSchedule: [
      { window: "Days 1-2", title: "Positioning & ROI logic", detail: "Define the engagement model and ROI inputs." },
      { window: "Days 3-6", title: "Authority site build", detail: "Content-first architecture for high-value inbound." },
      { window: "Days 7-9", title: "ROI calculator", detail: "Embedded interactive discovery calculator." },
      { window: "Days 10-12", title: "Pipeline wiring", detail: "Lead capture to discovery-call pipeline." },
      { window: "Days 13-14", title: "Launch", detail: "QA and go-live." },
    ],
  },
  education: {
    metrics: [
      { value: "↑", label: "Course completion rate" },
      { value: "1", label: "Builder for all courses" },
      { value: "Early", label: "At-risk learner detection" },
    ],
    launchSchedule: [
      { window: "Days 1-3", title: "Curriculum modelling", detail: "Course structure and progression rules." },
      { window: "Days 4-7", title: "Syllabus builder", detail: "Interactive modular course assembly." },
      { window: "Days 8-11", title: "Progressive player", detail: "Adaptive pacing and progress tracking." },
      { window: "Days 12-14", title: "Engagement & analytics", detail: "Retention mechanics and at-risk signals." },
      { window: "Day 15", title: "Launch", detail: "QA and go-live." },
    ],
  },
  "gym-fitness": {
    metrics: [
      { value: "↓", label: "Cancellations via pause-credit" },
      { value: "Real-time", label: "Contract expiry recalculation" },
      { value: "QR", label: "Native gym-floor check-ins" },
    ],
    launchSchedule: [
      { window: "Days 1-2", title: "Membership & ledger schema", detail: "membership_ledger with accumulated_pause_days modelling." },
      { window: "Days 3-6", title: "Client interface", detail: "High-conversion signup and package selection." },
      { window: "Days 7-9", title: "Pause-Credit Engine", detail: "Each pause day injects an extension record, recalculating expiry in real time." },
      { window: "Days 10-12", title: "Capacitor native bridge", detail: "Biometric re-engagement alerts and QR floor check-ins." },
      { window: "Days 13-15", title: "Owner dashboards & launch", detail: "Live occupancy and conversion widgets, then go-live." },
    ],
  },
  "dental-medical": {
    metrics: [
      { value: "HIPAA", label: "Aligned data handling" },
      { value: "↓", label: "No-shows via reminders" },
      { value: "1", label: "Orchestrated calendar" },
    ],
    launchSchedule: [
      { window: "Days 1-2", title: "Practice & compliance modelling", detail: "Practitioners, rooms, and compliance rules." },
      { window: "Days 3-6", title: "Booking pipeline", detail: "Frictionless self-service patient booking." },
      { window: "Days 7-9", title: "Calendar orchestration", detail: "Unified, compliance-aware scheduling view." },
      { window: "Days 10-12", title: "Reminders & records", detail: "Automated reminders and structured data handling." },
      { window: "Days 13-14", title: "Launch", detail: "QA and go-live." },
    ],
  },
  ecommerce: {
    metrics: [
      { value: "↑", label: "Checkout completion rate" },
      { value: "<1.2s", label: "Target LCP on storefront" },
      { value: "1", label: "Codebase for web + native" },
    ],
    launchSchedule: [
      { window: "Days 1-2", title: "Catalogue & checkout modelling", detail: "Products, variants, and checkout steps." },
      { window: "Days 3-6", title: "Storefront build", detail: "Image-optimized, Core Web Vitals-tuned storefront." },
      { window: "Days 7-9", title: "Optimized checkout", detail: "Streamlined multi-step checkout." },
      { window: "Days 10-12", title: "Payments & fulfillment", detail: "Integrated payments and fulfillment pipeline." },
      { window: "Days 13-15", title: "Native wrap & launch", detail: "Capacitor wrap, QA, and go-live." },
    ],
  },
  "saas-platform": {
    metrics: [
      { value: "Tiered", label: "Pricing toggles" },
      { value: "Metered", label: "Usage simulation" },
      { value: "RLS", label: "Row-level security on Supabase" },
    ],
    launchSchedule: [
      { window: "Days 1-3", title: "Pricing & data modelling", detail: "Tiers, metering, and RLS-secured schema." },
      { window: "Days 4-7", title: "Subscription core", detail: "Lifecycle automation and billing logic." },
      { window: "Days 8-11", title: "Pricing toggles & simulator", detail: "Tier toggles and metered-usage simulator." },
      { window: "Days 12-14", title: "Metrics dashboard", detail: "MRR, churn, and usage analytics." },
      { window: "Day 15", title: "Launch", detail: "QA and go-live." },
    ],
  },
  "seo-blogs": {
    metrics: [
      { value: "<1.2s", label: "Target LCP" },
      { value: "0.00", label: "Target CLS" },
      { value: "Edge", label: "Cached delivery" },
    ],
    launchSchedule: [
      { window: "Days 1-2", title: "Content model", detail: "MDX schema and reading-canvas layout." },
      { window: "Days 3-6", title: "Reading canvas", detail: "Edge-to-edge MDX reading experience." },
      { window: "Days 7-9", title: "Edge delivery", detail: "Edge caching and AVIF image strategy." },
      { window: "Days 10-12", title: "Web Vitals hardening", detail: "LCP/INP/CLS budgets enforced." },
      { window: "Days 13-14", title: "Launch", detail: "QA and go-live." },
    ],
  },
};

/**
 * Real-world case studies keyed by niche id. Only a subset of niches carry
 * one; the rest render without a case-study section.
 */
const NICHE_CASE_STUDIES: Record<string, CaseStudy> = {
  "hotel-booking": {
    title: "Commission-free multi-property booking platform",
    stack: ["MongoDB", "Express", "React", "Node.js", "JWT"],
    narrative:
      "A MERN-stack platform delivering role-based dashboards across four permission tiers (Global Admin, Property Manager, Front-desk Staff, Verified Guest) with multi-tenant isolation so each property only ever sees its own inventory. Automated transaction workflows handle deposits, confirmations, and refunds end to end, routing bookings through the property's own gateway to mitigate OTA fees on every direct reservation.",
    outcomes: [
      "Direct bookings processed with zero marketplace commission.",
      "Four-tier RBAC with strict multi-tenant data isolation.",
      "Automated deposit, confirmation, and refund workflows.",
    ],
  },
  "saas-platform": {
    title: "AI photo restoration pipeline",
    stack: ["Next.js", "Replicate API", "Serverless Functions", "Postgres"],
    narrative:
      "A Next.js application integrated with the Replicate API to run historical photo-restoration models. Uploads trigger serverless inference jobs, and a serverless database tracks each job's state (queued, processing, complete, failed) so the UI can poll and resume reliably without holding long-lived connections. Restored assets are streamed back and cached at the edge for instant re-delivery.",
    outcomes: [
      "Replicate-powered restoration pipeline with resumable job state.",
      "Serverless inference that scales to zero between requests.",
      "Edge-cached output for instant re-delivery.",
    ],
  },
  ecommerce: {
    title: "Headless WordPress B2B catalog",
    stack: ["Next.js", "Headless WordPress", "WPGraphQL", "ISR"],
    narrative:
      "A decoupled architecture where WordPress serves purely as a content and catalog backend over GraphQL, while a high-speed Next.js front end renders the product showcase. Incremental Static Regeneration keeps catalog pages statically fast yet current, separating editorial workflows from the storefront performance budget so content teams move freely without degrading Core Web Vitals.",
    outcomes: [
      "Decoupled headless WordPress backend over WPGraphQL.",
      "Statically-fast Next.js catalog with ISR freshness.",
      "Editorial workflow isolated from storefront performance.",
    ],
  },
};

export const NICHES: Niche[] = NICHE_SEEDS.map((seed) => ({
  ...seed,
  ...NICHE_ENRICHMENT[seed.id],
  caseStudy: NICHE_CASE_STUDIES[seed.id],
  href: (city: string = DEFAULT_CITY) => `/solutions/${nicheSlug(seed as Niche, city)}`,
}));

/**
 * Resolve a niche + city from a full canonical slug.
 * Returns null when no niche template matches (route should 404).
 */
export function getNicheBySlug(
  slug: string,
): { niche: Niche; city: string } | null {
  for (const niche of NICHES) {
    // Build a matcher from the slug template, capturing the city segment.
    const pattern = slugify(niche.slugTemplate).replace(
      "city",
      "(?<city>[a-z0-9-]+)",
    );
    const match = slug.match(new RegExp(`^${pattern}$`));
    if (match?.groups?.city) {
      return { niche, city: match.groups.city };
    }
  }
  return null;
}

/** All static params for the default city (used by generateStaticParams). */
export function allNicheParams(city: string = DEFAULT_CITY) {
  return NICHES.map((niche) => ({ slug: nicheSlug(niche, city) }));
}
