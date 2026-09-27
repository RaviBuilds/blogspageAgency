import {
  Activity,
  Globe,
  KeyRound,
  Mail,
  ShieldCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { WEB_DESIGN_LAUNCH_FOUNDATION } from "@/lib/web-design-data";
import { TYPE_MICRO } from "@/lib/brand-type";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { SectionSeam } from "@/components/home/section-seam";

import { SectionHeading } from "./visuals/section-shell";

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 7 — DIGITAL LAUNCH & INFRASTRUCTURE (10%, part B). The dark island.

   ## What changed and why

   Six identical light cards, each led by the repeated label "Setup & Deploy",
   reading exactly like infrastructure documentation — which is what the brief
   named as the problem.

   Two moves fix it.

   1. **Surface.** This is the page's first dark island. Infrastructure is the one
      subject on the page that genuinely belongs on a product surface rather than
      on paper, and a tonal switch here also breaks the long light run between the
      hero and the industry gallery. The island is scoped with `dark` exactly the
      way the homepage's Real Work island is, so every token inside resolves to the
      approved dark palette and `SectionSeam` dissolves both boundaries.

   2. **Form.** The five infrastructure items become a rack: a vertical rail with a
      node per unit, mono indices, an icon tile, and a configured-state indicator
      on the right. It reads as a launch console being brought up, in order, rather
      than as six unrelated offers.

   ## Ownership gets its own moment

   `full-ownership` is lifted out of the list into a panel of its own at the foot of
   the island, because "you own all of it" is the section's commercial point and it
   was previously the sixth of six equal cards. The `ownershipNote` — the honest
   caveat that registrars and hosts bill the client directly — sits with it, which
   is where a reader is actually asking the question.

   Copy is untouched: same six titles, same six descriptions, same note, same order.
   ──────────────────────────────────────────────────────────────────────────── */

/** Icon per infrastructure item id. Presentation only; ids own the mapping. */
const ICONS: Record<string, LucideIcon> = {
  "domain-dns": Globe,
  "edge-hosting": Zap,
  "https-ssl": ShieldCheck,
  "business-email": Mail,
  "analytics-baseline": Activity,
  "full-ownership": KeyRound,
};

export function DigitalLaunchFoundationSection() {
  const { eyebrow, h2, lead, items, ownershipNote } = WEB_DESIGN_LAUNCH_FOUNDATION;

  const stack = items.filter((item) => item.id !== "full-ownership");
  const ownership = items.find((item) => item.id === "full-ownership");
  const OwnershipIcon = ownership ? ICONS[ownership.id] : undefined;

  return (
    <section className="dark relative overflow-hidden bg-background py-28 sm:py-32 lg:py-40">
      {/* Seams dissolve both edges of the island into the light sections above
          and below. Decorative, scroll-linked, absent under reduced motion. */}
      <SectionSeam edge="top" neighbour="subtle" depth="md" />
      <SectionSeam edge="bottom" neighbour="page" depth="md" />

      {/* Island atmosphere: one cool wash from the top-right, plus a hairline
          grid at very low opacity — the visual language of a control surface. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(65% 55% at 82% 0%, rgba(103, 232, 249, 0.10), transparent 68%), radial-gradient(50% 45% at 12% 100%, rgba(130, 143, 255, 0.09), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #EEF1F6 1px, transparent 1px), linear-gradient(to bottom, #EEF1F6 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(70% 60% at 50% 40%, black, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(70% 60% at 50% 40%, black, transparent 80%)",
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

        {/* ── THE RACK ─────────────────────────────────────────────────────
            One surface, five units, a rail down the left. The rail is drawn on
            the container so it is continuous across the units rather than
            reconstructed per row. */}
        <ScrollReveal delay={0.08}>
          <div className="relative mt-16 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-[2px]">
            {stack.map((item, index) => {
              const Icon = ICONS[item.id];
              return (
                <article
                  key={item.id}
                  className="group relative flex flex-col gap-4 border-b border-white/[0.07] px-5 py-6 transition-colors duration-300 last:border-b-0 hover:bg-white/[0.03] sm:flex-row sm:items-start sm:gap-7 sm:px-8 sm:py-7"
                >
                  {/* Unit index + rail node. */}
                  <div className="flex shrink-0 items-center gap-4 sm:w-24 sm:flex-col sm:items-start sm:gap-3">
                    <span className="font-mono text-xs text-white/35">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden
                      className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-accent-cyan transition-colors duration-300 group-hover:border-accent-cyan/40"
                    >
                      {Icon ? <Icon className="size-4" /> : null}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold leading-snug tracking-tight text-surface-dark-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-white/55">
                      {item.description}
                    </p>
                  </div>

                  {/* Configured-state indicator: a short dash field, not a tick.
                      A tick would read as a completed purchase; the dashes read
                      as a channel that has been brought up. */}
                  <span
                    aria-hidden
                    className="hidden shrink-0 items-center gap-1 pt-2 lg:flex"
                  >
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className="h-1 w-3 rounded-full bg-accent-cyan/60"
                        style={{ opacity: 1 - i * 0.16 }}
                      />
                    ))}
                  </span>
                </article>
              );
            })}
          </div>
        </ScrollReveal>

        {/* ── OWNERSHIP ────────────────────────────────────────────────── */}
        {ownership ? (
          <ScrollReveal delay={0.06}>
            <div
              className="mt-6 overflow-hidden rounded-2xl border border-accent-cyan/25 p-7 sm:p-10"
              style={{
                background:
                  "linear-gradient(120deg, rgba(103, 232, 249, 0.10) 0%, rgba(130, 143, 255, 0.07) 45%, rgba(255,255,255,0.02) 100%)",
              }}
            >
              <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-10">
                <div className="lg:col-span-7">
                  {/* The item's own title, rendered once, as the panel's heading
                      at micro scale. The emphasis lives in the description below
                      it, set at lead scale, because that sentence is the actual
                      promise. */}
                  <h3
                    className={`${TYPE_MICRO} flex items-center gap-2.5 text-accent-cyan`}
                  >
                    {OwnershipIcon ? (
                      <OwnershipIcon className="size-3.5" aria-hidden />
                    ) : null}
                    {ownership.title}
                  </h3>

                  <p className="mt-5 text-lg leading-[1.6] text-surface-dark-foreground sm:text-xl sm:leading-[1.55]">
                    {ownership.description}
                  </p>
                </div>

                <div className="mt-7 lg:col-span-5 lg:mt-0">
                  <p className="border-l-2 border-white/15 pl-5 text-sm leading-relaxed text-white/50">
                    {ownershipNote}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ) : null}
      </div>
    </section>
  );
}
