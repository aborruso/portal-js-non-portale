/** @type {import('next').NextConfig} */
// Export statico servito da Caddy sotto /portaljs/ sul VPS (srv2031803.hstgr.cloud)
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  output: 'export',
  basePath: '/portaljs',
  images: { unoptimized: true },
  // Lingua dell'interfaccia: locales/<lingua>.json, vedi lib/i18n.ts
  // Tema grafico: styles/themes/<tema>.css, vedi lib/theme.ts
  env: { NEXT_PUBLIC_LOCALE: 'it', NEXT_PUBLIC_THEME: process.env.NEXT_PUBLIC_THEME || 'italia' },
}
module.exports = nextConfig
