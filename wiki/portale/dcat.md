---
type: Reference
title: "Catalogo DCAT"
description: "Feed DCAT 3 e DCAT-AP_IT del portale: dove sono, da dove prendono i metadati, come si controllano con le regole AgID e il validatore UE."
tags: [dcat, dcat-ap-it, metadati, harvesting]
status: stable
generated: { by: coding-agent/2026-10-11, at: 2026-10-11T21:30:00Z }
verified: { by: coding-agent/2026-10-11, at: 2026-10-11T21:30:00Z }
resource: https://srv2031803.hstgr.cloud/portaljs/catalog.dcat-ap-it.ttl
sources:
  - id: config
    resource: ../../dcat.config.json
    title: Configurazione del catalogo DCAT
  - id: manifest
    resource: ../../datasets.json
    title: Manifest dei dataset, blocco dcat di ogni dataset
  - id: profilo
    resource: ../../lib/metadata/dcat-ap-it.ts
    title: Profilo DCAT-AP_IT
  - id: linee-guida
    resource: https://docs.italia.it/italia/daf/linee-guida-cataloghi-dati-dcat-ap-it/it/stabile/dcat-ap_it.html
    title: Linee guida AgID per i cataloghi dati, profilo DCAT-AP_IT
  - id: validatore
    resource: https://validatore.dati.gov.it
    title: Validatore DCAT-AP_IT di AgID
  - id: tool
    resource: https://github.com/ondata/dcat-ap-it-generator
    title: dcat-ap-it-generator di onData, comando validate
---

# I feed

I feed si rigenerano a ogni build (`scripts/generate-dcat.ts`) da `datasets.json` e `dcat.config.json`.[^config] I profili attivi sono elencati in `profiles`: `dcat-3` e `dcat-ap-it`. Il primo dà anche i nomi senza suffisso.

| Profilo | File (sotto `/portaljs/`) |
|---|---|
| DCAT 3 (W3C) | `catalog.jsonld`, `catalog.ttl`, `catalog.rdf` e le copie `catalog.dcat-3.*` |
| DCAT-AP_IT (dati.gov.it) | `catalog.dcat-ap-it.jsonld`, `.ttl`, `.rdf` |

L'elenco dei feed è in `catalog-feeds.json`; i suoi percorsi oggi mancano del prefisso `/portaljs` (issue #6).

# Da dove vengono i metadati

| Metadato | Dove si scrive |
|---|---|
| Titolo, descrizione e homepage del catalogo | `dcat.config.json` |
| Editore (catalogo e dataset): Associazione onData, codice fiscale `97309210827` | `dcat.config.json`, `publisher` (con `identifier`) |
| Punto di contatto: onData, `info@ondata.it` | `dcat.config.json`, `contactPoint` |
| Data di ultima modifica del dataset | `datasets.json`, `modified` (ISO 8601 con orario) |
| Temi (vocabolario UE `data-theme`) | `datasets.json`, `dcat.themes` |
| Titolare (`name`, `identifier`, `homepage`) | `datasets.json`, `dcat.rightsHolder` |
| Frequenza di aggiornamento (vocabolario UE `frequency`) | `datasets.json`, `dcat.accrualPeriodicity` |
| Licenza | `datasets.json`, `licenses` (la prima), ripetuta su ogni distribuzione |

Nei dataset di esempio il titolare è la fonte: ISO per Country Codes, Natural Earth per World Country Boundaries, Datopian per gli altri cinque, che arrivano senza fonte dal template `portaljs-catalog`. Per quei cinque la licenza è la MIT del repository `datopian/portaljs`. La frequenza è `UNKNOWN` per tutti; la data di modifica è quella del commit con cui i file sono entrati nel repository.

# Il profilo DCAT-AP_IT

`lib/metadata/dcat-ap-it.ts` parte dal profilo DCAT-AP del template e aggiunge quello che il validatore AgID controlla:[^profilo][^linee-guida]

- i tipi `dcatapit:Catalog`, `dcatapit:Dataset`, `dcatapit:Distribution` accanto a quelli `dcat:*`;
- editore e titolare come `dcatapit:Agent`, con `dct:identifier` e `foaf:name`;
- il punto di contatto come `dcatapit:Organization` sui dataset;
- `dct:rightsHolder` e `dct:accrualPeriodicity` su ogni dataset, la licenza su ogni distribuzione;
- un IRI del dataset distinto dalla sua pagina (`…/<dataset>#dataset`), perché per AgID la pagina (`dcat:landingPage`) deve essere un semplice documento.

Se manca un campo obbligatorio, la build lo segnala (regole `dcat-ap-it` in `lib/metadata/dcat-validate.ts`).

Una correzione riguarda tutti i profili: i dataset con più file (`resources`) non avevano distribuzioni, perché `toDCAT` in `lib/metadata/dcat.ts` le costruiva solo dal campo `file`. Ora ne crea una per risorsa.

# Come si controlla

Con `dcat-ap-it-generator` di onData, che contiene 122 regole SPARQL: sono quelle del validatore AgID, corrette e integrate a partire dall'ontologia ufficiale.[^tool]

```bash
SITE_URL=https://srv2031803.hstgr.cloud/portaljs npx tsx scripts/generate-dcat.ts
uvx --from dcat-ap-it-generator dcat-ap-it validate public/catalog.dcat-ap-it.ttl   # esce con 1 se ci sono errori
```

Il 2026-10-11, con la versione 0.1.9, il feed dà 0 errori e 22 avvisi, tutti su proprietà raccomandate (descrizione delle distribuzioni, lingua e data di rilascio del catalogo, `dct:subject`, tipo della licenza).

Il validatore online di AgID usa le regole originali e richiede il caricamento del file dal browser.[^validatore] Il 2026-10-11 il feed pubblicato (`catalog.dcat-ap-it.ttl`) non ha dato errori, solo warning.

Per DCAT-AP europeo, il validatore UE (`https://www.itb.ec.europa.eu/shacl/dcat-ap/upload`, tipo «DCAT-AP 3.0.1 Base») restituisce sempre 5 violazioni su `foaf:name`, anche per un catalogo minimo senza agenti: vengono dai vocabolari che il validatore carica, non dal feed. Al netto di quelle, i feed `dcat-3` e `dcat-ap-it` sono conformi.

[^config]: Configurazione del catalogo DCAT
[^manifest]: Manifest dei dataset, blocco dcat di ogni dataset
[^profilo]: Profilo DCAT-AP_IT
[^linee-guida]: Linee guida AgID per i cataloghi dati, profilo DCAT-AP_IT
[^validatore]: Validatore DCAT-AP_IT di AgID
[^tool]: dcat-ap-it-generator di onData, comando validate
