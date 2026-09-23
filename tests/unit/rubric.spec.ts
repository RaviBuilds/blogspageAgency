import { describe, expect, it } from "vitest";

import {
  RUBRIC,
  computeContributions,
  computeOverallScore,
  findRubricCategory,
  type CategoryScore,
  type RubricCategoryName,
} from "@/lib/rubric";

/**
 * Example-based checks on the shape of the published rubric and on the
 * treatment of an unmeasured category. Universal properties of the arithmetic
 * live in tests/properties/rubric.spec.ts.
 */

const EXPECTED_CATEGORY_NAMES: readonly RubricCategoryName[] = [
  "Crawlability and Indexation",
  "Canonicalisation and Duplicate Control",
  "Metadata and Social Previews",
  "Structured Data and Entity Graph",
  "Content and Keyword Architecture",
  "Site Architecture and Internal Linking",
  "Core Web Vitals and Rendering",
  "Semantic HTML and Accessibility",
  "Authority and E-E-A-T Signals",
  "AI and LLM Discoverability",
];

/** One CategoryScore per rubric category, scores spread across the 0..10 range. */
function sampleScores(): CategoryScore[] {
  const scores = [10, 7.5, 5, 2.5, 0, 9, 6.5, 4, 8.5, 3];
  return RUBRIC.map((category, index) => ({
    name: category.name,
    weight: category.weight,
    score: scores[index],
    contribution: 0,
    anchorUsed: (scores[index] >= 7.5 ? 10 : scores[index] >= 2.5 ? 5 : 0) as 0 | 5 | 10,
    evidence: `observed evidence for ${category.name}`,
    findingIds: [],
  }));
}

describe("RUBRIC shape (Requirements 2.1, 2.2, 2.3)", () => {
  it("defines exactly the ten named categories, each name distinct", () => {
    expect(RUBRIC).toHaveLength(10);
    expect(RUBRIC.map((category) => category.name)).toEqual(EXPECTED_CATEGORY_NAMES);
    expect(new Set(RUBRIC.map((category) => category.name)).size).toBe(10);
  });

  it("rejects category names outside the closed set", () => {
    for (const name of EXPECTED_CATEGORY_NAMES) {
      expect(findRubricCategory(name)?.name).toBe(name);
    }
    expect(findRubricCategory("Crawlability")).toBeNull();
    expect(findRubricCategory("crawlability and indexation")).toBeNull();
    expect(findRubricCategory("")).toBeNull();
  });

  it("weights each category with an integer from 5 to 20", () => {
    for (const category of RUBRIC) {
      expect(Number.isInteger(category.weight), category.name).toBe(true);
      expect(category.weight, category.name).toBeGreaterThanOrEqual(5);
      expect(category.weight, category.name).toBeLessThanOrEqual(20);
    }
  });

  it("sums the ten weights to exactly 100", () => {
    expect(RUBRIC.reduce((total, category) => total + category.weight, 0)).toBe(100);
  });

  it("gives each category three anchors at scores 0, 5, and 10", () => {
    for (const category of RUBRIC) {
      expect(category.anchors, category.name).toHaveLength(3);
      expect(
        category.anchors.map((anchor) => anchor.score),
        category.name
      ).toEqual([0, 5, 10]);
    }
  });

  it("states a non-empty artefact and threshold in every anchor", () => {
    for (const category of RUBRIC) {
      for (const anchor of category.anchors) {
        const label = `${category.name} @ ${anchor.score}`;
        expect(anchor.artefact.trim(), label).not.toBe("");
        expect(anchor.threshold.trim(), label).not.toBe("");
      }
    }
  });
});

describe("unmeasured categories (Requirement 2.8)", () => {
  it("contributes 0 and leaves every other contribution unchanged", () => {
    const baseline = computeContributions(sampleScores());
    const targetIndex = 1; // Canonicalisation and Duplicate Control, weight 12, scored 7.5.
    const formerContribution = baseline[targetIndex].contribution;
    expect(formerContribution).toBeGreaterThan(0);

    const withUnmeasured = sampleScores();
    withUnmeasured[targetIndex] = {
      ...withUnmeasured[targetIndex],
      unmeasured: { missingEvidence: "slug resolver allow-list not readable" },
    };
    const recomputed = computeContributions(withUnmeasured);

    expect(recomputed[targetIndex].contribution).toBe(0);
    for (let index = 0; index < baseline.length; index += 1) {
      if (index === targetIndex) continue;
      expect(recomputed[index].contribution, recomputed[index].name).toBe(
        baseline[index].contribution
      );
      expect(recomputed[index].score, recomputed[index].name).toBe(baseline[index].score);
      expect(recomputed[index].weight, recomputed[index].name).toBe(baseline[index].weight);
    }
  });

  it("drops the Overall_Score by exactly the unmeasured category's former contribution", () => {
    const baseScores = sampleScores();
    const targetIndex = 1;
    const formerContribution = computeContributions(baseScores)[targetIndex].contribution;
    expect(formerContribution).toBe(0.9);

    const withUnmeasured = sampleScores();
    withUnmeasured[targetIndex] = {
      ...withUnmeasured[targetIndex],
      unmeasured: { missingEvidence: "slug resolver allow-list not readable" },
    };

    const before = computeOverallScore(baseScores);
    const after = computeOverallScore(withUnmeasured);

    // Both scores carry one decimal place; compare in tenths to avoid float noise.
    expect(Math.round(before * 10) - Math.round(after * 10)).toBe(
      Math.round(formerContribution * 10)
    );
  });

  it("retains the recorded score of 0 semantics: an unmeasured 10 contributes nothing", () => {
    const perfect = sampleScores().map((entry) => ({ ...entry, score: 10 }));
    expect(computeOverallScore(perfect)).toBe(10);

    const oneUnmeasured = perfect.map((entry, index) =>
      index === 0 ? { ...entry, unmeasured: { missingEvidence: "sitemap not served" } } : entry
    );
    const contributions = computeContributions(oneUnmeasured);
    expect(contributions[0].contribution).toBe(0);
    // Crawlability and Indexation carries weight 12, so 10 * 88 / 100 remains.
    expect(RUBRIC[0].weight).toBe(12);
    expect(computeOverallScore(oneUnmeasured)).toBe(8.8);
  });
});
