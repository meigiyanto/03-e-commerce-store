import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  allowedDevOrigins: ["*.app.github.dev"],

  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.app.github.dev"],
    },
  },

  images: {
    remotePatterns: [new URL("https://images.unsplash.com/**")],
  },
};

export default nextConfig;