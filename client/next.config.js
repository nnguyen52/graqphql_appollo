/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { esmExternals: true },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

module.exports = nextConfig;
