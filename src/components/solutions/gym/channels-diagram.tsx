import { Globe, Instagram, Link2, MapPin, MessageCircle, Phone, Users, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { CHANNELS } from "./content";
import { InView } from "./in-view";

/**
 * Section 04 — Google, Instagram and the website as one system.
 *
 * Instagram and Google are entry points with different jobs; both (and a
 * direct link) converge on the website, which hands the visitor to an
 * enquiry, WhatsApp or a call, and finally the gym team. Desktop is a single
 * diagram canvas; mobile is its own vertical composition.
 *
 * The channels' jobs are real text (`<dl>` under an sr-only summary); pathways
 * and signal are decorative.
 */

type Channel = (typeof CHANNELS)[keyof typeof CHANNELS];

function EntryNode({
  icon: Icon,
  channel,
  tint,
  className,
  style,
}: {
  icon: LucideIcon;
  channel: Channel;
  tint: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("gym-rise rounded-2xl border border-white/10 bg-[#11141b] p-4 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)]", className)}
      style={style}
    >
      <div className="flex items-center gap-2.5">
        <span className={cn("flex size-8 items-center justify-center rounded-lg", tint)}>
          <Icon className="size-4" />
        </span>
        <dt className="font-semibold tracking-tight">{channel.name}</dt>
      </div>
      <dd className="mt-2 text-sm leading-snug text-foreground/85">{channel.job}</dd>
      <dd className="mt-2 text-xs leading-relaxed text-muted-foreground">{channel.carries.join(" · ")}</dd>
    </div>
  );
}

function Hub({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn(
        "gym-pop rounded-3xl border border-primary/50 bg-[linear-gradient(180deg,#171a33,#0e1020)] p-5 shadow-[0_0_0_1px_rgba(130,143,255,0.12),0_30px_90px_-30px_rgba(94,106,210,0.7)] lg:p-6",
        className,
      )}
      style={style}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
          <Globe className="size-[1.125rem]" />
        </span>
        <dt className="text-lg font-semibold tracking-tight">{CHANNELS.website.name}</dt>
        <span className="ml-auto font-mono text-[0.625rem] uppercase tracking-[0.18em] text-primary">Hub</span>
      </div>
      <dd className="mt-3 text-base font-medium leading-snug lg:text-lg">{CHANNELS.website.job}</dd>
      <dd>
        <ul className="mt-3 space-y-1.5 border-t border-white/[0.08] pt-3 text-sm text-foreground/75">
          {CHANNELS.website.carries.map((c) => (
            <li key={c} className="flex items-center gap-2">
              <span aria-hidden className="size-1 rounded-full bg-primary" />
              {c}
            </li>
          ))}
        </ul>
      </dd>
    </div>
  );
}

function Pill({
  icon: Icon,
  label,
  tone,
  className,
  style,
}: {
  icon: LucideIcon;
  label: string;
  tone?: "whatsapp" | "team";
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "gym-rise flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium",
        tone === "team"
          ? "border-white bg-white text-black shadow-[0_0_40px_-8px_rgba(255,255,255,0.45)]"
          : tone === "whatsapp"
            ? "border-[#25d366]/40 bg-[#0f2a1d] text-[#9ff0c0]"
            : "border-white/15 bg-[#11141b] text-foreground/85",
        className,
      )}
      style={style}
    >
      <Icon className="size-4 shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
    </div>
  );
}

const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as React.CSSProperties;

const SIGNAL_PATH = "M220 92 C 300 92, 300 176, 372 176 L 628 220 L 1000 220";

export function ChannelsDiagram() {
  return (
    <>
      <p className="sr-only">
        Instagram shows the culture and Google helps people discover and verify the gym. Both, along with direct
        links, lead to the website, which explains the complete story and leads to an enquiry on WhatsApp or a
        call, which reaches the gym team.
      </p>

      {/* Desktop canvas */}
      <InView className="relative hidden aspect-[1100/440] w-full lg:block" threshold={0.3}>
        <svg aria-hidden className="absolute inset-0 size-full" viewBox="0 0 1100 440" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gym-ch-in" x1="0" x2="1">
              <stop offset="0" stopColor="rgb(255 255 255 / 0.2)" />
              <stop offset="1" stopColor="rgb(130 143 255 / 0.85)" />
            </linearGradient>
            <linearGradient id="gym-ch-out" x1="628" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="rgb(130 143 255 / 0.85)" />
              <stop offset="0.6" stopColor="rgb(37 211 102 / 0.7)" />
              <stop offset="1" stopColor="rgb(255 255 255 / 0.9)" />
            </linearGradient>
          </defs>
          <g strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke">
            <path className="gym-draw" pathLength={1} style={d(150)} d="M220 92 C 300 92, 300 176, 372 176" stroke="url(#gym-ch-in)" />
            <path className="gym-draw" pathLength={1} style={d(250)} d="M220 348 C 300 348, 300 264, 372 264" stroke="url(#gym-ch-in)" />
            <path className="gym-light" style={d(350)} d="M200 220 L 372 220" stroke="rgb(255 255 255 / 0.25)" strokeDasharray="4 6" />
            <path className="gym-draw" pathLength={1} style={d(600)} d="M628 220 L 1000 220" stroke="url(#gym-ch-out)" />
          </g>
          <circle className="gym-signal" r="5" fill="#c4caff" style={{ ...d(1100), offsetPath: `path("${SIGNAL_PATH}")` }} />
        </svg>

        <dl className="contents">
          <EntryNode
            icon={Instagram}
            channel={CHANNELS.instagram}
            tint="bg-gradient-to-tr from-[#f58529]/30 via-[#dd2a7b]/30 to-[#8134af]/30 text-[#f7a8d4]"
            className="absolute left-0 top-[2%] w-[20%]"
            style={d(0)}
          />
          <EntryNode
            icon={MapPin}
            channel={CHANNELS.google}
            tint="bg-[#ea4335]/15 text-[#f28b82]"
            className="absolute bottom-[2%] left-0 w-[20%]"
            style={d(100)}
          />
          <Hub className="absolute left-[33.8%] top-1/2 w-[23.3%] -translate-y-1/2" style={d(400)} />
        </dl>
        <div
          aria-hidden
          className="gym-rise absolute left-[3%] top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-full border border-dashed border-white/20 bg-[#0b0e14] px-3 py-1.5 text-xs text-foreground/60"
          style={d(200)}
        >
          <Link2 className="size-3.5" /> Direct / shared link
        </div>

        <Pill icon={MessageCircle} label="Enquiry" className="absolute left-[60%] top-1/2 w-[10.5%] -translate-y-1/2" style={d(800)} />
        <Pill
          icon={Phone}
          label="WhatsApp / Call"
          tone="whatsapp"
          className="absolute left-[72.5%] top-1/2 w-[14%] -translate-y-1/2"
          style={d(950)}
        />
        <Pill icon={Users} label="Gym team" tone="team" className="absolute right-0 top-1/2 w-[11%] -translate-y-1/2" style={d(1100)} />

        <p
          aria-hidden
          className="absolute left-0 top-[-2.25rem] font-mono text-[0.625rem] uppercase tracking-[0.2em] text-foreground/45"
        >
          Entry points
        </p>
        <p aria-hidden className="absolute left-[60%] top-[-2.25rem] font-mono text-[0.625rem] uppercase tracking-[0.2em] text-foreground/45">
          The conversation
        </p>
      </InView>

      {/* Mobile composition */}
      <InView className="lg:hidden" threshold={0.15}>
        <dl className="grid grid-cols-2 gap-3">
          <EntryNode
            icon={Instagram}
            channel={CHANNELS.instagram}
            tint="bg-gradient-to-tr from-[#f58529]/30 via-[#dd2a7b]/30 to-[#8134af]/30 text-[#f7a8d4]"
            style={d(0)}
          />
          <EntryNode icon={MapPin} channel={CHANNELS.google} tint="bg-[#ea4335]/15 text-[#f28b82]" style={d(100)} />
          <div aria-hidden className="col-span-2 -my-1">
            <svg className="mx-auto block h-12 w-full" viewBox="0 0 300 48" fill="none" preserveAspectRatio="none">
              <g stroke="rgb(130 143 255 / 0.7)" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
                <path className="gym-draw" pathLength={1} style={d(200)} d="M75 0 C 75 30, 150 18, 150 48" />
                <path className="gym-draw" pathLength={1} style={d(250)} d="M225 0 C 225 30, 150 18, 150 48" />
              </g>
            </svg>
          </div>
          <Hub className="col-span-2" style={d(350)} />
        </dl>
        <div aria-hidden className="mt-0 flex flex-col items-center">
          {[
            { icon: MessageCircle, label: "Enquiry" },
            { icon: Phone, label: "WhatsApp / Call", tone: "whatsapp" as const },
            { icon: Users, label: "Gym team", tone: "team" as const },
          ].map((p, i) => (
            <div key={p.label} className="flex flex-col items-center">
              <span className="gym-grow-y block h-7 w-px bg-gradient-to-b from-primary/70 to-[#25d366]/60" style={d(450 + i * 120)} />
              <Pill icon={p.icon} label={p.label} tone={p.tone} className="min-w-[11rem]" style={d(500 + i * 120)} />
            </div>
          ))}
        </div>
      </InView>
    </>
  );
}
