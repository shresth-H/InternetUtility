import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@internet-utility/tools", "@internet-utility/calculators"],
};

export default nextConfig;
