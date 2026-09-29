import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import { WEB_DEVELOPMENT_PROOF } from "@/lib/web-development-data";
import { PROOF_ACCENT, PROOF_MOTIF, alpha } from "@/lib/web-development-visual-system";
import { ACCESS_DOORS, LIFECYCLE_STATES } from "@/lib/web-development-plain-language";
import { TYPE_MICRO } from "@/lib/brand-type";
import { SectionHeading, ScopeNote } from "@/components/services/web-design/visuals/section-shell";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { RHYTHM_CHAPTER } from "@/lib/section-rhythm";

import { AccessDoors } from "./visuals/access-doors";
import { StateChain } from "./visuals/state-chain";
import { AppWindow } from "./visuals/system-frames";

/**
 * Phixl AI's generation pipeline.
 *
 * Kept here rather than in the plain-language module because it is this one
 * project's own sequence, not a page-wide vocabulary item — and because the copy
 * deck's `systemCapability` for the project states exactly this order
 * ("Upload → AI processing → restored result workflow", then the credit system
 * and payment integration). Nothing is added to it.
 */
const AI_PIPELINE_STEPS = [
  { id: "upload", label: "Upload" },
  { id: "processing", label: "AI Processing" },
  { id: "result", label: "Result" },
  { id: "credits", label: "Credits & Payment" },
] as const;

/**
 * Per-project architecture fragment: each build "lights up" a different motif
 * from the same system vocabulary used elsewhere on the page, so the proof
 * section visibly reuses the page's grammar rather than becoming a
 * screenshots-only gallery (canonical spec §11).
 */
function ProjectMotif({ projectId, accent }: { projectId: string; accent: string }) {
  const motif = PROOF_MOTIF[projectId];

  if (motif === "roles") {
    return <AccessDoors roles={ACCESS_DOORS} systemLabel="ArogyaDiet" accent={accent} />;
  }
  if (motif === "booking-lifecycle") {
    return <StateChain states={LIFECYCLE_STATES} accent={accent} />;
  }
  if (motif === "ai-pipeline") {
    return <StateChain states={AI_PIPELINE_STEPS} accent={accent} />;
  }
  return null;
}

/**
 * SECTION 05 — SYSTEMS WE'VE BUILT (Proof of Capability).
 *
 * ## What the final pass changed
 *
 * Each project was a bordered two-column card, so the page's only real evidence
 * rendered inside a container inside a container, and the screenshot took roughly
 * a third of the page width.
 *
 * It is now a full-row gallery: the screenshot across seven columns inside an
 * application window, the account across five, alternating sides — the same
 * rhythm the Web Design proof gallery uses, so the two pages' evidence sections
 * are recognisably siblings. The card border is gone: the work is the object, and
 * a frame around a frame was the reason it read small.
 *
 * The frame is `AppWindow`, not Web Design's `BrowserChrome`: these are
 * signed-in systems with roles and dashboards, and dressing them as a public web
 * page would say the wrong thing about what they are.
 *
 * `Image` now declares `fill` + `sizes` against a fixed aspect box. Previously it
 * shipped intrinsic `width`/`height` with no `sizes`, so every viewport
 * downloaded a candidate sized for the widest one.
 *
 * ## What did NOT change
 *
 * The three projects, their order, names, primary capabilities, problems, system
 * capability lists, technology tags, routes and route labels are the copy deck's,
 * verbatim. No metric, no result, no user count, no testimonial was added — and
 * the boundary note that says so is unchanged and still sits in the section it
 * governs.
 */
export function ProofSection() {
  const { eyebrow, h2, lead, boundaryNote, projects } = WEB_DEVELOPMENT_PROOF;

  return (
    <section id="proof" className={`${RHYTHM_CHAPTER} scroll-mt-24 bg-background`}>
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={h2}
            lead={lead}
            register="statement"
            accent="blue"
            measure="max-w-2xl"
          />
        </ScrollReveal>

        <div className="mt-20 flex flex-col gap-20 sm:gap-24 lg:gap-28">
          {projects.map((project, i) => {
            const accent = PROOF_ACCENT[project.id] ?? "#4353C9";
            const flipped = i % 2 === 1;

            return (
              <ScrollReveal key={project.id}>
                <article className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
                  {/* ── THE SYSTEM ───────────────────────────────────────── */}
                  <div
                    className={`group lg:col-span-7 ${flipped ? "lg:order-2 lg:col-start-6" : ""}`}
                  >
                    <AppWindow
                      accent={accent}
                      elevation="hero"
                      className="transition-transform duration-500 group-hover:-translate-y-1"
                    >
                      <div className="relative aspect-[16/11] w-full overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.imageAlt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 58vw"
                          quality={82}
                          className="object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                        />
                      </div>
                    </AppWindow>

                    {/* The architecture fragment sits directly under the system
                        it belongs to, on the page's own surface rather than in a
                        third nested card. */}
                    <div className="mt-6 border-t border-border-subtle pt-5">
                      <p className={`${TYPE_MICRO} text-text-disabled`}>
                        Architecture in this build
                      </p>
                      <div className="mt-4">
                        <ProjectMotif projectId={project.id} accent={accent} />
                      </div>
                    </div>
                  </div>

                  {/* ── THE ACCOUNT ──────────────────────────────────────── */}
                  <div
                    className={`lg:col-span-5 ${flipped ? "lg:order-1 lg:col-start-1" : ""}`}
                  >
                    <span
                      className="inline-flex items-center rounded-full border px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em]"
                      style={{
                        borderColor: alpha(accent, 0.3),
                        backgroundColor: alpha(accent, 0.06),
                        color: accent,
                      }}
                    >
                      {project.label}
                    </span>

                    <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-tighter text-foreground sm:text-3xl text-balance">
                      {project.name}
                    </h3>
                    <p className="mt-2.5 text-base font-medium leading-snug tracking-tight text-foreground/70 sm:text-lg">
                      {project.primaryCapability}
                    </p>

                    <p className="mt-5 max-w-[52ch] text-sm leading-[1.75] text-muted-foreground">
                      {project.problem}
                    </p>

                    <ul className="mt-6 flex flex-col divide-y divide-border-subtle border-y border-border-subtle">
                      {project.systemCapability.map((capability) => (
                        <li
                          key={capability}
                          className="flex items-start gap-2.5 py-2.5 text-sm leading-snug text-foreground/80"
                        >
                          <span
                            aria-hidden
                            className="mt-[0.45rem] size-1 shrink-0 rounded-full"
                            style={{ backgroundColor: accent }}
                          />
                          <span>{capability}</span>
                        </li>
                      ))}
                    </ul>

                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {project.tech.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-full border border-border-subtle px-2.5 py-1 text-[0.6875rem] font-medium text-text-subtle"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                      {project.route ? (
                        <Link
                          href={project.route}
                          className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-foreground"
                        >
                          {project.routeLabel}
                          <ArrowRight
                            aria-hidden
                            className="size-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5"
                          />
                        </Link>
                      ) : null}
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {project.liveLabel}
                          <ExternalLink aria-hidden className="size-3.5" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.06}>
          <ScopeNote className="mt-20 max-w-3xl" accent="ink">
            {boundaryNote}
          </ScopeNote>
        </ScrollReveal>
      </div>
    </section>
  );
}
