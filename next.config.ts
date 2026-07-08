import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "argotex-cms.onrender.com", pathname: "/assets/**" },
      { protocol: "http", hostname: "localhost", port: "8055", pathname: "/assets/**" }
    ]
  }
};

export default nextConfig;
