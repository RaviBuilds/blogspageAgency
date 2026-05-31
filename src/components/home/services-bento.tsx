import {
  Bot,
  Code2,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  {
    icon: Code2,
    title: "Custom Web Platforms",
    description:
      "End-to-end web applications, admin dashboards, customer portals, and SaaS MVPs built around your exact business model.",
    className: "md:col-span-2 md:row-span-2",
    featured: true,
  },
  {
    icon: Smartphone,
    title: "Cross-Platform Mobile Apps",
    description:
      "High-performance iOS and Android apps for customers, riders, delivery teams, and field staff, using Capacitor for single-codebase efficiency.",
    className: "md:col-span-1 md:row-span-2",
  },
  {
    icon: Bot,
    title: "Business Automation",
    description:
      "Internal tools that replace messy spreadsheets, duplicate data entry, and scattered WhatsApp follow-ups with one reliable operating system.",
    className: "md:col-span-3",
  },
];

export function ServicesBento() {
  return (
    <section id="services" className="border-t border-white/[0.06] py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Services</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Business solutions that compound
          </h2>
          <p className="mt-4 text-muted-foreground">
            We build the revenue-generating systems your business needs to
            sell, operate, fulfill, and scale without operational drag.
          </p>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3 md:grid-rows-3">
          {services.map((service) => (
            <article
              key={service.title}
              className={cn(
                "group relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors hover:border-white/[0.14] hover:bg-white/[0.04]",
                service.className
              )}
            >
              {service.featured && (
                <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-primary/20 blur-3xl" />
              )}
              <div className="relative">
                <div className="flex size-10 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
                  <service.icon className="size-5 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-medium">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
