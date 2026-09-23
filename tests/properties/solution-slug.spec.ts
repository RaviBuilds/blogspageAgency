import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { APPROVED_CITIES } from "@/lib/cities";
import {
  NICHES,
  allNicheParams,
  nicheSlug,
  resolveSolutionSlug,
  slugify,
  type Niche,
} from "@/lib/niches";

/**
 * Feature: seo-audit-and-optimization
 *
 * Property 29: The solutions resolver accepts exactly the approved city tokens
 *
 * *For any* Service_Catalog niche and *for any* string city token,
 * `resolveSolutionSlug` applied to the slug built from that niche template and
 * that token returns a match carrying that niche and that city if and only if
 * the token, lowercased, is a member of `APPROVED_CITIES`, and returns `null`
 * in every other case; and *for any* string that matches no niche slug
 * template, it returns `null`.
 *
 * **Validates: Requirements 3.4, 3.5, 3.6**
 *
 * Property 30: The generated route set equals the resolvable set
 * (pure-function half over `allNicheParams`; the hub-anchor half is task 15.8)
 *
 * *For any* entry returned by `allNicheParams`, `resolveSolutionSlug` on that
 * entry's slug returns a non-null match; *for any* pairing of a
 * Service_Catalog niche with an approved city, `allNicheParams` contains the
 * corresponding slug exactly once.
 *
 * **Validates: Requirements 3.4, 6.1, 7.1**
 */

// ---------------------------------------------------------------------------
// Oracle
// ---------------------------------------------------------------------------

const APPROVED_TOKENS = APPROVED_CITIES.map((city) => city.token);

/** The literal fragment each niche template contributes before its `[city]` token. */
const NICHE_PREFIXES = NICHES.map((niche) => slugify(niche.slugTemplate.split("[city]")[0]));

// ---------------------------------------------------------------------------
// Generators
//
// Near-miss tokens are the point of this test, not padding: the audited resolver
// captured `[a-z0-9-]+` and returned it unchecked, so every near miss rendered
// its own live, self-canonicalising, indexable page — the audit's one critical
// finding. Each near miss below must now 404.
// ---------------------------------------------------------------------------

/** Exact approved tokens: the accepting side of the biconditional. */
const approvedToken = fc.constantFrom(...APPROVED_TOKENS);

/**
 * Case variants of approved tokens. The resolver lowercases the whole slug
 * segment before matching, so these must resolve too (Requirement 3.4).
 */
const casedApprovedToken = approvedToken.chain((token) =>
  fc
    .array(fc.boolean(), { minLength: token.length, maxLength: token.length })
    .map((upper) =>
      [...token].map((char, index) => (upper[index] ? char.toUpperCase() : char)).join(""),
    ),
);

/**
 * Tokens one edit away from an approved one, plus the shapes an attacker would
 * try. A leading hyphen is excluded for the reason given on
 * {@link arbitraryToken}; it is covered as a raw-resolver example instead.
 */
const nearMissToken = fc.oneof(
  fc.constantFrom(
    "hyderabad2",
    "hyderabadd",
    "hyderaba",
    "hyderbad",
    "hyder-abad",
    "hyderabad-",
    "hy-derabad",
    "0hyderabad",
    "mumbai",
    "delhi",
    "bengaluru",
    "new-york",
    "city",
    "x",
    "",
  ),
  approvedToken.map((token) => `${token}${token}`),
  approvedToken.map((token) => token.slice(1)),
  approvedToken.map((token) => `${token}-1`),
  approvedToken.map((token) => `1-${token}`),
);

/**
 * Arbitrary tokens over the alphabet the capture group admits, in both cases.
 *
 * Generator contract, asserted below: the token that ends up embedded in the
 * built slug is exactly the token generated, lowercased, so the "token,
 * lowercased" phrasing of Property 29 talks about the same value the resolver
 * sees. Two rewrites are therefore excluded, since `slugify` collapses hyphen
 * runs while building the slug and every niche template ends `-at-[city]`:
 *
 *   - doubled hyphens inside the token
 *   - a leading hyphen, which merges with the template's own trailing hyphen
 *
 * Both are unrepresentable as built slugs rather than accepted: a raw URL
 * segment carrying `at--hyderabad` still resolves to `null`, which the example
 * test below pins.
 */
const arbitraryToken = fc
  .string({
    unit: fc.constantFrom(..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-"),
    maxLength: 24,
  })
  .map((token) => token.replace(/-{2,}/g, "-").replace(/^-/, ""));

const cityToken = fc.oneof(
  approvedToken,
  casedApprovedToken,
  nearMissToken,
  arbitraryToken,
);

const niche = fc.constantFrom(...NICHES);

/** Slug-shaped strings unrelated to any niche template, plus hostile literals. */
const foreignSlug = fc.oneof(
  fc.constantFrom(
    "",
    "-",
    "hyderabad",
    "gym",
    "gym-business-solution-website",
    "business-solution-website-at-hyderabad",
    "gym-business-solution-website-at",
    "GYM-BUSINESS-SOLUTION-WEBSITE-AT-HYDERABAD-EXTRA",
    "../gym-business-solution-website-at-hyderabad",
    "gym-business-solution-website-at-hyderabad/extra",
    "gym-business-solution-website-at-hyderabad?q=1",
    "gym business solution website at hyderabad",
    "gym-business-solution-website-at-hydérabad",
    "😀",
  ),
  fc.string({ unit: "binary", maxLength: 60 }),
  fc.string({
    unit: fc.constantFrom(..."abcdefghijklmnopqrstuvwxyz0123456789-"),
    maxLength: 60,
  }),
);

// ---------------------------------------------------------------------------
// Property 29
// ---------------------------------------------------------------------------

describe("Property 29: The solutions resolver accepts exactly the approved city tokens", () => {
  it("keeps the generator honest: the built slug embeds the generated token verbatim", () => {
    fc.assert(
      fc.property(niche, cityToken, (entry, token) => {
        expect(slugify(token)).toBe(token.toLowerCase());
        if (token !== "") {
          expect(nicheSlug(entry, token).endsWith(token.toLowerCase())).toBe(true);
        }
      }),
      { numRuns: 300 },
    );
  });

  it("resolves a niche-template slug if and only if its city token is approved", () => {
    fc.assert(
      fc.property(niche, cityToken, (entry, token) => {
        const slug = nicheSlug(entry, token);
        const match = resolveSolutionSlug(slug);
        const expected = APPROVED_TOKENS.includes(token.toLowerCase());

        if (expected) {
          expect(match).not.toBeNull();
          expect(match?.niche.id).toBe(entry.id);
          expect(match?.city.token).toBe(token.toLowerCase());
          expect(match?.city.displayName).not.toBe("");
        } else {
          // Requirement 3.5: an unapproved token is a 404, so no page and no
          // canonical URL exist for it.
          expect(match).toBeNull();
        }
      }),
      { numRuns: 500 },
    );
  });

  it("returns null for every near-miss token across every niche", () => {
    fc.assert(
      fc.property(niche, nearMissToken, (entry, token) => {
        fc.pre(!APPROVED_TOKENS.includes(token.toLowerCase()));
        expect(resolveSolutionSlug(nicheSlug(entry, token))).toBeNull();
      }),
      { numRuns: 300 },
    );
  });

  it("returns null for any string that matches no niche slug template", () => {
    fc.assert(
      fc.property(foreignSlug, (slug) => {
        const match = resolveSolutionSlug(slug);
        if (match === null) return;

        // A non-null result is only allowed when the slug really is a niche
        // template filled with an approved city, which pins the accepting side
        // of the biconditional from the other direction.
        const normalised = slug.trim().toLowerCase();
        expect(normalised).toBe(nicheSlug(match.niche, match.city.token));
        expect(APPROVED_TOKENS).toContain(match.city.token);
      }),
      { numRuns: 500 },
    );

    expect(resolveSolutionSlug("")).toBeNull();
    expect(resolveSolutionSlug("gym-business-solution-website-at-")).toBeNull();
    expect(resolveSolutionSlug("gym-business-solution-website-at-mumbai")).toBeNull();
    expect(resolveSolutionSlug("not-a-niche-at-hyderabad")).toBeNull();
    // Raw segments that no built slug can produce, handed straight to the
    // resolver: the captured token is `-hyderabad` and `hyderabad-`, neither of
    // which is on the list, so both 404 rather than duplicating a live page.
    expect(resolveSolutionSlug("gym-business-solution-website-at--hyderabad")).toBeNull();
    expect(resolveSolutionSlug("gym-business-solution-website-at-hyderabad-")).toBeNull();
  });

  it("accepts the mixed-case and padded spellings of an approved slug", () => {
    const entry: Niche = NICHES[0];
    const slug = nicheSlug(entry, APPROVED_TOKENS[0]);

    expect(resolveSolutionSlug(slug)?.niche.id).toBe(entry.id);
    expect(resolveSolutionSlug(slug.toUpperCase())?.city.token).toBe(APPROVED_TOKENS[0]);
    expect(resolveSolutionSlug(`  ${slug}  `)?.city.token).toBe(APPROVED_TOKENS[0]);
  });
});

// ---------------------------------------------------------------------------
// Property 30
// ---------------------------------------------------------------------------

describe("Property 30: The generated route set equals the resolvable set", () => {
  it("resolves every slug returned by allNicheParams", () => {
    fc.assert(
      fc.property(fc.constantFrom(...allNicheParams()), ({ slug }) => {
        const match = resolveSolutionSlug(slug);
        expect(match).not.toBeNull();
        expect(APPROVED_TOKENS).toContain(match?.city.token);
        expect(NICHES.map((entry) => entry.id)).toContain(match?.niche.id);
      }),
      { numRuns: 200 },
    );

    // `generateStaticParams` plus `dynamicParams = false` makes this the whole
    // served route space, so the enumeration is checked exhaustively too.
    for (const { slug } of allNicheParams()) {
      expect(resolveSolutionSlug(slug), slug).not.toBeNull();
    }
  });

  it("contains each niche-by-approved-city slug exactly once", () => {
    const slugs = allNicheParams().map((param) => param.slug);

    fc.assert(
      fc.property(niche, fc.constantFrom(...APPROVED_CITIES), (entry, city) => {
        const expected = nicheSlug(entry, city.token);
        expect(slugs.filter((slug) => slug === expected)).toHaveLength(1);
      }),
      { numRuns: 200 },
    );

    // Requirement 6.1: exactly one entry per Indexable_Route, no duplicates.
    expect(slugs).toHaveLength(NICHES.length * APPROVED_CITIES.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("emits only slugs that match a niche prefix, so the set is the cross product", () => {
    for (const { slug } of allNicheParams()) {
      expect(NICHE_PREFIXES.some((prefix) => slug.startsWith(prefix)), slug).toBe(true);
      expect(slug, slug).toMatch(/^[a-z0-9-]+$/);
    }
  });
});
