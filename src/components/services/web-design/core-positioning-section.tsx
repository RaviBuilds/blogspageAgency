import { WEB_DESIGN_CORE_POSITIONING } from "@/lib/web-design-data";
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
   SECTION 3 — THE 70 / 20 / 10 SYSTEM.

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
   2. The 70% pillar gets a full-bleed panel of its own with a display-scale
      numeral, a tinted field and a two-column capability list.
   3. The 20% and 10% pillars share the row below at half width each, on the flat
      card surface, with their numerals two steps smaller.

   Nothing about the copy changed: the percentages, roles, titles, descriptions
   and capability lists are the copy deck's, in the copy deck's order.

   ## Why the bar and the panels both exist

   The bar is comprehension and the panels are detail. Shipping only the bar would
   lose the capability lists, which are the section's substance; shipping only the
   panels is what produced the original problem. The bar's weights and the panels'
   order come from the same `PILLAR_WEIGHT` table, so they cannot disagree.
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
    percentage: pillar.percentage,
    accent: pillar.accent as PillarAccent,
    weight: PILLAR_WEIGHT[pillar.id] ?? 10,
  }));

  const dominant = pillars.find((p) => p.id === "web-design") ?? pillars[0];
  const supporting = pillars.filter((p) => p.id !== dominant.id);

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

        {/* ── THE DOMINANT PILLAR ──────────────────────────────────────── */}
        <ScrollReveal delay={0.06}>
          <article
            className="relative mt-20 overflow-hidden rounded-2xl border p-8 sm:p-10 lg:p-12"
            style={{
              borderColor: alpha(PILLAR_TONE[dominant.accent as PillarAccent], 0.28),
              background: `linear-gradient(135deg, ${alpha(PILLAR_TONE[dominant.accent as PillarAccent], 0.07)} 0%, rgba(255,255,255,0.9) 45%, rgba(255,255,255,0.95) 100%)`,
              boxShadow: "0 30px 70px -48px rgb(14 21 36 / 0.35)",
            }}
          >
            {/* The numeral, set as a display-scale object in the corner. It is
                decorative here because the accessible percentage is in the bar
                legend and in the panel's own label row. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-2 -top-8 select-none text-[9rem] font-semibold leading-none tracking-tighter sm:text-[12rem] lg:text-[14rem]"
              style={{
                color: alpha(PILLAR_TONE[dominant.accent as PillarAccent], 0.07),
              }}
            >
              {dominant.percentage}
            </span>

            <div className="relative lg:grid lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="text-4xl font-semibold tracking-tight sm:text-5xl"
                    style={{
                      color: PILLAR_TONE[dominant.accent as PillarAccent],
                    }}
                  >
                    {dominant.percentage}
                  </span>
                  <RoleBadge
                    role={dominant.role}
                    tone={PILLAR_TONE[dominant.accent as PillarAccent]}
                  />
                </div>

                <h3 className="mt-6 text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl text-balance">
                  {dominant.title}
                </h3>

                <p className="mt-4 text-base leading-[1.7] text-muted-foreground">
                  {dominant.description}
                </p>
              </div>

              <div className="mt-8 lg:col-span-7 lg:mt-0">
                <CapabilityList
                  items={dominant.capabilities}
                  tone={alpha(PILLAR_TONE[dominant.accent as PillarAccent], 0.6)}
                  columns={2}
                />
              </div>
            </div>
          </article>
        </ScrollReveal>

        {/* ── THE SUPPORTING PILLARS ───────────────────────────────────── */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {supporting.map((pillar, i) => {
            const tone = PILLAR_TONE[pillar.accent as PillarAccent];
            return (
              <ScrollReveal key={pillar.id} delay={0.08 + i * 0.06}>
                <article className="h-full rounded-2xl border border-border bg-card p-7 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="text-2xl font-semibold tracking-tight sm:text-3xl"
                      style={{ color: tone }}
                    >
                      {pillar.percentage}
                    </span>
                    <RoleBadge role={pillar.role} tone={tone} />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold leading-snug tracking-tight text-foreground">
                    {pillar.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>

                  <CapabilityList
                    items={pillar.capabilities}
                    tone={alpha(tone, 0.55)}
                    columns={1}
                  />
                </article>
              </ScrollReveal>
            );
          })}
        </div>

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
