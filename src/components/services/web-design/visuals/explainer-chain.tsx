"use client";

/**
 * EXPLAINER CHAIN — the page's plain-language diagram primitive.
 *
 * ## What this is for
 *
 * The page kept drawing *decorated* technical terminology: an icon beside the
 * words "DNS routing" tells a dentist nothing. A diagram earns its place only if
 * it answers "what is happening here?" without the reader knowing the
 * vocabulary. That is one shape, used repeatedly:
 *
 *     your business  →  yourbusiness.com  →  your website
 *     your website   →  fast infrastructure  →  your customer
 *     your business  →  Google Search  →  Google Maps  →  a customer finds you
 *
 * So it is one component, fed from `web-design-plain-language.ts`, rather than
 * six bespoke SVGs that drift apart.
 *
 * ## Contract — this artwork is NOT decorative
 *
 * The labels are the explanation, so they are real server-rendered text inside a
 * real `<ol>`: present in the served HTML, readable with CSS off, announced in
 * order by a screen reader. Only the connectors — the rules and chevrons — are
 * `aria-hidden`, because "→" is already carried by the list's own ordering.
 *
 * This is the opposite of the `frames.tsx` convention, and deliberately so:
 * those are abstract UI shapes standing in for a website, and their meaning
 * lives in the prose beside them. Here the diagram *is* the prose.
 *
 * ## Motion
 *
 * The connectors draw in sequence, once, on entry. The drawing is the direction
 * of the relationship — it is the one thing on the page where the animation
 * carries the meaning rather than presenting it. Gated on `useMotionReady` and
 * `useReducedMotion`; under either, the connectors are simply already drawn, and
 * because only the connectors animate, no word is ever withheld from a reader
 * waiting on JavaScript.
 *
 * ## Responsive
 *
 * A four-node horizontal chain does not survive a 390px viewport, so below the
 * chosen breakpoint the chain recomposes into a vertical one with downward
 * chevrons — the same relationship, read top to bottom. It is not a shrunk copy
 * of the desktop diagram; both orientations are authored.
 */

import { motion, useInView, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useRef, type ReactNode } from "react";

import { useMotionReady } from "@/components/home/progress-reveal";
import { EASE } from "@/lib/motion";
import type { ChainNode } from "@/lib/web-design-plain-language";
import { cn } from "@/lib/utils";

import { alpha } from "./frames";

/* -------------------------------------------------------------------------- */
/* Shared entry-draw gate                                                     */
/* -------------------------------------------------------------------------- */

/**
 * One hook for "has this diagram arrived, and may it animate?".
 *
 * Returns `drawn` (paint the connectors at full extent) and `settled` (skip the
 * transition entirely — reduced motion, or motion not yet armed). Both visuals
 * in this file share it so they cannot disagree about the gate.
 */
function useDrawGate<T extends HTMLElement>(margin: `${number}px` = "-80px") {
  const ref = useRef<T>(null);
  const reduce = Boolean(useReducedMotion());
  const armed = useMotionReady();
  const inView = useInView(ref, { once: true, margin });
  const settled = reduce || !armed;
  return { ref, settled, drawn: settled || inView };
}

/* -------------------------------------------------------------------------- */
/* Connectors                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * The horizontal link between two nodes: a rule that grows from its left edge
 * into a chevron.
 *
 * The chevron fades rather than travels. A chevron that slides along the rule
 * reads as a packet in transit, which is a different (and more technical) claim
 * than "A leads to B" — and it is the kind of perpetual motion the brief rules
 * out.
 */
function LinkAcross({
  index,
  tone,
  settled,
  drawn,
}: {
  index: number;
  tone: string;
  settled: boolean;
  drawn: boolean;
}) {
  const delay = 0.15 + index * 0.18;
  return (
    <span aria-hidden className="hidden flex-1 items-center gap-1 sm:flex">
      <motion.span
        className="h-px flex-1 origin-left"
        style={{ backgroundColor: alpha(tone, 0.4) }}
        initial={false}
        animate={{ scaleX: drawn ? 1 : 0 }}
        transition={
          settled ? { duration: 0 } : { duration: 0.42, delay, ease: EASE }
        }
      />
      <motion.span
        className="flex shrink-0 items-center"
        initial={false}
        animate={{ opacity: drawn ? 1 : 0 }}
        transition={
          settled
            ? { duration: 0 }
            : { duration: 0.25, delay: delay + 0.3, ease: EASE }
        }
      >
        <ChevronRight className="size-3.5" style={{ color: alpha(tone, 0.8) }} />
      </motion.span>
    </span>
  );
}

/** The same link, recomposed downward for the narrow layout. */
function LinkDown({
  index,
  tone,
  settled,
  drawn,
}: {
  index: number;
  tone: string;
  settled: boolean;
  drawn: boolean;
}) {
  const delay = 0.15 + index * 0.18;
  return (
    <span
      aria-hidden
      className="flex h-6 flex-col items-center justify-center sm:hidden"
    >
      <motion.span
        className="w-px flex-1 origin-top"
        style={{ backgroundColor: alpha(tone, 0.4) }}
        initial={false}
        animate={{ scaleY: drawn ? 1 : 0 }}
        transition={
          settled ? { duration: 0 } : { duration: 0.32, delay, ease: EASE }
        }
      />
      <motion.span
        initial={false}
        animate={{ opacity: drawn ? 1 : 0 }}
        transition={
          settled
            ? { duration: 0 }
            : { duration: 0.25, delay: delay + 0.22, ease: EASE }
        }
      >
        <ChevronDown className="size-3.5" style={{ color: alpha(tone, 0.8) }} />
      </motion.span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* The chain                                                                  */
/* -------------------------------------------------------------------------- */

export type ExplainerTone = "light" | "dark";
export type ExplainerSize = "compact" | "feature";

/**
 * A node's surface. The emphasised node gets the accent fill and border; the
 * rest stay quiet, because a chain in which every node is highlighted has no
 * subject.
 */
function nodeStyle(tone: string, emphasis: boolean | undefined, dark: boolean) {
  if (emphasis) {
    return {
      borderColor: alpha(tone, dark ? 0.55 : 0.38),
      backgroundColor: alpha(tone, dark ? 0.14 : 0.08),
    };
  }
  return {
    borderColor: alpha(tone, dark ? 0.16 : 0.18),
    backgroundColor: alpha(tone, dark ? 0.05 : 0.03),
  };
}

export function ExplainerChain({
  steps,
  accent,
  tone = "light",
  size = "compact",
  className,
  icons,
}: {
  steps: readonly ChainNode[];
  /** Accent hex. Callers pass the pillar tone for their surface. */
  accent: string;
  tone?: ExplainerTone;
  size?: ExplainerSize;
  className?: string;
  /** Optional decorative glyph per node id. Never the only carrier of meaning. */
  icons?: Record<string, ReactNode>;
}) {
  const { ref, settled, drawn } = useDrawGate<HTMLOListElement>();
  const dark = tone === "dark";
  const feature = size === "feature";

  return (
    <ol
      ref={ref}
      className={cn(
        "flex flex-col sm:flex-row sm:items-stretch",
        feature ? "sm:gap-0" : "sm:gap-0",
        className,
      )}
    >
      {steps.map((step, i) => (
        <li
          key={step.id}
          className={cn(
            "flex flex-col sm:flex-1 sm:flex-row sm:items-center",
            /* The last node must not reserve connector space, or the chain
               ends with a gap where an arrow is not. */
            i === steps.length - 1 && "sm:flex-none",
          )}
        >
          <div
            className={cn(
              "flex min-w-0 flex-col justify-center rounded-xl border",
              feature ? "px-4 py-3.5 sm:px-5 sm:py-4" : "px-3 py-2.5",
            )}
            style={nodeStyle(accent, step.emphasis, dark)}
          >
            {icons?.[step.id] ? (
              <span aria-hidden className="mb-2 flex" style={{ color: accent }}>
                {icons[step.id]}
              </span>
            ) : null}

            <span
              className={cn(
                "block font-semibold leading-snug tracking-tight",
                feature ? "text-sm sm:text-[0.9375rem]" : "text-xs",
                dark
                  ? step.emphasis
                    ? "text-surface-dark-foreground"
                    : "text-white/75"
                  : step.emphasis
                    ? "text-foreground"
                    : "text-foreground/80",
              )}
            >
              {step.label}
            </span>

            {step.note ? (
              /* The technical annotation. Subordinate by size and colour at
                 every breakpoint — a technical reader can find it, and a
                 business owner never has to read it to follow the chain. */
              <span
                className={cn(
                  "mt-1 block text-[0.6875rem] leading-snug",
                  dark ? "text-white/40" : "text-text-disabled",
                )}
              >
                {step.note}
              </span>
            ) : null}
          </div>

          {i < steps.length - 1 ? (
            <>
              <LinkDown index={i} tone={accent} settled={settled} drawn={drawn} />
              <LinkAcross
                index={i}
                tone={accent}
                settled={settled}
                drawn={drawn}
              />
            </>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/* -------------------------------------------------------------------------- */
/* The NAP fan                                                                */
/* -------------------------------------------------------------------------- */

/**
 * THREE FACTS → MANY PLACES → ONE RESULT.
 *
 * NAP consistency is the one relationship on the page a straight line cannot
 * state: the point is not that name leads to Google, it is that *the same three
 * facts* arrive at *every* destination unchanged. So the middle of this diagram
 * is a fan, and the conclusion is stated as the diagram's own closing line.
 *
 * Same accessibility contract as `ExplainerChain`: the facts, the destinations
 * and the conclusion are real text; the rules between them are `aria-hidden`.
 */
export function NapFan({
  source,
  sourceLabel,
  destinations,
  destinationLabel,
  conclusion,
  accent,
  tone = "light",
  className,
}: {
  source: readonly { id: string; label: string }[];
  sourceLabel: string;
  destinations: readonly { id: string; label: string }[];
  destinationLabel: string;
  conclusion: string;
  accent: string;
  tone?: ExplainerTone;
  className?: string;
}) {
  const { ref, settled, drawn } = useDrawGate<HTMLDivElement>("-70px");
  const dark = tone === "dark";

  const rail = (index: number, vertical: boolean) => ({
    initial: false as const,
    animate: vertical
      ? { scaleY: drawn ? 1 : 0 }
      : { scaleX: drawn ? 1 : 0 },
    transition: settled
      ? { duration: 0 }
      : { duration: 0.4, delay: 0.14 + index * 0.1, ease: EASE },
  });

  const cell = cn(
    "rounded-lg border px-3 py-2 text-xs font-medium leading-snug tracking-tight",
    dark ? "text-white/80" : "text-foreground/85",
  );
  const cellStyle = {
    borderColor: alpha(accent, dark ? 0.18 : 0.2),
    backgroundColor: alpha(accent, dark ? 0.05 : 0.04),
  };
  const groupLabel = cn(
    "block text-[0.6875rem] font-medium uppercase tracking-[0.14em]",
    dark ? "text-white/40" : "text-text-disabled",
  );

  return (
    <div ref={ref} className={cn("flex flex-col", className)}>
      {/* THE THREE FACTS. */}
      <div>
        <span className={groupLabel}>{sourceLabel}</span>
        <ul className="mt-2.5 grid grid-cols-3 gap-2">
          {source.map((item) => (
            <li key={item.id} className={cell} style={cellStyle}>
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      {/* THE FAN. Three verticals dropping onto a shared horizontal rail —
          the shape that says "each of these goes to all of those". */}
      <div aria-hidden className="relative h-9">
        <span className="absolute inset-x-0 top-0 grid grid-cols-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className="flex justify-center">
              <motion.span
                className="block h-4 w-px origin-top"
                style={{ backgroundColor: alpha(accent, 0.4) }}
                {...rail(i, true)}
              />
            </span>
          ))}
        </span>
        <motion.span
          className="absolute left-[16.666%] right-[16.666%] top-4 block h-px origin-left"
          style={{ backgroundColor: alpha(accent, 0.4) }}
          {...rail(3, false)}
        />
        <span className="absolute inset-x-0 top-4 grid grid-cols-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className="flex flex-col items-center">
              <motion.span
                className="block h-4 w-px origin-top"
                style={{ backgroundColor: alpha(accent, 0.4) }}
                {...rail(4 + i, true)}
              />
              <motion.span
                initial={false}
                animate={{ opacity: drawn ? 1 : 0 }}
                transition={
                  settled
                    ? { duration: 0 }
                    : { duration: 0.24, delay: 0.7 + i * 0.08, ease: EASE }
                }
              >
                <ChevronDown
                  className="size-3"
                  style={{ color: alpha(accent, 0.8) }}
                />
              </motion.span>
            </span>
          ))}
        </span>
      </div>

      {/* THE DESTINATIONS. */}
      <div>
        <span className={groupLabel}>{destinationLabel}</span>
        <ul className="mt-2.5 grid grid-cols-3 gap-2">
          {destinations.map((item) => (
            <li key={item.id} className={cell} style={cellStyle}>
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      {/* THE CONCLUSION. The one line the whole diagram exists to deliver, so
          it is the only accented type in it. */}
      <p
        className="mt-5 rounded-lg border px-3.5 py-2.5 text-center text-sm font-semibold tracking-tight"
        style={{
          borderColor: alpha(accent, dark ? 0.5 : 0.35),
          backgroundColor: alpha(accent, dark ? 0.12 : 0.07),
          color: dark ? undefined : accent,
        }}
      >
        <span className={dark ? "text-surface-dark-foreground" : undefined}>
          {conclusion}
        </span>
      </p>
    </div>
  );
}
