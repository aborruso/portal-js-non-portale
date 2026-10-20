---
type: Reference
title: "Catalogo DCAT"
description: "Feed DCAT 3 e DCAT-AP_IT del portale: dove sono, da dove prendono i metadati, come si controllano con le regole AgID e il validatore UE."
tags: [dcat, dcat-ap-it, metadati, harvesting]
status: stable
generated: { by: coding-agent/2026-10-20, at: 2026-10-20T17:15:00Z }
verified: { by: coding-agent/2026-10-20, at: 2026-10-20T17:15:00Z }
resource: https://srv2031803.hstgr.cloud/portaljs/catalog.dcat-ap-it.ttl
sources:
  - id: config
    resource: ../../dcat.config.json
    title: Configurazione del catalogo DCAT
  - id: manifest
    resource: ../../datasets.json
    title: Manifest dei dataset, blocco dcat di ogni dataset
  - id: profilo
    resource: ../../lib/metadata/dcat-profiles.ts
    title: Profilo DCAT-AP_IT del template (profilo dcat-ap-it)
  - id: pr1678
    resource: https://github.com/datopian/portaljs/pull/1678
    title: PR che ha portato il profilo DCAT-AP_IT nel template
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

L'elenco dei feed è in `catalog-feeds.json`, con i percorsi completi del prefisso `/portaljs`, preso dal `basePath` di `next.config.js`.

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

Dalla versione 0.7.0 il profilo `dcat-ap-it` è nel template, in `lib/metadata/dcat-profiles.ts`.[^profilo] È nato dalla issue datopian/portaljs#1668, aperta da onData con le fonti AgID e una prima implementazione in questo repository; Datopian l'ha riscritto da capo nella PR #1678.[^pr1678] Il nostro file `lib/metadata/dcat-ap-it.ts` è stato tolto con l'aggiornamento al template 0.7.0. Il profilo parte da DCAT-AP e aggiunge quello che chiedono le linee guida AgID:[^linee-guida]

- i tipi `dcatapit:*` su catalogo, dataset, distribuzioni, agenti, punto di contatto e licenze;
- editore e titolare come `dcatapit:Agent`, con `dct:identifier` e `foaf:name`;
- `dct:identifier` del dataset nella forma `<codice>:<namespace>/<slug>`, qui `97309210827:ondata/<dataset>`; si può sovrascrivere per dataset con `dcat.identifier`;
- `dct:rightsHolder` e `dct:accrualPeriodicity` su ogni dataset (la frequenza vale `UNKNOWN` se manca), la licenza su ogni distribuzione;
- un IRI del dataset distinto dalla sua pagina (`…/<dataset>#dataset`), perché per AgID la pagina (`dcat:landingPage`) deve essere un semplice documento;
- una distribuzione per ogni file dei dataset con più file (`resources`).

I temi sono scritti come semplici URI del vocabolario UE, senza il tipo `skos:Concept` e senza etichetta. Il nostro profilo aggiungeva tipo ed etichetta italiana per le regole AgID 167 (avviso, una volta per catalogo se nel file non c'è nessun `skos:Concept`) e 169 (errore, per ogni tema di tipo `skos:Concept` senza `skos:prefLabel`). Entrambe sono sospese nel repository pubblico delle regole; la 167 il 2026-10-12 risultava attiva sul validatore online, per la 169 non si sa. Si è scelto di tenere la forma del template e di proporre la modifica a Datopian dopo la risposta di AgID su quali regole applica il servizio online.

Se manca un campo obbligatorio, la build lo segnala (regole `dcat-ap-it` in `lib/metadata/dcat-validate.ts`).

# Come si controlla

Con `dcat-ap-it-generator` di onData, che contiene 122 regole SPARQL: sono quelle del validatore AgID, corrette e integrate a partire dall'ontologia ufficiale.[^tool]

```bash
SITE_URL=https://srv2031803.hstgr.cloud/portaljs npx tsx scripts/generate-dcat.ts
uvx --from dcat-ap-it-generator dcat-ap-it validate public/catalog.dcat-ap-it.ttl   # esce con 1 se ci sono errori
```

Il 2026-10-20, con il profilo del template 0.7.0, il feed dà 0 errori e 16 avvisi, tutti su proprietà raccomandate: descrizione delle distribuzioni (5), `dct:subject` dei dataset (7), data di rilascio e lingua del catalogo (2), tipo della licenza (2). Con il nostro profilo, il 2026-10-11, gli avvisi erano 22.

Il validatore online di AgID usa le regole originali e richiede il caricamento del file dal browser.[^validatore] Il 2026-10-11 il feed pubblicato (`catalog.dcat-ap-it.ttl`) non ha dato errori, solo warning.

Per DCAT-AP europeo, il validatore UE (`https://www.itb.ec.europa.eu/shacl/dcat-ap/upload`, tipo «DCAT-AP 3.0.1 Base») restituisce sempre 5 violazioni su `foaf:name`, anche per un catalogo minimo senza agenti: vengono dai vocabolari che il validatore carica, non dal feed. Al netto di quelle, i feed `dcat-3` e `dcat-ap-it` sono conformi.

[^config]: Configurazione del catalogo DCAT
[^manifest]: Manifest dei dataset, blocco dcat di ogni dataset
[^profilo]: Profilo DCAT-AP_IT del template (profilo dcat-ap-it)
[^pr1678]: PR che ha portato il profilo DCAT-AP_IT nel template
[^linee-guida]: Linee guida AgID per i cataloghi dati, profilo DCAT-AP_IT
[^validatore]: Validatore DCAT-AP_IT di AgID
[^tool]: dcat-ap-it-generator di onData, comando validate
