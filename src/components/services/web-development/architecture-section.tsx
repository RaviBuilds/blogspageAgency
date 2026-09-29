import { WEB_DEVELOPMENT_ARCHITECTURE } from "@/lib/web-development-data";
import { ACCESS_DOORS } from "@/lib/web-development-plain-language";
import {
  ARCHITECTURE_LAYER_ACCENT,
  SYSTEM_TONE_ON_DARK,
  alpha,
} from "@/lib/web-development-visual-system";
import { TYPE_MICRO } from "@/lib/brand-type";
import { SectionHeading } from "@/components/services/web-design/visuals/section-shell";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { SectionSeam } from "@/components/home/section-seam";
import { RHYTHM_CHAPTER } from "@/lib/section-rhythm";

import { AccessDoors } from "./visuals/access-doors";
import { SystemFlow } from "./visuals/system-flow";

/**
 * SECTION 04 — WHAT'S BEHIND THE WEBSITE? (Architecture)
 *
 * The page's central educational section, and its one dark island.
 *
 * ## What the final pass changed
 *
 * Three things, all about the section reading as part of this website:
 *
 * 1. **Seams and atmosphere.** The island was a hard rectangle: a light section
 *    ended, ink began. Every dark island on this site dissolves its own edges
 *    with `SectionSeam` and carries a low-alpha wash, and the absence of both was
 *    the single most obvious "different template" tell on the page. Both are now
 *    present, reusing the homepage primitive rather than a local gradient.
 *
 * 2. **Business meaning leads the card.** Every layer card opened with its
 *    technical name ("Frontend", "Authentication & Access") and explained itself
 *    second. The hierarchy the brief specifies is
 *    experience → what happens → technology tag, so the business sentence is now
 *    the dominant line. The layer name stays inside the same `<h3>` as a small
 *    label, which keeps it in the document outline — visual demotion is not the
 *    same as deletion.
 *
 * 3. **Access control is shown, not listed.** "Different people get different
 *    doors into the same system" is the section's most valuable idea and was one
 *    of nine equal cards. It is now the island's focal band, paired with the
 *    `AccessDoors` motif, and removed from the grid so nothing is said twice.
 *
 * Accents switch to `SYSTEM_TONE_ON_DARK` here: the paper hues are unreadable
 * against `--surface-dark`.
 *
 * Copy is the deck's, verbatim — same nine layers, business meanings, notes and
 * technology tags.
 */
export function ArchitectureSection() {
  const { eyebrow, h2, lead, flow, layers } = WEB_DEVELOPMENT_ARCHITECTURE;

  /* The access layer is promoted out of the grid into the focal band below, so
     the same explanation never appears twice in one section. */
  const accessLayer = layers.find((layer) => layer.id === "auth");
  const gridLayers = layers.filter((layer) => layer.id !== "auth");

  return (
    <section
      id="architecture"
      className={`${RHYTHM_CHAPTER} dark relative scroll-mt-24 overflow-hidden bg-surface-dark text-surface-dark-foreground`}
    >
      {/* The island's edges, dissolved into the surfaces on either side: the
          capability ladder above sits on `--background-subtle`, the proof gallery
          below on `--background`. */}
      <SectionSeam edge="top" neighbour="subtle" depth="md" />
      <SectionSeam edge="bottom" neighbour="page" depth="md" />

      {/* ATMOSPHERE — cool and anchored top-left, matching the hero's lighting so
          the page is lit from one direction throughout. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(65% 50% at 18% 0%, rgba(130, 143, 255, 0.13), transparent 70%), radial-gradient(55% 45% at 88% 88%, rgba(167, 139, 250, 0.10), transparent 72%)",
        }}
      />
      {/* The page's blueprint grid, in its ink register. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #EEF1F6 1px, transparent 1px), linear-gradient(to bottom, #EEF1F6 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(70% 60% at 50% 0%, black, transparent 78%)",
          WebkitMaskImage: "radial-gradient(70% 60% at 50% 0%, black, transparent 78%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={h2}
            lead={lead}
            register="statement"
            accent="onDark"
            tone="dark"
            measure="max-w-2xl"
          />
        </ScrollReveal>

        {/* ── THE REQUEST PATH ─────────────────────────────────────────────
            One consolidated diagram for the whole section, rather than a
            separate illustration per layer. */}
        <ScrollReveal delay={0.08}>
          <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <p className="mb-6 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-white/60">
              The full request path
            </p>
            <SystemFlow steps={flow} size="section" tone="dark" />
          </div>
        </ScrollReveal>

        {/* ── THE FOCAL IDEA: ONE SYSTEM, DIFFERENT DOORS ──────────────────
            The section's most valuable explanation, given the room it earns. */}
        {accessLayer ? (
          <ScrollReveal delay={0.06}>
            <div className="mt-16 grid gap-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-14">
              <div className="lg:col-span-7">
                {/* The business sentence is the dominant line; the layer's own
                    name stays inside the same heading so "Authentication &
                    Access" is still in the document outline. Visual demotion is
                    not deletion. */}
                <h3>
                  <span className="block text-2xl font-semibold leading-tight tracking-tight text-surface-dark-foreground sm:text-[1.75rem] text-balance">
                    {accessLayer.businessMeaning}
                  </span>
                  <span className={`${TYPE_MICRO} mt-4 block text-accent-cyan`}>
                    {accessLayer.title}
                  </span>
                </h3>
                {accessLayer.note ? (
                  <p className="mt-4 max-w-[54ch] text-sm leading-[1.7] text-white/65 sm:text-base">
                    {accessLayer.note}
                  </p>
                ) : null}
                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {accessLayer.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-white/10 px-2.5 py-1 text-[0.6875rem] font-medium text-white/65"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-5">
                <AccessDoors
                  roles={ACCESS_DOORS}
                  systemLabel="One System"
                  accent={SYSTEM_TONE_ON_DARK.cyan}
                />
              </div>
            </div>
          </ScrollReveal>
        ) : null}

        {/* ── THE REMAINING LAYERS ─────────────────────────────────────────
            Four columns at `lg` so the eight cards form two clean rows rather
            than a three-column grid with a two-card orphan row. */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gridLayers.map((layer, i) => {
            const accentKey = ARCHITECTURE_LAYER_ACCENT[layer.id] ?? "blue";
            const accent = SYSTEM_TONE_ON_DARK[accentKey];

            return (
              <ScrollReveal key={layer.id} delay={(i % 4) * 0.05}>
                <article
                  className="flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.05]"
                  style={{ borderTopColor: alpha(accent, 0.55), borderTopWidth: "2px" }}
                >
                  {/* The business sentence leads; the layer's own name stays in
                      the heading as its small label. */}
                  <h3>
                    <span
                      className="block text-[0.625rem] font-semibold uppercase tracking-[0.14em]"
                      style={{ color: alpha(accent, 0.9) }}
                    >
                      {layer.title}
                    </span>
                    <span className="mt-2.5 block text-sm font-semibold leading-snug tracking-tight text-surface-dark-foreground">
                      {layer.businessMeaning}
                    </span>
                  </h3>

                  {layer.note ? (
                    <p className="mt-2.5 flex-1 text-xs leading-relaxed text-white/60">
                      {layer.note}
                    </p>
                  ) : (
                    <span className="flex-1" />
                  )}

                  <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-white/[0.07] pt-4">
                    {layer.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-white/10 px-2 py-0.5 text-[0.6875rem] font-medium text-white/65"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
