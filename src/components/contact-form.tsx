"use client";

import { useActionState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { submitLead, type LeadActionState } from "@/app/actions/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: LeadActionState = {
  success: false,
  message: "",
};

type ContactFormProps = {
  source?: string;
  className?: string;
};

export function ContactForm({ source = "website", className }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(submitLead, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className={className}>
      <input type="hidden" name="source" value={source} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            required
            aria-invalid={Boolean(state.errors?.name)}
          />
          {state.errors?.name ? (
            <p className="text-xs text-red-400">{state.errors.name}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@hotel.com"
            required
            aria-invalid={Boolean(state.errors?.email)}
          />
          {state.errors?.email ? (
            <p className="text-xs text-red-400">{state.errors.email}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+91 ..."
        />
      </div>

      <div className="mt-5 space-y-2">
        <Label htmlFor="message">Project details</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Rooms, current booking channels, timeline, and what you want to own directly."
          required
          aria-invalid={Boolean(state.errors?.message)}
        />
        {state.errors?.message ? (
          <p className="text-xs text-red-400">{state.errors.message}</p>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button
          type="submit"
          size="lg"
          disabled={pending || state.success}
          className="glow-border h-11 min-w-44 bg-primary text-white hover:bg-primary/90 disabled:opacity-80"
        >
          <AnimatePresence mode="wait" initial={false}>
            {pending ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="inline-flex items-center gap-2"
              >
                <Loader2 className="size-4 animate-spin" />
                Sending...
              </motion.span>
            ) : state.success ? (
              <motion.span
                key="success"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="inline-flex items-center gap-2"
              >
                <CheckCircle2 className="size-4" />
                Sent
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="inline-flex items-center gap-2"
              >
                <Send className="size-4" />
                Request a strategy call
              </motion.span>
            )}
          </AnimatePresence>
        </Button>

        <AnimatePresence>
          {state.message ? (
            <motion.p
              key={state.message}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={
                state.success
                  ? "text-sm text-emerald-300"
                  : "text-sm text-red-300"
              }
            >
              {state.message}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  );
}
