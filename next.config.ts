import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@napi-rs/canvas", "pdfjs-dist"],
  outputFileTracingRoot: process.cwd(),
  experimental: {
    reactCompiler: true,
    optimizePackageImports: ["react-markdown", "framer-motion", "@supabase/supabase-js", "@supabase/ssr"],
  },
};

export default nextConfig;
