// Dataset themes: the EU "data-theme" vocabulary that DCAT-AP and DCAT-AP_IT use for
// dcat:theme, read from each dataset's `dcat.themes` (theme URIs) in datasets.json. A
// dataset can have several. Labels are the official skos:prefLabel in the interface
// language (lib/metadata/data-themes.json, refreshed by scripts/update-data-themes.mjs),
// then English, then the theme code.
import vocabulary from './metadata/data-themes.json'
import { LOCALE } from './i18n'
import type { Dataset } from './datasets'

type Theme = { code: string; labels: Record<string, string> }
const THEMES: Record<string, Theme> = vocabulary.themes

export function themeLabel(uri: string): string {
  const theme = THEMES[uri]
  if (!theme) return uri.split('/').pop() ?? uri
  return theme.labels[LOCALE] ?? theme.labels.en ?? theme.code
}

// The labels of a dataset's themes, in the interface language.
export function datasetThemes(d: Dataset): string[] {
  return (d.dcat?.themes ?? []).map(themeLabel)
}
