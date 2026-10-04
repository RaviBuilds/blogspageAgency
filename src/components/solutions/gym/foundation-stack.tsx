import { ArrowRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  DELIVERABLES,
  ECOSYSTEM_ID,
  FOUNDATION_FLOW,
  LAYERS,
  WEBSITE_INCLUDES,
  type LayerId,
  type Status,
} from "./content";
import { InView } from "./in-view";
import { StatusBadge } from "./primitives";

/**
 * Section 08 — what we build, as the layers of one digital foundation.
 *
 * Each layer is a band; each deliverable sits in its band with an honest
 * status (required / recommended / included / concept / add-on) and a one-line
 * reason for existing. The growth layer is dashed: it is where the system can
 * go, scoped separately, not part of the starting foundation.
 */

const BAND: Record<LayerId, string> = {
  foundation: "border-white/25 bg-white/[0.035]",
  discovery: "border-primary/35 bg-primary/[0.05]",
  conversion: "border-[#25d366]/30 bg-[#25d366]/[0.035]",
  growth: "border-dashed border-white/20 bg-transparent",
};

const INDEX_TINT: Record<LayerId, string> = {
  foundation: "text-foreground",
  discovery: "text-primary",
  conversion: "text-[#7ee2a8]",
  growth: "text-foreground/50",
};

const LAYER_NOTE: Partial<Record<LayerId, string>> = {
  foundation: "Without these, there is no website.",
  discovery: "Not technically required. Highly valuable for a local gym.",
};

const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as React.CSSProperties;

export function FoundationStack() {
  return (
    <InView className="space-y-3" threshold={0.05}>
      {LAYERS.map((layer, li) => {
        const items = DELIVERABLES.filter((x) => x.layer === layer.id);
        const isFoundation = layer.id === "foundation";
        const website = isFoundation ? items.find((x) => x.id === "website") : undefined;
        const rest = website ? items.filter((x) => x !== website) : items;
        return (
          <section
            key={layer.id}
            aria-labelledby={`gym-layer-${layer.id}`}
            className={cn("gym-rise grid rounded-3xl border lg:grid-cols-[17rem_minmax(0,1fr)]", BAND[layer.id])}
            style={d(li * 140)}
          >
            {/* layer label */}
            <div className="border-b border-white/[0.08] p-6 lg:border-b-0 lg:border-r lg:p-7">
              <p className={cn("font-mono text-xs tabular-nums", INDEX_TINT[layer.id])}>Layer {layer.index}</p>
              <h3 id={`gym-layer-${layer.id}`} className="mt-2 text-xl font-semibold tracking-tight">
                {layer.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{layer.summary}</p>
              {LAYER_NOTE[layer.id] ? <p className="mt-3 text-sm font-medium text-foreground/80">{LAYER_NOTE[layer.id]}</p> : null}
              {layer.id === "growth" ? (
                <a
                  href={`#${ECOSYSTEM_ID}`}
                  className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  See how it grows <ArrowUpRight className="size-4" />
                </a>
              ) : null}
            </div>

            {/* deliverables */}
            <div>
              {website ? (
                <div className="border-b border-white/[0.08] p-6 lg:p-7">
                  <Item name={website.name} status={website.status} reason={website.reason} large />
                  <ul aria-label="What the website includes" className="mt-4 flex flex-wrap gap-1.5">
                    {WEBSITE_INCLUDES.map((w) => (
                      <li key={w} className="rounded-full border border-white/10 px-3 py-1 text-xs text-foreground/70">
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <ul className="grid sm:grid-cols-2 xl:grid-cols-4">
                {rest.map((item) => (
                  <li
                    key={item.id}
                    className="border-b border-white/[0.07] p-6 last:border-b-0 sm:even:border-l sm:[&:nth-child(n+3)]:border-b-0 lg:p-7 xl:border-b-0 xl:[&:not(:first-child)]:border-l"
                  >
                    <Item name={item.name} status={item.status} reason={item.reason} note={item.note} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      {/* how the layers relate */}
      <div className="gym-rise pt-10" style={d(600)}>
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-foreground/50">How the layers work together</p>
        <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-3">
          {FOUNDATION_FLOW.map((step, i) => (
            <li key={step} className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium",
                  i === 0 ? "border-white/40 bg-white text-black" : i === FOUNDATION_FLOW.length - 1 ? "border-dashed border-white/25 text-foreground/60" : "border-white/15 text-foreground/85",
                )}
              >
                {step}
              </span>
              {i < FOUNDATION_FLOW.length - 1 ? <ArrowRight aria-hidden className="size-4 text-foreground/35" /> : null}
            </li>
          ))}
        </ol>
      </div>
    </InView>
  );
}

function Item({
  name,
  status,
  reason,
  note,
  large,
}: {
  name: string;
  status: Status;
  reason: string;
  note?: string;
  large?: boolean;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <p className={cn("font-semibold tracking-tight", large ? "text-xl" : "text-base")}>{name}</p>
        <StatusBadge status={status} className="max-w-full whitespace-normal" />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{reason}</p>
      {note ? <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-foreground/45">{note}</p> : null}
    </div>
  );
}
