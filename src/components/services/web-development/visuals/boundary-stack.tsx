/**
 * BOUNDARY STACK — what a visitor sees, and what runs underneath it.
 *
 * Section 02's job is one idea: the same website has two layers. A list of ten
 * pills cannot show a boundary, because a boundary needs two sides and an edge.
 *
 * So this draws the two sides literally stacked: an abstract page surface on top
 * (nav, heading, copy, a form with a submit action — the design layer), a single
 * labelled seam, and the system beneath it (validation → rules → record →
 * dashboard → notification). The seam is the section's whole argument, rendered
 * once instead of asserted twice.
 *
 * The UI atoms on the top layer are Web Design's own (`visuals/frames.tsx`) —
 * imported rather than re-drawn, because the top layer *is* that page's subject
 * and re-implementing its vocabulary here is how two pages start looking like two
 * design systems.
 *
 * Fully decorative: the whole tree is `aria-hidden` by the caller, and the
 * section's meaning is carried by the real lists beside it. Server-renderable —
 * no hooks, no motion, no `"use client"`.
 */

import { Line, MockNav, Paragraph } from "@/components/services/web-design/visuals/frames";
import { cn } from "@/lib/utils";
import { alpha, SYSTEM_TONE } from "@/lib/web-development-visual-system";

/** The layer names on the seam. Decorative labels, not content. */
const SEAM_ABOVE = "What the visitor sees";
const SEAM_BELOW = "What runs when they act";

/** The system row beneath the seam, in the order a submitted form travels. */
const SYSTEM_STEPS = ["Validate", "Apply rules", "Store record", "Notify team", "Confirm"] as const;

export function BoundaryStack({ className }: { className?: string }) {
  const design = SYSTEM_TONE.cyan;
  const system = SYSTEM_TONE.blue;

  return (
    <div aria-hidden className={cn("select-none", className)}>
      {/* ── THE DESIGN LAYER ───────────────────────────────────────────────
          A page surface, drawn with Web Design's own atoms. Ends on a form,
          because the form is where the two layers meet. */}
      <div className="overflow-hidden rounded-t-xl border border-b-0 border-border bg-card shadow-[0_18px_40px_-34px_rgb(14_21_36/0.4)]">
        <MockNav accent={design} />
        <div className="border-t border-border-subtle px-4 pb-4 pt-4">
          <Line w="w-2/3" h="h-2.5" tone="ink" />
          <Paragraph lines={2} className="mt-3" />
          <div className="mt-4 flex items-center gap-2">
            <span
              className="h-6 flex-1 rounded-md border"
              style={{
                borderColor: alpha(design, 0.28),
                backgroundColor: alpha(design, 0.05),
              }}
            />
            <span
              className="h-6 w-16 rounded-md"
              style={{ backgroundColor: alpha(design, 0.75) }}
            />
          </div>
        </div>
      </div>

      {/* ── THE SEAM ───────────────────────────────────────────────────────
          The one edge the section exists to explain. A dashed rule with the two
          layer names on either side of it. */}
      <div
        className="relative border-x border-border bg-background-subtle px-4 py-3"
        style={{
          backgroundImage: `linear-gradient(180deg, ${alpha(design, 0.05)}, ${alpha(system, 0.06)})`,
        }}
      >
        <div className="flex items-center justify-between gap-3 text-[0.625rem] font-semibold uppercase tracking-[0.12em]">
          <span style={{ color: alpha(design, 0.95) }}>{SEAM_ABOVE}</span>
          <span className="h-px flex-1 border-t border-dashed border-border-strong/60" />
          <span style={{ color: alpha(system, 0.95) }}>{SEAM_BELOW}</span>
        </div>
      </div>

      {/* ── THE SYSTEM LAYER ───────────────────────────────────────────────
          Five nodes on one rail. Deliberately plainer than the surface above it:
          this layer has no styling to show, only sequence.

          Wrapping rather than five equal columns: in the five-of-twelve column
          this visual occupies at `lg`, five fixed columns give each node ~68px,
          which breaks "Apply rules" across two lines and makes a pipeline look
          like a compression artefact. Wrapping keeps every chip at its natural
          width at every viewport. */}
      <div className="overflow-hidden rounded-b-xl border border-t-0 border-border bg-background-subtle p-4">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
          {SYSTEM_STEPS.map((step, i) => (
            <li key={step} className="flex items-center gap-1.5">
              <span
                className="rounded-md border px-2 py-1.5 text-[0.6875rem] font-semibold leading-none tracking-tight"
                style={{
                  borderColor: alpha(system, i === 0 || i === SYSTEM_STEPS.length - 1 ? 0.45 : 0.2),
                  backgroundColor: alpha(system, i === 0 || i === SYSTEM_STEPS.length - 1 ? 0.1 : 0.04),
                  color: alpha(system, 0.95),
                }}
              >
                {step}
              </span>
              {i < SYSTEM_STEPS.length - 1 ? (
                <span
                  className="h-px w-2.5 shrink-0"
                  style={{ backgroundColor: alpha(system, 0.35) }}
                />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
