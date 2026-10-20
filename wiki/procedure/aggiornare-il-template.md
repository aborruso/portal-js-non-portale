---
type: Playbook
title: "Aggiornare il template"
description: "Portare nel portale una versione nuova del template di PortalJS, con il ramo upstream e un merge."
tags: [template, upstream, git, merge]
status: stable
generated: { by: coding-agent/2026-10-20, at: 2026-10-20T17:15:00Z }
verified: { by: coding-agent/2026-10-20, at: 2026-10-20T17:15:00Z }
sources:
  - id: create
    resource: https://github.com/datopian/portaljs/tree/main/packages/create-portaljs
    title: create-portaljs
  - id: prova
    resource: prova del 2026-10-11 in un worktree del ramo upstream
    title: Procedura rifatta con lo stesso commit, diff vuoto
  - id: issue19
    resource: https://github.com/aborruso/portal-js-non-portale/issues/19
    title: Aggiornamento a 0.7.0 (commit 55f2385c98f3), 20 file in conflitto
---

# L'idea

Questo repository è una copia del template `examples/portaljs-catalog` di PortalJS, non un fork: gli aggiornamenti di Datopian non arrivano da soli, e niente si rompe se cambiano qualcosa. Per prenderli quando servono ci sono due rami:

| Ramo | Contenuto |
|---|---|
| `upstream` | il template originale, senza nessuna nostra modifica |
| `main` | il portale: template più le nostre modifiche |

Si aggiorna `upstream` con la versione nuova, poi lo si unisce a `main`. Git porta le modifiche di Datopian e tiene le nostre; chiede di scegliere solo dove abbiamo cambiato le stesse righe.

# Passi

```bash
git switch upstream
REF=<commit o tag di datopian/portaljs>
tmp=$(mktemp -d)
npx -y create-portaljs@latest "$tmp/portal-js-non-portale" -y --ref "$REF" \
  --name "PortalJS demo" --description "Demo di PortalJS sul VPS" --no-git --no-install
rsync -a --delete --exclude .git --exclude node_modules --exclude .next --exclude out --exclude tsconfig.tsbuildinfo \
  "$tmp/portal-js-non-portale/" ./
git diff --stat                      # cosa ha cambiato Datopian
git add -A && git commit -m "upstream: template @ $REF"
git switch main
git switch -c template-<versione>    # ramo di lavoro: un push su main pubblica il sito
git merge upstream                   # risolvere gli eventuali conflitti
npm ci && npx tsc --noEmit && npm run i18n:check && npm run build
```

Poi una PR da `template-<versione>` verso `main`; il merge fa partire il [deploy](../pubblicazione/deploy.md). Infine `git push origin upstream`.

`create-portaljs` scarica il template da GitHub: serve la rete, e in un ambiente con sandbox il comando va lanciato fuori.

Tre cose devono restare uguali alla prima volta, altrimenti il diff mostra modifiche che non vengono da Datopian:[^prova]

- il nome della cartella temporanea, `portal-js-non-portale`: `create-portaljs` lo scrive in `package.json`, `package-lock.json` e `README.md`;
- `--name "PortalJS demo"`;
- `--description "Demo di PortalJS sul VPS"`.

Lanciata il 2026-10-11 con lo stesso commit di partenza (`d5c096aa6a4c`), la procedura dà un diff vuoto.

# Risolvere i conflitti

La regola usata con la 0.7.0 (20 file in conflitto):[^issue19] si prende la versione del template e ci si rimettono a mano le nostre modifiche, file per file, guardando `git diff <base> main -- <file>`. Le modifiche nostre che ricorrono:

- attributi `data-ui` su pagine, tabelle, schede e pulsante di download (servono al tema italia, vedi [temi grafici](../portale/temi.md));
- colori della mappa da `themeConfig` in `components/MapPreview.tsx`, `data-theme` e font del tema in `pages/_document.tsx`;
- grafici (`DatasetViews`) e temi DCAT nella scheda e nella ricerca ([grafici](../portale/grafici.md), [temi dei dataset](../portale/temi-dcat.md));
- `NAMESPACE_TYPE = 'owner'` in `lib/datasets.ts`;
- i nostri valori in `dcat.config.json` e in `next.config.js` (`output: 'export'`, `basePath` predefinito `/portaljs`, `DEFAULT_LOCALE = 'it'`, `NEXT_PUBLIC_THEME`).

# Dopo il merge

- `npm run i18n:check`: le chiavi nuove del template vanno tradotte in `locales/it.json` ([lingua](../portale/lingua.md)).
- `grep -rn "'/portaljs\|\"/portaljs" lib pages components scripts` non deve trovare niente: i percorsi passano da `withBasePath()` ([panoramica](../portale/panoramica.md)). Il controllo dei percorsi del deploy ferma comunque la pubblicazione se qualcosa punta alla radice.
- Confrontare i feed DCAT di `out/` con quelli pubblicati e rivalidare il DCAT-AP_IT ([catalogo DCAT](../portale/dcat.md)).
- Provare le pagine nel browser: home, ricerca, una scheda con mappa e una con grafico.

Le dipendenze (Next.js, DuckDB-Wasm, …) sono un'altra cosa: si aggiornano con `npm`, indipendentemente dal template.

[^prova]: Procedura rifatta con lo stesso commit, diff vuoto
[^issue19]: Aggiornamento a 0.7.0 (commit 55f2385c98f3), 20 file in conflitto
