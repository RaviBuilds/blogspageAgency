import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { WEB_DESIGN_PROOF } from "@/lib/web-design-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WebDesignChatTrigger } from "./web-design-chat-trigger";

export function ProofSection() {
  const { eyebrow, h2, lead, boundaryNote, projects, ctaLabel } =
    WEB_DESIGN_PROOF;

  return (
    <section className="border-b border-border bg-background-subtle/30 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-wider text-accent-blue uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl text-balance">
            {h2}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {lead}
          </p>
        </div>

        {/* Verified Projects Grid */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col justify-between overflow-hidden border-border bg-card shadow-xs transition-all duration-200 hover:border-border-strong hover:shadow-md"
            >
              <div>
                {/* Project Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border-subtle bg-muted">
                  <Image
                    src={project.image}
                    alt={`${project.title} — verified project`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover object-top transition-transform duration-300 hover:scale-[1.02]"
                  />
                </div>

                <div className="p-6">
                  <span className="inline-flex items-center rounded-full border border-border bg-background-subtle px-2.5 py-0.5 text-[11px] font-semibold tracking-wider text-text-subtle uppercase">
                    {project.category}
                  </span>

                  <CardHeader className="p-0 mt-3">
                    <CardTitle className="text-xl font-semibold tracking-tight text-foreground">
                      <h3>{project.title}</h3>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-0 mt-3">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>
                  </CardContent>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-border-subtle">
                  <Link
                    href={project.route}
                    className="group inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    <span>{project.routeLabel}</span>
                    <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Boundary Disclaimer Note */}
        <div className="mt-12 text-center">
          <p className="mx-auto max-w-2xl text-xs text-text-subtle sm:text-sm">
            {boundaryNote}
          </p>
        </div>

        {/* CTA Trigger */}
        <div className="mt-10 flex justify-center">
          <WebDesignChatTrigger
            label={ctaLabel}
            variant="outline"
            showSparkle
          />
        </div>
      </div>
    </section>
  );
}
