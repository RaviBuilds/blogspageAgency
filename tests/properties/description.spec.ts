import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { DESCRIPTION_MAX, DESCRIPTION_MIN, clampDescription } from "@/lib/seo";

/**
 * Feature: seo-audit-and-optimization
 *
 * Property 17: Description clamping lands inside the window
 *
 * *For any* body text, `clampDescription` returns a string of 120 to 160
 * characters inclusive whenever the input contains at least 120 characters of
 * extractable text, never cuts inside a word, and returns the identical value
 * for the identical input.
 *
 * **Validates: Requirements 4.11**
 *
 * Two documented behaviours the assertions below respect rather than contradict:
 *
 * 1. "Extractable text" is measured *after* whitespace collapse, the same way a
 *    crawler reads the rendered attribute. Input that collapses to fewer than
 *    120 characters is returned as-is — padding it would mean inventing copy,
 *    and the design puts extension at the call site (`resolveDescription`).
 *    The length clause of Property 17 is therefore conditional on the input
 *    carrying 120 extractable characters, and that condition is checked, not
 *    assumed.
 * 2. When no space falls inside the [120, 160] window, the length bound wins and
 *    the text is hard-cut at 160. That is a single token spanning the whole
 *    window, which prose does not produce, so the word-boundary clause is
 *    asserted over prose generators and the hard cut is pinned as explicit
 *    examples below.
 */

// ---------------------------------------------------------------------------
// Oracle
// ---------------------------------------------------------------------------

/** The same normalisation `clampDescription` applies before it measures anything. */
const collapse = (text: string): string => text.replace(/\s+/g, " ").trim();

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

const WORDS = [
  "Blogspage",
  "builds",
  "AI",
  "automation",
  "agents",
  "for",
  "founders",
  "in",
  "Hyderabad",
  "shipping",
  "production",
  "systems",
  "that",
  "cut",
  "manual",
  "operations",
  "and",
  "compound",
  "organic",
  "search",
  "demand",
  "across",
  "every",
  "revenue",
  "route",
  "of",
  "the",
  "business",
  "measurably",
  "week",
  "over",
  "week",
];

/**
 * Realistic prose: words of at most 10 characters joined by whitespace runs.
 * With a maximum token length well under the 41-character window, some space
 * always falls inside [120, 160], which is the condition under which the
 * word-boundary clause is exactly true.
 */
const prose = fc
  .array(fc.constantFrom(...WORDS), { minLength: 1, maxLength: 90 })
  .chain((words) =>
    fc
      .array(fc.constantFrom(" ", "  ", "\n", "\t", " \n ", "\u00a0"), {
        minLength: words.length,
        maxLength: words.length,
      })
      .map((separators) =>
        words.map((word, index) => `${word}${separators[index]}`).join(""),
      ),
  );

/** Prose padded to guarantee the input clears the 120-character floor. */
const longProse = prose.filter((text) => collapse(text).length > DESCRIPTION_MAX);

/** Prose that collapses to under the floor, exercising the return-as-is branch. */
const shortProse = prose.filter((text) => collapse(text).length < DESCRIPTION_MIN);

/** Arbitrary text, so the length and determinism clauses are not prose-only claims. */
const anyText = fc.oneof(
  fc.string({ unit: "binary", maxLength: 400 }),
  fc.string({ unit: "grapheme", maxLength: 200 }),
  prose,
  fc.string({
    unit: fc.constantFrom(" ", "\n", "\t", "a", "Z", "9", "-", "é", "日", "😀", "\u00a0"),
    maxLength: 400,
  }),
);

// ---------------------------------------------------------------------------
// Property 17
// ---------------------------------------------------------------------------

describe("Property 17: Description clamping lands inside the window", () => {
  it("returns 120 to 160 characters whenever the input carries at least 120 extractable characters", () => {
    fc.assert(
      fc.property(anyText, (text) => {
        const normalised = collapse(text);
        const result = clampDescription(text);

        if (normalised.length >= DESCRIPTION_MIN) {
          expect(result.length).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
          expect(result.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
        } else {
          // Documented behaviour: short input is returned as-is rather than
          // padded. The call site extends it from real body text.
          expect(result).toBe(normalised);
        }
      }),
      { numRuns: 400 },
    );
  });

  it("always returns a whitespace-collapsed prefix of the normalised text", () => {
    fc.assert(
      fc.property(anyText, (text) => {
        const normalised = collapse(text);
        const result = clampDescription(text);

        expect(normalised.startsWith(result)).toBe(true);
        expect(result.length).toBeLessThanOrEqual(normalised.length);
        expect(result).not.toMatch(/\s\s/);
        expect(result).toBe(result.trim());
      }),
      { numRuns: 400 },
    );
  });

  it("never cuts inside a word for prose input", () => {
    fc.assert(
      fc.property(longProse, (text) => {
        const normalised = collapse(text);
        const result = clampDescription(text);

        expect(result.length).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
        expect(result.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
        // The cut lands on a space, so the character after the returned prefix
        // is the separator rather than the middle of a token.
        expect(normalised[result.length]).toBe(" ");
        expect(result.endsWith(" ")).toBe(false);
        // Every word in the result is a whole word of the source text.
        const sourceWords = normalised.split(" ");
        for (const word of result.split(" ")) {
          expect(sourceWords).toContain(word);
        }
      }),
      { numRuns: 300 },
    );
  });

  it("returns the identical value for the identical input", () => {
    fc.assert(
      fc.property(anyText, (text) => {
        const first = clampDescription(text);
        // A structurally equal but distinct string instance, so the result
        // cannot depend on the identity of the argument.
        const second = clampDescription([...text].join(""));

        expect(clampDescription(text)).toBe(first);
        expect(second).toBe(first);
      }),
      { numRuns: 400 },
    );
  });

  it("returns collapsed text unchanged when it already fits the window", () => {
    fc.assert(
      fc.property(
        prose.filter((text) => {
          const length = collapse(text).length;
          return length >= DESCRIPTION_MIN && length <= DESCRIPTION_MAX;
        }),
        (text) => {
          expect(clampDescription(text)).toBe(collapse(text));
        },
      ),
      { numRuns: 200 },
    );
  });

  it("returns short input as-is rather than padding invented copy", () => {
    fc.assert(
      fc.property(shortProse, (text) => {
        expect(clampDescription(text)).toBe(collapse(text));
      }),
      { numRuns: 200 },
    );

    expect(clampDescription("")).toBe("");
    expect(clampDescription("   \n\t ")).toBe("");
    expect(clampDescription("  Short   excerpt.  ")).toBe("Short excerpt.");
  });

  it("hard-cuts at 160 when no space falls inside the window", () => {
    // A single token spanning the whole [120, 160] window: the length bound is
    // the acceptance criterion, the word boundary is the quality rule layered
    // on top, and one of the two has to yield.
    const singleToken = "x".repeat(400);
    expect(clampDescription(singleToken)).toHaveLength(DESCRIPTION_MAX);
    expect(clampDescription(singleToken)).toBe("x".repeat(DESCRIPTION_MAX));

    // The only space sits before the window, so the loop finds nothing.
    const earlySpaceOnly = `word ${"y".repeat(400)}`;
    const clamped = clampDescription(earlySpaceOnly);
    expect(clamped).toHaveLength(DESCRIPTION_MAX);
    expect(clamped).toBe(`word ${"y".repeat(DESCRIPTION_MAX - 5)}`);

    // The cut backs off one code unit rather than splitting a surrogate pair,
    // which is the one case a hard cut returns 159 characters.
    const surrogateAtBoundary = `${"a".repeat(DESCRIPTION_MAX - 1)}😀${"b".repeat(50)}`;
    const surrogateClamped = clampDescription(surrogateAtBoundary);
    expect(surrogateClamped).toHaveLength(DESCRIPTION_MAX - 1);
    expect(surrogateClamped).toBe("a".repeat(DESCRIPTION_MAX - 1));
    // Nothing is left dangling: the result carries no lone surrogate.
    expect(surrogateClamped).not.toMatch(/[\uD800-\uDFFF]/);
  });

  it("cuts long prose at the last space inside the window", () => {
    const sentence =
      "Blogspage builds AI automation and sales agents for founders in Hyderabad, " +
      "shipping production systems that cut manual operations and compound organic " +
      "search demand across every revenue route of the business.";

    const result = clampDescription(sentence);
    expect(result.length).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
    expect(result.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
    expect(sentence.startsWith(result)).toBe(true);
    expect(sentence[result.length]).toBe(" ");
  });
});
