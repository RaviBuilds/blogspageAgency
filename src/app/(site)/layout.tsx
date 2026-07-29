import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SkipLink } from "@/components/layout/skip-link";
import { Preloader } from "@/components/ui/preloader";
import { ClientEnhancements } from "@/components/providers/client-enhancements";
import { JsonLd } from "@/components/s@/components/providers/smooth-scroll
import { organizationNode } from "@/lib/structured-data";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SkipLink />
      <JsonLd nodes={[organizationNode()]} />
      <Preloader />
      <Navbar />
      <main id="main" tabIndex={-1} className="min-h-screen">
        {children}
      </main>
      <Footer />
      <ClientEnhancements />
    </>
  );
}
