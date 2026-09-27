/**
 * Web Design page — device frames and abstract UI atoms.
 *
 * The page's subject is digital design, so its imagery has to be interfaces
 * rather than photography. Everything in this file draws an interface out of
 * divs and one inline accent: no image requests, no icon fonts, no canvas, no
 * new dependency. A ten-card industry gallery therefore costs zero bytes of
 * media, which is what keeps section 27 (performance) satisfiable at the same
 * time as section 18 (imagery).
 *
 * ## Contract
 *
 * - Every export here is decorative. Callers wrap them in `aria-hidden` and
 *   carry the meaning in real text beside the artwork. Nothing in this file
 *   renders a heading, a link, or a string a visitor needs.
 * - Server-renderable: no hooks, no `"use client"`, no motion. Animation is the
 *   caller's business, applied to the wrapper.
 * - Accent colour arrives as a hex string and is applied inline, because these
 *   shapes need alpha compositing (`color-mix` on a CSS variable is not safe
 *   across the browser floor this project supports).
 */

import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Colour helpers                                                             */
/* -------------------------------------------------------------------------- */

/**
 * `#RRGGBB` → `rgba(r, g, b, alpha)`.
 *
 * Small on purpose: the alternative is authoring every accent twice (solid plus
 * a hand-written rgba twin) in `web-design-visual-system.ts`, which is two
 * chances for a hue to drift apart from itself.
 */
export function alpha(hex: string, a: number): string {
  const v = hex.replace("#", "");
  const full =
    v.length === 3
      ? v
          .split("")
          .map((c) => c + c)
          .join("")
      : v;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/* -------------------------------------------------------------------------- */
/* Frames                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Browser chrome: three dots and an address rail.
 *
 * Deliberately restrained — no traffic-light colours, no tab strip, no toolbar
 * icons. The frame exists to say "this is a website" in one glance and then get
 * out of the way of the composition inside it. The address rail is an abstract
 * pill rather than real text, so the frame never introduces a string that could
 * read as a claim about a domain we do not own.
 */
export function BrowserChrome({
  tone = "paper",
  className,
}: {
  tone?: "paper" | "ink";
  className?: string;
}) {
  const ink = tone === "ink";
  return (
    <div
      aria-hidden
      className={cn(
        "flex items-center gap-1.5 border-b px-3 py-2.5",
        ink
          ? "border-white/10 bg-white/[0.04]"
          : "border-border-subtle bg-background-subtle",
        className,
      )}
    >
      <span
        className={cn("size-2 rounded-full", ink ? "bg-white/20" : "bg-border-strong")}
      />
      <span
        className={cn("size-2 rounded-full", ink ? "bg-white/15" : "bg-border")}
      />
      <span
        className={cn("size-2 rounded-full", ink ? "bg-white/10" : "bg-border")}
      />
      <span
        className={cn(
          "ml-2.5 h-3.5 flex-1 rounded-full border",
          ink ? "border-white/10 bg-white/[0.03]" : "border-border-subtle bg-card",
        )}
      />
    </div>
  );
}

/**
 * A website inside a browser window.
 *
 * `elevation` is the page's depth vocabulary in three steps rather than a
 * shadow chosen per call site: `flat` for artwork that sits inside another
 * surface, `raised` for a gallery tile, `hero` for the one composition that is
 * meant to feel like it is floating off the page.
 */
export function BrowserFrame({
  children,
  tone = "paper",
  elevation = "raised",
  className,
  bodyClassName,
  style,
}: {
  children: ReactNode;
  tone?: "paper" | "ink";
  elevation?: "flat" | "raised" | "hero";
  className?: string;
  bodyClassName?: string;
  style?: CSSProperties;
}) {
  const ink = tone === "ink";
  return (
    <div
      aria-hidden
      className={cn(
        "overflow-hidden rounded-xl border",
        ink ? "border-white/10 bg-[#0B0E14]" : "border-border bg-card",
        elevation === "raised" && "shadow-[0_18px_40px_-28px_rgb(14_21_36/0.45)]",
        elevation === "hero" &&
          "shadow-[0_44px_90px_-40px_rgb(14_21_36/0.42),0_10px_24px_-14px_rgb(14_21_36/0.20)]",
        className,
      )}
      style={style}
    >
      <BrowserChrome tone={tone} />
      <div className={cn("relative", bodyClassName)}>{children}</div>
    </div>
  );
}

/**
 * A phone, drawn as a rounded slab with a notch rail.
 *
 * Used only where the responsive story is the point (the hero composition and
 * the core-design showcase). Elsewhere a second frame competing with the
 * browser window just halves the size of both.
 */
export function PhoneFrame({
  children,
  className,
  bodyClassName,
  style,
}: {
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "overflow-hidden rounded-[1.75rem] border border-border bg-card p-1.5",
        "shadow-[0_30px_60px_-30px_rgb(14_21_36/0.45)]",
        className,
      )}
      style={style}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.4rem] border border-border-subtle bg-background",
          bodyClassName,
        )}
      >
        <div className="flex justify-center pt-2">
          <span className="h-1 w-10 rounded-full bg-border-strong" />
        </div>
        {children}
      </div>
    </div>
  );
}

/**
 * A floating fragment that reads as a detached piece of a design file — a token
 * swatch strip, a type specimen, a component state.
 *
 * Its own surface and border rather than the page's card token: a fragment that
 * looks exactly like every other card on the page does not read as "lifted out
 * of a design tool", which is the whole illusion.
 */
export function FloatingFragment({
  children,
  label,
  className,
  style,
}: {
  children?: ReactNode;
  label?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-xl border border-border/80 bg-card/90 p-3 backdrop-blur-sm",
        "shadow-[0_22px_45px_-26px_rgb(14_21_36/0.42)]",
        className,
      )}
      style={style}
    >
      {label ? (
        <span className="block text-[0.625rem] font-medium uppercase tracking-[0.14em] text-text-disabled">
          {label}
        </span>
      ) : null}
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* UI atoms                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * A line of abstract body copy or a heading bar.
 *
 * `color` wins over `tone` when supplied, which is how an accented heading bar
 * is drawn without a fourth tone keyword per hue.
 */
export function Line({
  w = "w-full",
  h = "h-1.5",
  tone = "muted",
  color,
  className,
}: {
  w?: string;
  h?: string;
  tone?: "muted" | "strong" | "ink" | "faint";
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "block rounded-full",
        h,
        w,
        !color && tone === "faint" && "bg-border-subtle",
        !color && tone === "muted" && "bg-border",
        !color && tone === "strong" && "bg-border-strong",
        !color && tone === "ink" && "bg-foreground/70",
        className,
      )}
      style={color ? { backgroundColor: color } : undefined}
    />
  );
}

/** A stack of abstract copy lines with a decreasing measure. */
export function Paragraph({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  const widths = ["w-full", "w-[92%]", "w-[78%]", "w-[85%]", "w-[64%]"];
  return (
    <span className={cn("flex flex-col gap-1.5", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Line key={i} w={widths[i % widths.length]} h="h-1.5" />
      ))}
    </span>
  );
}

/** A filled pill standing in for a button or CTA. */
export function Pill({
  accent,
  w = "w-16",
  h = "h-4",
  className,
}: {
  accent: string;
  w?: string;
  h?: string;
  className?: string;
}) {
  return (
    <span
      className={cn("block rounded-full", w, h, className)}
      style={{ backgroundColor: accent }}
    />
  );
}

/** A navigation rail: a mark, three items and an action. */
export function MockNav({
  accent,
  tone = "paper",
  className,
}: {
  accent: string;
  tone?: "paper" | "ink";
  className?: string;
}) {
  const ink = tone === "ink";
  return (
    <div className={cn("flex items-center gap-2 px-3 py-2.5", className)}>
      <span
        className="size-3 shrink-0 rounded-[0.25rem]"
        style={{ backgroundColor: accent }}
      />
      <span className="flex flex-1 items-center gap-2">
        {[10, 8, 9].map((w, i) => (
          <span
            key={i}
            className={cn("h-1 rounded-full", ink ? "bg-white/25" : "bg-border-strong")}
            style={{ width: `${w * 2}px` }}
          />
        ))}
      </span>
      <span
        className="h-3 w-9 rounded-full"
        style={{ backgroundColor: alpha(accent, ink ? 0.55 : 0.3) }}
      />
    </div>
  );
}
