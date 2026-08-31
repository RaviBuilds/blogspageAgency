/**
 * Hero system visual — engine host (client).
 *
 * The only stateful piece in the visual, and deliberately the only one that
 * touches the browser. It owns exactly one `requestAnimationFrame` loop and
 * writes every frame's result straight to the DOM through cached element
 * references.
 *
 * No React state is involved in animation. A 60Hz `setState` would re-render
 * this subtree sixty times a second and hand React a list of moving children to
 * reconcile; instead the served markup is treated as a fixed scene graph whose
 * nodes get their `transform` and `opacity` mutated in place. Both properties
 * are compositor-only, so a frame costs no layout and no style recalc beyond the
 * nodes touched.
 *
 * The loop is not running most of the time. It starts only after the gate opens,
 * stops whenever the visual scrolls out of view or the tab is hidden, and never
 * starts at all under `prefers-reduced-motion` — in which case the
 * server-rendered static composition is simply left alone, which is already the
 * correct picture.
 */

"use client";

import { useEffect, useRef } from "react";
import {
  DEFAULT_SCHEDULER,
  MOBILE_SCHEDULER,
  INITIAL_STATE,
  PHASE_DURATIONS,
  TELEMETRY_FOCUS_PERIOD_MS,
  activeEdgeIndexAt,
  approachFactor,
  clamp,
  createSchedulerState,
  isAnimating,
  jitteredPeriod,
  labelOpacityAt,
  lerp,
  mulberry32,
  positionAt,
  reducePhase,
  stepScheduler,
  suspensionOffset,
  telemetryPeriodFor,
  type EngineState,
  type Phase,
  type PhaseEvent,
  type SchedulerState,
} from "./engine";
import {
  buildRoutePlans,
  incidentEdgeIds,
  routesThroughModule,
  type RoutePlan,
  type Topology,
} from "./topology";
import { TELEMETRY_BAR_COUNT, telemetryHeights } from "./telemetry";

/** Max frame delta fed to the simulation, in ms. */
const MAX_FRAME_MS = 64;

/** Pointer tilt limit, in degrees. Restraint is the point. */
const TILT_DEG = 3.5;

/** Per-60Hz-frame approach rates. Low numbers read as mass. */
const TILT_RATE = 0.07;
const BAR_RATE = 0.16;

/**
 * How long the preloader is given to clear before the entrance begins.
 *
 * V1 waited 1500ms, which was comfortably clear of the preloader but pushed the
 * first packet to nearly four seconds after paint. 900ms lands as the curtain
 * starts its exit, so the assembly is revealed already in progress rather than
 * waiting to begin — and on any repeat visit the session flag skips this
 * entirely.
 */
const PRELOADER_WAIT_MS = 900;

interface ModuleRuntime {
  id: string;
  card: HTMLElement;
  caption: HTMLElement | null;
  pulse: HTMLElement | null;
  bars: HTMLElement[];
  /** The three state micro-labels, in order. */
  stages: HTMLElement[];
  /** Which stage currently carries the highlight. */
  stageIndex: number;
  current: number[];
  target: number[];
  /** Time until the next telemetry re-target. */
  timerMs: number;
  /** Arrival flash intensity, 0 to 1, decaying each frame. */
  flash: number;
}

interface PacketSlot {
  group: SVGGElement;
  label: SVGTextElement | null;
}

/** Set equality for the small live-edge sets. Cheaper than diffing blind. */
function sameSet(a: ReadonlySet<string>, b: ReadonlySet<string>): boolean {
  if (a.size !== b.size) return false;
  for (const value of a) if (!b.has(value)) return false;
  return true;
}

export interface SystemEngineOptions {
  topology: Topology;
  /** Desktop wires hover and parallax; mobile ships neither. */
  interactive: boolean;
  /** Seed for the dispatch stream. Only affects timing, never markup. */
  seed?: number;
}

/**
 * Attaches the engine to a server-rendered scene.
 *
 * Returns the ref to put on the visual's root. Everything else — the module
 * cards, the traces, the packet slots — is discovered by querying inside that
 * root once on mount, so this hook never dictates the markup's shape.
 */
export function useSystemEngine({
  topology,
  interactive,
  seed = 0x5eed,
}: SystemEngineOptions) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Reduced motion: never start. The served markup is already the intended
    // static composition, so the correct action is no action at all.
    if (reduceQuery.matches) {
      root.dataset.phase = "STATIC";
      return;
    }

    // Every hidden entrance state in the stylesheet is gated on this attribute.
    // It is set only here, only once the engine has committed to running, so the
    // served HTML — and any session where the script fails, is blocked, or is
    // still downloading — renders the fully assembled static composition instead
    // of an invisible one waiting for a phase change that will never arrive.
    root.dataset.engine = "on";

    // -----------------------------------------------------------------------
    // Scene discovery — one pass, cached for the session.
    // -----------------------------------------------------------------------

    const stage = root.querySelector<HTMLElement>("[data-stage]");
    const modules: ModuleRuntime[] = topology.modules.map((mod) => {
      const card = root.querySelector<HTMLElement>(
        `[data-module="${mod.id}"]`
      )!;
      const bars = Array.from(
        card.querySelectorAll<HTMLElement>("[data-telemetry-bar]")
      );
      const heights = telemetryHeights(mod.id, TELEMETRY_BAR_COUNT);
      return {
        id: mod.id,
        card,
        caption: card.querySelector<HTMLElement>("[data-module-caption]"),
        pulse: card.querySelector<HTMLElement>("[data-module-pulse]"),
        bars,
        stages: Array.from(
          card.querySelectorAll<HTMLElement>("[data-stage-index]")
        ),
        // The server renders the first stage as the active one, so the runtime
        // starts from that rather than resetting it and causing a visible jump.
        stageIndex: 0,
        // Seeded from the same values the server rendered, so the first
        // animated frame continues the served silhouette rather than jumping.
        current: [...heights],
        target: [...heights],
        timerMs: 0,
        flash: 0,
      };
    });

    const edgeEls = new Map<string, SVGPathElement>();
    for (const edge of topology.edges) {
      const el = root.querySelector<SVGPathElement>(
        `[data-edge="${edge.id}"]`
      );
      if (el) edgeEls.set(edge.id, el);
    }

    const slots: PacketSlot[] = Array.from(
      root.querySelectorAll<SVGGElement>("[data-packet-slot]")
    ).map((group) => ({
      group,
      label: group.querySelector<SVGTextElement>("[data-packet-label]"),
    }));

    const plans = buildRoutePlans(topology);
    const planById = new Map<string, RoutePlan>(
      plans.map((plan) => [plan.id, plan])
    );

    // A route's edge order, so the wire under a packet can be resolved from the
    // packet's `t` with two array lookups rather than a search of the geometry.
    const routeEdgeIds = new Map<string, readonly string[]>(
      topology.routes.map((route) => [route.id, route.edges])
    );

    // Precompute the hover consequence per module so a pointer move costs a map
    // lookup rather than a graph walk.
    const incidentByModule = new Map<string, Set<string>>();
    const routesByModule = new Map<string, string[]>();
    for (const mod of topology.modules) {
      incidentByModule.set(mod.id, new Set(incidentEdgeIds(topology, mod.id)));
      routesByModule.set(mod.id, routesThroughModule(topology, mod.id));
    }

    // -----------------------------------------------------------------------
    // Mutable engine state. Plain locals, not refs: nothing here is read
    // during render, so React must not be involved.
    // -----------------------------------------------------------------------

    const config =
      topology.id === "mobile" ? MOBILE_SCHEDULER : DEFAULT_SCHEDULER;
    const random = mulberry32(seed);

    let engine: EngineState = INITIAL_STATE;
    let scheduler: SchedulerState = createSchedulerState(
      plans,
      config,
      random
    );

    let rafId = 0;
    let lastTs = 0;
    let elapsedMs = 0;
    let phaseElapsedMs = 0;
    let visible = false;
    let gateOpened = false;
    let gateTimer: number | undefined;

    // Pointer tilt: target set by events, current lerped toward it per frame.
    let tiltTargetX = 0;
    let tiltTargetY = 0;
    let tiltX = 0;
    let tiltY = 0;

    // Edges currently carrying a packet. Held across frames so each frame writes
    // only the difference: a `data-live` flip costs a style recalc and, for the
    // lit path, a filter re-render, and doing that to all eight edges every frame
    // to change one of them would be the most expensive thing in the loop.
    let liveEdges = new Set<string>();
    const nextLiveEdges = new Set<string>();

    const clearLiveEdges = () => {
      for (const edgeId of liveEdges) {
        const el = edgeEls.get(edgeId);
        if (el) el.removeAttribute("data-live");
      }
      liveEdges.clear();
    };

    const applyPhase = (next: Phase) => {
      root.dataset.phase = next;
    };
    applyPhase(engine.phase);

    const dispatch = (event: PhaseEvent) => {
      const before = engine.phase;
      engine = reducePhase(engine, event);
      if (engine.phase !== before) {
        phaseElapsedMs = 0;
        applyPhase(engine.phase);
      }
    };

    // -----------------------------------------------------------------------
    // Per-frame writes
    // -----------------------------------------------------------------------

    /**
     * Move a module's stage highlight one step along.
     *
     * Two attribute writes, only on packet arrival — a few times a second across
     * the whole scene rather than per frame. Deliberately not driven by a timer:
     * the highlight means "this surface just handled something", so it has to be
     * caused by traffic or it is only decoration that happens to move.
     */
    const advanceStage = (mod: ModuleRuntime) => {
      if (mod.stages.length === 0) return;
      const previous = mod.stages[mod.stageIndex];
      if (previous) previous.dataset.active = "false";
      mod.stageIndex = (mod.stageIndex + 1) % mod.stages.length;
      const next = mod.stages[mod.stageIndex];
      if (next) next.dataset.active = "true";
    };

    /** Retarget one module's telemetry, then ease the bars toward it. */
    const stepTelemetry = (mod: ModuleRuntime, dtMs: number) => {
      const focused = engine.focused === mod.id;
      mod.timerMs -= dtMs;

      if (mod.timerMs <= 0) {
        const index = topology.modules.findIndex((m) => m.id === mod.id);
        const base = focused
          ? TELEMETRY_FOCUS_PERIOD_MS
          : telemetryPeriodFor(index);
        mod.timerMs = jitteredPeriod(base, random);

        // Retarget a single bar per tick, not the whole cluster. A cluster-wide
        // jump reads as a UI refresh; one bar moving reads as a live signal.
        const bar = Math.floor(random() * mod.target.length);
        mod.target[bar] = focused
          ? 0.45 + random() * 0.55
          : 0.25 + random() * 0.7;
      }

      const factor = approachFactor(BAR_RATE, dtMs);
      for (let i = 0; i < mod.bars.length; i += 1) {
        const next = lerp(mod.current[i], mod.target[i], factor);
        // Skip sub-perceptual writes; below ~0.4% of a 12px bar is invisible
        // and still costs a style recalc on the node.
        if (Math.abs(next - mod.current[i]) > 0.004) {
          mod.current[i] = next;
          mod.bars[i].style.transform = `scaleY(${next.toFixed(3)})`;
        }
      }

      if (mod.flash > 0) {
        mod.flash = Math.max(0, mod.flash - dtMs / 450);
        if (mod.pulse) {
          mod.pulse.style.opacity = (0.35 + mod.flash * 0.65).toFixed(3);
          mod.pulse.style.transform = `scale(${(1 + mod.flash * 0.9).toFixed(3)})`;
        }
      }
    };

    const frame = (ts: number) => {
      // First frame after a start or resume: establish the clock without
      // simulating, so a long pause never lands as one enormous delta.
      if (lastTs === 0) lastTs = ts;
      const dtMs = clamp(ts - lastTs, 0, MAX_FRAME_MS);
      lastTs = ts;
      elapsedMs += dtMs;
      phaseElapsedMs += dtMs;

      const duration =
        PHASE_DURATIONS[engine.phase as keyof typeof PHASE_DURATIONS];
      if (duration !== undefined && phaseElapsedMs >= duration) {
        dispatch({ type: "PHASE_ELAPSED" });
      }

      // Packets only exist once the graph is linked.
      if (engine.phase === "FLOWING" || engine.phase === "FOCUSED") {
        const biased = engine.focused
          ? routesByModule.get(engine.focused) ?? []
          : [];
        const result = stepScheduler(
          plans,
          scheduler,
          dtMs,
          config,
          random,
          biased
        );
        scheduler = result.state;

        for (const moduleId of result.arrivals) {
          const mod = modules.find((m) => m.id === moduleId);
          if (!mod) continue;
          mod.flash = 1;
          // Work arriving advances the surface's state readout one step, so the
          // highlight walks the stage row in time with the traffic instead of
          // cycling on a timer of its own.
          advanceStage(mod);
        }

        nextLiveEdges.clear();

        for (let i = 0; i < slots.length; i += 1) {
          const slot = slots[i];
          const packet = scheduler.packets[i];
          if (!packet) {
            slot.group.style.opacity = "0";
            continue;
          }
          const plan = planById.get(packet.routeId);
          if (!plan) continue;

          const point = positionAt(plan, packet.t);
          slot.group.style.opacity = "1";
          slot.group.style.transform = `translate(${point.x.toFixed(2)}px, ${point.y.toFixed(2)}px)`;
          if (slot.label) {
            if (slot.label.textContent !== plan.label) {
              slot.label.textContent = plan.label;
            }
            slot.label.style.opacity = (
              labelOpacityAt(packet.t) * 0.9
            ).toFixed(3);
          }

          const edges = routeEdgeIds.get(packet.routeId);
          if (edges) {
            const edgeId = edges[activeEdgeIndexAt(plan, packet.t)];
            if (edgeId) nextLiveEdges.add(edgeId);
          }
        }

        // Diff, so only edges that actually changed state get written.
        if (!sameSet(liveEdges, nextLiveEdges)) {
          for (const edgeId of liveEdges) {
            if (nextLiveEdges.has(edgeId)) continue;
            edgeEls.get(edgeId)?.removeAttribute("data-live");
          }
          for (const edgeId of nextLiveEdges) {
            if (liveEdges.has(edgeId)) continue;
            edgeEls.get(edgeId)?.setAttribute("data-live", "true");
          }
          liveEdges = new Set(nextLiveEdges);
        }
      }

      for (const mod of modules) stepTelemetry(mod, dtMs);

      // Whole-composition drift plus pointer tilt, written once to the stage so
      // the entire scene shares a single transform and a single compositor
      // layer rather than one per card.
      if (stage) {
        const drift = suspensionOffset(elapsedMs);
        tiltX = lerp(tiltX, tiltTargetX, approachFactor(TILT_RATE, dtMs));
        tiltY = lerp(tiltY, tiltTargetY, approachFactor(TILT_RATE, dtMs));
        stage.style.transform =
          `translate3d(${drift.x.toFixed(2)}px, ${drift.y.toFixed(2)}px, 0) ` +
          `rotateX(${tiltY.toFixed(3)}deg) rotateY(${tiltX.toFixed(3)}deg)`;
      }

      if (isAnimating(engine.phase)) {
        rafId = requestAnimationFrame(frame);
      } else {
        rafId = 0;
      }
    };

    const start = () => {
      if (rafId !== 0 || !isAnimating(engine.phase)) return;
      // Reset the clock so the resume delta is one frame, not the whole pause.
      lastTs = 0;
      rafId = requestAnimationFrame(frame);
    };

    const stop = () => {
      if (rafId !== 0) cancelAnimationFrame(rafId);
      rafId = 0;
    };

    // -----------------------------------------------------------------------
    // Hover consequence
    //
    // Hovering a module is not a highlight, it is a query: the module accents,
    // its wires stay lit while every unrelated wire drops back, its telemetry
    // switches to interrogation cadence, and traffic re-weights toward it. The
    // graph answers "what depends on this?" rather than just glowing.
    // -----------------------------------------------------------------------

    const applyFocus = (moduleId: string | null) => {
      const incident = moduleId ? incidentByModule.get(moduleId) : null;

      for (const mod of modules) {
        const active = mod.id === moduleId;
        mod.card.dataset.focused = active ? "true" : "false";
        // Dim unrelated surfaces only while something is actually focused.
        mod.card.dataset.muted =
          moduleId && !active ? "true" : "false";
        if (active) {
          // Re-target immediately so the cadence change is felt on the same
          // frame as the pointer, not up to a full period later.
          mod.timerMs = 0;
        }
      }

      for (const [edgeId, el] of edgeEls) {
        const lit = !moduleId || incident?.has(edgeId);
        el.style.opacity = lit ? "1" : "0.35";
      }
    };

    const cleanups: Array<() => void> = [];

    if (interactive) {
      // Focus is driven per card rather than from a single listener on the root.
      // The root is `pointer-events: none` — it sits behind the headline and must
      // never swallow a click or a text selection meant for it — which means the
      // root is never hit-tested and `pointerleave` on it would never fire,
      // leaving a hover stuck on forever. The cards are the only nodes that opt
      // back into hit-testing, so they are the only nodes that can report
      // entering and leaving truthfully.
      const setFocus = (id: string | null) => {
        if (id === engine.focused) return;
        if (id) {
          engine = { ...engine, focused: id };
          dispatch({ type: "FOCUS" });
        } else {
          dispatch({ type: "BLUR" });
        }
        applyFocus(engine.focused);
        start();
      };

      for (const mod of modules) {
        const onEnter = () => setFocus(mod.id);
        // `pointerleave` fires before the next card's `pointerenter`, so a slide
        // from one card straight to another settles on the new one.
        const onLeave = () => {
          if (engine.focused === mod.id) setFocus(null);
        };
        mod.card.addEventListener("pointerenter", onEnter, { passive: true });
        mod.card.addEventListener("pointerleave", onLeave, { passive: true });
        cleanups.push(() => {
          mod.card.removeEventListener("pointerenter", onEnter);
          mod.card.removeEventListener("pointerleave", onLeave);
        });
      }

      // Tilt tracks the pointer across the whole window, not just the cards, so
      // the scene responds while the cursor is anywhere near it. The rect is
      // cached and invalidated rather than measured per event: reading
      // `getBoundingClientRect` on every `pointermove` would force layout on a
      // very hot path.
      let rect: DOMRect | null = null;
      const invalidateRect = () => {
        rect = null;
      };

      const onPointerMove = (event: PointerEvent) => {
        if (!rect) rect = root.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        // -1..1 from centre, clamped so a distant cursor rests at the limit
        // rather than running away. Y is inverted so the scene tips toward the
        // pointer instead of away from it.
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        tiltTargetX = clamp(nx * 2, -1, 1) * TILT_DEG;
        tiltTargetY = clamp(-ny * 2, -1, 1) * TILT_DEG;
        start();
      };

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("scroll", invalidateRect, { passive: true });
      window.addEventListener("resize", invalidateRect, { passive: true });
      cleanups.push(() => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("scroll", invalidateRect);
        window.removeEventListener("resize", invalidateRect);
      });
    }

    // -----------------------------------------------------------------------
    // Lifecycle: visibility, tab state, reduced-motion, and the entrance gate
    // -----------------------------------------------------------------------

    // Two thresholds: 0 catches fully leaving the viewport, 0.15 is the point
    // at which enough of the visual is on screen to be worth animating.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const nowVisible = entry.intersectionRatio > 0.15;
          if (nowVisible === visible) continue;
          visible = nowVisible;

          if (visible && !document.hidden) {
            dispatch({ type: "SHOW" });
            start();
          } else {
            dispatch({ type: "HIDE" });
            stop();
          }
        }
      },
      { threshold: [0, 0.15] }
    );
    observer.observe(root);
    cleanups.push(() => observer.disconnect());

    const onVisibilityChange = () => {
      if (document.hidden) {
        dispatch({ type: "HIDE" });
        stop();
      } else if (visible) {
        dispatch({ type: "SHOW" });
        start();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    cleanups.push(() =>
      document.removeEventListener("visibilitychange", onVisibilityChange)
    );

    // Honour the preference being switched on mid-session: park the scene in its
    // static composition and never resume.
    const onReduceChange = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      dispatch({ type: "REDUCE" });
      stop();
      applyFocus(null);
      // A wire frozen mid-glow would read as a stuck state rather than a parked
      // one, so the highlight is cleared along with the motion.
      clearLiveEdges();
      if (stage) stage.style.transform = "";
    };
    reduceQuery.addEventListener("change", onReduceChange);
    cleanups.push(() =>
      reduceQuery.removeEventListener("change", onReduceChange)
    );

    // The entrance must not compete with the preloader for the user's attention.
    // If the preloader has already run this session the visual starts straight
    // away; otherwise it waits for the curtain to clear.
    let preloaded = false;
    try {
      preloaded =
        window.sessionStorage.getItem("blogspage-preloaded") !== null;
    } catch {
      // Private mode or blocked storage — treat as "no preloader to wait for".
      preloaded = true;
    }

    const openGate = () => {
      if (gateOpened) return;
      gateOpened = true;
      dispatch({ type: "GATE_OPEN" });
      if (visible && !document.hidden) start();
    };

    if (preloaded) {
      openGate();
    } else {
      gateTimer = window.setTimeout(openGate, PRELOADER_WAIT_MS);
    }

    return () => {
      stop();
      if (gateTimer !== undefined) window.clearTimeout(gateTimer);
      for (const cleanup of cleanups) cleanup();
    };
  }, [topology, interactive, seed]);

  return rootRef;
}
