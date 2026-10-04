/**
 * Content model for the gym solution page.
 *
 * Plain module (no React, no "use client") so server sections, client islands
 * and unit tests can all import it. Every list a section renders lives here, so
 * the page's claims can be checked in one place (`tests/unit/gym-content.spec.ts`).
 *
 * Copy rules for this file:
 * - no pricing or figures: pricing is discussed per gym;
 * - nothing that is not shipped is described as live (see `Status`);
 * - no invented testimonials, ratings counts, metrics or results;
 * - GBP, Search Console, analytics and local SEO are recommended, never required.
 */

/* -------------------------------------------------------------------------- */
/* Anchors & messages                                                         */
/* -------------------------------------------------------------------------- */

/** Pre-filled message for the "Show me what this could look like" CTAs. */
export const GYM_ENQUIRY_MESSAGE =
  "Hi BLOGSPAGE AI, I saw your gym website page and I'd like to see what this could look like for my gym.";

/** Pre-filled message for the "Get a quote" CTAs. */
export const GYM_QUOTE_MESSAGE =
  "Hi BLOGSPAGE AI, I'd like a quote for my gym's website and digital foundation. Can we talk about what my gym needs?";

/** Anchor the hero's planner link points at; the demo listens for it. */
export const PLANNER_ANCHOR = "plan-your-first-30-days";

/** Id of the final CTA section; the sticky mobile CTA hides while it is on screen. */
export const FINAL_CTA_ID = "start";

/** Id of the lifecycle section. */
export const LIFECYCLE_ID = "one-member-one-journey";

/** Id of the growth section the foundation's growth layer links to. */
export const ECOSYSTEM_ID = "ecosystem";

/**
 * The example enquiry used in the hero visual and the handoff section.
 * Deliberately makes no health or outcome claim.
 */
export const EXAMPLE_ENQUIRY =
  "Hi, I'm new to gyms and I'm looking to lose some weight. I saw your beginner program and wanted to know if I can visit before joining.";

export const EXAMPLE_REPLY =
  "Hi! Yes, you're welcome to visit. Would Saturday morning work for a walkthrough?";

/** Line under the final CTA. Pricing is intentionally not on this page. */
export const PRICING_NOTE =
  "Pricing depends on your gym's requirements; we share a quote after a short conversation.";

/* -------------------------------------------------------------------------- */
/* Status taxonomy                                                            */
/* -------------------------------------------------------------------------- */

/**
 * How honest the page is about each thing it shows.
 * - `required` / `recommended` / `included`: parts of the starting foundation.
 * - `demo`: works in the browser on this page, nothing is sent.
 * - `add-on`: available, scoped separately from the starting website.
 * - `concept`: broader direction, shown as a concept preview.
 */
export type Status = "required" | "recommended" | "included" | "demo" | "add-on" | "concept";

export const STATUS_LABEL: Record<Status, string> = {
  required: "Required",
  recommended: "Recommended",
  included: "Included",
  demo: "Working demo",
  "add-on": "Add-on · scoped separately",
  concept: "Concept",
};

/* -------------------------------------------------------------------------- */
/* 01 — Hero research trail                                                   */
/* -------------------------------------------------------------------------- */

export const HERO_SEARCH_QUERY = "beginner gym near me";

/* -------------------------------------------------------------------------- */
/* 02 — Before they walk in                                                   */
/* -------------------------------------------------------------------------- */

export type JourneyScreen =
  | "instagram"
  | "google"
  | "reviews"
  | "website"
  | "questions"
  | "whatsapp"
  | "team";

export const JOURNEY: { screen: JourneyScreen; name: string; line: string }[] = [
  { screen: "instagram", name: "Instagram", line: "Gets a feel for the culture" },
  { screen: "google", name: "Google", line: "Finds the options nearby" },
  { screen: "reviews", name: "Reviews", line: "Checks what members say" },
  { screen: "website", name: "Website", line: "Looks for the full picture" },
  { screen: "questions", name: "Questions", line: "Is this right for me?" },
  { screen: "whatsapp", name: "WhatsApp", line: "Reaches out" },
  { screen: "team", name: "Gym team", line: "Takes it from here" },
];

export const OLD_WAY = "Walk past. Walk in. Ask at the front desk.";
export const NEW_WAY = ["Search.", "Scroll.", "Compare.", "Message."] as const;
export const DISCOVERY_LEAD =
  "Many people search, scroll, read reviews and compare before they contact a gym, often before anyone there knows they exist.";

/**
 * Which journey step is "active" given each step's distance from the reading
 * line (`null` when the step is off screen). The closest visible step wins;
 * with nothing visible the previous index is kept.
 */
export function activeJourneyIndex(distances: (number | null)[], previous: number): number {
  let best = -1;
  let bestDistance = Number.POSITIVE_INFINITY;
  distances.forEach((d, i) => {
    if (d === null) return;
    const abs = Math.abs(d);
    if (abs < bestDistance) {
      bestDistance = abs;
      best = i;
    }
  });
  return best === -1 ? previous : best;
}

/* -------------------------------------------------------------------------- */
/* 03 — The questions                                                         */
/* -------------------------------------------------------------------------- */

/** `xl` is a dominant thought, `query` a quiet search-style pill. */
export type QuestionWeight = "xl" | "lg" | "md" | "query";

export const THEMES: {
  key: "fit" | "trust" | "practical" | "start";
  label: string;
  questions: { text: string; weight: QuestionWeight }[];
}[] = [
  {
    key: "fit",
    label: "Fit",
    questions: [
      { text: "Is this gym right for me?", weight: "xl" },
      { text: "What programs are available?", weight: "md" },
    ],
  },
  {
    key: "trust",
    label: "Trust",
    questions: [
      { text: "What do members say?", weight: "lg" },
      { text: "What does the environment look like?", weight: "md" },
    ],
  },
  {
    key: "practical",
    label: "Practical",
    questions: [
      { text: "Where is it?", weight: "query" },
      { text: "What are the timings?", weight: "query" },
      { text: "What does membership include?", weight: "query" },
    ],
  },
  {
    key: "start",
    label: "Getting started",
    questions: [
      { text: "Can beginners get guidance?", weight: "xl" },
      { text: "How do I start?", weight: "md" },
      { text: "Who do I contact?", weight: "md" },
    ],
  },
];

export const BARE_ENQUIRY = "Hi, what is the price?";

/* -------------------------------------------------------------------------- */
/* 04 — Channels                                                              */
/* -------------------------------------------------------------------------- */

export const CHANNELS = {
  instagram: { name: "Instagram", job: "Shows the culture.", carries: ["The people", "The energy", "The community"] },
  google: { name: "Google", job: "Helps people discover and verify you.", carries: ["Maps and directions", "Reviews", "Timings and contact"] },
  website: {
    name: "Website",
    job: "Explains the complete story.",
    carries: ["Programs and membership", "Reviews and gallery", "Guidance and a clear next step"],
  },
} as const;

/* -------------------------------------------------------------------------- */
/* 05 — Website anatomy                                                       */
/* -------------------------------------------------------------------------- */

export type AnatomyKey =
  | "hero"
  | "programs"
  | "trainers"
  | "gallery"
  | "reviews"
  | "membership"
  | "faq"
  | "guidance"
  | "contact";

export const ANATOMY: { key: AnatomyKey; section: string; question: string }[] = [
  { key: "hero", section: "Hero", question: "What is this gym?" },
  { key: "programs", section: "Programs", question: "What can I do here?" },
  { key: "trainers", section: "Trainers", question: "Who will guide me?" },
  { key: "gallery", section: "Facilities & gallery", question: "What does it feel like?" },
  { key: "reviews", section: "Reviews", question: "Can I trust this gym?" },
  { key: "membership", section: "Membership", question: "What are my options?" },
  { key: "faq", section: "FAQ", question: "What else do I need to know?" },
  { key: "guidance", section: "Guidance", question: "How should I start?" },
  { key: "contact", section: "Location & contact", question: "Where is it, and how do I talk to someone?" },
];

/* -------------------------------------------------------------------------- */
/* 06 — Guidance tools                                                        */
/* -------------------------------------------------------------------------- */

export const TOOL_FLOW = ["Input", "Guidance", "Result", "Enquiry"] as const;

/**
 * The enquiry the demo tools compose. Kept pure so the exact output is
 * test-pinned; the demo passes in the selected options' phrases.
 */
export function buildEnquiry({
  levelIntro,
  goalPhrase,
  days,
  timePhrase,
}: {
  levelIntro: string;
  goalPhrase: string;
  days: number;
  timePhrase: string;
}): string {
  return `Hi, ${levelIntro} and I'm looking to ${goalPhrase}. I'd like to train ${days} days a week, ${timePhrase}. Can I visit before joining?`;
}

/* -------------------------------------------------------------------------- */
/* 07 — Handoff                                                               */
/* -------------------------------------------------------------------------- */

export const HANDOFF: { title: string; text: string }[] = [
  { title: "Website", text: "A visitor answers a few questions on your website." },
  { title: "Context", text: "They see a starting point that fits them." },
  { title: "Prepared enquiry", text: "Their goal and preferences arrive with the message." },
  { title: "Your team", text: "Your team replies, personally." },
];

/** What the example enquiry tells the team before anyone replies. */
export const ENQUIRY_CONTEXT: { label: string; value: string }[] = [
  { label: "Goal", value: "Lose some weight" },
  { label: "Experience", value: "New to gyms" },
  { label: "Looked at", value: "Beginner program" },
  { label: "Wants", value: "To visit first" },
];

export const AI_JOBS = [
  "Answer common questions when the team is busy or unavailable",
  "Capture context about what the visitor needs",
  "Help route the enquiry to the right person",
];

export const AI_ROUTE = [
  { title: "Common question", text: "Asked late in the evening" },
  { title: "Answered", text: "The gap is covered" },
  { title: "Context captured", text: "Goal, timing, interest" },
  { title: "Handed to your team", text: "A person takes it forward" },
];

/* -------------------------------------------------------------------------- */
/* 08 — What we build                                                         */
/* -------------------------------------------------------------------------- */

export type LayerId = "foundation" | "discovery" | "conversion" | "growth";

export const LAYERS: { id: LayerId; index: string; title: string; summary: string }[] = [
  { id: "foundation", index: "01", title: "Digital foundation", summary: "What makes the website exist, load and stay secure." },
  { id: "discovery", index: "02", title: "Discovery & measurement", summary: "What helps people find you, and helps you see what happens next." },
  { id: "conversion", index: "03", title: "Conversion & guidance", summary: "What turns a visit into a prepared conversation." },
  { id: "growth", index: "04", title: "Growth & expansion", summary: "What the system can grow into, when it makes sense." },
];

export type Deliverable = {
  id: string;
  name: string;
  layer: LayerId;
  status: Status;
  reason: string;
  note?: string;
};

export const DELIVERABLES: Deliverable[] = [
  { id: "website", name: "Custom gym website", layer: "foundation", status: "required", reason: "The foundation everything else points to." },
  { id: "domain", name: "Domain registration", layer: "foundation", status: "required", reason: "The stable address people use to reach the gym.", note: "First year" },
  { id: "hosting", name: "Hosting", layer: "foundation", status: "required", reason: "The infrastructure that serves the website online.", note: "First year" },
  { id: "ssl", name: "SSL / HTTPS", layer: "foundation", status: "required", reason: "A secure, trusted connection. Browsers flag sites without it." },
  { id: "deployment", name: "Deployment", layer: "foundation", status: "required", reason: "Putting the site live on your domain, set up so updates ship reliably." },

  { id: "gbp", name: "Google Business Profile optimisation", layer: "discovery", status: "recommended", reason: "Helps people discover the gym through Google Search and Maps." },
  { id: "search-console", name: "Google Search Console setup", layer: "discovery", status: "recommended", reason: "Helps understand how Google discovers and indexes the website." },
  { id: "analytics", name: "Analytics setup", layer: "discovery", status: "recommended", reason: "Helps understand what visitors actually do on the site." },
  { id: "local-seo", name: "Local SEO foundation", layer: "discovery", status: "recommended", reason: "Strengthens how discoverable the gym is in local search." },

  { id: "enquiry-flows", name: "Enquiry flows", layer: "conversion", status: "included", reason: "A clear next step on every page, so visitors know how to reach you." },
  { id: "whatsapp", name: "WhatsApp & call integration", layer: "conversion", status: "included", reason: "Starts the conversation in the channel people already use." },
  { id: "guidance-tools", name: "Guidance tools", layer: "conversion", status: "included", reason: "Starting Point, Fitness Journey and First 30 Days, on your site." },
  { id: "lead-context", name: "Lead context", layer: "conversion", status: "included", reason: "Enquiries arrive with a goal and a starting point, not just a price question." },

  { id: "member", name: "Member experience", layer: "growth", status: "concept", reason: "A portal and app that carry the relationship past the first visit." },
  { id: "operations", name: "Operations", layer: "growth", status: "concept", reason: "A daily workspace for the team: billing, packages, inventory." },
  { id: "owner", name: "Owner analytics", layer: "growth", status: "concept", reason: "A clear view of how the business is doing." },
  { id: "ai", name: "Automation / AI where applicable", layer: "growth", status: "add-on", reason: "Covers common questions and routes enquiries to your team." },
];

/** What the custom website itself includes. */
export const WEBSITE_INCLUDES = [
  "Responsive, mobile-first design",
  "Programs & services",
  "Membership",
  "Trainers",
  "Reviews",
  "Gallery",
  "FAQs",
  "Location & contact",
  "Instagram integration",
  "Seasonal / promotional sections",
  "On-page SEO foundation",
];

export const FOUNDATION_FLOW = ["Foundation", "Discovery", "Measurement", "Enquiry", "Growth"] as const;

/* -------------------------------------------------------------------------- */
/* 09 — Growth                                                                */
/* -------------------------------------------------------------------------- */

export const GROWTH_STEPS: { phase: string; title: string; text: string; status: Status }[] = [
  { phase: "Start", title: "Website + Discovery", text: "Your site, domain, Google setup", status: "included" },
  { phase: "Next", title: "Guidance + Enquiry", text: "Member tools and prepared enquiries", status: "included" },
  { phase: "Expand", title: "Member experience", text: "Portal & app", status: "concept" },
  { phase: "Operate", title: "Operations", text: "Team command center", status: "concept" },
  { phase: "Understand", title: "Owner intelligence", text: "Executive analytics", status: "concept" },
];

export type ExpansionKey = "member" | "ops" | "owner";

export const EXPANSION: {
  key: ExpansionKey;
  tag: string;
  title: string;
  text: string;
  points: string[];
}[] = [
  {
    key: "member",
    tag: "Member experience",
    title: "Member Portal & App",
    text: "A place for members to manage their membership and stay connected with the gym, carrying the first-visit relationship forward.",
    points: ["Membership details and plan management", "Program upgrades and supplement ordering for front-desk pickup"],
  },
  {
    key: "ops",
    tag: "Operations",
    title: "Operations Command Center",
    text: "A daily workspace for the gym team, so running the floor depends less on spreadsheets and memory.",
    points: ["Equipment, packages and member billing", "Supplement inventory and order fulfilment"],
  },
  {
    key: "owner",
    tag: "Owner intelligence",
    title: "Executive Analytics",
    text: "A clear view for owners of how the business is doing, without having to ask for manual updates.",
    points: ["Revenue and daily, weekly and monthly audit logs", "Oversight across locations"],
  },
];

/* -------------------------------------------------------------------------- */
/* 10 — Lifecycle                                                             */
/* -------------------------------------------------------------------------- */

export type StageOwner = "foundation" | "team" | "broader";

export const STAGES: { name: string; items: string[]; owner: StageOwner }[] = [
  { name: "Discover", items: ["Google", "Instagram", "Website"], owner: "foundation" },
  { name: "Explore", items: ["Programs", "Reviews", "Experience", "FAQs"], owner: "foundation" },
  { name: "Enquire", items: ["Interactive guidance", "WhatsApp", "AI assistance (add-on)"], owner: "foundation" },
  { name: "Join", items: ["Your gym team", "Onboarding"], owner: "team" },
  { name: "Train", items: ["Member experience", "Member Portal & App"], owner: "broader" },
  { name: "Renew", items: ["Retention", "Member relationship"], owner: "broader" },
];

export const STAGE_OWNER_LABEL: Record<StageOwner, string> = {
  foundation: "Starting foundation",
  team: "Your team",
  broader: "Broader system (concept)",
};

/* -------------------------------------------------------------------------- */
/* 11 — Straight answers                                                      */
/* -------------------------------------------------------------------------- */

/** Each verdict is backed by a full answer in `GYM_FAQ` (`faq`). */
export const VERDICTS: { question: string; verdict: "Yes" | "No"; faq: string }[] = [
  { question: "Will this guarantee more members?", verdict: "No", faq: "Will a website guarantee more members?" },
  { question: "Can you guarantee Google rankings?", verdict: "No", faq: "Can you guarantee Google rankings?" },
  { question: "Do I need everything on day one?", verdict: "No", faq: "Do we need everything at once?" },
  { question: "Can I start with the website?", verdict: "Yes", faq: "Can we start with just the website and grow later?" },
  { question: "Can the system grow later?", verdict: "Yes", faq: "Can we start with just the website and grow later?" },
];

/* -------------------------------------------------------------------------- */
/* 12 — Getting started                                                       */
/* -------------------------------------------------------------------------- */

export const PROCESS_STEPS: { index: string; title: string; text: string }[] = [
  { index: "01", title: "Tell us about your gym", text: "Your programs, members, location and what you want the site to do." },
  { index: "02", title: "We map the right foundation", text: "What you need now, what can wait, and a quote to match." },
  { index: "03", title: "You review and approve", text: "Nothing goes live until you have seen it and said yes." },
  { index: "04", title: "We build and launch", text: "Website, tools, integrations and Google setup, connected to your domain." },
];

export const PROCESS_NEEDS = [
  "Gym information",
  "Branding",
  "Photos",
  "Programs",
  "Timings",
  "Contact details",
  "Location",
  "Membership information",
  "Google / Instagram access where required",
];

export const LAUNCH_NOTE = "after all required content, access and approvals are received.";

/* -------------------------------------------------------------------------- */
/* Chapter rail                                                               */
/* -------------------------------------------------------------------------- */

export type ChapterId = "discover" | "explore" | "enquire" | "foundation" | "grow" | "lifecycle" | "start";

export const CHAPTERS: { id: ChapterId; label: string; anchor: string }[] = [
  { id: "discover", label: "Discover", anchor: "before-they-walk-in" },
  { id: "explore", label: "Explore", anchor: "a-website-built-to-answer" },
  { id: "enquire", label: "Enquire", anchor: "the-prepared-enquiry" },
  { id: "foundation", label: "Foundation", anchor: "what-we-build" },
  { id: "grow", label: "Grow", anchor: ECOSYSTEM_ID },
  { id: "lifecycle", label: "Join → Renew", anchor: LIFECYCLE_ID },
  { id: "start", label: "Start", anchor: "straight-answers" },
];
