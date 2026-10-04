import type { FaqPair } from "@/lib/structured-data";

/**
 * "Straight answers" for the gym solution page.
 *
 * One source for both the visible FAQ and the `FAQPage` JSON-LD node (the
 * solution route derives both from `niche.faq`), so what search engines read is
 * exactly what a visitor reads. Plain text only: answers are emitted verbatim
 * into structured data.
 *
 * Copy rules for this file: no guarantees, no ranking or growth promises, no
 * claim that AI replaces staff, and no claim that the broader ecosystem is part
 * of the starting website scope.
 */
export const GYM_FAQ: FaqPair[] = [
  {
    question: "Will a website guarantee more members?",
    answer:
      "No. No honest website can guarantee that. What a well-built gym website can improve is clarity, how easily people find and verify you, access to information, trust, guidance for first-timers, the quality and context of the enquiries you receive, and how easy the next step is. Whether someone joins still depends on your gym, your team, your pricing and your location.",
  },
  {
    question: "Can you guarantee Google rankings?",
    answer:
      "No. No one can honestly guarantee rankings, because Google decides what it shows. What we set up are the foundations that help Google discover, understand and show your gym: a fast, well-structured website with on-page SEO, Google Business Profile optimisation, Google Search Console and a local SEO foundation.",
  },
  {
    question: "Does this replace Instagram or Google?",
    answer:
      "No. Instagram shows your culture and Google helps people discover and verify you. The website gives the information from both a deeper place to live, and connects it into one journey: programs, reviews, timings, membership, guidance and a clear way to contact your team.",
  },
  {
    question: "Does this replace our staff?",
    answer:
      "No. The system prepares and supports the conversation; your team remains central. The interactive tools help people work out where to start and send you an enquiry with context. Where an AI assistant is added as part of a broader setup, its job is to answer common questions when your team is busy or unavailable, capture context and help route the enquiry. People join because of your team.",
  },
  {
    question: "Do we need everything at once?",
    answer:
      "No. The starting foundation is the gym website, the interactive member tools, Google and local search setup, and the technical infrastructure. Member experience, operations and owner-intelligence systems are a broader direction that can be discussed and scoped separately as your business grows. They are not part of the starting website scope.",
  },
  {
    question: "Can we start with just the website and grow later?",
    answer:
      "Yes. You can start with the website and its digital foundation. It is designed so member experience, operations and owner systems can be added later, each discussed and scoped separately when it makes sense for your gym.",
  },
  {
    question: "Who is this for?",
    answer:
      "Premium independent gyms, fitness clubs, boutique studios and growing fitness businesses. Multi-location gyms can also use it as a starting point, with the scope discussed for each location.",
  },
  {
    question: "Are the interactive tools medical or fitness advice?",
    answer:
      "No. The tools give general guidance to help a first-timer understand where to start and what to ask. They are not medical advice. Anyone with a health condition or concern should speak to a qualified professional, and your trainers can guide members in person.",
  },
];
