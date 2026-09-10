import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const nextConfig: NextConfig = {
  // Emits a self-contained server bundle in .next/standalone so the Docker
  // image doesn't need node_modules or the full source tree at runtime.
  output: "standalone",
};

export default withSentryConfig(nextConfig, {
  silent: true,
  sourcemaps: {
    disable: true,
  },
});
