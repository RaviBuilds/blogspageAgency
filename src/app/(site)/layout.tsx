import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import ChatWidget from "@/components/chat-widget";
import { Preloader } from "@/components/ui/preloader";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { CustomCursor } from "@/components/ui/custom-cursor";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Preloader />
      <CustomCursor />
      <SmoothScrollProvider>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ChatWidget />
      </SmoothScrollProvider>
    </>
  );
}
