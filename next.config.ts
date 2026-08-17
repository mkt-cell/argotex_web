import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Deployed on Vercel, which builds and serves Next.js natively — no
  // `output: "standalone"` needed. All images are local files in /public,
  // so no remote image hosts are configured.

  // Pin the workspace root to this project. Without it, Next walks up and can
  // lock onto an unrelated lockfile elsewhere on disk (e.g. a parent folder),
  // which throws off build-trace root inference.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
