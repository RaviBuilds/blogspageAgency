"use client";

/**
 * LOCAL ECOSYSTEM — the section 6 diagram.
 *
 * The chain the section argues for, drawn once:
 *
 *     your business → your website → Google Search → Google Maps
 *                   → a nearby customer finds you
 *
 * Beneath it, the two artefacts the setup actually produces: the website itself,
 * and the local result it resolves to.
 *
 * ## Why a chain and not another grid
 *
 * The section's argument is a *relationship* — that a website does not exist in
 * isolation — and a four-up card grid of setup tasks cannot state a relationship.
 * The chain states it before any copy is read, and the four setup items then read
 * as the work that makes the chain connect.
 *
 * ## FINAL PASS — the labels became the explanation
 *
 * The chain used to be `aria-hidden` artwork with terse decorative labels
 * ("Google", "Local discovery"), on the reasoning that the section's lead
 * paragraph carried the meaning in prose. That reasoning was wrong for this
 * section specifically: this is the page's largest comprehension gap, and the
 * diagram is the only thing on screen that explains it in a form a non-technical
 * reader can absorb. Hiding the explanation from assistive technology and leaving
 * it out of the served HTML was hiding the best version of the argument.
 *
 * So the chain is now `ExplainerChain`: a real `<ol>` of real text with the
 * technical name for each link kept as a subordinate annotation. Only the rules
 * and chevrons between the nodes are `aria-hidden` and animated — the ordering
 * the list already carries is what conveys direction without them.
 *
 * The two abstract artefacts stay `aria-hidden`, because those genuinely are
 * decorative: they are div-drawn stand-ins for a browser window and a map result,
 * and every fact they imply is stated in the chain above and the prose beside it.
 *
 * ## Keeping this out of SEO-service territory
 *
 * Deliberately restrained: no ranking graphs, no position numbers, no upward
 * arrows, nothing that implies an ongoing ranking outcome. The artwork shows a
 * *configured* local presence, which is exactly the scope the copy claims.
 */

import { Building2, Globe, MapPin, Search, UserRound } from "lucide-react";

import {
  LOCAL_ECOSYSTEM_CHAIN,
  NAP_FAN,
} from "@/lib/web-design-plain-language";
import { PILLAR_TONE } from "@/lib/web-design-visual-system";

import { ExplainerChain, NapFan } from "./explainer-chain";
import { Line, MockNav, Paragraph, Pill, alpha } from "./frames";

const CYAN = PILLAR_TONE.cyan;
const BLUE = PILLAR_TONE.blue;

/**
 * A recognisable glyph per chain node.
 *
 * Decorative only — every one of them sits beside a real text label, so the
 * diagram never depends on a visitor recognising an icon. They exist because a
 * shopfront, a globe, a magnifier, a map pin and a person are read faster than
 * five equally-sized text nodes, which is the whole point of drawing this as a
 * diagram rather than writing it as a sentence.
 */
const CHAIN_ICONS = {
  business: <Building2 className="size-4" />,
  website: <Globe className="size-4" />,
  google: <Search className="size-4" />,
  maps: <MapPin className="size-4" />,
  customer: <UserRound className="size-4" />,
} as const;

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

/** A small caption above an artefact, so the artwork is not unattributed. */
function ArtefactCaption({ children }: { children: string }) {
  return (
    <span className="block text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-text-disabled">
      {children}
    </span>
  );
}

export function LocalEcosystem() {
  return (
    <div>
      {/* ── THE CHAIN ────────────────────────────────────────────────────
          Real text, real list, real reading order. Horizontal from `sm`; below
          that it recomposes into a vertical chain with downward chevrons rather
          than shrinking a five-node horizontal diagram into illegibility. */}
      <ExplainerChain
        steps={LOCAL_ECOSYSTEM_CHAIN}
        accent={CYAN}
        size="feature"
        icons={CHAIN_ICONS}
      />

      {/* ── THE ARTEFACTS ────────────────────────────────────────────────
          What links two and four of the chain actually look like. Decorative:
          abstract shapes, no strings, nothing a reader needs. */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <div>
          <ArtefactCaption>Your website</ArtefactCaption>
          <div aria-hidden className="mt-2.5">
            <WebsiteArtefact />
          </div>
        </div>
        <div>
          <ArtefactCaption>What a customer sees on Google</ArtefactCaption>
          <div aria-hidden className="mt-2.5">
            <LocalResultArtefact />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The NAP consistency explainer, exported separately so the section can place it
 * where the reader is actually asking the question rather than folding it into
 * the chain above.
 *
 * "NAP consistency" is the single most opaque phrase in this section's copy, and
 * it is opaque in a way an icon cannot fix: the concept is not *what* the three
 * facts are, it is that they must be *identical everywhere*. That is a shape —
 * three into many into one — so it is drawn as one.
 */
export function NapConsistency() {
  return (
    <NapFan
      source={NAP_FAN.source}
      sourceLabel={NAP_FAN.sourceLabel}
      destinations={NAP_FAN.destinations}
      destinationLabel={NAP_FAN.destinationLabel}
      conclusion={NAP_FAN.conclusion}
      accent={CYAN}
    />
  );
}
