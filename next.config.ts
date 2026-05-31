import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      /*
       * WordPress root URL -> new /blog/ URL 301 redirect matrix.
       * Paste the rest of the live migrated slugs below using the same shape:
       * {
       *   source: "/old-wordpress-slug",
       *   destination: "/blog/old-wordpress-slug",
       *   permanent: true,
       * },
       */
      {
        source: "/how-to-connect-a-react-app-to-mongodb-database-easily",
        destination: "/blog/how-to-connect-a-react-app-to-mongodb-database-easily",
        permanent: true,
      },
      {
        source: "/how-to-build-a-saas-mvp-with-nextjs",
        destination: "/blog/how-to-build-a-saas-mvp-with-nextjs",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
