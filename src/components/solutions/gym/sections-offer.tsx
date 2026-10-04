import { ArrowRight, Bot, MessageCircle, UserRound } from "lucide-react";

import { ScrollReveal } from "@/components/home/scroll-reveal";
import { cn } from "@/lib/utils";

import { AI_LAYER_TITLE, BUILD_TITLE, ENQUIRY_TITLE, GUIDANCE_TITLE, WEBSITE_TITLE } from "../gym-landing-headings";

import { AnnotatedWebsite } from "./annotated-website";
import {
  AI_JOBS,
  AI_ROUTE,
  BARE_ENQUIRY,
  ENQUIRY_CONTEXT,
  EXAMPLE_ENQUIRY,
  EXAMPLE_REPLY,
  HANDOFF,
  PLANNER_ANCHOR,
} from "./content";
import { FoundationStack } from "./foundation-stack";
import { InView } from "./in-view";
import { MemberToolsDemo } from "./member-tools-demo";
import { ActLabel, GymSection, Kicker, SectionHeader, StatusBadge } from "./primitives";
import { Bubble, WhatsAppHeader } from "./visuals";
import { WhatsAppCta } from "./whatsapp-cta";

type HeadingId = (text: string) => string | undefined;

const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as React.CSSProperties;

/* -------------------------------------------------------------------------- */
/* 05 — Website anatomy                                                       */
/* -------------------------------------------------------------------------- */

export function WebsiteSection({ hid }: { hid: HeadingId }) {
  return (
    <GymSection id="a-website-built-to-answer" chapter="explore" rhythm="movement" surface="blueprint" width="max-w-7xl">
      <div className="mx-auto max-w-6xl">
        <ActLabel act="Act II" title="The website" />
        <SectionHeader
          index="05"
          eyebrow="A website built to answer"
          title={WEBSITE_TITLE}
          headingId={hid(WEBSITE_TITLE)}
          lead="A strategic gym website is more than a logo, an about page, some photos and a phone number. Each section exists to answer one question a visitor is already asking."
          align="split"
        />
      </div>
      <ScrollReveal className="mt-16 lg:mt-20">
        <AnnotatedWebsite />
      </ScrollReveal>
    </GymSection>
  );
}

/* -------------------------------------------------------------------------- */
/* 06 — From information to guidance: the product stage                       */
/* -------------------------------------------------------------------------- */

export function GuidanceSection({ hid }: { hid: HeadingId }) {
  return (
    <GymSection id="member-tools" chapter="explore" rhythm="movement" surface="stage" width="max-w-7xl">
      <SectionHeader
        index="06"
        eyebrow="From information to guidance"
        title={GUIDANCE_TITLE}
        headingId={hid(GUIDANCE_TITLE)}
        size="statement"
        align="center"
        aside={<StatusBadge status="demo" />}
        lead="Three interactive tools turn a page of information into a conversation that helps a first-timer decide where to begin. Try them: this is the experience your visitors get."
        className="max-w-4xl"
      />

      <span id={PLANNER_ANCHOR} className="block scroll-mt-24" aria-hidden />
      <ScrollReveal className="mt-14 lg:mt-16">
        <MemberToolsDemo />
      </ScrollReveal>

      <ScrollReveal className="mx-auto mt-14 flex max-w-3xl flex-col items-center gap-5 text-center">
        <p className="text-xl font-medium tracking-tight text-foreground/90 sm:text-2xl">
          Want tools like these on your own gym&apos;s website?
        </p>
        <WhatsAppCta location="after-tools" tone="accent">
          Show Me What This Could Look Like
        </WhatsAppCta>
      </ScrollReveal>
    </GymSection>
  );
}

/* -------------------------------------------------------------------------- */
/* 07 — The handoff: a prepared conversation                                  */
/* -------------------------------------------------------------------------- */

export function EnquirySection({ hid }: { hid: HeadingId }) {
  return (
    <GymSection id="the-prepared-enquiry" chapter="enquire" rhythm="movement" surface="whatsapp">
      <ActLabel act="Act III" title="The handoff" />
      <SectionHeader index="07" eyebrow="The prepared enquiry" title={ENQUIRY_TITLE} headingId={hid(ENQUIRY_TITLE)} size="statement" className="max-w-4xl" />

      <InView className="mt-16 grid items-center gap-12 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16" threshold={0.3}>
        {/* the conversation */}
        <div>
          <Kicker className="text-[#8696a0]">Illustrative example</Kicker>
          <div aria-hidden className="mt-3 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0b141a] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.95)]">
            <WhatsAppHeader title="Gym team" subtitle="WhatsApp · Example gym" />
            <div className="relative flex min-h-[19rem] flex-col justify-end gap-3 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.03),transparent_60%)] p-4 sm:p-6">
              <span className="self-center rounded-md bg-[#182229] px-2.5 py-1 text-[0.6875rem] text-[#8696a0]">Today</span>
              <span className="gym-typing absolute bottom-6 right-6 flex gap-1 rounded-xl bg-[#005c4b] px-3.5 py-3" style={d(0)}>
                {[0, 1, 2].map((n) => (
                  <span key={n} className="size-1.5 rounded-full bg-white/70" />
                ))}
              </span>
              <Bubble from="member" className="gym-pop text-[0.9375rem] sm:text-base" style={d(850)}>
                {EXAMPLE_ENQUIRY}
              </Bubble>
              <Bubble from="team" className="gym-pop text-[0.9375rem] sm:text-base" style={d(1700)}>
                {EXAMPLE_REPLY}
              </Bubble>
            </div>
          </div>
          <p className="sr-only">
            Example enquiry: {EXAMPLE_ENQUIRY} The gym team replies: {EXAMPLE_REPLY}
          </p>
        </div>

        {/* what the team knows */}
        <div className="relative lg:pl-10">
          <span aria-hidden className="absolute left-0 top-6 hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-[#25d366]/60 via-white/15 to-transparent lg:block" />
          <p className="gym-rise text-sm font-medium uppercase tracking-[0.16em] text-[#7ee2a8]" style={d(1200)}>
            What your team knows before replying
          </p>
          <dl className="mt-6 space-y-2.5">
            {ENQUIRY_CONTEXT.map((c, i) => (
              <div
                key={c.label}
                className="gym-rise flex items-baseline gap-4 rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-3.5"
                style={d(1300 + i * 120)}
              >
                <dt className="w-24 shrink-0 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-foreground/50">{c.label}</dt>
                <dd className="text-lg font-medium tracking-tight">{c.value}</dd>
              </div>
            ))}
          </dl>
          <p className="gym-rise mt-8 text-lg tracking-tight text-foreground/80" style={d(1900)}>
            Not <span className="text-foreground/45 line-through decoration-white/40">&ldquo;{BARE_ENQUIRY}&rdquo;</span>
          </p>
          <p className="gym-rise mt-2 text-sm leading-relaxed text-muted-foreground" style={d(1950)}>
            The team starts with the visitor&apos;s goal, their experience level and the program they looked at, not a bare
            price question.
          </p>
        </div>
      </InView>

      {/* the handoff strip */}
      <InView className="mt-20 lg:mt-24" threshold={0.4}>
        <ol className="relative grid gap-6 md:grid-cols-4 md:gap-4">
          <span aria-hidden className="gym-grow-x absolute left-[12.5%] right-[12.5%] top-5 hidden h-px bg-gradient-to-r from-primary/60 via-[#25d366]/60 to-white/80 md:block" />
          {HANDOFF.map((step, i) => {
            const last = i === HANDOFF.length - 1;
            return (
              <li key={step.title} className="gym-rise relative flex gap-4 md:flex-col md:items-center md:text-center" style={d(i * 150)}>
                <span
                  className={cn(
                    "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border font-mono text-xs",
                    last ? "border-white bg-white text-black" : "border-[#25d366]/40 bg-[#0a1115] text-[#7ee2a8]",
                  )}
                >
                  {last ? <UserRound className="size-4" /> : String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-lg font-semibold tracking-tight">{step.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground md:mx-auto md:max-w-[14rem]">{step.text}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </InView>

      {/* where AI fits: an add-on that covers gaps and hands over */}
      <ScrollReveal className="mt-20 lg:mt-24">
        <div className="rounded-3xl border border-dashed border-amber-200/20 bg-[#0d1114] p-6 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-amber-200/10 text-amber-200">
                  <Bot className="size-[1.125rem]" />
                </span>
                <StatusBadge status="add-on" />
              </div>
              <h3 id={hid(AI_LAYER_TITLE)} className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                {AI_LAYER_TITLE}
              </h3>
              <p className="mt-4 text-muted-foreground">
                AI assists your team. It does not stand in for them. People join because of the people at your gym, so the
                handover to a human is always the point.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-foreground/85">
                {AI_JOBS.map((job) => (
                  <li key={job} className="flex gap-3">
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-amber-200" />
                    {job}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-muted-foreground">AI-assisted enquiry handling is scoped separately from the starting website.</p>
            </div>

            {/* routing diagram */}
            <div>
              <p className="sr-only">
                How an AI assistant would route an enquiry: a common question asked out of hours is answered, context is
                captured, and the conversation is handed to a person on your team.
              </p>
              <InView aria-hidden className="relative" threshold={0.4}>
                <span className="gym-grow-y absolute bottom-8 left-5 top-8 w-px bg-gradient-to-b from-amber-200/40 via-white/20 to-white/80" />
                <ol className="space-y-3">
                  {AI_ROUTE.map((step, i) => {
                    const last = i === AI_ROUTE.length - 1;
                    return (
                      <li key={step.title} className="gym-rise relative flex items-center gap-4" style={d(i * 160)}>
                        <span
                          className={cn(
                            "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border",
                            last ? "border-white bg-white text-black" : "border-amber-200/30 bg-[#161a1d] text-amber-200/90",
                          )}
                        >
                          {last ? <UserRound className="size-4" /> : i === 0 ? <MessageCircle className="size-4" /> : <Bot className="size-4" />}
                        </span>
                        <span
                          className={cn(
                            "flex flex-1 items-center justify-between gap-3 rounded-2xl border px-4 py-3",
                            last ? "border-white/30 bg-white/[0.06]" : "border-white/[0.08] bg-white/[0.02]",
                          )}
                        >
                          <span className="font-medium">{step.title}</span>
                          <span className="text-right text-sm text-muted-foreground">{step.text}</span>
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </InView>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </GymSection>
  );
}

/* -------------------------------------------------------------------------- */
/* 08 — What we build: the digital foundation                                 */
/* -------------------------------------------------------------------------- */

export function BuildSection({ hid }: { hid: HeadingId }) {
  return (
    <GymSection id="what-we-build" chapter="foundation" rhythm="movement">
      <ActLabel act="Act IV" title="The foundation" />
      <SectionHeader
        index="08"
        eyebrow="What we build"
        title={BUILD_TITLE}
        headingId={hid(BUILD_TITLE)}
        lead="A website on its own is a page. The layers around it make it useful: the infrastructure that keeps it online, the Google setup that helps people find you, and the flows that turn a visit into a prepared conversation."
        align="split"
      />

      <div className="mt-16 lg:mt-20">
        <FoundationStack />
      </div>

      <ScrollReveal className="mt-14 grid gap-8 border-t border-white/[0.08] pt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="max-w-2xl space-y-2 text-sm leading-relaxed text-muted-foreground">
          <p>
            <span className="font-medium text-foreground/85">Together, the first three layers form our standard foundation.</span>{" "}
            Exact scope is confirmed in your quote.
          </p>
          <p>
            Member app, operations and owner systems are a broader direction and are not part of this starting scope. They are
            discussed and scoped separately, when your gym is ready.
          </p>
        </div>
        <WhatsAppCta location="foundation" intent="quote" tone="white">
          Get a quote for your gym&apos;s foundation
        </WhatsAppCta>
      </ScrollReveal>
    </GymSection>
  );
}
