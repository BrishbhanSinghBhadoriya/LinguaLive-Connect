import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from external sources if needed
  images: {
    remotePatterns: [],
  },
  // Environment variables exposed to browser
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "LinguaLive AI",
  },
};

export default nextConfig;
