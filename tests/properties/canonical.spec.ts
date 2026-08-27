import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { canonicalUrl } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

/**
 * Feature: seo-audit-and-optimization
 *
 * Property 3: Canonical normalisation is total and idempotent
 *
 * *For any* string path, `canonicalUrl` returns a URL with the `https` scheme,
 * the `blogspage.com` host, a lowercase path, no query, no fragment, and no
 * trailing slash, returns the bare scheme and host for the root path, and
 * satisfies `canonicalUrl(canonicalUrl(p)) === canonicalUrl(p)`.
 *
 * **Validates: Requirements 3.2**
 */

// ---------------------------------------------------------------------------
// Generators
//
// The shapes below are not decorative. `canonicalUrl` parses its input twice on
// purpose: the WHATWG parser only percent-encodes path characters for *special*
// schemes, so input carrying its own non-special scheme (`a:"`) yields a raw
// quote in `pathname` that the https parser would encode on the *next* call.
// One pass would therefore not be a fixed point. Non-special-scheme input is
// generated explicitly so that second parse is genuinely exercised rather than
// taken on trust.
// ---------------------------------------------------------------------------

/** Any code point, so nothing about the input is assumed. */
const anyString = fc.string({ unit: "binary", maxLength: 80 });

/** Printable graphemes, including multi-code-point clusters and emoji. */
const graphemeString = fc.string({ unit: "grapheme", maxLength: 40 });

/**
 * Characters that a URL parser treats specially, or encodes, or normalises:
 * separators, dot segments, backslashes, control whitespace, quotes, percent
 * signs, and non-ASCII.
 */
const hostileChar = fc.constantFrom(
  "/",
  "\\",
  ".",
  "..",
  "?",
  "#",
  ":",
  "%",
  '"',
  "'",
  "<",
  ">",
  "[",
  "]",
  "{",
  "}",
  "|",
  "^",
  "`",
  " ",
  "\t",
  "\n",
  "\r",
  "\u00a0",
  "@",
  "+",
  "&",
  "=",
  ";",
  ",",
  "A",
  "z",
  "9",
  "-",
  "_",
  "é",
  "Ä",
  "日",
  "😀",
);

const hostileString = fc.string({
  unit: hostileChar,
  minLength: 1,
  maxLength: 24,
});

/** `a:"`, `mailto:x`, `javascript:alert(1)`: schemes the parser does not treat as special. */
const nonSpecialSchemeString = fc
  .tuple(
    fc.constantFrom("a", "b7", "mailto", "javascript", "data", "custom-app"),
    hostileString,
  )
  .map(([scheme, rest]) => `${scheme}:${rest}`);

/** Protocol-relative and absolute foreign-host input, the security-relevant shapes. */
const foreignHostString = fc
  .tuple(
    fc.constantFrom("//", "http://", "https://", "ftp://", "\\\\", "//user:pw@"),
    fc.constantFrom("evil.com", "EVIL.com", "blogspage.com.evil.com", "127.0.0.1:8080"),
    fc.constantFrom("", "/", "/A", "/A/B?q=1#f", "/../x", "//x//y/"),
  )
  .map((parts) => parts.join(""));

/** Realistic route paths, in the casings and shapes a caller might hand over. */
const routeLikeString = fc
  .tuple(
    fc.constantFrom("", "/", "//", "///"),
    fc.array(
      fc.constantFrom(
        "blogs",
        "Blogs",
        "SOLUTIONS",
        "gym-business-solution-website-at-hyderabad",
        ".",
        "..",
        "a b",
        "é",
      ),
      { maxLength: 5 },
    ),
    fc.constantFrom("", "/", "//", "?q=1", "#frag", "?q=1#frag", "/?a=b#c"),
  )
  .map(([lead, segments, tail]) => `${lead}${segments.join("/")}${tail}`);

/** Hand-picked adversarial literals, including the parser-rejecting shapes. */
const literalString = fc.constantFrom(
  "",
  " ",
  "   ",
  "/",
  "//",
  "/////",
  ".",
  "..",
  "/../..",
  "/./a/../b/",
  'a:"',
  "a:x y",
  "http://",
  "https://",
  "http://:",
  "https:/",
  "//evil.com/x",
  "http://evil.com/A?q=1#f",
  "\\evil.com\\x",
  "/BLOGS/",
  "\t/blogs\n",
  "/blogs?utm_source=x#top",
  "/blogs//[slug]/",
  "/café/münchen",
  "/😀",
  "%",
  "/%",
  "/%zz",
  "/%c3%a9",
  SITE_URL,
  `${SITE_URL}/`,
  `${SITE_URL}/BLOGS/?q=1#f`,
);

const pathInput = fc.oneof(
  literalString,
  routeLikeString,
  nonSpecialSchemeString,
  foreignHostString,
  hostileString,
  graphemeString,
  anyString,
);

// ---------------------------------------------------------------------------
// Property 3
// ---------------------------------------------------------------------------

describe("Property 3: Canonical normalisation is total and idempotent", () => {
  it("returns an https, blogspage.com, lowercase, query-free, fragment-free, slash-free URL for any string", () => {
    fc.assert(
      fc.property(pathInput, (path) => {
        const result = canonicalUrl(path);

        // Total: a string always comes back, and it is always a parseable URL
        // rooted at the site origin.
        expect(typeof result).toBe("string");
        expect(result.startsWith(SITE_URL)).toBe(true);

        const url = new URL(result);
        expect(url.protocol).toBe("https:");
        expect(url.host).toBe("www.blogspage.com");
        expect(url.search).toBe("");
        expect(url.hash).toBe("");

        // No query and no fragment survive anywhere in the emitted string; the
        // parser percent-encodes any literal `?` or `#` left in a path.
        expect(result).not.toContain("?");
        expect(result).not.toContain("#");

        // Lowercase path, single-slashed, and no trailing slash — including the
        // root, which is the bare origin.
        expect(url.pathname).toBe(url.pathname.toLowerCase());
        expect(url.pathname).not.toMatch(/\/{2,}/);
        expect(result.endsWith("/")).toBe(false);
      }),
      { numRuns: 500 },
    );
  });

  it("is idempotent: canonicalUrl(canonicalUrl(p)) === canonicalUrl(p)", () => {
    fc.assert(
      fc.property(pathInput, (path) => {
        const once = canonicalUrl(path);
        const twice = canonicalUrl(once);
        const thrice = canonicalUrl(twice);

        expect(twice).toBe(once);
        expect(thrice).toBe(once);
      }),
      { numRuns: 500 },
    );
  });

  it("stays a fixed point for non-special-scheme input, whose path the https parser must encode", () => {
    // The regression this covers: `new URL('a:"')` leaves a raw `"` in
    // `pathname`, so a single-parse implementation returns a value that changes
    // on the next call.
    fc.assert(
      fc.property(nonSpecialSchemeString, (path) => {
        const once = canonicalUrl(path);
        expect(canonicalUrl(once)).toBe(once);
        // Raw characters the https parser encodes must not reach the output.
        expect(once).not.toContain('"');
        expect(once).not.toContain(" ");
        expect(once).not.toContain("\t");
        expect(once).not.toContain("\n");
      }),
      { numRuns: 300 },
    );
  });

  it("never lets a foreign host survive into the canonical URL", () => {
    fc.assert(
      fc.property(fc.oneof(foreignHostString, pathInput), (path) => {
        const url = new URL(canonicalUrl(path));
        // The security clause of Requirement 3.2: a protocol-relative or
        // absolute foreign input canonicalises to this site, never to a
        // cross-origin canonical.
        expect(url.origin).toBe(SITE_URL);
        expect(url.username).toBe("");
        expect(url.password).toBe("");
        expect(url.port).toBe("");
      }),
      { numRuns: 400 },
    );

    expect(canonicalUrl("//evil.com/x")).toBe(`${SITE_URL}/x`);
    expect(canonicalUrl("http://evil.com/A?q=1#f")).toBe(`${SITE_URL}/a`);
    expect(canonicalUrl("https://evil.com")).toBe(SITE_URL);
    expect(canonicalUrl("//user:pw@evil.com/Path/")).toBe(`${SITE_URL}/path`);
  });

  it("returns the bare scheme and host for every spelling of the root path", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          "",
          " ",
          "\t\n",
          "/",
          "//",
          "/////",
          ".",
          "/.",
          "/./",
          "/a/..",
          SITE_URL,
          `${SITE_URL}/`,
          `${SITE_URL}/?q=1#f`,
          "http://",
          "//evil.com",
          "//evil.com/",
        ),
        (rootSpelling) => {
          expect(canonicalUrl(rootSpelling)).toBe(SITE_URL);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("normalises the route shapes the metadata factory actually passes", () => {
    expect(canonicalUrl("/blogs")).toBe(`${SITE_URL}/blogs`);
    expect(canonicalUrl("blogs")).toBe(`${SITE_URL}/blogs`);
    expect(canonicalUrl("/BLOGS/")).toBe(`${SITE_URL}/blogs`);
    expect(canonicalUrl("  /blogs/my-post/  ")).toBe(`${SITE_URL}/blogs/my-post`);
    expect(canonicalUrl("/blogs?utm_source=x#top")).toBe(`${SITE_URL}/blogs`);
    expect(canonicalUrl("/blogs//my-post")).toBe(`${SITE_URL}/blogs/my-post`);
    expect(canonicalUrl("/solutions/./gym-business-solution-website-at-hyderabad")).toBe(
      `${SITE_URL}/solutions/gym-business-solution-website-at-hyderabad`,
    );
    expect(canonicalUrl(`${SITE_URL}/blogs`)).toBe(`${SITE_URL}/blogs`);
  });
});
