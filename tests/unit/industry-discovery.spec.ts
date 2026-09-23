import { describe, expect, it } from "vitest";

import { projects } from "@/lib/featured-work-data";
import {
  DEFAULT_INDUSTRY_ACCENT,
  INDUSTRY_STORIES,
  getIndustryStory,
} from "@/lib/industry-discovery";
import { NICHES } from "@/lib/niches";
import { solutionRoutes } from "@/lib/routes";

/**
 * R7 -- Industry Solution Discovery: presentation-map integrity.
 *
 * R7.1: the capability-column treatment was removed (owner decision); the
 * map now carries the system flow plus the panel visual discriminator:
 * verified real screenshots ONLY for the three proof-backed industries,
 * conceptual product visuals for the rest (never implying client work).
 */

const projectIds = new Set(projects.map((project) => project.id));

/** The only verified project->industry proof relationships (R6/R7). */
const VERIFIED_PROOF: Record<string, string> = {
  "online-delivery": "arogyadiet",
  "hotel-booking": "nextinn",
  "dental-medical": "neodent",
};

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

  it("carries proof exactly for the verified relationships and nowhere else", () => {
    for (const [id, expectedProject] of Object.entries(VERIFIED_PROOF)) {
      expect(INDUSTRY_STORIES[id]?.proofProjectId, id).toBe(expectedProject);
    }
    for (const [id, story] of Object.entries(INDUSTRY_STORIES)) {
      if (!(id in VERIFIED_PROOF)) {
        expect(story.proofProjectId, id).toBeUndefined();
      }
    }
  });
});

describe("R7.1 visual mapping", () => {
  it("gives every niche a visual", () => {
    for (const niche of NICHES) {
      expect(INDUSTRY_STORIES[niche.id]?.visual, niche.id).toBeDefined();
    }
  });

  it("uses verified real screenshots only for the three proof-backed industries", () => {
    const realIds = Object.entries(INDUSTRY_STORIES)
      .filter(([, story]) => story.visual.kind === "real")
      .map(([id]) => id)
      .sort();
    expect(realIds).toEqual(["dental-medical", "hotel-booking", "online-delivery"]);
  });

  it("binds each real visual to its own verified project asset", () => {
    const expected: Record<string, { image: string; project: string }> = {
      "online-delivery": { image: "/ArogyaDiet.jpg", project: "arogyadiet" },
      "hotel-booking": { image: "/NextInn.jpg", project: "nextinn" },
      "dental-medical": { image: "/Neodent.jpg", project: "neodent" },
    };
    for (const [id, expectedFor] of Object.entries(expected)) {
      const story = INDUSTRY_STORIES[id];
      expect(story?.visual.kind, id).toBe("real");
      if (story?.visual.kind === "real") {
        expect(story.visual.image, id).toBe(expectedFor.image);
        expect(story.proofProjectId, id).toBe(expectedFor.project);
        expect(story.visual.width, id).toBeGreaterThan(0);
        expect(story.visual.height, id).toBeGreaterThan(0);
        expect(story.visual.alt, id).toContain("Real work");
      }
    }
  });

  it("keeps conceptual visuals for industries without verified client work", () => {
    for (const id of ["pet-care", "consulting", "education", "gym-fitness", "ecommerce", "saas-platform", "seo-blogs"]) {
      expect(INDUSTRY_STORIES[id]?.visual.kind, id).toBe("concept");
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
