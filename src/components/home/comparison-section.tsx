import { CheckCircle2, XCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const freelancerPainPoints = [
  "Ghosting after the first milestone",
  "Spaghetti code that breaks under growth",
  "No business context behind technical choices",
  "Hand-offs that leave your team guessing",
];

const agencyAdvantages = [
  "Business-first architecture before code",
  "Scalable Next.js systems with clean ownership",
  "Direct communication and weekly decision rhythm",
  "Product thinking across UX, data, and operations",
];

export function ComparisonSection() {
  return (
    <section id="comparison" className="border-t border-white/6 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Built Like A Product Team</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            We do more than typical freelancers.
          </h2>
          <p className="mt-4 text-muted-foreground">
            You get senior product judgment, disciplined delivery, and systems
            that are designed to keep working after launch.
          </p>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-2">
          <Card className="relative overflow-hidden bg-white/2">
            <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-red-500/10 blur-3xl" />
            <CardHeader>
              <div className="flex size-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
                <XCircle className="size-5 text-red-400" />
              </div>
              <CardTitle className="mt-5 text-2xl">Typical Freelancer</CardTitle>
              <CardDescription>
                Cheap up front, expensive once the product meets real users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {freelancerPainPoints.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-indigo-400/20 bg-indigo-950/18">
            <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 size-56 rounded-full bg-emerald-500/10 blur-3xl" />
            <CardHeader>
              <div className="flex size-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
                <CheckCircle2 className="size-5 text-emerald-300" />
              </div>
              <CardTitle className="mt-5 text-2xl">Our Approach</CardTitle>
              <CardDescription>
                A focused agency operating system for SaaS and business-critical tools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {agencyAdvantages.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-zinc-200">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
