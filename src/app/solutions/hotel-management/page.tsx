import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  BellRing,
  CreditCard,
  Hotel,
  MessageCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Hotel Management Solution | Blogspage Agency",
  description:
    "A commission-free booking engine and property management system for hotels that want to increase direct revenue.",
};

const problems = [
  "OTA platforms like MakeMyTrip and Agoda can take up to 30% of every booking.",
  "Offline registers and disconnected spreadsheets make room availability hard to trust.",
  "Guest payments, staff tasks, and booking updates often live in separate places.",
];

const features = [
  {
    icon: BedDouble,
    title: "Real-time room inventory sync",
    description:
      "Keep availability accurate across direct bookings, front desk updates, walk-ins, and staff operations.",
  },
  {
    icon: CreditCard,
    title: "Integrated secure payment gateways",
    description:
      "Accept deposits, full payments, and add-on purchases directly from guests without sending them elsewhere.",
  },
  {
    icon: Users,
    title: "Housekeeping and staff management dashboard",
    description:
      "Track room status, assign tasks, and give managers one clear view of daily property operations.",
  },
  {
    icon: MessageCircle,
    title: "Automated guest WhatsApp notifications",
    description:
      "Send booking confirmations, check-in reminders, payment updates, and post-stay follow-ups automatically.",
  },
];

const roiPoints = [
  "More bookings stay direct, so less revenue is lost to third-party commissions.",
  "Managers spend less time reconciling registers, calls, and spreadsheets.",
  "Guests receive a faster, more premium booking and check-in experience.",
  "Owners get clearer visibility into occupancy, payments, staff productivity, and repeat business.",
];

export default function HotelManagementSolutionPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="gradient-mesh absolute inset-x-0 top-0 -z-10 h-[520px]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_at_center,transparent_0%,#09090b_70%)]" />

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-muted-foreground">
            <Hotel className="size-3.5 text-primary" />
            Solution model for hotels and resorts
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Commission-Free Booking Engine & Property Management System
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            A unified operating system for hotels that want to win more direct
            bookings, manage rooms in real time, automate guest communication,
            and protect profit from third-party commission leakage.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="glow-border h-11 bg-primary px-6 text-white hover:bg-primary/90"
              asChild
            >
              <Link href="/#contact">
                Discuss this solution
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 border-white/10 bg-transparent px-6 hover:bg-white/[0.04]"
              asChild
            >
              <Link href="/#services">View all services</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-medium text-primary">The Problem</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Profit is leaking through commissions and manual operations.
            </h2>
          </div>
          <div className="grid gap-4">
            {problems.map((problem) => (
              <div
                key={problem}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 text-sm leading-relaxed text-muted-foreground"
              >
                {problem}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-10 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 lg:grid-cols-[0.8fr_1.2fr] lg:p-10">
            <div>
              <p className="text-sm font-medium text-primary">The Solution</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                One system for bookings, rooms, payments, guests, and staff.
              </h2>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">
              Instead of relying on commission-heavy marketplaces and scattered
              offline registers, the hotel owns a direct booking engine connected
              to a property management dashboard. The result is a cleaner guest
              experience, fewer operational blind spots, and more revenue kept
              inside the business.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Core Features</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Built around the way hotels actually operate.
            </h2>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors hover:border-white/[0.14] hover:bg-white/[0.04]"
              >
                <div className="flex size-10 items-center justify-center rounded-lg border border-white/[0.08] bg-primary/10">
                  <feature.icon className="size-5 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-medium">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 lg:p-10">
            <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <div className="flex size-12 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.05]">
                  <TrendingUp className="size-5 text-primary" />
                </div>
                <p className="mt-6 text-sm font-medium text-primary">The ROI</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                  Owning the system directly increases the bottom line.
                </h2>
                <p className="mt-4 text-muted-foreground">
                  When bookings, payments, staff work, and guest communication
                  happen in one owned system, the hotel keeps more revenue and
                  runs with less daily friction.
                </p>
              </div>
              <div className="grid gap-3">
                {roiPoints.map((point) => (
                  <div
                    key={point}
                    className="flex gap-3 rounded-xl border border-white/[0.08] bg-black/20 p-4 text-sm text-muted-foreground"
                  >
                    <BellRing className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
