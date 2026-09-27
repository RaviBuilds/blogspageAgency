import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { WEB_DESIGN_PROOF } from "@/lib/web-design-data";
import { TYPE_MICRO } from "@/lib/brand-type";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { SectionSeam } from "@/components/home/section-seam";

import { WebDesignChatTrigger } from "./web-design-chat-trigger";
import { BrowserChrome } from "./visuals/frames";
import { ScopeNote, SectionHeading } from "./visuals/section-shell";

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION 10 — PROOF. The case-study gallery.

   ## What changed and why

   Three equal cards in a `lg:grid-cols-3`, each with a `16/10` screenshot cropped
   to roughly a third of the container. The page's only real evidence was rendered
   at its smallest possible size, and NeoDent's long, specific description was
   squeezed into a third-width column at `text-sm`.

   The rebuild gives each project a full row: the screenshot in a browser window
   across seven columns, the copy across five, alternating sides so the gallery has
   a rhythm. On the page's second dark island, because evidence reads strongest on
   ink and because this is the moment the page stops arguing and shows.

   ## What did NOT change

   The three projects, their titles, categories, descriptions, routes, route labels
   and `VERIFIED FACT` status are the copy deck's, verbatim and in order. No metric
   was added. No testimonial was added. No award, no client logo, no "results" strip.
   The boundary note — that we publish no fabricated awards or invented reviews — is
   verbatim and kept in the section it governs.

   The screenshots are the real owner-supplied project images already in `public/`,
   at their existing paths, uncropped and unrecoloured in a plain browser frame. The
   frame is the only treatment applied, and it is applied identically to all three.
   ──────────────────────────────────────────────────────────────────────────── */

export function ProofSection() {
  const { eyebrow, h2, lead, boundaryNote, projects, ctaLabel } = WEB_DESIGN_PROOF;

  return (
    <section className="dark relative overflow-hidden bg-background py-28 sm:py-32 lg:py-40">
      <SectionSeam edge="top" neighbour="subtle" depth="md" />
      <SectionSeam edge="bottom" neighbour="page" depth="md" />

      {/* Island atmosphere — warmer and wider than the launch island's, so the
          two dark sections are not mistaken for the same surface returning. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 20% 0%, rgba(130, 143, 255, 0.12), transparent 70%), radial-gradient(55% 45% at 90% 85%, rgba(167, 139, 250, 0.10), transparent 72%)",
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

        {/* ── THE GALLERY ──────────────────────────────────────────────── */}
        <div className="mt-20 flex flex-col gap-20 sm:gap-24 lg:gap-28">
          {projects.map((project, index) => {
            const flipped = index % 2 === 1;

            return (
              <ScrollReveal key={project.id}>
                <article className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
                  {/* ── THE WORK ─────────────────────────────────────── */}
                  <div
                    className={`group lg:col-span-7 ${flipped ? "lg:order-2 lg:col-start-6" : ""}`}
                  >
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_50px_100px_-52px_rgb(0_0_0/0.7)] transition-transform duration-500 group-hover:-translate-y-1">
                      <BrowserChrome tone="ink" />
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        <Image
                          src={project.image}
                          alt={`${project.title} — verified project`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 58vw"
                          quality={82}
                          className="object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── THE ACCOUNT ──────────────────────────────────── */}
                  <div
                    className={`lg:col-span-5 ${flipped ? "lg:order-1 lg:col-start-1" : ""}`}
                  >
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className={`${TYPE_MICRO} text-accent-cyan`}>
                        {project.category}
                      </span>
                      {/* The status field from the copy deck, rendered as the
                          quiet provenance marker it is — not as a badge
                          competing with the project name. */}
                      <span className="inline-flex items-center gap-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-white/40">
                        <span
                          aria-hidden
                          className="size-1 rounded-full bg-success"
                        />
                        {project.status}
                      </span>
                    </div>

                    <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-surface-dark-foreground sm:text-3xl text-balance">
                      {project.title}
                    </h3>

                    <p className="mt-5 text-sm leading-[1.75] text-white/55 sm:text-base">
                      {project.description}
                    </p>

                    <Link
                      href={project.route}
                      className="group/link mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs font-semibold text-surface-dark-foreground outline-none transition-colors duration-200 hover:border-accent-cyan/50 hover:bg-white/[0.04] focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      <span>{project.routeLabel}</span>
                      <ArrowUpRight
                        aria-hidden
                        className="size-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                      />
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        {/* ── PROVENANCE + CONVERSION ──────────────────────────────────── */}
        <ScrollReveal delay={0.06}>
          <div className="mt-24 flex flex-col gap-10 border-t border-white/10 pt-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <ScopeNote accent="onDark" className="max-w-2xl">
              {boundaryNote}
            </ScopeNote>
            <div className="shrink-0">
              <WebDesignChatTrigger
                label={ctaLabel}
                variant="outline"
                showSparkle
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
