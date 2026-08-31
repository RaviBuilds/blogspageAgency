/**
 * Hero system visual — public entry point.
 *
 * The only client boundary in the visual. Everything it renders is a pure
 * server component; this file exists solely to attach the engine to that
 * server-rendered scene, so the markup below is what ships in the HTML whether
 * or not the JavaScript ever arrives or runs.
 *
 * Accessibility: the whole thing is `aria-hidden` with zero focusable
 * descendants. It is an illustration of the copy beside it, not a control — a
 * keyboard user has nothing to operate here and so is given nothing to tab
 * through. The interactivity is a reward for pointer exploration, never a
 * prerequisite for understanding the page.
 *
 * `variant` picks a topology rather than rendering both and hiding one: shipping
 * the unused layout would double the node count on every viewport to serve one
 * of them.
 */

"use client";

import styles from "./hero-system.module.css";
import { ModuleCard } from "./module-card";
import { TraceLayer } from "./trace-layer";
import {
  DESKTOP_TOPOLOGY,
  MOBILE_TOPOLOGY,
  STATIC_PACKETS,
  STATIC_PACKETS_MOBILE,
} from "./topology";
import { useSystemEngine } from "./use-system-engine";

export function HeroSystemVisual({
  variant = "desktop",
  className,
}: {
  variant?: "desktop" | "mobile";
  className?: string;
}) {
  const desktop = variant === "desktop";
  const topology = desktop ? DESKTOP_TOPOLOGY : MOBILE_TOPOLOGY;
  const staticPackets = desktop ? STATIC_PACKETS : STATIC_PACKETS_MOBILE;

  const rootRef = useSystemEngine({ topology, interactive: desktop });

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-hero-system={topology.id}
      data-phase="PENDING"
      className={[styles.root, className ?? ""].filter(Boolean).join(" ")}
      style={{
        aspectRatio: `${topology.width} / ${topology.height}`,
        // The tilt needs a perspective origin on an ancestor of the stage for
        // `translateZ` on the cards to resolve into actual depth.
        perspective: "1400px",
      }}
    >
      {/*
        Single transformed node. The drift and the pointer tilt are composed
        into one `transform` written here each frame, so the entire scene shares
        one compositor layer instead of promoting every card individually.
      */}
      <div
        data-stage
        className={styles.stage}
      >
        <TraceLayer topology={topology} staticPackets={staticPackets} />
        {topology.modules.map((mod, i) => (
          <ModuleCard
            key={mod.id}
            module={mod}
            topology={topology}
            index={i}
            interactive={desktop}
          />
        ))}
      </div>
    </div>
  );
}
