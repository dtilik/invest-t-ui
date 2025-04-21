/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // App Router configuration
  output: 'standalone',
  // Next.js 15 specific configurations
  serverExternalPackages: [],
  images: {
    // Enable improved image optimization
    remotePatterns: [],
  },
};

module.exports = nextConfig;
