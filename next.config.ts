import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.sellerpintar.com',
        port: '',
        pathname: '/articles/articles/**',  
      },
    ],
  },
};

export default nextConfig;
