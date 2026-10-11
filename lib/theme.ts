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
}

const THEMES: Record<string, Theme> = {
  editoriale: {
    fonts:
      'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Newsreader:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Work+Sans:wght@400;500;600&display=swap',
    themeColor: '#f6f2e9',
  },
  italia: {
    fonts:
      'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Roboto+Mono:wght@400;500&family=Titillium+Web:wght@400;600;700&display=swap',
    themeColor: '#0066cc',
  },
}

export const THEME = process.env.NEXT_PUBLIC_THEME && THEMES[process.env.NEXT_PUBLIC_THEME]
  ? process.env.NEXT_PUBLIC_THEME
  : 'editoriale'
export const themeConfig = THEMES[THEME]
