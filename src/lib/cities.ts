/**
 * The Approved_City_List: the explicit enumeration of city tokens the
 * Solutions_Router serves as Indexable_Routes.
 *
 * This module is what bounds the `/solutions/<slug>` URL space. The audited
 * resolver matched any `[city]` token, so every string produced a
 * self-canonicalising, indexable page (audit Finding F-01). Requirement 3.3
 * constrains the list to between 1 and 50 tokens, each 2 to 40 characters of
 * lowercase letters, digits, and hyphens; `assertValidToken` enforces that at
 * module load so a future edit cannot quietly widen the space again.
 *
 * `displayName` is data rather than a `titleCase` derivation because casing
 * exceptions ("New Delhi", "Bengaluru") are not algorithmic, and Requirement
 * 12.7 needs an authoritative label for the `<h1>`, the meta description, and
 * the body text.
 *
 * Pure module: no I/O, no React, no framework imports.
 */

export type ApprovedCity = {
  /**
   * The slug token as it appears in a `/solutions/<slug>` path: 2 to 40
   * characters of lowercase letters, digits, and hyphens.
   */
  token: string;
  /** The human-readable label rendered in copy (Requirement 12.7). */
  displayName: string;
};

/** Requirement 3.3: 2 to 40 characters, lowercase letters, digits, hyphens. */
const TOKEN_PATTERN = /^[a-z0-9-]{2,40}$/;

/** Requirement 3.3: the list holds between 1 and 50 tokens. */
const MIN_CITIES = 1;
const MAX_CITIES = 50;

/**
 * Throws when a token violates Requirement 3.3. Called at module load over the
 * whole list, so an invalid entry fails the build rather than shipping an
 * unbounded route.
 */
function assertValidToken(token: string): void {
  if (!TOKEN_PATTERN.test(token)) {
    throw new Error(
      `Invalid approved city token "${token}": expected 2-40 characters of lowercase letters, digits, and hyphens.`,
    );
  }
}

/**
 * The Approved_City_List. Ships with the single token `hyderabad`, matching
 * `DEFAULT_CITY` in `src/lib/niches.ts` and the published NAP. Each added city
 * multiplies the solution route count by ten, so a new entry only belongs here
 * once its city-specific copy satisfies Requirement 12.7.
 */
export const APPROVED_CITIES: readonly ApprovedCity[] = [
  { token: "hyderabad", displayName: "Hyderabad" },
];

// Module-load invariant check (Requirement 3.3).
if (
  APPROVED_CITIES.length < MIN_CITIES ||
  APPROVED_CITIES.length > MAX_CITIES
) {
  throw new Error(
    `APPROVED_CITIES must hold between ${MIN_CITIES} and ${MAX_CITIES} entries; found ${APPROVED_CITIES.length}.`,
  );
}
for (const city of APPROVED_CITIES) {
  assertValidToken(city.token);
}

/**
 * Resolve a city token against the Approved_City_List.
 *
 * Total and pure: trims and lowercases the input, then matches exactly.
 * Returns `null` for anything not on the list, including the empty string,
 * which is what drives the 404 in Requirement 3.5.
 */
export function findApprovedCity(token: string): ApprovedCity | null {
  const normalised = token.trim().toLowerCase();
  if (normalised === "") return null;
  return APPROVED_CITIES.find((city) => city.token === normalised) ?? null;
}
