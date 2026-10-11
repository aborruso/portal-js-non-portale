---
type: Configuration
title: "Deploy"
description: "A ogni push su main una GitHub Action fa la build e copia il sito in /srv/portaljs sul VPS, con una chiave che può solo scrivere lì."
tags: [github-actions, deploy, rsync, rrsync, ssh]
status: stable
generated: { by: coding-agent/2026-10-11, at: 2026-10-11T20:15:00Z }
verified: { by: coding-agent/2026-10-11, at: 2026-10-11T20:15:00Z }
resource: ../../.github/workflows/deploy.yml
stale_after: 2027-01-11T00:00:00Z
sources:
  - id: workflow
    resource: ../../.github/workflows/deploy.yml
    title: GitHub Action di deploy
  - id: server
    resource: https://github.com/aborruso/vps-hostinger/blob/main/scripts/setup-portaljs.sh
    title: Script del lato server (utente di deploy)
  - id: caddy
    resource: https://github.com/aborruso/vps-hostinger/blob/main/wiki/software/caddy.md
    title: Caddy sul VPS
  - id: run
    resource: https://github.com/aborruso/portal-js-non-portale/actions
    title: Esecuzioni dell'Action del 2026-10-11
---

# Lo schema

push su `main` → GitHub Action `deploy`[^workflow] → build statica in `out/` → `rsync` sul VPS come `portaljs-deploy` → `/srv/portaljs` → Caddy la serve su `/portaljs/`.[^caddy]

Sul VPS non si compila niente e non serve Node: arrivano solo i file finiti. L'Action si può lanciare anche a mano dalla scheda Actions (`workflow_dispatch`); due esecuzioni non si sovrappongono.

# I passi dell'Action

| Passo | Cosa fa |
|---|---|
| `checkout`, `setup-node` (v7) | codice e Node 22, con la cache di npm |
| `npm ci` | dipendenze esattamente come in `package-lock.json` |
| `npm run build` | rigenera il feed DCAT e costruisce `out/`; `SITE_URL` rende assoluti gli indirizzi dei file nel feed |
| Controllo dei percorsi | si ferma se nell'HTML c'è un `href` o `src` che punta alla radice invece che a `/portaljs/` |
| Copia sul VPS | `rsync --delete`: il sito sul server diventa identico a `out/`, i file tolti spariscono |

# Credenziali

| Secret del repository | Contenuto |
|---|---|
| `VPS_DEPLOY_KEY` | chiave privata ED25519, solo per il deploy |
| `VPS_KNOWN_HOSTS` | la riga `known_hosts` del server, impronta `SHA256:kLuPU/AWC3LLMUiAXHNgriioXviGsM7IQq6selj6Otw` |

Il server viene riconosciuto dalla sua impronta: niente `StrictHostKeyChecking no`, che accetterebbe qualunque macchina si presenti a quell'indirizzo. La chiave privata esiste solo nel secret; per cambiarla si genera una coppia nuova, si mette la pubblica in `setup-portaljs.sh` del repository del VPS, si rilancia `sudo ./setup-portaljs.sh deploy` e si aggiorna il secret.

# Il lato server

Lo prepara `setup-portaljs.sh deploy` nel repository del VPS.[^server] L'utente di sistema `portaljs-deploy` è padrone di `/srv/portaljs` e ha una sola chiave, in `/var/lib/portaljs-deploy/.ssh/authorized_keys`, legata al comando `/usr/bin/rrsync -wo -munge /srv/portaljs` e all'opzione `restrict`: con quella chiave si può solo scrivere con rsync dentro `/srv/portaljs`, non aprire una shell, non leggere, non inoltrare porte.

# Prove fatte

Il 2026-10-11:[^run]

- primo push: Action verde in 30 secondi; sul VPS 65 file in `/srv/portaljs`, tutti di `portaljs-deploy`; il feed DCAT online porta la data della build dell'Action;
- secondo push (action portate alla v7): verde in 32 secondi, senza avvisi;
- da fuori: home, scheda della mappa, CSV e feed DCAT rispondono 200.

Non provato: che la chiave venga davvero rifiutata per una shell o per scrivere fuori da `/srv/portaljs`. La copia locale della chiave è andata persa prima della prova; resta solo nel secret.

# Se l'Action fallisce

- **Controllo dei percorsi**: nel codice c'è un indirizzo scritto dalla radice (`"/qualcosa"`); va preceduto da `/portaljs`. L'Action stampa gli indirizzi trovati.
- **Copia sul VPS, `Host key verification failed`**: il server ha cambiato chiave (reinstallazione) o il secret `VPS_KNOWN_HOSTS` è sbagliato. Prima di aggiornarlo, confrontare l'impronta con quella documentata nel wiki del VPS.
- **Copia sul VPS, `Permission denied (publickey)`**: chiave del secret e chiave in `authorized_keys` non sono più una coppia.

Il sito online resta quello dell'ultimo deploy riuscito: una build fallita non tocca il server.

[^workflow]: GitHub Action di deploy
[^server]: Script del lato server (utente di deploy)
[^caddy]: Caddy sul VPS
[^run]: Esecuzioni dell'Action del 2026-10-11
