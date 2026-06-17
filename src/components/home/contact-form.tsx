"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Terminal, ChevronRight, Sparkles } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   MOTION PRIMITIVES — design system §5
   ───────────────────────────────────────────────────────────────────────────── */
const SPRING = { type: "spring", stiffness: 100, damping: 20, mass: 1 } as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

/* ─────────────────────────────────────────────────────────────────────────────
   TYPING EFFECT for terminal lines
   ───────────────────────────────────────────────────────────────────────────── */
function TypedLine({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 28);
    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <span className={className}>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="animate-pulse">▌</span>
      )}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONTACT SECTION — Terminal / IDE Interface
   ───────────────────────────────────────────────────────────────────────────── */
export function ContactForm() {
  const openChat = () => {
    window.dispatchEvent(new Event("open-ai-chat"));
  };

  return (
    <section id="contact" className="border-t border-white/[0.05] py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16"
        >
          {/* Left column — positioning copy */}
          <motion.div variants={fadeUp}>
            <p className="text-sm font-medium text-primary">Initialize</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Your AI system is one conversation away.
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              No forms. No waiting. Talk directly to Sweety — our AI SDR — and
              get a strategy recommendation in under 2 minutes.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <ChevronRight className="size-3 text-primary" />
                Instant lead qualification
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="size-3 text-primary" />
                Personalized strategy preview
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="size-3 text-primary" />
                Zero friction — no email required to start
              </li>
            </ul>
          </motion.div>

          {/* Right column — Terminal UI */}
          <motion.div variants={fadeUp}>
            <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0f] shadow-2xl shadow-black/40">
              {/* Terminal chrome */}
              <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-500/70" />
                  <span className="size-2.5 rounded-full bg-yellow-500/70" />
                  <span className="size-2.5 rounded-full bg-emerald-500/70" />
                </div>
                <span className="ml-3 flex items-center gap-1.5 text-xs text-white/30">
                  <Terminal className="size-3" />
                  blogspage-ai-engine
                </span>
              </div>

              {/* Terminal body */}
              <div className="p-5 font-mono text-sm leading-relaxed">
                <div className="text-white/40">
                  <span className="text-emerald-400">$</span>{" "}
                  <TypedLine
                    text="npx blogspage-ai --init"
                    delay={400}
                    className="text-white/70"
                  />
                </div>

                <div className="mt-3 text-white/40">
                  <TypedLine
                    text="✓ Connecting to AI engine..."
                    delay={1800}
                    className="text-white/50"
                  />
                </div>

                <div className="mt-1 text-white/40">
                  <TypedLine
                    text="✓ Loading strategy models..."
                    delay={3000}
                    className="text-white/50"
                  />
                </div>

                <div className="mt-1 text-white/40">
                  <TypedLine
                    text="✓ Sweety (AI SDR) online. Ready to qualify."
                    delay={4200}
                    className="text-emerald-400/80"
                  />
                </div>

                <div className="mt-5 border-t border-white/[0.05] pt-5">
                  <p className="text-white/30 text-xs mb-3">
                    {">"} Click below to initialize a live strategy session
                  </p>

                  {/* The trigger button */}
                  <button
                    onClick={openChat}
                    className="group inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-white/80 transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-white"
                  >
                    <Sparkles className="size-3.5 text-primary" />
                    <span>Initialize System</span>
                    <ChevronRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground/50">
              Powered by our proprietary LLM pipeline · Response in &lt;5s
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
