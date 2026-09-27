/**
 * DESIGN SHOWCASE — the centrepiece of the core web design section.
 *
 * A design file, open: three artboards (desktop, tablet, mobile) laid out on a
 * canvas with annotation rails, a selection marker, and a component-state strip
 * beneath them.
 *
 * ## Why an open design file and not another device stack
 *
 * The hero already shows a finished website floating in space — the promise. This
 * section has to show the *work*, which is a different claim: that the responsive
 * behaviour, the component states and the spacing are decided deliberately in
 * Figma before anything is built. An artboard row with annotations says that; a
 * second glossy device mockup would just repeat the hero one section later.
 *
 * ## Honesty
 *
 * The breakpoint labels are the standard design widths (1440 / 768 / 390) and the
 * state labels are the standard interaction states. Nothing here is a metric, a
 * result, or a client artefact — the artwork makes no claim the copy does not.
 *
 * Decorative, static, server-renderable: no hooks, no motion, no images. The
 * caller applies `aria-hidden` and the surrounding copy carries all meaning.
 */

import { PILLAR_TONE } from "@/lib/web-design-visual-system";

import { Line, MockNav, Paragraph, Pill, alpha } from "./frames";

const BLUE = PILLAR_TONE.blue;
const VIOLET = PILLAR_TONE.violet;
const CYAN = PILLAR_TONE.cyan;

/** An artboard label: name on the left, width on the right, on a hairline. */
function ArtboardLabel({ name, width }: { name: string; width: string }) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-2">
      <span className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-text-subtle">
        {name}
      </span>
      <span className="font-mono text-[0.625rem] text-text-disabled">{width}</span>
    </div>
  );
}

/** The desktop artboard's page design — the fullest of the three. */
function DesktopArtboard() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <MockNav accent={BLUE} />

      <div
        className="flex gap-4 px-4 pb-5 pt-4"
        style={{
          background: `linear-gradient(150deg, ${alpha(BLUE, 0.08)} 0%, transparent 62%)`,
        }}
      >
        <div className="flex flex-[3] flex-col gap-2">
          <Line w="w-full" h="h-3" tone="ink" />
          <Line w="w-3/4" h="h-3" color={alpha(BLUE, 0.75)} />
          <Paragraph lines={2} className="mt-1" />
          <span className="mt-2 flex gap-2">
            <Pill accent={BLUE} w="w-20" h="h-5" />
            <span className="h-5 w-16 rounded-full border border-border-strong" />
          </span>
        </div>
        <div className="flex flex-[2] flex-col gap-1.5 rounded-lg border border-border bg-card p-2.5 shadow-sm">
          <Line w="w-1/2" h="h-1.5" tone="strong" />
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-3.5 rounded border border-border-subtle bg-background-subtle"
            />
          ))}
          <Pill accent={VIOLET} w="w-full" h="h-4" className="rounded-md" />
        </div>
      </div>

      {/* A selected section, with a dashed marquee and corner handles — the
          single most recognisable "this is a design tool" signal. */}
      <div className="relative border-t border-border-subtle px-4 py-4">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-2 rounded border border-dashed"
          style={{ borderColor: alpha(BLUE, 0.55) }}
        />
        {[
          "left-2 top-2",
          "right-2 top-2",
          "left-2 bottom-2",
          "right-2 bottom-2",
        ].map((pos) => (
          <span
            key={pos}
            aria-hidden
            className={`absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-[1px] bg-white ${pos}`}
            style={{ border: `1px solid ${BLUE}` }}
          />
        ))}
        <span
          aria-hidden
          className="absolute -top-2 left-1/2 -translate-x-1/2 rounded px-1.5 py-px font-mono text-[0.5625rem] text-white"
          style={{ backgroundColor: BLUE }}
        >
          Services · 3 col
        </span>
        <div className="grid grid-cols-3 gap-3">
          {[BLUE, VIOLET, CYAN].map((tone, i) => (
            <span key={i} className="flex flex-col gap-1.5">
              <span
                className="size-4 rounded-[0.3rem]"
                style={{ backgroundColor: alpha(tone, 0.18) }}
              />
              <Line w="w-3/4" h="h-1.5" tone="strong" />
              <Line w="w-full" h="h-1" tone="faint" />
              <Line w="w-2/3" h="h-1" tone="faint" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** The tablet artboard — the same design at a middle measure. */
function TabletArtboard() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <MockNav accent={BLUE} />
      <div className="flex flex-col gap-2 px-3 pb-3 pt-2">
        <Line w="w-full" h="h-2.5" tone="ink" />
        <Line w="w-2/3" h="h-2.5" color={alpha(BLUE, 0.7)} />
        <Paragraph lines={2} />
        <Pill accent={BLUE} w="w-20" h="h-4" className="mt-1" />
        <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border-subtle pt-2.5">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="flex flex-col gap-1">
              <span
                className="size-3 rounded-[0.25rem]"
                style={{ backgroundColor: alpha(i % 2 ? VIOLET : CYAN, 0.16) }}
              />
              <Line w="w-full" h="h-1" tone="faint" />
              <Line w="w-2/3" h="h-1" tone="faint" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** The mobile artboard, with the thumb-zone action pinned to the bottom. */
function MobileArtboard() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between px-2.5 py-2">
        <span
          className="size-2.5 rounded-[0.2rem]"
          style={{ backgroundColor: BLUE }}
        />
        <span className="flex flex-col gap-[3px]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-[2px] w-3 rounded-full bg-border-strong" />
          ))}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 px-2.5 pb-2.5">
        <Line w="w-full" h="h-2" tone="ink" />
        <Line w="w-2/3" h="h-2" color={alpha(BLUE, 0.7)} />
        <Paragraph lines={2} />
        {[0, 1].map((i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 rounded border border-border-subtle p-1"
          >
            <span
              className="size-3.5 shrink-0 rounded"
              style={{ backgroundColor: alpha(i ? VIOLET : CYAN, 0.16) }}
            />
            <Line w="w-2/3" h="h-1" tone="faint" />
          </span>
        ))}
        <span className="mt-auto flex flex-col gap-1">
          <span className="flex items-center justify-between">
            <span className="text-[0.5rem] font-medium uppercase tracking-[0.1em] text-text-disabled">
              Thumb zone
            </span>
            <span
              className="h-px w-8"
              style={{ backgroundColor: alpha(CYAN, 0.6) }}
            />
          </span>
          <Pill accent={BLUE} w="w-full" h="h-4" className="rounded-full" />
        </span>
      </div>
    </div>
  );
}

/** Component states — default, hover, focus — plus a field and a disabled rail. */
function StateStrip() {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-border-subtle px-4 py-4 sm:px-6">
      {[
        { label: "Default", ring: "none", bg: BLUE },
        { label: "Hover", ring: "none", bg: "#3645AE" },
        { label: "Focus", ring: "ring", bg: BLUE },
      ].map((state) => (
        <span key={state.label} className="flex flex-col gap-1.5">
          <span className="text-[0.5625rem] font-medium uppercase tracking-[0.12em] text-text-disabled">
            {state.label}
          </span>
          <span
            className="h-5 w-16 rounded-full"
            style={{
              backgroundColor: state.bg,
              boxShadow:
                state.ring === "ring" ? `0 0 0 3px ${alpha(BLUE, 0.28)}` : undefined,
            }}
          />
        </span>
      ))}

      <span className="flex flex-col gap-1.5">
        <span className="text-[0.5625rem] font-medium uppercase tracking-[0.12em] text-text-disabled">
          Field
        </span>
        <span
          className="flex h-5 w-28 items-center rounded-md border bg-card px-2"
          style={{ borderColor: alpha(BLUE, 0.4) }}
        >
          <span className="h-2.5 w-px" style={{ backgroundColor: BLUE }} />
        </span>
      </span>

      <span className="flex flex-col gap-1.5">
        <span className="text-[0.5625rem] font-medium uppercase tracking-[0.12em] text-text-disabled">
          Spacing
        </span>
        <span className="flex items-center gap-1">
          {[4, 8, 12, 16, 24].map((s) => (
            <span
              key={s}
              className="rounded-sm bg-border"
              style={{ width: `${s / 2 + 2}px`, height: "0.75rem" }}
            />
          ))}
        </span>
      </span>
    </div>
  );
}

export function DesignShowcase() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border bg-background-subtle shadow-[0_40px_90px_-56px_rgb(14_21_36/0.4)]"
      style={{
        backgroundImage:
          "radial-gradient(rgba(14, 21, 36, 0.07) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
      {/* Canvas toolbar. Abstract: a file mark, a frame count rail, a zoom pill. */}
      <div className="flex items-center gap-3 border-b border-border bg-card/80 px-4 py-2.5 backdrop-blur-sm sm:px-6">
        <span
          className="size-3.5 rounded-[0.25rem]"
          style={{ backgroundColor: alpha(VIOLET, 0.8) }}
        />
        <span className="flex flex-1 items-center gap-2">
          <Line w="w-16" h="h-1.5" tone="strong" />
          <span className="h-3 w-px bg-border" />
          <Line w="w-10" h="h-1.5" tone="faint" />
        </span>
        <span className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-4 rounded-[0.25rem] border border-border-subtle bg-card"
            />
          ))}
        </span>
      </div>

      {/* THE ARTBOARD ROW. Desktop always; tablet from `sm`; mobile always, so
          the responsive story survives on a phone where only two fit. */}
      <div className="flex items-stretch gap-4 p-4 sm:gap-5 sm:p-6">
        <div className="min-w-0 flex-[6]">
          <ArtboardLabel name="Desktop" width="1440" />
          <DesktopArtboard />
        </div>
        <div className="hidden min-w-0 flex-[2] md:block">
          <ArtboardLabel name="Tablet" width="768" />
          <TabletArtboard />
        </div>
        <div className="min-w-0 flex-[1.4] sm:flex-[1.6]">
          <ArtboardLabel name="Mobile" width="390" />
          <MobileArtboard />
        </div>
      </div>

      <StateStrip />
    </div>
  );
}
