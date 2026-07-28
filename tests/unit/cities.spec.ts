import { describe, expect, it } from "vitest";

import { APPROVED_CITIES, findApprovedCity } from "@/lib/cities";

/**
 * Feature: seo-audit-and-optimization
 *
 * Example-based checks on the Approved_City_List and on the resolver that
 * bounds the `/solutions/<slug>` URL space.
 *
 * _Requirements: 3.3, 3.5_
 */

/** Requirement 3.3: 2 to 40 characters of lowercase letters, digits, hyphens. */
const TOKEN_PATTERN = /^[a-z0-9-]{2,40}$/;

describe("APPROVED_CITIES shape (Requirement 3.3)", () => {
  it("holds between 1 and 50 entries", () => {
    expect(APPROVED_CITIES.length).toBeGreaterThanOrEqual(1);
    expect(APPROVED_CITIES.length).toBeLessThanOrEqual(50);
  });

  it("gives every entry a token of 2 to 40 lowercase letters, digits, or hyphens", () => {
    for (const city of APPROVED_CITIES) {
      expect(city.token, city.token).toMatch(TOKEN_PATTERN);
      expect(city.token.length, city.token).toBeGreaterThanOrEqual(2);
      expect(city.token.length, city.token).toBeLessThanOrEqual(40);
    }
  });

  it("keeps every token distinct and every displayName non-empty", () => {
    const tokens = APPROVED_CITIES.map((city) => city.token);
    expect(new Set(tokens).size).toBe(tokens.length);
    for (const city of APPROVED_CITIES) {
      expect(city.displayName.trim(), city.token).not.toBe("");
    }
  });

  it("ships hyderabad, matching the published NAP", () => {
    expect(APPROVED_CITIES.map((city) => city.token)).toContain("hyderabad");
  });
});

describe("findApprovedCity (Requirements 3.3, 3.5)", () => {
  it("resolves an exact approved token", () => {
    expect(findApprovedCity("hyderabad")).toEqual({
      token: "hyderabad",
      displayName: "Hyderabad",
    });
  });

  it("resolves mixed-case input by lowercasing", () => {
    expect(findApprovedCity("Hyderabad")?.token).toBe("hyderabad");
    expect(findApprovedCity("HYDERABAD")?.token).toBe("hyderabad");
    expect(findApprovedCity("hYdErAbAd")?.token).toBe("hyderabad");
  });

  it("resolves padded input by trimming", () => {
    expect(findApprovedCity("  hyderabad ")?.token).toBe("hyderabad");
    expect(findApprovedCity("\thyderabad\n")?.token).toBe("hyderabad");
    expect(findApprovedCity("  Hyderabad  ")?.token).toBe("hyderabad");
  });

  it("returns null for a token absent from the list, driving the 404", () => {
    expect(findApprovedCity("mumbai")).toBeNull();
    expect(findApprovedCity("Hyderabad-2")).toBeNull();
    expect(findApprovedCity("hyder abad")).toBeNull();
    expect(findApprovedCity("../hyderabad")).toBeNull();
  });

  it("returns null for the empty string and for whitespace-only input", () => {
    expect(findApprovedCity("")).toBeNull();
    expect(findApprovedCity("   ")).toBeNull();
    expect(findApprovedCity("\n\t")).toBeNull();
  });

  it("returns the same entry object identity as the list holds", () => {
    const approved = APPROVED_CITIES[0];
    expect(findApprovedCity(approved.token.toUpperCase())).toBe(approved);
  });
});
