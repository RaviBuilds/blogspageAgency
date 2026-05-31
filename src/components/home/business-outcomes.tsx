import { CalendarCheck, Gauge, LineChart, MessageCircle } from "lucide-react";

const outcomes = [
  {
    icon: CalendarCheck,
    title: "Zero-Commission Bookings",
    description:
      "Own the booking flow, take direct payments, and reduce dependency on third-party marketplaces that cut into profit.",
  },
  {
    icon: Gauge,
    title: "Automated Dispatch",
    description:
      "Assign riders, field teams, or delivery staff faster with live job status, notifications, and operational visibility.",
  },
  {
    icon: LineChart,
    title: "Real-time Analytics",
    description:
      "Give owners and managers live dashboards for revenue, occupancy, fulfillment, customer activity, and team performance.",
  },
  {
    icon: MessageCircle,
    title: "Customer Follow-ups",
    description:
      "Automate confirmations, reminders, payment updates, and feedback requests across the channels your customers already use.",
  },
];

export function BusinessOutcomes() {
  return (
    <section id="outcomes" className="border-t border-white/[0.06] py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Proven Business Outcomes</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Systems that protect margin and create leverage
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every build is tied to a clear business result: more direct revenue,
            less manual work, faster fulfillment, and better decisions.
          </p>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((outcome) => (
            <article
              key={outcome.title}
              className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 transition-colors hover:border-white/[0.14] hover:bg-white/[0.04]"
            >
              <div className="flex size-10 items-center justify-center rounded-lg border border-white/[0.08] bg-primary/10">
                <outcome.icon className="size-5 text-primary" />
              </div>
              <h3 className="mt-5 text-lg font-medium">{outcome.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {outcome.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
