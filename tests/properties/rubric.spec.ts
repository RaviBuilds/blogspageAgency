import fc from "fast-check";
import { describe, expect, it } from "vitest";

import {
  RUBRIC,
  computeContributions,
  computeOverallScore,
  rankByPointsLost,
  type CategoryScore,
} from "@/lib/rubric";

/**
 * Feature: seo-audit-and-optimization
 *
 * Property 1: Rubric scoring is a correct weighted mean
 *
 * *For any* vector of ten Category_Scores drawn from the 0.5-step range 0 to 10,
 * `computeOverallScore` returns a value between 0.0 and 10.0 carrying exactly one
 * decimal place that equals the sum of score times weight divided by 100 rounded
 * half-up; the ten contributions each rounded to two decimals sum to within 0.05
 * of that value; and `rankByPointsLost` returns a permutation of the ten
 * categories ordered by descending weight times the difference between 10 and
 * score, whose first three elements are the categories named as the largest
 * shortfall contributors.
 *
 * **Validates: Requirements 2.4, 2.6, 2.9**
 */

// ---------------------------------------------------------------------------
// Integer oracle
//
// A score is held as `halves`: an integer count of 0.5 points, 0..20. Every
// oracle value below is computed in integer arithmetic, because an oracle
// written as `Math.round(x * 10) / 10` or `x.toFixed(1)` decides `.05`
// boundaries by the binary representation of the value rather than its decimal
// value, and would therefore assert the wrong answer at exactly the inputs this
// property exists to cover.
// ---------------------------------------------------------------------------

const HALVES_DOMAIN = { min: 0, max: 20 } as const;
const CATEGORY_COUNT = RUBRIC.length;

/** sum(halves * weight): exact, and proportional to the weighted total. */
function weightedHalves(halves: readonly number[]): number {
  return halves.reduce((total, half, index) => total + half * RUBRIC[index].weight, 0);
}

/**
 * The Overall_Score in tenths.
 *
 * true score = sum(halves * weight) / 200, so tenths = sum / 20, and half-up on
 * that division is floor((sum + 10) / 20).
 */
function overallTenths(halves: readonly number[]): number {
  return Math.floor((weightedHalves(halves) + 10) / 20);
}

/** One contribution in hundredths: halves * weight / 2, rounded half-up. */
function contributionHundredths(half: number, weight: number): number {
  return Math.floor((half * weight + 1) / 2);
}

/** The exact ordering key for points lost: weight * (10 - score), scaled by 2. */
function pointsLostKey(half: number, weight: number): number {
  return (20 - half) * weight;
}

function toCategoryScores(halves: readonly number[]): CategoryScore[] {
  return RUBRIC.map((category, index) => ({
    name: category.name,
    weight: category.weight,
    score: halves[index] / 2,
    contribution: 0,
    anchorUsed: 0 as const,
    evidence: `generated score ${halves[index] / 2}`,
    findingIds: [],
  }));
}

/** The oracle ranking: points lost descending, then weight descending, then name ascending. */
function expectedRanking(halves: readonly number[]): string[] {
  return RUBRIC.map((category, index) => ({
    name: category.name,
    weight: category.weight,
    key: pointsLostKey(halves[index], category.weight),
  }))
    .sort((a, b) => b.key - a.key || b.weight - a.weight || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
    .map((entry) => entry.name);
}

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

const uniformVector = fc.array(fc.integer(HALVES_DOMAIN), {
  minLength: CATEGORY_COUNT,
  maxLength: CATEGORY_COUNT,
});

/** `a^-1 mod m`, or null when `a` is not invertible. */
function modInverse(a: number, m: number): number | null {
  for (let x = 1; x < m; x += 1) {
    if ((a * x) % m === 1) return x;
  }
  return null;
}

/**
 * A category whose weight is invertible mod 20, so one score can be solved for
 * to place the weighted total exactly on a `.05` boundary in tenths.
 */
const PIVOT_INDEX = RUBRIC.findIndex((category) => modInverse(category.weight % 20, 20) !== null);
const PIVOT_INVERSE = modInverse(RUBRIC[PIVOT_INDEX]?.weight % 20, 20);

/**
 * Score vectors whose weighted total lands exactly halfway between two tenths,
 * where half-up rounding is decidable and float accumulation diverges.
 */
const boundaryVector = uniformVector.map((halves) => {
  const adjusted = [...halves];
  adjusted[PIVOT_INDEX] = 0;
  const rest = weightedHalves(adjusted);
  // solve weight * h === 10 - rest (mod 20)
  adjusted[PIVOT_INDEX] = (((((10 - rest) % 20) + 20) % 20) * (PIVOT_INVERSE as number)) % 20;
  return adjusted;
});

const scoreVector = fc.oneof(uniformVector, boundaryVector);

// ---------------------------------------------------------------------------
// Property 1
// ---------------------------------------------------------------------------

describe("Property 1: Rubric scoring is a correct weighted mean", () => {
  it("has a pivot category whose weight is invertible mod 20", () => {
    expect(PIVOT_INDEX).toBeGreaterThanOrEqual(0);
    expect(PIVOT_INVERSE).not.toBeNull();
  });

  it("computeOverallScore is the half-up weighted mean, in 0.0..10.0, to one decimal place", () => {
    fc.assert(
      fc.property(scoreVector, (halves) => {
        const scores = toCategoryScores(halves);
        const overall = computeOverallScore(scores);
        const expectedTenths = overallTenths(halves);

        expect(overall).toBe(expectedTenths / 10);
        expect(overall).toBeGreaterThanOrEqual(0);
        expect(overall).toBeLessThanOrEqual(10);
        expect(String(overall)).toMatch(/^\d+(\.\d)?$/);
      }),
      { numRuns: 300 }
    );
  });

  it("rounds a weighted total sitting exactly on a .05 boundary upward", () => {
    fc.assert(
      fc.property(boundaryVector, (halves) => {
        const total = weightedHalves(halves);
        // The generator's contract: the true score is exactly n.n5.
        expect(total % 20).toBe(10);

        const overall = computeOverallScore(toCategoryScores(halves));
        // Half-up takes the upper tenth: (total + 10) / 20 is exact here.
        const tenths = (total + 10) / 20;
        expect(tenths).toBe(Math.floor(total / 20) + 1);
        expect(overall).toBe(tenths / 10);
      }),
      { numRuns: 200 }
    );
  });

  it("the ten two-decimal contributions sum to within 0.05 of the Overall_Score", () => {
    fc.assert(
      fc.property(scoreVector, (halves) => {
        const scores = toCategoryScores(halves);
        const contributions = computeContributions(scores);
        const overall = computeOverallScore(scores);

        expect(contributions).toHaveLength(CATEGORY_COUNT);

        let sumHundredths = 0;
        contributions.forEach((entry, index) => {
          const expectedHundredths = contributionHundredths(halves[index], RUBRIC[index].weight);
          expect(entry.contribution).toBe(expectedHundredths / 100);
          sumHundredths += expectedHundredths;
        });

        // Compare in hundredths so the tolerance check itself carries no float error.
        expect(Math.abs(sumHundredths - Math.round(overall * 100))).toBeLessThanOrEqual(5);
      }),
      { numRuns: 300 }
    );
  });

  it("rankByPointsLost is a permutation ordered by descending weighted points lost", () => {
    fc.assert(
      fc.property(scoreVector, (halves) => {
        const scores = toCategoryScores(halves);
        const ranked = rankByPointsLost(scores);

        // A permutation of the ten categories.
        expect(ranked).toHaveLength(CATEGORY_COUNT);
        expect([...ranked].map((entry) => entry.name).sort()).toEqual(
          RUBRIC.map((category) => category.name).sort()
        );

        // Ordered by the exact key, ties broken by weight then name.
        expect(ranked.map((entry) => entry.name)).toEqual(expectedRanking(halves));

        const keyOf = (name: string) => {
          const index = RUBRIC.findIndex((category) => category.name === name);
          return pointsLostKey(halves[index], RUBRIC[index].weight);
        };
        const keys = ranked.map((entry) => keyOf(entry.name));
        for (let i = 1; i < keys.length; i += 1) {
          expect(keys[i - 1]).toBeGreaterThanOrEqual(keys[i]);
        }

        // The first three are the largest shortfall contributors.
        const head = keys.slice(0, 3);
        const tail = keys.slice(3);
        for (const tailKey of tail) {
          expect(Math.min(...head)).toBeGreaterThanOrEqual(tailKey);
        }
      }),
      { numRuns: 300 }
    );
  });
});
