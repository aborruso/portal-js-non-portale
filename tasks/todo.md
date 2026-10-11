# Profilo DCAT-AP_IT (issue #5)

Obiettivo: il portale espone un feed DCAT-AP_IT che passa il validatore AgID (https://validatore.dati.gov.it), senza rompere i feed DCAT/DCAT-AP già pubblicati.

## Situazione di partenza (verificata il 2026-10-11)

Il generatore (`scripts/generate-dcat.ts`) costruisce un catalogo DCAT-3 di base (`lib/metadata/dcat.ts`); ogni profilo lo arricchisce (`lib/metadata/dcat-profiles.ts`) e `lib/metadata/dcat-validate.ts` segnala i campi obbligatori mancanti. I profili si aggiungono con `registerDcatProfile()`. Per ogni dataset, `datasets.json` può portare un blocco `dcat` (oggi letto: `publisher`, `contactPoint`, `themes`, `accessLevel`, `spatial`).

Confronto tra il feed pubblicato oggi e gli obbligatori DCAT-AP_IT (tabella 1.3.2 delle linee guida AgID):

| Elemento obbligatorio | Oggi |
|---|---|
| Catalogo: titolo, descrizione, data modifica, dataset | presenti (titolo e descrizione generici) |
| Catalogo: editore `dct:publisher` | manca (`dcat.config.json` vuoto, issue #4) |
| Dataset: titolo, descrizione, distribuzione | presenti |
| Dataset: identificativo `codiceIPA:D.n` | c'è `dct:identifier`, ma vale `reference/country-codes` |
| Dataset: data ultima modifica | manca nel feed |
| Dataset: temi (vocabolario UE) | mancano |
| Dataset: titolare `dct:rightsHolder` | manca, nessun campo nel manifest |
| Dataset: frequenza `dct:accrualPeriodicity` | manca, nessun campo nel manifest |
| Distribuzione: formato, URL di accesso | presenti; il formato è già un URI UE (`file-type/CSV`) |
| Distribuzione: licenza | è sul dataset, non sulla distribuzione |
| Soggetto `dcatapit:Agent`: identificativo, nome | non esiste |
| Tipi `dcatapit:Catalog/Dataset/Distribution` | non esistono |

## Fasi

### Fase 0 - Decisioni (servono le risposte in fondo)
- [x] Editore del catalogo e titolare dei dataset, con identificativo
- [x] Licenza, temi e frequenza di ogni dataset
→ verifica: valori scritti nelle domande aperte qui sotto

### Fase 1 - Dati
- [x] `dcat.config.json`: titolo, descrizione, editore con identificativo, contatto, lingua, homepage (chiude anche #4)
- [x] `datasets.json`: per ogni dataset, nel blocco `dcat`, `themes`, `rightsHolder`, `accrualPeriodicity`, eventuale `identifier`
→ verifica: `npm run build` senza avvisi di campi mancanti per `dcat-ap`

### Fase 2 - Profilo
- [x] Nuovo file `lib/metadata/dcat-ap-it.ts` (file nuovo, così le modifiche al template restano minime) con il profilo `dcat-ap-it`, che parte da DCAT-AP e aggiunge:
  - namespace `dcatapit` e tipi `dcatapit:*` accanto a `dcat:*`
  - editore e titolare come `dcatapit:Agent` con `dct:identifier` e `foaf:name`
  - `dct:identifier` del dataset nella forma `codice:D.n`
  - `dct:rightsHolder`, `dct:accrualPeriodicity`, `dct:modified` (dal manifest, altrimenti dall'ultima modifica git)
  - licenza su ogni distribuzione
- [x] Registrazione: un `import` in `scripts/generate-dcat.ts`
- [x] Regole `dcat-ap-it` in `dcat-validate.ts`, così la build avvisa dei campi mancanti
→ verifica: `DCAT_PROFILES=dcat-ap-it npm run build` produce `catalog.dcat-ap-it.{jsonld,ttl,rdf}` senza avvisi

### Fase 3 - Validazione
- [x] Caricare il feed su https://validatore.dati.gov.it: zero errori
- [x] Opzionale: eseguire in locale le 157 regole SPARQL di `italia/daf-semantic-validator`, per avere il controllo anche in build
- [x] Controllare che i feed `dcat-3` esistenti non cambino
→ verifica: report del validatore senza errori; diff dei feed `dcat-3` vuoto

### Fase 4 - Pubblicazione
- [x] Aggiungere `dcat-ap-it` a `profiles` in `dcat.config.json`
- [x] Pagina del wiki sul DCAT, `log.md`
- [x] PR, merge, deploy; verifica del feed online
- [x] Riprendere upstream (datopian/portaljs#1668) con il link all'implementazione
→ verifica: `/portaljs/catalog.dcat-ap-it.ttl` risponde 200 e passa il validatore

## Domande aperte

1. Chi è l'editore? Il portale non è di una PA: niente codice IPA. Usiamo un identificativo diverso (es. codice fiscale, o un nome come `ondata`), sapendo che il validatore potrebbe non accettarlo?
2. I 7 dataset di esempio sono di fonti esterne (ISO, Banca Mondiale…): il titolare è la fonte o chi pubblica il portale?
3. Teniamo i dataset di esempio o il profilo va provato su dati veri (es. quelli di Datasette, issue #1)?
4. Le date: il feed usa `xsd:dateTime`, gli esempi AgID `xsd:date`. Da vedere se il validatore lo accetta.
5. Validazione in build con le regole SPARQL: la vogliamo subito o basta il validatore online?

## Revisione (2026-10-11)

- Decisioni: editore Associazione onData (codice fiscale 97309210827, contatto info@ondata.it); titolare la fonte (ISO, Natural Earth; Datopian per i 5 dataset senza fonte, licenza MIT del repo `datopian/portaljs`); frequenza `UNKNOWN`; dati di esempio.
- Validazione locale con `dcat-ap-it-generator` 0.1.9 (122 regole): 0 errori, 22 avvisi su proprietà raccomandate. Validatore online AgID sul feed pubblicato: nessun errore, solo warning (prova manuale, 2026-10-11).
- Validatore UE DCAT-AP 3.0.1 base: conformi `dcat-3` e `dcat-ap-it`, a parte 5 violazioni `foaf:name` che compaiono anche su un catalogo minimo (vengono dal validatore).
- Trovato e corretto un difetto del template: i dataset con più file non avevano distribuzioni in nessun feed DCAT (`toDCAT` in `lib/metadata/dcat.ts`). Da segnalare upstream.
- Domanda 4 risolta: le regole AgID accettano `xsd:date` e `xsd:dateTime`. Domanda 5: si usa il comando `validate` di `dcat-ap-it-generator`, non in build.
- Dopo il merge di #7: feed online, #5 chiusa, datopian/portaljs#1668 riaperta con il link all'implementazione; difetto delle distribuzioni segnalato in datopian/portaljs#1669.
