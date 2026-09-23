/**
 * Hero system visual — telemetry readout (server-rendered, pure).
 *
 * The small bar cluster inside each module card. It reads as a live gauge, but
 * every value here is derived deterministically from the module id, so the
 * server and the client agree exactly and nothing about this component can
 * cause a hydration mismatch.
 *
 * The bars animate by having the engine write `transform: scaleY(...)` straight
 * onto these nodes each tick. That is a compositor-only property, so a telemetry
 * tick never triggers layout, and — critically — it never triggers a React
 * render either: the engine mutates the DOM through refs rather than through
 * state. Without JavaScript the bars keep the composed heights below, which is
 * why the static visual still looks instrumented rather than blank.
 */

import { mulberry32 } from "./engine";
import styles from "./hero-system.module.css";

/** Bars per module. Enough to read as a signal, few enough to stay quiet. */
export const TELEMETRY_BAR_COUNT = 7;

/**
 * FNV-1a over the module id. Gives each module a stable, well-spread seed so
 * two modules never open on the same silhouette.
 */
function seedFrom(id: string): number {
  let hash = 2166136261;
  for (let i = 0; i < id.length; i += 1) {
    hash ^= id.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * The resting bar heights for a module, as scale factors in [0.25, 0.95].
 *
 * Never returns 0: a collapsed bar reads as a broken widget rather than an idle
 * one. Exported because the engine seeds its per-module walk from the same
 * values, so the first animated frame continues the served silhouette instead
 * of jumping away from it.
 */
export function telemetryHeights(
  moduleId: string,
  count: number = TELEMETRY_BAR_COUNT
): number[] {
  const random = mulberry32(seedFrom(moduleId));
  return Array.from({ length: count }, () => 0.25 + random() * 0.7);
}

export function TelemetryBars({
  moduleId,
  count = TELEMETRY_BAR_COUNT,
}: {
  moduleId: string;
  count?: number;
}) {
  const heights = telemetryHeights(moduleId, count);

  return (
    <div className="flex h-3 items-end gap-[3px]" data-telemetry={moduleId}>
      {heights.map((height, i) => (
        <span
          key={i}
          data-telemetry-bar={i}
          className={styles.bar}
          style={{
            transform: `scaleY(${height.toFixed(3)})`,
          }}
        />
      ))}
    </div>
  );
}
