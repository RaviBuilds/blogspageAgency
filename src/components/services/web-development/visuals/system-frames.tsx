/**
 * Web Development page — application chrome and engineering artefacts.
 *
 * The counterpart to Web Design's `visuals/frames.tsx`, in this page's own
 * register. That file draws *browser* chrome, because its subject is the
 * front-of-house website. This page's subject is the system behind it, so the
 * frame here is an **application window**: an app mark, a role rail and a
 * status light — the chrome of a dashboard a member of staff signs into, never
 * an address bar.
 *
 * ## Contract
 *
 * - Every export is decorative. Callers mark them `aria-hidden` (or render them
 *   inside an already-`aria-hidden` subtree) and carry the meaning in real text
 *   beside the artwork. Nothing here renders a heading, a link, or a string a
 *   visitor needs in order to understand the page.
 * - Server-renderable: no hooks, no `"use client"`, no motion, no images. A
 *   five-stage process gallery therefore costs zero bytes of media and zero
 *   bytes of JavaScript, which is the whole reason it is separate from
 *   `system-nodes.tsx` (a client module).
 * - Accent colours arrive as hex strings and are composited with `alpha()`,
 *   because `color-mix` on a CSS variable is not safe across this project's
 *   browser floor — the same decision `frames.tsx` documents.
 */

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { alpha } from "@/lib/web-development-visual-system";

/* -------------------------------------------------------------------------- */
/* Application chrome                                                         */
/* -------------------------------------------------------------------------- */

/**
 * The chrome of a signed-in application: a square app mark, a rail of role
 * tabs, and a live status dot.
 *
 * `roles` are drawn as abstract pills rather than words, so the frame never
 * introduces a label that could read as a claim about a specific screenshot's
 * contents. The *real* role names live in the copy beside the image.
 */
export function AppChrome({
  accent,
  tone = "paper",
  roles = 3,
  className,
}: {
  accent: string;
  tone?: "paper" | "ink";
  roles?: number;
  className?: string;
}) {
  const ink = tone === "ink";
  return (
    <div
      aria-hidden
      className={cn(
        "flex items-center gap-2.5 border-b px-3.5 py-2.5",
        ink ? "border-white/10 bg-white/[0.04]" : "border-border-subtle bg-background-subtle",
        className,
      )}
    >
      <span
        className="size-3 shrink-0 rounded-[0.25rem]"
        style={{ backgroundColor: accent }}
      />
      <span className="flex flex-1 items-center gap-1.5">
        {Array.from({ length: roles }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-2.5 rounded-full",
              i === 0 ? "w-12" : "w-8",
              ink ? "bg-white/15" : "bg-border",
            )}
            style={i === 0 ? { backgroundColor: alpha(accent, ink ? 0.5 : 0.3) } : undefined}
          />
        ))}
      </span>
      <span
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: alpha(accent, 0.7) }}
      />
    </div>
  );
}

/**
 * An application window: chrome plus a body.
 *
 * `elevation` mirrors `frames.tsx`'s three-step depth vocabulary rather than
 * introducing a fourth shadow per call site.
 */
export function AppWindow({
  children,
  accent,
  tone = "paper",
  elevation = "raised",
  className,
  bodyClassName,
}: {
  children: ReactNode;
  accent: string;
  tone?: "paper" | "ink";
  elevation?: "flat" | "raised" | "hero";
  className?: string;
  bodyClassName?: string;
}) {
  const ink = tone === "ink";
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border",
        ink ? "border-white/10 bg-[#0B0E14]" : "border-border bg-card",
        elevation === "raised" && "shadow-[0_18px_40px_-28px_rgb(14_21_36/0.45)]",
        elevation === "hero" &&
          "shadow-[0_44px_90px_-40px_rgb(14_21_36/0.42),0_10px_24px_-14px_rgb(14_21_36/0.20)]",
        className,
      )}
    >
      <AppChrome accent={accent} tone={tone} />
      <div className={cn("relative", bodyClassName)}>{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Artefact atoms                                                             */
/* -------------------------------------------------------------------------- */

/** A hairline rule standing in for a row of data or a line of copy. */
export function Rule({
  w = "w-full",
  h = "h-1.5",
  color,
  className,
}: {
  w?: string;
  h?: string;
  color?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("block rounded-full", h, w, !color && "bg-border", className)}
      style={color ? { backgroundColor: color } : undefined}
    />
  );
}

/** A small technical chip — a field name, a state, a tag. */
export function Chip({
  accent,
  w = "w-10",
  filled = false,
  className,
}: {
  accent: string;
  w?: string;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("block h-3 rounded-[0.25rem] border", w, className)}
      style={{
        borderColor: alpha(accent, filled ? 0.5 : 0.22),
        backgroundColor: alpha(accent, filled ? 0.18 : 0.05),
      }}
    />
  );
}

/**
 * A bordered artefact card — the shell every process-stage artefact is drawn
 * inside, so five stages read as five states of one object rather than five
 * unrelated illustrations.
 */
export function ArtefactCard({
  children,
  label,
  accent,
  className,
}: {
  children: ReactNode;
  /** A short uppercase marker. Decorative: the real deliverable is in the copy. */
  label: string;
  accent: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-xl border border-border-subtle bg-card/70 p-4",
        "shadow-[0_18px_40px_-34px_rgb(14_21_36/0.4)]",
        className,
      )}
    >
      <span
        className="mb-3 block text-[0.625rem] font-semibold uppercase tracking-[0.14em]"
        style={{ color: alpha(accent, 0.85) }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}
