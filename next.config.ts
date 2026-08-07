import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emits a self-contained server bundle in .next/standalone so the Docker
  // image doesn't need node_modules or the full source tree at runtime.
  output: "standalone",
};

export default nextConfig;
