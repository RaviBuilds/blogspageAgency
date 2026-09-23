/**
 * Intrinsic dimensions for Sanity image assets.
 *
 * Requirement 11.2 constrains every raster image inside `<main>` to render
 * through `next/image` with either explicit `width`/`height` or `fill` plus
 * `sizes`, so the box is reserved before the bytes arrive and the image
 * contributes 0 to the route's CLS. Blog body images come from the `content`
 * Portable Text array, which `POST_QUERY` returns unprojected: the only thing
 * present at render time is the image object's `asset._ref`, with no
 * dereferenced `asset->metadata.dimensions`. A Sanity asset id encodes the
 * intrinsic pixel size, so the ref string is the available source:
 *
 *     image-a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2-1600x900-jpg
 *            └─ asset id ─────────────────────────┘ └─ w×h ─┘ └ext┘
 *
 * Where a query can be changed to project `asset->metadata.dimensions`, prefer
 * that: it is authoritative rather than derived, and it survives any future
 * change to Sanity's asset id format. Parsing the ref stays the fallback for
 * Portable Text bodies, where per-block projection is not practical.
 *
 * Pure module: no I/O, no React.
 */

/** Intrinsic pixel size of a Sanity image asset. */
export type SanityImageDimensions = {
  width: number;
  height: number;
};

/**
 * The image-object shapes a caller can hold: a bare ref string, or a Sanity
 * image object whose `asset` may itself be a reference or an expanded document.
 * Every field is optional because Portable Text values are untrusted input.
 */
export type SanityImageRefSource =
  | string
  | {
      _ref?: string;
      asset?: { _ref?: string; _id?: string } | null;
    }
  | null
  | undefined;

/**
 * `image-<assetId>-<width>x<height>-<extension>`.
 *
 * The asset id is matched loosely (hex today, but the format is Sanity's to
 * change) while the dimension segment is pinned: two runs of digits with no
 * sign and no decimal point, joined by a literal `x`, immediately before the
 * final extension segment.
 */
const IMAGE_REF_PATTERN = /^image-[^-]+-(\d+)x(\d+)-[a-z0-9]+$/i;

/** Pull the ref string out of whichever shape the caller is holding. */
const extractRef = (source: SanityImageRefSource): string | null => {
  if (typeof source === "string") return source;
  if (!source) return null;
  return source.asset?._ref ?? source.asset?._id ?? source._ref ?? null;
};

/**
 * Read the intrinsic width and height encoded in a Sanity image asset
 * reference.
 *
 * Total by design: a page render must not fail because an editor's document
 * carries an unexpected ref. Returns `null` — never throws — for every input
 * it cannot read with confidence, specifically:
 *
 *   - `null`, `undefined`, a non-string ref, or an object with no ref
 *   - a ref that is not an image asset (`file-…`, an `_id` for another type)
 *   - a ref whose dimension segment is missing, non-numeric, or malformed
 *   - a ref whose parsed width or height is zero
 *
 * Callers treat `null` as "intrinsic size unknown" and fall back to the `fill`
 * plus `sizes` layout, which satisfies Requirement 11.2 without dimensions.
 */
export const parseSanityImageRef = (
  source: SanityImageRefSource,
): SanityImageDimensions | null => {
  const ref = extractRef(source);
  if (!ref) return null;

  const match = IMAGE_REF_PATTERN.exec(ref);
  if (!match) return null;

  const width = Number.parseInt(match[1], 10);
  const height = Number.parseInt(match[2], 10);

  // A zero dimension is structurally valid in the ref but useless to
  // `next/image`, which rejects a non-positive width or height.
  if (!Number.isSafeInteger(width) || width <= 0) return null;
  if (!Number.isSafeInteger(height) || height <= 0) return null;

  return { width, height };
};
