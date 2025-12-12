import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
    domains: ["hoangnam.site", "at-store-eight.vercel.app"],
  },
};

export default nextConfig;
