/**
 * Hero system visual — topology (pure).
 *
 * The single source of truth for the geometry of the hero's "Operational
 * Blueprint": which system modules exist, where they sit, how they are wired,
 * and which named business transactions travel which wires.
 *
 * This module imports nothing. No React, no DOM, no browser globals. That is
 * deliberate: the geometry is unit-testable with plain vitest (the repo has no
 * component-render harness), and it means the coordinate space — not a measured
 * DOM box — is the layout authority.
 *
 * Coordinate space
 * ----------------
 * Every module rect, edge point and rail tick is expressed in the same fixed
 * space as the SVG `viewBox` (`0 0 width height`). The SVG scales as one unit
 * with its container, and the DOM module cards are positioned as percentages of
 * the same space, so SVG traces and DOM cards stay locked together at any
 * container size with zero measurement, zero `ResizeObserver`, and zero resize
 * recompute.
 */

export type Point = readonly [number, number];

/** The customer-touchpoint rail. An edge source, but not a module card. */
export const INGRESS_ID = "ingress";

export interface SystemModule {
  id: string;
  /** Mono header label. A real engineering or business noun, never filler. */
  label: string;
  /** Hover caption — what the module actually does, in three terms. */
  caption: string;
  /**
   * The three states this surface moves work through, in order, rendered as
   * micro-labels inside the card.
   *
   * Deliberately qualitative. The card's internal detail has to say what the
   * module is *doing* rather than decorate it, but the only honest way to do
   * that here is with system-state language: a latency figure, a confidence
   * score or an uptime percentage in a marketing hero would be a number nobody
   * measured. A tuple rather than an array so the card layout can rely on there
   * being exactly three.
   */
  stages: readonly [string, string, string];
  x: number;
  y: number;
  w: number;
  h: number;
  /** Parallax depth tier. Drives `translateZ` so the tilt has real depth. */
  depth: 0 | 1 | 2;
}

export interface SystemEdge {
  id: string;
  /** Module id (or `INGRESS_ID`) the edge leaves. */
  from: string;
  /** Module id the edge arrives at. */
  to: string;
  /** Orthogonal polyline. Two points for a straight run, more for an L/detour. */
  points: readonly Point[];
  /** Return/feedback paths render dashed. */
  feedback?: boolean;
}

export interface SystemRoute {
  id: string;
  /** The business transaction this route carries, shown as the packet label. */
  label: string;
  /** Edge ids, in travel order. Must form a contiguous chain. */
  edges: readonly string[];
  /** Relative dispatch weight. */
  weight: number;
  /** Wall-clock time for one full traversal. */
  durationMs: number;
}

export interface RailTick {
  id: string;
  label: string;
  y: number;
}

export interface Topology {
  id: "desktop" | "mobile";
  width: number;
  height: number;
  modules: readonly SystemModule[];
  edges: readonly SystemEdge[];
  routes: readonly SystemRoute[];
  /** Ingress rail. Desktop only — the mobile spine has no separate rail. */
  rail?: {
    x: number;
    spine: readonly Point[];
    ticks: readonly RailTick[];
    /** Right edge of the label gutter, in coordinate space. */
    labelRight: number;
  };
  /** Hard ceiling on simultaneously in-flight packets. */
  maxConcurrent: number;
}

// ---------------------------------------------------------------------------
// Desktop topology — 540 x 480 (9:8)
//
//   rail        col 1                 col 2
//   ┌──┐   ┌─────────────┐      ┌─────────────┐
//   │  ├──▶│  INTERFACE  ├─────▶│  CORE LOGIC │◀─┐
//   └──┘   └─────────────┘      └──────┬──────┘  │
//          ┌─────────────┐             │         │
//          │ DATA LAYER  │◀────────────┘         │
//          └──┬───────┬──┘      ┌─────────────┐  │
//             │       └────────▶│  AI ENGINE  ├──┘
//             │                 └──────┬──────┘
//             │                 ┌──────┴──────┐
//             │                 │ AUTOMATION  │
//             │                 └──────┬──────┘
//          ┌──┴────────────────────────┴──────┐
//          │            OPERATIONS            │
//          └──────────────────────────────────┘
// ---------------------------------------------------------------------------

const DESKTOP_W = 540;
const DESKTOP_H = 480;

/**
 * Column and row guides, hand-authored so every edge stays orthogonal.
 *
 * Hero V2 widened the surfaces (COL_W 166 -> 196) and pulled the ingress rail
 * in (x 76 -> 58, COL_1_X 104 -> 86) so the graph uses the full frame instead of
 * floating inside a generous margin. The viewBox is deliberately unchanged: the
 * container's aspect ratio is what the hero's column arithmetic depends on, so
 * only the *proportion* of the frame the modules occupy has grown — 61% of the
 * width is now surface, against 51% before.
 */
const COL_1_X = 86;
const COL_2_X = 314;
const COL_W = 196;
const ROW_1_Y = 64;
const ROW_2_Y = 196;
const ROW_3_Y = 320;
const CARD_H = 96;
/** Automation is a single-stage surface, so it needs less height than a row. */
const AUTO_H = 80;

const COL_1_MID = COL_1_X + COL_W / 2; // 184
const COL_2_MID = COL_2_X + COL_W / 2; // 412
const COL_2_RIGHT = COL_2_X + COL_W; // 510
const ROW_1_MID = ROW_1_Y + CARD_H / 2; // 112
const ROW_2_MID = ROW_2_Y + CARD_H / 2; // 244
const OPS_Y = 420;
/**
 * Operations is the one surface wide enough to lay its contents out in a row, so
 * it needs height for a single line rather than a stack — but V1's 48 clipped
 * even that. 54 fits the row with the card's padding intact.
 */
const OPS_H = 54;
/** The feedback edge's return lane, in the gutter right of column two. */
const FEEDBACK_X = 528;

export const DESKTOP_TOPOLOGY: Topology = {
  id: "desktop",
  width: DESKTOP_W,
  height: DESKTOP_H,
  maxConcurrent: 4,
  rail: {
    x: 58,
    spine: [
      [58, 88],
      [58, 136],
    ],
    labelRight: 50,
    ticks: [
      { id: "web", label: "WEB", y: 88 },
      { id: "mobile", label: "MOBILE", y: 112 },
      { id: "inbound", label: "INBOUND", y: 136 },
    ],
  },
  modules: [
    {
      id: "interface",
      label: "INTERFACE",
      caption: "site · web app · delivery",
      stages: ["WEB", "MOBILE", "INBOUND"],
      x: COL_1_X,
      y: ROW_1_Y,
      w: COL_W,
      h: CARD_H,
      depth: 1,
    },
    {
      id: "core",
      label: "CORE LOGIC",
      caption: "routing · validation · business rules",
      stages: ["REQUEST", "ROUTE", "VALIDATE"],
      x: COL_2_X,
      y: ROW_1_Y,
      w: COL_W,
      h: CARD_H,
      depth: 2,
    },
    {
      id: "data",
      label: "DATA LAYER",
      caption: "records · state · audit trail",
      stages: ["RECORDS", "QUERY", "SYNC"],
      x: COL_1_X,
      y: ROW_2_Y,
      w: COL_W,
      h: CARD_H,
      depth: 1,
    },
    {
      id: "ai",
      label: "AI ENGINE",
      caption: "classification · extraction · drafting",
      stages: ["INPUT", "MODEL", "OUTPUT"],
      x: COL_2_X,
      y: ROW_2_Y,
      w: COL_W,
      h: CARD_H,
      depth: 2,
    },
    {
      id: "automation",
      label: "AUTOMATION",
      caption: "triggers · rules · follow-up",
      stages: ["TRIGGER", "ACTION", "DONE"],
      x: COL_2_X,
      y: ROW_3_Y,
      w: COL_W,
      h: AUTO_H,
      depth: 1,
    },
    {
      id: "operations",
      label: "OPERATIONS",
      caption: "leads · bookings · invoices",
      stages: ["QUEUE", "STATUS", "LIVE"],
      x: COL_1_X,
      y: OPS_Y,
      w: COL_2_RIGHT - COL_1_X,
      h: OPS_H,
      depth: 0,
    },
  ],

  edges: [
    {
      id: "E1",
      from: INGRESS_ID,
      to: "interface",
      points: [
        [58, ROW_1_MID],
        [COL_1_X, ROW_1_MID],
      ],
    },
    {
      id: "E2",
      from: "interface",
      to: "core",
      points: [
        [COL_1_X + COL_W, ROW_1_MID],
        [COL_2_X, ROW_1_MID],
      ],
    },
    {
      id: "E3",
      from: "core",
      to: "data",
      points: [
        [364, ROW_1_Y + CARD_H],
        [364, 178],
        [COL_1_MID, 178],
        [COL_1_MID, ROW_2_Y],
      ],
    },
    {
      id: "E4",
      from: "data",
      to: "ai",
      points: [
        [COL_1_X + COL_W, ROW_2_MID],
        [COL_2_X, ROW_2_MID],
      ],
    },
    {
      // Feedback: the AI verdict returns to core logic as a decision, not as
      // new traffic. Dashed, and routed around the right so it never crosses
      // the core -> data write path.
      id: "E5",
      from: "ai",
      to: "core",
      feedback: true,
      points: [
        [COL_2_RIGHT, ROW_2_MID],
        [FEEDBACK_X, ROW_2_MID],
        [FEEDBACK_X, 124],
        [COL_2_RIGHT, 124],
      ],
    },
    {
      id: "E6",
      from: "ai",
      to: "automation",
      points: [
        [COL_2_MID, ROW_2_Y + CARD_H],
        [COL_2_MID, ROW_3_Y],
      ],
    },
    {
      id: "E7",
      from: "automation",
      to: "operations",
      points: [
        [COL_2_MID, ROW_3_Y + AUTO_H],
        [COL_2_MID, OPS_Y],
      ],
    },
    {
      id: "E8",
      from: "data",
      to: "operations",
      points: [
        [COL_1_MID, ROW_2_Y + CARD_H],
        [COL_1_MID, OPS_Y],
      ],
    },
  ],
  routes: [
    // Traversals are ~15% quicker than V1. The packet is the single clearest
    // signal that this is a running system rather than a diagram, and at the old
    // pace a glance could land between two of them and see nothing move.
    {
      id: "enquiry",
      label: "enquiry",
      edges: ["E1", "E2", "E3"],
      weight: 3,
      durationMs: 3600,
    },
    {
      id: "inference",
      label: "inference",
      edges: ["E3", "E4", "E5"],
      weight: 2,
      durationMs: 4100,
    },
    {
      id: "automation",
      label: "automation",
      edges: ["E4", "E6", "E7"],
      weight: 2,
      durationMs: 3800,
    },
    {
      id: "report",
      label: "report",
      edges: ["E8"],
      weight: 1,
      durationMs: 2300,
    },
  ],
};

// ---------------------------------------------------------------------------
// Mobile topology — 320 x 300
//
// A different graph, not a scaled one: a vertical spine of three surfaces with
// a single packet, no rail, no parallax, no hover.
// ---------------------------------------------------------------------------

/**
 * The mobile frame is authored flush and wide (340 x 260, cards at x = 0).
 *
 * V1 used 320 x 300 with a 16-unit inset, which produced two compounding
 * misalignments once the visual was actually rendered on a phone. The inset
 * indented every card relative to the paragraph and the CTA buttons directly
 * above it — the hero container's own `px-6` already provides that gutter, so the
 * topology was adding a second one and the stack read as floating rather than
 * belonging to the column. And the near-square 320:300 ratio meant a full-width
 * visual grew to over 400px tall, which is why it had to be capped at 320px wide,
 * which in turn left a dead gutter down the right-hand side.
 *
 * Flush cards inherit the column's alignment exactly, and the shorter 340:260
 * ratio lets the visual span the full column without dominating the viewport.
 */
const MOBILE_W = 340;
const MOBILE_H = 260;
const MOBILE_X = 0;
const MOBILE_CARD_W = MOBILE_W;
const MOBILE_MID = MOBILE_W / 2; // 170
/** Two surfaces of equal height, a shorter terminal bar, and even connectors. */
const MOBILE_CARD_H = 72;
const MOBILE_ROW_2_Y = 96;
const MOBILE_ROW_3_Y = 192;

export const MOBILE_TOPOLOGY: Topology = {
  id: "mobile",
  width: MOBILE_W,
  height: MOBILE_H,
  maxConcurrent: 1,
  modules: [
    {
      id: "interface",
      label: "CUSTOMER INTERFACE",
      caption: "site · web app",
      stages: ["WEB", "MOBILE", "INBOUND"],
      x: MOBILE_X,
      y: 0,
      w: MOBILE_CARD_W,
      h: MOBILE_CARD_H,
      depth: 0,
    },
    {
      id: "core",
      label: "CORE + DATA",
      caption: "business rules · records",
      stages: ["ROUTE", "VALIDATE", "RECORDS"],
      x: MOBILE_X,
      y: MOBILE_ROW_2_Y,
      w: MOBILE_CARD_W,
      h: MOBILE_CARD_H,
      depth: 0,
    },
    {
      id: "operations",
      label: "OPERATIONS",
      caption: "leads · bookings",
      stages: ["QUEUE", "STATUS", "LIVE"],
      x: MOBILE_X,
      y: MOBILE_ROW_3_Y,
      w: MOBILE_CARD_W,
      h: MOBILE_H - MOBILE_ROW_3_Y,
      depth: 0,
    },
  ],
  edges: [
    {
      id: "M1",
      from: "interface",
      to: "core",
      points: [
        [MOBILE_MID, MOBILE_CARD_H],
        [MOBILE_MID, MOBILE_ROW_2_Y],
      ],
    },
    {
      id: "M2",
      from: "core",
      to: "operations",
      points: [
        [MOBILE_MID, MOBILE_ROW_2_Y + MOBILE_CARD_H],
        [MOBILE_MID, MOBILE_ROW_3_Y],
      ],
    },
  ],
  routes: [
    {
      id: "request",
      label: "enquiry",
      edges: ["M1", "M2"],
      weight: 1,
      durationMs: 5200,
    },
  ],
};

export const TOPOLOGIES = {
  desktop: DESKTOP_TOPOLOGY,
  mobile: MOBILE_TOPOLOGY,
} as const;

// ---------------------------------------------------------------------------
// Derived geometry
// ---------------------------------------------------------------------------

/** Straight-line distance between two points. */
export function distance(a: Point, b: Point): number {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

/** Total length of a polyline, in coordinate-space units. */
export function polylineLength(points: readonly Point[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += distance(points[i - 1], points[i]);
  }
  return total;
}

/** An SVG `d` attribute for an orthogonal polyline. */
export function polylineToPath(points: readonly Point[]): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ");
}

/**
 * A route flattened into one continuous polyline plus the normalised positions
 * at which it reaches each module.
 *
 * Consecutive edges of a route are incident to a shared module but attach at
 * different points on it (a packet enters a module on one face and leaves on
 * another). Concatenating the edge polylines therefore yields an implicit
 * connector segment *through* the module, which is exactly the desired read:
 * the packet visibly traverses the surface it is passing through.
 */
export interface RoutePlan {
  id: string;
  label: string;
  weight: number;
  durationMs: number;
  points: readonly Point[];
  /** `cumulative[i]` is the arc length from the start to `points[i]`. */
  cumulative: readonly number[];
  length: number;
  /** Modules along the route, source first. Always `boundaries.length + 1`. */
  nodes: readonly string[];
  /** `boundaries[i]` is the `t` at which `nodes[i + 1]` is reached; ends at 1. */
  boundaries: readonly number[];
}

export function buildRoutePlan(topology: Topology, routeId: string): RoutePlan {
  const route = topology.routes.find((r) => r.id === routeId);
  if (!route) {
    throw new Error(`Unknown route "${routeId}" in ${topology.id} topology`);
  }

  const points: Point[] = [];
  const nodes: string[] = [];
  const edgeEndIndex: number[] = [];

  route.edges.forEach((edgeId, i) => {
    const edge = topology.edges.find((e) => e.id === edgeId);
    if (!edge) {
      throw new Error(`Unknown edge "${edgeId}" on route "${routeId}"`);
    }
    if (i === 0) nodes.push(edge.from);
    nodes.push(edge.to);

    for (const point of edge.points) {
      const last = points[points.length - 1];
      if (last && last[0] === point[0] && last[1] === point[1]) continue;
      points.push(point);
    }
    edgeEndIndex.push(points.length - 1);
  });

  const cumulative: number[] = [0];
  for (let i = 1; i < points.length; i += 1) {
    cumulative.push(cumulative[i - 1] + distance(points[i - 1], points[i]));
  }
  const length = cumulative[cumulative.length - 1];
  if (length <= 0) {
    throw new Error(`Route "${routeId}" has zero length`);
  }

  return {
    id: route.id,
    label: route.label,
    weight: route.weight,
    durationMs: route.durationMs,
    points,
    cumulative,
    length,
    nodes,
    boundaries: edgeEndIndex.map((index) => cumulative[index] / length),
  };
}

export function buildRoutePlans(topology: Topology): RoutePlan[] {
  return topology.routes.map((route) => buildRoutePlan(topology, route.id));
}

/** Every node id an edge may legally reference. */
export function nodeIds(topology: Topology): string[] {
  const ids = topology.modules.map((m) => m.id);
  return topology.rail ? [INGRESS_ID, ...ids] : ids;
}

/** Edge ids incident to a module — used to reorganise the graph on hover. */
export function incidentEdgeIds(
  topology: Topology,
  moduleId: string
): string[] {
  return topology.edges
    .filter((edge) => edge.from === moduleId || edge.to === moduleId)
    .map((edge) => edge.id);
}

/** Route ids that traverse a module — used to bias traffic toward a hover. */
export function routesThroughModule(
  topology: Topology,
  moduleId: string
): string[] {
  return topology.routes
    .filter((route) =>
      route.edges.some((edgeId) => {
        const edge = topology.edges.find((e) => e.id === edgeId);
        return edge?.from === moduleId || edge?.to === moduleId;
      })
    )
    .map((route) => route.id);
}

/**
 * Deliberately composed frozen-packet positions for the static state (reduced
 * motion, or scripting disabled). Reads as a system captured mid-operation
 * rather than an empty diagram.
 */
export const STATIC_PACKETS: readonly { routeId: string; t: number }[] = [
  { routeId: "enquiry", t: 0.44 },
  { routeId: "inference", t: 0.68 },
  { routeId: "automation", t: 0.55 },
  { routeId: "report", t: 0.3 },
];

export const STATIC_PACKETS_MOBILE: readonly {
  routeId: string;
  t: number;
}[] = [{ routeId: "request", t: 0.46 }];
