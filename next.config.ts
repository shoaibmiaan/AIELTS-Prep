import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules\/pdfjs-dist/,
      type: 'javascript/auto',
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xypbinamxunmwkhlvefd.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Allow builds to pass even with lint/type errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
