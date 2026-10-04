"use client";

import { Compass, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import { Fragment, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { ANATOMY, type AnatomyKey } from "./content";

/**
 * Section 05 — "Every section has a job."
 *
 * An annotated website blueprint. Desktop: the site runs down the middle and
 * every section carries a numbered callout on alternating sides, joined by a
 * leader line, so the page reads like an information-architecture drawing.
 * Selecting a callout (hover, focus or tap) spotlights its block and dims the
 * rest. Mobile: a list of rows, each with a crop of its block.
 *
 * Callouts are real buttons with real text; the website mock is decorative.
 */

const bar = "block h-1.5 rounded-full bg-white/15";

function BlockArt({ k }: { k: AnatomyKey }) {
  switch (k) {
    case "hero":
      return (
        <div className="relative overflow-hidden rounded-md bg-gradient-to-br from-[#1b1f3d] to-[#0f1018] p-4">
          <span className="block h-2.5 w-[62%] rounded-full bg-white/75" />
          <span className="mt-2 block h-2.5 w-[42%] rounded-full bg-gradient-to-r from-[#5e6ad2] to-[#9333ea]" />
          <span className={cn(bar, "mt-3 w-[70%]")} />
          <div className="mt-3 flex gap-2">
            <span className="h-5 w-20 rounded-full bg-white/85" />
            <span className="h-5 w-16 rounded-full border border-white/20" />
          </div>
        </div>
      );
    case "programs":
      return (
        <div className="grid grid-cols-3 gap-2">
          {["Beginner", "Strength", "Classes"].map((p) => (
            <div key={p} className="rounded-md border border-white/[0.07] bg-white/[0.03] p-2">
              <span className="block h-7 rounded bg-primary/15" />
              <span className="mt-1.5 block text-[0.5625rem] text-white/60">{p}</span>
            </div>
          ))}
        </div>
      );
    case "trainers":
      return (
        <div className="grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((n) => (
            <div key={n} className="flex flex-col items-center gap-1.5">
              <span className={cn("size-8 rounded-full", n % 2 ? "bg-white/10" : "bg-primary/20")} />
              <span className={cn(bar, "w-[80%]")} />
            </div>
          ))}
        </div>
      );
    case "gallery":
      return (
        <div className="grid grid-cols-4 grid-rows-2 gap-1.5">
          <span className="col-span-2 row-span-2 h-[3.75rem] rounded bg-gradient-to-br from-primary/25 to-fuchsia-500/15" />
          <span className="h-7 rounded bg-white/[0.07]" />
          <span className="h-7 rounded bg-primary/15" />
          <span className="h-7 rounded bg-fuchsia-500/15" />
          <span className="h-7 rounded bg-white/[0.07]" />
        </div>
      );
    case "reviews":
      return (
        <div className="grid grid-cols-2 gap-2">
          {[0, 1].map((n) => (
            <div key={n} className="rounded-md border border-white/[0.07] p-2">
              <span className="flex gap-0.5">
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star key={s} className="size-2.5 fill-amber-300/70 text-amber-300/70" />
                ))}
              </span>
              <span className={cn(bar, "mt-2 w-[90%]")} />
              <span className={cn(bar, "mt-1 w-[60%] bg-white/10")} />
            </div>
          ))}
        </div>
      );
    case "membership":
      return (
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((n) => (
            <div key={n} className={cn("rounded-md border p-2", n === 1 ? "border-primary/40 bg-primary/10" : "border-white/[0.07] bg-white/[0.03]")}>
              <span className={cn(bar, "w-[60%] bg-white/30")} />
              <span className={cn(bar, "mt-2 w-full bg-white/10")} />
              <span className={cn(bar, "mt-1 w-[70%] bg-white/10")} />
            </div>
          ))}
        </div>
      );
    case "faq":
      return (
        <div className="space-y-2">
          {["w-[55%]", "w-[42%]", "w-[62%]"].map((w) => (
            <div key={w} className="flex items-center justify-between border-b border-white/[0.06] pb-1.5">
              <span className={cn(bar, w)} />
              <span className="text-[0.625rem] leading-none text-white/40">+</span>
            </div>
          ))}
        </div>
      );
    case "guidance":
      return (
        <div className="flex items-center gap-3 rounded-md border border-primary/30 bg-primary/[0.07] p-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/20">
            <Compass className="size-4 text-primary" />
          </span>
          <div className="flex-1">
            <span className="block text-[0.625rem] font-medium text-white/80">Find your starting point</span>
            <span className={cn(bar, "mt-1.5 w-[70%]")} />
          </div>
          <span className="h-5 w-14 rounded-full bg-primary/70" />
        </div>
      );
    case "contact":
      return (
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-16 items-center justify-center rounded-md bg-[#1b2230]">
            <MapPin className="size-4 fill-[#ea4335] text-[#ea4335]" />
          </span>
          <span className="flex h-7 flex-1 items-center justify-center gap-1 rounded-full bg-[#25d366]/90 text-[0.625rem] font-semibold text-[#06260f]">
            <MessageCircle className="size-3" /> WhatsApp
          </span>
          <span className="flex h-7 w-16 items-center justify-center gap-1 rounded-full border border-white/15 text-[0.625rem] text-white/70">
            <Phone className="size-3" /> Call
          </span>
        </div>
      );
  }
}

function Callout({
  i,
  row,
  side,
  active,
  onActivate,
}: {
  i: number;
  row: number;
  side: "left" | "right";
  active: boolean;
  onActivate: () => void;
}) {
  const item = ANATOMY[i];
  const pin = (
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-[0.6875rem] tabular-nums transition-colors duration-300",
        active ? "border-primary bg-primary text-primary-foreground" : "border-white/20 bg-[#070a10] text-foreground/60",
      )}
    >
      {String(i + 1).padStart(2, "0")}
    </span>
  );
  const line = (
    <span
      aria-hidden
      className={cn(
        "h-px min-w-6 flex-1 border-t transition-colors duration-300",
        active ? "border-solid border-primary" : "border-dashed border-white/15",
      )}
    />
  );
  const text = (
    <span className={cn("w-52 shrink-0 xl:w-60", side === "left" ? "text-right" : "text-left")}>
      <span className="block font-mono text-[0.625rem] uppercase tracking-[0.18em] text-foreground/50">{item.section}</span>
      <span
        className={cn(
          "mt-1 block text-lg font-medium leading-snug tracking-tight transition-colors duration-300",
          active ? "text-foreground" : "text-foreground/55",
        )}
      >
        &ldquo;{item.question}&rdquo;
      </span>
    </span>
  );

  return (
    <div role="listitem" style={{ gridRow: row }} className={cn("flex items-center", side === "left" ? "col-start-1" : "col-start-3")}>
      <button
        type="button"
        onMouseEnter={onActivate}
        onFocus={onActivate}
        onClick={onActivate}
        aria-pressed={active}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          side === "left" ? "flex-row pl-2" : "flex-row pr-2",
        )}
      >
        {side === "left" ? (
          <>
            {text}
            {line}
            {pin}
          </>
        ) : (
          <>
            {pin}
            {line}
            {text}
          </>
        )}
      </button>
    </div>
  );
}

function MockCell({
  children,
  className,
  row,
  active,
  dim,
  onActivate,
}: {
  children: ReactNode;
  className?: string;
  row: number;
  active?: boolean;
  dim?: boolean;
  onActivate?: () => void;
}) {
  return (
    <div
      aria-hidden
      style={{ gridRow: row }}
      onMouseEnter={onActivate}
      className={cn("col-start-2 border-x border-white/[0.1] bg-[#0b0c10] px-4 py-2", className)}
    >
      <div
        className={cn(
          "rounded-lg border p-2.5 transition-all duration-300",
          active
            ? "border-primary/70 bg-primary/[0.07] shadow-[0_0_0_1px_rgba(130,143,255,0.25),0_16px_40px_-18px_rgba(94,106,210,0.7)]"
            : "border-transparent",
          dim && "opacity-40",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function AnnotatedWebsite() {
  const [active, setActive] = useState(0);

  return (
    <>
      {/* Desktop blueprint */}
      <div role="list" className="hidden grid-cols-[minmax(0,1fr)_minmax(0,500px)_minmax(0,1fr)] gap-x-6 lg:grid xl:gap-x-10">
        {/* browser chrome */}
        <div aria-hidden style={{ gridRow: 1 }} className="col-start-2 flex items-center gap-1.5 rounded-t-2xl border border-white/[0.1] bg-[#15171c] px-4 py-3">
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="ml-3 flex-1 truncate rounded-md border border-white/[0.08] bg-black/40 px-3 py-1 text-[0.6875rem] text-white/45">
            examplegym.in
          </span>
        </div>
        {ANATOMY.map((item, i) => {
          const side = i % 2 === 0 ? "left" : "right";
          const last = i === ANATOMY.length - 1;
          return (
            <Fragment key={item.key}>
              <MockCell
                row={i + 2}
                active={active === i}
                dim={active !== i}
                onActivate={() => setActive(i)}
                className={cn(last && "rounded-b-2xl border-b pb-4")}
              >
                <BlockArt k={item.key} />
              </MockCell>
              <Callout row={i + 2} i={i} side={side} active={active === i} onActivate={() => setActive(i)} />
            </Fragment>
          );
        })}
      </div>

      {/* Mobile rows */}
      <ol className="divide-y divide-white/[0.08] border-y border-white/[0.08] lg:hidden">
        {ANATOMY.map((item, i) => {
          const isActive = active === i;
          return (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className="flex min-h-16 w-full items-center gap-4 py-4 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border font-mono text-[0.6875rem] tabular-nums",
                    isActive ? "border-primary bg-primary text-primary-foreground" : "border-white/20 text-foreground/60",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[0.625rem] uppercase tracking-[0.16em] text-foreground/50">{item.section}</span>
                  <span className={cn("mt-0.5 block text-base font-medium leading-snug tracking-tight", isActive ? "text-foreground" : "text-foreground/75")}>
                    &ldquo;{item.question}&rdquo;
                  </span>
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "h-[58px] w-[104px] shrink-0 overflow-hidden rounded-lg border bg-[#0b0c10] p-1.5",
                    isActive ? "border-primary/60" : "border-white/10",
                  )}
                >
                  <span className="block w-[182px] origin-top-left scale-50">
                    <BlockArt k={item.key} />
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </>
  );
}
