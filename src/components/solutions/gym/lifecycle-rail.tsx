"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { UserRound } from "lucide-react";
import { useRef, useState } from "react";

import { useMotionReady } from "@/components/home/progress-reveal";
import { cn } from "@/lib/utils";

import { STAGE_OWNER_LABEL, STAGES, type StageOwner } from "./content";
import { StatusBadge } from "./primitives";

/**
 * Section 10 — one member, one journey.
 *
 * A single continuous rail, Discover -> Renew, that fills as the section
 * scrolls through the viewport while a member token travels along it, with a
 * return arc from Renew back to Train (renewal keeps the member training).
 * Each stage lists the system that serves it, coloured by who owns it today.
 *
 * SSR / reduced motion: the rail renders fully lit with the token at the end.
 * The one `useScroll` on the page lives here.
 */

const OWNER_NODE: Record<StageOwner, string> = {
  foundation: "border-primary bg-[#1a1d3a] text-primary",
  team: "border-white bg-white text-black",
  broader: "border-dashed border-white/40 bg-[#0b0d12] text-foreground/70",
};

const OWNER_DOT: Record<StageOwner, string> = {
  foundation: "border-primary bg-primary/30",
  team: "border-white bg-white",
  broader: "border-dashed border-white/40",
};

export function LifecycleRail() {
  const ref = useRef<HTMLDivElement>(null);
  const armed = useMotionReady();
  const reduce = Boolean(useReducedMotion());
  const settled = useMotionValue(1);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.55"] });
  const live = armed && !reduce;
  const progress = live ? scrollYProgress : settled;

  const fillX = useTransform(progress, [0, 1], [0, 1]);
  const tokenX = useTransform(progress, [0, 1], ["0%", "100%"]);
  const tokenY = useTransform(progress, [0, 1], ["0%", "100%"]);

  const last = STAGES.length - 1;
  const [reached, setReached] = useState(last);
  useMotionValueEvent(progress, "change", (v) => {
    setReached(Math.min(last, Math.max(0, Math.round(v * last))));
  });
  const lit = live ? reached : last;

  return (
    <div ref={ref}>
      <ul aria-label="Legend" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        {(Object.keys(STAGE_OWNER_LABEL) as StageOwner[]).map((key) => (
          <li key={key} className="flex items-center gap-2">
            <span aria-hidden className={cn("size-3 rounded-full border", OWNER_DOT[key])} />
            {STAGE_OWNER_LABEL[key]}
          </li>
        ))}
      </ul>

      {/* Desktop: horizontal rail */}
      <div className="relative mt-20 hidden lg:block">
        {/* return arc Renew -> Train */}
        <svg aria-hidden className="absolute -top-14 left-[66.66%] h-14 w-[33.34%]" viewBox="0 0 200 56" fill="none" preserveAspectRatio="none">
          <path d="M150 50 C 150 4, 50 4, 50 44" stroke="rgb(255 255 255 / 0.35)" strokeWidth="1.25" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
          <path d="M45 38 L50 46 L55 38" stroke="rgb(255 255 255 / 0.5)" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
        </svg>
        <span aria-hidden className="absolute -top-16 left-[83.33%] -translate-x-1/2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-foreground/45">
          renews
        </span>

        <div aria-hidden className="absolute left-[8.33%] right-[8.33%] top-6 h-px bg-white/10">
          <motion.span className="absolute inset-0 origin-left bg-gradient-to-r from-primary via-white to-white/60" style={{ scaleX: fillX }} />
          <motion.span className="absolute inset-y-0 left-0 w-full" style={{ x: tokenX }}>
            <span className="absolute left-0 top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-[#050505] text-white shadow-[0_0_30px_-4px_rgba(255,255,255,0.6)]">
              <UserRound className="size-4" />
            </span>
          </motion.span>
        </div>

        <ol className="relative grid grid-cols-6 gap-3">
          {STAGES.map((stage, i) => {
            const on = i <= lit;
            return (
              <li key={stage.name} className="flex flex-col items-center text-center">
                <span
                  className={cn(
                    "relative z-10 flex size-12 items-center justify-center rounded-full border font-mono text-xs transition-all duration-500",
                    OWNER_NODE[stage.owner],
                    !on && "opacity-30",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={cn("mt-6 text-lg font-semibold uppercase tracking-[0.14em] transition-colors duration-500", on ? "text-foreground" : "text-foreground/35")}>
                  {stage.name}
                </h3>
                <ul className={cn("mt-3 space-y-1 text-sm transition-colors duration-500", on ? "text-muted-foreground" : "text-muted-foreground/40")}>
                  {stage.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile: vertical rail */}
      <div className="relative mt-12 lg:hidden">
        <div aria-hidden className="absolute bottom-6 left-6 top-6 w-px bg-white/10">
          <motion.span className="absolute inset-0 origin-top bg-gradient-to-b from-primary via-white to-white/60" style={{ scaleY: fillX }} />
          <motion.span className="absolute inset-x-0 top-0 h-full" style={{ y: tokenY }}>
            <span className="absolute left-1/2 top-0 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-[#050505] text-white">
              <UserRound className="size-3.5" />
            </span>
          </motion.span>
        </div>
        <ol className="relative space-y-8">
          {STAGES.map((stage, i) => {
            const on = i <= lit;
            return (
              <li key={stage.name} className="flex gap-5">
                <span
                  className={cn(
                    "relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border font-mono text-xs transition-all duration-500",
                    OWNER_NODE[stage.owner],
                    !on && "opacity-30",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="pt-2.5">
                  <h3 className={cn("text-lg font-semibold uppercase tracking-[0.14em]", on ? "text-foreground" : "text-foreground/40")}>{stage.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{stage.items.join(" · ")}</p>
                  {i === last ? <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-foreground/45">↺ and back to Train</p> : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Operate band */}
      <div className="mt-14 rounded-3xl border border-dashed border-white/20 p-6 sm:p-8 lg:mt-16">
        <div className="grid gap-4 lg:grid-cols-[14rem_minmax(0,1fr)_auto] lg:items-center lg:gap-10">
          <div>
            <h3 className="text-lg font-semibold uppercase tracking-[0.14em]">Operate</h3>
            <p className="mt-1 text-sm text-muted-foreground">Running every stage</p>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Staff and owner systems sit underneath the whole lifecycle: Operations Command Center for the team and Executive
            Analytics for the owner. Broader system, scoped separately.
          </p>
          <StatusBadge status="concept" className="justify-self-start" />
        </div>
        <div aria-hidden className="mt-6 hidden grid-cols-6 gap-3 lg:grid">
          {STAGES.map((s) => (
            <span key={s.name} className="h-1 rounded-full bg-white/[0.08]" />
          ))}
        </div>
      </div>
    </div>
  );
}
