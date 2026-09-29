"use client";

/**
 * SYSTEM FLOW — the request path as a connected chain.
 *
 * The Web Development analogue of Web Design's `ExplainerChain`, drawn from
 * system nodes rather than plain-language chain steps.
 *
 * ## Why it turns horizontal at `lg`, not at `sm`
 *
 * The architecture register renders seven nodes, the longest of which is
 * "Payments / Notifications / AI". Laid out horizontally from the `sm`
 * breakpoint, each node gets roughly a seventh of a 640–1023px container — so on
 * every tablet and large phone in landscape the labels wrapped to three lines and
 * the chain read as a wall of fragments. The vertical form is the correct one at
 * those widths, and it is held until there is genuinely room for the horizontal
 * one.
 *
 * ## Why the horizontal row cannot overflow
 *
 * The first version sized each node to its content (`lg:flex-none`) and let the
 * *connectors* absorb the slack (`flex-1`). Measured against the real deck, the
 * seven nodes' intrinsic widths total more than the 1088px container, and
 * content-sized flex items that cannot shrink do not wrap — they overflow, and
 * the section's `overflow-hidden` then clips the end of the diagram rather than
 * scrolling it.
 *
 * So the geometry is inverted: **nodes flex and may wrap their label, connectors
 * are a fixed 1rem and never grow.** Seven equal columns always fit, at any
 * container width, for any label length the deck might hold. `lg:items-stretch`
 * keeps the row's boxes the same height when one of them takes two lines.
 *
 * Accessibility: every node label is real server-rendered text inside an `<ol>`;
 * only the connecting rules and chevrons are `aria-hidden`. Respects
 * `prefers-reduced-motion` through the shared draw gate.
 */

import { cn } from "@/lib/utils";
import { SYSTEM_TONE, SYSTEM_TONE_ON_DARK } from "@/lib/web-development-visual-system";

import { FlowConnector, SystemNode, useDrawGate } from "./system-nodes";

export function SystemFlow({
  steps,
  size = "section",
  tone = "light",
  className,
}: {
  steps: readonly string[];
  size?: "hero" | "section";
  tone?: "light" | "dark";
  className?: string;
}) {
  const { ref, settled, drawn } = useDrawGate<HTMLOListElement>();
  const accent = tone === "dark" ? SYSTEM_TONE_ON_DARK.blue : SYSTEM_TONE.violet;

  return (
    <ol
      ref={ref}
      className={cn("flex flex-col gap-1 lg:flex-row lg:items-stretch lg:gap-0", className)}
    >
      {steps.map((step, i) => (
        <li
          key={step}
          className={cn(
            "flex min-w-0 flex-col lg:flex-1 lg:flex-row lg:items-stretch",
            // The last node owns no trailing connector, so it needs the width a
            // connector would have taken to keep all seven columns even.
            i === steps.length - 1 && "lg:pr-0",
          )}
        >
          <SystemNode
            label={step}
            accent={accent}
            emphasis={i === 0 || i === steps.length - 1}
            size={size === "hero" ? "compact" : "default"}
            className="min-w-0 flex-1 lg:px-3 lg:py-2.5"
            /* Stacked, each node has the full measure and reads at body size; in
               the seven-column rail it has ~116px, so the label steps down one
               tier rather than wrapping into four lines. */
            labelClassName={size === "section" ? "lg:text-xs" : undefined}
          />
          {i < steps.length - 1 ? (
            <>
              <FlowConnector
                index={i}
                accent={accent}
                direction="vertical"
                settled={settled}
                drawn={drawn}
                className="lg:hidden"
              />
              {/* Fixed width, never flexible: this is what guarantees the row
                  fits regardless of how long the deck's labels are. */}
              <FlowConnector
                index={i}
                accent={accent}
                direction="horizontal"
                settled={settled}
                drawn={drawn}
                className="hidden w-6 shrink-0 grow-0 self-center lg:flex"
              />
            </>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
