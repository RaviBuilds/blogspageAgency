import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async redirects() {
    return [
      // Legacy singular /blog paths → /blogs
      {
        source: "/blog",
        destination: "/blogs",
        permanent: true,
      },
      {
        source: "/blog/:slug",
        destination: "/blogs/:slug",
        permanent: true,
      },

      /*
       * WordPress root URLs (blogspage.com/post-slug) → /blogs/post-slug
       * Excludes reserved app routes so /blogs, /studio, etc. are not rewritten.
       */
      {
        source:
          "/:slug((?!blogs|studio|solutions|api|_next|favicon\\.ico|robots\\.txt|sitemap\\.xml).+)",
        destination: "/blogs/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
