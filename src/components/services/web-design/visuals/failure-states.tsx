/**
 * Failure-state artwork for the problem diagnosis (section 2).
 *
 * Three motifs that draw the actual defect rather than an icon standing in for
 * it, so the problem is legible before the paragraph beside it is read:
 *
 * - `template`  — a stock page where every block is the same block, struck
 *                 through, with the stock photo drawn as a crossed placeholder.
 * - `invisible` — a local result list in which three competitors resolve and the
 *                 business is a dashed, empty outline.
 * - `friction`  — a phone whose fold is consumed by clutter and whose only
 *                 contact action sits below it, with a thumb reach arc that does
 *                 not get there.
 *
 * ## Register
 *
 * Diagnostic, not alarmist. The palette is the page's neutrals with one hairline
 * of `--destructive` per motif and no red fills, no warning triangles, no
 * exclamation marks. A section that shouts at a visitor about their current
 * website is not a premium section.
 *
 * Decorative and static: `aria-hidden` is applied by the caller, no hooks, no
 * motion, no images.
 */

import { Line, Paragraph, alpha } from "./frames";

const DANGER = "#D92D20";

/* -------------------------------------------------------------------------- */

/** A crossed box — the universal "image failed / stock placeholder" glyph. */
function CrossedPlaceholder({ className }: { className?: string }) {
  return (
    <span
      className={`relative block overflow-hidden rounded border border-border bg-background-subtle ${className ?? ""}`}
    >
      <span className="absolute left-0 top-0 h-px w-[141%] origin-top-left rotate-45 bg-border-strong" />
      <span className="absolute right-0 top-0 h-px w-[141%] origin-top-right -rotate-45 bg-border-strong" />
    </span>
  );
}

/**
 * MOTIF 1 — the template trap.
 *
 * Three identical rows, identical widths, identical crossed placeholders. The
 * repetition is the point: nothing in the layout says anything about a business.
 */
export function TemplateFailure() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card p-3">
      {/* Nav that could belong to anyone. */}
      <div className="flex items-center gap-2 border-b border-border-subtle pb-2.5">
        <CrossedPlaceholder className="size-4" />
        <span className="flex flex-1 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <Line key={i} w="w-8" h="h-1" tone="faint" />
          ))}
        </span>
      </div>

      {/* Three structurally identical blocks. */}
      <div className="mt-3 flex flex-col gap-2.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2.5">
            <CrossedPlaceholder className="size-10 shrink-0" />
            <span className="flex flex-1 flex-col gap-1.5">
              <Line w="w-1/2" h="h-1.5" tone="muted" />
              <Paragraph lines={2} />
            </span>
          </div>
        ))}
      </div>

      {/* The diagnosis hairline: one ruled strike across the repeated field. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-1/2 h-px"
        style={{ backgroundColor: alpha(DANGER, 0.45) }}
      />
      <span
        aria-hidden
        className="absolute right-3 top-[calc(50%-0.6rem)] rounded-full px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.12em]"
        style={{
          color: DANGER,
          backgroundColor: alpha(DANGER, 0.08),
          border: `1px solid ${alpha(DANGER, 0.25)}`,
        }}
      >
        Identical
      </span>
    </div>
  );
}

/**
 * MOTIF 2 — invisible in local discovery.
 *
 * A local pack where three results resolve normally and the fourth slot — the
 * business's — is a dashed, empty outline. The absence is the illustration.
 */
export function InvisibleFailure() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card p-3">
      {/* Search rail. */}
      <span className="flex h-6 items-center gap-2 rounded-full border border-border bg-background-subtle px-2.5">
        <span className="size-2 rounded-full bg-border-strong" />
        <Line w="w-1/2" h="h-1.5" tone="muted" />
      </span>

      {/* A map band with pins, one of which is hollow. */}
      <div
        className="relative mt-2.5 h-14 overflow-hidden rounded border border-border-subtle"
        style={{
          background:
            "linear-gradient(120deg, #EDF1F6 0%, #F7F8FA 50%, #EDF1F6 100%)",
        }}
      >
        {/* Abstract street lines. */}
        <span className="absolute left-0 top-5 h-px w-full bg-border" />
        <span className="absolute left-1/3 top-0 h-full w-px bg-border" />
        <span className="absolute left-2/3 top-0 h-full w-px bg-border" />
        {[
          { left: "18%", top: "55%" },
          { left: "46%", top: "26%" },
          { left: "76%", top: "62%" },
        ].map((pos, i) => (
          <span
            key={i}
            className="absolute size-2 rounded-full ring-2 ring-white"
            style={{ ...pos, backgroundColor: "#0E7490" }}
          />
        ))}
        {/* The business: a hollow pin that never resolved. */}
        <span
          className="absolute size-3 rounded-full border-2 border-dashed"
          style={{ left: "58%", top: "68%", borderColor: alpha(DANGER, 0.6) }}
        />
      </div>

      {/* Result list — three filled, one empty. */}
      <div className="mt-2.5 flex flex-col gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="size-3 shrink-0 rounded-[0.2rem] bg-background-subtle" />
            <span className="flex flex-1 flex-col gap-1">
              <Line w={i === 1 ? "w-2/3" : "w-1/2"} h="h-1" tone="strong" />
              <Line w="w-1/3" h="h-1" tone="faint" />
            </span>
          </span>
        ))}
        <span
          className="mt-0.5 flex items-center gap-2 rounded border border-dashed px-2 py-1.5"
          style={{ borderColor: alpha(DANGER, 0.35) }}
        >
          <span
            className="size-3 shrink-0 rounded-[0.2rem] border border-dashed"
            style={{ borderColor: alpha(DANGER, 0.4) }}
          />
          <span
            className="text-[0.5625rem] font-semibold uppercase tracking-[0.12em]"
            style={{ color: alpha(DANGER, 0.85) }}
          >
            Your business — not listed
          </span>
        </span>
      </div>
    </div>
  );
}

/**
 * MOTIF 3 — mobile and enquiry friction.
 *
 * The fold line is drawn explicitly. Everything above it is clutter; the one
 * contact action sits below it, under a thumb-reach arc that stops short. This is
 * the section's most literal drawing because it is the least intuitive failure
 * to describe in prose.
 */
export function FrictionFailure() {
  return (
    <div className="flex items-start justify-center">
      <div className="relative w-[148px] overflow-hidden rounded-[1.4rem] border border-border bg-card p-2 shadow-sm">
        {/* Cluttered header: too many items, none prioritised. */}
        <div className="flex items-center justify-between">
          <Line w="w-8" h="h-1.5" tone="strong" />
          <span className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="size-1.5 rounded-full bg-border" />
            ))}
          </span>
        </div>

        <div className="mt-2 flex flex-col gap-1.5">
          <CrossedPlaceholder className="h-10 w-full" />
          <Paragraph lines={3} />
          <div className="grid grid-cols-2 gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="flex flex-col gap-1 rounded border border-border-subtle p-1"
              >
                <Line w="w-full" h="h-1" tone="faint" />
                <Line w="w-2/3" h="h-1" tone="faint" />
              </span>
            ))}
          </div>
        </div>

        {/* THE FOLD. */}
        <div className="relative my-2">
          <span
            className="block h-px w-full"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${alpha(DANGER, 0.5)} 0 4px, transparent 4px 8px)`,
            }}
          />
          <span
            className="absolute -top-1.5 right-0 bg-card px-1 text-[0.5rem] font-semibold uppercase tracking-[0.12em]"
            style={{ color: alpha(DANGER, 0.85) }}
          >
            Fold
          </span>
        </div>

        {/* Below the fold: the only way to enquire, and it is tiny. */}
        <div className="flex flex-col gap-1.5 pb-1">
          <Paragraph lines={2} />
          <span className="flex justify-end">
            <span
              className="rounded px-1.5 py-0.5 text-[0.5rem] font-medium"
              style={{ color: "#5D6B7E", border: "1px solid #DDE3EC" }}
            >
              Contact
            </span>
          </span>
        </div>

        {/* Thumb reach arc — comfortable zone, drawn so it visibly stops above
            the action it is supposed to reach. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -left-8 bottom-6 size-24 rounded-full border border-dashed"
          style={{ borderColor: alpha(DANGER, 0.3) }}
        />
      </div>
    </div>
  );
}

export const FAILURE_MOTIFS = {
  template: TemplateFailure,
  invisible: InvisibleFailure,
  friction: FrictionFailure,
} as const;
