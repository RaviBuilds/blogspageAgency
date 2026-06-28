import type { MetadataRoute } from "next";

import { client } from "@/sanity/lib/client";
import { POST_SITEMAP_QUERY, type PostSitemapEntry } from "@/sanity/lib/queries";

const BASE_URL = "https://blogspage.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blogs`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const posts = await client.fetch<PostSitemapEntry[]>(POST_SITEMAP_QUERY);

  const blogRoutes: MetadataRoute.Sitemap = posts
    .filter((post) => Boolean(post.slug))
    .map((post) => {
      const lastmod =
        post.lastReviewed || post._updatedAt || post.publishedAt;
      return {
        url: `${BASE_URL}/blogs/${post.slug}`,
        lastModified: lastmod ? new Date(lastmod) : now,
        changeFrequency: post.evergreen ? "monthly" : "weekly",
        priority: 0.6,
      };
    });

  return [...staticRoutes, ...blogRoutes];
}
