"use client";

import {
  Globe,
  HelpCircle,
  Instagram,
  MapPin,
  MessageCircle,
  Search,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import { activeJourneyIndex, JOURNEY, type JourneyScreen } from "./content";
import { Bubble, PhoneShell } from "./visuals";

/**
 * Section 02 — one person's research journey, told on a phone.
 *
 * Desktop: the steps scroll past on the left while a sticky phone on the right
 * changes screen to match the step closest to the reading line (CSS sticky, an
 * IntersectionObserver picks the step; no scroll-jacking). Mobile: no pinning,
 * each step carries its own small screen thumbnail.
 *
 * The steps are a real ordered list in the server HTML; every screen is
 * decorative (`aria-hidden`). Before hydration the first step is active and
 * everything is visible.
 */

const ICONS: Record<JourneyScreen, LucideIcon> = {
  instagram: Instagram,
  google: Search,
  reviews: Star,
  website: Globe,
  questions: HelpCircle,
  whatsapp: MessageCircle,
  team: Users,
};

const bar = "block h-1.5 rounded-full bg-white/15";

function Screen({ screen }: { screen: JourneyScreen }) {
  switch (screen) {
    case "instagram":
      return (
        <div className="px-3 pt-3">
          <div className="flex items-center gap-3">
            <span className="size-12 rounded-full bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] p-[2px]">
              <span className="block size-full rounded-full bg-[#0f1011]" />
            </span>
            <div className="grid flex-1 grid-cols-3 gap-1 text-center">
              {["Posts", "Reels", "Tagged"].map((t) => (
                <span key={t} className="text-[0.5625rem] text-white/50">{t}</span>
              ))}
            </div>
          </div>
          <p className="mt-2 text-[0.6875rem] font-semibold text-white/85">examplegym</p>
          <span className={cn(bar, "mt-1.5 w-[70%]")} />
          <div className="mt-3 grid grid-cols-3 gap-0.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "aspect-square bg-gradient-to-br",
                  i % 4 === 0 ? "from-[#5e6ad2]/50 to-[#9333ea]/30" : i % 3 === 0 ? "from-[#dd2a7b]/30 to-[#f58529]/25" : "from-white/12 to-white/[0.03]",
                )}
              />
            ))}
          </div>
        </div>
      );
    case "google":
      return (
        <div className="px-3 pt-3">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
            <Search className="size-3 text-white/50" />
            <span className="text-[0.625rem] text-white/80">gym near me</span>
          </div>
          <div className="relative mt-3 h-28 overflow-hidden rounded-xl bg-[#1b2230]">
            <span className="absolute inset-x-0 top-10 h-2 rotate-6 bg-white/[0.06]" />
            <span className="absolute inset-y-0 left-16 w-2 bg-white/[0.06]" />
            <MapPin className="absolute left-[38%] top-[30%] size-5 fill-[#ea4335] text-[#ea4335]" />
            <MapPin className="absolute left-[68%] top-[55%] size-4 text-white/40" />
            <MapPin className="absolute left-[18%] top-[62%] size-4 text-white/40" />
          </div>
          {[0, 1, 2].map((n) => (
            <div key={n} className={cn("mt-2.5 rounded-lg border p-2.5", n === 0 ? "border-primary/40 bg-primary/[0.08]" : "border-white/[0.06]")}>
              <span className={cn(bar, "w-[55%]", n === 0 && "bg-white/60")} />
              <span className={cn(bar, "mt-1.5 w-[35%] bg-white/10")} />
            </div>
          ))}
        </div>
      );
    case "reviews":
      return (
        <div className="px-3 pt-3">
          <p className="text-[0.6875rem] font-semibold text-white/85">Reviews</p>
          {[0, 1, 2, 3].map((n) => (
            <div key={n} className="mt-2.5 rounded-lg border border-white/[0.06] p-2.5">
              <div className="flex items-center gap-2">
                <span className="size-5 rounded-full bg-white/10" />
                <span className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} className="size-2.5 fill-amber-300/80 text-amber-300/80" />
                  ))}
                </span>
              </div>
              <span className={cn(bar, "mt-2 w-[90%]")} />
              <span className={cn(bar, "mt-1 w-[60%] bg-white/10")} />
            </div>
          ))}
        </div>
      );
    case "website":
      return (
        <div className="px-3 pt-3">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-[0.25rem] bg-gradient-to-br from-[#5e6ad2] to-[#9333ea]" />
            <span className="text-[0.5625rem] font-semibold tracking-wide text-white/80">EXAMPLE GYM</span>
          </div>
          <p className="mt-3 text-[0.875rem] font-semibold leading-tight text-white/95">Train somewhere that gets you started right.</p>
          <span className="mt-2.5 inline-block h-5 w-20 rounded-full bg-white/85" />
          <p className="mt-4 text-[0.5625rem] font-medium uppercase tracking-[0.14em] text-white/45">Programs</p>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5">
            {["Beginner", "Strength", "Classes", "Coaching"].map((p) => (
              <span key={p} className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-2 text-[0.625rem] text-white/70">{p}</span>
            ))}
          </div>
          <p className="mt-3 text-[0.5625rem] font-medium uppercase tracking-[0.14em] text-white/45">Timings · Location</p>
          <span className={cn(bar, "mt-1.5 w-[80%]")} />
          <span className={cn(bar, "mt-1 w-[50%] bg-white/10")} />
        </div>
      );
    case "questions":
      return (
        <div className="flex flex-col gap-2.5 px-3 pt-6">
          {["Is this right for me?", "Can a beginner start here?", "What are the timings?", "Can I visit first?"].map((q, i) => (
            <span
              key={q}
              className={cn(
                "w-fit rounded-2xl border px-3 py-2 text-[0.6875rem]",
                i % 2 ? "self-end border-white/10 text-white/60" : "border-primary/40 bg-primary/10 text-white/85",
              )}
            >
              {q}
            </span>
          ))}
        </div>
      );
    case "whatsapp":
    case "team":
      return (
        <div className="flex h-full flex-col bg-[#0b141a]">
          <div className="flex items-center gap-2 bg-[#202c33] px-3 py-2">
            <span className="size-6 rounded-full bg-gradient-to-br from-[#5e6ad2] to-[#9333ea]" />
            <span className="text-[0.625rem] font-medium text-white/85">Gym team</span>
          </div>
          <div className="flex flex-col gap-2 p-2.5 [&>div]:text-[0.6875rem]">
            <Bubble from="member">Hi, I&apos;m new to gyms. Can I visit before joining?</Bubble>
            {screen === "team" ? (
              <Bubble from="team">Of course! Would Saturday morning work for a walkthrough?</Bubble>
            ) : (
              <span className="flex w-fit gap-1 self-start rounded-xl bg-[#202c33] px-3 py-2.5">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="size-1.5 rounded-full bg-white/40" />
                ))}
              </span>
            )}
          </div>
        </div>
      );
  }
}

export function DiscoveryJourney() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    const update = () => {
      const line = window.innerHeight * 0.45;
      const distances = stepRefs.current.map((el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return null;
        return r.top + r.height / 2 - line;
      });
      setActive((prev) => activeJourneyIndex(distances, prev));
    };
    const observer = new IntersectionObserver(update, {
      threshold: [0, 0.25, 0.5, 0.75, 1],
      rootMargin: "-20% 0px -20% 0px",
    });
    stepRefs.current.forEach((el) => el && observer.observe(el));
    update();
    return () => observer.disconnect();
  }, []);

  const progress = (active + 1) / JOURNEY.length;

  return (
    <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-20">
      <div className="relative">
        {/* progress rail */}
        <span aria-hidden className="absolute bottom-6 left-[1.375rem] top-6 w-px bg-white/10" />
        <span
          aria-hidden
          className="absolute left-[1.375rem] top-6 hidden w-px origin-top bg-gradient-to-b from-primary to-[#25d366] transition-transform duration-500 ease-out lg:block"
          style={{ height: "calc(100% - 3rem)", transform: `scaleY(${progress})` }}
        />
        <ol className="relative">
          {JOURNEY.map((step, i) => {
            const Icon = ICONS[step.screen];
            const isActive = i === active;
            const passed = i < active;
            const isTeam = step.screen === "team";
            return (
              <li
                key={step.name}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className="relative flex gap-5 pb-10 last:pb-0 lg:min-h-[24vh] lg:items-center lg:pb-0"
              >
                <span
                  className={cn(
                    "relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                    isTeam
                      ? "border-white bg-white text-black"
                      : isActive
                        ? "border-primary bg-[#1a1d3a] text-primary shadow-[0_0_28px_-4px_rgba(130,143,255,0.8)]"
                        : passed
                          ? "border-primary/40 bg-[#0d0f18] text-primary/80"
                          : "border-white/15 bg-[#0b0d12] text-muted-foreground",
                  )}
                >
                  <Icon className="size-[1.125rem]" />
                </span>
                <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
                  <div className="pt-1.5 lg:pt-0">
                    <span className="font-mono text-[0.6875rem] tabular-nums text-foreground/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className={cn(
                        "text-2xl font-semibold tracking-tight transition-colors duration-500 sm:text-3xl lg:text-4xl",
                        isActive || isTeam ? "text-foreground" : "lg:text-foreground/35",
                      )}
                    >
                      {step.name}
                    </h3>
                    <p
                      className={cn(
                        "mt-1 text-base transition-colors duration-500 lg:text-lg",
                        isActive ? "text-muted-foreground" : "text-muted-foreground lg:text-muted-foreground/50",
                      )}
                    >
                      {step.line}
                    </p>
                  </div>
                  {/* mobile thumbnail */}
                  <div aria-hidden className="h-[150px] w-[92px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#0f1011] lg:hidden">
                    <div className="h-[375px] w-[230px] origin-top-left scale-[0.4]">
                      <Screen screen={step.screen} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* sticky phone */}
      <div aria-hidden className="hidden lg:block">
        <div className="sticky top-[18vh]">
          <PhoneShell className="w-[264px]">
            <div className="relative h-[460px]">
              {JOURNEY.map((step, i) => (
                <div
                  key={step.screen}
                  className={cn(
                    "gym-fade absolute inset-0",
                    i === active ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0",
                  )}
                >
                  <Screen screen={step.screen} />
                </div>
              ))}
            </div>
          </PhoneShell>
          <p className="mt-5 text-center font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-foreground/45">
            <span className="text-primary">{String(active + 1).padStart(2, "0")}</span> / {String(JOURNEY.length).padStart(2, "0")} ·{" "}
            {JOURNEY[active].name}
          </p>
        </div>
      </div>
    </div>
  );
}
