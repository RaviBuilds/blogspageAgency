"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Mail, Phone, Sparkles } from "lucide-react";

import { trackEvent } from "@/lib/analytics";
import { CONVERSATION, NEED_LABELS } from "@/lib/homepage-data";
import { NICHES } from "@/lib/niches";
import { findApprovedCity } from "@/lib/cities";
import { NAP } from "@/lib/site";

/* ─────────────────────────────────────────────────────────────────────────────
   MOVEMENT 6 — Conversation (Blueprint §21)

   The dark product/terminal panel stays as visual language; the action is
   plain-language. No visitor needs to understand "initialize" or "deploy"
   to contact the agency.

   Preserved contracts:
   - `id="contact"` — the highest-traffic inbound anchor on the site. Every
     `/solutions/*` route links here as `/#contact?niche=<id>&city=<token>`.
   - The `open-ai-chat` window-event contract (Navbar, /contact and blog CTAs
     also dispatch it; ChatWidget listens). This component additionally fires
     the `chat_open` analytics event that was defined but never instrumented.

   Terminal arc (wake → command → Sweety online → human review → CTA ready)
   is driven by ONE framer `useInView(sectionRef, once)` — the sequence now
   starts on viewport arrival, not on page mount, and renders in its final
   state under reduced motion. Only live consumer: this homepage
   (`hotel-hyderabad-landing.tsx` also imports this component but is
   confirmed dead code — architecture report §26).

   D-1 remediation (verified at plan time): per the URL spec, the entire
   `contact?niche=…` string in `/#contact?niche=gym-fitness` IS the fragment,
   so `location.search` is empty and no element matches — the browser never
   scrolled. We parse the parameters out of `location.hash`, scroll to this
   section ourselves, and show the carried context as a chip.
   ───────────────────────────────────────────────────────────────────────────── */

const SPRING = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  mass: 1,
} as const;

const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

type ContactContext = {
  nicheTitle?: string;
  cityLabel?: string;
  needLabel?: string;
};

function parseHashContext(): ContactContext | null {
  if (typeof window === "undefined") return null;
  const match = window.location.hash.match(/^#contact\?(.*)$/);
  if (!match) return null;

  const params = new URLSearchParams(match[1]);
  const nicheId = params.get("niche");
  const city = params.get("city");
  const need = params.get("need");

  const context: ContactContext = {};
  if (nicheId) {
    // NICHES is already in the homepage client bundle (the solution bridge
    // imports it), so resolving the title here adds no new payload and no
    // duplicated catalog.
    context.nicheTitle = NICHES.find((n) => n.id === nicheId)?.title;
  }
  if (city) {
    context.cityLabel = findApprovedCity(city)?.displayName ?? undefined;
  }
  if (need) {
    context.needLabel = NEED_LABELS[need] ?? undefined;
  }

  return context.nicheTitle || context.cityLabel || context.needLabel
    ? context
    : null;
}

/* Typing effect for the panel's command line. Gated on `active` (viewport
   arrival) rather than mount — previously the timers ran from page load, so
   the terminal had always finished typing before the visitor scrolled here.
   The full text renders invisibly as a layout sizer, so the panel height is
   final from first paint (no CLS while typing). Under `instant` (reduced
   motion) the full text renders immediately with no timers and no cursor. */
function TypedLine({
  text,
  active,
  delay = 0,
  className = "",
  instant = false,
}: {
  text: string;
  active: boolean;
  delay?: number;
  className?: string;
  instant?: boolean;
}) {
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!active || instant) return;
    const startTimeout = setTimeout(() => setTyping(true), delay);
    return () => clearTimeout(startTimeout);
  }, [active, delay, instant]);

  useEffect(() => {
    if (!typing) return;
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 28);
    return () => clearInterval(interval);
  }, [typing, text]);

  if (instant) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Layout sizer — final text, invisible; keeps the line's box stable. */}
      <span aria-hidden className="invisible">
        {text}
      </span>
      <span className="absolute inset-0">
        {displayed}
        {typing && displayed.length < text.length && (
          <span className="animate-pulse">▌</span>
        )}
      </span>
    </span>
  );
}

/* System-message reveal: the ✓ lines arrive (fade + 6px rise) rather than
   typing — believable system behaviour, and zero layout shift because the
   full text is laid out from first paint. */
function StatusLine({
  text,
  visible,
  delay = 0,
  className = "",
}: {
  text: string;
  visible: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      transition={{ duration: 0.35, ease: EASE, delay }}
      className={className}
    >
      {text}
    </motion.div>
  );
}

export function ConversationExperience() {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [context, setContext] = useState<ContactContext | null>(null);

  /* ONE motion trigger for the whole terminal arc (wake → connect → ready).
     Under reduced motion the section is ready at mount: everything renders
     in its final state with no animation. */
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const ready = shouldReduceMotion || Boolean(inView);

  /* Sequence helper — delays (ms) and durations collapse to zero under
     reduced motion so nothing animates. */
  const seq = (delayMs: number, duration = 0.4) => ({
    delay: shouldReduceMotion ? 0 : delayMs / 1000,
    duration: shouldReduceMotion ? 0 : duration,
  });

  useEffect(() => {
    const handleHash = () => {
      if (!window.location.hash.startsWith("#contact")) return;
      setContext(parseHashContext());
      // The browser cannot resolve `#contact?…` (no such element id), so the
      // section scrolls itself. `scroll-mt-24` keeps it clear of the navbar.
      sectionRef.current?.scrollIntoView({
        behavior: shouldReduceMotion ? "auto" : "smooth",
        block: "start",
      });
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [shouldReduceMotion]);

  const openChat = () => {
    trackEvent("chat_open", { source: "conversation" });
    window.dispatchEvent(new Event("open-ai-chat"));
  };

  const contextLines = [
    context?.needLabel ? `You're here for: ${context.needLabel}` : null,
    context?.nicheTitle
      ? `Coming from: ${context.nicheTitle}${context.cityLabel ? ` in ${context.cityLabel}` : ""}`
      : null,
  ].filter((line): line is string => Boolean(line));

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="scroll-mt-24 border-t border-border-subtle bg-background py-24 lg:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          variants={container}
          initial={shouldReduceMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16"
        >
          {/* Left column — positioning copy */}
          <motion.div variants={fadeUp}>
            <p className="text-sm font-medium text-primary">
              {CONVERSATION.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {CONVERSATION.heading}
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              {CONVERSATION.sub}
            </p>

            {contextLines.length > 0 ? (
              <div className="mt-5 flex flex-col gap-2">
                {contextLines.map((line) => (
                  <span
                    key={line}
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-foreground"
                  >
                    <Sparkles className="size-3 text-primary" />
                    {line}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Human path — always visible, never behind the chat */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-foreground">
                {CONVERSATION.humanTitle}
              </p>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <a
                  href={NAP.telephoneHref}
                  onClick={() =>
                    trackEvent("contact_cta_click", {
                      cta_location: "conversation",
                      cta_label: "phone",
                      destination: NAP.telephoneHref,
                    })
                  }
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone className="size-4 text-primary" />
                  {NAP.telephone}
                </a>
                <a
                  href={NAP.emailHref}
                  onClick={() =>
                    trackEvent("contact_cta_click", {
                      cta_location: "conversation",
                      cta_label: "email",
                      destination: NAP.emailHref,
                    })
                  }
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="size-4 text-primary" />
                  {NAP.email}
                </a>
                <Link
                  href="/contact"
                  onClick={() =>
                    trackEvent("contact_cta_click", {
                      cta_location: "conversation",
                      cta_label: "contact-page",
                      destination: "/contact",
                    })
                  }
                  className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowRight className="size-4 text-primary" />
                  Contact page — address and hours
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right column — dark conversation panel. It wakes when the
              section arrives: quiet → command → Sweety online → human
              review → CTA ready. Timings are sequenced via `seq`. */}
          <motion.div variants={fadeUp} className="relative">
            {/* Depth on landing — pre-rendered blur, opacity-driven only. */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: ready ? 0.5 : 0 }}
              transition={{ ...seq(0, 0.8) }}
              className="pointer-events-none absolute -inset-3 rounded-3xl bg-black/50 blur-2xl"
            />

            <motion.div
              initial={false}
              animate={ready ? { scale: 1, y: 0 } : { scale: 0.985, y: 8 }}
              transition={{ ...seq(0, 0.45), ease: EASE }}
              className="relative dark overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-black/40"
            >
              {/* Panel chrome */}
              <div className="flex items-center gap-2 border-b border-border-subtle px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-500/70" />
                  <span className="size-2.5 rounded-full bg-yellow-500/70" />
                  <span className="size-2.5 rounded-full bg-emerald-500/70" />
                </div>
                <span className="ml-3 text-xs text-text-disabled">
                  blogspage — say hello
                </span>
                {/* Availability — lights once when Sweety comes online. */}
                <motion.span
                  aria-hidden
                  initial={{ opacity: 0.25, scale: 1 }}
                  animate={
                    ready
                      ? shouldReduceMotion
                        ? { opacity: 1, scale: 1 }
                        : { opacity: [0.25, 1, 1], scale: [1, 1.4, 1] }
                      : { opacity: 0.25, scale: 1 }
                  }
                  transition={{ ...seq(1150, 0.5) }}
                  className="ml-auto size-1.5 rounded-full bg-success"
                />
              </div>

              {/* Scripted lines — plain language. The command types on
                  arrival; the status lines arrive as system messages (fade +
                  dot), not typed. Full text is laid out from first paint, so
                  nothing shifts while the sequence plays. */}
              <div className="p-5 font-mono text-sm leading-relaxed">
                <div className="text-text-subtle">
                  <span className="text-success">$</span>{" "}
                  <TypedLine
                    text={CONVERSATION.typedLines[0]}
                    active={ready}
                    instant={Boolean(shouldReduceMotion)}
                    delay={350}
                    className="text-foreground"
                  />
                </div>

                <StatusLine
                  text={CONVERSATION.typedLines[1]}
                  visible={ready}
                  delay={seq(1150).delay}
                  className="mt-3 text-muted-foreground"
                />

                <StatusLine
                  text={CONVERSATION.typedLines[2]}
                  visible={ready}
                  delay={seq(1500).delay}
                  className="mt-1 text-success"
                />

                <motion.div
                  initial={{ opacity: 0.65 }}
                  animate={{ opacity: ready ? 1 : 0.65 }}
                  transition={{ ...seq(1750, 0.4) }}
                  className="relative mt-5 border-t border-border-subtle pt-5"
                >
                  {/* The line is open — accent hairline, opacity only. */}
                  <motion.div
                    aria-hidden
                    initial={{ opacity: 0 }}
                    animate={{ opacity: ready ? 1 : 0 }}
                    transition={{ ...seq(1750, 0.6) }}
                    className="pointer-events-none absolute inset-x-0 -top-px h-px"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, transparent, rgba(8,145,178,0.45), transparent)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={openChat}
                    className="group inline-flex items-center gap-2 rounded-lg border border-border-strong bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <Sparkles className="size-3.5 text-primary" />
                    <span>{CONVERSATION.sweetyCta}</span>
                    <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                  <p className="mb-0 mt-3 text-xs text-muted-foreground">
                    {CONVERSATION.sweetyNote}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
