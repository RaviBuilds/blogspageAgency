/**
 * LADDER RAIL — the five system levels as one rising instrument.
 *
 * The Web Design hero closes on `PillarRatioBar`: one object carrying the model
 * the rest of that page unpacks, on the page's left axis, below both columns.
 * This is the structural equivalent for a page whose model is a *progression*
 * rather than a proportion — five steps rising left to right, each labelled with
 * the level's own short name, the whole thing linking into the ladder section.
 *
 * Reading the rail alone tells a visitor the page's argument: a website is the
 * first rung, and a product is the fifth.
 *
 * Server-renderable (no hooks, no motion, no `"use client"`): the caller wraps it
 * if it wants an entrance. The rising bars are `aria-hidden` decoration; every
 * level name is real text.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { alpha, SYSTEM_TONE } from "@/lib/web-development-visual-system";

export interface LadderRung {
  id: string;
  /** The rung's short name, e.g. "Website". */
  label: string;
  /** 1 (simplest) to `total` — drives the bar height only. */
  weight: number;
}

export function LadderRail({
  rungs,
  href,
  hrefLabel,
  className,
}: {
  rungs: readonly LadderRung[];
  href: string;
  hrefLabel: string;
  className?: string;
}) {
  const total = rungs.length;
  const first = rungs[0]?.label;
  const last = rungs[total - 1]?.label;

  return (
    <div className={cn("w-full", className)}>
      <ol className="flex items-end gap-1.5 sm:gap-2">
        {rungs.map((rung, i) => {
          /* The bar is the rung's weight as a share of the tallest, floored so
             the first rung is still a visible object rather than a hairline. */
          const height = 22 + (rung.weight / total) * 78;
          const accent = i === total - 1 ? SYSTEM_TONE.violet : SYSTEM_TONE.blue;

          return (
            <li key={rung.id} className="flex min-w-0 flex-1 flex-col justify-end gap-2">
              <span
                aria-hidden
                className="block w-full rounded-t-[0.2rem] border-t"
                style={{
                  height: `${height * 0.44}px`,
                  borderTopColor: alpha(accent, 0.65),
                  background: `linear-gradient(180deg, ${alpha(accent, 0.16)}, ${alpha(accent, 0.02)})`,
                }}
              />
              {/* Five ~60px columns cannot hold five names on a phone, so below
                  `sm` the rail keeps its silhouette and the range is stated once
                  underneath instead. The names stay in the DOM at every width. */}
              <span className="hidden border-t border-border-subtle pt-2 text-xs font-medium leading-tight tracking-tight text-text-subtle sm:block">
                {rung.label}
              </span>
            </li>
          );
        })}
      </ol>

      {first && last ? (
        <p className="mt-3 border-t border-border-subtle pt-3 text-xs font-medium tracking-tight text-text-subtle sm:hidden">
          {first}
          {/* The arrow is decoration; the relationship it draws is spelled out
              for a screen reader, which would otherwise hear two bare nouns. */}
          <span aria-hidden> → </span>
          <span className="sr-only"> through to </span>
          {last}
        </p>
      ) : null}

      <Link
        href={href}
        className="group mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-accent-blue underline decoration-accent-blue/30 underline-offset-4 transition-colors hover:decoration-accent-blue"
      >
        {hrefLabel}
        <ArrowRight
          aria-hidden
          className="size-3 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </Link>
    </div>
  );
}
