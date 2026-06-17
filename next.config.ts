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
       * Excludes reserved app routes AND static asset file extensions so that
       * files in /public (.jpg, .png, .svg, etc.) and other assets are served
       * directly instead of being redirected into /blogs/:slug.
       */
      {
        source:
          "/:slug((?!blogs|studio|solutions|contact|privacy|terms|api|_next|favicon\\.ico|robots\\.txt|sitemap\\.xml)(?!.*\\.(?:jpg|jpeg|png|gif|svg|webp|avif|ico|bmp|js|css|json|txt|xml|woff2?|ttf|otf|map|mp4|webm|pdf)$).+)",
        destination: "/blogs/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
