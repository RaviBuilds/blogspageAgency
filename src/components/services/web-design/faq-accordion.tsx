"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { FaqPair } from "@/lib/structured-data";

export function FaqAccordion({ items }: { items: FaqPair[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="divide-y divide-border-subtle rounded-2xl border border-border bg-card">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={item.question} className="p-5 sm:p-6">
            <button
              type="button"
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-4 rounded-lg text-left font-medium text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <span className="text-base font-semibold tracking-tight sm:text-lg">
                {item.question}
              </span>
              <ChevronDown
                className={`mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-primary" : ""
                }`}
                aria-hidden="true"
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="pt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
