import { describe, expect, it } from "vitest";

import {
  DESKTOP_TOPOLOGY,
  INGRESS_ID,
  MOBILE_TOPOLOGY,
  STATIC_PACKETS,
  STATIC_PACKETS_MOBILE,
  buildRoutePlan,
  buildRoutePlans,
  incidentEdgeIds,
  nodeIds,
  polylineLength,
  polylineToPath,
  routesThroughModule,
  type Topology,
} from "@/components/home/hero-system/topology";

/**
 * Feature: hero system visual ("Operational Blueprint")
 *
 * The topology is the layout authority for the hero visual: the SVG `viewBox`
 * and the DOM module cards share one coordinate space, so nothing measures the
 * DOM and nothing recomputes on resize. That only holds if the geometry itself
 * is internally consistent, which is what these checks pin down.
 *
 * These run as plain unit tests with no DOM and no component harness, because
 * `topology.ts` imports nothing.
 */

const TOPOLOGIES: readonly Topology[] = [DESKTOP_TOPOLOGY, MOBILE_TOPOLOGY];

describe.each(TOPOLOGIES.map((t) => [t.id, t] as const))(
  "%s topology integrity",
  (_id, topology) => {
    it("gives every module a unique id and a non-empty label and caption", () => {
      const ids = topology.modules.map((m) => m.id);
      expect(new Set(ids).size).toBe(ids.length);

      for (const module of topology.modules) {
        expect(module.label.trim(), module.id).not.toBe("");
        expect(module.caption.trim(), module.id).not.toBe("");
        // Labels are mono micro-headers; anything longer stops fitting the card.
        expect(module.label.length, module.id).toBeLessThanOrEqual(20);
      }
    });

    it("names three system states per module, none of them a fake metric", () => {
      // The stage row is the card's internal detail. It has to read as system
      // state, which means it must not contain a number: a latency figure, a
      // confidence score or an uptime percentage in a marketing hero would be a
      // measurement nobody took.
      for (const module of topology.modules) {
        expect(module.stages, module.id).toHaveLength(3);
        for (const stage of module.stages) {
          expect(stage.trim(), module.id).not.toBe("");
          // Mono micro-labels sit three-to-a-row inside the card.
          expect(stage.length, `${module.id}/${stage}`).toBeLessThanOrEqual(9);
          expect(stage, `${module.id}/${stage}`).toMatch(/^[A-Z]+$/);
        }
        expect(new Set(module.stages).size, module.id).toBe(3);
      }
    });

    it("keeps every module rect inside the viewBox", () => {
      for (const module of topology.modules) {
        expect(module.x, module.id).toBeGreaterThanOrEqual(0);
        expect(module.y, module.id).toBeGreaterThanOrEqual(0);
        expect(module.w, module.id).toBeGreaterThan(0);
        expect(module.h, module.id).toBeGreaterThan(0);
        expect(module.x + module.w, module.id).toBeLessThanOrEqual(
          topology.width
        );
        expect(module.y + module.h, module.id).toBeLessThanOrEqual(
          topology.height
        );
      }
    });

    it("never overlaps two module rects", () => {
      const { modules } = topology;
      for (let i = 0; i < modules.length; i += 1) {
        for (let j = i + 1; j < modules.length; j += 1) {
          const a = modules[i];
          const b = modules[j];
          const disjoint =
            a.x + a.w <= b.x ||
            b.x + b.w <= a.x ||
            a.y + a.h <= b.y ||
            b.y + b.h <= a.y;
          expect(disjoint, `${a.id} overlaps ${b.id}`).toBe(true);
        }
      }
    });

    it("references only real nodes from every edge, with no orphan module", () => {
      const legal = new Set(nodeIds(topology));
      const touched = new Set<string>();

      for (const edge of topology.edges) {
        expect(legal.has(edge.from), `${edge.id}.from`).toBe(true);
        expect(legal.has(edge.to), `${edge.id}.to`).toBe(true);
        expect(edge.from, edge.id).not.toBe(edge.to);
        touched.add(edge.from);
        touched.add(edge.to);
      }

      for (const module of topology.modules) {
        expect(touched.has(module.id), `${module.id} is an orphan`).toBe(true);
      }
    });

    it("gives every edge a unique id and an orthogonal polyline inside the viewBox", () => {
      const ids = topology.edges.map((e) => e.id);
      expect(new Set(ids).size).toBe(ids.length);

      for (const edge of topology.edges) {
        expect(edge.points.length, edge.id).toBeGreaterThanOrEqual(2);

        for (const [x, y] of edge.points) {
          expect(x, edge.id).toBeGreaterThanOrEqual(0);
          expect(y, edge.id).toBeGreaterThanOrEqual(0);
          expect(x, edge.id).toBeLessThanOrEqual(topology.width);
          expect(y, edge.id).toBeLessThanOrEqual(topology.height);
        }

        // The PCB/CAD read depends on this: each authored segment moves on
        // exactly one axis. (Diagonals only ever appear as implicit connectors
        // *through* a module, which the DOM card above them occludes.)
        for (let i = 1; i < edge.points.length; i += 1) {
          const [px, py] = edge.points[i - 1];
          const [x, y] = edge.points[i];
          const moved = (px === x ? 0 : 1) + (py === y ? 0 : 1);
          expect(moved, `${edge.id} segment ${i}`).toBe(1);
        }

        expect(polylineLength(edge.points), edge.id).toBeGreaterThan(0);
      }
    });

    it("forms a contiguous edge chain for every route", () => {
      const edgeById = new Map(topology.edges.map((e) => [e.id, e]));
      const ids = topology.routes.map((r) => r.id);
      expect(new Set(ids).size).toBe(ids.length);

      for (const route of topology.routes) {
        expect(route.edges.length, route.id).toBeGreaterThanOrEqual(1);
        expect(route.weight, route.id).toBeGreaterThan(0);
        expect(route.durationMs, route.id).toBeGreaterThan(0);
        expect(route.label.trim(), route.id).not.toBe("");

        for (let i = 1; i < route.edges.length; i += 1) {
          const prev = edgeById.get(route.edges[i - 1]);
          const next = edgeById.get(route.edges[i]);
          expect(prev, route.edges[i - 1]).toBeDefined();
          expect(next, route.edges[i]).toBeDefined();
          expect(prev!.to, `${route.id} hop ${i}`).toBe(next!.from);
        }
      }
    });
  }
);

describe("desktop ingress rail", () => {
  it("places every tick inside the viewBox and left of the module column", () => {
    const rail = DESKTOP_TOPOLOGY.rail;
    expect(rail).toBeDefined();

    const leftmostModule = Math.min(
      ...DESKTOP_TOPOLOGY.modules.map((m) => m.x)
    );
    expect(rail!.x).toBeLessThan(leftmostModule);
    expect(rail!.labelRight).toBeLessThanOrEqual(rail!.x);

    for (const tick of rail!.ticks) {
      expect(tick.y, tick.id).toBeGreaterThanOrEqual(0);
      expect(tick.y, tick.id).toBeLessThanOrEqual(DESKTOP_TOPOLOGY.height);
      expect(tick.label.trim(), tick.id).not.toBe("");
    }
  });

  it("sources the ingress edge from the rail, which is not a module", () => {
    const moduleIds = DESKTOP_TOPOLOGY.modules.map((m) => m.id);
    expect(moduleIds).not.toContain(INGRESS_ID);
    expect(nodeIds(DESKTOP_TOPOLOGY)).toContain(INGRESS_ID);

    const fromRail = DESKTOP_TOPOLOGY.edges.filter(
      (e) => e.from === INGRESS_ID
    );
    expect(fromRail).toHaveLength(1);
    expect(fromRail[0].to).toBe("interface");
  });

  it("has no rail on mobile, where the spine starts at the interface", () => {
    expect(MOBILE_TOPOLOGY.rail).toBeUndefined();
    expect(nodeIds(MOBILE_TOPOLOGY)).not.toContain(INGRESS_ID);
  });
});

describe("buildRoutePlan", () => {
  it("flattens a route into one polyline with monotone cumulative lengths", () => {
    for (const plan of buildRoutePlans(DESKTOP_TOPOLOGY)) {
      expect(plan.points.length, plan.id).toBeGreaterThanOrEqual(2);
      expect(plan.cumulative.length, plan.id).toBe(plan.points.length);
      expect(plan.cumulative[0], plan.id).toBe(0);
      expect(plan.length, plan.id).toBeGreaterThan(0);

      for (let i = 1; i < plan.cumulative.length; i += 1) {
        expect(plan.cumulative[i], `${plan.id}[${i}]`).toBeGreaterThan(
          plan.cumulative[i - 1]
        );
      }
      expect(plan.cumulative[plan.cumulative.length - 1]).toBeCloseTo(
        plan.length,
        10
      );
    }
  });

  it("records one node more than it records boundaries, ending at t = 1", () => {
    for (const plan of buildRoutePlans(DESKTOP_TOPOLOGY)) {
      expect(plan.nodes.length, plan.id).toBe(plan.boundaries.length + 1);
      expect(plan.boundaries[plan.boundaries.length - 1]).toBeCloseTo(1, 10);

      for (let i = 1; i < plan.boundaries.length; i += 1) {
        expect(plan.boundaries[i], `${plan.id}[${i}]`).toBeGreaterThan(
          plan.boundaries[i - 1]
        );
      }
    }
  });

  it("drops the duplicate vertex where consecutive edges already meet", () => {
    // R4 is a single edge, so its flattened polyline is exactly that edge.
    const report = buildRoutePlan(DESKTOP_TOPOLOGY, "report");
    const edge = DESKTOP_TOPOLOGY.edges.find((e) => e.id === "E8")!;
    expect(report.points).toEqual(edge.points);
    expect(report.nodes).toEqual(["data", "operations"]);
  });

  it("names the module a packet reaches at each boundary", () => {
    const enquiry = buildRoutePlan(DESKTOP_TOPOLOGY, "enquiry");
    expect(enquiry.nodes).toEqual([
      INGRESS_ID,
      "interface",
      "core",
      "data",
    ]);
  });

  it("throws on an unknown route rather than rendering a silent empty path", () => {
    expect(() => buildRoutePlan(DESKTOP_TOPOLOGY, "nope")).toThrow(
      /Unknown route/
    );
  });
});

describe("hover consequence lookups", () => {
  it("returns only edges incident to the hovered module", () => {
    // Everything else dims, so this set has to be exactly right.
    expect(incidentEdgeIds(DESKTOP_TOPOLOGY, "ai").sort()).toEqual([
      "E4",
      "E5",
      "E6",
    ]);
    expect(incidentEdgeIds(DESKTOP_TOPOLOGY, "operations").sort()).toEqual([
      "E7",
      "E8",
    ]);
  });

  it("returns the routes whose traffic should converge on the hovered module", () => {
    expect(routesThroughModule(DESKTOP_TOPOLOGY, "ai").sort()).toEqual([
      "automation",
      "inference",
    ]);
    expect(routesThroughModule(DESKTOP_TOPOLOGY, "interface")).toEqual([
      "enquiry",
    ]);
  });

  it("finds a bias route for every desktop module, so no hover is inert", () => {
    for (const module of DESKTOP_TOPOLOGY.modules) {
      expect(
        routesThroughModule(DESKTOP_TOPOLOGY, module.id).length,
        module.id
      ).toBeGreaterThan(0);
      expect(
        incidentEdgeIds(DESKTOP_TOPOLOGY, module.id).length,
        module.id
      ).toBeGreaterThan(0);
    }
  });
});

describe("polylineToPath", () => {
  it("emits one move command followed by line commands", () => {
    expect(
      polylineToPath([
        [0, 0],
        [10, 0],
        [10, 20],
      ])
    ).toBe("M0 0 L10 0 L10 20");
  });
});

describe("static (reduced-motion) packet composition", () => {
  it("freezes each packet on a real route, clear of both endpoints", () => {
    const desktopRoutes = new Set(DESKTOP_TOPOLOGY.routes.map((r) => r.id));
    for (const packet of STATIC_PACKETS) {
      expect(desktopRoutes.has(packet.routeId), packet.routeId).toBe(true);
      expect(packet.t, packet.routeId).toBeGreaterThan(0.1);
      expect(packet.t, packet.routeId).toBeLessThan(0.9);
    }

    const mobileRoutes = new Set(MOBILE_TOPOLOGY.routes.map((r) => r.id));
    for (const packet of STATIC_PACKETS_MOBILE) {
      expect(mobileRoutes.has(packet.routeId), packet.routeId).toBe(true);
    }
  });

  it("stays within each topology's concurrency cap", () => {
    expect(STATIC_PACKETS.length).toBeLessThanOrEqual(
      DESKTOP_TOPOLOGY.maxConcurrent
    );
    expect(STATIC_PACKETS_MOBILE.length).toBeLessThanOrEqual(
      MOBILE_TOPOLOGY.maxConcurrent
    );
  });

  it("uses distinct routes so the frozen frame reads as parallel activity", () => {
    const ids = STATIC_PACKETS.map((p) => p.routeId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
