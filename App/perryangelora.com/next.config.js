/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  reactStrictMode: true,
  images: {
    domains: ['s3.amazonaws.com']
  },
};

module.exports = nextConfig;
