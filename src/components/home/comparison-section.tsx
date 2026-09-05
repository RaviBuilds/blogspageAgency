"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { motion, type Variants } from "framer-motion";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Premium spring from the design system (§5 Motion Physics).
const SPRING = { type: "spring", stiffness: 100, damping: 20, mass: 1 } as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: SPRING },
};

const freelancerPainPoints = [
  "Static, “dumb” websites that just sit there looking pretty",
  "Generic templates recycled across a hundred other clients",
  "Zero automation — every lead waits on a manual reply",
  "You become the sales team, chasing follow-ups by hand",
];

const agencyAdvantages = [
  "Intelligent, AI-integrated platforms engineered around your funnel",
  "Custom AI sales agents that qualify and capture leads 24/7",
  "Automated follow-ups and CRM sync that never drop a prospect",
  "Seamless backend systems doing the operational heavy lifting",
];

export function ComparisonSection() {
  return (
    <section id="comparison" className="border-t border-border bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p variants={fadeUp} className="text-sm font-medium text-primary">
            Static Sites vs. Intelligent Systems
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            A website that looks good isn&apos;t the same as a system that sells.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-muted-foreground">
            Most freelancers hand you a static brochure and walk away. We deploy
            AI-powered platforms that capture, qualify, and convert on autopilot.
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-5 lg:grid-cols-2"
        >
          {/* Typical Freelancer — the "before". */}
          <motion.div variants={fadeUp}>
            <Card className="relative h-full overflow-hidden transition-colors duration-300 hover:border-border-strong">
              <CardHeader>
                <div className="flex size-11 items-center justify-center rounded-xl border border-destructive/20 bg-destructive/10">
                  <XCircle className="size-5 text-destructive" />
                </div>
                <CardTitle className="mt-5 text-2xl">Typical Freelancer</CardTitle>
                <CardDescription>
                  Cheap up front, expensive once the leads start slipping through
                  the cracks.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {freelancerPainPoints.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm text-muted-foreground"
                    >
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-destructive" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Our Approach — the "after". */}
          <motion.div variants={fadeUp}>
            <Card className="relative h-full overflow-hidden transition-colors duration-300 hover:border-border-strong">
              <CardHeader>
                <div className="flex size-11 items-center justify-center rounded-xl border border-success/20 bg-success/10">
                  <CheckCircle2 className="size-5 text-success" />
                </div>
                <CardTitle className="mt-5 text-2xl">Our Approach</CardTitle>
                <CardDescription>
                  AI-integrated platforms with sales agents and backend systems
                  that do the heavy lifting for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {agencyAdvantages.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-foreground">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
