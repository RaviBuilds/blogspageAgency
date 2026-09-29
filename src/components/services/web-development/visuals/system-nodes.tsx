"use client";

/**
 * Web Development page — system-diagram primitives.
 *
 * The visual counterpart to web-design's `frames.tsx`: where that file draws
 * browser chrome and phone frames (interface artifacts), this file draws
 * system nodes, data-flow connectors and state chips (architecture
 * artifacts). Nothing here is a UI mockup — it's the "premium engineering
 * blueprint" register the canonical spec calls for: node boxes, thin
 * connecting rules, small technical labels, restrained motion.
 *
 * ## Contract
 *
 * - Every export here is decorative unless explicitly noted. Callers wrap
 *   decorative uses in `aria-hidden` and carry meaning in real text beside
 *   the artwork — the identical discipline `frames.tsx` documents.
 * - Server-renderable primitives (`SystemNode`, `FlowRail`) take no hooks.
 *   Only the animated connector (`DrawConnector`) is a client primitive, and
 *   it degrades to fully-drawn under reduced motion / before hydration.
 */

import { motion, useInView, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useRef, type CSSProperties, type ReactNode } from "react";

import { useMotionReady } from "@/components/home/progress-reveal";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { alpha } from "@/lib/web-development-visual-system";

/* -------------------------------------------------------------------------- */
/* Node                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * A single system node: a labelled box with an accent border, optionally
 * emphasised. The base unit every diagram in this file is built from.
 */
export function SystemNode({
  label,
  note,
  accent,
  emphasis = false,
  icon,
  size = "default",
  className,
  labelClassName,
}: {
  label: ReactNode;
  note?: ReactNode;
  accent: string;
  emphasis?: boolean;
  icon?: ReactNode;
  size?: "compact" | "default";
  className?: string;
  /**
   * Overrides on the label's own type.
   *
   * Exists for one measured reason: the architecture flow renders the same seven
   * nodes stacked on a phone and in a row on a desktop, and those two registers
   * want different type sizes. Without a hook on the *label*, a responsive
   * down-shift has to be faked with a descendant selector on the wrapper, which
   * is both fragile and invisible from the call site.
   */
  labelClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center rounded-lg border",
        size === "compact" ? "px-2.5 py-2" : "px-3.5 py-3",
        className,
      )}
      style={{
        borderColor: alpha(accent, emphasis ? 0.5 : 0.18),
        backgroundColor: alpha(accent, emphasis ? 0.1 : 0.04),
      }}
    >
      {icon ? (
        <span aria-hidden className="mb-1.5 flex" style={{ color: accent }}>
          {icon}
        </span>
      ) : null}
      <span
        className={cn(
          "font-semibold leading-snug tracking-tight text-foreground/85",
          size === "compact" ? "text-xs" : "text-sm",
          labelClassName,
        )}
      >
        {label}
      </span>
      {note ? (
        <span className="mt-0.5 block text-[0.6875rem] leading-snug text-text-disabled">
          {note}
        </span>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Draw gate (shared entry-animation contract)                               */
/* -------------------------------------------------------------------------- */

function useDrawGate<T extends HTMLElement>(margin: `${number}px` = "-80px") {
  const ref = useRef<T>(null);
  const reduce = Boolean(useReducedMotion());
  const armed = useMotionReady();
  const inView = useInView(ref, { once: true, margin });
  const settled = reduce || !armed;
  return { ref, settled, drawn: settled || inView };
}

export { useDrawGate };

/* -------------------------------------------------------------------------- */
/* Connectors                                                                */
/* -------------------------------------------------------------------------- */

/**
 * A horizontal connecting rule that draws in on entry, ending in a chevron.
 * The data-flow equivalent of `explainer-chain.tsx`'s `LinkAcross`, kept
 * separate because this page's connectors sit between *system nodes*, not
 * plain-language chain steps, and carry their own `direction` for vertical
 * layouts on narrow viewports.
 */
export function FlowConnector({
  index = 0,
  accent,
  direction = "horizontal",
  settled,
  drawn,
  className,
}: {
  index?: number;
  accent: string;
  direction?: "horizontal" | "vertical";
  settled: boolean;
  drawn: boolean;
  className?: string;
}) {
  const delay = 0.12 + index * 0.15;
  const vertical = direction === "vertical";

  return (
    <span
      aria-hidden
      className={cn(
        "flex items-center justify-center",
        vertical ? "h-6 flex-col" : "flex-1 gap-1",
        className,
      )}
    >
      <motion.span
        className={cn(vertical ? "w-px origin-top" : "h-px flex-1 origin-left")}
        style={{ backgroundColor: alpha(accent, 0.4) }}
        initial={false}
        animate={vertical ? { scaleY: drawn ? 1 : 0 } : { scaleX: drawn ? 1 : 0 }}
        transition={settled ? { duration: 0 } : { duration: 0.42, delay, ease: EASE }}
      />
      <motion.span
        initial={false}
        animate={{ opacity: drawn ? 1 : 0 }}
        transition={
          settled ? { duration: 0 } : { duration: 0.25, delay: delay + 0.3, ease: EASE }
        }
      >
        {vertical ? (
          <ChevronDown className="size-3.5" style={{ color: alpha(accent, 0.8) }} />
        ) : (
          <ChevronRight className="size-3.5" style={{ color: alpha(accent, 0.8) }} />
        )}
      </motion.span>
    </span>
  );
}

/**
 * A vertical "rail" drop — used for fan-out/fan-in shapes (RBAC doors,
 * multi-tenant). Draws top-to-bottom on entry.
 */
export function RailDrop({
  index = 0,
  accent,
  settled,
  drawn,
  height = "h-5",
}: {
  index?: number;
  accent: string;
  settled: boolean;
  drawn: boolean;
  height?: string;
}) {
  const delay = 0.1 + index * 0.08;
  return (
    <motion.span
      aria-hidden
      className={cn("block w-px origin-top", height)}
      style={{ backgroundColor: alpha(accent, 0.4) } as CSSProperties}
      initial={false}
      animate={{ scaleY: drawn ? 1 : 0 }}
      transition={settled ? { duration: 0 } : { duration: 0.32, delay, ease: EASE }}
    />
  );
}

/** A thin horizontal rail spanning a fan-out row, drawing left-to-right. */
export function RailAcross({
  accent,
  settled,
  drawn,
  delay = 0.3,
  className,
}: {
  accent: string;
  settled: boolean;
  drawn: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.span
      aria-hidden
      className={cn("block h-px origin-left", className)}
      style={{ backgroundColor: alpha(accent, 0.4) }}
      initial={false}
      animate={{ scaleX: drawn ? 1 : 0 }}
      transition={settled ? { duration: 0 } : { duration: 0.4, delay, ease: EASE }}
    />
  );
}
