"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { submitLead, type LeadActionState } from "@/app/actions/leads";
import { cn } from "@/lib/utils";

const initialState: LeadActionState = { success: false, message: "" };

const inputClass =
  "peer w-full rounded-md border border-white/[0.1] bg-white/[0.02] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/[0.18] focus:border-primary/60 focus:bg-white/[0.04] focus:ring-2 focus:ring-primary/30";

const labelClass = "mb-1.5 block text-xs font-medium text-muted-foreground";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="glow-border inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-primary/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send project brief"}
      {!pending && <ArrowRight className="size-4" />}
    </button>
  );
}

export function ProjectBriefForm() {
  const [state, formAction] = useActionState(submitLead, initialState);

  return (
    <section id="project-brief" className="border-t border-white/[0.06] py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="text-sm font-medium text-primary">Project Brief</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Tell us what you're building.
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Share a few details and we'll respond within one business day with
              a tailored strategy outline. No commitment required.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-card p-6 sm:p-8">
            {state.success ? (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <div className="flex size-12 items-center justify-center rounded-xl border border-white/[0.1] bg-primary/10">
                  <CheckCircle2 className="size-6 text-primary" />
                </div>
                <h3 className="mt-5 text-xl font-medium tracking-tight">
                  Brief received.
                </h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  {state.message}
                </p>
              </div>
            ) : (
              <form action={formAction} className="flex flex-col gap-5" noValidate>
                <input type="hidden" name="source" value="homepage-project-brief" />

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Jane Doe"
                      autoComplete="name"
                      aria-invalid={Boolean(state.errors?.name)}
                      className={inputClass}
                    />
                    {state.errors?.name && (
                      <p className="mt-1.5 text-xs text-destructive">
                        {state.errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jane@company.com"
                      autoComplete="email"
                      aria-invalid={Boolean(state.errors?.email)}
                      className={inputClass}
                    />
                    {state.errors?.email && (
                      <p className="mt-1.5 text-xs text-destructive">
                        {state.errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone <span className="text-muted-foreground/60">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 90000 00000"
                    autoComplete="tel"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="message" className={labelClass}>
                    Project details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="What are you building, and what outcome matters most?"
                    aria-invalid={Boolean(state.errors?.message)}
                    className={cn(inputClass, "resize-none")}
                  />
                  {state.errors?.message && (
                    <p className="mt-1.5 text-xs text-destructive">
                      {state.errors.message}
                    </p>
                  )}
                </div>

                {!state.success && state.message && (
                  <p className="text-xs text-destructive">{state.message}</p>
                )}

                <div className="flex items-center justify-between gap-4">
                  <SubmitButton />
                  <p className="text-xs text-muted-foreground">
                    One business day response.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
