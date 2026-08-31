/**
 * Hero system visual — trace layer (server-rendered, pure).
 *
 * The SVG beneath the module cards: the wires between surfaces, the ingress
 * rail, and the packet pool.
 *
 * Two decisions worth stating outright.
 *
 * The packet pool is allocated statically. `maxConcurrent` slots are rendered
 * once, in the served HTML, at the hand-composed `STATIC_PACKETS` positions.
 * The engine then moves existing nodes instead of mounting and unmounting them,
 * so the node count is fixed for the lifetime of the page, React never
 * reconciles a list of moving children, and — the part that matters for this
 * component's real job — with scripting off or reduced motion on, those same
 * slots stay exactly where they were served. The static visual reads as a
 * system captured mid-operation rather than an empty schematic, and there is
 * only one code path producing it.
 *
 * Traces are drawn with `stroke-dasharray` on the served path. The draw-in
 * animation is a CSS keyframe on `stroke-dashoffset`, so the entrance needs no
 * JavaScript at all and cannot leave a half-drawn diagram if the engine never
 * starts.
 */

import { labelOpacityAt, positionAt } from "./engine";
import styles from "./hero-system.module.css";
import {
  buildRoutePlans,
  polylineLength,
  polylineToPath,
  type Topology,
} from "./topology";

export function TraceLayer({
  topology,
  staticPackets,
}: {
  topology: Topology;
  staticPackets: readonly { routeId: string; t: number }[];
}) {
  const plans = buildRoutePlans(topology);
  const planById = new Map(plans.map((plan) => [plan.id, plan]));

  // Pre-resolve every slot's served position. Slots beyond the composed static
  // set still render (the engine needs them) but sit at rest, invisible.
  const slots = Array.from({ length: topology.maxConcurrent }, (_, i) => {
    const composed = staticPackets[i];
    const plan = composed ? planById.get(composed.routeId) : undefined;
    if (!composed || !plan) return null;
    return {
      point: positionAt(plan, composed.t),
      label: plan.label,
      opacity: labelOpacityAt(composed.t),
    };
  });

  return (
    <svg
      viewBox={`0 0 ${topology.width} ${topology.height}`}
      className="absolute inset-0 size-full overflow-visible"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* Ingress rail — customer touchpoints entering the system. */}
      {topology.rail ? (
        <g data-rail>
          <path
            d={polylineToPath(topology.rail.spine)}
            stroke="var(--sys-trace)"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          {topology.rail.ticks.map((tick) => (
            <g key={tick.id}>
              <line
                x1={topology.rail!.x}
                y1={tick.y}
                x2={topology.rail!.x + 12}
                y2={tick.y}
                stroke="var(--sys-trace)"
                strokeWidth={1.5}
              />
              <text
                x={topology.rail!.labelRight}
                y={tick.y + 2.8}
                textAnchor="end"
                className="font-mono"
                fontSize={8}
                letterSpacing={1}
                fill="var(--sys-dim)"
              >
                {tick.label}
              </text>
            </g>
          ))}
        </g>
      ) : null}

      {/* Wires. `--trace-len` feeds the CSS draw-in keyframe. */}
      <g data-traces>
        {topology.edges.map((edge, i) => {
          const length = polylineLength(edge.points);
          return (
            <path
              key={edge.id}
              data-edge={edge.id}
              data-feedback={edge.feedback ? "true" : undefined}
              d={polylineToPath(edge.points)}
              stroke="var(--sys-trace)"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.trace}
              style={{
                ["--trace-len" as string]: length.toFixed(2),
                ["--trace-index" as string]: i,
                strokeDasharray: edge.feedback
                  ? "3 4"
                  : `${length.toFixed(2)} ${length.toFixed(2)}`,
              }}
            />
          );
        })}
      </g>

      {/*
        Packet pool — fixed size, moved by the engine, never remounted.

        Three concentric circles rather than one: a wide violet bloom, a mid ring,
        and a near-white core. That is what makes a 2px dot read as a lit signal
        on a near-black field instead of a speck of dust — the falloff does the
        work, so the packet can stay small and precise while still being the
        brightest thing in the composition. The CSS adds a tight `drop-shadow` on
        top; between them the packet is legible without becoming a glowing orb.
      */}
      <g data-packets>
        {slots.map((slot, i) => (
          <g
            key={i}
            data-packet-slot={i}
            style={{
              opacity: slot ? 1 : 0,
              transform: slot
                ? `translate(${slot.point.x.toFixed(2)}px, ${slot.point.y.toFixed(2)}px)`
                : "translate(-100px, -100px)",
            }}
          >
            {/* Glow wrapper — see `.packetCore`. Keeps the bloom off the label. */}
            <g className={styles.packetCore}>
              <circle r={7} fill="var(--sys-packet-halo)" opacity={0.16} />
              <circle r={3.6} fill="var(--sys-packet-halo)" opacity={0.55} />
              <circle r={1.9} fill="var(--sys-packet)" />
            </g>
            <text
              data-packet-label
              x={10}
              y={2.8}
              className="font-mono"
              fontSize={8}
              letterSpacing={0.6}
              fill="var(--sys-packet)"
              opacity={slot ? slot.opacity * 0.9 : 0}
            >
              {slot ? slot.label : ""}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
