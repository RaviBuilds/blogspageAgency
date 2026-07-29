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

import {
  APPROVED_CITIES,
  findApprovedCity,
  type ApprovedCity,
} from "@/lib/cities";
import type { FaqPair } from "@/lib/structured-data";

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
   * At least three question-and-answer pairs rendered on the solution route
   * (Requirement 9.6). City-agnostic by design: the copy stays correct for
   * any future Approved_City_List addition without per-city templating.
   */
  faq: FaqPair[];
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
    faq: [
      {
        question: "How much commission does a white-label delivery platform save?",
        answer:
          "Most aggregators take 25-30% of every order, a cut that disappears entirely once orders route through your own branded app. Owners typically recover that margin within the first month of live orders, since the platform, dispatch, and payments all run on infrastructure you own rather than a marketplace you rent from.",
      },
      {
        question: "Can we keep using aggregators alongside our own delivery app?",
        answer:
          "Yes. Most operators run both during a transition period, steering repeat customers toward the owned app while aggregators still bring in new discovery traffic. The dispatch map and order pipeline handle both channels without extra staff, so the switch happens gradually instead of as a risky cutover.",
      },
      {
        question: "How does real-time driver tracking work without extra hardware?",
        answer:
          "Drivers use the same phone they already carry, running a lightweight app that streams location over secure server-sent events into the live dispatch map. No dedicated GPS units or extra hardware purchases are needed, and the tracking view updates for customers and staff at the same time.",
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
    faq: [
      {
        question: "How does a direct booking engine reduce OTA commission costs?",
        answer:
          "A direct booking engine lets guests reserve rooms straight through your own site, so the reservation never touches an OTA and its commission never gets deducted. The room matrix stays synchronized across every channel in real time, so direct bookings and OTA bookings draw from the same inventory without double-booking risk.",
      },
      {
        question: "What stops two channels from booking the same room at once?",
        answer:
          "Atomic room allocation locks a room the instant a booking is confirmed on any channel, so a second request for that same room and date range is rejected before it can create a conflict. This removes the sync race conditions that cause double-bookings when inventory is managed across disconnected systems.",
      },
      {
        question: "Can front-desk staff and property managers see different data?",
        answer:
          "Yes. The platform ships four permission tiers, Global Admin, Property Manager, Front-desk Staff, and Verified Guest, each seeing only the views and actions relevant to their role. A front-desk user can check guests in and out without touching billing configuration or cross-property reporting reserved for managers and admins.",
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
    faq: [
      {
        question:
          "How does a unified reservation wizard handle both medical and lifestyle bookings for the same pet?",
        answer:
          "The wizard walks an owner through one guided flow that reads from a single shared pet profile, so a vaccination appointment and a grooming slot both draw from the same record instead of two disconnected calendars. Staff see every upcoming booking for a pet in one view, which removes the double-entry and scheduling conflicts that come from running medical and lifestyle services on separate systems.",
      },
      {
        question:
          "Can pet owners see their pet's full service history in one place?",
        answer:
          "Yes. Every visit, whether medical, grooming, or boarding, is logged against a single unified pet profile that owners and staff can both reference. That gives a vet or groomer instant context on past treatments and preferences without calling around to other providers, and it gives owners one place to check what their pet has already had done.",
      },
      {
        question:
          "How does automated scheduling cut down on no-shows for pet services?",
        answer:
          "The system sends automated reminders ahead of every booked slot, whether it is a grooming appointment, a boarding check-in, or a medical visit, so owners are nudged before they forget. Combined with smart scheduling that avoids overlapping or conflicting slots, this keeps the calendar reliable and reduces the gaps and lost revenue that come from unconfirmed appointments.",
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
    faq: [
      {
        question:
          "How does an embedded ROI calculator help convert consulting website visitors?",
        answer:
          "An embedded ROI calculator lets a visitor plug in their own numbers and see a quantified projection of what your engagement could be worth to their business, rather than reading generic claims about expertise. That self-generated figure is a stronger reason to book a call than any testimonial, because the prospect arrives already convinced by a number they calculated themselves.",
      },
      {
        question:
          "Does the ROI calculator replace a discovery call, or lead into one?",
        answer:
          "It leads into one. The calculator is designed to qualify and warm up a visitor, producing a shareable, quantified output that anchors the conversation, but the discovery call is still where scope, fit, and pricing get finalized. Lead capture is wired directly into the calculator so a completed calculation routes straight into your booking pipeline.",
      },
      {
        question:
          "Can the calculator be tuned to different consulting engagement models?",
        answer:
          "Yes. The inputs and output formulas are configured around your specific engagement model, whether that is retainer-based, project-based, or outcome-based pricing, so the projected ROI reflects how you actually bill. This keeps the number credible to prospects instead of feeling like a generic, one-size-fits-all sales gimmick.",
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
    faq: [
      {
        question:
          "How does a progressive player improve course completion rates?",
        answer:
          "A progressive player paces content based on how a learner is actually moving through the material, rather than dumping an entire syllabus on them at once. That structure keeps momentum high by unlocking the next lesson at the right moment, which is what drives completion up compared to a flat list of static videos or PDFs learners have to self-pace through alone.",
      },
      {
        question:
          "What does the interactive syllabus builder let instructors do?",
        answer:
          "The syllabus builder lets an instructor assemble a course from modular lessons in a visual interface, reordering, grouping, and gating content without touching code. New courses go from outline to a published, interactive structure quickly, and existing courses can be restructured as an instructor learns what pacing actually works for their learners.",
      },
      {
        question:
          "How are at-risk learners identified before they drop off?",
        answer:
          "Progress tracking surfaces engagement signals, like stalled lessons or missed milestones, early enough that an instructor or support team can reach out before a learner disengages entirely. This turns retention from a lagging metric you discover after the fact into something you can act on while the learner is still reachable.",
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
    faq: [
      {
        question:
          "How does a pause-credit engine stop members from cancelling instead of pausing?",
        answer:
          "The pause-credit engine recalculates a membership's contract expiry in real time as a member freezes and resumes their plan, so a seasonal break extends the contract fairly instead of forcing a full cancellation. Each active pause day writes an extension record into the ledger, giving members an easy, transparent option that protects your recurring revenue instead of losing it outright.",
      },
      {
        question:
          "Can members check in and get alerts without extra hardware at the front desk?",
        answer:
          "Yes. A native mobile bridge handles QR check-ins on the member's own phone and pushes re-engagement alerts directly to them, so front-desk staff are not manually scanning cards or chasing down members who have gone quiet. This keeps check-in fast during busy hours and keeps at-risk members engaged before they lapse.",
      },
      {
        question:
          "What do gym owners see on their dashboard day to day?",
        answer:
          "Owners get a live view of floor occupancy, conversion uplift from lead-capture widgets, and the pause-credit ledger, all in one dashboard rather than scattered across separate tools. That gives a clear read on attendance patterns and revenue health without needing to cross-reference spreadsheets or ask staff for manual updates.",
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
      "Premium dental clinic websites with online booking, local SEO, and AI-powered patient growth.",
    className: "md:col-span-1",
    hero: {
      headline: "Get more patients walking through your door.",
      subhead:
        "A premium digital presence that builds trust, ranks on Google, and books appointments around the clock for dental clinics in Hyderabad.",
    },
    problem: {
      heading: "Your clinic is invisible to the patients searching for you.",
      lead: "Every day, patients within 5 kilometres of your clinic search for a dentist. They find whoever shows up first — and right now, that isn't you.",
      points: [
        "Patients search 'dentist near me' — your clinic doesn't appear in the top results.",
        "Your website looks outdated compared to newer clinics in the area.",
        "Phone-only booking means you lose every after-hours patient.",
        "No Google reviews visible means zero social proof for new patients.",
        "You have no idea which marketing channel actually brings patients through the door.",
      ],
    },
    solution: {
      heading: "Everything a premium dental clinic needs online.",
      lead: "A complete digital presence built for one purpose: turning local searchers into booked appointments.",
      capabilities: [
        "Premium website that positions your clinic as the trusted, modern choice.",
        "Online booking that fills your calendar while you sleep.",
        "Google-optimized pages that rank for 'dentist in your area'.",
        "Automated WhatsApp and SMS reminders that cut no-shows by up to 40%.",
        "Patient review system that builds your Google reputation.",
        "Analytics dashboard showing exactly where patients come from.",
        "AI chatbot answering common patient questions instantly.",
      ],
    },
    dashboards: [
      {
        title: "Patient booking flow",
        description:
          "What your patients see: a clean, fast, trustworthy booking experience that works on any device.",
      },
      {
        title: "Clinic command centre",
        description:
          "Your team's view: appointments, patient sources, review alerts, and revenue tracking in one place.",
      },
    ],
    faq: [
      {
        question: "How much does a dental clinic website cost?",
        answer:
          "Every clinic is different — a 2-chair practice has different needs than a multi-specialty clinic. Typical dental projects fall between ₹1.5L and ₹3.5L depending on scope, integrations, and the number of practitioners. We scope everything on a discovery call before quoting. The ROI math is simple: if your site generates even 2–3 extra patients per week, the investment pays for itself in the first month.",
      },
      {
        question: "I already have a website. Why do I need a new one?",
        answer:
          "Load your current site on your phone and time how long it takes. Then search 'dentist in your area' on Google and see where you appear. If your site takes more than 3 seconds to load or you are not in the top 5 results, your current website is actively losing you patients — driving them to competitors who invested in speed and visibility.",
      },
      {
        question: "How long until I see results?",
        answer:
          "Your site launches in 14 days. Online booking starts generating appointments immediately from day one. SEO results build over 30–90 days as Google indexes and ranks your pages. Our case study clinic saw enquiries triple within 60 days. This is not a 6-month wait — it compounds from week one.",
      },
      {
        question: "I don't have time to manage a website project.",
        answer:
          "You will not need to. Our process requires one 45-minute discovery call and one review session. We handle design, content, development, SEO setup, and launch. Your team gets a 30-minute training at handover. Total time investment from you: about 2 hours across 14 days.",
      },
      {
        question: "Do I own the website? What if I want to leave?",
        answer:
          "You own everything — code, design, content, domain, hosting account. There are no monthly platform fees, no lock-in contracts, no proprietary CMS you cannot leave. If you ever want to move away, you take everything with you. We build on open standards specifically so you are never dependent on us.",
      },
      {
        question: "How is this different from a ₹15,000 WordPress site?",
        answer:
          "A template WordPress site loads in 4–6 seconds, looks like every other dental site, has zero SEO engineering, and breaks every time a plugin updates. What we build loads in under 1.2 seconds, is custom-designed for your brand, is engineered for Google rankings from the architecture up, and requires zero plugin maintenance.",
      },
      {
        question: "What if it doesn't work? What's my risk?",
        answer:
          "Your risk is minimal. You see the design before we build. You approve before we launch. The 14-day timeline means you are not locked into a 6-month commitment with uncertain outcomes. And because you own everything, even in the unlikely event you are unsatisfied, you still have a production-grade website you can hand to any developer.",
      },
      {
        question: "Can you help with Google Ads too, or just organic?",
        answer:
          "We lead with organic search and Google Maps because those channels compound — every month gets stronger without increasing spend. Google Ads can layer on top once your conversion infrastructure is solid. Running ads to a slow, unconvincing website wastes money. We build the foundation first, then paid channels become significantly more effective.",
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
    faq: [
      {
        question:
          "How much does an optimized multi-step checkout actually improve conversion?",
        answer:
          "Every added checkout step is a point where a ready buyer can abandon the cart, so an optimized flow minimizes steps and removes friction like unnecessary account creation or unclear shipping costs. The checkout is also tuned for speed and Core Web Vitals, since a slow or janky checkout loses buyers just as reliably as a confusing one.",
      },
      {
        question:
          "Does a fast, image-optimized storefront affect search rankings too?",
        answer:
          "Yes. A storefront tuned for Core Web Vitals loads faster and feels more stable while scrolling, which is both a ranking factor and a direct driver of conversion, since slow pages lose buyers before they even see the product. Image optimization keeps product photos sharp without dragging down load times across the catalog.",
      },
      {
        question:
          "Can the same e-commerce codebase power a native mobile app too?",
        answer:
          "Yes. The storefront can be wrapped into native iOS and Android apps from the same codebase using Capacitor, so product data, checkout logic, and fulfillment stay in sync across web and app without maintaining two separate systems. That keeps mobile shoppers in a native-feeling experience without doubling the engineering workload.",
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
    faq: [
      {
        question:
          "How do tiered pricing toggles help a new SaaS product monetize different segments?",
        answer:
          "Tiered pricing toggles let prospects compare monthly and annual plans side by side and see exactly what each tier unlocks, which makes the pricing page itself a conversion tool instead of a static list. Different customer segments naturally sort themselves into the tier that fits their usage, which is harder to achieve with a single flat price.",
      },
      {
        question:
          "What does a metered-usage simulator actually show customers?",
        answer:
          "The simulator lets a prospective customer estimate their usage and see a transparent preview of what that usage would cost before they commit, removing the surprise-invoice concern that makes usage-based pricing feel risky. That transparency builds trust during the sales process and reduces billing disputes after signup.",
      },
      {
        question:
          "Is subscription billing and access control secure by default?",
        answer:
          "Yes. The subscription lifecycle runs on Supabase with row-level security enforced at the database layer, so a customer's data and billing state stay isolated from every other tenant without relying solely on application-level checks. Billing queries are also optimized with relational indexing, so performance holds up as the subscriber base grows.",
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
    faq: [
      {
        question:
          "Why does edge delivery matter more for a blog than for other website types?",
        answer:
          "A blog lives or dies on organic search traffic, and search rankings increasingly factor in Core Web Vitals like load speed and layout stability. Edge-delivered content reaches readers from a server close to them instead of a single distant origin, which keeps load times low even during a traffic spike from a post that suddenly ranks well.",
      },
      {
        question:
          "How does an MDX-based reading canvas avoid layout shift while loading images?",
        answer:
          "Every image ships with explicit width and height dimensions and uses the AVIF format, so the browser reserves the correct space before the image finishes loading instead of shifting text around it. That explicit dimensioning is what keeps cumulative layout shift near zero, which both readers and search rankings reward.",
      },
      {
        question:
          "Can a heavy CMS be replaced without losing content editing convenience?",
        answer:
          "Yes. The reading canvas is built to preserve Core Web Vitals as a first-class constraint while still giving editors a clean MDX-based authoring flow, so publishing does not require choosing between a good writer experience and a fast, rankable page. Performance discipline is enforced by the platform rather than left to each author's habits.",
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
      { value: "3x", label: "More patient enquiries" },
      { value: "40%", label: "Fewer no-shows" },
      { value: "24/7", label: "Online booking" },
      { value: "14", label: "Days to launch" },
    ],
    launchSchedule: [
      { window: "Days 1-2", title: "Discovery & clinic audit", detail: "A 45-minute call to learn your clinic, services, target patients, and competitive landscape." },
      { window: "Days 3-5", title: "Design & brand", detail: "Website look, feel, and content architecture. You review once and approve." },
      { window: "Days 6-9", title: "Build & integrate", detail: "Custom development: website, online booking, review integration, analytics, and SEO foundations." },
      { window: "Days 10-12", title: "Content, SEO & testing", detail: "Service pages written, Google Business optimized, reminders configured, full device testing." },
      { window: "Days 13-14", title: "Launch & handover", detail: "Go live. Team walkthrough, receptionist training, and complete ownership transfer." },
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
  "dental-medical": {
    title: "How a 4-chair clinic in Jubilee Hills went from 12 to 45 enquiries per week",
    stack: ["Next.js", "Vercel", "Supabase", "WhatsApp Business API"],
    narrative:
      "A multi-specialty dental clinic in Jubilee Hills had been open for three years with excellent care but a 5-year-old WordPress template invisible on Google and phone-only booking. Within 60 days of launching their new platform, organic search enquiries tripled and no-shows dropped by 38% through automated WhatsApp reminders.",
    outcomes: [
      "3.7x increase in weekly patient enquiries (12 → 45).",
      "Page 1 Google ranking for 5 target keywords within 60 days.",
      "38% reduction in no-shows via automated reminders.",
      "24/7 online booking generating 30% of new appointments.",
    ],
  },
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

/** A successful `/solutions/<slug>` resolution: a catalog entry plus an approved city. */
export type SolutionMatch = { niche: Niche; city: ApprovedCity };

/** Escape regex metacharacters in a literal slug fragment. */
const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Per-niche matcher built once from the slug template. The template is split on
 * the raw `[city]` token *before* slugification, so the placeholder can never
 * be confused with literal template text, and both surrounding fragments are
 * escaped. Fully anchored, with the city segment narrowed to `[a-z0-9-]+`.
 */
const NICHE_SLUG_MATCHERS: ReadonlyArray<{ niche: Niche; pattern: RegExp }> =
  NICHES.map((niche) => {
    const [rawPrefix, rawSuffix = ""] = niche.slugTemplate.split("[city]");
    const prefix = escapeRegExp(slugify(rawPrefix));
    const suffix = escapeRegExp(slugify(rawSuffix));
    return { niche, pattern: new RegExp(`^${prefix}([a-z0-9-]+)${suffix}$`) };
  });

/**
 * Resolve a `/solutions/<slug>` path segment to a Service_Catalog entry and an
 * Approved_City_List member.
 *
 * Pure and total: string in, `SolutionMatch` or `null` out. No I/O, no throw.
 *
 * Returns `null` when the slug matches no niche template and — the point of
 * this function — also when the captured city token is not approved. The
 * audited resolver captured the city as `[a-z0-9-]+` and returned it
 * unchecked, so every arbitrary token rendered a live, self-canonicalising,
 * indexable page (audit Finding F-01). Requirements 3.4 through 3.6 bound that
 * space to the catalog-by-approved-city cross product.
 */
export function resolveSolutionSlug(slug: string): SolutionMatch | null {
  // Requirement 3.4 matches the city token "after lowercasing", and the
  // templates are lowercase throughout, so normalise the whole segment once
  // rather than widening the pattern to accept mixed case.
  const normalised = slug.trim().toLowerCase();
  for (const { niche, pattern } of NICHE_SLUG_MATCHERS) {
    const captured = normalised.match(pattern)?.[1];
    if (!captured) continue;
    const city = findApprovedCity(captured);
    // A template match carrying an unapproved city is a 404, not a
    // fall-through: the literal fragments of the ten templates differ, so no
    // two of them can claim the same slug and there is nothing left to try.
    return city ? { niche, city } : null;
  }
  return null;
}

/**
 * Back-compatible alias of {@link resolveSolutionSlug}.
 *
 * The result shape changed with the bound resolver: `city` is now an
 * `ApprovedCity` record rather than the raw captured string, so callers read
 * `city.token` for the slug fragment and `city.displayName` for rendered copy.
 */
export const getNicheBySlug = resolveSolutionSlug;

/**
 * Every indexable solution route: the Service_Catalog crossed with the
 * Approved_City_List. Consumed by `generateStaticParams`, which together with
 * `dynamicParams = false` makes this set the entire served route space.
 */
export function allNicheParams(): { slug: string }[] {
  return NICHES.flatMap((niche) =>
    APPROVED_CITIES.map((city) => ({ slug: nicheSlug(niche, city.token) })),
  );
}
