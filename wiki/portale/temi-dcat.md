---
type: Reference
title: "Temi ed editore dei dataset"
description: "I temi dei dataset sono quelli ufficiali del vocabolario UE data-theme (dcat:theme), con le etichette nella lingua dell'interfaccia; il namespace dell'indirizzo è l'editore."
tags: [temi, dcat, dcat-ap-it, vocabolari, editore, namespace]
status: stable
generated: { by: coding-agent/2026-10-12, at: 2026-10-12T20:10:00Z }
verified: { by: coding-agent/2026-10-12, at: 2026-10-12T20:10:00Z }
resource: ../../lib/data-themes.ts
sources:
  - id: vocab
    resource: http://publications.europa.eu/resource/authority/data-theme
    title: Publications Office, authority table data-theme
  - id: script
    resource: ../../scripts/update-data-themes.mjs
    title: Script che scarica codici ed etichette
  - id: lib
    resource: ../../lib/data-themes.ts
    title: Etichette dei temi nella lingua dell'interfaccia
  - id: namespace
    resource: ../../lib/datasets.ts
    title: NAMESPACE_TYPE e indirizzo dei dataset
---

# Temi

I temi di un dataset sono gli URI del vocabolario UE data-theme,[^vocab] lo stesso che DCAT-AP e DCAT-AP_IT chiedono per `dcat:theme`. Si scrivono nel blocco `dcat` del dataset in `datasets.json`:

```json
"dcat": {
  "themes": [
    "http://publications.europa.eu/resource/authority/data-theme/SOCI",
    "http://publications.europa.eu/resource/authority/data-theme/ENVI"
  ]
}
```

Un dataset può avere più temi. Nella ricerca compare sotto ognuno, e i conteggi del filtro "Temi" possono quindi sommare più dei dataset; scegliendo più temi si vedono i dataset che ne hanno almeno uno. Nella scheda i temi sono nella barra laterale. Il tema non entra nell'indirizzo, che resta uno solo per dataset.

I 14 codici del vocabolario:

| Codice | Etichetta italiana |
|---|---|
| AGRI | Agricoltura, pesca, silvicoltura e prodotti alimentari |
| ECON | Economia e finanze |
| EDUC | Istruzione, cultura e sport |
| ENER | Energia |
| ENVI | Ambiente |
| GOVE | Governo e settore pubblico |
| HEAL | Salute |
| INTR | Tematiche internazionali |
| JUST | Giustizia, sistema giuridico e sicurezza pubblica |
| OP_DATPRO | Dati provvisori |
| REGI | Regioni e città |
| SOCI | Popolazione e società |
| TECH | Scienza e tecnologia |
| TRAN | Trasporti |

# Etichette

Le etichette sono le `skos:prefLabel` ufficiali, in tutte le lingue del vocabolario (27; 24 per `OP_DATPRO`), salvate in `lib/metadata/data-themes.json`. L'interfaccia usa la lingua attiva, poi l'inglese, poi il codice.[^lib] Lo stesso file dà le etichette italiane al feed DCAT-AP_IT ([catalogo DCAT](dcat.md)).

Il file è nel repository, quindi il build non dipende dal server UE. Si rigenera a mano, quando il vocabolario cambia:[^script]

```bash
node scripts/update-data-themes.mjs
```

# Editore

Il primo pezzo dell'indirizzo di un dataset, `/@<namespace>/<slug>`, è un testo libero di `datasets.json`. Con `NAMESPACE_TYPE = 'owner'`[^namespace] l'interfaccia lo chiama "Editore", e nella ricerca diventa il filtro "Editori", che compare solo se gli editori sono almeno due. Oggi è `ondata` per tutti i dataset, come l'editore (`dct:publisher`) del feed DCAT-AP_IT. Fino al 2026-10-12 era `reference` o `sales`, i valori di esempio del template, mostrati come "Tema".

[^vocab]: Publications Office, authority table data-theme
[^lib]: Etichette dei temi nella lingua dell'interfaccia
[^script]: Script che scarica codici ed etichette
[^namespace]: NAMESPACE_TYPE e indirizzo dei dataset
