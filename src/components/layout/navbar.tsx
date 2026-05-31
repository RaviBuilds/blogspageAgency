import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#comparison", label: "Approach" },
  { href: "/#models", label: "Models" },
  { href: "/#process", label: "Process" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  return (
    <header className="glass sticky top-0 z-50 w-full border-b border-white/6">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span className="flex size-7 items-center justify-center rounded-md bg-white/10 text-xs font-bold">
            B
          </span>
          Blogspage
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="hidden text-muted-foreground sm:inline-flex"
            asChild
          >
            <Link href="/solutions/hotel-booking-and-management-web-platform-solution-in-hyderabad">Hotel solution</Link>
          </Button>
          <Button size="sm" className={cn("glow-border bg-primary text-white hover:bg-primary/90")} asChild>
            <Link href="/#contact">
              Get started
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
