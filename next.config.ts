import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ігнорувати помилки TypeScript при білді
  },
  eslint: {
    ignoreDuringBuilds: true, // Ігнорувати ESLint-помилки при білді
  },
};

export default nextConfig;
