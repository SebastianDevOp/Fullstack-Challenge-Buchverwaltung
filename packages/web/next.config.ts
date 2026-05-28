import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@book-manager/database"],
};

export default nextConfig;
