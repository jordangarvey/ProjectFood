/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable compression for better performance
  compress: true,

  // Remove X-Powered-By header for security
  poweredByHeader: false,

  // Optimize package imports for better tree-shaking
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-alert-dialog'],
  },

  // Image optimization configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Production optimizations
  swcMinify: true,
  reactStrictMode: true,
};

export default nextConfig;
