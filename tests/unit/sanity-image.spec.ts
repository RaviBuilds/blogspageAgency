import { describe, expect, it } from "vitest";

import { parseSanityImageRef } from "@/lib/sanity-image";

/**
 * Feature: seo-audit-and-optimization
 *
 * Example-based checks on the intrinsic-dimension parser that lets blog body
 * images render with explicit `width` and `height`, so the box is reserved
 * before the bytes arrive and the image contributes 0 to the route's CLS.
 *
 * The contract is total: `null` — never a throw — for every input the parser
 * cannot read with confidence, because a page render must not fail because an
 * editor's document carries an unexpected ref. Callers read `null` as
 * "intrinsic size unknown" and fall back to `fill` plus `sizes`.
 *
 * _Requirements: 11.2_
 */

/** A real Sanity image asset id: 40 hex characters, then `<width>x<height>`, then the extension. */
const REAL_REF = "image-a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2-1600x900-jpg";

describe("parseSanityImageRef: real asset refs (Requirement 11.2)", () => {
  it("reads the intrinsic dimensions from a bare ref string", () => {
    expect(parseSanityImageRef(REAL_REF)).toEqual({ width: 1600, height: 900 });
  });

  it("reads dimensions from the `{ asset: { _ref } }` shape Portable Text carries", () => {
    expect(parseSanityImageRef({ asset: { _ref: REAL_REF } })).toEqual({
      width: 1600,
      height: 900,
    });
  });

  it("reads dimensions from the `{ asset: { _id } }` shape an expanded asset carries", () => {
    expect(parseSanityImageRef({ asset: { _id: REAL_REF } })).toEqual({
      width: 1600,
      height: 900,
    });
  });

  it("reads dimensions from the top-level `{ _ref }` shape", () => {
    expect(parseSanityImageRef({ _ref: REAL_REF })).toEqual({ width: 1600, height: 900 });
  });

  it("prefers `asset._ref` over `asset._id` and over a top-level `_ref`", () => {
    expect(
      parseSanityImageRef({
        _ref: "image-abc-100x100-png",
        asset: { _ref: REAL_REF, _id: "image-abc-200x200-png" },
      }),
    ).toEqual({ width: 1600, height: 900 });

    expect(
      parseSanityImageRef({
        _ref: "image-abc-100x100-png",
        asset: { _id: "image-abc-200x200-png" },
      }),
    ).toEqual({ width: 200, height: 200 });
  });

  it("handles square, portrait, and other extensions", () => {
    expect(parseSanityImageRef("image-abc123-800x800-png")).toEqual({
      width: 800,
      height: 800,
    });
    expect(parseSanityImageRef("image-abc123-1080x1920-webp")).toEqual({
      width: 1080,
      height: 1920,
    });
    expect(parseSanityImageRef("image-abc123-1x1-JPG")).toEqual({ width: 1, height: 1 });
  });
});

describe("parseSanityImageRef: absent refs return null (Requirement 11.2)", () => {
  it("returns null for null and undefined", () => {
    expect(parseSanityImageRef(null)).toBeNull();
    expect(parseSanityImageRef(undefined)).toBeNull();
  });

  it("returns null for an object with no ref anywhere", () => {
    expect(parseSanityImageRef({})).toBeNull();
    expect(parseSanityImageRef({ asset: null })).toBeNull();
    expect(parseSanityImageRef({ asset: {} })).toBeNull();
    expect(parseSanityImageRef({ _ref: undefined, asset: { _ref: undefined } })).toBeNull();
  });

  it("returns null for the empty ref string", () => {
    expect(parseSanityImageRef("")).toBeNull();
    expect(parseSanityImageRef({ asset: { _ref: "" } })).toBeNull();
  });
});

describe("parseSanityImageRef: malformed refs return null (Requirement 11.2)", () => {
  it("returns null for a ref that is not an image asset", () => {
    expect(parseSanityImageRef("file-abc123-1600x900-pdf")).toBeNull();
    expect(parseSanityImageRef("image_abc123-1600x900-jpg")).toBeNull();
    expect(parseSanityImageRef("drafts.post-123")).toBeNull();
    expect(parseSanityImageRef({ asset: { _id: "author-ravi" } })).toBeNull();
  });

  it("returns null when the dimension segment is missing or incomplete", () => {
    expect(parseSanityImageRef("image-abc123-jpg")).toBeNull();
    expect(parseSanityImageRef("image-abc123-1600x900")).toBeNull();
    expect(parseSanityImageRef("image-abc123-1600-jpg")).toBeNull();
    expect(parseSanityImageRef("image-abc123-1600x-jpg")).toBeNull();
    expect(parseSanityImageRef("image-abc123-x900-jpg")).toBeNull();
    expect(parseSanityImageRef("image-abc123--jpg")).toBeNull();
  });

  it("returns null when a dimension is non-numeric, signed, or fractional", () => {
    expect(parseSanityImageRef("image-abc123-widthxheight-jpg")).toBeNull();
    expect(parseSanityImageRef("image-abc123-1600x9e2-jpg")).toBeNull();
    expect(parseSanityImageRef("image-abc123-16.0x900-jpg")).toBeNull();
    expect(parseSanityImageRef("image-abc123-+1600x900-jpg")).toBeNull();
    expect(parseSanityImageRef("image-abc123- 1600x900-jpg")).toBeNull();
  });

  it("returns null for a zero or otherwise non-positive dimension", () => {
    // Structurally valid in the ref, but `next/image` rejects a non-positive
    // width or height, so the caller must take the `fill` path instead.
    expect(parseSanityImageRef("image-abc123-0x900-jpg")).toBeNull();
    expect(parseSanityImageRef("image-abc123-1600x0-jpg")).toBeNull();
    expect(parseSanityImageRef("image-abc123-0x0-jpg")).toBeNull();
    expect(parseSanityImageRef("image-abc123--1600x900-jpg")).toBeNull();
  });

  it("returns null when the asset id itself carries a hyphen, which no Sanity id does", () => {
    // The id is matched as a single hyphen-free run: pinning the dimension
    // segment's position matters more than admitting an id format Sanity has
    // never emitted, and a false reading would ship the wrong aspect box.
    expect(parseSanityImageRef("image-a1b2-c3d4-1600x900-jpg")).toBeNull();
  });

  it("never throws on unexpected input", () => {
    const inputs = ["", "image", "-", "image--", "image-abc123-1600x900-", REAL_REF];
    for (const input of inputs) {
      expect(() => parseSanityImageRef(input)).not.toThrow();
    }
  });
});
