import { describe, expect, it } from "vitest";

import { KEYWORD_MAP, findKeywordPhrase } from "@/lib/keyword-map";
import { allNicheParams, NICHES } from "@/lib/niches";
import { buildMetadata, canonicalUrl } from "@/lib/seo";

/**
 * Feature: seo-audit-and-optimization
 *
 * Example-based checks on the keyword map: the published bounds, the
 * uniqueness rule, the derived absolute URLs (which also prove the deliberate
 * `seo.ts` <-> `keyword-map.ts` cycle resolves), and the Service_Catalog
 * coverage the report records.
 *
 * _Requirements: 12.1, 12.2, 12.5, 12.6_
 */

const wordCount = (phrase: string) => phrase.trim().split(/\s+/).length;

describe("KEYWORD_MAP phrase bounds (Requirement 12.1)", () => {
  it("assigns every entry a phrase of 2 to 8 words, 60 characters or fewer", () => {
    for (const entry of KEYWORD_MAP) {
      expect(wordCount(entry.phrase), entry.path).toBeGreaterThanOrEqual(2);
      expect(wordCount(entry.phrase), entry.path).toBeLessThanOrEqual(8);
      expect(entry.phrase.length, entry.path).toBeLessThanOrEqual(60);
      expect(entry.phrase.trim(), entry.path).toBe(entry.phrase);
    }
  });
});

describe("KEYWORD_MAP uniqueness (Requirement 12.6)", () => {
  it("assigns each phrase to at most one route, compared case-insensitively and trimmed", () => {
    const keys = KEYWORD_MAP.map((entry) => entry.phrase.trim().toLowerCase());
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("holds at most one assignment per route", () => {
    const urls = KEYWORD_MAP.map((entry) => entry.absoluteUrl);
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe("KEYWORD_MAP absolute URLs (Requirement 12.1)", () => {
  it("derives every absoluteUrl from canonicalUrl(path), so the import cycle resolves", () => {
    expect(KEYWORD_MAP.length).toBeGreaterThan(0);
    expect(KEYWORD_MAP[0].absoluteUrl).toBe("https://www.blogspage.com");

    for (const entry of KEYWORD_MAP) {
      expect(entry.absoluteUrl, entry.path).toBe(canonicalUrl(entry.path));
      expect(entry.absoluteUrl, entry.path).toMatch(
        /^https:\/\/www\.blogspage\.com(\/[a-z0-9\-/]*[a-z0-9])?$/,
      );
    }
  });
});

describe("KEYWORD_MAP Service_Catalog coverage (Requirement 12.2)", () => {
  it("targets every one of the ten catalog entries exactly once", () => {
    const targeted = KEYWORD_MAP.flatMap((entry) =>
      entry.serviceCatalogId ? [entry.serviceCatalogId] : [],
    );
    expect(targeted.sort()).toEqual(NICHES.map((niche) => niche.id).sort());
  });

  it("points every catalog-targeting entry at a resolvable solution route", () => {
    const solutionPaths = new Set(
      allNicheParams().map(({ slug }) => `/solutions/${slug}`),
    );
    for (const entry of KEYWORD_MAP) {
      if (!entry.serviceCatalogId) continue;
      expect(solutionPaths.has(entry.path), entry.path).toBe(true);
    }
  });

  it("assigns no catalog id to the four dedicated service routes", () => {
    for (const entry of KEYWORD_MAP) {
      if (!entry.path.startsWith("/services/")) continue;
      expect(entry.serviceCatalogId, entry.path).toBeUndefined();
    }
  });
});

describe("findKeywordPhrase", () => {
  it("resolves a mapped route through canonicalisation", () => {
    expect(findKeywordPhrase("/")).toBe("ai automation agency");
    expect(findKeywordPhrase("/blogs")).toBe("ai automation blog");
    expect(findKeywordPhrase("/Blogs/")).toBe("ai automation blog");
    expect(findKeywordPhrase("https://www.blogspage.com/blogs?x=1")).toBe(
      "ai automation blog",
    );
  });

  it("returns null for the content-derived route families of Finding F-07", () => {
    expect(findKeywordPhrase("/blogs/some-post")).toBeNull();
    expect(findKeywordPhrase("/blogs/category/ai")).toBeNull();
    expect(findKeywordPhrase("/blogs/author/ravi")).toBeNull();
  });
});

describe("buildMetadata keyword wiring (Requirement 12.5)", () => {
  it("reports a title that drops the mapped phrase, and stays quiet when it carries it", () => {
    const errors: string[] = [];
    const original = console.error;
    console.error = (...args: unknown[]) => {
      errors.push(args.map(String).join(" "));
    };

    try {
      buildMetadata({
        path: "/blogs",
        title: "Insights and field notes from the studio team",
        description: "x".repeat(140),
      });
      const dropped = errors.filter((line) => line.includes("keyword phrase"));
      expect(dropped).toHaveLength(1);
      expect(dropped[0]).toContain("ai automation blog");

      errors.length = 0;
      buildMetadata({
        path: "/blogs",
        title: "The ai automation blog for operators and founders",
        description: "x".repeat(140),
      });
      expect(errors.filter((line) => line.includes("keyword phrase"))).toEqual(
        [],
      );
    } finally {
      console.error = original;
    }
  });
});
