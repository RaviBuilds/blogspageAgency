/**
 * Hero system visual — engine (pure).
 *
 * All of the visual's behaviour that is arithmetic rather than rendering: the
 * seeded PRNG, the packet scheduler, position sampling along a route, and the
 * phase state machine.
 *
 * Like `topology.ts`, this module imports nothing but its sibling's types. No
 * React, no DOM, no `performance.now()`, no `Math.random()`. Time enters as a
 * `dtMs` argument and randomness enters as an injected generator, which is what
 * makes the scheduler deterministic under test and keeps render output free of
 * any value that could differ between server and client.
 */

import type { RoutePlan } from "./topology";

// ---------------------------------------------------------------------------
// Deterministic randomness
// ---------------------------------------------------------------------------

/**
 * mulberry32 — a small, fast, well-distributed 32-bit PRNG.
 *
 * Seeded rather than `Math.random()` so a given seed replays an identical
 * dispatch log. The engine only ever runs client-side after the gate opens, so
 * this never participates in hydration; the determinism is for tests and for
 * reproducing a reported visual glitch.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Random = () => number;

// ---------------------------------------------------------------------------
// Math helpers
// ---------------------------------------------------------------------------

export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

export function lerp(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

/**
 * Frame-rate independent approach factor for a `lerp` toward a target.
 *
 * A raw `lerp(current, target, 0.08)` per frame moves twice as fast at 120Hz as
 * at 60Hz. This converts a per-60Hz-frame rate into the equivalent rate for an
 * arbitrary frame delta, so the parallax feels identically heavy on every
 * display.
 */
export function approachFactor(ratePerFrame: number, dtMs: number): number {
  const frames = dtMs / (1000 / 60);
  return 1 - Math.pow(1 - clamp(ratePerFrame, 0, 1), Math.max(frames, 0));
}

/** Symmetric ease used by the entrance and the ambient suspension. */
export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * clamp(t, 0, 1)) - 1) / 2;
}

/** The settle curve shared with the hero's CSS word reveal. */
export function easeOutExpo(t: number): number {
  const clamped = clamp(t, 0, 1);
  return clamped >= 1 ? 1 : 1 - Math.pow(2, -10 * clamped);
}

// ---------------------------------------------------------------------------
// Position sampling
// ---------------------------------------------------------------------------

export interface SampledPoint {
  x: number;
  y: number;
}

/**
 * The point at normalised distance `t` along a route's flattened polyline.
 *
 * Arc-length parameterised, so a packet moves at constant speed regardless of
 * how the route's segments are divided. Continuous across segment boundaries and
 * exact at `t = 0` and `t = 1`.
 */
export function positionAt(plan: RoutePlan, t: number): SampledPoint {
  const clamped = clamp(t, 0, 1);
  const target = clamped * plan.length;
  const { points, cumulative } = plan;

  // Linear scan. Routes have at most a handful of vertices, so a binary search
  // would cost more in complexity than it saves in time.
  let i = 1;
  while (i < cumulative.length - 1 && cumulative[i] < target) i += 1;

  const segmentStart = cumulative[i - 1];
  const segmentLength = cumulative[i] - segmentStart;
  const local = segmentLength <= 0 ? 0 : (target - segmentStart) / segmentLength;
  const a = points[i - 1];
  const b = points[i];

  return { x: lerp(a[0], b[0], local), y: lerp(a[1], b[1], local) };
}

/**
 * Packet label opacity: faded in for the middle 60% of the journey so the label
 * never collides with the module the packet is entering or leaving.
 */
export function labelOpacityAt(t: number): number {
  const clamped = clamp(t, 0, 1);
  if (clamped < 0.2) return clamped / 0.2;
  if (clamped > 0.8) return (1 - clamped) / 0.2;
  return 1;
}

/**
 * Which node of a route a packet has just reached, given the `t` it moved from
 * and the `t` it moved to. Returns `null` when no boundary was crossed this
 * frame. This is the hook that fires a module's arrival reaction, and the reason
 * packets are not animated with CSS `offset-path`: that gives no arrival event.
 */
export function crossedNode(
  plan: RoutePlan,
  fromT: number,
  toT: number
): string | null {
  for (let i = 0; i < plan.boundaries.length; i += 1) {
    const boundary = plan.boundaries[i];
    if (fromT < boundary && toT >= boundary) return plan.nodes[i + 1];
  }
  return null;
}

/**
 * Which hop of a route a packet is currently on, as an index into the route's
 * `edges` array.
 *
 * `boundaries[i]` is the `t` at which hop `i` ends, so the first boundary not yet
 * passed identifies the hop in progress. This is what lets the wire under a
 * packet light up as it travels: a route knows its edge order and the plan knows
 * where each edge ends, so the live edge is a lookup rather than a hit test
 * against the geometry.
 */
export function activeEdgeIndexAt(plan: RoutePlan, t: number): number {
  const clamped = clamp(t, 0, 1);
  for (let i = 0; i < plan.boundaries.length; i += 1) {
    if (clamped <= plan.boundaries[i]) return i;
  }
  return plan.boundaries.length - 1;
}

// ---------------------------------------------------------------------------
// Phase state machine
// ---------------------------------------------------------------------------

/**
 * PENDING ──gate──▶ ASSEMBLING ─▶ ACTIVATING ─▶ LINKING ─▶ FLOWING ⇄ FOCUSED
 *    │                                                        │
 *    └──reduce──▶ STATIC (terminal)                 ⇄ DORMANT ─┘
 */
export type Phase =
  | "PENDING"
  | "ASSEMBLING"
  | "ACTIVATING"
  | "LINKING"
  | "FLOWING"
  | "FOCUSED"
  | "DORMANT"
  | "STATIC";

export type PhaseEvent =
  | { type: "GATE_OPEN" }
  | { type: "PHASE_ELAPSED" }
  | { type: "FOCUS" }
  | { type: "BLUR" }
  | { type: "HIDE" }
  | { type: "SHOW" }
  | { type: "REDUCE" };

export interface EngineState {
  phase: Phase;
  /** Phase the engine returns to when it wakes from `DORMANT`. */
  resumePhase: Phase;
  /** Module id under the pointer, or `null`. */
  focused: string | null;
}

export const INITIAL_STATE: EngineState = {
  phase: "PENDING",
  resumePhase: "PENDING",
  focused: null,
};

/**
 * Fixed durations of the non-branching entrance phases, in ms from gate open.
 *
 * Hero V2 roughly halved these (750/800/900 -> 420/320/480, 2450ms -> 1220ms).
 * The visual sits above the fold beside the H1, which changes what the entrance
 * is for: at V1's pace the first packet did not move until nearly four seconds
 * after paint, so the thing that proves the system is *running* arrived long
 * after the visitor had already formed an impression of it. The sequence still
 * reads as assemble -> activate -> link -> flow, just at a pace that finishes
 * inside the first glance.
 */
export const PHASE_DURATIONS = {
  ASSEMBLING: 420,
  ACTIVATING: 320,
  LINKING: 480,
} as const;

const ANIMATING_PHASES: readonly Phase[] = [
  "ASSEMBLING",
  "ACTIVATING",
  "LINKING",
  "FLOWING",
  "FOCUSED",
];

/** Whether a phase needs the RAF loop running. */
export function isAnimating(phase: Phase): boolean {
  return ANIMATING_PHASES.includes(phase);
}

/**
 * The phase reducer. Pure, exhaustive, and tested as a unit — the transition
 * table is the contract the hook implements rather than reimplements.
 */
export function reducePhase(
  state: EngineState,
  event: PhaseEvent
): EngineState {
  // Reduced motion wins from anywhere and is terminal: the engine is never
  // started, and the markup stays in its fully assembled static state.
  if (event.type === "REDUCE") {
    return { phase: "STATIC", resumePhase: "STATIC", focused: null };
  }
  if (state.phase === "STATIC") return state;

  switch (event.type) {
    case "GATE_OPEN":
      return state.phase === "PENDING"
        ? { ...state, phase: "ASSEMBLING", resumePhase: "ASSEMBLING" }
        : state;

    case "PHASE_ELAPSED": {
      const next: Partial<Record<Phase, Phase>> = {
        ASSEMBLING: "ACTIVATING",
        ACTIVATING: "LINKING",
        LINKING: "FLOWING",
      };
      const advanced = next[state.phase];
      return advanced
        ? { ...state, phase: advanced, resumePhase: advanced }
        : state;
    }

    case "FOCUS":
      // Focus only bites once traffic is flowing; mid-entrance it is ignored so
      // the choreography is never interrupted.
      return state.phase === "FLOWING" || state.phase === "FOCUSED"
        ? { ...state, phase: "FOCUSED", resumePhase: "FOCUSED" }
        : state;

    case "BLUR":
      return state.phase === "FOCUSED"
        ? { ...state, phase: "FLOWING", resumePhase: "FLOWING", focused: null }
        : { ...state, focused: null };

    case "HIDE":
      if (state.phase === "DORMANT" || state.phase === "PENDING") return state;
      // A hover cannot survive going off-screen, so dormancy resumes into
      // FLOWING rather than FOCUSED.
      return {
        phase: "DORMANT",
        resumePhase: state.phase === "FOCUSED" ? "FLOWING" : state.phase,
        focused: null,
      };

    case "SHOW":
      return state.phase === "DORMANT"
        ? { ...state, phase: state.resumePhase }
        : state;

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Packet scheduler
// ---------------------------------------------------------------------------

export interface Packet {
  /** Monotonic id — also the React key for the packet's `<g>`. */
  id: number;
  routeId: string;
  /** Normalised progress along the route, 0 to 1. */
  t: number;
}

export interface SchedulerConfig {
  /** Hard ceiling on in-flight packets. */
  maxConcurrent: number;
  /** Mean gap between dispatches, before clamping. */
  meanGapMs: number;
  minGapMs: number;
  maxGapMs: number;
  /** A single route may not dispatch again inside this window. */
  routeCooldownMs: number;
  /** Weight multiplier applied to routes through the focused module. */
  focusBias: number;
}

/**
 * Desktop dispatch cadence.
 *
 * Hero V2 raised the ceiling to four and tightened the gaps. The cap is still
 * the line between "a system under load" and "confetti", but at three packets on
 * a mean 2.2s gap the graph was regularly empty, and an empty graph is
 * indistinguishable from a static diagram. Four in flight on a mean 1.5s gap
 * keeps at least one wire lit almost continuously without the flow ever reading
 * as busy.
 *
 * `routeCooldownMs` has to stay *below* the effective mean gap, which the clamp
 * puts at roughly 1.3s. Its job is only to stop one route firing twice
 * back-to-back, so it needs to exceed `minGapMs` and nothing more. Setting it
 * above the mean gap instead makes it the thing that picks routes: whichever
 * route just fired becomes ineligible for the next dispatch, which flattens the
 * weights and — measurably — all but erases the hover bias, since concentrating
 * traffic on the two routes through a hovered module is exactly what a long
 * cooldown forbids. 1500 did that. 900 leaves the weighting in charge.
 */
export const DEFAULT_SCHEDULER: SchedulerConfig = {
  maxConcurrent: 4,
  meanGapMs: 1500,
  minGapMs: 650,
  maxGapMs: 3000,
  routeCooldownMs: 900,
  focusBias: 4,
};

export const MOBILE_SCHEDULER: SchedulerConfig = {
  ...DEFAULT_SCHEDULER,
  maxConcurrent: 1,
  meanGapMs: 3200,
  minGapMs: 1600,
  maxGapMs: 5200,
  routeCooldownMs: 0,
  focusBias: 1,
};

export interface SchedulerState {
  packets: Packet[];
  /** Time remaining before the next dispatch attempt. */
  nextGapMs: number;
  /** Per-route cooldown remaining, keyed by route id. */
  cooldowns: Record<string, number>;
  nextId: number;
}

export function createSchedulerState(
  plans: readonly RoutePlan[],
  config: SchedulerConfig,
  random: Random
): SchedulerState {
  const cooldowns: Record<string, number> = {};
  for (const plan of plans) cooldowns[plan.id] = 0;
  return {
    packets: [],
    nextGapMs: nextGap(config, random),
    cooldowns,
    nextId: 1,
  };
}

/**
 * Exponentially distributed inter-arrival gap, clamped.
 *
 * A Poisson-style gap is what stops the flow reading as a timeline: identical
 * intervals are immediately legible as a loop, whereas exponential gaps give the
 * bursty-then-quiet cadence of real traffic. The clamp keeps it from either
 * stuttering or going dead.
 */
export function nextGap(config: SchedulerConfig, random: Random): number {
  const u = 1 - random();
  const raw = -Math.log(u <= 0 ? Number.EPSILON : u) * config.meanGapMs;
  return clamp(raw, config.minGapMs, config.maxGapMs);
}

/**
 * Weighted route pick over the eligible (off-cooldown) routes, with routes
 * through the focused module biased up.
 *
 * Returns `null` when every route is cooling down, which the caller treats as
 * "wait and retry" rather than "force a dispatch" — forcing one would defeat the
 * per-route min-gap invariant.
 */
export function pickRoute(
  plans: readonly RoutePlan[],
  state: SchedulerState,
  random: Random,
  biasedRouteIds: readonly string[],
  focusBias: number
): RoutePlan | null {
  const eligible = plans.filter((plan) => (state.cooldowns[plan.id] ?? 0) <= 0);
  if (eligible.length === 0) return null;

  const weights = eligible.map((plan) =>
    biasedRouteIds.includes(plan.id) ? plan.weight * focusBias : plan.weight
  );
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (total <= 0) return null;

  let threshold = random() * total;
  for (let i = 0; i < eligible.length; i += 1) {
    threshold -= weights[i];
    if (threshold <= 0) return eligible[i];
  }
  return eligible[eligible.length - 1];
}

export interface StepResult {
  state: SchedulerState;
  /** Module ids reached this step. Drives arrival reactions. */
  arrivals: string[];
}

/**
 * Advance the scheduler by `dtMs`.
 *
 * Order matters: existing packets advance and retire first, so a packet
 * completing this frame frees its concurrency slot for this frame's dispatch.
 */
export function stepScheduler(
  plans: readonly RoutePlan[],
  state: SchedulerState,
  dtMs: number,
  config: SchedulerConfig,
  random: Random,
  biasedRouteIds: readonly string[] = []
): StepResult {
  const planById = new Map(plans.map((plan) => [plan.id, plan]));
  const arrivals: string[] = [];
  const packets: Packet[] = [];

  for (const packet of state.packets) {
    const plan = planById.get(packet.routeId);
    if (!plan) continue;

    const nextT = packet.t + dtMs / plan.durationMs;
    const reached = crossedNode(plan, packet.t, Math.min(nextT, 1));
    if (reached) arrivals.push(reached);

    // Retire on arrival at the terminal node rather than clamping at 1, so a
    // finished packet never lingers as a dot parked on a module edge.
    if (nextT < 1) packets.push({ ...packet, t: nextT });
  }

  const cooldowns: Record<string, number> = {};
  for (const [routeId, remaining] of Object.entries(state.cooldowns)) {
    cooldowns[routeId] = Math.max(0, remaining - dtMs);
  }

  let nextGapMs = state.nextGapMs - dtMs;
  let nextId = state.nextId;

  // `while`, not `if`: a long frame (tab throttling, a slow paint) can consume
  // more than one gap, and dropping those dispatches would leave a visible lull
  // after every hitch.
  while (nextGapMs <= 0) {
    if (packets.length >= config.maxConcurrent) {
      // At capacity — re-arm without dispatching so the cap always holds.
      nextGapMs += nextGap(config, random);
      continue;
    }

    const plan = pickRoute(
      plans,
      { ...state, packets, cooldowns },
      random,
      biasedRouteIds,
      config.focusBias
    );
    if (!plan) {
      nextGapMs += nextGap(config, random);
      continue;
    }

    packets.push({ id: nextId, routeId: plan.id, t: 0 });
    nextId += 1;
    cooldowns[plan.id] = config.routeCooldownMs;
    nextGapMs += nextGap(config, random);
  }

  return { state: { packets, nextGapMs, cooldowns, nextId }, arrivals };
}

// ---------------------------------------------------------------------------
// Telemetry cadence
// ---------------------------------------------------------------------------

/**
 * Per-module telemetry periods.
 *
 * All six are prime, therefore pairwise coprime, so any two modules realign only
 * after the product of their periods — upwards of an hour, against a viewing
 * session measured in seconds. Round numbers here would defeat the purpose:
 * 1870 and 2090 share a factor of 110 and would visibly re-sync every 35s. Each
 * period is jittered again per tick on top of that.
 */
export const TELEMETRY_PERIODS_MS = [1733, 1871, 2089, 2273, 2447, 2633];

/** Interrogation period while a module is hovered. */
export const TELEMETRY_FOCUS_PERIOD_MS = 700;

export function telemetryPeriodFor(index: number): number {
  return TELEMETRY_PERIODS_MS[index % TELEMETRY_PERIODS_MS.length];
}

/** ±40% jitter around a base period. */
export function jitteredPeriod(baseMs: number, random: Random): number {
  return baseMs * (0.6 + random() * 0.8);
}

// ---------------------------------------------------------------------------
// Ambient suspension
// ---------------------------------------------------------------------------

/** Long-period drift of the whole composition. Almost subconscious: ±3px. */
export function suspensionOffset(elapsedMs: number): { x: number; y: number } {
  const x = Math.sin((elapsedMs / 22000) * Math.PI * 2) * 3;
  const y = Math.sin(((elapsedMs + 7000) / 22000) * Math.PI * 2) * 3;
  return { x, y };
}
