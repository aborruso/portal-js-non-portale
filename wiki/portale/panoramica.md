---
type: Reference
title: "Panoramica"
description: "Il portale PortalJS su https://srv2031803.hstgr.cloud/portaljs/: pagine, versione del template, perché sta sotto /portaljs/."
tags: [portaljs, nextjs, sito-statico]
status: stable
generated: { by: coding-agent/2026-10-11, at: 2026-10-11T20:15:00Z }
verified: { by: coding-agent/2026-10-11, at: 2026-10-11T20:15:00Z }
resource: https://srv2031803.hstgr.cloud/portaljs/
stale_after: 2027-01-11T00:00:00Z
sources:
  - id: portaljs
    resource: https://github.com/datopian/portaljs
    title: Repository di PortalJS (Datopian, licenza MIT)
  - id: template
    resource: https://github.com/datopian/portaljs/tree/main/examples/portaljs-catalog
    title: Template portaljs-catalog
  - id: config
    resource: ../../next.config.js
    title: Configurazione di Next.js del portale
---

# Scheda

| Voce | Valore |
|---|---|
| Indirizzo | `https://srv2031803.hstgr.cloud/portaljs/`, pubblico, senza login |
| Origine | template `portaljs-catalog` di PortalJS[^template], creato con `create-portaljs` 0.6.0 al commit `d5c096aa6a4c` |
| Tecnologia | Next.js 16.2.9, React 19, Tailwind; DuckDB-Wasm per l'SQL nel browser, MapLibre per le mappe |
| Tipo di sito | statico: `next build` con `output: 'export'` produce la cartella `out/`[^config] |
| Ospitato su | VPS Hostinger `srv2031803.hstgr.cloud`, file in `/srv/portaljs` serviti da Caddy |

# Le pagine

| Pagina | Indirizzo | File |
|---|---|---|
| Home | `/portaljs` | `pages/index.tsx` |
| Catalogo e ricerca | `/portaljs/search` | `pages/search.tsx` |
| Scheda di un dataset | `/portaljs/@<editore>/<dataset>` | `pages/[owner]/[slug].tsx` |
| Feed DCAT | `/portaljs/catalog.jsonld` (e `.ttl`, `.rdf`) | generato da `scripts/generate-dcat.ts` |

La scheda di un dataset mostra metadati, anteprima della tabella, editor SQL che gira nel browser, grafici, mappa per i dati geografici, download e licenza. Il primo pezzo dell'indirizzo è l'editore (`NAMESPACE_TYPE = 'owner'` in `lib/datasets.ts`); i temi sono quelli ufficiali DCAT ([temi dei dataset](temi-dcat.md)).

# Sola lettura

È un sito statico: sul server ci sono solo file, serviti da Caddy. Non gira nessun programma del portale, non c'è un database né un'area di amministrazione: da internet non si può scrivere niente. Le interrogazioni SQL girano nel browser di chi visita.

# Perché sotto /portaljs/

Il server ha un solo nome, condiviso da più progetti: la radice resta libera e ogni progetto sta in un suo percorso. Per questo `next.config.js` imposta `basePath: '/portaljs'`, che sistema link interni e file di Next.js. I percorsi scritti a mano nel codice vanno sempre preceduti da `/portaljs`; oggi sono:

- `lib/datasets.ts`, funzione `resourceUrl`: `/portaljs/data/<file>`;
- `pages/_document.tsx`: le tre icone e il feed DCAT.

La build della [pubblicazione](../pubblicazione/deploy.md) si ferma se nell'HTML resta un indirizzo fuori da `/portaljs/`.

[^template]: Template portaljs-catalog
[^config]: Configurazione di Next.js del portale
