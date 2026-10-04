import { ScrollReveal } from "@/components/home/scroll-reveal";
import { cn } from "@/lib/utils";

import { GROW_TITLE, LIFECYCLE_TITLE } from "../gym-landing-headings";

import { ConceptArtefacts } from "./concept-artefacts";
import { ECOSYSTEM_ID, GROWTH_STEPS, LIFECYCLE_ID } from "./content";
import { InView } from "./in-view";
import { ActLabel, GymSection, SectionHeader, StatusBadge } from "./primitives";
import { LifecycleRail } from "./lifecycle-rail";

type HeadingId = (text: string) => string | undefined;

const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as React.CSSProperties;

/* -------------------------------------------------------------------------- */
/* 09 — The system can grow with you                                          */
/* -------------------------------------------------------------------------- */

/** Staircase offsets: each later module sits a step higher (desktop). */
const RISE = ["lg:mt-48", "lg:mt-36", "lg:mt-24", "lg:mt-12", "lg:mt-0"];

export function GrowSection({ hid }: { hid: HeadingId }) {
  return (
    <GymSection id={ECOSYSTEM_ID} chapter="grow" rhythm="movement" surface="system">
      <ActLabel act="Act V" title="The system" />
      <SectionHeader
        index="09"
        eyebrow="The broader system"
        title={GROW_TITLE}
        headingId={hid(GROW_TITLE)}
        lead="The website and digital presence are the foundation. When it makes sense for your gym, the same system can extend into member experience, operations and owner intelligence."
        align="split"
      />

      <InView className="relative mt-16 lg:mt-20" threshold={0.25}>
        <p className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl lg:absolute lg:left-0 lg:top-0 lg:max-w-sm">
          You don&apos;t have to implement everything on day one.
        </p>

        <ol className="relative mt-10 grid gap-3 lg:mt-0 lg:grid-cols-5 lg:items-start">
          {/* day one | later divider */}
          <span aria-hidden className="absolute -bottom-4 top-0 left-[40%] hidden border-l border-dashed border-white/25 lg:block" />
          <span aria-hidden className="absolute -bottom-10 left-[40%] hidden -translate-x-[calc(100%+0.75rem)] font-mono text-[0.625rem] uppercase tracking-[0.2em] text-primary lg:block">
            Day one
          </span>
          <span aria-hidden className="absolute -bottom-10 left-[40%] hidden translate-x-3 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-foreground/45 lg:block">
            When you&apos;re ready
          </span>

          {GROWTH_STEPS.map((step, i) => {
            const now = step.status !== "concept";
            return (
              <li
                key={step.phase}
                className={cn(
                  "gym-rise relative flex flex-col rounded-2xl border p-5",
                  RISE[i],
                  now ? "border-primary/45 bg-[#121530]" : "border-dashed border-white/20 bg-[#0b0e14]",
                )}
                style={d(i * 150)}
              >
                <div className="flex flex-col items-start gap-2.5">
                  <span className={cn("whitespace-nowrap font-mono text-[0.6875rem] uppercase tracking-[0.2em]", now ? "text-primary" : "text-foreground/50")}>
                    {String(i + 1).padStart(2, "0")} · {step.phase}
                  </span>
                  {i === 0 ? (
                    <span className="whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-black">
                      Start here
                    </span>
                  ) : !now ? (
                    <StatusBadge status="concept" />
                  ) : null}
                </div>
                <p className="mt-4 text-lg font-semibold leading-tight tracking-tight">{step.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
                {/* stair riser */}
                <span aria-hidden className={cn("gym-grow-y absolute -bottom-px left-0 right-0 hidden h-px lg:block", now ? "bg-primary/40" : "bg-white/10")} />
              </li>
            );
          })}
        </ol>
      </InView>

      <div className="mt-24 lg:mt-28">
        <ConceptArtefacts />
      </div>

      <ScrollReveal className="mt-8">
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          These are concept previews of the broader BLOGSPAGE AI direction, shown to illustrate where a connected system can go.
          Each one is discussed and scoped separately from the starting website.
        </p>
      </ScrollReveal>
    </GymSection>
  );
}

/* -------------------------------------------------------------------------- */
/* 10 — One member, one journey                                               */
/* -------------------------------------------------------------------------- */

export function LifecycleSection({ hid }: { hid: HeadingId }) {
  return (
    <GymSection id={LIFECYCLE_ID} chapter="lifecycle" rhythm="chapter">
      <SectionHeader
        index="10"
        eyebrow="The whole picture"
        title={LIFECYCLE_TITLE}
        headingId={hid(LIFECYCLE_TITLE)}
        size="statement"
        align="center"
        lead="Website, member experience, operations and owner intelligence are not four separate products. They are different parts of the same member lifecycle."
      />
      <ScrollReveal className="mt-16 lg:mt-20">
        <LifecycleRail />
      </ScrollReveal>
    </GymSection>
  );
}
