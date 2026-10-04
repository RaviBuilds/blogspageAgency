import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";

import { ScrollReveal } from "@/components/home/scroll-reveal";
import { FaqAccordion } from "@/components/services/web-design/faq-accordion";
import { TYPE_DISPLAY } from "@/lib/brand-type";
import type { FaqPair } from "@/lib/structured-data";
import { NAP } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { LatestPost } from "@/sanity/lib/queries";

import { ANSWERS_TITLE, FINAL_TITLE, PROCESS_TITLE, RELATED_TITLE } from "../gym-landing-headings";

import { FINAL_CTA_ID, GYM_QUOTE_MESSAGE, LAUNCH_NOTE, PRICING_NOTE, PROCESS_NEEDS, PROCESS_STEPS, VERDICTS } from "./content";
import { InView } from "./in-view";
import { GymSection, Kicker, SectionHeader } from "./primitives";
import { Bubble, WhatsAppHeader } from "./visuals";
import { WhatsAppCta } from "./whatsapp-cta";

type HeadingId = (text: string) => string | undefined;

const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as React.CSSProperties;

/* -------------------------------------------------------------------------- */
/* 11 — Straight answers (paper: calm, typographic, honest)                   */
/* -------------------------------------------------------------------------- */

export function AnswersSection({ hid, faq }: { hid: HeadingId; faq: FaqPair[] }) {
  if (!faq.length) return null;
  return (
    <GymSection id="straight-answers" chapter="start" rhythm="movement" surface="paper">
      <SectionHeader
        index="11"
        eyebrow="Trust"
        title={ANSWERS_TITLE}
        headingId={hid(ANSWERS_TITLE)}
        lead="What a website can and cannot do for a gym, said plainly."
      />

      <ScrollReveal className="mt-14 lg:mt-20">
        <dl className="border-t border-border">
          {VERDICTS.map((v) => (
            <div key={v.question} className="flex items-baseline justify-between gap-6 border-b border-border py-6 sm:py-8">
              <dt className="text-xl font-medium leading-snug tracking-tight text-foreground/85 text-balance sm:text-2xl lg:text-3xl">
                {v.question}
              </dt>
              <dd
                className={cn(
                  "shrink-0 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl lg:text-6xl",
                  v.verdict === "Yes" ? "text-primary" : "text-foreground",
                )}
              >
                {v.verdict}.
              </dd>
            </div>
          ))}
        </dl>
      </ScrollReveal>

      <div className="mt-20 grid gap-8 lg:mt-24 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
        <div>
          <Kicker className="text-foreground/60">The full answers</Kicker>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            The longer version of each answer, including who this is for and what the tools are not.
          </p>
        </div>
        <FaqAccordion items={faq} />
      </div>
    </GymSection>
  );
}

/* -------------------------------------------------------------------------- */
/* 12 — Getting started: four steps                                           */
/* -------------------------------------------------------------------------- */

export function ProcessSection({ hid }: { hid: HeadingId }) {
  return (
    <GymSection id="how-we-start" chapter="start" rhythm="continue" surface="paper">
      <div className="border-t border-border pt-20 lg:pt-28">
        <SectionHeader index="12" eyebrow="How we start" title={PROCESS_TITLE} headingId={hid(PROCESS_TITLE)} />

        <InView className="relative mt-14 lg:mt-16" threshold={0.3}>
          <span aria-hidden className="absolute left-0 right-0 top-[1.4rem] hidden h-px bg-border md:block" />
          <span aria-hidden className="gym-grow-x absolute left-0 right-0 top-[1.4rem] hidden h-px bg-primary md:block" />
          <ol className="relative grid gap-10 md:grid-cols-4 md:gap-8">
            {PROCESS_STEPS.map((step, i) => (
              <li key={step.index} className="gym-rise relative" style={d(i * 140)}>
                <span className="relative inline-flex bg-[#f7f8fa] pr-4 font-mono text-[2.75rem] font-medium leading-none tabular-nums tracking-tight text-primary">
                  {step.index}
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                {i === 0 ? (
                  <details className="group mt-4">
                    <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-primary outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
                      What we&apos;ll need from you
                      <ChevronDown aria-hidden className="size-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <ul className="mt-2 space-y-1.5 text-sm text-foreground/80">
                      {PROCESS_NEEDS.map((n) => (
                        <li key={n} className="flex gap-2.5">
                          <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                          {n}
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}
              </li>
            ))}
          </ol>
        </InView>

        <ScrollReveal className="mt-14">
          <p className="text-lg text-foreground/85">
            <span className="font-semibold text-foreground">Target launch: 3 days</span> {LAUNCH_NOTE}
          </p>
        </ScrollReveal>
      </div>
    </GymSection>
  );
}

/* -------------------------------------------------------------------------- */
/* 13 — Final CTA: an invitation                                              */
/* -------------------------------------------------------------------------- */

export function FinalCtaSection({ hid }: { hid: HeadingId }) {
  return (
    <GymSection id={FINAL_CTA_ID} rhythm="chapter" className="scroll-mt-10 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-0 size-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(94,106,210,0.22),transparent_62%)] blur-2xl" />
      <div className="relative grid items-center gap-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16">
        <ScrollReveal>
          <Kicker className="text-foreground/60">Your gym, your members, your goals</Kicker>
          <h2 id={hid(FINAL_TITLE)} className={cn("mt-6", TYPE_DISPLAY)}>
            {FINAL_TITLE}
          </h2>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tell us about your gym and we&apos;ll help map the digital experience around your members, enquiries and goals.
          </p>
          <p className="mt-3 max-w-xl text-sm text-foreground/70">{PRICING_NOTE}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <WhatsAppCta location="final-quote" intent="quote" tone="white">
              Get a Quote
            </WhatsAppCta>
            <WhatsAppCta location="final" tone="outline">
              Show Me What This Could Look Like
            </WhatsAppCta>
          </div>
          <p className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href={NAP.telephoneHref} className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-foreground">
              <Phone className="size-3.5" />
              {NAP.telephone}
            </a>
            <Link href="/#contact?niche=gym-fitness" className="inline-flex min-h-11 items-center transition-colors hover:text-foreground">
              Prefer a form? Send us a message
            </Link>
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div aria-hidden className="mx-auto max-w-sm overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0b141a] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.95)]">
            <WhatsAppHeader title="BLOGSPAGE AI" subtitle="WhatsApp" />
            <div className="flex flex-col gap-2 p-4">
              <Bubble from="member">{GYM_QUOTE_MESSAGE}</Bubble>
            </div>
          </div>
          <p aria-hidden className="mt-4 text-center font-mono text-[0.625rem] uppercase tracking-[0.2em] text-foreground/45">
            Your first message, already written
          </p>
        </ScrollReveal>
      </div>
    </GymSection>
  );
}

/* -------------------------------------------------------------------------- */
/* Related reading                                                            */
/* -------------------------------------------------------------------------- */

export function RelatedSection({ hid, posts }: { hid: HeadingId; posts: LatestPost[] }) {
  if (!posts.length) return null;
  return (
    <GymSection rhythm="quiet" className="border-t border-white/[0.06]">
      <ScrollReveal>
        <h2 id={hid(RELATED_TITLE)} className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
          {RELATED_TITLE}
        </h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-3">
          {posts.map((post) => (
            <li key={post._id}>
              <Link
                href={`/blogs/${post.slug}`}
                className="group flex h-full flex-col border-t border-white/[0.1] pt-5 transition-colors hover:border-white/30"
              >
                <h3 className="line-clamp-2 text-base font-medium tracking-tight transition-colors group-hover:text-primary">{post.title}</h3>
                {post.excerpt ? <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p> : null}
              </Link>
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </GymSection>
  );
}
