# Temi grafici: tema «italia» accanto a quello attuale

Obiettivo: un meccanismo a temi scelto da configurazione, con il tema attuale (`editoriale`) come predefinito e un tema `italia` basato sui design token ufficiali del Design System Italia (`design-tokens-italia`), pronto ma non attivo. Allineamento con il template originale: i temi stanno in file nuovi, nel template cambiano poche righe.

## Fasi

### Fase 1 - Meccanismo
- [x] `styles/themes/editoriale.css`: i valori attuali come variabili `--theme-*` (5 colori, 3 font), su `:root` e su `[data-theme="editoriale"]`
- [x] `tailwind.config.js`: colori e font puntano alle variabili, con l'opacità conservata (`color-mix`)
- [x] `globals.css`: sfondo e font del body dalle variabili; import dei file dei temi
- [x] `lib/theme.ts` + `next.config.js` (`NEXT_PUBLIC_THEME`, predefinito `editoriale`); `_document.tsx` imposta `data-theme`, i font e `theme-color` del tema
→ verifica: con `editoriale` il sito è identico a prima (screenshot prima/dopo)

### Fase 2 - Tema italia
- [x] dipendenza `design-tokens-italia` (1.3.3, BSD-3)
- [x] `styles/themes/italia.css`: ruoli del portale → token ufficiali (`--it-color-white`, `--it-color-background-muted`, `--it-color-gray-98`, `--it-color-text-base`, `--it-color-background-primary`, `--it-font-sans/serif/mono`)
- [x] font Titillium Web, Lora, Roboto Mono
→ verifica: build con `NEXT_PUBLIC_THEME=italia`, screenshot di home, ricerca e scheda dataset

### Fase 3 - Documentazione
- [x] pagina del wiki sui temi, `log.md`

## Fuori da questo giro
- Colori della mappa (`MapPreview.tsx`): sono scritti nel codice (terracotta) e restano tali anche col tema italia.

## Domande aperte
- Nessuna per ora.

## Revisione (2026-10-11)

- Con `editoriale` home, ricerca, scheda dataset e scheda con mappa sono identiche pixel per pixel a prima (screenshot a 1280×900).
- Con `NEXT_PUBLIC_THEME=italia`: sfondo bianco, accento `#0066CC`, Lora / Titillium Web / Roboto Mono.
- Opacità dei colori conservata con `color-mix` (i componenti usano molto `text-ink/70`, `border-ink/[0.12]`…).
- Fuori da questo giro: colori della mappa; "ESEGUI ▶" va a capo nel bottone dell'editor SQL (difetto della traduzione, non del tema).
