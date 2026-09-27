/**
 * PROCESS ARTEFACTS — one drawing per stage of the five-stage process.
 *
 * Read top to bottom the five artefacts narrate the process on their own, which
 * is the point: the same page region becomes a node map, then a greybox, then a
 * coloured UI, then a reviewed UI, then a live browser window. The evolution is
 * the argument that these are stages of one thing rather than five services.
 *
 *   01 sitemap    — an unstyled node tree: structure before anything else.
 *   02 wireframe  — the same page as greyboxes: layout decided, no visual design.
 *   03 ui         — the same greyboxes resolved into a designed, coloured page.
 *   04 review     — the designed page with review pins and a spacing annotation.
 *   05 launch     — the page inside a browser window, on a live surface.
 *
 * Decorative and static: `aria-hidden` by the caller, no hooks, no motion, no
 * images.
 */

import type { CSSProperties, ReactNode } from "react";

import { PILLAR_TONE } from "@/lib/web-design-visual-system";

import { BrowserChrome, Line, MockNav, Paragraph, Pill, alpha } from "./frames";

const BLUE = PILLAR_TONE.blue;
const VIOLET = PILLAR_TONE.violet;
const CYAN = PILLAR_TONE.cyan;

/** Shared shell so all five artefacts share one footprint and one radius. */
function Plate({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-border bg-card p-3.5 ${className ?? ""}`}
      style={style}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** 01 — Sitemap: a three-level node tree with plain connectors. */
export function SitemapArtifact() {
  return (
    <Plate className="bg-background-subtle/50">
      <div className="flex flex-col items-center gap-2">
        <span className="h-5 w-16 rounded border border-border-strong bg-card" />
        <span className="h-3 w-px bg-border-strong" />
        {/* Level 2. */}
        <div className="relative flex w-full items-start justify-between gap-2">
          <span className="absolute left-[12%] right-[12%] top-0 h-px bg-border" />
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="flex flex-1 flex-col items-center gap-2">
              <span className="h-2.5 w-px bg-border" />
              <span className="h-4 w-full rounded border border-border bg-card" />
              {/* Level 3, on two of the four branches. */}
              {i === 1 || i === 2 ? (
                <>
                  <span className="h-2 w-px bg-border" />
                  <span className="flex w-full flex-col gap-1">
                    <span className="h-2 w-full rounded-sm bg-border-subtle" />
                    <span className="h-2 w-full rounded-sm bg-border-subtle" />
                  </span>
                </>
              ) : null}
            </span>
          ))}
        </div>
      </div>
    </Plate>
  );
}

/** 02 — Wireframe: the page as greyboxes, with a tap-target marker. */
export function WireframeArtifact() {
  return (
    <Plate className="bg-background-subtle/50">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-sm border border-border-strong" />
          <span className="flex flex-1 gap-1.5">
            {[0, 1, 2].map((i) => (
              <Line key={i} w="w-8" h="h-1" tone="strong" />
            ))}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="flex flex-[3] flex-col gap-1.5 border border-dashed border-border-strong p-2">
            <Line w="w-full" h="h-2" tone="strong" />
            <Paragraph lines={2} />
            <span className="mt-0.5 h-4 w-16 rounded-full border border-border-strong" />
          </span>
          <span className="flex flex-[2] items-center justify-center border border-dashed border-border-strong">
            <span className="text-[0.5rem] font-medium uppercase tracking-[0.1em] text-text-disabled">
              Media
            </span>
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="flex flex-col gap-1 border border-dashed border-border-strong p-1.5"
            >
              <Line w="w-2/3" h="h-1" tone="strong" />
              <Line w="w-full" h="h-1" tone="muted" />
            </span>
          ))}
        </div>
      </div>
    </Plate>
  );
}

/** 03 — UI: the same layout, designed. */
export function UiArtifact() {
  return (
    <Plate className="p-0">
      <MockNav accent={BLUE} />
      <div
        className="flex gap-2.5 px-3.5 pb-3.5 pt-1"
        style={{
          background: `linear-gradient(150deg, ${alpha(BLUE, 0.09)} 0%, transparent 65%)`,
        }}
      >
        <span className="flex flex-[3] flex-col gap-1.5">
          <Line w="w-full" h="h-2.5" tone="ink" />
          <Line w="w-2/3" h="h-2.5" color={alpha(BLUE, 0.75)} />
          <Paragraph lines={2} />
          <Pill accent={BLUE} w="w-20" h="h-4.5" className="mt-1" />
        </span>
        <span
          className="flex flex-[2] items-center justify-center rounded"
          style={{
            background: `linear-gradient(135deg, ${alpha(VIOLET, 0.22)}, ${alpha(CYAN, 0.12)})`,
          }}
        />
      </div>
      <div className="grid grid-cols-3 gap-2 border-t border-border-subtle px-3.5 py-3">
        {[BLUE, VIOLET, CYAN].map((tone, i) => (
          <span key={i} className="flex flex-col gap-1">
            <span
              className="size-3.5 rounded-[0.25rem]"
              style={{ backgroundColor: alpha(tone, 0.2) }}
            />
            <Line w="w-3/4" h="h-1" tone="strong" />
            <Line w="w-full" h="h-1" tone="faint" />
          </span>
        ))}
      </div>
    </Plate>
  );
}

/** 04 — Review: the designed page with review pins and a spacing annotation. */
export function ReviewArtifact() {
  return (
    <Plate className="relative p-0">
      <MockNav accent={BLUE} />
      <div className="flex gap-2.5 px-3.5 pb-3.5 pt-1">
        <span className="flex flex-[3] flex-col gap-1.5">
          <Line w="w-full" h="h-2.5" tone="ink" />
          <Line w="w-2/3" h="h-2.5" color={alpha(BLUE, 0.75)} />
          <Paragraph lines={2} />
          <Pill accent={BLUE} w="w-20" h="h-4.5" className="mt-1" />
        </span>
        <span
          className="flex flex-[2] rounded"
          style={{ backgroundColor: alpha(CYAN, 0.12) }}
        />
      </div>

      {/* Review pins. Numbered, in the flat style a design tool uses. */}
      {[
        { top: "26%", left: "8%" },
        { top: "54%", left: "62%" },
      ].map((pos, i) => (
        <span
          key={i}
          className="absolute flex size-5 items-center justify-center rounded-full rounded-bl-none text-[0.5625rem] font-semibold text-white shadow-sm"
          style={{ ...pos, backgroundColor: VIOLET }}
        >
          {i + 1}
        </span>
      ))}

      {/* Spacing annotation between two blocks. */}
      <span
        className="absolute bottom-3 left-3.5 flex items-center gap-1"
        style={{ color: VIOLET }}
      >
        <span className="h-px w-5" style={{ backgroundColor: VIOLET }} />
        <span className="font-mono text-[0.5rem]">24</span>
        <span className="h-px w-5" style={{ backgroundColor: VIOLET }} />
      </span>
    </Plate>
  );
}

/** 05 — Launch: the finished page inside a browser window, plus a status rail. */
export function LaunchArtifact() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_18px_40px_-28px_rgb(14_21_36/0.45)]">
      <BrowserChrome />
      <div>
        <MockNav accent={BLUE} />
        <div
          className="flex gap-2.5 px-3.5 pb-3 pt-1"
          style={{
            background: `linear-gradient(150deg, ${alpha(BLUE, 0.1)} 0%, transparent 62%)`,
          }}
        >
          <span className="flex flex-[3] flex-col gap-1.5">
            <Line w="w-full" h="h-2.5" tone="ink" />
            <Line w="w-2/3" h="h-2.5" color={alpha(BLUE, 0.75)} />
            <Paragraph lines={2} />
            <Pill accent={BLUE} w="w-20" h="h-4.5" className="mt-1" />
          </span>
          <span
            className="flex flex-[2] rounded"
            style={{
              background: `linear-gradient(135deg, ${alpha(CYAN, 0.2)}, ${alpha(BLUE, 0.12)})`,
            }}
          />
        </div>
      </div>

      {/* Status rail: SSL, hosting, search verification — the three things that
          actually have to be true on launch day. No numbers, no uptime claim. */}
      <div
        className="flex items-center gap-4 border-t px-3.5 py-2.5"
        style={{
          borderColor: alpha(CYAN, 0.2),
          backgroundColor: alpha(CYAN, 0.05),
        }}
      >
        {["HTTPS", "Edge", "Indexed"].map((label) => (
          <span key={label} className="flex items-center gap-1.5">
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: CYAN }}
            />
            <span className="text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-text-subtle">
              {label}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export const STAGE_ARTIFACTS = {
  sitemap: SitemapArtifact,
  wireframe: WireframeArtifact,
  ui: UiArtifact,
  review: ReviewArtifact,
  launch: LaunchArtifact,
} as const;
