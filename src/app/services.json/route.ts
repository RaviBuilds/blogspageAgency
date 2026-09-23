/**
 * The machine-readable Service_Catalog index (Requirements 9.3, 9.10).
 *
 * Exactly one entry per `src/lib/niches.ts` `NICHES` (Service_Catalog) entry,
 * each carrying a `name`, a 15 to 40 word `description`, and the absolute
 * URL of the Route targeting that service. The URL is read from
 * `solutionRoutes()` in `src/lib/routes.ts` — the same registry the sitemap
 * and `llms.txt` read from — rather than reconstructed here, so this file
 * can never drift from the actual route the niche resolves to.
 *
 * The description is composed from two fields already on the catalog entry
 * (`description` and `seoLabel`) rather than a new hand-written copy, so
 * "no separate copy exists" per the task: there is nothing here to keep in
 * sync with `niches.ts` by hand.
 *
 * Static and derived entirely from code, matching `src/app/llms.txt/route.ts`
 * (task 10.8): `force-static` with `revalidate = false` so the response is
 * baked at build time and only changes when the catalog itself changes,
 * satisfying the "first request after deployment" requirement in 9.10.
 */

import { NICHES } from "@/lib/niches";
import { solutionRoutes } from "@/lib/routes";

export const dynamic = "force-static";
export const revalidate = false;

type ServiceIndexEntry = {
  name: string;
  description: string;
  url: string;
};

/**
 * Combine the catalog's short value-proposition sentence with its SEO
 * sentence into one 15 to 40 word description, without introducing any text
 * that does not already live in `niches.ts`.
 */
function combineDescription(description: string, seoLabel: string): string {
  return `${description.trim()} ${seoLabel.trim()}`.replace(/\s+/g, " ").trim();
}

/**
 * One absolute solution-route URL per `Niche.id`, read from the route
 * registry's niche-by-city cross product. Today `APPROVED_CITIES` holds a
 * single token, so this map has exactly one URL per niche and the cross
 * product already equals the Service_Catalog one-for-one. If a second city
 * is ever approved, the cross product would carry more than ten entries;
 * keying by `nicheId` and keeping only the first-seen URL preserves "exactly
 * one entry per Service_Catalog entry" instead of multiplying it.
 */
function firstUrlByNicheId(): Map<string, string> {
  const byNicheId = new Map<string, string>();
  for (const route of solutionRoutes()) {
    if (!byNicheId.has(route.nicheId)) {
      byNicheId.set(route.nicheId, route.absoluteUrl);
    }
  }
  return byNicheId;
}

function buildServiceIndex(): ServiceIndexEntry[] {
  const urlByNicheId = firstUrlByNicheId();

  return NICHES.map((niche) => {
    const url = urlByNicheId.get(niche.id);
    if (!url) {
      throw new Error(
        `No solution route resolves for Service_Catalog entry "${niche.id}"; solutionRoutes() and NICHES have fallen out of sync.`,
      );
    }

    return {
      name: niche.title,
      description: combineDescription(niche.description, niche.seoLabel),
      url,
    };
  });
}

export async function GET() {
  return Response.json(buildServiceIndex());
}
