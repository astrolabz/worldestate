import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    CESIUM_BASE_URL: "/cesium",
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
