import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { createHeadingSlugger, slugifyHeading } from "@/lib/heading-slug";

/**
 * Feature: seo-audit-and-optimization
 *
 * Property 27: Heading slugs are lowercase, non-empty, and deterministic
 *
 * *For any* heading text, `slugifyHeading` returns a non-empty string containing
 * only lowercase letters, digits, and hyphens, with no leading hyphen, no
 * trailing hyphen, and no consecutive hyphens, and returns the identical value
 * for the identical input on every invocation.
 *
 * **Validates: Requirements 9.5**
 *
 * Property 28: Heading slugs are unique within a route with deterministic
 * collision suffixes
 *
 * *For any* sequence of heading texts, the slugger assigns a distinct `id` to
 * every heading in the sequence; the first occurrence of a base slug receives
 * the unsuffixed value; each later occurrence receives that base slug with an
 * appended numeric suffix reflecting its ordinal among occurrences; and
 * re-running the slugger over the same sequence produces the identical list of
 * ids. (Pure-function half only; the rendered-HTML half is task 15.6.)
 *
 * **Validates: Requirements 9.5**
 */

// ---------------------------------------------------------------------------
// Shape oracle
//
// One regex carries four of Property 27's clauses at once: non-empty, alphabet
// restricted to lowercase letters and digits and hyphens, no edge hyphen, and
// no hyphen run. A slug is therefore one or more `[a-z0-9]` groups joined by
// single hyphens.
// ---------------------------------------------------------------------------

const SLUG_SHAPE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** `-2`, `-3`, ... : the collision suffix Requirement 9.5 calls for. */
const SUFFIX_SHAPE = /^-([2-9]|[1-9][0-9]+)$/;

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

/** Any code point in the full Unicode range, so nothing about the input is assumed. */
const anyText = fc.string({ unit: "binary", maxLength: 60 });

/** Printable graphemes, including multi-code-point clusters and emoji. */
const graphemeText = fc.string({ unit: "grapheme", maxLength: 30 });

/** Punctuation-only headings: every character is stripped, so the fallback fires. */
const punctuationText = fc.string({
  unit: fc.constantFrom(..."!?.,;:'\"()[]{}<>/\\|@#$%^&*+=~`_–—…«»¿¡"),
  minLength: 1,
  maxLength: 20,
});

/** CJK-only headings: no Latin transliteration exists, so the fallback fires. */
const cjkText = fc.string({
  unit: fc.constantFrom(..."漢字日本語中文한글台北東京測試ひらがなカタカナ"),
  minLength: 1,
  maxLength: 20,
});

/** Accented and compatibility forms, which NFKD is expected to fold into ASCII. */
const accentedText = fc.string({
  unit: fc.constantFrom(
    "é",
    "ü",
    "ñ",
    "Å",
    "Ω",
    "Ⅳ",
    "ﬁ",
    "Ｇ",
    "ı",
    "İ",
    " ",
    "-",
    "a",
    "Z",
    "7",
  ),
  minLength: 1,
  maxLength: 20,
});

/** Whitespace-only headings, including non-breaking and exotic separators. */
const whitespaceText = fc.string({
  unit: fc.constantFrom(" ", "\t", "\n", "\r", "\u00a0", "\u2028", "\u3000"),
  minLength: 1,
  maxLength: 10,
});

const headingText = fc.oneof(
  anyText,
  graphemeText,
  punctuationText,
  cjkText,
  accentedText,
  whitespaceText,
);

/**
 * A small pool of heading texts, so an arbitrary-length sequence drawn from it
 * collides often. `"Setup 2"` is deliberately included: its own slug matches the
 * suffixed form another heading in the sequence may already hold.
 */
const collidingHeading = fc.oneof(
  fc.constantFrom(
    "Setup",
    "setup",
    "SET UP",
    "  Setup  ",
    "Setup 2",
    "Setup 3",
    "Overview",
    "Overview!",
    "第一章",
    "!!!",
    "",
  ),
  headingText,
);

const headingSequence = fc.array(collidingHeading, { maxLength: 25 });

/**
 * Heading texts whose slugs carry no digit. A digit-free base can never equal
 * another base's suffixed form, which is the condition under which Property 28's
 * ordinal clause is exactly true — see the example tests below for the
 * adversarial sequences it excludes.
 */
const digitFreeHeading = fc.constantFrom(
  "Setup",
  "setup",
  "  SET   up ",
  "Overview",
  "Overview?",
  "Deploy the app",
  "deploy-the-app",
  "Résumé",
  "第一章",
  "",
  "   ",
);

const digitFreeSequence = fc.array(digitFreeHeading, { maxLength: 25 });

// ---------------------------------------------------------------------------
// Property 27
// ---------------------------------------------------------------------------

describe("Property 27: Heading slugs are lowercase, non-empty, and deterministic", () => {
  it("returns a non-empty lowercase slug with no edge or repeated hyphens for any text", () => {
    fc.assert(
      fc.property(headingText, (text) => {
        const slug = slugifyHeading(text);

        expect(slug).not.toBe("");
        expect(slug).toMatch(SLUG_SHAPE);
        expect(slug).toBe(slug.toLowerCase());
      }),
      { numRuns: 300 },
    );
  });

  it("returns the identical value for the identical input on every invocation", () => {
    fc.assert(
      fc.property(headingText, (text) => {
        const first = slugifyHeading(text);
        const second = slugifyHeading(text);
        // A structurally equal but distinct string instance, so the result cannot
        // depend on the identity of the argument.
        const third = slugifyHeading([...text].join(""));

        expect(second).toBe(first);
        expect(third).toBe(first);
      }),
      { numRuns: 300 },
    );
  });

  it("falls back to a usable anchor when the text normalises away to nothing", () => {
    fc.assert(
      fc.property(fc.oneof(punctuationText, cjkText, whitespaceText), (text) => {
        expect(slugifyHeading(text)).toMatch(SLUG_SHAPE);
      }),
      { numRuns: 200 },
    );

    expect(slugifyHeading("")).toBe("section");
    expect(slugifyHeading("   ")).toBe("section");
    expect(slugifyHeading("!!! ???")).toBe("section");
    expect(slugifyHeading("第一章")).toBe("section");
  });

  it("folds accents and compatibility forms rather than dropping the word", () => {
    expect(slugifyHeading("Résumé Générale")).toBe("resume-generale");
    expect(slugifyHeading("Section Ⅳ")).toBe("section-iv");
    expect(slugifyHeading("  Why   SEO  Matters  ")).toBe("why-seo-matters");
    expect(slugifyHeading("Next.js 15: What's New?")).toBe("nextjs-15-whats-new");
  });
});

// ---------------------------------------------------------------------------
// Property 28
// ---------------------------------------------------------------------------

/** Run a fresh slugger over a sequence of heading texts. */
function slugSequence(texts: readonly string[]): string[] {
  const slugger = createHeadingSlugger();
  return texts.map((text) => slugger(text));
}

describe("Property 28: Heading slugs are unique within a route with deterministic collision suffixes", () => {
  it("assigns a distinct, well-shaped id to every heading in the sequence", () => {
    fc.assert(
      fc.property(headingSequence, (texts) => {
        const ids = slugSequence(texts);

        expect(ids).toHaveLength(texts.length);
        expect(new Set(ids).size).toBe(ids.length);

        ids.forEach((id, index) => {
          const base = slugifyHeading(texts[index]);
          expect(id).toMatch(SLUG_SHAPE);
          // Every id is its own base slug, or that base slug plus a numeric suffix.
          if (id !== base) {
            expect(id.startsWith(`${base}-`)).toBe(true);
            expect(id.slice(base.length)).toMatch(SUFFIX_SHAPE);
          }
        });

        // The first heading of a route never needs disambiguating.
        if (texts.length > 0) {
          expect(ids[0]).toBe(slugifyHeading(texts[0]));
        }
      }),
      { numRuns: 300 },
    );
  });

  it("produces the identical list of ids when re-run over the same sequence", () => {
    fc.assert(
      fc.property(headingSequence, (texts) => {
        expect(slugSequence(texts)).toEqual(slugSequence(texts));
        // A second, independent slugger carries no state from the first.
        expect(slugSequence(texts)).toEqual(slugSequence([...texts]));
      }),
      { numRuns: 300 },
    );
  });

  it("numbers later occurrences of a base slug by their ordinal among occurrences", () => {
    fc.assert(
      fc.property(digitFreeSequence, (texts) => {
        const bases = texts.map((text) => slugifyHeading(text));
        // Generator contract: a digit-free base cannot collide with any suffixed id.
        for (const base of bases) {
          expect(base).not.toMatch(/[0-9]/);
        }

        const ids = slugSequence(texts);
        const seen = new Map<string, number>();

        ids.forEach((id, index) => {
          const base = bases[index];
          const ordinal = (seen.get(base) ?? 0) + 1;
          seen.set(base, ordinal);

          expect(id).toBe(ordinal === 1 ? base : `${base}-${ordinal}`);
        });
      }),
      { numRuns: 200 },
    );
  });

  it("leaves the first occurrence unsuffixed and appends -2, -3 onward", () => {
    expect(slugSequence(["Overview", "Overview", "overview", "  OVERVIEW  "])).toEqual([
      "overview",
      "overview-2",
      "overview-3",
      "overview-4",
    ]);
    expect(slugSequence(["第一章", "!!!", ""])).toEqual(["section", "section-2", "section-3"]);
  });

  it("skips an id already taken when a heading's own slug matches a suffixed value", () => {
    // The slugger advances the ordinal in a loop, so "Setup" cannot be handed
    // the "setup-2" already issued to the literal heading "Setup 2".
    expect(slugSequence(["Setup", "Setup 2", "Setup"])).toEqual(["setup", "setup-2", "setup-3"]);

    // Same collision reached from the other direction: the base slug "setup-2"
    // is itself already taken, so this first occurrence of it is suffixed too.
    // Uniqueness holds, which is what Requirement 9.5 asks for, but the
    // "first occurrence is unsuffixed" clause of Property 28 does not apply to
    // sequences whose heading text slugifies to another heading's suffixed id.
    expect(slugSequence(["Setup", "Setup", "Setup 2"])).toEqual([
      "setup",
      "setup-2",
      "setup-2-2",
    ]);
  });
});
