/**
 * PROCESS ARTEFACTS — five states of one build.
 *
 * Five unrelated illustrations would decorate five phases. Five *artefacts* —
 * the scope sheet, the blueprint, the increments, the validation pass, the live
 * system — prove they are phases of one process, which is the claim the section
 * makes. Same device as the Web Design process section's evolving page mockups,
 * in this page's engineering register.
 *
 * Every artefact is drawn from divs and one accent: no images, no icons, no
 * canvas, no dependency. Server-renderable and fully decorative — each is wrapped
 * in `ArtefactCard`, which is `aria-hidden`, and the phase's real focus list and
 * output sit beside it as text.
 *
 * The artefacts never contain a number a visitor could read as a promise: no
 * durations, no counts, no percentages. Abstract rules and chips only.
 */

import type { ReactElement } from "react";

import { ArtefactCard, Chip, Rule } from "./system-frames";
import { alpha } from "@/lib/web-development-visual-system";

/* -------------------------------------------------------------------------- */
/* 01 — Discover & Define: the scope sheet                                    */
/* -------------------------------------------------------------------------- */

function ScopeSheet({ accent }: { accent: string }) {
  return (
    <ArtefactCard label="Scope" accent={accent}>
      <div className="flex flex-col gap-2.5">
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="flex items-center gap-2.5">
            <span
              className="size-3 shrink-0 rounded-[0.2rem] border"
              style={{
                borderColor: alpha(accent, row < 3 ? 0.5 : 0.2),
                backgroundColor: alpha(accent, row < 3 ? 0.35 : 0.04),
              }}
            />
            <Rule w={["w-full", "w-[86%]", "w-[72%]", "w-[58%]"][row]} h="h-1.5" />
          </div>
        ))}
      </div>
    </ArtefactCard>
  );
}

/* -------------------------------------------------------------------------- */
/* 02 — Architect: the blueprint                                              */
/* -------------------------------------------------------------------------- */

function Blueprint({ accent }: { accent: string }) {
  return (
    <ArtefactCard label="Blueprint" accent={accent}>
      {/* Three role doors above, one data core below, connected — the shape of
          the system decision this phase produces. */}
      <div className="flex flex-col items-center">
        <div className="grid w-full grid-cols-3 gap-1.5">
          {[0, 1, 2].map((role) => (
            <span
              key={role}
              className="h-5 rounded-[0.25rem] border"
              style={{
                borderColor: alpha(accent, 0.3),
                backgroundColor: alpha(accent, 0.06),
              }}
            />
          ))}
        </div>

        <span className="relative my-2 block h-4 w-full">
          <span className="absolute inset-x-[16.666%] top-2 block h-px" style={{ backgroundColor: alpha(accent, 0.35) }} />
          {[16.666, 50, 83.333].map((left) => (
            <span
              key={left}
              className="absolute top-0 block h-2 w-px"
              style={{ left: `${left}%`, backgroundColor: alpha(accent, 0.35) }}
            />
          ))}
          <span
            className="absolute left-1/2 top-2 block h-2 w-px"
            style={{ backgroundColor: alpha(accent, 0.35) }}
          />
        </span>

        <div
          className="w-full rounded-[0.3rem] border px-2 py-2"
          style={{ borderColor: alpha(accent, 0.45), backgroundColor: alpha(accent, 0.08) }}
        >
          <div className="flex flex-col gap-1.5">
            <Rule w="w-[70%]" h="h-1" color={alpha(accent, 0.5)} />
            <Rule w="w-[50%]" h="h-1" color={alpha(accent, 0.3)} />
          </div>
        </div>
      </div>
    </ArtefactCard>
  );
}

/* -------------------------------------------------------------------------- */
/* 03 — Build: working increments                                             */
/* -------------------------------------------------------------------------- */

function Increments({ accent }: { accent: string }) {
  /* Three modules at three states of completion, which is what "working
     increments, not a single big-bang delivery" looks like as a shape. */
  const fills = [1, 0.66, 0.3];

  return (
    <ArtefactCard label="Increments" accent={accent}>
      <div className="flex flex-col gap-3">
        {fills.map((fill, row) => (
          <div key={row} className="flex items-center gap-2.5">
            <Chip accent={accent} w="w-7" filled={fill === 1} />
            <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-border-subtle">
              <span
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${fill * 100}%`, backgroundColor: alpha(accent, 0.75) }}
              />
            </span>
          </div>
        ))}
      </div>
    </ArtefactCard>
  );
}

/* -------------------------------------------------------------------------- */
/* 04 — Test & Validate: the pass                                             */
/* -------------------------------------------------------------------------- */

function ValidationPass({ accent }: { accent: string }) {
  return (
    <ArtefactCard label="Validation" accent={accent}>
      <div className="grid grid-cols-2 gap-2">
        {[0, 1, 2, 3, 4, 5].map((cell) => (
          <span
            key={cell}
            className="flex items-center gap-2 rounded-[0.25rem] border px-2 py-1.5"
            style={{
              borderColor: alpha(accent, 0.22),
              backgroundColor: alpha(accent, 0.04),
            }}
          >
            {/* A tick drawn from two rules — an icon font would be a dependency
                for a shape this small. */}
            <span className="relative block size-2.5 shrink-0">
              <span
                className="absolute left-0 top-[55%] block h-px w-[45%] origin-left rotate-45"
                style={{ backgroundColor: accent }}
              />
              <span
                className="absolute left-[30%] top-[70%] block h-px w-[75%] origin-left -rotate-45"
                style={{ backgroundColor: accent }}
              />
            </span>
            <Rule w="w-full" h="h-1" />
          </span>
        ))}
      </div>
    </ArtefactCard>
  );
}

/* -------------------------------------------------------------------------- */
/* 05 — Launch & Evolve: live, with a queue behind it                         */
/* -------------------------------------------------------------------------- */

function LiveSystem({ accent }: { accent: string }) {
  return (
    <ArtefactCard label="Live" accent={accent}>
      <div className="flex flex-col gap-3">
        <div
          className="flex items-center gap-2 rounded-[0.3rem] border px-2.5 py-2"
          style={{ borderColor: alpha(accent, 0.45), backgroundColor: alpha(accent, 0.08) }}
        >
          <span
            className="size-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: accent }}
          />
          <Rule w="w-[60%]" h="h-1.5" color={alpha(accent, 0.45)} />
        </div>

        {/* The queue that continues after launch. Fainter each row: this is a
            direction of travel, not a roadmap with dates. */}
        {[0.28, 0.18, 0.1].map((strength, row) => (
          <div key={row} className="flex items-center gap-2.5">
            <Chip accent={accent} w="w-6" />
            <Rule
              w={["w-[78%]", "w-[62%]", "w-[44%]"][row]}
              h="h-1"
              color={alpha(accent, strength)}
            />
          </div>
        ))}
      </div>
    </ArtefactCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Registry                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Keyed by `WEB_DEVELOPMENT_PROCESS.phases[].step`, so a phase that loses its
 * artefact renders without one rather than throwing.
 */
export const STAGE_ARTEFACTS: Record<
  string,
  (props: { accent: string }) => ReactElement
> = {
  "01": ScopeSheet,
  "02": Blueprint,
  "03": Increments,
  "04": ValidationPass,
  "05": LiveSystem,
};
