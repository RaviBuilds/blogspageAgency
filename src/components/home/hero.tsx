import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const trustedLogos = ["Next.js", "Supabase", "Vercel", "Stripe", "Sanity"];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      <div className="pointer-events-none absolute left-1/2 top-8 -z-10 size-144 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.38),rgba(147,51,234,0.2)_34%,transparent_66%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(9,9,11,0.15),#09090b_78%)]" />

      <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-1.5 text-xs text-muted-foreground shadow-2xl shadow-indigo-500/10 backdrop-blur">
            <Sparkles className="size-3.5 text-primary" />
            Premium product engineering for founders who need momentum
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            SaaS &amp; Digital Systems for{" "}
            <span className="text-gradient">Ambitious Founders.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            We turn high-stakes ideas into polished SaaS products, workflow
            automations, and internal operating systems with senior technical
            strategy from day one.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="glow-border h-11 bg-white px-6 text-black hover:bg-white/90"
              asChild
            >
              <Link href="#contact">
                Book a strategy call
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 border-white/10 bg-white/2 px-6 hover:bg-white/6"
              asChild
            >
              <Link href="#models">Explore delivery models</Link>
            </Button>
          </div>

          <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-white/8 bg-white/2.5 px-5 py-5 backdrop-blur">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Trusted by teams building with
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {trustedLogos.map((logo) => (
                <div
                  key={logo}
                  className="flex h-12 items-center justify-center rounded-xl border border-white/6 bg-white/2.5 px-3 text-sm font-semibold tracking-tight text-white/45 grayscale transition-colors hover:text-white/70"
                >
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
