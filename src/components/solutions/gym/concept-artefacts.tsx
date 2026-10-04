import { Bell, CalendarDays, CreditCard, ShoppingBag } from "lucide-react";

import { GymAdminPlaceholder } from "@/components/solutions/placeholders";
import { cn } from "@/lib/utils";

import { EXPANSION, type ExpansionKey } from "./content";
import { InView } from "./in-view";
import { Kicker, StatusBadge } from "./primitives";
import { PhoneShell } from "./visuals";

/**
 * Section 09 — the three broader modules as three different objects, because
 * they are three different experiences: a member's phone, the team's control
 * room, the owner's command centre. All concept previews: no live data, no
 * numbers, and each carries a Concept badge.
 */

const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as React.CSSProperties;

function MemberPhone() {
  return (
    <PhoneShell className="w-[236px]">
      <div className="space-y-2.5 px-3.5 pb-5 pt-3">
        <p className="text-[0.6875rem] text-white/55">Good evening</p>
        <div className="rounded-2xl bg-gradient-to-br from-[#5e6ad2] to-[#7c3aed] p-3.5">
          <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-white/75">Example Gym</p>
          <p className="mt-3 text-sm font-semibold text-white">Membership</p>
          <span className="mt-2 block h-1.5 w-2/3 rounded-full bg-white/35" />
          <span className="mt-1.5 block h-1.5 w-1/3 rounded-full bg-white/25" />
        </div>
        {[
          { icon: CalendarDays, title: "Next session", sub: "Strength · evening" },
          { icon: Bell, title: "Renewal reminder", sub: "Plan details" },
          { icon: ShoppingBag, title: "Order for pickup", sub: "At the front desk" },
          { icon: CreditCard, title: "Upgrade program", sub: "See options" },
        ].map((row) => (
          <div key={row.title} className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] p-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/15">
              <row.icon className="size-3.5 text-primary" />
            </span>
            <span>
              <span className="block text-[0.6875rem] font-medium text-white/85">{row.title}</span>
              <span className="block text-[0.5625rem] text-white/45">{row.sub}</span>
            </span>
          </div>
        ))}
      </div>
    </PhoneShell>
  );
}

function ControlRoom() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0a0a0b] shadow-[0_40px_100px_-50px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-[#141516] px-3.5 py-2.5">
        <span className="size-2 rounded-full bg-white/20" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/10" />
        <span className="ml-2 rounded-md border border-white/[0.06] bg-black/40 px-2 py-0.5 text-[0.625rem] text-white/45">team.yourgym.com</span>
      </div>
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <GymAdminPlaceholder className="size-full object-cover opacity-80" aria-hidden role="presentation" />
        <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5">
          {["Check-ins", "Billing", "Packages", "Inventory", "Orders"].map((c, i) => (
            <span
              key={c}
              className="gym-rise rounded-full border border-white/15 bg-black/70 px-2.5 py-1 text-[0.6875rem] text-white/80 backdrop-blur"
              style={d(300 + i * 80)}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const SPARKS = [
  "M0 30 C 15 26, 25 28, 35 20 S 55 16, 65 12 S 85 8, 100 4",
  "M0 22 C 12 18, 22 26, 34 20 S 56 24, 66 14 S 88 16, 100 10",
  "M0 26 C 14 24, 24 14, 36 18 S 58 10, 70 14 S 86 6, 100 8",
  "M0 18 C 16 20, 26 12, 38 16 S 60 20, 72 12 S 90 14, 100 10",
];

function CommandCentre() {
  return (
    <div className="rounded-2xl border border-white/[0.1] bg-[#08090d] p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white/45">owner.yourgym.com</p>
        <span className="flex gap-1 text-[0.625rem] text-white/45">
          {["Day", "Week", "Month"].map((p, i) => (
            <span key={p} className={cn("rounded-md px-2 py-0.5", i === 1 && "bg-white/10 text-white/80")}>
              {p}
            </span>
          ))}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {["Revenue", "Renewals due", "Attendance trend", "Locations"].map((label, i) => (
          <div key={label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <p className="text-[0.6875rem] text-white/60">{label}</p>
            <span className="mt-2 block h-2 w-1/2 rounded-full bg-white/25" />
            <svg viewBox="0 0 100 34" className="mt-3 h-9 w-full" fill="none" preserveAspectRatio="none">
              <path
                className="gym-draw"
                pathLength={1}
                d={SPARKS[i]}
                stroke={i === 0 ? "#828fff" : i === 2 ? "#67e8f9" : "rgb(255 255 255 / 0.5)"}
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                style={d(200 + i * 150)}
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

const ART: Record<ExpansionKey, () => React.JSX.Element> = {
  member: MemberPhone,
  ops: ControlRoom,
  owner: CommandCentre,
};

const LAYOUT: Record<ExpansionKey, string> = {
  member: "lg:col-span-4 lg:row-span-2",
  ops: "lg:col-span-8",
  owner: "lg:col-span-8",
};

export function ConceptArtefacts() {
  return (
    <InView className="grid gap-6 lg:grid-cols-12" threshold={0.1}>
      {EXPANSION.map((item) => {
        const Art = ART[item.key];
        const isPhone = item.key === "member";
        return (
          <figure
            key={item.key}
            className={cn(
              "flex flex-col gap-6 rounded-3xl border border-dashed border-white/15 bg-[#0b0e14]/80 p-5 sm:p-7",
              isPhone ? "items-stretch" : "sm:flex-row-reverse sm:items-center lg:flex-col lg:items-stretch xl:flex-row-reverse xl:items-center",
              LAYOUT[item.key],
            )}
          >
            <div aria-hidden className={cn(isPhone ? "flex justify-center py-2" : "min-w-0 flex-[1.4]")}>
              <Art />
            </div>
            <figcaption className={cn(!isPhone && "flex-1")}>
              <div className="flex flex-wrap items-center gap-2.5">
                <Kicker>{item.tag}</Kicker>
                <StatusBadge status="concept" />
              </div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-foreground/80">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-2.5">
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </figcaption>
          </figure>
        );
      })}
    </InView>
  );
}
