import {
  BedDouble,
  CreditCard,
  Hotel,
  MessageCircle,
  RefreshCw,
  Smartphone,
  TrendingDown,
} from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const capabilities = [
  {
    icon: BedDouble,
    title: "Property Management (PMS)",
    description:
      "Centralize room status, check-ins, housekeeping, and front-desk workflows in one dashboard built for Hyderabad hotels and resorts.",
  },
  {
    icon: RefreshCw,
    title: "Real-time Inventory Sync",
    description:
      "Keep availability accurate across direct bookings, walk-ins, and staff updates so you never overbook or lose a sale.",
  },
  {
    icon: MessageCircle,
    title: "Guest WhatsApp Automation",
    description:
      "Send booking confirmations, check-in reminders, payment links, and post-stay follow-ups automatically on WhatsApp.",
  },
  {
    icon: CreditCard,
    title: "Local Payment Gateway Integration",
    description:
      "Accept UPI, cards, and local payment rails directly on your owned booking flow — no marketplace middleman.",
  },
];

const mobileHighlights = [
  "Housekeeping and front-desk apps for on-property staff",
  "Rider and field-team apps for pickups, deliveries, and local services",
  "One codebase wrapped to native Android and iOS with Capacitor",
  "Live sync with the same PMS and inventory your web system uses",
];

export function HotelHyderabadLanding() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 size-144 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.34),rgba(147,51,234,0.16)_38%,transparent_68%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(ellipse_at_center,transparent_0%,#09090b_72%)]" />

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-1.5 text-xs text-muted-foreground">
            <Hotel className="size-3.5 text-primary" />
            Hyderabad hotel software development
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Owning Your Distribution: Custom Hotel Management &amp;{" "}
            <span className="text-gradient">
              Commission-Free Booking Systems in Hyderabad.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            We build direct booking engines and property management systems for
            hotels in Hyderabad that want to stop paying OTA commissions, run
            operations from one place, and own the guest relationship end to end.
          </p>

          <div className="mt-10">
            <Button
              size="lg"
              className="glow-border h-11 bg-white px-6 text-black hover:bg-white/90"
              asChild
            >
              <Link href="#contact">Get a free architecture review</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-white/6 py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <Card className="relative overflow-hidden border-red-500/20 bg-red-950/10">
            <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-red-500/10 blur-3xl" />
            <CardHeader className="relative">
              <div className="flex size-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
                <TrendingDown className="size-5 text-red-400" />
              </div>
              <CardTitle className="mt-5 text-3xl tracking-tight">
                The Financial Bleed
              </CardTitle>
              <CardDescription className="max-w-3xl text-base leading-relaxed">
                OTAs like MakeMyTrip, Goibibo, and Agoda can take{" "}
                <strong className="font-medium text-foreground">20–30%</strong>{" "}
                of every booking. For a 40-room Hyderabad hotel doing steady
                weekend occupancy, that is lakhs in margin lost every year — not
                to marketing, but to distribution you do not own.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  "Commission paid on bookings you would have captured directly",
                  "Guest data stays with the marketplace, not your property",
                  "Rate parity and discount wars compress your RevPAR further",
                ].map((point) => (
                  <div
                    key={point}
                    className="rounded-xl border border-red-500/15 bg-black/20 p-4 text-sm leading-relaxed text-muted-foreground"
                  >
                    {point}
                  </div>
                ))}
              </div>
              <p className="mt-6 max-w-3xl text-sm leading-relaxed text-zinc-300">
                A custom hotel management and booking system eliminates that
                bleed by driving direct reservations, automating guest
                communication, and giving your team one source of truth for rooms,
                payments, and operations.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-t border-white/6 py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">System Core</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Capabilities built for hotel operations
            </h2>
            <p className="mt-4 text-muted-foreground">
              Everything your front desk, housekeeping, finance, and guest
              experience teams need — in one owned platform.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {capabilities.map((capability) => (
              <Card
                key={capability.title}
                className="bg-white/2 transition-colors hover:border-white/16 hover:bg-white/4"
              >
                <CardHeader>
                  <div className="flex size-11 items-center justify-center rounded-xl border border-white/8 bg-primary/10">
                    <capability.icon className="size-5 text-primary" />
                  </div>
                  <CardTitle className="mt-5 text-xl">{capability.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {capability.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/6 py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-10 rounded-2xl border border-white/8 bg-white/2 p-8 lg:grid-cols-[0.95fr_1.05fr] lg:p-10">
            <div>
              <div className="flex size-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <Smartphone className="size-5 text-primary" />
              </div>
              <p className="mt-6 text-sm font-medium text-primary">The Mobile Edge</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Web-first system, native apps where the work happens
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Your hotel does not stop at the front desk. We extend the same
                platform into native Android and iOS apps for field staff,
                riders, and on-property teams using a unified web-to-mobile
                wrapper — one codebase, real device capabilities, live sync with
                your PMS.
              </p>
            </div>

            <ul className="grid gap-3">
              {mobileHighlights.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-white/8 bg-black/20 px-4 py-4 text-sm text-zinc-300"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-white/6 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-medium text-primary">Start Here</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Request a strategy call for your Hyderabad property
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Share your room count, current booking mix, and operational pain
                points. We will respond within one business day with a tailored
                architecture outline — no commitment required.
              </p>
            </div>

            <Card className="bg-white/2">
              <CardContent className="p-6 sm:p-8">
                <ContactForm source="hotel-hyderabad-solution" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
