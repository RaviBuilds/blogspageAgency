import Link from "next/link";
import { ArrowRight, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactCTA() {
  return (
    <section id="contact" className="border-t border-white/[0.06] py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          <div className="gradient-mesh absolute inset-0 opacity-60" />
          <div className="relative px-8 py-16 text-center sm:px-16 sm:py-20">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.05]">
              <MessageSquare className="size-5 text-primary" />
            </div>

            <h2 className="mx-auto mt-6 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to build something exceptional?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              Tell us about your project. We respond within one business day
              with a tailored strategy outline, no commitment required.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="glow-border h-11 bg-primary px-8 text-white hover:bg-primary/90"
                asChild
              >
                <Link href="mailto:hello@blogspage.com">
                  <Mail className="size-4" />
                  hello@blogspage.com
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 border-white/10 bg-transparent px-8 hover:bg-white/[0.04]"
                asChild
              >
                <Link href="#">
                  Schedule a call
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <p className="mt-8 text-xs text-muted-foreground">
              Trusted by startups and enterprise teams across fintech, health,
              and B2B SaaS.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
