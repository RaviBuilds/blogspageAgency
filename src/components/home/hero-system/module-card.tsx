/**
 * Hero system visual — module card (server-rendered, pure).
 *
 * One system surface: a mono header, the three states it moves work through, a
 * telemetry cluster, and a caption that only appears on hover. Real DOM text
 * rather than SVG `<text>`, so the labels get the site's font stack, subpixel
 * antialiasing, and `text-wrap` for free.
 *
 * Positioning is expressed entirely in percentages of the topology's coordinate
 * space — the same space as the SVG `viewBox` behind it. That is what keeps the
 * cards welded to the traces at any container width with no measurement, no
 * `ResizeObserver`, and no resize recompute: both layers scale as one unit
 * because both are described in the same units.
 */

import styles from "./hero-system.module.css";
import { SIGNAL_HUE_VAR, type SystemModule, type Topology } from "./topology";
import { TelemetryBars } from "./telemetry";

/** `translateZ` per depth tier, in px. Gives the pointer tilt real parallax. */
const DEPTH_Z = [0, 18, 34] as const;

/**
 * Aspect ratio past which a card lays its contents out in a row instead of a
 * stack.
 *
 * Only the operations bar crosses it: it spans both columns, so it is far too
 * wide and far too short to stack a header, a stage line and a telemetry cluster
 * the way a column card does. Derived from the rect rather than declared in the
 * topology, so the geometry stays the single source of truth and adding a wide
 * surface later needs no second decision.
 */
const ROW_LAYOUT_ASPECT = 6;

export function ModuleCard({
  module: mod,
  topology,
  index,
  interactive,
}: {
  module: SystemModule;
  topology: Topology;
  /** Position in the assembly order, driving the entrance stagger. */
  index: number;
  /** Desktop only. Mobile has no hover, so it ships no hover affordance. */
  interactive: boolean;
}) {
  const pct = (value: number, total: number) => `${(value / total) * 100}%`;
  const row = mod.w / mod.h > ROW_LAYOUT_ASPECT;

  return (
    <div
      data-module={mod.id}
      data-depth={mod.depth}
      data-layout={row ? "row" : "stack"}
      data-entry={mod.entry ? "true" : undefined}
      className={[styles.card, interactive ? styles.cardInteractive : ""]
        .filter(Boolean)
        .join(" ")}
      style={{
        left: pct(mod.x, topology.width),
        top: pct(mod.y, topology.height),
        width: pct(mod.w, topology.width),
        height: pct(mod.h, topology.height),
        // Read by the parallax transform so each tier moves by a different
        // amount under the same rotation.
        ["--depth-z" as string]: `${DEPTH_Z[mod.depth]}px`,
        ["--card-index" as string]: index,
        // The card's signal hue: LED, active stage label and focus ring all
        // read `--sys-accent`, so one property carries the whole accent.
        ["--sys-accent" as string]: SIGNAL_HUE_VAR[mod.signal],
      }}
    >
      <div className={styles.header}>
        <span className={styles.label}>{mod.label}</span>
        <span data-module-pulse aria-hidden="true" className={styles.pulse} />
      </div>

      {/*
        The internal detail. Three named states rather than an abstract graphic,
        because a viewer should be able to tell what the surface does without
        hovering it — and because the only numbers that could go here honestly
        are ones nobody has measured.

        The engine advances `data-active` one step on each packet arrival, so the
        first stage is the served resting state and the highlight walks the row as
        traffic passes through. Rendering the highlight in the HTML rather than
        waiting for the engine is what keeps the static composition instrumented.
      */}
      <div className={styles.stages} data-stages={mod.id}>
        {mod.stages.map((stage, i) => (
          <span
            key={stage}
            data-stage-index={i}
            data-active={i === 0 ? "true" : "false"}
            className={styles.stageToken}
          >
            {stage}
          </span>
        ))}
      </div>

      <div className={styles.readout}>
        <TelemetryBars moduleId={mod.id} />
      </div>

      {/*
        The caption is the hover consequence that carries the actual message:
        every module names what it does in the client's terms. Rendered in the
        served HTML (not injected on hover) so it costs nothing at interaction
        time; only its opacity changes.
      */}
      <span data-module-caption className={styles.caption}>
        {mod.caption}
      </span>
    </div>
  );
}
