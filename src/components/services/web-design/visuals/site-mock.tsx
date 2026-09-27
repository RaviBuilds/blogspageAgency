/**
 * Web Design page — abstract website previews.
 *
 * Ten archetypes, one per commercial vertical in the industry router. Each is a
 * *structural* sketch of how that industry's website is actually laid out, drawn
 * from divs and one accent hex: a clinic leads with reassurance and an enquiry
 * rail, a hotel leads with a room band and a date row, a SaaS product leads with
 * a data panel and pricing tiers.
 *
 * ## Why structure rather than colour
 *
 * The section has to demonstrate that we do not apply one template to every
 * business. Ten identically-shaped cards in ten different colours demonstrates
 * the opposite, however nice the palette is. So the archetype carries the
 * argument and the accent only carries the identity — which is also why two
 * verticals can safely share a hue family without the gallery reading as
 * repetition.
 *
 * ## Contract
 *
 * - Decorative. Always rendered inside an `aria-hidden` wrapper by the caller;
 *   the industry name, focus and description beside the artwork carry all
 *   meaning. Nothing here is crawlable and nothing here is load-bearing.
 * - Server-renderable and static: no hooks, no motion, no images, no SVG text.
 * - Fixed aspect handled by the caller, so the same preview works at gallery
 *   thumbnail size and at showcase size.
 */

import type { ReactElement } from "react";

import { Line, MockNav, Paragraph, Pill, alpha } from "./frames";
import type { MockArchetype } from "@/lib/web-design-visual-system";

/* -------------------------------------------------------------------------- */
/* Shared sub-shapes                                                          */
/* -------------------------------------------------------------------------- */

/** A content tile: a small accent chip, a title bar and two copy lines. */
function Tile({
  accent,
  className,
  rounded = "rounded-md",
}: {
  accent: string;
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-1.5 border border-border-subtle bg-card p-2 ${rounded} ${className ?? ""}`}
    >
      <span
        className="size-2.5 rounded-[0.2rem]"
        style={{ backgroundColor: alpha(accent, 0.55) }}
      />
      <Line w="w-3/4" h="h-1" tone="strong" />
      <Line w="w-full" h="h-1" tone="faint" />
    </div>
  );
}

/** A horizontal row that reads as a list item with a trailing action. */
function Row({ accent, wide = false }: { accent: string; wide?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border-subtle bg-card px-2 py-1.5">
      <span
        className="size-3 shrink-0 rounded-full"
        style={{ backgroundColor: alpha(accent, 0.3) }}
      />
      <span className="flex flex-1 flex-col gap-1">
        <Line w={wide ? "w-2/3" : "w-1/2"} h="h-1" tone="strong" />
        <Line w="w-1/3" h="h-1" tone="faint" />
      </span>
      <Pill accent={alpha(accent, 0.65)} w="w-7" h="h-2.5" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* The archetypes                                                             */
/* -------------------------------------------------------------------------- */

function Clinical({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col">
      <MockNav accent={accent} />
      <div className="flex flex-1 gap-2 px-3 pb-3">
        <div className="flex flex-[3] flex-col justify-center gap-2">
          <Line w="w-4/5" h="h-2.5" color={alpha(accent, 0.85)} />
          <Line w="w-3/5" h="h-2.5" tone="strong" />
          <Paragraph lines={2} className="mt-1" />
          <span className="mt-1 flex items-center gap-1.5">
            <Pill accent={accent} w="w-14" h="h-3.5" />
            <span className="h-3.5 w-10 rounded-full border border-border-strong" />
          </span>
        </div>
        {/* The enquiry rail: the one element a clinic page always keeps in view. */}
        <div
          className="flex flex-[2] flex-col gap-1.5 rounded-md p-2"
          style={{ backgroundColor: alpha(accent, 0.07) }}
        >
          <Line w="w-2/3" h="h-1" color={alpha(accent, 0.7)} />
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-3 rounded border border-border-subtle bg-card"
            />
          ))}
          <Pill accent={accent} w="w-full" h="h-3" className="mt-auto" />
        </div>
      </div>
    </div>
  );
}

function Athletic({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col">
      {/* Inked, full-bleed hero band — the energetic register, without leaving
          the approved palette for a warm hue. */}
      <div
        className="relative flex flex-1 flex-col justify-end gap-1.5 p-3"
        style={{
          background: `linear-gradient(135deg, #0E1524 0%, ${alpha(accent, 0.9)} 140%)`,
        }}
      >
        <MockNav accent="#FFFFFF" tone="ink" className="absolute inset-x-0 top-0 px-3" />
        <Line w="w-2/3" h="h-3" color="rgba(255,255,255,0.92)" />
        <Line w="w-2/5" h="h-1.5" color="rgba(255,255,255,0.45)" />
        <span className="mt-1 flex gap-1.5">
          <Pill accent="rgba(255,255,255,0.92)" w="w-14" h="h-3.5" />
          <span className="h-3.5 w-12 rounded-full border border-white/40" />
        </span>
      </div>
      {/* Class timetable strip. */}
      <div className="grid grid-cols-4 gap-1.5 p-2.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-1 rounded border border-border-subtle bg-card p-1.5"
          >
            <Line w="w-1/2" h="h-1" color={alpha(accent, 0.6)} />
            <Line w="w-full" h="h-1" tone="faint" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Hospitality({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col">
      {/* Editorial image band. */}
      <div
        className="relative h-[42%]"
        style={{
          background: `linear-gradient(120deg, ${alpha(accent, 0.22)} 0%, ${alpha(accent, 0.06)} 60%, transparent 100%)`,
        }}
      >
        <MockNav accent={accent} className="absolute inset-x-0 top-0" />
        <div className="absolute bottom-2 left-3 flex flex-col gap-1.5">
          <Line w="w-28" h="h-2.5" tone="ink" />
          <Line w="w-16" h="h-1.5" tone="strong" />
        </div>
      </div>
      {/* The reservation row — the direct-booking mechanism. */}
      <div className="-mt-3 mx-3 flex items-center gap-1.5 rounded-lg border border-border bg-card p-2 shadow-sm">
        {[0, 1, 2].map((i) => (
          <span key={i} className="flex flex-1 flex-col gap-1">
            <Line w="w-2/3" h="h-1" tone="faint" />
            <Line w="w-full" h="h-1.5" tone="strong" />
          </span>
        ))}
        <Pill accent={accent} w="w-10" h="h-5" className="rounded-md" />
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2 p-3">
        {[0, 1, 2].map((i) => (
          <Tile key={i} accent={accent} />
        ))}
      </div>
    </div>
  );
}

function Storefront({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col">
      <MockNav accent={accent} />
      {/* Search + category chips: the local ordering pattern. */}
      <div className="px-3">
        <span className="flex h-5 items-center gap-1.5 rounded-full border border-border bg-card px-2">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: alpha(accent, 0.5) }}
          />
          <Line w="w-1/3" h="h-1" tone="faint" />
        </span>
        <span className="mt-2 flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="h-3.5 w-10 rounded-full"
              style={{
                backgroundColor: i === 0 ? accent : alpha(accent, 0.1),
              }}
            />
          ))}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3 pt-2">
        <Row accent={accent} wide />
        <Row accent={accent} />
        <Row accent={accent} wide />
      </div>
    </div>
  );
}

function Corporate({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col">
      <MockNav accent={accent} />
      <div className="flex flex-1 flex-col justify-center gap-2 px-3">
        <Line w="w-[85%]" h="h-3" tone="ink" />
        <Line w="w-[55%]" h="h-3" color={alpha(accent, 0.8)} />
        <Paragraph lines={2} className="mt-1 max-w-[80%]" />
        {/* Credential rail — restrained, no logos invented. */}
        <span className="mt-2 flex items-center gap-2.5 border-t border-border-subtle pt-2.5">
          {[0, 1, 2, 3].map((i) => (
            <Line key={i} w="w-8" h="h-1.5" tone="faint" />
          ))}
        </span>
      </div>
    </div>
  );
}

function Learning({ accent }: { accent: string }) {
  return (
    <div className="flex h-full">
      {/* Structured left rail: the learning-platform signature. */}
      <div
        className="flex w-[26%] flex-col gap-1.5 border-r border-border-subtle p-2"
        style={{ backgroundColor: alpha(accent, 0.05) }}
      >
        <span
          className="size-3 rounded-[0.2rem]"
          style={{ backgroundColor: accent }}
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <Line key={i} w={i === 1 ? "w-full" : "w-3/4"} h="h-1" tone={i === 1 ? "strong" : "faint"} />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-2.5">
        <Line w="w-1/2" h="h-2" tone="ink" />
        <div className="grid grid-cols-2 gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-1 rounded border border-border-subtle bg-card p-1.5"
            >
              <Line w="w-2/3" h="h-1" tone="strong" />
              {/* Progress rail. */}
              <span className="h-1 w-full overflow-hidden rounded-full bg-border-subtle">
                <span
                  className="block h-full"
                  style={{
                    width: `${40 + i * 15}%`,
                    backgroundColor: accent,
                  }}
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Care({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col">
      <MockNav accent={accent} />
      <div className="flex flex-1 items-center gap-2.5 px-3 pb-3">
        {/* Softer geometry: the friendly-service register is carried by radius,
            not by a warmer hue. */}
        <span
          className="size-14 shrink-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${alpha(accent, 0.35)}, ${alpha(accent, 0.1)})`,
          }}
        />
        <div className="flex flex-1 flex-col gap-1.5">
          <Line w="w-3/5" h="h-2.5" tone="ink" />
          <Paragraph lines={2} />
          <span className="mt-0.5 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-4 flex-1 rounded-full"
                style={{ backgroundColor: alpha(accent, i === 0 ? 0.8 : 0.12) }}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

function Commerce({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col">
      <MockNav accent={accent} />
      <div className="grid flex-1 grid-cols-3 gap-1.5 p-2.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded border border-border-subtle bg-card"
          >
            <span
              className="h-5 w-full"
              style={{ backgroundColor: alpha(accent, 0.09 + (i % 3) * 0.05) }}
            />
            <span className="flex flex-col gap-1 p-1.5">
              <Line w="w-full" h="h-1" tone="faint" />
              <span className="flex items-center justify-between">
                <Line w="w-5" h="h-1" color={accent} />
                <span
                  className="size-2 rounded-[0.15rem]"
                  style={{ backgroundColor: alpha(accent, 0.3) }}
                />
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ accent }: { accent: string }) {
  return (
    <div
      className="flex h-full flex-col"
      style={{ background: "linear-gradient(180deg, #0B0E14 0%, #141822 100%)" }}
    >
      <MockNav accent={accent} tone="ink" />
      <div className="flex flex-1 gap-2 px-3 pb-3">
        <div className="flex flex-[3] flex-col gap-2">
          <Line w="w-3/5" h="h-2.5" color="rgba(255,255,255,0.85)" />
          <Line w="w-2/5" h="h-1.5" color="rgba(255,255,255,0.3)" />
          {/* A product panel, drawn as a bar field. No numbers: an invented
              metric in artwork is still an invented metric. */}
          <div className="mt-auto flex h-10 items-end gap-1 rounded-md border border-white/10 bg-white/[0.03] p-1.5">
            {[40, 62, 48, 78, 58, 88, 70].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${h}%`,
                  backgroundColor: alpha(accent, 0.35 + (i % 3) * 0.2),
                }}
              />
            ))}
          </div>
        </div>
        {/* Pricing tiers. */}
        <div className="flex flex-[2] flex-col gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="flex flex-1 flex-col justify-center gap-1 rounded-md border px-1.5"
              style={{
                borderColor: i === 1 ? alpha(accent, 0.6) : "rgba(255,255,255,0.08)",
                backgroundColor: i === 1 ? alpha(accent, 0.12) : "rgba(255,255,255,0.02)",
              }}
            >
              <Line w="w-2/3" h="h-1" color="rgba(255,255,255,0.4)" />
              <Line w="w-1/3" h="h-1.5" color={i === 1 ? accent : "rgba(255,255,255,0.25)"} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Editorial({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col">
      <MockNav accent={accent} />
      <div className="flex flex-1 gap-3 px-3 pb-3">
        {/* Reading column with a real measure — the point of an editorial site. */}
        <div className="flex flex-[5] flex-col gap-1.5">
          <Line w="w-[90%]" h="h-2.5" tone="ink" />
          <Line w="w-[60%]" h="h-2.5" tone="ink" />
          <span className="mt-1 flex items-center gap-1.5">
            <span
              className="size-3 rounded-full"
              style={{ backgroundColor: alpha(accent, 0.25) }}
            />
            <Line w="w-14" h="h-1" tone="faint" />
          </span>
          <Paragraph lines={4} className="mt-1" />
        </div>
        <div className="flex flex-[2] flex-col gap-1.5 border-l border-border-subtle pl-2.5">
          <Line w="w-2/3" h="h-1" color={alpha(accent, 0.7)} />
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="flex flex-col gap-1">
              <Line w="w-full" h="h-1" tone="faint" />
              <Line w="w-2/3" h="h-1" tone="faint" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const ARCHETYPES: Record<
  MockArchetype,
  (props: { accent: string }) => ReactElement
> = {
  clinical: Clinical,
  athletic: Athletic,
  hospitality: Hospitality,
  storefront: Storefront,
  corporate: Corporate,
  learning: Learning,
  care: Care,
  commerce: Commerce,
  dashboard: Dashboard,
  editorial: Editorial,
};

/**
 * Render the abstract website preview for one archetype.
 *
 * Fills its container, so the caller owns the aspect ratio and the frame. The
 * component is `aria-hidden`-agnostic: wrap it.
 */
export function SiteMock({
  archetype,
  accent,
}: {
  archetype: MockArchetype;
  accent: string;
}) {
  const Archetype = ARCHETYPES[archetype] ?? Corporate;
  return <Archetype accent={accent} />;
}
