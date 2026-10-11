/** @type {import('next').NextConfig} */
// Export statico servito da Caddy sotto /portaljs/ sul VPS (srv2031803.hstgr.cloud)
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  output: 'export',
  basePath: '/portaljs',
  images: { unoptimized: true },
}
module.exports = nextConfig
