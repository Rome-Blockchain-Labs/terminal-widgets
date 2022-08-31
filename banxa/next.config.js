/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/webhook',
        destination: '/api/banxa/webhook',
      },
    ]
  },
}

module.exports = nextConfig
