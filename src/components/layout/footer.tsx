import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Twitter } from "lucide-react";

const footerLinks = {
  Services: [
    { label: "SaaS MVP Launch", href: "/#models" },
    { label: "Enterprise Systems", href: "/#models" },
    { label: "Business Automation", href: "/#models" },
    { label: "Hotel Management", href: "/solutions/hotel-booking-and-management-web-platform-solution-in-hyderabad" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Case Studies", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Blog", href: "#" },
  ],
  Resources: [
    { label: "Our Approach", href: "/#comparison" },
    { label: "Process", href: "/#process" },
    { label: "Solution Models", href: "/solutions/hotel-booking-and-management-web-platform-solution-in-hyderabad" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/6 bg-black">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
              <span className="flex size-7 items-center justify-center rounded-md bg-white/10 text-xs font-bold">
                B
              </span>
              Blogspage Agency
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              We build booking engines, dashboards, mobile apps, and internal
              operating systems that reduce manual work and increase revenue.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-lg border border-white/8 text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground"
                >
                  <Icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-medium">{category}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/6 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Blogspage Agency. All rights reserved.
          </p>
          <Link
            href="#contact"
            className="group flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Start a project
            <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
