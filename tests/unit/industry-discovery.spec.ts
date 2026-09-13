import { describe, expect, it } from "vitest";

import { projects } from "@/lib/featured-work-data";
import {
  DEFAULT_INDUSTRY_ACCENT,
  INDUSTRY_STORIES,
  getIndustryStory,
} from "@/lib/industry-discovery";
import { HOME_VERTICALS } from "@/lib/homepage-verticals";
import { NICHES } from "@/lib/niches";
import { solutionRoutes } from "@/lib/routes";

/**
 * R7 — Industry Solution Discovery: presentation-map integrity.
 *
 * The homepage industry section is a presentation + internal-linking layer
 * over the existing programmatic-SEO catalog. These tests pin the contracts
 * the plan commits to:
 *
 * 1. the map covers every `NICHES` entry (no industry silently dropped),
 * 2. every rendered industry link is a real, served solution route (never
 *    an invented URL),
 * 3. proof references point at real featured-work projects,
 * 4. capability keys are real `HomeVerticalId`s (drift-proof single source),
 * 5. micro-stories stay three-node, short-label chains,
 * 6. the lookup fails safe for unknown ids.
 */

const verticalIds = new Set(HOME_VERTICALS.map((vertical) => vertical.id));
const projectIds = new Set(projects.map((project) => project.id));

describe("R7 industry discovery map coverage", () => {
  it("covers every niche exactly once", () => {
    const storyIds = Object.keys(INDUSTRY_STORIES);
    expect(new Set(storyIds).size).toBe(storyIds.length);
    for (const niche of NICHES) {
      expect(INDUSTRY_STORIES[niche.id], niche.id).toBeDefined();
    }
    expect(storyIds.length).toBe(NICHES.length);
  });

  it("keeps every niche href a real served solution route", () => {
    const servedPaths = new Set(solutionRoutes().map((route) => route.path));
    for (const niche of NICHES) {
      expect(servedPaths.has(niche.href()), niche.href()).toBe(true);
    }
  });
});

describe("R7 proof references", () => {
  it("only references real featured-work projects", () => {
    for (const [id, story] of Object.entries(INDUSTRY_STORIES)) {
      if (story.proofProjectId === undefined) continue;
      expect(projectIds.has(story.proofProjectId), id).toBe(true);
    }
  });

  it("carries no proof for industries without a verified project", () => {
    // Verified relationships only: arogyadiet→delivery, nextinn→hotel,
    // neodent→dental. Gym & Fitness has no real project — no proof.
    expect(INDUSTRY_STORIES["gym-fitness"]?.proofProjectId).toBeUndefined();
    expect(INDUSTRY_STORIES["dental-medical"]?.proofProjectId).toBe("neodent");
    expect(INDUSTRY_STORIES["hotel-booking"]?.proofProjectId).toBe("nextinn");
    expect(
      INDUSTRY_STORIES["online-delivery"]?.proofProjectId,
    ).toBe("arogyadiet");
  });
});

describe("R7 capability connection", () => {
  it("uses only real HomeVerticalIds as capability keys", () => {
    for (const [id, story] of Object.entries(INDUSTRY_STORIES)) {
      for (const key of Object.keys(story.capabilities)) {
        expect(verticalIds.has(key as never), `${id}:${key}`).toBe(true);
      }
    }
  });

  it("gives every capability chip a fallback (plainPromise) path", () => {
    // Every vertical has a plainPromise, so an absent per-industry line
    // always resolves at render time.
    for (const vertical of HOME_VERTICALS) {
      expect(vertical.plainPromise.length).toBeGreaterThan(0);
    }
  });
});

describe("R7 micro-stories", () => {
  it("keeps every story a three-node chain with short labels", () => {
    for (const [id, story] of Object.entries(INDUSTRY_STORIES)) {
      expect(story.story.length, id).toBe(3);
      for (const label of story.story) {
        expect(label.trim().length, `${id}:${label}`).toBeGreaterThan(0);
        expect(label.length, `${id}:${label}`).toBeLessThanOrEqual(16);
      }
    }
  });
});

describe("R7 lookups fail safe", () => {
  it("returns null for an unknown niche id", () => {
    expect(getIndustryStory("does-not-exist")).toBeNull();
    expect(getIndustryStory(NICHES[0].id)).not.toBeNull();
  });

  it("exposes the neutral default accent", () => {
    expect(DEFAULT_INDUSTRY_ACCENT).toMatch(/^\d{1,3},\d{1,3},\d{1,3}$/);
  });
});