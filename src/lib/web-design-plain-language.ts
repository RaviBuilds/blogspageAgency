/**
 * Web Design service page — PLAIN-LANGUAGE presentation layer.
 *
 * Scope: /services/web-design art direction only.
 *
 * ## Why this module exists
 *
 * The page's audience is dentists, gym owners, hotel owners, consultants and
 * founders — not developers. The approved copy deck (`web-design-data.ts`) is
 * correct and is deliberately written in the industry's own vocabulary, because
 * a technical reader has to recognise the methodology and the search phrases
 * have to survive. That deck is a contract: nothing here edits, reorders,
 * re-scopes or replaces one word of it.
 *
 * What this module adds is the *second layer* of a dual-layer read: for every
 * technical term the deck uses, the plain-language meaning a non-technical
 * business owner needs in order to understand what they are buying. "DNS
 * routing" keeps its name in the heading; underneath it, this module supplies
 * "your address on the internet" and the three-step relationship a visual can
 * draw — your business → yourbusiness.com → your website.
 *
 * ## What is and is not in here
 *
 * - Definitions and relationships only. Every string below either renames a
 *   technical concept in ordinary words or names a step in a relationship that
 *   already exists in the deck's own description of that concept.
 * - No claims. No metric, statistic, testimonial, award, client count, price,
 *   timeline or outcome promise. Nothing here can be read as a new commercial
 *   assertion, because nothing here asserts anything about Blogspage AI — it
 *   asserts what a domain is.
 * - No scope changes. The chains describe the same work the deck describes.
 *
 * Keyed by the deck's own ids so the two layers cannot drift out of alignment:
 * adding an item to the deck degrades to "no plain-language layer for that
 * item" (the consumer renders the technical layer alone) rather than to a
 * mismatched gloss.
 *
 * Pure module: no React, no I/O, no framework imports.
 */

/* -------------------------------------------------------------------------- */
/* Shared shapes                                                              */
/* -------------------------------------------------------------------------- */

/**
 * One node in an explanatory chain.
 *
 * `emphasis` marks the node the chain is actually about — the domain name in
 * the domain chain, the customer at the end of the hosting chain — so a
 * consumer can give one node the accent instead of colouring all of them.
 */
export interface ChainNode {
  id: string;
  /** The primary, plain-language label. Real text in the served HTML. */
  label: string;
  /** Optional secondary technical annotation, always subordinate. */
  note?: string;
  /** The node that carries the chain's accent. At most one per chain. */
  emphasis?: boolean;
}

/** A plain-language gloss plus, where it helps, the relationship to draw. */
export interface PlainConcept {
  /** Two-to-five words. What this is, with no technical vocabulary. */
  plain: string;
  /** One sentence a business owner can act on. Optional. */
  detail?: string;
  /** The relationship, as a left-to-right chain. Optional. */
  chain?: readonly ChainNode[];
}

/* -------------------------------------------------------------------------- */
/* The 70 / 20 / 10 framework (section 3, and the hero's promise)             */
/* -------------------------------------------------------------------------- */

/**
 * The plain-language name and one-line meaning of each pillar, keyed by
 * `WEB_DESIGN_CORE_POSITIONING.pillars[].id`.
 *
 * The deck's titles ("Core Web Design & Architecture") stay as the pillar
 * headings. These sit above them at micro scale as the three-second read, which
 * is what turns a percentage chart into a framework a visitor can repeat back.
 */
export const PILLAR_PLAIN: Record<
  string,
  { name: string; meaning: string }
> = {
  "web-design": {
    name: "The Website",
    meaning: "The experience your customers actually use.",
  },
  branding: {
    name: "The Brand",
    meaning: "How your business looks and feels online.",
  },
  "local-launch": {
    name: "The Launch",
    meaning:
      "Making sure the website is accessible, discoverable and properly launched.",
  },
};

/* -------------------------------------------------------------------------- */
/* Core web design — the business-goal chain (section 4)                      */
/* -------------------------------------------------------------------------- */

/**
 * What the design work is actually a chain of.
 *
 * The section's artwork shows artboards and interface states, which a designer
 * reads as craft and a business owner reads as decoration. This chain names the
 * reasoning the artboards are the output of, so the section says "we design the
 * experience around the business" before any interface is examined.
 */
export const DESIGN_GOAL_CHAIN: readonly ChainNode[] = [
  { id: "goal", label: "Your business goal", note: "Brief & priorities" },
  { id: "experience", label: "Your customer's experience", note: "UX strategy" },
  { id: "design", label: "The website design", note: "Figma UI system" },
  { id: "action", label: "They contact you", note: "Conversion path", emphasis: true },
];

/* -------------------------------------------------------------------------- */
/* Local visibility (section 6, 10% part A)                                   */
/* -------------------------------------------------------------------------- */

/**
 * The ecosystem the section argues for: a website does not exist in isolation.
 *
 * Primary labels are ordinary words. The technical name for each link is the
 * `note`, kept so a technical reader still recognises what is being configured.
 */
export const LOCAL_ECOSYSTEM_CHAIN: readonly ChainNode[] = [
  { id: "business", label: "Your business", note: "Name, address, phone" },
  { id: "website", label: "Your website", note: "Indexed & verified" },
  { id: "google", label: "Google Search", note: "Search Console" },
  { id: "maps", label: "Google Maps", note: "Business Profile" },
  { id: "customer", label: "A nearby customer finds you", emphasis: true },
];

/**
 * Plain-language layer for the four local-visibility setup items, keyed by
 * `WEB_DESIGN_LOCAL_VISIBILITY.items[].id`.
 */
export const LOCAL_PLAIN: Record<string, PlainConcept> = {
  "gbp-setup": {
    plain: "Your listing on Google Maps",
    detail:
      "The panel that appears beside the map when someone searches for a business like yours nearby.",
    chain: [
      { id: "b", label: "Your business" },
      { id: "s", label: "Google Search" },
      { id: "m", label: "Google Maps" },
      { id: "c", label: "Customer finds you", emphasis: true },
    ],
  },
  "search-console": {
    plain: "Telling Google your website exists",
    detail:
      "Until a search engine has been shown the site and allowed to read it, none of the pages can appear in results.",
  },
  "nap-accuracy": {
    plain: "The same details everywhere",
    detail:
      "Your name, address and phone number written identically on your site, on Google, on Maps and in directories — because a mismatch is what makes a listing look unreliable.",
  },
  "local-schema": {
    plain: "Describing your business in a way software can read",
    detail:
      "The same facts a human reads on the page, repeated in a format search engines and directories can parse without guessing.",
  },
};

/**
 * The NAP relationship, as the three-into-many-into-one shape it actually is.
 *
 * Consumed by a dedicated fan visual rather than a linear chain, because the
 * point of NAP consistency is that several destinations receive the *same*
 * three facts — which a single left-to-right line cannot state.
 */
export const NAP_FAN = {
  sourceLabel: "The three facts",
  source: [
    { id: "name", label: "Business name" },
    { id: "address", label: "Address" },
    { id: "phone", label: "Phone" },
  ],
  destinationLabel: "Everywhere customers look",
  destinations: [
    { id: "google", label: "Google" },
    { id: "maps", label: "Maps" },
    { id: "directories", label: "Directories" },
  ],
  conclusion: "The same information everywhere",
  /**
   * Why the shape matters, in ordinary words.
   *
   * A definition of how verification works, not a claim about Blogspage AI and
   * not a promise about rankings — deliberately, because this section's scope
   * boundary is that we configure a launch foundation rather than run an ongoing
   * ranking retainer. Lives here rather than inline in the section so the one
   * piece of explanatory prose the visual pass added is reviewable alongside
   * every other string it added.
   */
  rationale:
    "Google trusts a business it can verify. If your phone number reads one way on your website and another way on a directory, there is nothing to verify against — so the listing is treated as less reliable than one that agrees with itself.",
  label: "Why the same details everywhere matters",
} as const;

/* -------------------------------------------------------------------------- */
/* Digital launch infrastructure (section 7, 10% part B)                      */
/* -------------------------------------------------------------------------- */

/**
 * Plain-language layer for the six launch-infrastructure items, keyed by
 * `WEB_DESIGN_LAUNCH_FOUNDATION.items[].id`.
 *
 * This is the page's most technical section and therefore the one that needs
 * this layer most: the deck legitimately says "DNS record propagation (A,
 * CNAME, TXT)", and a hotel owner legitimately needs to be told that the
 * subject of that sentence is their address.
 */
export const LAUNCH_PLAIN: Record<string, PlainConcept> = {
  "domain-dns": {
    plain: "Your address on the internet",
    detail: "The name customers type, pointed at your website — and registered in your name.",
    chain: [
      { id: "business", label: "Your business" },
      { id: "domain", label: "yourbusiness.com", emphasis: true },
      { id: "website", label: "Your website" },
    ],
  },
  "edge-hosting": {
    plain: "Where your website lives",
    detail: "Kept on fast, reliable infrastructure so pages open quickly wherever the customer is.",
    chain: [
      { id: "website", label: "Your website" },
      { id: "infra", label: "Fast, reliable infrastructure", emphasis: true },
      { id: "customer", label: "Your customer" },
    ],
  },
  "https-ssl": {
    plain: "A secure connection",
    detail:
      "The padlock in the address bar: what a visitor sends you cannot be read on the way.",
    chain: [
      { id: "customer", label: "Your customer" },
      { id: "secure", label: "Secure connection", emphasis: true },
      { id: "website", label: "Your website" },
    ],
  },
  "business-email": {
    plain: "Professional business communication",
    detail:
      "Email at your own name rather than a free address — set up so it reaches the inbox instead of the spam folder.",
    chain: [
      { id: "you", label: "you@yourbusiness.com", emphasis: true },
      { id: "delivered", label: "Delivered, not marked spam" },
      { id: "customer", label: "Your customer" },
    ],
  },
  "analytics-baseline": {
    plain: "Understanding what customers do",
    detail:
      "How many people visited, where they came from, and which pages they actually read.",
    chain: [
      { id: "visitors", label: "Visitors" },
      { id: "pages", label: "Pages they read", emphasis: true },
      { id: "decisions", label: "What to improve next" },
    ],
  },
  "full-ownership": {
    plain: "Your business keeps control",
    detail:
      "Every account is in your name, so the website, the domain and the data stay yours.",
  },
};

/* -------------------------------------------------------------------------- */
/* Brand presentation (section 5, 20%)                                        */
/* -------------------------------------------------------------------------- */

/**
 * The brand board's own header, so the sheet reads as a guideline artefact
 * rather than as four cards in a box.
 *
 * `statement` is the section's whole argument in seven words, and it is
 * deliberately about the *client's* brand rather than ours — which is also the
 * scope boundary the section's own note states: we apply and refine a brand
 * system for the web, we do not sell brand creation. Nothing here widens that.
 */
export const BRAND_SHEET = {
  label: "Brand sheet",
  statement: "Your website should look like your business.",
  /** The spacing step scale, as a fact about how the work is built. */
  spacingLabel: "Spacing scale",
  spacing: [4, 8, 12, 16, 24, 32] as const,
} as const;

/* -------------------------------------------------------------------------- */
/* Process (section 9)                                                        */
/* -------------------------------------------------------------------------- */

/**
 * The dual-layer process vocabulary, keyed by `WEB_DESIGN_PROCESS.steps[].step`.
 *
 * `action` + `plain` is what a customer reads. `technical` is the methodology
 * name a technical reader recognises, kept as subordinate metadata beside the
 * deck's own full stage title and deliverable — both of which remain.
 */
export const PROCESS_PLAIN: Record<
  string,
  { action: string; plain: string; technical: string }
> = {
  "01": {
    action: "Understand",
    plain: "We learn about your business.",
    technical: "Discovery",
  },
  "02": {
    action: "Plan",
    plain: "We structure the website around your customers.",
    technical: "Wireframe",
  },
  "03": {
    action: "Design",
    plain: "You see exactly how the website will look.",
    technical: "Figma UI",
  },
  "04": {
    action: "Refine",
    plain: "We improve the details together.",
    technical: "QA",
  },
  "05": {
    action: "Launch",
    plain: "Your website goes live properly.",
    technical: "Deployment",
  },
};

/* -------------------------------------------------------------------------- */
/* Industry showcase (section 8)                                              */
/* -------------------------------------------------------------------------- */

/**
 * The commercial goal each vertical's website is shaped around, as three beats,
 * keyed by `WEB_DESIGN_INDUSTRY_ROUTER.industries[].id`.
 *
 * The previews already differ structurally (see `MockArchetype`). This states
 * *why* they differ in words, so the gallery reads as ten commercial arguments
 * rather than ten skins: a gym's site is membership → transformation → action, a
 * hotel's is rooms → availability → booking.
 */
export const INDUSTRY_GOAL: Record<string, readonly [string, string, string]> = {
  "dental-medical": ["Trust", "Treatments", "Enquiry"],
  "gym-fitness": ["Membership", "Transformation", "Action"],
  "hotel-booking": ["Rooms", "Availability", "Booking"],
  "online-delivery": ["Menu", "Local orders", "Repeat"],
  consulting: ["Authority", "Case proof", "Enquiry"],
  education: ["Programs", "Credibility", "Enquiry"],
  "pet-care": ["Services", "Care", "Appointment"],
  ecommerce: ["Products", "Discovery", "Purchase"],
  "saas-platform": ["Product", "Value", "Conversion"],
  "seo-blogs": ["Content", "Reading", "Discovery"],
};
