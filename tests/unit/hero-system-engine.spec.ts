import fc from "fast-check";
import { describe, expect, it } from "vitest";

import {
  DEFAULT_SCHEDULER,
  INITIAL_STATE,
  MOBILE_SCHEDULER,
  PHASE_DURATIONS,
  TELEMETRY_FOCUS_PERIOD_MS,
  TELEMETRY_PERIODS_MS,
  approachFactor,
  clamp,
  createSchedulerState,
  crossedNode,
  easeInOutSine,
  easeOutExpo,
  isAnimating,
  jitteredPeriod,
  labelOpacityAt,
  lerp,
  mulberry32,
  nextGap,
  pickRoute,
  positionAt,
  reducePhase,
  stepScheduler,
  suspensionOffset,
  telemetryPeriodFor,
  type EngineState,
  type Phase,
  type SchedulerState,
} from "@/components/home/hero-system/engine";
import {
  DESKTOP_TOPOLOGY,
  MOBILE_TOPOLOGY,
  buildRoutePlan,
  buildRoutePlans,
  routesThroughModule,
} from "@/components/home/hero-system/topology";

/**
 * Feature: hero system visual ("Operational Blueprint")
 *
 * The engine is the visual's behaviour with the rendering removed. Time enters
 * as a `dtMs` argument and randomness as an injected generator, so everything
 * here is checked without a DOM, a clock, or a component harness.
 *
 * The invariants that matter are the ones a viewer would notice if they broke:
 * packets move at constant speed and never park on a module, the concurrency cap
 * holds, no route fires twice in a row, and the phase machine cannot be knocked
 * out of its choreography by a stray hover.
 */

const PLANS = buildRoutePlans(DESKTOP_TOPOLOGY);
const ENQUIRY = buildRoutePlan(DESKTOP_TOPOLOGY, "enquiry");

describe("mulberry32", () => {
  it("stays inside [0, 1)", () => {
    const random = mulberry32(0x9e3779b9);
    for (let i = 0; i < 5000; i += 1) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it("replays an identical stream for a given seed", () => {
    const a = mulberry32(12345);
    const b = mulberry32(12345);
    const first = Array.from({ length: 200 }, () => a());
    const second = Array.from({ length: 200 }, () => b());
    expect(first).toEqual(second);
  });

  it("diverges between seeds", () => {
    const a = mulberry32(1);
    const b = mulberry32(2);
    const first = Array.from({ length: 50 }, () => a());
    const second = Array.from({ length: 50 }, () => b());
    expect(first).not.toEqual(second);
  });

  it("spreads roughly uniformly across quartiles", () => {
    const random = mulberry32(777);
    const buckets = [0, 0, 0, 0];
    for (let i = 0; i < 40000; i += 1) {
      buckets[Math.min(3, Math.floor(random() * 4))] += 1;
    }
    for (const count of buckets) {
      expect(count).toBeGreaterThan(8000);
      expect(count).toBeLessThan(12000);
    }
  });
});

describe("math helpers", () => {
  it("clamps to the closed interval", () => {
    expect(clamp(-5, 0, 1)).toBe(0);
    expect(clamp(5, 0, 1)).toBe(1);
    expect(clamp(0.4, 0, 1)).toBe(0.4);
  });

  it("lerps its endpoints exactly", () => {
    expect(lerp(10, 20, 0)).toBe(10);
    expect(lerp(10, 20, 1)).toBe(20);
    expect(lerp(10, 20, 0.5)).toBe(15);
  });

  it("pins the easing curves at 0 and 1 and keeps them monotone", () => {
    for (const ease of [easeInOutSine, easeOutExpo]) {
      expect(ease(0)).toBeCloseTo(0, 10);
      expect(ease(1)).toBeCloseTo(1, 10);

      let previous = -Infinity;
      for (let t = 0; t <= 1.0001; t += 0.02) {
        const value = ease(t);
        expect(value).toBeGreaterThanOrEqual(previous - 1e-12);
        previous = value;
      }
    }
  });

  it("clamps easing input rather than overshooting", () => {
    expect(easeInOutSine(-1)).toBeCloseTo(0, 10);
    expect(easeOutExpo(2)).toBe(1);
  });
});

describe("approachFactor", () => {
  it("converges to the same place at 60Hz and 120Hz", () => {
    // The reason this helper exists: a raw per-frame lerp moves twice as fast on
    // a 120Hz display. Over equal wall-clock time the results must agree.
    let at60 = 0;
    let at120 = 0;
    for (let i = 0; i < 60; i += 1) {
      at60 = lerp(at60, 100, approachFactor(0.08, 1000 / 60));
    }
    for (let i = 0; i < 120; i += 1) {
      at120 = lerp(at120, 100, approachFactor(0.08, 1000 / 120));
    }
    expect(Math.abs(at60 - at120)).toBeLessThan(0.5);
  });

  it("returns the raw rate for a nominal 60Hz frame", () => {
    expect(approachFactor(0.08, 1000 / 60)).toBeCloseTo(0.08, 10);
  });

  it("never leaves [0, 1] for any frame length", () => {
    for (const dt of [0, 1, 8, 16.67, 100, 5000]) {
      const factor = approachFactor(0.08, dt);
      expect(factor).toBeGreaterThanOrEqual(0);
      expect(factor).toBeLessThanOrEqual(1);
    }
  });
});

describe("positionAt", () => {
  it("is exact at both ends of every route", () => {
    for (const plan of PLANS) {
      const first = plan.points[0];
      const last = plan.points[plan.points.length - 1];

      const start = positionAt(plan, 0);
      expect(start.x, plan.id).toBeCloseTo(first[0], 10);
      expect(start.y, plan.id).toBeCloseTo(first[1], 10);

      const end = positionAt(plan, 1);
      expect(end.x, plan.id).toBeCloseTo(last[0], 10);
      expect(end.y, plan.id).toBeCloseTo(last[1], 10);
    }
  });

  it("clamps out-of-range t to the endpoints", () => {
    expect(positionAt(ENQUIRY, -3)).toEqual(positionAt(ENQUIRY, 0));
    expect(positionAt(ENQUIRY, 7)).toEqual(positionAt(ENQUIRY, 1));
  });

  it("moves continuously, with no jump at a segment boundary", () => {
    for (const plan of PLANS) {
      const step = 1 / 600;
      // A generous per-step ceiling: any real discontinuity is a large multiple
      // of the expected uniform step, so this catches a wrong segment index
      // without being brittle about geometry.
      const budget = (plan.length / 600) * 4 + 1e-9;
      let previous = positionAt(plan, 0);

      for (let t = step; t <= 1 + 1e-9; t += step) {
        const point = positionAt(plan, Math.min(t, 1));
        const moved = Math.hypot(point.x - previous.x, point.y - previous.y);
        expect(moved, `${plan.id} at t=${t}`).toBeLessThan(budget);
        previous = point;
      }
    }
  });

  it("advances at constant speed, which is what arc-length parameterisation buys", () => {
    for (const plan of PLANS) {
      const samples = 400;
      const expected = plan.length / samples;
      let previous = positionAt(plan, 0);

      for (let i = 1; i <= samples; i += 1) {
        const point = positionAt(plan, i / samples);
        const moved = Math.hypot(point.x - previous.x, point.y - previous.y);
        // Equal-length steps in t give equal-length steps in space, except where
        // a step straddles a corner and cuts it.
        expect(moved, `${plan.id} step ${i}`).toBeLessThanOrEqual(
          expected + 1e-9
        );
        previous = point;
      }
    }
  });

  it("lands on the route's own vertices at their cumulative fractions", () => {
    for (const plan of PLANS) {
      for (let i = 0; i < plan.points.length; i += 1) {
        const t = plan.cumulative[i] / plan.length;
        const point = positionAt(plan, t);
        expect(point.x, `${plan.id} vertex ${i}`).toBeCloseTo(
          plan.points[i][0],
          6
        );
        expect(point.y, `${plan.id} vertex ${i}`).toBeCloseTo(
          plan.points[i][1],
          6
        );
      }
    }
  });

  it("reaches the halfway vertex of a two-segment route at the right t", () => {
    // A hand-checked case, so the suite is not purely self-referential against
    // the same `cumulative` array `positionAt` reads.
    const plan = {
      id: "fixture",
      label: "fixture",
      weight: 1,
      durationMs: 1000,
      points: [
        [0, 0],
        [100, 0],
        [100, 300],
      ] as ReadonlyArray<readonly [number, number]>,
      cumulative: [0, 100, 400],
      length: 400,
      nodes: ["a", "b"],
      boundaries: [1],
    };
    expect(positionAt(plan as never, 0.25)).toEqual({ x: 100, y: 0 });
    expect(positionAt(plan as never, 0.5)).toEqual({ x: 100, y: 100 });
  });
});

describe("labelOpacityAt", () => {
  it("is transparent at both ends and opaque across the middle", () => {
    expect(labelOpacityAt(0)).toBeCloseTo(0, 10);
    expect(labelOpacityAt(1)).toBeCloseTo(0, 10);
    expect(labelOpacityAt(0.5)).toBe(1);
    expect(labelOpacityAt(0.2)).toBeCloseTo(1, 10);
    expect(labelOpacityAt(0.8)).toBeCloseTo(1, 10);
  });

  it("never leaves [0, 1]", () => {
    for (let t = -0.5; t <= 1.5; t += 0.01) {
      const opacity = labelOpacityAt(t);
      expect(opacity).toBeGreaterThanOrEqual(0);
      expect(opacity).toBeLessThanOrEqual(1);
    }
  });
});

describe("crossedNode", () => {
  it("names the module reached when a boundary is crossed", () => {
    const [first] = ENQUIRY.boundaries;
    expect(crossedNode(ENQUIRY, first - 0.01, first + 0.01)).toBe(
      ENQUIRY.nodes[1]
    );
  });

  it("returns null when no boundary is crossed", () => {
    const [first] = ENQUIRY.boundaries;
    expect(crossedNode(ENQUIRY, 0, first - 0.001)).toBeNull();
  });

  it("fires exactly once per boundary over a full traversal", () => {
    const step = 1 / 2000;
    const seen: string[] = [];
    for (let t = 0; t < 1; t += step) {
      const reached = crossedNode(ENQUIRY, t, Math.min(t + step, 1));
      if (reached) seen.push(reached);
    }
    // Every node after the origin, in order, once each.
    expect(seen).toEqual(ENQUIRY.nodes.slice(1));
  });

  it("reports the first boundary when a long frame skips several", () => {
    // Deliberate: the arrival reaction is a visual pulse, and firing three at
    // once after a dropped frame would read as a glitch.
    expect(crossedNode(ENQUIRY, 0, 1)).toBe(ENQUIRY.nodes[1]);
  });
});

// ---------------------------------------------------------------------------
// Phase machine
// ---------------------------------------------------------------------------

const ALL_PHASES: readonly Phase[] = [
  "PENDING",
  "ASSEMBLING",
  "ACTIVATING",
  "LINKING",
  "FLOWING",
  "FOCUSED",
  "DORMANT",
  "STATIC",
];

function stateAt(phase: Phase, focused: string | null = null): EngineState {
  return { phase, resumePhase: phase, focused };
}

describe("reducePhase", () => {
  it("starts pending, so nothing animates before the gate opens", () => {
    expect(INITIAL_STATE.phase).toBe("PENDING");
    expect(INITIAL_STATE.focused).toBeNull();
    expect(isAnimating(INITIAL_STATE.phase)).toBe(false);
  });

  it("opens the gate from PENDING only", () => {
    expect(reducePhase(INITIAL_STATE, { type: "GATE_OPEN" }).phase).toBe(
      "ASSEMBLING"
    );
    for (const phase of ALL_PHASES.filter((p) => p !== "PENDING")) {
      const state = stateAt(phase);
      expect(reducePhase(state, { type: "GATE_OPEN" }), phase).toEqual(state);
    }
  });

  it("walks the entrance chain to FLOWING and then stops advancing", () => {
    let state = reducePhase(INITIAL_STATE, { type: "GATE_OPEN" });
    expect(state.phase).toBe("ASSEMBLING");

    state = reducePhase(state, { type: "PHASE_ELAPSED" });
    expect(state.phase).toBe("ACTIVATING");

    state = reducePhase(state, { type: "PHASE_ELAPSED" });
    expect(state.phase).toBe("LINKING");

    state = reducePhase(state, { type: "PHASE_ELAPSED" });
    expect(state.phase).toBe("FLOWING");

    // FLOWING is the resting state; it has no timed successor.
    expect(reducePhase(state, { type: "PHASE_ELAPSED" })).toEqual(state);
  });

  it("ignores PHASE_ELAPSED in the untimed phases", () => {
    for (const phase of ["PENDING", "FLOWING", "FOCUSED", "DORMANT"] as const) {
      const state = stateAt(phase);
      expect(reducePhase(state, { type: "PHASE_ELAPSED" }), phase).toEqual(
        state
      );
    }
  });

  it("accepts focus only once traffic is flowing", () => {
    expect(reducePhase(stateAt("FLOWING"), { type: "FOCUS" }).phase).toBe(
      "FOCUSED"
    );
    expect(reducePhase(stateAt("FOCUSED"), { type: "FOCUS" }).phase).toBe(
      "FOCUSED"
    );

    // Mid-entrance hovers are dropped so the choreography always completes.
    for (const phase of [
      "PENDING",
      "ASSEMBLING",
      "ACTIVATING",
      "LINKING",
      "DORMANT",
    ] as const) {
      const state = stateAt(phase);
      expect(reducePhase(state, { type: "FOCUS" }), phase).toEqual(state);
    }
  });

  it("returns to FLOWING on blur and always clears the focused module", () => {
    const focused = { ...stateAt("FOCUSED"), focused: "ai" };
    const blurred = reducePhase(focused, { type: "BLUR" });
    expect(blurred.phase).toBe("FLOWING");
    expect(blurred.focused).toBeNull();

    // A blur arriving in any other phase still clears the pointer target, so a
    // stale hover cannot outlive the pointer.
    for (const phase of ALL_PHASES.filter((p) => p !== "STATIC")) {
      const stale = { ...stateAt(phase), focused: "core" };
      expect(reducePhase(stale, { type: "BLUR" }).focused, phase).toBeNull();
    }
  });

  it("goes dormant off-screen and resumes where it left off", () => {
    for (const phase of [
      "ASSEMBLING",
      "ACTIVATING",
      "LINKING",
      "FLOWING",
    ] as const) {
      const hidden = reducePhase(stateAt(phase), { type: "HIDE" });
      expect(hidden.phase, phase).toBe("DORMANT");
      expect(hidden.resumePhase, phase).toBe(phase);
      expect(reducePhase(hidden, { type: "SHOW" }).phase, phase).toBe(phase);
    }
  });

  it("resumes a hidden FOCUSED state into FLOWING, not FOCUSED", () => {
    // The pointer is provably elsewhere by the time the visual scrolls back in.
    const hidden = reducePhase(
      { ...stateAt("FOCUSED"), focused: "data" },
      { type: "HIDE" }
    );
    expect(hidden.phase).toBe("DORMANT");
    expect(hidden.resumePhase).toBe("FLOWING");
    expect(hidden.focused).toBeNull();
    expect(reducePhase(hidden, { type: "SHOW" }).phase).toBe("FLOWING");
  });

  it("does not wake a PENDING visual by scrolling past it", () => {
    const state = stateAt("PENDING");
    expect(reducePhase(state, { type: "HIDE" })).toEqual(state);
    expect(reducePhase(state, { type: "SHOW" })).toEqual(state);
  });

  it("ignores HIDE while dormant and SHOW while already visible", () => {
    const dormant = reducePhase(stateAt("FLOWING"), { type: "HIDE" });
    expect(reducePhase(dormant, { type: "HIDE" })).toEqual(dormant);
    expect(reducePhase(stateAt("FLOWING"), { type: "SHOW" })).toEqual(
      stateAt("FLOWING")
    );
  });

  it("treats REDUCE as terminal from every phase", () => {
    for (const phase of ALL_PHASES) {
      const reduced = reducePhase(
        { ...stateAt(phase), focused: "ai" },
        { type: "REDUCE" }
      );
      expect(reduced.phase, phase).toBe("STATIC");
      expect(reduced.focused, phase).toBeNull();
    }

    // Nothing restarts it: no event escapes STATIC.
    const statik = stateAt("STATIC");
    for (const event of [
      { type: "GATE_OPEN" },
      { type: "PHASE_ELAPSED" },
      { type: "FOCUS" },
      { type: "BLUR" },
      { type: "HIDE" },
      { type: "SHOW" },
    ] as const) {
      expect(reducePhase(statik, event), event.type).toEqual(statik);
    }
  });

  it("never leaves the declared phase set, for any event sequence", () => {
    const events = [
      { type: "GATE_OPEN" },
      { type: "PHASE_ELAPSED" },
      { type: "FOCUS" },
      { type: "BLUR" },
      { type: "HIDE" },
      { type: "SHOW" },
      { type: "REDUCE" },
    ] as const;

    fc.assert(
      fc.property(
        fc.array(fc.constantFrom(...events), { minLength: 1, maxLength: 60 }),
        (sequence) => {
          let state = INITIAL_STATE;
          for (const event of sequence) {
            state = reducePhase(state, event);
            expect(ALL_PHASES).toContain(state.phase);
            expect(ALL_PHASES).toContain(state.resumePhase);
            // A focused module is only meaningful while focused.
            if (state.phase !== "FOCUSED") expect(state.focused).toBeNull();
            // Dormancy never resumes into a phase that would not animate.
            if (state.phase === "DORMANT") {
              expect(isAnimating(state.resumePhase)).toBe(true);
            }
          }
          return true;
        }
      ),
      { numRuns: 300 }
    );
  });

  it("only animates in the phases that have something to animate", () => {
    for (const phase of ["PENDING", "DORMANT", "STATIC"] as const) {
      expect(isAnimating(phase), phase).toBe(false);
    }
    for (const phase of [
      "ASSEMBLING",
      "ACTIVATING",
      "LINKING",
      "FLOWING",
      "FOCUSED",
    ] as const) {
      expect(isAnimating(phase), phase).toBe(true);
    }
  });

  it("keeps every entrance duration positive and the total under 2.5s", () => {
    for (const [name, ms] of Object.entries(PHASE_DURATIONS)) {
      expect(ms, name).toBeGreaterThan(0);
    }
    // The entrance is an accent, not a loading screen.
    const total = Object.values(PHASE_DURATIONS).reduce((a, b) => a + b, 0);
    expect(total).toBeLessThanOrEqual(2500);
  });
});

// ---------------------------------------------------------------------------
// Scheduler
// ---------------------------------------------------------------------------

const FRAME_MS = 1000 / 60;

/** Run the scheduler for `durationMs` of simulated time at a fixed frame rate. */
function simulate(
  options: {
    durationMs: number;
    seed?: number;
    frameMs?: number;
    config?: typeof DEFAULT_SCHEDULER;
    plans?: typeof PLANS;
    biased?: readonly string[];
  }
) {
  const {
    durationMs,
    seed = 42,
    frameMs = FRAME_MS,
    config = DEFAULT_SCHEDULER,
    plans = PLANS,
    biased = [],
  } = options;

  const random = mulberry32(seed);
  let state = createSchedulerState(plans, config, random);

  const dispatched: string[] = [];
  const arrivals: string[] = [];
  let peakConcurrent = 0;
  let seenIds = new Set<number>();

  for (let elapsed = 0; elapsed < durationMs; elapsed += frameMs) {
    const before = new Set(state.packets.map((p) => p.id));
    const result = stepScheduler(plans, state, frameMs, config, random, biased);
    state = result.state;

    for (const packet of state.packets) {
      if (!before.has(packet.id)) dispatched.push(packet.routeId);
      seenIds.add(packet.id);
    }
    arrivals.push(...result.arrivals);
    peakConcurrent = Math.max(peakConcurrent, state.packets.length);
  }

  return { state, dispatched, arrivals, peakConcurrent, seenIds };
}

describe("nextGap", () => {
  it("stays inside the configured clamp", () => {
    const random = mulberry32(9);
    for (let i = 0; i < 20000; i += 1) {
      const gap = nextGap(DEFAULT_SCHEDULER, random);
      expect(gap).toBeGreaterThanOrEqual(DEFAULT_SCHEDULER.minGapMs);
      expect(gap).toBeLessThanOrEqual(DEFAULT_SCHEDULER.maxGapMs);
    }
  });

  it("produces varied gaps, not a fixed cadence", () => {
    // Identical intervals are what make an ambient loop legible as a loop.
    const random = mulberry32(3);
    const gaps = Array.from({ length: 2000 }, () =>
      nextGap(DEFAULT_SCHEDULER, random)
    );

    // Roughly half of an exponential draw saturates against the clamp at these
    // settings; the rest must be genuinely spread rather than repeating.
    const interior = gaps.filter(
      (gap) =>
        gap > DEFAULT_SCHEDULER.minGapMs && gap < DEFAULT_SCHEDULER.maxGapMs
    );
    expect(interior.length).toBeGreaterThan(gaps.length * 0.4);
    expect(new Set(interior.map((gap) => gap.toFixed(6))).size).toBe(
      interior.length
    );

    const mean = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
    const spread = Math.sqrt(
      gaps.reduce((sum, gap) => sum + (gap - mean) ** 2, 0) / gaps.length
    );
    expect(spread).toBeGreaterThan(500);
  });

  it("clamps both tails instead of returning 0 or Infinity", () => {
    // `u = 1 - random()`, so a zero draw is the shortest possible gap and a
    // near-one draw the longest. Neither escapes the clamp.
    expect(nextGap(DEFAULT_SCHEDULER, () => 0)).toBe(
      DEFAULT_SCHEDULER.minGapMs
    );
    expect(nextGap(DEFAULT_SCHEDULER, () => 0.999999)).toBe(
      DEFAULT_SCHEDULER.maxGapMs
    );
  });

  it("survives a degenerate generator returning exactly 1", () => {
    // Would make `u` zero and `log(u)` negative infinity without the guard.
    const gap = nextGap(DEFAULT_SCHEDULER, () => 1);
    expect(Number.isFinite(gap)).toBe(true);
    expect(gap).toBe(DEFAULT_SCHEDULER.maxGapMs);
  });
});

describe("pickRoute", () => {
  const random = mulberry32(5);

  it("returns null when every route is cooling down", () => {
    // The caller must wait rather than force a dispatch, or the per-route
    // minimum gap stops meaning anything.
    const state: SchedulerState = {
      packets: [],
      nextGapMs: 0,
      cooldowns: Object.fromEntries(PLANS.map((p) => [p.id, 1000])),
      nextId: 1,
    };
    expect(pickRoute(PLANS, state, random, [], 4)).toBeNull();
  });

  it("never returns a cooling route", () => {
    const cooling = PLANS[0].id;
    const state: SchedulerState = {
      packets: [],
      nextGapMs: 0,
      cooldowns: { [cooling]: 900 },
      nextId: 1,
    };
    for (let i = 0; i < 500; i += 1) {
      expect(pickRoute(PLANS, state, random, [], 4)!.id).not.toBe(cooling);
    }
  });

  it("distributes roughly in proportion to route weight", () => {
    const counts = new Map<string, number>();
    const draw = mulberry32(2024);
    const state = createSchedulerState(PLANS, DEFAULT_SCHEDULER, draw);
    const runs = 30000;

    for (let i = 0; i < runs; i += 1) {
      const plan = pickRoute(PLANS, state, draw, [], 4)!;
      counts.set(plan.id, (counts.get(plan.id) ?? 0) + 1);
    }

    const totalWeight = PLANS.reduce((sum, p) => sum + p.weight, 0);
    for (const plan of PLANS) {
      const observed = (counts.get(plan.id) ?? 0) / runs;
      expect(observed, plan.id).toBeCloseTo(plan.weight / totalWeight, 1);
    }
  });

  it("shifts the distribution toward the biased routes", () => {
    const biased = routesThroughModule(DESKTOP_TOPOLOGY, "ai");
    const draw = mulberry32(88);
    const state = createSchedulerState(PLANS, DEFAULT_SCHEDULER, draw);

    let biasedHits = 0;
    const runs = 20000;
    for (let i = 0; i < runs; i += 1) {
      const plan = pickRoute(PLANS, state, draw, biased, 4)!;
      if (biased.includes(plan.id)) biasedHits += 1;
    }

    const unbiasedShare =
      PLANS.filter((p) => biased.includes(p.id)).reduce(
        (sum, p) => sum + p.weight,
        0
      ) / PLANS.reduce((sum, p) => sum + p.weight, 0);

    // Hovering a module must visibly pull traffic through it.
    expect(biasedHits / runs).toBeGreaterThan(unbiasedShare * 1.5);
  });
});

describe("stepScheduler", () => {
  it("never exceeds the concurrency cap over a long run", () => {
    // The cap is the difference between "a system under load" and "confetti".
    const { peakConcurrent } = simulate({ durationMs: 120_000 });
    expect(peakConcurrent).toBeLessThanOrEqual(DEFAULT_SCHEDULER.maxConcurrent);
    expect(peakConcurrent).toBeGreaterThan(1);
  });

  it("holds the cap even when every frame is long enough to owe a dispatch", () => {
    const { peakConcurrent } = simulate({
      durationMs: 120_000,
      frameMs: 5000,
    });
    expect(peakConcurrent).toBeLessThanOrEqual(DEFAULT_SCHEDULER.maxConcurrent);
  });

  it("dispatches on a long frame instead of dropping the owed gap", () => {
    // A tab-throttled or slow frame must not leave a visible lull behind it.
    const random = mulberry32(11);
    const state = createSchedulerState(PLANS, DEFAULT_SCHEDULER, random);
    const result = stepScheduler(
      PLANS,
      { ...state, nextGapMs: 0 },
      12_000,
      DEFAULT_SCHEDULER,
      random
    );
    expect(result.state.packets.length).toBeGreaterThan(0);
    expect(result.state.nextGapMs).toBeGreaterThan(0);
  });

  it("keeps every packet's t inside (0, 1) and retires it at the end", () => {
    const random = mulberry32(7);
    let state = createSchedulerState(PLANS, DEFAULT_SCHEDULER, random);

    for (let elapsed = 0; elapsed < 90_000; elapsed += FRAME_MS) {
      state = stepScheduler(
        PLANS,
        state,
        FRAME_MS,
        DEFAULT_SCHEDULER,
        random
      ).state;

      for (const packet of state.packets) {
        expect(packet.t).toBeGreaterThanOrEqual(0);
        // A packet at t === 1 would be a dot parked on a module edge.
        expect(packet.t).toBeLessThan(1);
      }
    }
  });

  it("respects the per-route cooldown between consecutive dispatches", () => {
    const random = mulberry32(31);
    let state = createSchedulerState(PLANS, DEFAULT_SCHEDULER, random);
    const lastDispatchAt = new Map<string, number>();

    for (let elapsed = 0; elapsed < 180_000; elapsed += FRAME_MS) {
      const before = new Set(state.packets.map((p) => p.id));
      state = stepScheduler(
        PLANS,
        state,
        FRAME_MS,
        DEFAULT_SCHEDULER,
        random
      ).state;

      for (const packet of state.packets) {
        if (before.has(packet.id)) continue;
        const previous = lastDispatchAt.get(packet.routeId);
        if (previous !== undefined) {
          expect(
            elapsed - previous,
            `${packet.routeId} re-fired too soon`
          ).toBeGreaterThanOrEqual(
            DEFAULT_SCHEDULER.routeCooldownMs - FRAME_MS * 2
          );
        }
        lastDispatchAt.set(packet.routeId, elapsed);
      }
    }

    // And the run actually exercised the constraint.
    expect(lastDispatchAt.size).toBe(PLANS.length);
  });

  it("assigns unique, monotonically increasing packet ids", () => {
    const { state, seenIds, dispatched } = simulate({ durationMs: 60_000 });
    expect(seenIds.size).toBe(dispatched.length);
    expect(state.nextId).toBe(dispatched.length + 1);
  });

  it("replays an identical dispatch log for the same seed", () => {
    const first = simulate({ durationMs: 60_000, seed: 4242 });
    const second = simulate({ durationMs: 60_000, seed: 4242 });
    expect(first.dispatched).toEqual(second.dispatched);
    expect(first.arrivals).toEqual(second.arrivals);
  });

  it("diverges between seeds, so the motion is not one fixed pattern", () => {
    const a = simulate({ durationMs: 60_000, seed: 1 });
    const b = simulate({ durationMs: 60_000, seed: 999 });
    expect(a.dispatched).not.toEqual(b.dispatched);
  });

  it("reports arrivals only for modules on the dispatched routes", () => {
    const { arrivals } = simulate({ durationMs: 60_000 });
    const legal = new Set(PLANS.flatMap((plan) => plan.nodes.slice(1)));
    expect(arrivals.length).toBeGreaterThan(0);
    for (const id of arrivals) expect(legal.has(id), id).toBe(true);
  });

  it("uses every route over a long enough run", () => {
    // No route should be effectively unreachable through weighting.
    const { dispatched } = simulate({ durationMs: 300_000 });
    expect(new Set(dispatched).size).toBe(PLANS.length);
  });

  it("drops packets whose route no longer exists rather than throwing", () => {
    // Guards the topology swap at the responsive breakpoint.
    const random = mulberry32(6);
    const state: SchedulerState = {
      packets: [{ id: 1, routeId: "gone", t: 0.4 }],
      nextGapMs: 10_000,
      cooldowns: {},
      nextId: 2,
    };
    const result = stepScheduler(
      PLANS,
      state,
      FRAME_MS,
      DEFAULT_SCHEDULER,
      random
    );
    expect(result.state.packets).toHaveLength(0);
    expect(result.arrivals).toHaveLength(0);
  });

  it("runs a single packet at a time on mobile", () => {
    const mobilePlans = buildRoutePlans(MOBILE_TOPOLOGY);
    const { peakConcurrent, dispatched } = simulate({
      durationMs: 120_000,
      config: MOBILE_SCHEDULER,
      plans: mobilePlans,
    });
    expect(peakConcurrent).toBe(1);
    expect(dispatched.length).toBeGreaterThan(0);
  });
});

describe("scheduler invariants under generated conditions", () => {
  /**
   * Property: for any seed and any frame cadence, a simulated minute of traffic
   * respects the concurrency cap, keeps every packet strictly in flight, and
   * never loses or reuses a packet id.
   *
   * Frame cadence is generated because the RAF delta is not ours to control: it
   * varies with refresh rate, throttling, and background tabs, and the cap has to
   * hold for all of it.
   */
  it("holds the cap and the packet contract for any seed and frame length", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 2 ** 31 - 1 }),
        fc.double({ min: 4, max: 400, noNaN: true }),
        (seed, frameMs) => {
          const { peakConcurrent, state, seenIds, dispatched } = simulate({
            durationMs: 60_000,
            seed,
            frameMs,
          });

          expect(peakConcurrent).toBeLessThanOrEqual(
            DEFAULT_SCHEDULER.maxConcurrent
          );
          expect(seenIds.size).toBe(dispatched.length);
          expect(state.nextId).toBe(dispatched.length + 1);

          for (const packet of state.packets) {
            expect(packet.t).toBeGreaterThanOrEqual(0);
            expect(packet.t).toBeLessThan(1);
          }
          for (const remaining of Object.values(state.cooldowns)) {
            expect(remaining).toBeGreaterThanOrEqual(0);
          }
          return true;
        }
      ),
      { numRuns: 60 }
    );
  });

  it("keeps traffic alive for any seed, and never floods", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 2 ** 31 - 1 }), (seed) => {
        const { dispatched } = simulate({ durationMs: 60_000, seed });

        // Bounds implied by the gap clamp: a minute cannot be silent, and cannot
        // carry more than one dispatch per minimum gap.
        expect(dispatched.length).toBeGreaterThanOrEqual(
          Math.floor(60_000 / DEFAULT_SCHEDULER.maxGapMs) - 1
        );
        expect(dispatched.length).toBeLessThanOrEqual(
          Math.ceil(60_000 / DEFAULT_SCHEDULER.minGapMs) + 1
        );
        return true;
      }),
      { numRuns: 60 }
    );
  });

  it("biases toward the hovered module's routes for any seed", () => {
    const biased = routesThroughModule(DESKTOP_TOPOLOGY, "core");

    fc.assert(
      fc.property(fc.integer({ min: 1, max: 2 ** 31 - 1 }), (seed) => {
        const focused = simulate({ durationMs: 120_000, seed, biased });
        const ambient = simulate({ durationMs: 120_000, seed });

        const share = (log: readonly string[]) =>
          log.filter((id) => biased.includes(id)).length / log.length;

        expect(share(focused.dispatched)).toBeGreaterThanOrEqual(
          share(ambient.dispatched)
        );
        return true;
      }),
      { numRuns: 40 }
    );
  });
});

// ---------------------------------------------------------------------------
// Telemetry and suspension
// ---------------------------------------------------------------------------

describe("telemetry cadence", () => {
  it("covers every desktop module with a distinct period", () => {
    expect(TELEMETRY_PERIODS_MS.length).toBeGreaterThanOrEqual(
      DESKTOP_TOPOLOGY.modules.length
    );
    expect(new Set(TELEMETRY_PERIODS_MS).size).toBe(
      TELEMETRY_PERIODS_MS.length
    );
  });

  it("shares no small common multiple between any pair of periods", () => {
    // This is what stops two modules from visibly ticking in lockstep.
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

    for (let i = 0; i < TELEMETRY_PERIODS_MS.length; i += 1) {
      for (let j = i + 1; j < TELEMETRY_PERIODS_MS.length; j += 1) {
        const a = TELEMETRY_PERIODS_MS[i];
        const b = TELEMETRY_PERIODS_MS[j];
        const lcm = (a * b) / gcd(a, b);
        // No pair realigns inside a minute of viewing.
        expect(lcm, `${a} vs ${b}`).toBeGreaterThan(60_000);
      }
    }
  });

  it("wraps the period lookup so any module index is valid", () => {
    for (let i = 0; i < 40; i += 1) {
      expect(TELEMETRY_PERIODS_MS).toContain(telemetryPeriodFor(i));
    }
    expect(telemetryPeriodFor(0)).toBe(
      telemetryPeriodFor(TELEMETRY_PERIODS_MS.length)
    );
  });

  it("interrogates a hovered module faster than any ambient period", () => {
    for (const period of TELEMETRY_PERIODS_MS) {
      expect(TELEMETRY_FOCUS_PERIOD_MS).toBeLessThan(period);
    }
  });

  it("jitters within ±40% and never returns a non-positive period", () => {
    const random = mulberry32(19);
    for (const base of TELEMETRY_PERIODS_MS) {
      for (let i = 0; i < 2000; i += 1) {
        const period = jitteredPeriod(base, random);
        expect(period).toBeGreaterThanOrEqual(base * 0.6);
        expect(period).toBeLessThanOrEqual(base * 1.4);
        expect(period).toBeGreaterThan(0);
      }
    }
  });
});

describe("suspensionOffset", () => {
  it("stays inside ±3px on both axes", () => {
    for (let t = 0; t <= 120_000; t += 97) {
      const { x, y } = suspensionOffset(t);
      expect(Math.abs(x)).toBeLessThanOrEqual(3.0000001);
      expect(Math.abs(y)).toBeLessThanOrEqual(3.0000001);
    }
  });

  it("offsets the axes against each other, so the drift is not diagonal", () => {
    // Equal x and y would read as a slide; the phase offset makes it a wander.
    let maxDelta = 0;
    for (let t = 0; t <= 22_000; t += 250) {
      const { x, y } = suspensionOffset(t);
      maxDelta = Math.max(maxDelta, Math.abs(x - y));
    }
    expect(maxDelta).toBeGreaterThan(1);
  });

  it("repeats on a 22s period, well past the threshold of noticing", () => {
    const a = suspensionOffset(1234);
    const b = suspensionOffset(1234 + 22_000);
    expect(a.x).toBeCloseTo(b.x, 8);
    expect(a.y).toBeCloseTo(b.y, 8);
  });

  it("moves slowly enough to be subconscious", () => {
    // Under a tenth of a pixel per 60Hz frame.
    let previous = suspensionOffset(0);
    for (let t = FRAME_MS; t <= 22_000; t += FRAME_MS) {
      const point = suspensionOffset(t);
      const moved = Math.hypot(point.x - previous.x, point.y - previous.y);
      expect(moved).toBeLessThan(0.1);
      previous = point;
    }
  });
});
