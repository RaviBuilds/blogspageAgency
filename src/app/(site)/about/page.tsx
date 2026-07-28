import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { FOUNDING_YEAR } from "@/lib/site";
import { NICHES } from "@/lib/niches";
import { DELIVERY_MODELS } from "@/components/home/delivery-models";
import { projects } from "@/lib/featured-work-data";

export const metadata: Metadata = buildMetadata({
  path: "/about",
  title: "About Blogspage: about blogspage ai agency",
  description:
    "Blogspage is an AI agency founded in 2024, delivering automation, custom SaaS platforms, and programmatic SEO systems for founders who need shipped software.",
  keywordPhrase: "about blogspage ai agency",
});

// At least three of the four real project cards in featured-work.tsx,
// mirrored here with their technology and labelled metric (Requirement 8.6,
// 8.7). Rendering three of four keeps the page focused; all three metrics
// stay "estimated" per the source file's own honesty note.
const MIRRORED_PROJECT_COUNT = 3;

export default function AboutPage() {
  const mirroredProjects = projects.slice(0, MIRRORED_PROJECT_COUNT);

  return (
    <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8 lg:py-32">
      <Breadcrumb trail={[{ name: "About", path: "/about" }]} />

      {/* Hero / intro */}
      <p className="mt-6 text-sm font-medium text-primary">About</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
        Blogspage is an AI agency built to ship, not just advise.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/60">
        Founded in {FOUNDING_YEAR}, Blogspage designs and ships AI
        automation, custom SaaS platforms, and programmatic SEO systems for
        founders who need working software, not slide decks.
      </p>

      {/* Service categories */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">
          What we build
        </h2>
        <p className="mt-2 text-white/60">
          Ten service categories, each engineered around a specific business
          problem.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {NICHES.map((niche) => (
            <li
              key={niche.id}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
            >
              <h3 className="font-semibold text-white">{niche.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/60">
                {niche.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Delivery models */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">
          How we work
        </h2>
        <p className="mt-2 text-white/60">
          Two engagement models, chosen to match your risk, timeline, and
          business model.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {DELIVERY_MODELS.map((model) => (
            <li
              key={model.title}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-primary">
                {model.eyebrow}
              </p>
              <h3 className="mt-2 font-semibold text-white">{model.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/60">
                {model.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Delivered project case references */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight">
          Delivered projects
        </h2>
        <p className="mt-2 text-white/60">
          Real, shipped systems, with the technology used and the outcome we
          track for each.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {mirroredProjects.map((project) => (
            <li
              key={project.id}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
            >
              <h3 className="font-semibold text-white">{project.headline}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/60">
                {project.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/[0.05] bg-white/[0.03] px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <ul className="mt-3 flex flex-col gap-1">
                {project.metrics.map((metric) => (
                  <li key={metric.label} className="text-xs text-white/70">
                    {metric.label}:{" "}
                    <span className="text-white">{metric.value}</span>{" "}
                    <span className="text-white/40">({metric.basis})</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
