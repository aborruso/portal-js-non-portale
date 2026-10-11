// Graphic themes. Each theme's colours and fonts are CSS variables in
// styles/themes/<name>.css; Tailwind's cream/ink/accent and serif/sans/mono point at
// them (tailwind.config.js), so components never change. The theme is picked at build
// time by NEXT_PUBLIC_THEME (set in next.config.js) and defaults to `editoriale`, the
// template's original look. To add a theme: a CSS file, an import in styles/globals.css
// and an entry here.

type Theme = {
  // Google Fonts stylesheet with the theme's three families.
  fonts: string
  // <meta name="theme-color">.
  themeColor: string
  // Map colours. MapLibre paint needs literal values, not CSS variables: the data
  // layer, the query-result highlight, and the background shown without a basemap.
  // The RGB triplets feed the translucent heatmap ramp and the highlight badge.
  map: { accent: string; accentRgb: string; highlight: string; highlightRgb: string; background: string }
}

const THEMES: Record<string, Theme> = {
  editoriale: {
    fonts:
      'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Newsreader:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Work+Sans:wght@400;500;600&display=swap',
    themeColor: '#f6f2e9',
    map: {
      accent: '#9d4a2c',
      accentRgb: '157,74,44',
      highlight: '#1d4ed8',
      highlightRgb: '29,78,216',
      background: '#ece7db',
    },
  },
  italia: {
    fonts:
      'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Roboto+Mono:wght@400;500&family=Titillium+Web:wght@400;600;700&display=swap',
    themeColor: '#0066cc',
    // design-tokens-italia: blue-40 (primary), orange-40 (contrasts with the blue
    // data layer), gray-96 (background-muted).
    map: {
      accent: '#0066cc',
      accentRgb: '0,102,204',
      highlight: '#cc7a00',
      highlightRgb: '204,122,0',
      background: '#f5f5f5',
    },
  },
}

export const THEME = process.env.NEXT_PUBLIC_THEME && THEMES[process.env.NEXT_PUBLIC_THEME]
  ? process.env.NEXT_PUBLIC_THEME
  : 'editoriale'
export const themeConfig = THEMES[THEME]
