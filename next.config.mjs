/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['10.199.188.167'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
