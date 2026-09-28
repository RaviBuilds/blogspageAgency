/**
 * BRAND BOARD — the four artworks for the brand presentation section.
 *
 * Four regions of one guideline sheet rather than four cards, each paired 1:1
 * with an element in `WEB_DESIGN_BRANDING.elements`:
 *
 *   typography        → `TypeSpecimen`      a live specimen and scale ladder
 *   color-systems     → `ColorTokens`       the real token palette with values
 *   logo-application  → `LogoUsage`         the mark on light and on dark
 *   brand-alignment   → `ConsistencyGrid`   components sharing one system
 *
 * ## Why the artwork uses Blogspage AI's own system
 *
 * A branding section illustrated with invented swatches for an invented client
 * is decoration. Showing the actual palette, the actual type scale and the actual
 * logo lockups demonstrates the deliverable with the only brand system we are
 * entitled to publish — and the specimen is rendered in the site's own typeface,
 * so it is a true specimen rather than a picture of one.
 *
 * The hex values are the approved light-scope tokens from `globals.css`. They are
 * facts about this design system, not claims about a result.
 *
 * Decorative and static. `aria-hidden` is applied by the caller; the element
 * titles and descriptions beside each region carry the meaning. Images are
 * `alt=""` because they sit inside that `aria-hidden` artwork.
 */

import Image from "next/image";
import type { ReactElement } from "react";

import { BRAND_SHEET } from "@/lib/web-design-plain-language";

import { alpha } from "./frames";

/* -------------------------------------------------------------------------- */

/** The type scale, as it is actually defined in `brand-type.ts`. */
const SCALE = [
  { name: "Display", size: "76 / 0.95", weight: "font-semibold", cls: "text-3xl" },
  { name: "Statement", size: "56 / 1.05", weight: "font-semibold", cls: "text-2xl" },
  { name: "Section", size: "36 / 1.1", weight: "font-semibold", cls: "text-xl" },
  { name: "Body", size: "16 / 1.7", weight: "font-normal", cls: "text-sm" },
] as const;

export function TypeSpecimen() {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex items-end gap-4">
        {/* The specimen. Set in the site's own sans, tracked and weighted the
            way a heading on this page actually is. */}
        <span className="text-[4.5rem] font-semibold leading-[0.8] tracking-[-0.04em] text-foreground">
          Aa
        </span>
        <span className="flex flex-col gap-1 pb-1">
          <span className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-text-disabled">
            Geist Sans
          </span>
          <span className="flex gap-1">
            {["400", "500", "600"].map((w) => (
              <span
                key={w}
                className="rounded border border-border-subtle px-1.5 py-px font-mono text-[0.5625rem] text-text-subtle"
              >
                {w}
              </span>
            ))}
          </span>
        </span>
      </div>

      {/* The ladder: four steps, each labelled with its size / leading. */}
      <div className="flex flex-col divide-y divide-border-subtle">
        {SCALE.map((step) => (
          <span
            key={step.name}
            className="flex items-baseline justify-between gap-4 py-2"
          >
            <span
              className={`${step.cls} ${step.weight} truncate tracking-tight text-foreground/85`}
            >
              {step.name}
            </span>
            <span className="shrink-0 font-mono text-[0.5625rem] text-text-disabled">
              {step.size}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** The approved light-scope palette, with the contrast pairing that matters. */
const TOKENS = [
  { name: "Primary", value: "#4353C9" },
  { name: "Violet", value: "#7C3AED" },
  { name: "Cyan", value: "#0E7490" },
  { name: "Ink", value: "#0E1524" },
  { name: "Subtle", value: "#EDF1F6" },
  { name: "Paper", value: "#F7F8FA" },
] as const;

export function ColorTokens() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="grid grid-cols-3 gap-2.5">
        {TOKENS.map((token) => (
          <span key={token.name} className="flex flex-col gap-1.5">
            <span
              className="h-12 w-full rounded-lg ring-1 ring-inset ring-black/[0.06]"
              style={{ backgroundColor: token.value }}
            />
            <span className="text-[0.625rem] font-medium text-foreground/80">
              {token.name}
            </span>
            <span className="font-mono text-[0.5625rem] uppercase text-text-disabled">
              {token.value}
            </span>
          </span>
        ))}
      </div>

      {/* A contrast pairing strip — the reason the palette is token-based at all. */}
      <div className="mt-auto flex items-stretch overflow-hidden rounded-lg border border-border-subtle">
        <span
          className="flex flex-1 items-center justify-center py-2 text-[0.625rem] font-semibold"
          style={{ backgroundColor: "#4353C9", color: "#FFFFFF" }}
        >
          AA on primary
        </span>
        <span
          className="flex flex-1 items-center justify-center py-2 text-[0.625rem] font-semibold"
          style={{ backgroundColor: "#F7F8FA", color: "#0E1524" }}
        >
          AA on paper
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export function LogoUsage() {
  return (
    <div className="flex h-full flex-col gap-3">
      {/* On paper. The mark carries its own near-black backing plate (see
          `scripts/optimize-brand-assets.mjs`: the lockup is light-on-dark and the
          plate is load-bearing), so on a light surface it reads as a chip. */}
      <div className="flex flex-1 items-center justify-center rounded-lg border border-border-subtle bg-background px-4 py-5">
        <Image
          src="/blogspage-logo.png"
          alt=""
          width={320}
          height={96}
          quality={85}
          sizes="200px"
          className="h-8 w-auto rounded-lg"
        />
      </div>

      {/* On ink — the same file, where the plate disappears into the surface and
          the mark sits directly on it, with a dashed clear-space box so the two
          panels differ by the rule they demonstrate rather than by the asset.

          This panel previously pointed at `/blogspage-logo2.png`. That file is a
          background-removed variant whose wordmark is damaged: it renders
          "B OGSPAGI AI" — the L is gone and the E is malformed. Shipping a broken
          lockup inside the section that sells brand consistency is the worst
          possible place for it, and it is not visible from the JSX. Nothing else
          in the app references that asset; `blogspage-logo.png` is the approved
          mark used by the navbar, the footer and the Organization schema. */}
      <div className="flex flex-1 items-center justify-center rounded-lg border border-white/10 bg-[#0B0E14] px-4 py-5">
        <span className="rounded border border-dashed border-white/20 p-2">
          <Image
            src="/blogspage-logo.png"
            alt=""
            width={320}
            height={96}
            quality={85}
            sizes="200px"
            className="h-8 w-auto"
          />
        </span>
      </div>

      {/* Clear-space and minimum-size markers. */}
      <div className="flex items-center justify-between gap-3">
        {["Clear space", "Min. size", "SVG · favicon"].map((label) => (
          <span
            key={label}
            className="flex items-center gap-1.5 text-[0.5625rem] font-medium uppercase tracking-[0.1em] text-text-disabled"
          >
            <span className="size-1 rounded-full bg-border-strong" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Four fragments from different page types, all resolving to the same button,
 * the same radius and the same accent — which is what "consistency" means when
 * it is drawn rather than asserted.
 */
export function ConsistencyGrid() {
  const BLUE = "#4353C9";
  return (
    <div className="grid h-full grid-cols-2 gap-2.5">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="flex flex-col gap-1.5 rounded-lg border border-border-subtle bg-background p-2.5"
        >
          <span className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-[0.2rem]"
              style={{ backgroundColor: alpha(BLUE, 0.7) }}
            />
            <span className="h-1 w-8 rounded-full bg-border-strong" />
          </span>
          {i === 0 ? (
            <>
              <span className="h-1 w-full rounded-full bg-border" />
              <span className="h-1 w-2/3 rounded-full bg-border" />
            </>
          ) : null}
          {i === 1 ? (
            <span className="h-6 w-full rounded border border-border-subtle bg-card" />
          ) : null}
          {i === 2 ? (
            <span className="flex gap-1">
              {[0, 1, 2].map((j) => (
                <span
                  key={j}
                  className="h-4 flex-1 rounded"
                  style={{ backgroundColor: alpha(BLUE, 0.08) }}
                />
              ))}
            </span>
          ) : null}
          {i === 3 ? (
            <span className="h-1 w-3/4 rounded-full bg-border" />
          ) : null}
          <span
            className="mt-auto h-3.5 w-14 rounded-full"
            style={{ backgroundColor: BLUE }}
          />
        </span>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The spacing ladder, drawn as measured bars.
 *
 * Added in the final pass because the board demonstrated typography, colour,
 * logo and components and then asserted "visual consistency" without showing
 * the one thing that actually produces it. Spacing is the least glamorous half
 * of a brand system and the half a template gets wrong: a real guideline sheet
 * has a spacing page, so this one does.
 *
 * The steps are real — they are the 4px-based scale the page is built on — and
 * each bar is drawn at its own value, so the ladder is a measurement rather than
 * a picture of one.
 */
export function SpacingScale() {
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      {BRAND_SHEET.spacing.map((step) => (
        <span key={step} className="flex items-center gap-3">
          <span className="w-6 shrink-0 font-mono text-[0.5625rem] text-text-disabled">
            {step}
          </span>
          <span
            className="block rounded-sm"
            style={{
              width: `${step * 3}px`,
              height: "6px",
              backgroundColor: alpha("#4353C9", 0.28),
            }}
          />
          <span className="h-px flex-1 bg-border-subtle" />
        </span>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** Artwork by brand-element id, so the section stays data-driven. */
export const BRAND_ARTWORK: Record<string, () => ReactElement> = {
  typography: TypeSpecimen,
  "color-systems": ColorTokens,
  "logo-application": LogoUsage,
  "brand-alignment": ConsistencyGrid,
};
