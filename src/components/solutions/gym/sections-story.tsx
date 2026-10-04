import { MessageCircle, Search } from "lucide-react";

import { ScrollReveal } from "@/components/home/scroll-reveal";
import { cn } from "@/lib/utils";

import { CHANNELS_TITLE, DISCOVERY_TITLE, QUESTIONS_TITLE } from "../gym-landing-headings";

import { ChannelsDiagram } from "./channels-diagram";
import { BARE_ENQUIRY, DISCOVERY_LEAD, NEW_WAY, OLD_WAY, THEMES } from "./content";
import { DiscoveryJourney } from "./discovery-journey";
import { InView } from "./in-view";
import { ActLabel, GymSection, SectionHeader } from "./primitives";
import { Bubble } from "./visuals";

type HeadingId = (text: string) => string | undefined;

const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as React.CSSProperties;

/* -------------------------------------------------------------------------- */
/* 02 — Before they walk in: one person's research journey                    */
/* -------------------------------------------------------------------------- */

export function DiscoverySection({ hid }: { hid: HeadingId }) {
  return (
    <GymSection id="before-they-walk-in" chapter="discover" rhythm="movement">
      <ActLabel act="Act I" title="The visitor" />
      <SectionHeader index="02" eyebrow="Before they walk in" title={DISCOVERY_TITLE} headingId={hid(DISCOVERY_TITLE)} />

      {/* then vs now, as type */}
      <InView className="mt-14 grid gap-8 border-y border-white/[0.07] py-10 lg:mt-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-end lg:gap-16">
        <div className="gym-rise">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-foreground/45">It used to go like this</p>
          <p className="mt-3 text-xl text-foreground/40 line-through decoration-white/30 decoration-1 sm:text-2xl">{OLD_WAY}</p>
        </div>
        <div>
          <p className="gym-rise font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-primary" style={d(120)}>
            Now
          </p>
          <p className="mt-3 text-[clamp(2.25rem,5.4vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.02em]">
            {NEW_WAY.map((word, i) => (
              <span key={word} className="gym-rise mr-[0.25em] inline-block" style={d(200 + i * 110)}>
                {word}
              </span>
            ))}
          </p>
          <p className="gym-rise mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg" style={d(700)}>
            {DISCOVERY_LEAD}
          </p>
        </div>
      </InView>

      <div className="mt-16 lg:mt-20">
        <DiscoveryJourney />
      </div>
    </GymSection>
  );
}

/* -------------------------------------------------------------------------- */
/* 03 — The questions inside the visitor's head                               */
/* -------------------------------------------------------------------------- */

const CLUSTER_LAYOUT: Record<(typeof THEMES)[number]["key"], string> = {
  fit: "lg:col-span-7",
  trust: "lg:col-span-5 lg:pt-24",
  practical: "lg:col-span-5 lg:pt-4",
  start: "lg:col-span-7 lg:-mt-8",
};

export function QuestionsSection({ hid }: { hid: HeadingId }) {
  return (
    <GymSection id="questions-before-the-visit" chapter="discover" rhythm="section">
      <SectionHeader
        index="03"
        eyebrow="Before the visit"
        title={QUESTIONS_TITLE}
        headingId={hid(QUESTIONS_TITLE)}
        lead="Before someone contacts a gym, they are usually trying to answer the same handful of things."
        align="split"
      />

      <InView className="mt-16 grid gap-x-12 gap-y-14 lg:mt-24 lg:grid-cols-12" threshold={0.15}>
        {THEMES.map((theme, ti) => (
          <div key={theme.key} className={cn("gym-rise", CLUSTER_LAYOUT[theme.key])} style={d(ti * 140)}>
            <p className="flex items-center gap-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-foreground/50">
              <span aria-hidden className="size-1.5 rounded-full bg-primary" />
              {theme.label}
            </p>
            <ul className={cn("mt-5", theme.key === "practical" ? "flex flex-wrap gap-2.5" : "space-y-3")}>
              {theme.questions.map((q) => {
                if (q.weight === "query") {
                  return (
                    <li
                      key={q.text}
                      className="flex min-h-11 items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-sm text-foreground/70"
                    >
                      <Search aria-hidden className="size-3.5 text-foreground/45" />
                      {q.text.toLowerCase().replace("?", "")}
                    </li>
                  );
                }
                if (theme.key === "start" && q.weight === "md") {
                  return (
                    <li key={q.text} className="flex">
                      <span className="rounded-2xl rounded-tl-sm border border-white/10 bg-[#161a22] px-4 py-2.5 text-base text-foreground/80">
                        {q.text}
                      </span>
                    </li>
                  );
                }
                return (
                  <li
                    key={q.text}
                    className={cn(
                      "tracking-tight text-balance",
                      q.weight === "xl" && "text-[clamp(1.875rem,3.4vw,3rem)] font-semibold leading-[1.05] text-foreground",
                      q.weight === "lg" && "text-2xl font-medium leading-tight text-foreground/90 sm:text-3xl",
                      q.weight === "md" && "text-lg text-foreground/60 sm:text-xl",
                    )}
                  >
                    {q.weight === "xl" ? <span aria-hidden className="mr-1 text-primary/70">&ldquo;</span> : null}
                    {q.text}
                    {q.weight === "xl" ? <span aria-hidden className="text-primary/70">&rdquo;</span> : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </InView>

      {/* the punchline */}
      <ScrollReveal className="mt-24 lg:mt-32">
        <div className="grid items-center gap-8 rounded-3xl border border-white/[0.07] bg-[#0a0b0e] p-6 sm:p-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:gap-14 lg:p-12">
          <p className="text-2xl font-medium leading-snug tracking-tight text-balance sm:text-3xl">
            When those answers are hard to find, the conversation often starts like this:
          </p>
          <div>
            <div aria-hidden className="flex flex-col rounded-2xl bg-[#0b141a] p-4">
              <p className="mb-3 flex items-center gap-1.5 text-[0.6875rem] text-[#8696a0]">
                <MessageCircle className="size-3.5 text-[#25d366]" /> New message
              </p>
              <Bubble from="member" className="text-base">
                {BARE_ENQUIRY}
              </Bubble>
            </div>
            <p className="sr-only">An enquiry that reads: {BARE_ENQUIRY}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              No goal, no program, no idea where to start. Your team begins every conversation from zero.
            </p>
          </div>
        </div>
      </ScrollReveal>
    </GymSection>
  );
}

/* -------------------------------------------------------------------------- */
/* 04 — Google, Instagram & website: one system                               */
/* -------------------------------------------------------------------------- */

export function ChannelsSection({ hid }: { hid: HeadingId }) {
  return (
    <GymSection id="google-instagram-website" chapter="discover" rhythm="section" surface="system">
      <SectionHeader
        index="04"
        eyebrow="Google, Instagram & website"
        title={CHANNELS_TITLE}
        headingId={hid(CHANNELS_TITLE)}
        lead="The website does not replace Instagram or Google. It connects what each of them starts into one place."
        align="split"
      />
      <div className="mt-20 lg:mt-28">
        <ChannelsDiagram />
      </div>
    </GymSection>
  );
}
