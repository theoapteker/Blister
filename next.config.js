/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  webpack: (config) => {
    // Handle canvas package for globe.gl
    config.externals = config.externals || {};
    config.externals.canvas = 'canvas';
    return config;
  },
}

module.exports = nextConfig
