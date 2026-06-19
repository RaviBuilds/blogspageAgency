export { metadata, viewport } from "next-sanity/studio";

export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="h-dvh overflow-hidden">{children}</div>;
}
