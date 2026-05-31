"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We clarify the business model, user journeys, risks, and must-have launch outcomes before shaping the build.",
  },
  {
    number: "02",
    title: "Prototype",
    description:
      "We turn the core workflow into a sharp prototype so decisions happen quickly and the product has a clear direction.",
  },
  {
    number: "03",
    title: "Development",
    description:
      "We build the application in focused releases with clean architecture, useful demos, and direct communication.",
  },
  {
    number: "04",
    title: "Scale",
    description:
      "We harden the product with analytics, automation, performance improvements, and roadmap support after launch.",
  },
];

export function ProcessTimeline() {
  return (
    <section id="process" className="border-t border-white/6 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Process</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            From first call to scalable system.
          </h2>
          <p className="mt-4 text-muted-foreground">
            A practical product timeline inspired by the way elite software teams
            reduce uncertainty and keep delivery moving.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-5 top-0 hidden h-full w-px bg-linear-to-b from-primary/60 via-white/10 to-transparent md:block lg:left-0 lg:top-5 lg:h-px lg:w-full lg:bg-linear-to-r" />
          <div className="grid gap-5 lg:grid-cols-4">
            {steps.map((step, index) => (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative pl-14 md:pl-16 lg:pl-0 lg:pt-14"
              >
                <div className="absolute left-0 top-2 flex size-10 items-center justify-center rounded-full border border-primary/30 bg-background shadow-[0_0_32px_rgba(79,70,229,0.35)] lg:top-0">
                  <div className="size-2.5 rounded-full bg-primary" />
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/2.5 p-6 shadow-2xl shadow-black/20">
                  <span className="text-xs font-medium uppercase tracking-[0.24em] text-primary">
                    {step.number}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
