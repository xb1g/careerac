import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server external packages for pdfjs-dist and its canvas dependency
  serverExternalPackages: ["@napi-rs/canvas", "pdfjs-dist"],
};

export default nextConfig;
