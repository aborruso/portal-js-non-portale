---
type: Reference
title: "Dati"
description: "I sette dataset di esempio del template, dove stanno i file e cosa il browser scarica da siti esterni."
tags: [dati, datasets-json, parquet, pmtiles]
status: stable
generated: { by: coding-agent/2026-10-11, at: 2026-10-11T20:15:00Z }
verified: { by: coding-agent/2026-10-11, at: 2026-10-11T20:15:00Z }
resource: ../../datasets.json
sources:
  - id: manifest
    resource: ../../datasets.json
    title: Elenco dei dataset del portale
  - id: prove
    resource: prove del 2026-10-11 dal browser (agent-browser con finestra su X410)
    title: Anteprima, SQL e mappa verificati sul sito
---

# Come funziona

Ogni dataset è una voce di `datasets.json`[^manifest]: tema, nome breve, titolo, descrizione, licenza, schema delle colonne e uno o più file (risorse). Se il percorso di un file è relativo, il file sta in `public/data/` e viene pubblicato con il sito; se è un URL, il browser lo scarica da lì.

# I dataset di oggi

Sono quelli di esempio del template, non dati nostri.

| Scheda | Titolo | File | Dove sta il file |
|---|---|---|---|
| `@reference/country-codes` | Country Codes | CSV | nel sito |
| `@reference/population-2022` | World Population 2022 | CSV | nel sito |
| `@reference/co2-emissions` | CO₂ Emissions per Capita | CSV | nel sito |
| `@reference/country-indicators` | Country Indicators (bundle) | tre CSV | nel sito |
| `@sales/fruit-sales` | Fruit Sales | CSV | nel sito |
| `@sales/region-metrics` | Region Metrics | Parquet | `data.portaljs.com` |
| `@reference/world-boundaries` | World Country Boundaries | PMTiles e GeoParquet | `data.portaljs.com` |

`data.portaljs.com` è lo storage (Cloudflare R2) di Datopian, che sviluppa PortalJS. Parquet, GeoParquet e PMTiles si leggono a pezzi, con richieste HTTP parziali: il browser scarica solo le parti che servono alla query o alla zona di mappa inquadrata. Verificati il 2026-10-11 sul sito: anteprima delle tabelle, SQL su un CSV e sul Parquet remoto, mappa del mondo da PMTiles.[^prove]

# Cosa scarica il browser da fuori

| Da dove | Cosa |
|---|---|
| `data.portaljs.com` | i file Parquet, GeoParquet e PMTiles di esempio |
| `tiles.openfreemap.org` | lo sfondo della mappa (`components/MapPreview.tsx`) |
| Google Fonts | i caratteri (`pages/_document.tsx`) |
| CDN di DuckDB-Wasm | il motore SQL |

# File grandi

Il template, e la skill `/portaljs-add-dataset`, mandano di default i file grandi su R2 di Datopian tramite Git LFS (`.lfsconfig`, `.gitattributes`). Per questo portale non si vuole: i file piccoli stanno in `public/data/`, per quelli grandi lo spazio è ancora da decidere.

[^manifest]: Elenco dei dataset del portale
[^prove]: Anteprima, SQL e mappa verificati sul sito
