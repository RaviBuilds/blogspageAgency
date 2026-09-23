import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * AI crawlers with published, respected robots directives (Requirement 6.5).
 * Each gets its own record — identical to the `*` record today, but kept
 * separate so an AI-specific rule can be tightened independently later
 * without touching the general-purpose crawler record.
 */
const AI_USER_AGENTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The embedded Sanity Studio is an authoring tool, not content.
        disallow: "/studio",
      },
      ...AI_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: "/studio",
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
