import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Google profile pictures (Google OAuth avatars)
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        // AWS S3 — kudos image uploads
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      {
        // Generic HTTPS fallback for any other avatar/image host
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
