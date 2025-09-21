/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enables static site generation
  trailingSlash: false, // Disable trailing slashes for Firebase action URLs
  outputFileTracingRoot: 'C:/Users/user/Documents/GitHub/Togo/New/DorfnewAI/frontend',
  images: {
    unoptimized: true, // Required for static export
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
      {
        protocol: 'https',
        hostname: 'example.com', // Replace with actual hostname for icon.png
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

export default nextConfig;