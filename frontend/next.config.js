/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static site generation
  trailingSlash: true, // Adds trailing slashes to URLs
  images: {
    unoptimized: true, // Disables image optimization for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'videos.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pics.craiyon.com',
      },
      {
        protocol: 'https',
        hostname: 'png.pngtree.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      // Add this if your icon.png is remote (replace 'example.com' with the actual hostname)
      {
        protocol: 'https',
        hostname: 'example.com', // e.g., 'your-cdn.com' or wherever the icon is hosted
      },
    ],
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
