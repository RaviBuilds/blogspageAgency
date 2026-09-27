/**
 * Web Design page — section chrome.
 *
 * One header component and one eyebrow, so eleven sections stop re-declaring
 * the same three typographic decisions eleven times. The value is not saved
 * keystrokes: it is that the page's *hierarchy* becomes a property of this file
 * rather than an accident of which section was written last. Before this, every
 * section on the page shipped the identical `text-3xl sm:text-4xl` centred
 * header, which is exactly why the page read as a sequence of documentation
 * blocks.
 *
 * ## The three registers
 *
 * - `statement` — the page's raised voice. Four uses: the problem diagnosis, the
 *   70/20/10 framework, the core design service, and the proof gallery. These
 *   are the beats a visitor scanning the page must not miss.
 * - `section` — the workhorse. Supporting pillars and the FAQ.
 * - `quiet` — reference registers that should not compete.
 *
 * `align="left"` is the new default. A page where every header is centred has no
 * axis, and an editorial composition needs one; centring is now reserved for the
 * two moments that genuinely address the whole viewport (the framework and the
 * closing FAQ).
 *
 * Server-renderable. Motion is applied by the caller wrapping this in
 * `ScrollReveal`, so the header's text is always present in the served HTML.
 */

import type { ReactNode } from "react";

import {
  TYPE_LEAD,
  TYPE_MICRO,
  TYPE_QUIET,
  TYPE_SECTION,
  TYPE_STATEMENT,
} from "@/lib/brand-type";
import { cn } from "@/lib/utils";

const REGISTER = {
  statement: TYPE_STATEMENT,
  section: TYPE_SECTION,
  quiet: TYPE_QUIET,
} as const;

const ACCENT_TEXT = {
  blue: "text-accent-blue",
  violet: "text-accent-violet",
  cyan: "text-accent-cyan",
  ink: "text-text-subtle",
  onDark: "text-accent-cyan",
} as const;

export type HeaderAccent = keyof typeof ACCENT_TEXT;

/**
 * The page's structural kicker.
 *
 * A short rule precedes the label so the eyebrow reads as a marker on the page's
 * left axis rather than as a floating caption. The rule is decorative and the
 * label is real text, which keeps the section's own words in the served HTML.
 */
export function Eyebrow({
  children,
  accent = "blue",
  className,
}: {
  children: ReactNode;
  accent?: HeaderAccent;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span
        aria-hidden
        className={cn(
          "h-px w-8 shrink-0 bg-current opacity-40",
          ACCENT_TEXT[accent],
        )}
      />
      <span className={cn(TYPE_MICRO, ACCENT_TEXT[accent])}>{children}</span>
    </span>
  );
}

/**
 * Eyebrow + heading + lead, at one of three registers.
 *
 * The heading always renders as an `<h2>`, because that is what every consumer
 * on this page needs for the document outline. `register` changes only the
 * visual voice: no consumer promotes a heading level to gain size, and none
 * needs to.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  register = "section",
  accent = "blue",
  align = "left",
  tone = "light",
  measure = "max-w-3xl",
  className,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  register?: keyof typeof REGISTER;
  accent?: HeaderAccent;
  align?: "left" | "center";
  tone?: "light" | "dark";
  /** Measure of the lead paragraph. The heading gets its own balance. */
  measure?: string;
  className?: string;
  children?: ReactNode;
}) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        centered && "mx-auto text-center",
        centered ? measure : "max-w-4xl",
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow
          accent={accent}
          className={centered ? "justify-center" : undefined}
        >
          {eyebrow}
        </Eyebrow>
      ) : null}

      <h2
        className={cn(
          "mt-6",
          REGISTER[register],
          tone === "dark" ? "text-surface-dark-foreground" : "text-foreground",
        )}
      >
        {title}
      </h2>

      {lead ? (
        <p
          className={cn(
            "mt-5",
            TYPE_LEAD,
            tone === "dark" && "text-white/60",
            centered ? "mx-auto" : measure,
          )}
        >
          {lead}
        </p>
      ) : null}

      {children}
    </div>
  );
}

/**
 * The quiet scope-boundary panel used by the branding, local-visibility and
 * proof sections.
 *
 * Extracted because all three shipped the same "icon + bold title + text inside
 * a tinted rounded box" and the boundaries are the page's most legally and
 * commercially load-bearing copy — they should look identical everywhere, and
 * they should look like a margin note rather than a warning. A left rule and
 * ordinary prose achieves that; a tinted alert box does not.
 */
export function ScopeNote({
  title,
  children,
  accent = "blue",
  className,
}: {
  title?: string;
  children: ReactNode;
  accent?: HeaderAccent;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-l-2 pl-5",
        accent === "violet" && "border-accent-violet/40",
        accent === "cyan" && "border-accent-cyan/40",
        accent === "blue" && "border-accent-blue/40",
        accent === "ink" && "border-border-strong",
        accent === "onDark" && "border-white/20",
        className,
      )}
    >
      <p className="text-sm leading-relaxed text-text-subtle">
        {title ? (
          <span className="font-semibold text-foreground">{title} </span>
        ) : null}
        {children}
      </p>
    </div>
  );
}
