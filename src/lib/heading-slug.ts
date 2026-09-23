/**
 * Heading `id` derivation for post, solution, and service content.
 *
 * Requirement 9.5 constrains every `h2`/`h3` `id` to contain only lowercase
 * letters, digits, and hyphens, to be unique within its Route, to be
 * disambiguated by an appended numeric suffix on collision, and to stay
 * unchanged across rebuilds while the heading text is unchanged.
 *
 * `slugify` in `src/lib/niches.ts` deliberately stays separate: it slugifies
 * authored route templates, which are ASCII by construction, so it neither
 * strips accents nor guarantees a non-empty result. Heading text is arbitrary
 * Unicode written by an editor, so it can normalise away to nothing (a
 * punctuation-only or CJK-only heading) and an empty `id` is not a valid
 * anchor target. Changing `slugify` to cover that would change existing
 * `/solutions/<slug>` URLs, so the two rules live apart.
 *
 * Pure module: no I/O, no React.
 */

/** Combining marks left behind by NFKD decomposition of accented letters. */
const COMBINING_MARKS = /[\u0300-\u036f]/g;

/** Everything outside the retained alphabet, whitespace, and hyphen. */
const DISALLOWED = /[^a-z0-9\s-]/g;

/** Fallback `id` for heading text that normalises away to nothing. */
const EMPTY_FALLBACK = "section";

/**
 * Derive a heading `id` from heading text.
 *
 * Total and deterministic: any string in, a non-empty string of lowercase
 * letters, digits, and single interior hyphens out.
 */
export const slugifyHeading = (text: string): string => {
  const slug = text
    // NFKD first so compatibility forms (ligatures, roman numerals, full-width
    // Latin) decompose before casing; lowercasing after keeps "Ⅳ" -> "iv".
    .normalize("NFKD")
    .replace(COMBINING_MARKS, "")
    .toLowerCase()
    .replace(DISALLOWED, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug === "" ? EMPTY_FALLBACK : slug;
};

/**
 * Create a route-scoped slugger.
 *
 * The first occurrence of a base slug keeps the clean form; later occurrences
 * get `-2`, `-3`, and onward. One instance per rendered route, created at the
 * top of the page component, so numbering is deterministic under a fixed
 * heading sequence.
 */
export const createHeadingSlugger = (): ((text: string) => string) => {
  /**
   * Keyed by every issued id: presence means "taken". For a base slug the
   * value is also the highest ordinal handed out so far, so the counter is
   * keyed on the base rather than on the suffixed form.
   */
  const issued = new Map<string, number>();

  return (text: string): string => {
    const base = slugifyHeading(text);
    let candidate = base;

    // Advancing in a loop rather than a single lookup handles heading text
    // whose own slug equals an already-issued suffixed value, e.g. the
    // sequence "Setup", "Setup 2", "Setup": the third heading skips the taken
    // "setup-2" and lands on "setup-3".
    while (issued.has(candidate)) {
      const nextOrdinal = (issued.get(base) ?? 1) + 1;
      issued.set(base, nextOrdinal);
      candidate = `${base}-${nextOrdinal}`;
    }

    issued.set(candidate, 1);
    return candidate;
  };
};
