/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static site generation
  trailingSlash: true, // Adds trailing slashes to URLs
  images: {
    unoptimized: true, // Disables image optimization for static export
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
