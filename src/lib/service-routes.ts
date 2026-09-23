/**
 * The four dedicated Service_Route definitions: AI automation, AI sales
 * agents, custom SaaS development, and programmatic SEO.
 *
 * These routes exist because Requirement 12.3 names them by name and because
 * the footer already advertises "AI Sales Agents", "Workflow Automation",
 * "Custom SaaS", and "Programmatic SEO" as links to `/#services` — an anchor,
 * not a page (audit Finding F-27). `src/app/(site)/services/[slug]/page.tsx`
 * (task 10.2) reads this module to render each route, and the navbar and
 * footer link to them (task 10.5, Requirement 12.10).
 *
 * Every phrase, `h1`, `metaDescription`, and `summary` below is copied from
 * `.kiro/specs/seo-audit-and-optimization/seo-audit-report.md`'s "Routes
 * added by the remediation" table and from `src/lib/keyword-map.ts`, so a
 * change to one belongs in all three or in none.
 *
 * Pure module: no I/O, no React, no framework imports.
 */

import type { FaqPair } from "@/lib/structured-data";

export type ServiceRouteSection = {
  heading: string;
  body: string;
};

export type ServiceRoute = {
  /** Stable id, mirrors the route segment. */
  id:
    | "ai-automation"
    | "ai-sales-agents"
    | "custom-saas-development"
    | "programmatic-seo";
  /** Route segment under `/services/<slug>`. */
  slug: string;
  /**
   * The single `<h1>` for this route. Contains {@link keywordPhrase}
   * verbatim (Requirement 12.3).
   */
  h1: string;
  /**
   * The primary keyword phrase assigned to this route in
   * `src/lib/keyword-map.ts`: 2 to 8 words, 60 characters or fewer.
   */
  keywordPhrase: string;
  /** 120 to 160 characters inclusive (Requirement 4.5). */
  metaDescription: string;
  /**
   * A self-contained, 40 to 80 word summary paragraph naming both
   * `Blogspage` and this service in one sentence, server-rendered at the top
   * of the route (Requirements 9.4, 9.6 context).
   */
  summary: string;
  /** Body content sections rendered below the summary. */
  sections: ServiceRouteSection[];
  /** At least three question-and-answer pairs (Requirement 9.6). */
  faq: FaqPair[];
};

/** Requirement 9.6: each question is 200 characters or fewer, inclusive. */
const MAX_FAQ_QUESTION_CHARS = 200;

/** Requirement 9.6: each answer is 20 to 100 words, inclusive. */
const MIN_FAQ_ANSWER_WORDS = 20;
const MAX_FAQ_ANSWER_WORDS = 100;

/** The `metaDescription` bound (Requirement 4.5). */
const MIN_META_CHARS = 120;
const MAX_META_CHARS = 160;

/** The `summary` bound (Requirements 9.4, 9.6). */
const MIN_SUMMARY_WORDS = 40;
const MAX_SUMMARY_WORDS = 80;

/** Minimum FAQ pair count (Requirement 9.6). */
const MIN_FAQ_PAIRS = 3;

/**
 * The four Service_Route records, in the order the keyword map and the audit
 * report list them.
 */
export const SERVICE_ROUTES: readonly ServiceRoute[] = [
  {
    id: "ai-automation",
    slug: "ai-automation",
    h1: "AI Workflow Automation Services for Growing Teams",
    keywordPhrase: "ai workflow automation services",
    metaDescription:
      "Blogspage delivers AI workflow automation services that connect your apps, cut manual entry, and remove bottlenecks so your team ships faster every week.",
    summary:
      "Blogspage designs AI workflow automation services that connect the tools founders already run, replacing manual handoffs with reliable, monitored pipelines. Instead of hiring for repetitive data entry, you get event-driven automations wired directly into your CRM, billing, and support stack. Each workflow ships with logging, retries, and alerting, so failures surface immediately instead of silently dropping records, and your team spends its hours on decisions that actually need a human.",
    sections: [
      {
        heading: "What we automate",
        body: "We connect the systems that already run your business — CRMs, spreadsheets, billing platforms, support desks, and internal APIs — into pipelines that move data without a person copying and pasting it. Typical builds include lead routing between forms and your CRM, invoice reconciliation across billing and accounting tools, onboarding checklists that fire the right emails and tasks in order, and two-way syncs between systems that were never designed to talk to each other.",
      },
      {
        heading: "How a build ships",
        body: "We start by mapping the current manual process end to end, including every exception case your team already works around by hand. The automation then ships as a monitored pipeline with logging and retries built in, not a fragile script that quietly breaks on the first edge case. You get documentation naming every step, every trigger, and every external system involved, so the automation stays maintainable after we hand it off.",
      },
      {
        heading: "What stays under your control",
        body: "Every automation we build writes to systems you already own — your own CRM, your own database, your own accounts — so there is no new platform lock-in and no vendor holding your data hostage. Alerting is wired to notify your team directly, and every workflow includes a documented rollback path, so a bad automation can be paused or reverted without touching the systems it connects.",
      },
    ],
    faq: [
      {
        question: "What kinds of workflows can Blogspage automate?",
        answer:
          "We connect the tools you already run, CRMs, spreadsheets, billing systems, support desks, and internal APIs, into event-driven pipelines. Typical builds include lead routing, invoice reconciliation, onboarding checklists, and data syncs between systems that were never designed to talk to each other, replacing manual copy-paste work with monitored automation.",
      },
      {
        question: "How long does an automation project take?",
        answer:
          "Most single-workflow automations ship within one to two weeks, from mapping the current manual process to a monitored pipeline in production. Larger multi-system automations, involving several tools and approval steps, typically take three to four weeks, including a short monitoring period before we hand off documentation.",
      },
      {
        question: "What happens when an automated workflow fails?",
        answer:
          "Every workflow we build ships with logging, automatic retries, and alerting, so a failed step surfaces immediately instead of silently dropping a record. You get a notification naming the failed step and the record involved, and most transient failures retry and resolve without anyone touching the system.",
      },
    ],
  },
  {
    id: "ai-sales-agents",
    slug: "ai-sales-agents",
    h1: "AI Sales Agent Development That Qualifies Leads Around the Clock",
    keywordPhrase: "ai sales agent development",
    metaDescription:
      "Blogspage's AI sales agent development builds agents that qualify leads, answer objections, and book calls day and night, without adding headcount.",
    summary:
      "Blogspage's AI sales agent development turns your top rep's playbook into a conversational agent that works every hour of the day. The agent qualifies inbound leads, answers common objections from your knowledge base, and books discovery calls straight into your calendar, so no lead goes cold overnight. Built on the same LLM stack used across our client work, each agent is tuned on your offer and monitored so escalations reach a human immediately.",
    sections: [
      {
        heading: "How the agent learns your offer",
        body: "We train the agent on your actual pricing, positioning, and the objections your team already handles every week, not a generic sales script. It draws answers from your knowledge base, case studies, and FAQ content, so a prospect asking a specific question gets a specific answer instead of a deflection. The result reads like a conversation with someone who actually knows the product, because the model is grounded in the same material your best rep uses.",
      },
      {
        heading: "Where the agent shows up",
        body: "We deploy agents on your website chat widget, WhatsApp, and inbound email, depending on where your leads already reach out first. Every channel shares one underlying knowledge base and one calendar integration, so a prospect gets the same qualification questions and the same booking flow regardless of where the conversation starts. Adding a new channel later reuses the same agent rather than starting the build over.",
      },
      {
        heading: "When it hands off to a human",
        body: "The agent is built to recognize the edge of its own competence — pricing exceptions, contract questions, or a prospect who is clearly frustrated — and escalate immediately rather than guessing. Every escalation arrives with the full conversation history attached, so your team picks up the thread without asking the lead to repeat themselves. You set the escalation rules; the agent just enforces them consistently.",
      },
    ],
    faq: [
      {
        question: "Will the AI sales agent sound like a real conversation?",
        answer:
          "Yes. The agent is tuned on your actual offer, pricing, and objection handling, so it responds the way your best rep would rather than reciting a generic script. It escalates to a human the moment a conversation needs judgment the model should not make on its own.",
      },
      {
        question: "Which channels can the sales agent work across?",
        answer:
          "We deploy agents on your website chat widget, WhatsApp, and inbound email, depending on where your leads already reach out. Each channel shares the same underlying knowledge base and calendar integration, so a lead gets the same qualification and booking experience no matter where the conversation starts.",
      },
      {
        question: "Does the agent replace my sales team?",
        answer:
          "No. It handles the repetitive first pass, qualifying leads, answering common questions, and booking calls, so your team spends its time on conversations that actually need a human closer. Most clients see it as adding a tireless first-shift rep rather than replacing existing headcount.",
      },
    ],
  },
  {
    id: "custom-saas-development",
    slug: "custom-saas-development",
    h1: "Blogspage Is a Custom SaaS Development Company for Ambitious Founders",
    keywordPhrase: "custom saas development company",
    metaDescription:
      "Blogspage is a custom SaaS development company shipping production-grade platforms on Next.js and Supabase, from validated MVPs to thousand-user systems.",
    summary:
      "Blogspage is a custom SaaS development company that takes a founder's idea from whiteboard to a production-grade platform, usually within a focused ten to fifteen day launch window. We build on Next.js, Supabase, and Stripe, so billing, auth, and row-level security are solved on day one instead of reinvented. Every build ships with the same performance and SEO discipline we apply to our own site, so the product is fast and discoverable from launch.",
    sections: [
      {
        heading: "The stack we build on",
        body: "We build on Next.js for the application layer, Supabase for the database and row-level security, and Stripe for billing, the same production-proven combination across every client engagement. That consistency means fewer surprises during launch: authentication, subscription billing, and multi-tenant data isolation are solved patterns, not novel research, so engineering time goes toward the parts of your product that are actually unique.",
      },
      {
        heading: "From MVP to scale",
        body: "A focused MVP validating one core workflow typically ships in ten to fifteen days, covering authentication, billing, and the primary user flow end to end. As usage grows, the same architecture extends to handle thousands of concurrent users without a rewrite, because the data model and security rules were designed for scale from the first commit rather than retrofitted later.",
      },
      {
        heading: "Launch-day performance and SEO",
        body: "Every platform we ship carries the same Core Web Vitals and SEO discipline we apply to our own site: canonical URLs, structured data, and image optimization are part of the build, not an afterthought. That means your SaaS product is fast and discoverable on day one, instead of needing a separate performance and SEO pass months after launch.",
      },
    ],
    faq: [
      {
        question: "What is included in a custom SaaS development engagement?",
        answer:
          "We handle product architecture, authentication, billing integration, database design with row-level security, and the production deployment pipeline. You get a working platform on Next.js and Supabase, not a prototype, with the same performance and SEO discipline we apply to our own site built into the launch.",
      },
      {
        question: "How fast can Blogspage ship a SaaS MVP?",
        answer:
          "A focused MVP validating one core workflow typically ships in ten to fifteen days, covering auth, billing, and the primary user flow end to end. Larger platforms with multiple user roles or complex data models take longer, and we scope that timeline with you before the engagement starts.",
      },
      {
        question: "Can Blogspage support the product after launch?",
        answer:
          "Yes. We offer ongoing support for bug fixes, feature additions, and infrastructure scaling once the platform is live and taking on real users. Many clients start with a launch engagement and move to a retainer once usage grows past what the initial architecture was scoped for.",
      },
    ],
  },
  {
    id: "programmatic-seo",
    slug: "programmatic-seo",
    h1: "Programmatic SEO Services That Turn Your Catalog Into Ranking Pages",
    keywordPhrase: "programmatic seo services",
    metaDescription:
      "Blogspage's programmatic SEO services turn structured data into thousands of templated pages, engineered to rank for long-tail searches at scale.",
    summary:
      "Blogspage's programmatic SEO services convert your existing catalog, service area, or dataset into thousands of templated pages, each targeting one specific long-tail search. Rather than hand-writing every page, we build a content engine on structured data so new entries publish, canonicalize, and index automatically. Every generated page still passes the same crawlability, metadata, and Core Web Vitals bar as a hand-built route, so scale never comes at the cost of quality.",
    sections: [
      {
        heading: "What gets templated",
        body: "We turn a structured dataset — a service catalog, a city list, a product feed, or a directory of listings — into one template that generates a unique page per entry. Each page targets one specific long-tail search intent, the kind of query too narrow to justify a hand-written page but common enough, in aggregate, to compound into meaningful organic traffic.",
      },
      {
        heading: "Guarding against thin content",
        body: "An unbounded template is the fastest way to create thousands of duplicate, unindexable pages, so every build we ship enforces an explicit input allow-list and a minimum content bar per page. A page only publishes once its entry carries enough unique, structured data to answer its search intent on its own — no placeholder text, no filler paragraphs, no doorway pages.",
      },
      {
        heading: "Built to the same bar as hand-written pages",
        body: "Every generated page carries its own canonical URL, unique title and meta description, and structured data, checked against the same automated suite that covers the rest of the site. New entries publish, canonicalize, and appear in the sitemap automatically on the next deploy, so the content engine scales without a manual SEO review per page.",
      },
    ],
    faq: [
      {
        question: "What does a programmatic SEO build actually generate?",
        answer:
          "We turn a structured dataset, a service catalog, a city list, or an inventory feed, into thousands of templated pages, each targeting one specific long-tail search. Every page still passes the same canonical, metadata, and Core Web Vitals checks as a hand-built route, so scale never trades away quality.",
      },
      {
        question: "How do you avoid creating thin or duplicate pages?",
        answer:
          "Every template requires unique, substantive content per page, unique title and description, and a defined minimum word count, or the page does not publish. We also bound the generated URL space explicitly, so an unapproved input never creates an indexable duplicate the way an unbounded template would.",
      },
      {
        question: "Does programmatic SEO work outside local service pages?",
        answer:
          "Yes. The same pattern applies to product catalogs, integration directories, comparison pages, and any dataset with enough unique attributes to justify its own page. The template just needs enough structured data per entry to write a page that answers one specific search intent on its own.",
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Module-load invariants (Requirements 12.3, 9.6)                             */
/* -------------------------------------------------------------------------- */

function wordCount(text: string): number {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

// Mirrors the module-load checks in `src/lib/keyword-map.ts` and
// `src/lib/structured-data.ts`: an edit that breaks a published bound fails
// the build rather than shipping copy the check suite would only catch later.
{
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  for (const route of SERVICE_ROUTES) {
    if (seenIds.has(route.id)) {
      throw new Error(`Duplicate ServiceRoute id "${route.id}".`);
    }
    seenIds.add(route.id);

    if (seenSlugs.has(route.slug)) {
      throw new Error(`Duplicate ServiceRoute slug "${route.slug}".`);
    }
    seenSlugs.add(route.slug);

    if (!route.h1.toLowerCase().includes(route.keywordPhrase.toLowerCase())) {
      throw new Error(
        `ServiceRoute "${route.id}" h1 does not contain its keywordPhrase "${route.keywordPhrase}" verbatim: "${route.h1}".`,
      );
    }

    const metaLen = route.metaDescription.length;
    if (metaLen < MIN_META_CHARS || metaLen > MAX_META_CHARS) {
      throw new Error(
        `ServiceRoute "${route.id}" metaDescription is ${metaLen} characters; Requirement 4.5 requires ${MIN_META_CHARS}-${MAX_META_CHARS}.`,
      );
    }

    const summaryWords = wordCount(route.summary);
    if (summaryWords < MIN_SUMMARY_WORDS || summaryWords > MAX_SUMMARY_WORDS) {
      throw new Error(
        `ServiceRoute "${route.id}" summary is ${summaryWords} words; Requirements 9.4/9.6 require ${MIN_SUMMARY_WORDS}-${MAX_SUMMARY_WORDS}.`,
      );
    }

    if (!route.summary.includes("Blogspage")) {
      throw new Error(
        `ServiceRoute "${route.id}" summary does not name "Blogspage".`,
      );
    }

    if (route.faq.length < MIN_FAQ_PAIRS) {
      throw new Error(
        `ServiceRoute "${route.id}" carries ${route.faq.length} FAQ pairs; Requirement 9.6 requires at least ${MIN_FAQ_PAIRS}.`,
      );
    }

    for (const pair of route.faq) {
      if (pair.question.length > MAX_FAQ_QUESTION_CHARS) {
        throw new Error(
          `ServiceRoute "${route.id}" FAQ question is ${pair.question.length} characters, over the ${MAX_FAQ_QUESTION_CHARS}-character limit: "${pair.question}".`,
        );
      }

      const answerWords = wordCount(pair.answer);
      if (
        answerWords < MIN_FAQ_ANSWER_WORDS ||
        answerWords > MAX_FAQ_ANSWER_WORDS
      ) {
        throw new Error(
          `ServiceRoute "${route.id}" FAQ answer is ${answerWords} words; Requirement 9.6 requires ${MIN_FAQ_ANSWER_WORDS}-${MAX_FAQ_ANSWER_WORDS}: "${pair.question}".`,
        );
      }
    }
  }
}

/** Look up a Service_Route by its `/services/<slug>` segment. */
export function findServiceRouteBySlug(slug: string): ServiceRoute | null {
  return SERVICE_ROUTES.find((route) => route.slug === slug) ?? null;
}
