/** @type {import('tailwindcss').Config} */
// A theme colour (styles/themes/*.css) usable with Tailwind's opacity modifiers.
const themeColor = (name) =>
  `color-mix(in oklab, var(--theme-${name}) calc(<alpha-value> * 100%), transparent)`

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Editorial palette (imported from the Claude Design mockups). Warm cream
      // canvas, near-black "ink" text, and a single terracotta accent. Colours
      // carry the `<alpha-value>` placeholder so Tailwind's opacity modifiers
      // work (e.g. `text-ink/70`, `border-ink/12`) — the mockups lean heavily on
      // tinted ink for secondary text and hairline borders.
      // Values come from the active theme (styles/themes/*.css, see lib/theme.ts);
      // color-mix keeps the opacity modifiers working on any colour format.
      colors: {
        cream: themeColor('cream'),
        'cream-panel': themeColor('cream-panel'),
        'cream-code': themeColor('cream-code'),
        ink: themeColor('ink'),
        accent: themeColor('accent'),
      },
      // Three families, loaded from Google Fonts in pages/_document.tsx:
      //   serif — Newsreader: headings, dataset titles, and editorial prose.
      //   sans  — Work Sans: labels, metadata, uppercase eyebrows, table cells.
      //   mono  — IBM Plex Mono: the SQL editor and query result cells.
      fontFamily: {
        serif: ['var(--theme-font-serif)'],
        sans: ['var(--theme-font-sans)'],
        mono: ['var(--theme-font-mono)'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
