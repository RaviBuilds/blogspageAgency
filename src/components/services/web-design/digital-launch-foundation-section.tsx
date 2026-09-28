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
import { LAUNCH_PLAIN } from "@/lib/web-design-plain-language";
import { PILLAR_TONE_ISLAND } from "@/lib/web-design-visual-system";
import { TYPE_MICRO } from "@/lib/brand-type";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { SectionSeam } from "@/components/home/section-seam";

import { ExplainerChain } from "./visuals/explainer-chain";
import { SectionHeading } from "./visuals/section-shell";

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 7 — DIGITAL LAUNCH & INFRASTRUCTURE (10%, part B). The dark island.

   ## What changed and why

   Six identical light cards, each led by the repeated label "Setup & Deploy",
   reading exactly like infrastructure documentation — which is what the brief
   named as the problem.

   Two moves fixed the form.

   1. **Surface.** This is the page's first dark island. Infrastructure is the one
      subject on the page that genuinely belongs on a product surface rather than
      on paper, and a tonal switch here also breaks the long light run between the
      hero and the industry gallery. The island is scoped with `dark` exactly the
      way the homepage's Real Work island is, so every token inside resolves to the
      approved dark palette and `SectionSeam` dissolves both boundaries.

   2. **Form.** The six infrastructure items become a rack: a rail with a node per
      unit, mono indices and an icon tile. It reads as a launch console being
      brought up, in order, rather than as six unrelated offers.

   ## FINAL PASS — the island now explains itself

   The form was right and the language was still ours. This section legitimately
   says "DNS record propagation (A, CNAME, TXT)" and "MX, SPF, DKIM, DMARC", and a
   hotel owner reading it has no way to know that the subject of the first sentence
   is their own address. A dark cinematic surface makes unexplained jargon *more*
   intimidating, not less.

   Every unit now leads with the plain-language name from
   `web-design-plain-language.ts` — your address on the internet, where your
   website lives, a secure connection, professional business communication,
   understanding what customers do, your business keeps control — with the deck's
   approved title kept inside the same `<h3>` beneath it so the outline and the
   search phrases are unchanged. One ordinary sentence follows, then the deck's own
   description, unchanged.

   Five of the six also draw the relationship the term describes, because a
   definition of "hosting" is still abstract until you can see where it sits:

       your business  →  yourbusiness.com  →  your website
       your website   →  fast, reliable infrastructure  →  your customer
       your customer  →  secure connection  →  your website

   ## What the dashes used to be, and why they are gone

   Each row carried a five-dash "configured state" indicator on the right. It was
   decoration standing in for a state nothing on the page reports, and with a real
   explanatory chain now occupying that space it was competing with the one thing
   in the row that carries meaning. Removed rather than restyled.

   ## Ownership gets its own moment

   `full-ownership` is lifted out of the rack into a panel of its own at the foot of
   the island, because "you own all of it" is the section's commercial point and it
   was previously the sixth of six equal cards. The `ownershipNote` — the honest
   caveat that registrars and hosts bill the client directly — sits with it, which
   is where a reader is actually asking the question.

   Deck copy is untouched throughout: same six titles, same six descriptions, same
   note, same order.
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

/* The island's accent. `PILLAR_TONE_ISLAND` is the lifted set — the light-scope
   cyan (#0E7490) measures far too dark against `--surface-dark` to draw a
   connector line with. */
const CYAN = PILLAR_TONE_ISLAND.cyan;

export function DigitalLaunchFoundationSection() {
  const { eyebrow, h2, lead, items, ownershipNote } = WEB_DESIGN_LAUNCH_FOUNDATION;

  const stack = items.filter((item) => item.id !== "full-ownership");
  const ownership = items.find((item) => item.id === "full-ownership");
  const OwnershipIcon = ownership ? ICONS[ownership.id] : undefined;
  const ownershipPlain = ownership ? LAUNCH_PLAIN[ownership.id] : undefined;

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
          {/* `section` register, not `statement`.

              This is the 10% pillar. It was rendering its heading at the same
              raised voice as the 70% pillar and the proof gallery, which made the
              page's typographic hierarchy contradict the framework it spends a
              whole section establishing. The dark island already gives this
              section all the presence it needs; the heading does not also have to
              shout. Six `statement` headings on eleven sections is also no
              longer a signal — see the note in `brand-type.ts` on why a tier
              applied to half the page stops meaning anything. */}
          <SectionHeading
            eyebrow={eyebrow}
            title={h2}
            lead={lead}
            register="section"
            accent="onDark"
            tone="dark"
            measure="max-w-2xl"
          />
        </ScrollReveal>

        {/* ── THE RACK ─────────────────────────────────────────────────────
            One surface, five units, a rail down the left. */}
        <ScrollReveal delay={0.08}>
          <div className="relative mt-16 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-[2px]">
            {stack.map((item, index) => {
              const Icon = ICONS[item.id];
              const plain = LAUNCH_PLAIN[item.id];

              return (
                <article
                  key={item.id}
                  className="group relative flex flex-col gap-4 border-b border-white/[0.07] px-5 py-7 transition-colors duration-300 last:border-b-0 hover:bg-white/[0.03] sm:flex-row sm:items-start sm:gap-7 sm:px-8 sm:py-8"
                >
                  {/* Unit index + rail node. */}
                  <div className="flex shrink-0 items-center gap-4 sm:w-20 sm:flex-col sm:items-start sm:gap-3">
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
                    {/* DUAL-LAYER HEADING. The plain-language name is what a
                        visitor reads; the deck's approved title stays inside the
                        heading element beneath it. */}
                    <h3>
                      <span className="block text-xl font-semibold leading-snug tracking-tight text-surface-dark-foreground sm:text-2xl">
                        {plain?.plain ?? item.title}
                      </span>
                      {plain ? (
                        <span
                          className={`${TYPE_MICRO} mt-2.5 block text-white/35`}
                        >
                          {item.title}
                        </span>
                      ) : null}
                    </h3>

                    {plain?.detail ? (
                      <p className="mt-4 max-w-[62ch] text-sm leading-[1.7] text-white/70 sm:text-base">
                        {plain.detail}
                      </p>
                    ) : null}

                    <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-white/45">
                      {item.description}
                    </p>

                    {/* THE RELATIONSHIP. Where the term describes a position in
                        a chain, the chain is drawn — which is the difference
                        between defining a word and explaining it. */}
                    {plain?.chain ? (
                      <ExplainerChain
                        steps={plain.chain}
                        accent={CYAN}
                        tone="dark"
                        className="mt-6"
                      />
                    ) : null}
                  </div>
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
                  {/* The plain-language promise at display-adjacent scale, with
                      the deck's own title as the micro label above it. The
                      emphasis order is inverted from the rack rows on purpose:
                      this panel exists because the promise is the point, and
                      "Total Ownership & No Lock-In" is already plain enough to
                      work as a marker. */}
                  <h3>
                    <span
                      className={`${TYPE_MICRO} flex items-center gap-2.5 text-accent-cyan`}
                    >
                      {OwnershipIcon ? (
                        <OwnershipIcon className="size-3.5" aria-hidden />
                      ) : null}
                      {ownership.title}
                    </span>
                    <span className="mt-5 block text-2xl font-semibold leading-tight tracking-tighter text-surface-dark-foreground sm:text-3xl text-balance">
                      {ownershipPlain?.plain ?? ownership.title}
                    </span>
                  </h3>

                  <p className="mt-5 text-lg leading-[1.6] text-white/70 sm:text-xl sm:leading-[1.55]">
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
