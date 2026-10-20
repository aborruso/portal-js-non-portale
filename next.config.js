// Sub-path hosting: build with BASE_PATH=/portal to serve the site at
// https://example.org/portal. Empty serves it at the root. This is
// the single source of truth — scripts/generate-dcat.ts reads it from here, and
// the client gets it as NEXT_PUBLIC_BASE_PATH (see lib/basePath.ts).
// Qui il default è /portaljs: export statico servito da Caddy sotto /portaljs/ sul VPS (srv2031803.hstgr.cloud).
const basePath = (process.env.BASE_PATH ?? '/portaljs').replace(/\/+$/, '')

// This portal's UI language: the code of a registered locales/<code>.json (see
// lib/i18n.ts and locales/README.md). Committed here so every build and deploy
// uses it; NEXT_PUBLIC_LOCALE=<code> overrides it for a single build. One locale
// per build — Next's i18n routing does not work with a static export.
const DEFAULT_LOCALE = 'it'
const locale = process.env.NEXT_PUBLIC_LOCALE || DEFAULT_LOCALE

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  output: 'export',
  basePath,
  images: { unoptimized: true },
  // Tema grafico: styles/themes/<tema>.css, vedi lib/theme.ts
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_LOCALE: locale,
    NEXT_PUBLIC_THEME: process.env.NEXT_PUBLIC_THEME || 'italia',
  },
}
module.exports = nextConfig
