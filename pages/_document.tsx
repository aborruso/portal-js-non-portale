import { Html, Head, Main, NextScript } from 'next/document'
import { LOCALE, t } from '../lib/i18n'
import { THEME, themeConfig } from '../lib/theme'

export default function Document() {
  return (
    <Html lang={LOCALE} data-theme={THEME}>
      <Head>
        {/* Default PortalJS branding — PLACEHOLDER. Replace the files in `public/`
            (favicon.ico, icon.svg, apple-touch-icon.png, icon-512.png) with your
            own brand marks; these links can stay as-is once the files are swapped. */}
        <link rel="icon" href="/portaljs/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/portaljs/icon.svg" />
        <link rel="apple-touch-icon" href="/portaljs/apple-touch-icon.png" />
        <meta name="description" content="Demo di PortalJS sul VPS" />
        <meta name="theme-color" content={themeConfig.themeColor} />
        {/* DCAT feed autodiscovery — lets national/EU/US open-data portals (and
            harvesters like data.europa.eu) find this catalog's machine-readable
            metadata. /catalog.jsonld is the stable canonical feed, regenerated at
            build by scripts/generate-dcat.ts. Additional profile/serialization feeds
            are indexed in /catalog-feeds.json. See /portaljs-add-dcat. */}
        <link
          rel="alternate"
          type="application/ld+json"
          href="/portaljs/catalog.jsonld"
          title={t('meta.catalogFeed')}
        />
        {/* Editorial type system (Claude Design import): Newsreader (serif),
            Work Sans (sans), IBM Plex Mono (SQL editor). Loaded via <link> — no
            build-time fetch, so the scaffold builds offline and ships no font
            binaries. Referenced by the font-serif/sans/mono Tailwind utilities. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href={themeConfig.fonts}
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
