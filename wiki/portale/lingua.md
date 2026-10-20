---
type: Reference
title: "Lingua dell'interfaccia"
description: "Testi dell'interfaccia in file per lingua (locales/), meccanismo del template dalla 0.7.0: lingua in DEFAULT_LOCALE di next.config.js, funzioni t(), tn(), tx(), controllo con npm run i18n:check."
tags: [i18n, lingua, traduzione]
status: stable
generated: { by: coding-agent/2026-10-20, at: 2026-10-20T17:15:00Z }
verified: { by: coding-agent/2026-10-20, at: 2026-10-20T17:15:00Z }
resource: ../../lib/i18n.ts
sources:
  - id: i18n
    resource: ../../lib/i18n.ts
    title: Funzioni t(), tn(), tx(), formatNumber(), formatDate() e lingue registrate
  - id: locales
    resource: ../../locales/README.md
    title: Istruzioni del template per i file di lingua
  - id: config
    resource: ../../next.config.js
    title: Configurazione di Next.js, DEFAULT_LOCALE
  - id: check
    resource: ../../scripts/check-locales.mjs
    title: Controllo dei file di lingua (npm run i18n:check)
  - id: issue
    resource: https://github.com/aborruso/portal-js-non-portale/issues/19
    title: Issue «Aggiornare a create-portaljs 0.7.0 e interfaccia in italiano»
---

# Come funziona

Dalla versione 0.7.0 il template `portaljs-catalog` ha un suo meccanismo di traduzione, e il portale usa quello.[^issue] I testi dell'interfaccia stanno in `locales/<lingua>.json`, uno per lingua, come coppie chiave-testo; i componenti chiamano `t('chiave')`, definita in `lib/i18n.ts`.[^i18n]

| Pezzo | Cosa fa |
|---|---|
| `locales/en.json` | Testi originali del template, più le chiavi dei file nostri. È la base: una chiave assente nella lingua attiva si prende da qui. |
| `locales/it.json` | Traduzione italiana, stesse chiavi di `en.json`. |
| `_intl` (in ogni file) | Codice BCP 47 per date, numeri e plurali: `en-US`, `it-IT`. |
| `LOCALES` in `lib/i18n.ts` | Le lingue registrate: `{ en, it }`. |
| `DEFAULT_LOCALE` in `next.config.js` | La lingua del portale: `'it'`.[^config] `NEXT_PUBLIC_LOCALE=<codice>` la cambia per una sola build. |
| `t('chiave', { var })` | Restituisce il testo e riempie i segnaposto `{var}`. Se la chiave manca, restituisce la chiave stessa e avvisa in console (fuori produzione). |
| `tn('chiave', n)` | Plurale: sceglie `chiave.one`, `chiave.other` (e le altre categorie di `Intl.PluralRules`). |
| `tx('chiave', { var })` | Come `t()`, ma un segnaposto può contenere markup (per esempio `<code>datasets.json</code>`). |
| `formatNumber(n)`, `formatDate(iso)` | Numeri e date nel formato della lingua. |

La lingua si sceglie al momento della build: il sito è un export statico, quindi non c'è il routing per lingua di Next.js (`/it/…`, `/en/…`). Una lingua per build. `<html lang>` prende il codice della lingua attiva.

Restano in inglese i messaggi di errore originali di DuckDB non riconosciuti da `lib/query/logical.ts` e i commenti nel codice.

# Chiavi nostre

Oltre a quelle del template, `en.json` e `it.json` hanno 9 chiavi usate solo da file di questo repository:

| Chiavi | File |
|---|---|
| `csv.error`, `csv.noRows`, `csv.row` | `components/DatasetViews.tsx` ([grafici](grafici.md)) |
| `dataset.themes` | `pages/[owner]/[slug].tsx` ([temi dei dataset](temi-dcat.md)) |
| `footer.catalog`, `footer.dcatFeed`, `footer.dcatApItFeed`, `footer.publisher`, `footer.poweredBy` | `components/themes/italia/Footer.tsx` ([temi grafici](temi.md)) |

Nei file sono inserite in coda al gruppo con lo stesso prefisso, senza cambiare l'ordine e le righe vuote di `en.json` del template: così un aggiornamento del template dà meno conflitti.

# Controllo

```bash
npm run i18n:check
```

Fallisce se un file non ha tutte le chiavi, perde o inventa un segnaposto, non ha `_intl`, non è registrato in `LOCALES`, o se `DEFAULT_LOCALE` indica una lingua non registrata.[^check] Oggi passa con 175 chiavi; l'unico avviso riguarda le forme `.many` che l'italiano usa per i numeri molto grandi e che ripiegano su `.other`.

# Aggiungere una lingua

1. Copiare `locales/en.json` in `locales/<codice>.json`, tradurre i valori (non le chiavi, non i segnaposto) e impostare `_intl`.
2. Registrare il file in `LOCALES` in `lib/i18n.ts` (un `import` e una voce).
3. Per farne la lingua del portale, impostare `DEFAULT_LOCALE` in `next.config.js`.
4. Lanciare `npm run i18n:check`.

Le istruzioni del template sono in `locales/README.md`.[^locales]

# Aggiornare il template

Quando il template aggiunge chiavi a `en.json`, `npm run i18n:check` segnala quelle che mancano in `it.json`: si traducono e si aggiungono nella stessa posizione. Vedi [aggiornare il template](../procedure/aggiornare-il-template.md).

[^i18n]: Funzioni t(), tn(), tx(), formatNumber(), formatDate() e lingue registrate
[^locales]: Istruzioni del template per i file di lingua
[^config]: Configurazione di Next.js, DEFAULT_LOCALE
[^check]: Controllo dei file di lingua (npm run i18n:check)
[^issue]: Issue «Aggiornare a create-portaljs 0.7.0 e interfaccia in italiano»
