# Temi DCAT ed editore

Obiettivo: i temi del portale sono i 14 temi ufficiali del vocabolario UE data-theme (già in `dcat.themes` di ogni dataset), con l'etichetta ufficiale nella lingua dell'interfaccia; il namespace diventa l'editore (`ondata` per tutti, come `dct:publisher` del feed DCAT-AP_IT).

## Situazione di partenza (verificata il 2026-10-12)

- `lib/datasets.ts:22` `NAMESPACE_TYPE = 'theme'`: il namespace (`reference`, `sales`, testo libero dei dati di esempio) è mostrato come "Tema" e "Temi".
- `dcat.themes` ha già URI UE (`…/data-theme/ECON`), usati solo nei feed DCAT.
- Il vocabolario del Publications Office ha 14 codici; le etichette (`skos:prefLabel`) si leggono codice per codice, 27 lingue per `ECON`.

## Fasi

### Fase 1 - Etichette ufficiali
- [x] `scripts/update-data-themes.mjs`: scarica i 14 codici e le etichette in tutte le lingue, scrive `lib/metadata/data-themes.json`
- [x] `lib/data-themes.ts`: `themeLabel(uri)` nella lingua dell'interfaccia, poi inglese, poi il codice
→ verifica: 14 codici nel JSON, `it` ed `en` presenti per ognuno

### Fase 2 - Interfaccia
- [x] Ricerca: gruppo di filtri "Temi" da `dcat.themes` (un dataset può stare in più temi), con le etichette ufficiali
- [x] Scheda dataset: campo "Temi" nella barra laterale
- [x] `NAMESPACE_TYPE = 'owner'`; in italiano "Editore" / "Editori"
→ verifica: build e controllo dell'esportazione; ricerca e scheda in italiano mostrano le etichette italiane, filtro per tema funzionante

### Fase 3 - Dati
- [x] `datasets.json`: `namespace` → `ondata` per i 7 dataset (gli URL diventano `/@ondata/<slug>`)
→ verifica: feed DCAT rigenerati con identificativi e landing page nuovi; nessun link a `/@reference` o `/@sales` nell'esportazione

### Fase 4 - Documentazione
- [x] wiki: pagina sui temi DCAT, `portale/dati.md`, `log.md`

## Fuori da questo giro
- README.md e `lib/metadata/README.md` vengono dal template e citano `@reference`: restano come sono.
- Proposta upstream (issue in inglese) dopo il merge, se va bene.

## Domande aperte
- Nessuna. Decisi il 2026-10-12: editore `ondata` per tutti, filtro "Temi" con logica "o", feed mai raccolto (il cambio di URL non va gestito).

## Revisione (2026-10-12)

- 14 temi, 27 lingue (24 per `OP_DATPRO`); le 13 etichette italiane già scritte in `lib/metadata/dcat-ap-it.ts` coincidono con quelle ufficiali, ora lette dal JSON. Feed DCAT-AP_IT identico a prima, salvo `dct:modified`.
- Build in italiano: ricerca con "Temi" (Ambiente 2, Economia e finanze 2, Popolazione e società 2, Tematiche internazionali 2); Ambiente → 2 dataset, + Economia e finanze → 4. Filtro "Editori" assente (un solo editore). Scheda `country-indicators`: Editore `@ondata`, Temi Popolazione e società e Ambiente.
- Nessun link a `/@reference` o `/@sales` in `out/` né nei feed; `check-export` pulito; `tsc` pulito.
- `scripts/harvest-roundtrip.test.ts` cercava `reference_country-codes`: aggiornato a `ondata_country-codes`, ora passa. `validate-dcat-roundtrip.ts` fallisce anche su `main` (cerca file in `/tmp/dcat-validation` prodotti da un altro script): non legato a questa modifica.
