import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['nodemailer'],
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'nodemailer'];
    return config;
  },
};

export default nextConfig;