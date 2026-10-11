---
type: Reference
title: "Lingua dell'interfaccia"
description: "Testi dell'interfaccia in file per lingua (locales/), scelta della lingua in next.config.js, funzione t(); come aggiungere una lingua e portare il meccanismo in un altro repository."
tags: [i18n, lingua, traduzione]
status: stable
generated: { by: coding-agent/2026-10-11, at: 2026-10-11T22:30:00Z }
verified: { by: coding-agent/2026-10-11, at: 2026-10-11T22:30:00Z }
resource: ../../lib/i18n.ts
sources:
  - id: i18n
    resource: ../../lib/i18n.ts
    title: Funzioni t(), tn(), formatNumber() e scelta della lingua
  - id: locales
    resource: ../../locales/
    title: File di lingua en.json e it.json
  - id: config
    resource: ../../next.config.js
    title: Configurazione di Next.js, variabile NEXT_PUBLIC_LOCALE
  - id: issue
    resource: https://github.com/aborruso/portal-js-non-portale/issues/2
    title: Issue «Interfaccia in italiano», con la verifica su upstream
---

# Come funziona

I testi dell'interfaccia non sono scritti nei componenti: stanno in `locales/<lingua>.json`, uno per lingua, come coppie chiave-testo.[^locales] I componenti chiamano `t('chiave')`, definita in `lib/i18n.ts`.[^i18n]

| Pezzo | Cosa fa |
|---|---|
| `locales/en.json` | Testi originali del template. È la base: una chiave assente nella lingua attiva si prende da qui. |
| `locales/it.json` | Traduzione italiana, stesse chiavi di `en.json`. |
| `_intl` (in ogni file) | Codice BCP 47 per date e numeri: `en-US`, `it-IT`. |
| `t('chiave', { var })` | Restituisce il testo e riempie i segnaposto `{var}`. Se la chiave manca ovunque, restituisce la chiave stessa: la pagina non si rompe. |
| `tn('chiave', n)` | Singolare e plurale: sceglie `chiave.one` o `chiave.other` e mette in `{count}` il numero formattato. |
| `formatNumber(n)` | Numero nel formato della lingua (`12.345` in italiano). |
| `NEXT_PUBLIC_LOCALE` | Lingua attiva, impostata in `next.config.js` (`env`). Se manca, l'interfaccia è in inglese.[^config] |

La lingua si sceglie al momento della build: il sito è un export statico, quindi non c'è il routing per lingua di Next.js (`/it/…`, `/en/…`), che richiede un server. Una lingua per build.

Restano in inglese, perché non sono testi dell'interfaccia: i messaggi di errore originali di DuckDB, quando non vengono riconosciuti da `humanizeError` in `lib/query/logical.ts`, e i commenti nel codice.

# Aggiungere una lingua

1. Copiare `locales/en.json` in `locales/<lingua>.json` e tradurre i valori, non le chiavi; aggiornare `_intl`.
2. Registrare il file in `DICTIONARIES` in `lib/i18n.ts` (un `import` e una voce).
3. Impostare `NEXT_PUBLIC_LOCALE` in `next.config.js`.

Per controllare che le chiavi coincidano:

```bash
diff <(jq -r 'keys[]' locales/en.json) <(jq -r 'keys[]' locales/it.json)
```

# Portarlo in un altro repository PortalJS

Copiare `lib/i18n.ts` e la cartella `locales/`, poi impostare la lingua in `next.config.js`. I componenti dell'altro repository vanno modificati come qui, sostituendo le frasi con `t('…')`: i nomi delle chiavi seguono i file del template (`search.*`, `dataset.*`, `map.*`, `query.*`), quindi per un portale nato dallo stesso template le sostituzioni sono le stesse.

# Rapporto con il template originale

Il template `portaljs-catalog` di PortalJS è solo in inglese, con i testi scritti nei componenti. In tutto il repository `datopian/portaljs` (11 esempi, 4 pacchetti, 20 `package.json`) non ci sono librerie di traduzione, file di lingua o configurazioni `i18n`: `next-translate` e `useTranslation` compaiono solo in un post del blog del 2021 su un vecchio esempio CKAN.[^issue]

Il meccanismo tocca quindi le stesse righe del template: a ogni `git merge upstream` (vedi [aggiornare il template](../procedure/aggiornare-il-template.md)) un testo cambiato upstream dà un conflitto, che si risolve tenendo la riga nuova e rimettendo la chiave. `lib/i18n.ts` e `locales/` sono file nuovi e non danno conflitti.

[^i18n]: Funzioni t(), tn(), formatNumber() e scelta della lingua
[^locales]: File di lingua en.json e it.json
[^config]: Configurazione di Next.js, variabile NEXT_PUBLIC_LOCALE
[^issue]: Issue «Interfaccia in italiano», con la verifica su upstream
