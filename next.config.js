/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'assets.coingecko.com',
      'ethplorer.io'
    ],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  // Configure regions for Edge runtime
  regions: ['all'],
  // Enable Edge runtime globally
  runtime: 'experimental-edge',
};

module.exports = nextConfig; 