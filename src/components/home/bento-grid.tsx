"use client";

import { useRef, type MouseEvent } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NICHES, type Niche } from "@/lib/niches";
import { cn } from "@/lib/utils";

function NicheCard({ niche }: { niche: Niche }) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  // Mouse-tracking glow: write cursor position into CSS vars (no re-render).
  const handleMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  const Icon = niche.icon;

  return (
    <Link
      ref={cardRef}
      href={niche.href()}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] p-6",
        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:border-white/[0.16] hover:bg-white/[0.04]",
        niche.className,
      )}
    >
      {/* Mouse-tracking radial glow overlay */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(280px circle at var(--mx,50%) var(--my,50%), rgba(94,106,210,0.20), transparent 60%)",
        }}
      />

      {niche.featured && (
        <span className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-primary/20 blur-3xl" />
      )}

      <div className="relative flex h-full flex-col">
        <div className="flex size-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
          <Icon className="size-5 text-primary" />
        </div>

        <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {niche.focus}
        </p>
        <h3 className="mt-1 text-lg font-medium tracking-tight">{niche.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {niche.description}
        </p>

        <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-foreground/70 transition-colors group-hover:text-foreground">
          View solution
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function BentoGrid() {
  return (
    <section id="solutions" className="border-t border-white/[0.06] py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Solutions</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Ten industries. One engineering standard.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Purpose-built digital ecosystems for the verticals we know best,
            each tuned to the exact way that business makes and keeps revenue.
          </p>
        </div>

        <div className="mt-16 grid auto-rows-[minmax(11rem,auto)] gap-4 md:grid-cols-4">
          {NICHES.map((niche) => (
            <NicheCard key={niche.id} niche={niche} />
          ))}
        </div>
      </div>
    </section>
  );
}
