#!/usr/bin/env node
// Refresh lib/metadata/data-themes.json from the EU Publications Office "data-theme"
// authority table (http://publications.europa.eu/resource/authority/data-theme), the
// vocabulary DCAT-AP and DCAT-AP_IT use for dcat:theme. Writes every concept with its
// official skos:prefLabel in all the languages the table provides, so the portal shows
// a dataset's themes in the interface language without hand-written translations.
//
// Usage:   node scripts/update-data-themes.mjs
// Run it by hand when the vocabulary changes (rarely); the JSON is committed.

import { writeFileSync } from 'node:fs'

const SCHEME = 'http://publications.europa.eu/resource/authority/data-theme'
const OUT = 'lib/metadata/data-themes.json'

async function rdf(url) {
  const res = await fetch(url, { headers: { Accept: 'application/rdf+xml' } })
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
  return res.text()
}

const codes = [...new Set([...(await rdf(SCHEME)).matchAll(/data-theme\/([A-Z_]+)/g)].map((m) => m[1]))].sort()

const themes = {}
for (const code of codes) {
  const xml = await rdf(`${SCHEME}/${code}`)
  const labels = {}
  for (const [, lang, label] of xml.matchAll(/<skos:prefLabel xml:lang="([a-z-]+)">([^<]+)<\/skos:prefLabel>/g))
    labels[lang] = label
  if (!labels.en) throw new Error(`${code}: no English label`)
  themes[`${SCHEME}/${code}`] = { code, labels: Object.fromEntries(Object.entries(labels).sort()) }
}

writeFileSync(OUT, JSON.stringify({ source: SCHEME, themes }, null, 2) + '\n')
console.log(`${OUT}: ${codes.length} themes (${codes.join(' ')})`)
