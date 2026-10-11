---
type: Reference
title: "Temi grafici"
description: "Temi dell'interfaccia scelti da configurazione: editoriale (quello del template) e italia (attivo, design token ufficiali del Design System Italia)."
tags: [temi, grafica, design-system-italia, tailwind]
status: stable
generated: { by: coding-agent/2026-10-11, at: 2026-10-11T22:30:00Z }
verified: { by: coding-agent/2026-10-11, at: 2026-10-11T22:30:00Z }
resource: ../../lib/theme.ts
sources:
  - id: theme
    resource: ../../lib/theme.ts
    title: Elenco dei temi, font e theme-color
  - id: css
    resource: ../../styles/themes/
    title: Variabili CSS di ogni tema
  - id: tokens
    resource: https://github.com/italia/design-tokens-italia
    title: design-tokens-italia, design token ufficiali del Design System Italia
---

# Come funziona

I componenti non scrivono mai colori o font: usano 5 colori di ruolo (`cream` sfondo, `cream-panel` pannelli, `cream-code` editor, `ink` testo, `accent` accento) e 3 famiglie (`serif`, `sans`, `mono`), definiti in `tailwind.config.js`. Ogni ruolo punta a una variabile CSS `--theme-*`; ogni tema dà i suoi valori a quelle variabili in `styles/themes/<tema>.css`.[^css] Cambiando tema cambia tutto il sito, senza toccare i componenti.

Il tema si sceglie al momento della build con `NEXT_PUBLIC_THEME` in `next.config.js`; `pages/_document.tsx` lo scrive in `<html data-theme="…">` e carica i font del tema.[^theme]

| Tema | Aspetto | Font |
|---|---|---|
| `editoriale` | quello originale del template: crema, testo quasi nero, accento terracotta | Newsreader, Work Sans, IBM Plex Mono |
| `italia` (attivo) | Design System Italia: sfondo bianco, accento blu `#0066CC` | Lora, Titillium Web, Roboto Mono |

Il tema `italia` non copia i valori a mano: usa le variabili `--it-*` del pacchetto npm `design-tokens-italia` (1.3.3, licenza BSD-3), i token ufficiali del Design System Italia.[^tokens] Corrispondenze: sfondo `--it-color-white`, pannelli `--it-color-background-muted`, editor `--it-color-gray-98`, testo `--it-color-text-base`, accento `--it-color-background-primary`, font `--it-font-serif/sans/mono`.

# Provare e scegliere un tema

```bash
NEXT_PUBLIC_THEME=editoriale npm run build   # anteprima di un altro tema, senza cambiare la configurazione
```

Il tema attivo è il valore predefinito in `next.config.js` (`process.env.NEXT_PUBLIC_THEME || 'italia'`); dal 2026-10-12 è `italia`.

Con `editoriale` il sito è identico a prima dell'introduzione dei temi: il 2026-10-11 home, ricerca, scheda dataset e scheda con mappa sono state confrontate pixel per pixel, senza differenze.

# Limiti

- I colori della mappa (`components/MapPreview.tsx`) sono scritti nel codice e restano terracotta anche con il tema `italia`.
- I box d'errore restano rossi e i colori delle differenze riga per riga restano fissi, in tutti i temi.

# Aggiungere un tema

1. `styles/themes/<tema>.css` con le 8 variabili `--theme-*` sotto `[data-theme='<tema>']`.
2. Un `@import` in `styles/globals.css`.
3. Una voce in `THEMES` in `lib/theme.ts`, con il foglio Google Fonts e il `theme-color`.

[^theme]: Elenco dei temi, font e theme-color
[^css]: Variabili CSS di ogni tema
[^tokens]: design-tokens-italia, design token ufficiali del Design System Italia
