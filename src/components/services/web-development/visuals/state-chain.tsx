"use client";

/**
 * STATE CHAIN — a request moving through the states a system puts it in.
 *
 * Used twice in the proof gallery, for the two builds whose claim is a sequence:
 *
 * - NextInn's booking lifecycle: Requested → Paid → Confirmed → Assigned →
 *   Completed (canonical spec §29).
 * - Phixl AI's generation pipeline: Upload → AI Processing → Result → Credits &
 *   Payment.
 *
 * The last state is emphasised so the diagram reads as "this is where it ends
 * up" rather than as an abstract sequence.
 *
 * ## Why this replaced `MvpLoop`
 *
 * The AI pipeline was previously drawn with a loop component whose hardcoded
 * caption read "loops back to Upload — the cycle continues after launch". That is
 * true of an MVP's build/learn cycle and false of a per-request generation
 * pipeline: an upload does not loop back to itself, and the copy deck claims no
 * such thing. A caption that contradicts its own diagram is worse than no
 * diagram, so the loop component and its unused data table were removed rather
 * than reworded — the two builds that needed a sequence now share one honest
 * primitive.
 *
 * Real text throughout (a state name is meaningful content); only the connectors
 * are `aria-hidden`.
 */

import { cn } from "@/lib/utils";

import { FlowConnector, SystemNode, useDrawGate } from "./system-nodes";

export function StateChain({
  states,
  accent,
  className,
}: {
  states: readonly { id: string; label: string }[];
  accent: string;
  className?: string;
}) {
  const { ref, settled, drawn } = useDrawGate<HTMLOListElement>();

  return (
    <ol ref={ref} className={cn("flex flex-wrap items-center gap-x-1.5 gap-y-2", className)}>
      {states.map((state, i) => (
        <li key={state.id} className="flex items-center gap-1.5">
          <SystemNode
            label={state.label}
            accent={accent}
            emphasis={i === states.length - 1}
            size="compact"
          />
          {i < states.length - 1 ? (
            <FlowConnector
              index={i}
              accent={accent}
              settled={settled}
              drawn={drawn}
              className="w-4 flex-none sm:w-6"
            />
          ) : null}
        </li>
      ))}
    </ol>
  );
}
