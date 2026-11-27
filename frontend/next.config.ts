import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  turbopack: {
    root: __dirname,
  },
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;
