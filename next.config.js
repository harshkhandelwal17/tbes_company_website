/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Standalone output: lightweight server bundle, less RAM on Hostinger
  output: 'standalone',
  generateBuildId: async () => {
    // Unique ID per deployment prevents stale chunk errors on Hostinger
    return `build-${Date.now()}`;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '200mb',
    },
    // Limit parallel build workers — prevents RAM/CPU spike on Hostinger shared hosting
    workerThreads: false,
    cpus: 2,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-4cdb7dd8dbec4bceb0da2ef6bd94df2a.r2.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig