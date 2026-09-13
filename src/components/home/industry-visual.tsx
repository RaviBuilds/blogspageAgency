"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * R7 — IndustryStoryStrip.
 *
 * The decorative three-node micro-story strip shown in the industry story
 * panel: node glyph → connecting line → node glyph → …  A supplementary
 * business-relationship visual (presence → system → outcome), never the
 * primary recognition element — the industry title and benefit line carry
 * the meaning. The whole strip is `aria-hidden`; the panel's verified copy
 * is what assistive technology reads.
 *
 * Motion: the connector lines draw once when the strip mounts (i.e. when an
 * industry is selected). Under reduced motion everything renders statically.
 * Pure presentational: no data access, no analytics.
 */

type IndustryStoryStripProps = {
  /** The verified three-node chain from `industry-discovery.ts`. */
  labels: readonly string[];
  /** Raw `r,g,b` stage accent for glyph + connector coloring. */
  accent: string;
};

function NodeGlyph({ index, accent }: { index: number; accent: string }) {
  const color = `rgb(${accent})`;

  if (index === 0) {
    // Presence / customer-facing: open circle.
    return (
      <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
        <circle cx="8" cy="8" r="5.5" fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
    );
  }

  if (index === 1) {
    // Business system: rounded square.
    return (
      <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
        <rect
          x="3"
          y="3"
          width="10"
          height="10"
          rx="2.5"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  // Outcome: filled core inside an open ring.
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
      <circle cx="8" cy="8" r="3" fill={color} />
      <circle cx="8" cy="8" r="6" fill="none" stroke={color} strokeOpacity="0.4" strokeWidth="1.25" />
    </svg>
  );
}

export function IndustryStoryStrip({ labels, accent }: IndustryStoryStripProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div aria-hidden className="flex items-center">
      {labels.map((label, index) => (
        <Fragment key={`${index}-${label}`}>
          {index > 0 && (
            <motion.span
              className="mx-3 h-px flex-1 origin-left"
              style={{ backgroundColor: `rgba(${accent}, 0.35)` }}
              initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.15 * index, ease: "easeOut" }}
            />
          )}
          <div className="flex flex-col items-center gap-2 text-center">
            <span
              className="flex size-11 shrink-0 items-center justify-center rounded-full border"
              style={{
                borderColor: `rgba(${accent}, 0.3)`,
                backgroundColor: `rgba(${accent}, 0.06)`,
              }}
            >
              <NodeGlyph index={index} accent={accent} />
            </span>
            <span className="text-xs font-medium leading-tight text-muted-foreground">
              {label}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}