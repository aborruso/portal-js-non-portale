/** @type {import('next').NextConfig} */
// Export statico servito da Caddy sotto /portaljs/ sul VPS (srv2031803.hstgr.cloud)
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  output: 'export',
  basePath: '/portaljs',
  images: { unoptimized: true },
  // Lingua dell'interfaccia: locales/<lingua>.json, vedi lib/i18n.ts
  env: { NEXT_PUBLIC_LOCALE: 'it' },
}
module.exports = nextConfig
