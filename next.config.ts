import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  // Without this, Next.js walks up looking for a workspace root and can lock
  // onto an unrelated lockfile elsewhere on disk, burying server.js under a
  // mirrored copy of that path inside .next/standalone.
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "argotex-cms.onrender.com", pathname: "/assets/**" },
      { protocol: "http", hostname: "localhost", port: "8055", pathname: "/assets/**" }
    ]
  }
};

export default nextConfig;
