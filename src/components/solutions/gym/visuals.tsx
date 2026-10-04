import {
  Check,
  Dumbbell,
  Globe,
  Instagram,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Search,
  Star,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { HERO_SEARCH_QUERY } from "./content";
import { InView } from "./in-view";

/**
 * Decorative product visuals for the gym solution page: a phone, WhatsApp
 * bubbles and the hero research trail.
 *
 * Everything is drawn from divs and inline SVG, so it costs no image requests.
 * Every export is decorative (`aria-hidden`); callers carry the meaning in real
 * text beside the artwork. Strings inside are illustrative sample copy for an
 * example gym, never claims about a real one: stars carry no rating or count.
 */

/* -------------------------------------------------------------------------- */
/* Phone                                                                      */
/* -------------------------------------------------------------------------- */

export function PhoneShell({
  children,
  className,
  screenClassName,
}: {
  children: ReactNode;
  className?: string;
  screenClassName?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative mx-auto w-[248px] rounded-[2.2rem] border border-white/[0.14] bg-[#0b0b0d] p-2 shadow-[0_40px_100px_-40px_rgba(94,106,210,0.55)]",
        className,
      )}
    >
      <div className={cn("relative overflow-hidden rounded-[1.7rem] border border-white/[0.06] bg-[#0f1011]", screenClassName)}>
        <div className="flex justify-center pt-2">
          <span className="h-1 w-12 rounded-full bg-white/15" />
        </div>
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* WhatsApp                                                                   */
/* -------------------------------------------------------------------------- */

export function WhatsAppHeader({ title = "Gym team", subtitle = "WhatsApp" }: { title?: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/[0.06] bg-[#202c33] px-4 py-3">
      <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#5e6ad2] to-[#9333ea]">
        <Dumbbell className="size-4 text-white" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white/90">{title}</p>
        <p className="flex items-center gap-1.5 text-[0.6875rem] text-[#8696a0]">
          <span className="size-1.5 rounded-full bg-[#25d366]" />
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export function Bubble({
  from,
  children,
  className,
  style,
}: {
  from: "member" | "team";
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn(
        "max-w-[88%] rounded-xl px-3.5 py-2.5 text-[0.875rem] leading-snug text-white/92 shadow-[0_1px_0_rgba(0,0,0,0.3)]",
        from === "member" ? "self-end rounded-tr-sm bg-[#005c4b]" : "self-start rounded-tl-sm bg-[#202c33]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Small mock fragments                                                       */
/* -------------------------------------------------------------------------- */

function Stars({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-0.5", className)}>
      {[0, 1, 2, 3, 4].map((n) => (
        <Star key={n} className="size-3 fill-amber-300/80 text-amber-300/80" />
      ))}
    </span>
  );
}

function StepTag({ n, children }: { n: string; children: ReactNode }) {
  return (
    <span className="mb-2 flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-white/45">
      <span className="text-primary">{n}</span>
      {children}
    </span>
  );
}

function SearchFragment() {
  return (
    <div>
      <StepTag n="01">Search</StepTag>
      <div className="flex items-center gap-2.5 rounded-full border border-white/12 bg-[#15171c] px-4 py-2.5 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)]">
        <Search className="size-4 text-white/50" />
        <span className="text-sm text-white/85">{HERO_SEARCH_QUERY}</span>
        <span className="ml-auto h-4 w-px bg-primary/80" />
      </div>
    </div>
  );
}

function MapsFragment() {
  return (
    <div>
      <StepTag n="02">Maps & reviews</StepTag>
      <div className="rounded-2xl border border-white/10 bg-[#15171c] p-3.5 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)]">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#ea4335]/15">
            <MapPin className="size-4 text-[#f28b82]" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white/90">Example Gym</p>
            <Stars className="mt-1" />
            <p className="mt-1 text-[0.6875rem] text-white/50">Gym · Open now</p>
          </div>
        </div>
        <div className="mt-3 flex gap-1.5 text-[0.6875rem]">
          <span className="flex items-center gap-1 rounded-full bg-[#8ab4f8]/15 px-2.5 py-1 text-[#aecbfa]">
            <Navigation className="size-3" /> Directions
          </span>
          <span className="flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-white/60">
            <Globe className="size-3" /> Website
          </span>
        </div>
      </div>
    </div>
  );
}

function InstagramFragment() {
  return (
    <div>
      <StepTag n="03">Instagram</StepTag>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#15171c] shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-2 px-3 py-2">
          <span className="size-5 rounded-full bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] p-[1.5px]">
            <span className="block size-full rounded-full bg-[#15171c]" />
          </span>
          <span className="text-[0.6875rem] font-medium text-white/75">examplegym</span>
          <Instagram className="ml-auto size-3.5 text-white/40" />
        </div>
        <div className="grid grid-cols-3 gap-0.5">
          {[
            "from-[#5e6ad2]/50 to-[#9333ea]/30",
            "from-[#f58529]/30 to-[#dd2a7b]/30",
            "from-white/15 to-white/5",
            "from-white/10 to-white/[0.03]",
            "from-[#5e6ad2]/35 to-[#0e7490]/30",
            "from-[#dd2a7b]/25 to-[#8134af]/30",
          ].map((g) => (
            <span key={g} className={cn("aspect-square bg-gradient-to-br", g)} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** The gym website on the phone, ending in a tool result. */
function SiteScreen() {
  return (
    <>
      <div className="flex items-center gap-2 px-3.5 pb-2 pt-3">
        <span className="size-3.5 rounded-[0.3rem] bg-gradient-to-br from-[#5e6ad2] to-[#9333ea]" />
        <span className="text-[0.625rem] font-semibold tracking-wide text-white/80">EXAMPLE GYM</span>
        <span className="ml-auto flex gap-1">
          <span className="h-1 w-4 rounded-full bg-white/20" />
          <span className="h-1 w-4 rounded-full bg-white/20" />
        </span>
      </div>
      <div className="px-3.5 pb-3 pt-2">
        <span className="inline-block rounded-full bg-primary/15 px-2 py-0.5 text-[0.5625rem] font-medium text-primary">
          Strength · Classes · Coaching
        </span>
        <p className="mt-2 text-[0.9375rem] font-semibold leading-tight tracking-tight text-white/95">
          Train somewhere that gets you started right.
        </p>
      </div>
      <div className="mx-3 mb-3 rounded-xl border border-primary/30 bg-primary/[0.08] p-3">
        <p className="text-[0.5625rem] font-medium uppercase tracking-[0.14em] text-primary">Your starting point</p>
        <p className="mt-1 text-[0.8125rem] font-medium text-white/92">Beginner program + orientation</p>
        <ul className="mt-2 space-y-1">
          {["3 sessions a week", "Trainer walkthrough first"].map((item) => (
            <li key={item} className="flex items-center gap-1.5 text-[0.6875rem] text-white/65">
              <Check className="size-3 text-primary" />
              {item}
            </li>
          ))}
        </ul>
        <span className="mt-3 flex h-8 items-center justify-center gap-1.5 rounded-full bg-[#25d366] text-[0.6875rem] font-semibold text-[#06260f]">
          <MessageCircle className="size-3.5" />
          Message the gym team
        </span>
      </div>
      <div className="mx-3 mb-4 flex items-center justify-between rounded-lg border border-white/[0.06] px-3 py-2 text-[0.625rem] text-white/55">
        <span className="flex items-center gap-1">
          <Star className="size-3 text-amber-300/80" /> Reviews
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="size-3" /> Location
        </span>
        <span className="flex items-center gap-1">
          <Phone className="size-3" /> Call
        </span>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero composition                                                           */
/* -------------------------------------------------------------------------- */

/**
 * The hero visual: one person's research trail. A search, a Maps listing, the
 * gym's Instagram, then the gym's website (the focal phone) where a tool gives
 * them a starting point, ending in the enquiry the team actually receives.
 *
 * Desktop (xl+) is a composed trail on a fixed canvas with a hairline joining
 * the fragments in order. Below xl it is a separate, compact vertical
 * composition rather than a scaled-down canvas.
 */
export function HeroComposition({ enquiry }: { enquiry: string }) {
  return (
    <>
      {/* Desktop trail */}
      <InView aria-hidden className="relative hidden h-[620px] w-[540px] xl:block" threshold={0.1}>
        <div className="pointer-events-none absolute right-6 top-24 -z-10 size-[26rem] rounded-full bg-[radial-gradient(circle,rgba(94,106,210,0.3),transparent_65%)] blur-2xl" />

        <svg className="absolute inset-0 size-full overflow-visible" viewBox="0 0 540 620" fill="none">
          <defs>
            <linearGradient id="gym-hero-trail" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgb(255 255 255 / 0.18)" />
              <stop offset="0.7" stopColor="rgb(130 143 255 / 0.7)" />
              <stop offset="1" stopColor="rgb(37 211 102 / 0.8)" />
            </linearGradient>
          </defs>
          <path
            className="gym-draw"
            pathLength={1}
            style={{ ["--d" as string]: "250ms" }}
            d="M40 78 C 40 100, 60 106, 60 124 M60 238 C 60 262, 30 268, 30 290 M200 380 C 240 380, 250 330, 290 320 M414 410 C 414 462, 350 470, 300 498"
            stroke="url(#gym-hero-trail)"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>

        <div className="gym-rise absolute left-0 top-6 w-[248px]" style={{ ["--d" as string]: "0ms" }}>
          <SearchFragment />
        </div>
        <div className="gym-rise absolute left-6 top-[118px] w-[236px]" style={{ ["--d" as string]: "140ms" }}>
          <MapsFragment />
        </div>
        <div className="gym-rise absolute left-0 top-[282px] w-[200px]" style={{ ["--d" as string]: "280ms" }}>
          <InstagramFragment />
        </div>

        <div className="gym-rise absolute right-0 top-0" style={{ ["--d" as string]: "420ms" }}>
          <p className="mb-2 flex items-center gap-2 pl-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-white/45">
            <span className="text-primary">04</span>Your website
          </p>
          <PhoneShell className="w-[252px]">
            <SiteScreen />
          </PhoneShell>
        </div>

        <div className="gym-pop absolute bottom-0 left-2 w-[300px]" style={{ ["--d" as string]: "700ms" }}>
          <p className="mb-2 flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-white/45">
            <span className="text-[#25d366]">05</span>What your team receives
          </p>
          <div className="flex flex-col rounded-2xl border border-white/10 bg-[#0b141a] p-3 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95)]">
            <Bubble from="member" className="max-w-full">
              {enquiry}
            </Bubble>
          </div>
        </div>
      </InView>

      {/* Compact trail (below xl) */}
      <InView aria-hidden className="mx-auto w-full max-w-md xl:hidden" threshold={0.1}>
        <ol className="relative grid grid-cols-4 gap-2">
          <span className="absolute left-[12.5%] right-[12.5%] top-[1.375rem] h-px bg-gradient-to-r from-white/15 via-primary/60 to-primary" />
          {[
            { icon: Search, label: "Search" },
            { icon: MapPin, label: "Maps" },
            { icon: Instagram, label: "Instagram" },
            { icon: Globe, label: "Website", active: true },
          ].map((step, i) => (
            <li
              key={step.label}
              className="gym-rise relative flex flex-col items-center gap-2"
              style={{ ["--d" as string]: `${i * 110}ms` }}
            >
              <span
                className={cn(
                  "flex size-11 items-center justify-center rounded-full border",
                  step.active
                    ? "border-primary bg-[#1a1d3a] text-primary shadow-[0_0_24px_-4px_rgba(130,143,255,0.7)]"
                    : "border-white/15 bg-[#101216] text-white/70",
                )}
              >
                <step.icon className="size-[1.125rem]" />
              </span>
              <span className={cn("text-xs", step.active ? "text-foreground" : "text-white/55")}>{step.label}</span>
            </li>
          ))}
        </ol>

        <div className="gym-rise mx-auto mt-5 w-[86%] rounded-2xl border border-primary/30 bg-primary/[0.08] p-4" style={{ ["--d" as string]: "460ms" }}>
          <p className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-primary">Your starting point</p>
          <p className="mt-1 text-sm font-medium text-white/92">Beginner program + orientation</p>
        </div>
        <span className="mx-auto block h-6 w-px bg-gradient-to-b from-primary/60 to-[#25d366]/70" />
        <div className="gym-pop" style={{ ["--d" as string]: "600ms" }}>
          <p className="mb-2 text-center font-mono text-[0.625rem] uppercase tracking-[0.18em] text-white/50">
            What your team receives
          </p>
          <div className="flex flex-col rounded-2xl border border-white/10 bg-[#0b141a] p-3">
            <Bubble from="member" className="max-w-full">
              {enquiry}
            </Bubble>
          </div>
        </div>
      </InView>
    </>
  );
}
