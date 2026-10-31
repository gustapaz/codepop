import type { NextConfig } from "next";
const config: NextConfig = {
  output: "export",
  basePath: "/codepop",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};
export default config;
