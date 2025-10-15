import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [10, 50, 75],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
