---
type: Playbook
title: "Sviluppare in locale"
description: "Clonare il repository, avviare il portale su localhost:3000/portaljs, fare una modifica e pubblicarla con un push."
tags: [sviluppo, npm, nextjs]
status: stable
generated: { by: coding-agent/2026-10-11, at: 2026-10-11T20:15:00Z }
verified: { by: coding-agent/2026-10-11, at: 2026-10-11T20:15:00Z }
sources:
  - id: prove
    resource: next dev e npm run build lanciati il 2026-10-11 su WSL (Node 24.18)
    title: Prove in locale
---

# Cosa serve

Node 22 o più recente, git, e il permesso di scrittura sul repository `aborruso/portal-js-non-portale`.

# Passi

```bash
git clone https://github.com/aborruso/portal-js-non-portale.git
cd portal-js-non-portale
npm install
npm run dev
```

Il portale si apre su `http://localhost:3000/portaljs` e si aggiorna da solo a ogni salvataggio. `http://localhost:3000/portaljs/`, con la barra finale, rimanda lì.[^prove]

Per vedere il sito esattamente come sarà pubblicato:

```bash
npm run build      # crea out/
```

`out/` contiene i file che finiranno sul server; per aprirli in un browser vanno serviti sotto `/portaljs/` (per esempio copiando `out` in una cartella `portaljs` e lanciando un server statico nella cartella sopra).

# Pubblicare

```bash
git add -A
git commit -m "..."
git push
```

Il push su `main` avvia il [deploy](../pubblicazione/deploy.md); dopo circa mezzo minuto la modifica è online. L'esito si vede nella scheda Actions del repository o con `gh run list`.

# Attenzioni

- Gli indirizzi scritti a mano nel codice (`href`, `src`, `fetch`) vanno preceduti da `/portaljs`, perché il sito non sta nella radice. Link fatti con il componente `Link` di Next.js no: ci pensa `basePath`. Vedi la [panoramica](../portale/panoramica.md).
- Alla prima build Next.js può riscrivere `tsconfig.json` e `next-env.d.ts`: le modifiche vanno committate.
- Le skill di Claude Code in `.claude/commands/` (`/portaljs-add-dataset` e le altre) mandano di default i file grandi su R2 di Datopian: vedi [dati](../portale/dati.md).

[^prove]: Prove in locale
