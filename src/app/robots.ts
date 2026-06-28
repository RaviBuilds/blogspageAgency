import type { MetadataRoute } from "next";

const BASE_URL = "https://blogspage.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The embedded Sanity Studio is an authoring tool, not content.
      disallow: ["/studio", "/studio/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
