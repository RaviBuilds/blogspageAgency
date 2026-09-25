/**
 * Brand Story copy deck — the homepage's "why does your business need a
 * brand?" storytelling sequence.
 *
 * Two connected chapters, treated as one continuous scroll narrative:
 *
 *   Chapter 1 (BRAND_CHAPTER_ONE) — BUSINESS -> LONG-TERM VISION -> BRAND
 *   Chapter 2 (BRAND_CHAPTER_TWO) — BRAND EXPERIENCE -> PHYSICAL OFFICE ->
 *                                    DIGITAL OFFICE -> WEBSITE
 *
 * Plain module: no I/O, no React, no framework imports — importable from
 * both the section component (`brand-story.tsx`) and its decorative visuals
 * (`brand-story-visuals.tsx`), matching the `homepage-data.ts` convention.
 */

export const BRAND_CHAPTER_ONE = {
  anchorId: "brand",
  eyebrow: "Built for the long run",
  question: "Did you start your business for two years?",
  answer: "Of course not.",
  lead: "You started it to build something that lasts — something that grows, something people recognize, something people trust.",
  bridgeToBrand: "Then you're building a brand.",
  explanation:
    "A brand is more than a name or a logo. It's the identity and experience people associate with your business — shaped by every interaction, not declared in a single moment.",
  dimensions: [
    { label: "Identity", accent: "blue" as const },
    { label: "Experience", accent: "cyan" as const },
    { label: "Trust", accent: "blue" as const },
    { label: "Culture", accent: "cyan" as const },
    { label: "Reputation", accent: "violet" as const },
  ],
  centerLabel: "Brand",
  insight: "Every interaction with your business is part of your brand.",
  touchpoints: [
    "Physical environment",
    "People",
    "Service",
    "Communication",
    "Product",
    "Website",
  ],
} as const;

export const BRAND_CHAPTER_TWO = {
  anchorId: "digital-office",
  eyebrow: "Your website is your digital office",
  question: "What happens when someone never walks through your door?",
  lead: "Your physical office introduces people to your business in person. Your website introduces people to your business online — the same brand, a different room.",
  examples: [
    { label: "Dental clinic", detail: "Clean, clinical, reassuring" },
    { label: "Gym", detail: "Energetic, bold, in motion" },
    { label: "School", detail: "Structured, trustworthy, warm" },
    { label: "Professional office", detail: "Precise, composed, credible" },
  ],
  examplesLead:
    "Walk into a well-designed space and you understand the business before anyone says a word.",
  examplesTransition: "Your website should do the same.",
  officeLayers: [
    "Your story",
    "Your services",
    "Your people",
    "Your work",
    "Your proof",
    "Your brand identity",
  ],
  final: {
    line1: "Build the business you want to be remembered for.",
    line2: "Your office represents your brand in the physical world. Your website represents it everywhere else.",
    line3: "Don't just build a website. Build the place where people meet your brand.",
    cta: { label: "Start building your digital office", href: "#contact" },
  },
} as const;

export type BrandDimension = (typeof BRAND_CHAPTER_ONE.dimensions)[number];
