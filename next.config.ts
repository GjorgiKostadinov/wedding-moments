import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Правилна конфигурација за Next.js 15
  serverExternalPackages: ['nodemailer'],
  
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'nodemailer'];
    return config;
  },
};

export default nextConfig;