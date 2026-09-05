import Link from "next/link";
import { ArrowRight, Building2, Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * The two delivery-model entries. Exported so `/about` (Requirement 8.4) can
 * render the same two named delivery models without keeping a separate,
 * driftable copy.
 */
export const DELIVERY_MODELS = [
  {
    icon: Rocket,
    title: "SaaS MVP Launch",
    eyebrow: "Fixed timeline. Fixed scope.",
    description:
      "Perfect for founders who need a validated SaaS MVP with auth, payments, dashboards, and a launch-ready product experience.",
    details: ["Product strategy sprint", "Next.js SaaS build", "Launch support"],
  },
  {
    icon: Building2,
    title: "Custom Enterprise System",
    eyebrow: "Dedicated architecture.",
    description:
      "Purpose-built platforms for local businesses such as clinic, hotel, booking, inventory, and operations management systems.",
    details: ["Workflow mapping", "Role-based dashboards", "Automation and reporting"],
  },
];

export function DeliveryModels() {
  return (
    <section id="models" className="border-t border-border-subtle bg-background-subtle py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Delivery Models</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            How we work with you.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Choose the engagement that matches your risk, timeline, and business model.
          </p>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-2">
          {DELIVERY_MODELS.map((model) => (
            <Card
              key={model.title}
              className="group relative overflow-hidden transition-colors hover:border-border-strong"
            >
              {/* Premium hairline — the approved signal gradient
                  (transparent -> rgba(67,83,201,0.5) -> transparent), hover-only. */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl border border-border-subtle bg-muted">
                    <model.icon className="size-5 text-primary" />
                  </div>
                  <span className="rounded-full border border-border-subtle bg-muted px-3 py-1 text-xs text-muted-foreground">
                    {model.eyebrow}
                  </span>
                </div>
                <CardTitle className="mt-7 text-2xl">{model.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {model.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {model.details.map((detail) => (
                    <li
                      key={detail}
                      className="rounded-xl border border-border-subtle bg-muted px-3 py-3 text-sm text-foreground"
                    >
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="relative">
                <Button variant="outline" asChild>
                  <Link href="#contact">
                    Discuss this model
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
