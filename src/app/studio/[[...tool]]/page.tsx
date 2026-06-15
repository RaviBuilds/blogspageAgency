"use client";

import dynamic from "next/dynamic";
import config from "../../../../sanity.config";

// Dynamically import the Sanity Studio with Server-Side Rendering explicitly disabled
const NextStudio = dynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  { ssr: false }
);

export default function StudioPage() {
  return <NextStudio config={config} />;
}