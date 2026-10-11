---
type: Playbook
title: "Aggiornare il template"
description: "Portare nel portale una versione nuova del template di PortalJS, con il ramo upstream e un merge."
tags: [template, upstream, git, merge]
status: stable
generated: { by: coding-agent/2026-10-11, at: 2026-10-11T20:15:00Z }
verified: { by: coding-agent/2026-10-11, at: 2026-10-11T20:15:00Z }
sources:
  - id: create
    resource: https://github.com/datopian/portaljs/tree/main/packages/create-portaljs
    title: create-portaljs
  - id: prova
    resource: prova del 2026-10-11 in un worktree del ramo upstream
    title: Procedura rifatta con lo stesso commit, diff vuoto
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
rsync -a --delete --exclude .git --exclude node_modules --exclude .next --exclude out \
  "$tmp/portal-js-non-portale/" ./
git diff --stat                      # cosa ha cambiato Datopian
git add -A && git commit -m "upstream: template @ $REF"
git switch main
git merge upstream                   # risolvere gli eventuali conflitti
npm install && npm run build         # deve passare prima del push
git push origin main upstream
```

Tre cose devono restare uguali alla prima volta, altrimenti il diff mostra modifiche che non vengono da Datopian:[^prova]

- il nome della cartella temporanea, `portal-js-non-portale`: `create-portaljs` lo scrive in `package.json`, `package-lock.json` e `README.md`;
- `--name "PortalJS demo"`;
- `--description "Demo di PortalJS sul VPS"`.

Lanciata il 2026-10-11 con lo stesso commit di partenza (`d5c096aa6a4c`), la procedura dà un diff vuoto.

# Dopo il merge

- Controllare che le correzioni per `/portaljs/` siano ancora al loro posto ([panoramica](../portale/panoramica.md)); il controllo dei percorsi del [deploy](../pubblicazione/deploy.md) ferma comunque la pubblicazione se qualcosa punta alla radice.
- Provare in locale con `npm run dev` le pagine toccate dall'aggiornamento.

Le dipendenze (Next.js, DuckDB-Wasm, …) sono un'altra cosa: si aggiornano con `npm`, indipendentemente dal template.

[^prova]: Procedura rifatta con lo stesso commit, diff vuoto
