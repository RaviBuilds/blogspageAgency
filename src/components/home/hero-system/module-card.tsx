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

/**
 * R2.2 — the light website surface.
 *
 * The one deliberately light product UI inside the dark system. It is the
 * story's front door: "what customers see". Everything around it stays dark —
 * "what Blogspage builds behind it" — so the contrast itself is the message,
 * and no caption or label has to explain it.
 *
 * Everything inside is generic by design: a placeholder address, a plain
 * navigation, a headline a business owner would recognise, neutral content
 * bars instead of invented copy, and one enquiry action. No client name, no
 * review, no revenue figure, no claim — a mock, not a case study.
 *
 * The card keeps its system instrumentation (mono `WEBSITE` header, LED, the
 * FIND/TRUST/CONTACT stage row and the hover caption), so the light surface
 * still reads as a node of the same graph — the packet can visibly traverse
 * it, the stage highlight still walks on arrival, and reduced motion still
 * serves the fully assembled, fully legible composition.
 *
 * `compact` is the mobile variant: the card is a short full-width strip there,
 * so the content preview drops and the headline shares a row with the enquiry
 * chip. Same message, quarter of the height.
 */
function WebsiteSurface({
  mod,
  compact,
}: {
  mod: SystemModule;
  compact: boolean;
}) {
  return (
    <>
      <div className={styles.header}>
        <span className={styles.label}>{mod.label}</span>
        <span data-module-pulse aria-hidden="true" className={styles.pulse} />
      </div>

      {/* Browser chrome: generic identity mark + placeholder address + nav. */}
      <div aria-hidden="true" className={styles.siteChrome}>
        <span className={styles.siteUrl}>
          <span className={styles.siteMark} />
          yourbusiness.com
        </span>
        {!compact && (
          <span className={styles.siteNav}>
            HOME
            <span aria-hidden className={styles.siteNavSep}>
              ·
            </span>
            WORK
            <span aria-hidden className={styles.siteNavSep}>
              ·
            </span>
            CONTACT
          </span>
        )}
      </div>

      <div
        className={[styles.siteBody, compact ? styles.siteBodyCompact : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <p className={styles.siteHead}>Your business, online.</p>
        {!compact && (
          <div aria-hidden="true" className={styles.siteLines}>
            <span style={{ width: "72%" }} />
            <span style={{ width: "46%" }} />
          </div>
        )}
        <span className={styles.siteCta}>Enquire</span>
      </div>

      {/*
        The stage row is shared with the dark cards — the engine walks its
        highlight one step per packet arrival — restyled here for the light
        surface so the two layers keep speaking one language.
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

      <span data-module-caption className={styles.caption}>
        {mod.caption}
      </span>
    </>
  );
}

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
      {/*
        R2.2: the entry surface (WEBSITE) renders as the light product UI; every
        other module keeps the standard dark system card. The engine hooks —
        `data-module`, `data-module-pulse`, `data-stage-index`,
        `data-module-caption` — are identical either way, so the runtime cannot
        tell the difference and the light surface participates in the same
        traffic, focus and phase behaviour as the rest of the graph. It ships no
        telemetry cluster, which the engine treats as an empty (no-op) readout.
      */}
      {mod.entry ? (
        <WebsiteSurface mod={mod} compact={topology.id === "mobile"} />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
