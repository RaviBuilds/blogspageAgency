"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Compass,
  MapPinned,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { buildEnquiry, PLANNER_ANCHOR, TOOL_FLOW } from "./content";
import { PhoneShell } from "./visuals";

/**
 * Section 06 — a working sample of the three interactive member tools.
 *
 * This is a demonstration, not the production tools: the answers and plan logic
 * are generic and the copy says so. What it shows is the shape of the
 * experience a gym's visitors get, laid out as the product's own flow:
 * INPUT (short choices) -> GUIDANCE / RESULT (a personalized starting point) ->
 * ENQUIRY (a WhatsApp message that arrives with context). No answers leave the
 * browser.
 *
 * The planner tab is reachable by anchor (`#plan-your-first-30-days`) so the
 * hero's planner link can open it directly.
 */

type ToolId = "starting-point" | "journey" | "first-30-days";

const TOOLS: { id: ToolId; index: string; name: string; blurb: string; icon: LucideIcon }[] = [
  { id: "starting-point", index: "01", name: "Find Your Starting Point", blurb: "A few questions, one clear place to begin.", icon: Compass },
  { id: "journey", index: "02", name: "Map Your Fitness Journey", blurb: "See what the first months can look like.", icon: MapPinned },
  { id: "first-30-days", index: "03", name: "Plan Your First 30 Days", blurb: "A simple first month around your week.", icon: CalendarDays },
];

const GOALS = [
  { id: "weight", label: "Lose weight", phrase: "lose some weight", focus: "building a routine you can sustain" },
  { id: "strength", label: "Build strength", phrase: "build strength", focus: "progressive strength training" },
  { id: "fitness", label: "Get fitter", phrase: "improve my fitness", focus: "general fitness and stamina" },
  { id: "unsure", label: "Not sure yet", phrase: "work out where to start", focus: "trying a few things to find what you enjoy" },
] as const;

const LEVELS = [
  {
    id: "new",
    label: "New to gyms",
    intro: "I'm new to gyms",
    title: "Start with guided basics",
    program: "Beginner program + orientation",
    body: "Begin with a walkthrough of the floor and equipment, then a beginner-friendly program with your trainers alongside you.",
    first: "A walkthrough of the gym and your first supported sessions.",
  },
  {
    id: "some",
    label: "Some experience",
    intro: "I have some gym experience",
    title: "Build on what you know",
    program: "Structured program + trainer check-in",
    body: "Pick a structured program that fits your goal, with a trainer check-in so your plan matches where you are today.",
    first: "A quick check-in on where you are and a plan that fits your goal.",
  },
  {
    id: "regular",
    label: "Train regularly",
    intro: "I already train regularly",
    title: "Fine-tune your training",
    program: "Specialised program options",
    body: "Look at more focused program options and decide what you want to change about your current routine.",
    first: "Share your current routine and what you want to change.",
  },
] as const;

const DAYS = [2, 3, 4, 5] as const;

const TIMES = [
  { id: "morning", label: "Mornings", phrase: "in the mornings" },
  { id: "evening", label: "Evenings", phrase: "in the evenings" },
] as const;

/** Weekday indices (Mon = 0) that carry a session for each weekly frequency. */
const SESSION_DAYS: Record<number, number[]> = {
  2: [1, 5],
  3: [0, 2, 4],
  4: [0, 1, 3, 5],
  5: [0, 1, 2, 4, 5],
};

const WEEK_FOCUS = ["Get familiar", "Build the habit", "Add challenge", "Review & adjust"] as const;

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"] as const;

/* -------------------------------------------------------------------------- */
/* Small controls                                                             */
/* -------------------------------------------------------------------------- */

function ChipGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const labelId = useId();
  return (
    <div>
      <p id={labelId} className="text-sm font-medium text-foreground/85">
        {label}
      </p>
      <div role="radiogroup" aria-labelledby={labelId} className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
                selected
                  ? "border-primary bg-primary/20 text-foreground"
                  : "border-white/12 bg-white/[0.03] text-foreground/65 hover:border-white/25 hover:text-foreground",
              )}
            >
              {selected ? <Check aria-hidden className="size-3.5 text-primary" /> : null}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ColumnHead({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="mb-5 flex items-center gap-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-foreground/50">
      <span className="flex size-5 items-center justify-center rounded-full border border-primary/50 text-[0.5625rem] text-primary">{n}</span>
      {children}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/* Demo                                                                       */
/* -------------------------------------------------------------------------- */

export function MemberToolsDemo() {
  const [tool, setTool] = useState<ToolId>("starting-point");
  const [goalId, setGoalId] = useState<(typeof GOALS)[number]["id"]>("weight");
  const [levelId, setLevelId] = useState<(typeof LEVELS)[number]["id"]>("new");
  const [days, setDays] = useState<number>(3);
  const [timeId, setTimeId] = useState<(typeof TIMES)[number]["id"]>("evening");

  const reduce = Boolean(useReducedMotion());
  const baseId = useId();

  const goal = GOALS.find((g) => g.id === goalId)!;
  const level = LEVELS.find((l) => l.id === levelId)!;
  const time = TIMES.find((t) => t.id === timeId)!;

  // The hero's planner link is a plain in-page anchor; opening the matching tab
  // here is the only JS it needs.
  useEffect(() => {
    const open = () => {
      if (window.location.hash === `#${PLANNER_ANCHOR}`) setTool("first-30-days");
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest(`a[href="#${PLANNER_ANCHOR}"]`)) setTool("first-30-days");
    };
    open();
    window.addEventListener("hashchange", open);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", open);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const enquiry = buildEnquiry({ levelIntro: level.intro, goalPhrase: goal.phrase, days, timePhrase: time.phrase });

  // Flash the enquiry when a choice changes it (not on first render).
  const first = useRef(true);
  const [flashKey, setFlashKey] = useState(0);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setFlashKey((k) => k + 1);
  }, [enquiry]);

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % TOOLS.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + TOOLS.length) % TOOLS.length;
    else return;
    event.preventDefault();
    setTool(TOOLS[next].id);
    document.getElementById(`${baseId}-tab-${TOOLS[next].id}`)?.focus();
  };

  const activeTool = TOOLS.find((t) => t.id === tool)!;
  const resultKey = `${tool}-${goalId}-${levelId}-${days}-${timeId}`;

  const enquiryBubble = (
    <div
      key={flashKey}
      className={cn("rounded-xl rounded-tr-sm bg-[#005c4b] px-3 py-2.5 text-[0.8125rem] leading-snug text-white/92", flashKey > 0 && "gym-flash")}
    >
      {enquiry}
    </div>
  );

  return (
    <div className="overflow-clip rounded-[1.75rem] border border-white/[0.1] bg-[#08090f]/90 shadow-[0_60px_160px_-60px_rgba(94,106,210,0.55)]">
      {/* app chrome + segmented control */}
      <div className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#0c0e16]/95 backdrop-blur-md lg:static">
        <div className="hidden items-center gap-1.5 border-b border-white/[0.05] px-5 py-3 lg:flex">
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/10" />
          <span className="ml-3 rounded-md border border-white/[0.08] bg-black/40 px-3 py-1 text-[0.6875rem] text-white/45">
            examplegym.in/start
          </span>
          <ol aria-label="How the tools work" className="ml-auto flex items-center gap-2 text-[0.6875rem] text-foreground/55">
            {TOOL_FLOW.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className={cn("font-mono uppercase tracking-[0.16em]", i === TOOL_FLOW.length - 1 && "text-[#7ee2a8]")}>{step}</span>
                {i < TOOL_FLOW.length - 1 ? <ArrowRight aria-hidden className="size-3 text-foreground/30" /> : null}
              </li>
            ))}
          </ol>
        </div>
        <div role="tablist" aria-label="Interactive member tools" className="grid grid-cols-3 gap-1 p-2 lg:p-3">
          {TOOLS.map((item, i) => {
            const selected = item.id === tool;
            return (
              <button
                key={item.id}
                id={`${baseId}-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setTool(item.id)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-center outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50 sm:flex-row sm:gap-3 sm:px-4 lg:min-h-14 lg:justify-start lg:text-left",
                  selected ? "bg-white/[0.08] text-foreground shadow-[inset_0_0_0_1px_rgba(130,143,255,0.45)]" : "text-foreground/60 hover:bg-white/[0.03]",
                )}
              >
                <item.icon aria-hidden className={cn("size-4 shrink-0", selected ? "text-primary" : "text-foreground/45")} />
                <span className="text-xs font-medium leading-tight sm:text-sm">
                  <span className="hidden font-mono text-primary/70 lg:inline">{item.index} </span>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* panel: input -> result -> enquiry */}
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${tool}`}
        className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_300px]"
      >
        {/* INPUT */}
        <div className="relative p-6 sm:p-8 lg:border-r lg:border-white/[0.06] lg:p-10">
          <ColumnHead n="1">Input</ColumnHead>
          <p className="text-sm text-muted-foreground">{activeTool.blurb}</p>
          <div className="mt-7 space-y-7">
            {tool === "first-30-days" ? (
              <>
                <ChipGroup
                  label="Sessions a week"
                  value={days}
                  onChange={setDays}
                  options={DAYS.map((d) => ({ value: d, label: `${d} days` }))}
                />
                <ChipGroup
                  label="Best time of day"
                  value={timeId}
                  onChange={setTimeId}
                  options={TIMES.map((t) => ({ value: t.id, label: t.label }))}
                />
              </>
            ) : (
              <>
                <ChipGroup
                  label="What are you here for?"
                  value={goalId}
                  onChange={setGoalId}
                  options={GOALS.map((g) => ({ value: g.id, label: g.label }))}
                />
                <ChipGroup
                  label="Where are you starting from?"
                  value={levelId}
                  onChange={setLevelId}
                  options={LEVELS.map((l) => ({ value: l.id, label: l.label }))}
                />
              </>
            )}
          </div>
          <span
            aria-hidden
            className="absolute -right-4 top-1/2 z-10 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full border border-primary/40 bg-[#0c0e16] text-primary lg:flex"
          >
            <ArrowRight className="size-4" />
          </span>
        </div>

        {/* GUIDANCE / RESULT */}
        <div className="relative border-t border-white/[0.06] bg-[radial-gradient(ellipse_at_top,rgba(94,106,210,0.12),transparent_70%)] p-6 sm:p-8 lg:border-r lg:border-t-0 lg:p-10">
          <ColumnHead n="2">Guidance · your result</ColumnHead>
          <div aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={resultKey}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6, transition: { duration: 0.15 } }}
                transition={{ duration: 0.4, ease: EASE }}
                className="rounded-2xl border border-primary/30 bg-[#10132a]/80 p-5 shadow-[0_24px_60px_-30px_rgba(94,106,210,0.6)] sm:p-6"
              >
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-primary">Your personalized result</p>

                {tool === "starting-point" ? (
                  <div className="mt-3">
                    <p className="text-2xl font-semibold tracking-tight">{level.title}</p>
                    <p className="mt-1 text-sm font-medium text-foreground/75">{level.program}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {level.body} A good focus to start with: {goal.focus}.
                    </p>
                  </div>
                ) : null}

                {tool === "journey" ? (
                  <ol className="mt-4 space-y-4">
                    {[
                      { when: "Weeks 1–2", title: "Get comfortable", text: level.first },
                      { when: "Weeks 3–8", title: "Build the habit", text: `Settle into a weekly rhythm around ${goal.focus}.` },
                      { when: "Month 3 onward", title: "Progress & refine", text: "Review how it is going with your trainer and adjust your program." },
                    ].map((stage, i) => (
                      <li key={stage.title} className="flex gap-4">
                        <span className="flex flex-col items-center">
                          <span
                            className={cn(
                              "flex size-6 shrink-0 items-center justify-center rounded-full border text-[0.6875rem] font-medium",
                              i === 0 ? "border-primary bg-primary text-primary-foreground" : "border-white/20 text-muted-foreground",
                            )}
                          >
                            {i + 1}
                          </span>
                          {i < 2 ? <span className="mt-1 w-px flex-1 bg-white/10" /> : null}
                        </span>
                        <span className="pb-1">
                          <span className="block text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">{stage.when}</span>
                          <span className="mt-0.5 block font-medium">{stage.title}</span>
                          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{stage.text}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                ) : null}

                {tool === "first-30-days" ? (
                  <div className="mt-4">
                    <div className="grid grid-cols-[5.75rem_repeat(7,minmax(0,1fr))] items-center gap-x-1.5 gap-y-2 sm:grid-cols-[7.5rem_repeat(7,minmax(0,1fr))]">
                      <span />
                      {WEEKDAYS.map((d, i) => (
                        <span key={i} className="text-center text-[0.6875rem] text-muted-foreground">
                          {d}
                        </span>
                      ))}
                      {WEEK_FOCUS.map((focus, week) => (
                        <WeekRow key={focus} week={week + 1} focus={focus} days={SESSION_DAYS[days]} />
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      {days} sessions a week, {time.label.toLowerCase()}: about {days * 4} sessions across your first four weeks.
                    </p>
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
          <span
            aria-hidden
            className="absolute -right-4 top-1/2 z-10 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#25d366]/40 bg-[#0c0e16] text-[#7ee2a8] lg:flex"
          >
            <ArrowRight className="size-4" />
          </span>
        </div>

        {/* ENQUIRY */}
        <div className="border-t border-white/[0.06] p-6 sm:p-8 lg:border-t-0 lg:px-6 lg:py-10">
          <ColumnHead n="3">Enquiry</ColumnHead>

          {/* desktop: on a phone */}
          <div className="hidden lg:block">
            <PhoneShell className="w-[252px]">
              <div className="px-4 pb-5 pt-4">
                <p className="text-[0.5625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">{activeTool.name}</p>
                <p className="mt-1.5 text-[0.9375rem] font-semibold leading-tight tracking-tight text-white/95">
                  {tool === "first-30-days" ? `${days} sessions a week, ${time.label.toLowerCase()}` : level.program}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {(tool === "first-30-days" ? [WEEK_FOCUS[0], WEEK_FOCUS[1], WEEK_FOCUS[2]] : [goal.label, level.label]).map((item) => (
                    <li key={item} className="flex items-center gap-1.5 text-[0.75rem] text-white/65">
                      <Check className="size-3 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-[0.5625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">Your enquiry</p>
                <div className="mt-2">{enquiryBubble}</div>
                <span className="mt-3 flex h-9 items-center justify-center gap-1.5 rounded-full bg-[#25d366] text-[0.75rem] font-semibold text-[#06260f]">
                  <MessageCircle className="size-3.5" />
                  Message the gym team
                </span>
              </div>
            </PhoneShell>
          </div>

          {/* mobile: flat WhatsApp card */}
          <div aria-hidden className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b141a] lg:hidden">
            <div className="flex items-center gap-2 bg-[#202c33] px-4 py-2.5">
              <span className="size-6 rounded-full bg-gradient-to-br from-[#5e6ad2] to-[#9333ea]" />
              <span className="text-sm font-medium text-white/85">Gym team</span>
            </div>
            <div className="flex flex-col p-3">
              <div className="ml-auto max-w-[92%]">{enquiryBubble}</div>
              <span className="mt-3 flex h-11 items-center justify-center gap-1.5 rounded-full bg-[#25d366] text-sm font-semibold text-[#06260f]">
                <MessageCircle className="size-4" />
                Message the gym team
              </span>
            </div>
          </div>

          <p className="sr-only">The enquiry reads: {enquiry}</p>
          <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground lg:mx-auto lg:max-w-[16rem]">
            The enquiry updates as you choose. In a live version it opens WhatsApp with this message ready to send.
          </p>
        </div>
      </div>

      <div className="border-t border-white/[0.06] bg-white/[0.015] px-6 py-4 text-xs leading-relaxed text-muted-foreground sm:px-8 lg:px-10">
        Sample experience for an example gym. Your version uses your own programs, timings and tone, and nothing you choose here
        is saved or sent. These tools give general guidance only and are not medical advice; anyone with a health condition or
        concern should speak to a qualified professional first.
      </div>
    </div>
  );
}

function WeekRow({ week, focus, days }: { week: number; focus: string; days: number[] }) {
  return (
    <>
      <span className="pr-1 text-[0.6875rem] leading-tight text-foreground/80">
        <span className="block tabular-nums text-muted-foreground">Week {week}</span>
        {focus}
      </span>
      {WEEKDAYS.map((_, d) => {
        const on = days.includes(d);
        return (
          <span
            key={d}
            className={cn(
              "mx-auto size-5 rounded-md border transition-colors sm:size-6",
              on ? "border-primary/70 bg-primary/70" : "border-white/[0.08] bg-white/[0.02]",
            )}
          >
            {on ? <span className="sr-only">Session</span> : null}
          </span>
        );
      })}
    </>
  );
}
