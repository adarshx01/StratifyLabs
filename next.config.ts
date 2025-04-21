import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during build
    ignoreBuildErrors: true,
  },
  // Suppress warnings for specific issues
  onDemandEntries: {
    // Keep page in memory for this many seconds
    maxInactiveAge: 25 * 1000,
  },
  // Disable React strict mode to avoid double-rendering in development
  reactStrictMode: false,
  // Ignore linting and type checking errors in production build
  productionBrowserSourceMaps: false,
};

export default nextConfig;
