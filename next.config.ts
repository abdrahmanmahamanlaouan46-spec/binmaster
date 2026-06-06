import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* GitHub Pages static export */
  output: "export",
  
  // GitHub Pages deploys to username.github.io/repo-name/
  // We need to set basePath to match the repo name
  basePath: process.env.NODE_ENV === "production" ? "/binmaster" : "",
  
  // Static export doesn't support images optimization
  images: {
    unoptimized: true,
  },
  
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  reactStrictMode: false,
};

export default nextConfig;
