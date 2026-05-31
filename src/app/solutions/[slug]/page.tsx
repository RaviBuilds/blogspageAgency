import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HotelHyderabadLanding } from "@/components/solutions/hotel-hyderabad-landing";

const HOTEL_HYDERABAD_SLUG =
  "hotel-booking-and-management-web-platform-solution-in-hyderabad";

const solutionMetadata: Record<string, Metadata> = {
  [HOTEL_HYDERABAD_SLUG]: {
    title: "Hotel Booking & Management Software Development in Hyderabad",
    description:
      "Custom hotel management and commission-free booking software for Hyderabad properties. PMS, real-time inventory, WhatsApp automation, and local payment integration.",
  },
};

type SolutionPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;
  return (
    solutionMetadata[slug] ?? {
      title: "Solution Not Found | Blogspage Agency",
    }
  );
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug } = await params;

  if (slug === HOTEL_HYDERABAD_SLUG) {
    return <HotelHyderabadLanding />;
  }

  notFound();
}
