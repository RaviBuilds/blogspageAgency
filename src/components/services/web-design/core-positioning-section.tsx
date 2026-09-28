import { WEB_DESIGN_CORE_POSITIONING } from "@/lib/web-design-data";
import { PILLAR_PLAIN } from "@/lib/web-design-plain-language";
import {
  PILLAR_TONE,
  PILLAR_WEIGHT,
  type PillarAccent,
} from "@/lib/web-design-visual-system";
import { TYPE_MICRO } from "@/lib/brand-type";
import { ScrollReveal } from "@/components/home/scroll-reveal";

import { alpha } from "./visuals/frames";
import { PillarRatioBar, type RatioSegment } from "./visuals/pillar-ratio-bar";
import { SectionHeading } from "./visuals/section-shell";

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 3 — THE 70 / 20 / 10 SYSTEM. The page's signature methodology.

   ## What changed and why

   Three equal-width cards in a `lg:grid-cols-3`, each with its percentage set at
   the same size, the primary one distinguished only by a slightly stronger ring.
   A model whose entire meaning is *unequal weighting* was rendered as three equal
   objects — the one section on the page where the layout actively contradicted
   the copy.

   The rebuild makes weighting structural, in three moves:

   1. `PillarRatioBar` at display scale, directly under the heading. One object,
      split 70/20/10, segments growing from the left on arrival. This is the
      three-second read.
   2. The 70% pillar gets a full-bleed region of its own with a display-scale
      numeral, a tinted field and a two-column capability list.
   3. The 20% and 10% pillars share the row below at half width each, with their
      numerals two steps smaller.

   Nothing about the copy changed: the percentages, roles, titles, descriptions
   and capability lists are the copy deck's, in the copy deck's order.

   ## FINAL PASS — one system, and a name a business owner can repeat

   Two problems survived the rebuild.

   **It still read as a chart of three offers, not one framework.** The three
   panels were three separate bordered cards with gaps between them, which is the
   shape of a comparison — and comparison is the opposite of what a 70/20/10
   *system* claims. They now share a single enclosing sheet with internal
   hairlines: one object, divided unequally. The dominance survives (the 70
   region keeps its tint, its display numeral and the full width) but the three
   parts can no longer be read as alternatives to each other.

   **The percentages were labelled in our vocabulary, not the customer's.** "Core
   Web Design & Architecture" is accurate and it is what a technical reader needs
   to see. It is not what tells a dentist what 70% of the budget buys. Each
   region now leads with the plain-language name and meaning from
   `web-design-plain-language.ts` — The Website / The Brand / The Launch — and the
   deck's own title sits directly beneath it, unchanged, as the technical layer.
   The capability lists are untouched below that.

   ## Why the bar and the regions both exist

   The bar is comprehension and the regions are detail. Shipping only the bar
   would lose the capability lists, which are the section's substance; shipping
   only the regions is what produced the original problem. The bar's weights and
   the regions' order come from the same `PILLAR_WEIGHT` table, so they cannot
   disagree.
   ──────────────────────────────────────────────────────────────────────────── */

function CapabilityList({
  items,
  tone,
  columns,
}: {
  items: readonly string[];
  tone: string;
  columns: 1 | 2;
}) {
  return (
    <ul
      className={`mt-7 grid gap-x-8 gap-y-3 ${columns === 2 ? "sm:grid-cols-2" : ""}`}
    >
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          {/* A rule rather than a tick: six ticks in a column reads as a
              checklist of features, a rule reads as a system's parts. */}
          <span
            aria-hidden
            className="mt-[0.6rem] h-px w-4 shrink-0"
            style={{ backgroundColor: tone }}
          />
          <span className="text-sm leading-relaxed text-foreground/85">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

function RoleBadge({ role, tone }: { role: string; tone: string }) {
  return (
    <span
      className={`${TYPE_MICRO} inline-flex items-center rounded-full border px-3 py-1`}
      style={{
        color: tone,
        borderColor: alpha(tone, 0.28),
        backgroundColor: alpha(tone, 0.06),
      }}
    >
      {role}
    </span>
  );
}

export function CorePositioningSection() {
  const { eyebrow, h2, lead, supportingCopy, pillars } =
    WEB_DESIGN_CORE_POSITIONING;

  const segments: RatioSegment[] = pillars.map((pillar) => ({
    id: pillar.id,
    label: pillar.title,
    plainName: PILLAR_PLAIN[pillar.id]?.name,
    percentage: pillar.percentage,
    accent: pillar.accent as PillarAccent,
    weight: PILLAR_WEIGHT[pillar.id] ?? 10,
  }));

  const dominant = pillars.find((p) => p.id === "web-design") ?? pillars[0];
  const supporting = pillars.filter((p) => p.id !== dominant.id);
  const dominantTone = PILLAR_TONE[dominant.accent as PillarAccent];
  const dominantPlain = PILLAR_PLAIN[dominant.id];

  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-28 lg:py-36">
      {/* A single wide wash behind the framework, centred on the bar. The section
          is the page's conceptual centre, so it gets the page's only symmetrical
          atmosphere. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, rgba(67, 83, 201, 0.10), transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={h2}
            lead={lead}
            register="statement"
            accent="blue"
            align="center"
            measure="max-w-3xl"
          />
        </ScrollReveal>

        {/* ── THE INSTRUMENT ───────────────────────────────────────────── */}
        <ScrollReveal delay={0.1}>
          <div className="mx-auto mt-16 max-w-3xl">
            <PillarRatioBar segments={segments} size="display" />
          </div>
        </ScrollReveal>

        {/* ── THE SYSTEM ───────────────────────────────────────────────────
            One sheet, three regions, divided unequally. The enclosing border is
            what stops the three parts reading as three competing offers; the
            internal hairlines are drawn per region rather than with `divide-*`
            so the 1 + 2 arrangement can carry them. */}
        <ScrollReveal delay={0.06}>
          <div className="mt-20 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_34px_80px_-52px_rgb(14_21_36/0.34)]">
            {/* THE DOMINANT REGION — 70%. */}
            <article
              className="relative overflow-hidden border-b border-border-subtle p-8 sm:p-10 lg:p-12"
              style={{
                background: `linear-gradient(135deg, ${alpha(dominantTone, 0.08)} 0%, ${alpha(dominantTone, 0.02)} 48%, transparent 100%)`,
              }}
            >
              {/* The numeral, set as a display-scale object in the corner. It is
                  decorative here because the accessible percentage is in the bar
                  legend and in the region's own label row. */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-2 -top-8 select-none text-[9rem] font-semibold leading-none tracking-tighter sm:text-[12rem] lg:text-[14rem]"
                style={{ color: alpha(dominantTone, 0.07) }}
              >
                {dominant.percentage}
              </span>

              <div className="relative lg:grid lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="text-4xl font-semibold tracking-tighter sm:text-5xl"
                      style={{ color: dominantTone }}
                    >
                      {dominant.percentage}
                    </span>
                    <RoleBadge role={dominant.role} tone={dominantTone} />
                  </div>

                  {/* THE HEADING, DUAL-LAYER.
                      One `<h3>` carrying both registers rather than a
                      plain-language heading with the deck's title demoted to a
                      paragraph beside it. The plain name is what a visitor
                      reads; the deck's approved title stays inside the heading
                      element, so the outline and the keyword it carries are
                      unchanged while the visual dominance flips to the words a
                      business owner can act on. */}
                  <h3 className="mt-6">
                    <span className="block text-3xl font-semibold leading-[1.05] tracking-tighter text-foreground sm:text-4xl text-balance">
                      {dominantPlain?.name ?? dominant.title}
                    </span>
                    {dominantPlain ? (
                      <span
                        className={`${TYPE_MICRO} mt-4 block text-text-disabled`}
                      >
                        {dominant.title}
                      </span>
                    ) : null}
                  </h3>

                  {dominantPlain ? (
                    <p className="mt-4 max-w-[32ch] text-base font-medium leading-snug text-foreground/70 sm:text-lg">
                      {dominantPlain.meaning}
                    </p>
                  ) : null}

                  <p className="mt-4 text-sm leading-[1.7] text-muted-foreground">
                    {dominant.description}
                  </p>
                </div>

                <div className="mt-8 lg:col-span-7 lg:mt-0">
                  <CapabilityList
                    items={dominant.capabilities}
                    tone={alpha(dominantTone, 0.6)}
                    columns={2}
                  />
                </div>
              </div>
            </article>

            {/* THE SUPPORTING REGIONS — 20% and 10%. */}
            <div className="grid lg:grid-cols-2">
              {supporting.map((pillar, i) => {
                const tone = PILLAR_TONE[pillar.accent as PillarAccent];
                const plain = PILLAR_PLAIN[pillar.id];
                return (
                  <article
                    key={pillar.id}
                    className={`p-7 sm:p-8 lg:p-10 ${
                      i === 0
                        ? "border-b border-border-subtle lg:border-b-0 lg:border-r"
                        : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className="text-2xl font-semibold tracking-tighter sm:text-3xl"
                        style={{ color: tone }}
                      >
                        {pillar.percentage}
                      </span>
                      <RoleBadge role={pillar.role} tone={tone} />
                    </div>

                    <h3 className="mt-5">
                      <span className="block text-xl font-semibold leading-tight tracking-tighter text-foreground sm:text-2xl">
                        {plain?.name ?? pillar.title}
                      </span>
                      {plain ? (
                        <span
                          className={`${TYPE_MICRO} mt-3.5 block text-text-disabled`}
                        >
                          {pillar.title}
                        </span>
                      ) : null}
                    </h3>

                    {plain ? (
                      <p className="mt-3 max-w-[34ch] text-sm font-medium leading-snug text-foreground/70 sm:text-base">
                        {plain.meaning}
                      </p>
                    ) : null}

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {pillar.description}
                    </p>

                    <CapabilityList
                      items={pillar.capabilities}
                      tone={alpha(tone, 0.55)}
                      columns={1}
                    />
                  </article>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* ── THE POSITIONING LINE ─────────────────────────────────────── */}
        <ScrollReveal delay={0.12}>
          <p className="mx-auto mt-16 max-w-2xl text-center text-base leading-[1.7] text-text-subtle">
            {supportingCopy}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
