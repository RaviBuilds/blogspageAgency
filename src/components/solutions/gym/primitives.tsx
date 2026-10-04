import type { ReactNode } from "react";

import { ScrollReveal } from "@/components/home/scroll-reveal";
import { TYPE_DISPLAY, TYPE_STATEMENT } from "@/lib/brand-type";
import {
  RHYTHM_CHAPTER,
  RHYTHM_CONTINUE,
  RHYTHM_MOVEMENT,
  RHYTHM_QUIET,
  RHYTHM_SECTION,
} from "@/lib/section-rhythm";
import { cn } from "@/lib/utils";

import { STATUS_LABEL, type ChapterId, type Status } from "./content";

/**
 * Layout primitives for the gym solution page.
 *
 * Server components. Reveals go through the shared `ScrollReveal`, which ships
 * visible content in the prerendered HTML and only arms the hidden state after
 * hydration (see `src/components/home/scroll-reveal.tsx`).
 *
 * Each chapter of the page picks a `surface` (what world the section lives in)
 * and a `rhythm` (how much air it gets relative to its neighbours), so section
 * boundaries carry meaning before any copy is read.
 */

export type Surface = "ink" | "system" | "blueprint" | "stage" | "whatsapp" | "paper";
export type Rhythm = "chapter" | "movement" | "section" | "continue" | "quiet" | "compact";

const RHYTHM: Record<Rhythm, string> = {
  chapter: RHYTHM_CHAPTER,
  movement: RHYTHM_MOVEMENT,
  section: RHYTHM_SECTION,
  continue: RHYTHM_CONTINUE,
  quiet: RHYTHM_QUIET,
  compact: "py-20 lg:py-24",
};

const SURFACE: Record<Surface, string> = {
  ink: "",
  system: "gym-surface-system",
  blueprint: "gym-surface-blueprint",
  stage: "gym-surface-stage",
  whatsapp: "gym-surface-whatsapp",
  paper: "gym-paper",
};

export function GymSection({
  id,
  className,
  children,
  rhythm = "section",
  surface = "ink",
  chapter,
  width = "max-w-6xl",
  label,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  rhythm?: Rhythm;
  surface?: Surface;
  chapter?: ChapterId;
  width?: string;
  /** Accessible name for the section landmark, when it has no heading id. */
  label?: string;
}) {
  return (
    <section
      id={id}
      data-chapter={chapter}
      aria-label={label}
      className={cn("relative scroll-mt-20", RHYTHM[rhythm], SURFACE[surface], className)}
    >
      <div className={cn("relative mx-auto px-6 lg:px-8", width)}>{children}</div>
    </section>
  );
}

/** A quiet act marker that opens a new movement of the story. */
export function ActLabel({ act, title, className }: { act: string; title: string; className?: string }) {
  return (
    <p className={cn("mb-10 flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-foreground/45", className)}>
      <span className="text-primary/80">{act}</span>
      <span aria-hidden className="h-px w-8 bg-current opacity-50" />
      {title}
    </p>
  );
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  headingId,
  lead,
  className,
  titleClassName,
  size = "section",
  align = "stack",
  aside,
}: {
  index: string;
  eyebrow: string;
  title: string;
  headingId?: string;
  lead?: ReactNode;
  className?: string;
  titleClassName?: string;
  /** `statement` is reserved for the page's three peak chapters (06, 07, 10). */
  size?: "section" | "statement" | "display";
  /** `split` puts the lead beside the heading on desktop; `center` centres both. */
  align?: "stack" | "split" | "center";
  /** Optional element beside the eyebrow (e.g. a status badge). */
  aside?: ReactNode;
}) {
  const sizeClass =
    size === "display"
      ? TYPE_DISPLAY
      : size === "statement"
        ? TYPE_STATEMENT
        : "text-3xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]";

  return (
    <ScrollReveal
      className={cn(
        align === "split" && "grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16",
        align === "center" && "mx-auto max-w-3xl text-center",
        align === "stack" && "max-w-3xl",
        className,
      )}
    >
      <div>
        <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2", align === "center" && "justify-center")}>
          <span className="font-mono text-xs tabular-nums text-primary">{index}</span>
          <span aria-hidden className="h-px w-8 bg-current opacity-25" />
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-foreground/70">{eyebrow}</span>
          {aside}
        </div>
        <h2 id={headingId} className={cn("mt-5", sizeClass, titleClassName)}>
          {title}
        </h2>
      </div>
      {lead ? (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg",
            align === "split" ? "mt-5 lg:mt-0 lg:pb-1.5" : "mt-5",
            align === "center" && "mx-auto",
          )}
        >
          {lead}
        </p>
      ) : null}
    </ScrollReveal>
  );
}

/** Small uppercase label used on diagrams. */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground", className)}>
      {children}
    </span>
  );
}

const BADGE: Record<Status, string> = {
  required: "border-white/30 bg-white text-black",
  recommended: "border-primary/50 bg-primary/15 text-primary",
  included: "border-white/15 bg-white/[0.06] text-foreground/80",
  demo: "border-[#25d366]/40 bg-[#25d366]/10 text-[#7ee2a8]",
  "add-on": "border-amber-300/30 bg-amber-300/10 text-amber-200",
  concept: "border-dashed border-white/25 bg-transparent text-foreground/65",
};

/** One honesty label vocabulary for the whole page. */
export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-medium uppercase tracking-[0.1em]",
        BADGE[status],
        className,
      )}
    >
      {status === "demo" ? <span aria-hidden className="size-1.5 rounded-full bg-[#25d366]" /> : null}
      {STATUS_LABEL[status]}
    </span>
  );
}
