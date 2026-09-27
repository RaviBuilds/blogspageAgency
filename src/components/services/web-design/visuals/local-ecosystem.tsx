"use client";

/**
 * LOCAL ECOSYSTEM — the section 6 diagram.
 *
 * Five nodes and the path between them: business → website → Google → local
 * discovery → customer. Beneath the chain, the two artefacts the setup actually
 * produces, drawn side by side: the website itself, and the local result it
 * resolves to.
 *
 * ## Why a chain and not another grid
 *
 * The section's argument is a *relationship* — that a website does not exist in
 * isolation — and a four-up card grid of setup tasks cannot state a relationship.
 * The chain states it before any copy is read, and the four setup items then read
 * as the work that makes the chain connect.
 *
 * ## Motion
 *
 * The connectors draw left-to-right once, in sequence, when the diagram enters
 * view — the one place on the page where motion carries meaning rather than
 * polish, because the drawing *is* the direction of the relationship. Driven
 * through `animate` behind the `useMotionReady` gate. Under reduced motion the
 * connectors are simply already drawn.
 *
 * The whole diagram is `aria-hidden` and every node label is duplicated nowhere:
 * the labels are the chain's only text and they are decorative annotations of the
 * relationship the section's lead paragraph states in prose.
 */

import { motion, useInView, useReducedMotion } from "framer-motion";
import { Building2, Globe, MapPin, Search, UserRound } from "lucide-react";
import { useRef } from "react";

import { useMotionReady } from "@/components/home/progress-reveal";
import { EASE } from "@/lib/motion";
import { PILLAR_TONE } from "@/lib/web-design-visual-system";

import { Line, MockNav, Paragraph, Pill, alpha } from "./frames";

const CYAN = PILLAR_TONE.cyan;
const BLUE = PILLAR_TONE.blue;

const NODES = [
  { id: "business", label: "Your business", Icon: Building2 },
  { id: "website", label: "Your website", Icon: Globe },
  { id: "google", label: "Google", Icon: Search },
  { id: "discovery", label: "Local discovery", Icon: MapPin },
  { id: "customer", label: "Nearby customer", Icon: UserRound },
] as const;

/* -------------------------------------------------------------------------- */

/** The website artefact: a small browser window with a clean business page. */
function WebsiteArtefact() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <MockNav accent={BLUE} />
      <div className="flex gap-3 px-3 pb-3.5 pt-1">
        <span className="flex flex-[3] flex-col gap-1.5">
          <Line w="w-full" h="h-2" tone="ink" />
          <Line w="w-2/3" h="h-2" color={alpha(BLUE, 0.7)} />
          <Paragraph lines={2} />
          <Pill accent={BLUE} w="w-16" h="h-4" className="mt-1" />
        </span>
        {/* The NAP block — the thing consistency is enforced on. */}
        <span className="flex flex-[2] flex-col gap-1 rounded border border-border-subtle bg-background-subtle p-2">
          {[0, 1, 2].map((i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span
                className="size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: alpha(CYAN, 0.7) }}
              />
              <Line w={i === 2 ? "w-2/3" : "w-full"} h="h-1" tone="faint" />
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

/** The local result artefact: a local pack row plus a business profile panel. */
function LocalResultArtefact() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card p-3">
      <span className="flex h-6 items-center gap-2 rounded-full border border-border bg-background-subtle px-2.5">
        <Search className="size-2.5 text-text-disabled" aria-hidden />
        <Line w="w-1/2" h="h-1.5" tone="muted" />
      </span>

      <div className="mt-2.5 flex gap-2.5">
        {/* The pack: the first row resolves, the rest are competitors. */}
        <div className="flex flex-1 flex-col gap-1.5">
          <span
            className="flex items-center gap-2 rounded border px-2 py-1.5"
            style={{
              borderColor: alpha(CYAN, 0.35),
              backgroundColor: alpha(CYAN, 0.06),
            }}
          >
            <span
              className="size-3 shrink-0 rounded-[0.2rem]"
              style={{ backgroundColor: CYAN }}
            />
            <span className="flex flex-1 flex-col gap-1">
              <Line w="w-2/3" h="h-1" color={alpha(CYAN, 0.8)} />
              <Line w="w-1/3" h="h-1" tone="faint" />
            </span>
          </span>
          {[0, 1].map((i) => (
            <span key={i} className="flex items-center gap-2 px-2 py-1">
              <span className="size-3 shrink-0 rounded-[0.2rem] bg-background-subtle" />
              <span className="flex flex-1 flex-col gap-1">
                <Line w="w-1/2" h="h-1" tone="faint" />
                <Line w="w-1/3" h="h-1" tone="faint" />
              </span>
            </span>
          ))}
        </div>

        {/* The profile panel: category, hours, actions. */}
        <div className="flex w-[38%] flex-col gap-1.5 rounded border border-border-subtle p-2">
          <span
            className="h-6 w-full rounded"
            style={{
              background: `linear-gradient(120deg, ${alpha(CYAN, 0.2)}, ${alpha(BLUE, 0.1)})`,
            }}
          />
          <Line w="w-3/4" h="h-1.5" tone="strong" />
          <Line w="w-1/2" h="h-1" tone="faint" />
          <span className="mt-0.5 flex gap-1">
            <Pill accent={CYAN} w="w-full" h="h-3" className="rounded" />
            <span className="h-3 w-8 rounded border border-border-strong" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export function LocalEcosystem() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = Boolean(useReducedMotion());
  const armed = useMotionReady();
  const inView = useInView(ref, { once: true, margin: "-90px" });
  const settled = reduce || !armed;
  const drawn = settled || inView;

  const connector = (i: number) => ({
    initial: false as const,
    animate: { scaleX: drawn ? 1 : 0 },
    transition: settled
      ? { duration: 0 }
      : { duration: 0.45, delay: 0.12 + i * 0.16, ease: EASE },
  });

  return (
    <div ref={ref} aria-hidden>
      {/* ── THE CHAIN ────────────────────────────────────────────────────
          Horizontal from `md`. Below that it becomes a vertical chain, because a
          five-node horizontal diagram on a phone is either unreadable or a
          horizontal scroll — neither of which is an intentional mobile design. */}
      <ol className="flex flex-col gap-3 md:flex-row md:items-start md:gap-0">
        {NODES.map(({ id, label, Icon }, i) => (
          <li
            key={id}
            className="flex items-center gap-4 md:flex-1 md:flex-col md:items-center md:gap-0"
          >
            <div className="flex items-center gap-4 md:w-full md:flex-col md:gap-0">
              {/* Node + the horizontal connector reaching to the next node. */}
              <div className="flex items-center md:w-full">
                {i > 0 ? (
                  <motion.span
                    className="hidden h-px flex-1 origin-left md:block"
                    style={{ backgroundColor: alpha(CYAN, 0.45) }}
                    {...connector(i - 1)}
                  />
                ) : (
                  <span className="hidden flex-1 md:block" />
                )}

                <span
                  className="flex size-12 shrink-0 items-center justify-center rounded-full border"
                  style={{
                    borderColor: alpha(CYAN, 0.28),
                    backgroundColor: alpha(CYAN, 0.07),
                  }}
                >
                  <Icon className="size-5" style={{ color: CYAN }} aria-hidden />
                </span>

                {i < NODES.length - 1 ? (
                  <motion.span
                    className="hidden h-px flex-1 origin-left md:block"
                    style={{ backgroundColor: alpha(CYAN, 0.45) }}
                    {...connector(i)}
                  />
                ) : (
                  <span className="hidden flex-1 md:block" />
                )}
              </div>

              <span className="text-sm font-medium leading-snug text-text-subtle md:mt-3 md:text-center md:text-xs">
                {label}
              </span>
            </div>
          </li>
        ))}
      </ol>

      {/* ── THE ARTEFACTS ────────────────────────────────────────────────
          Positioned under the nodes they belong to: the website under node 2,
          the local result under nodes 3–4. */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-5">
        <WebsiteArtefact />
        <LocalResultArtefact />
      </div>
    </div>
  );
}
