import type { MetadataRoute } from "next";

import { client } from "@/sanity/lib/client";

const BASE_URL = "https://blogspage.com";

const POST_SLUGS_QUERY = `*[_type == "post"] {
  "slug": slug.current,
  _updatedAt
}`;

type PostSlug = {
  slug: string;
  _updatedAt: string;
};

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
      url: `${BASE_URL}/process`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const posts = await client.fetch<PostSlug[]>(POST_SLUGS_QUERY);

  const blogRoutes: MetadataRoute.Sitemap = posts
    .filter((post) => Boolean(post.slug))
    .map((post) => ({
      url: `${BASE_URL}/blogs/${post.slug}`,
      lastModified: post._updatedAt ? new Date(post._updatedAt) : now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  return [...staticRoutes, ...blogRoutes];
}
