# Aggiornamento a create-portaljs 0.7.0 e interfaccia in italiano (issue #19)

Obiettivo: `main` costruito sul template `datopian/portaljs@55f2385c98f3` (create-portaljs 0.7.0), con il meccanismo di traduzione di upstream (#1684) e `locales/it.json`, senza le correzioni locali diventate superflue, e con il sito che resta tutto sotto `/portaljs/`.

## Situazione di partenza (verificata il 2026-10-20)

- `upstream` è al primo scaffold (`3b15996`, 0.6.0 @ `d5c096aa6a4c`). `main` è a `62a9e89`.
- Il ramo `temi-dcat` ha un commit (`c715690`) che non è in `main`, non è su `origin` e non ha PR. Tocca `search.tsx`, `[slug].tsx`, `lib/datasets.ts` e il wiki, gli stessi file del merge.
- Il template nuovo, letto dal tarball di `55f2385`, cambia 35 file rispetto a `upstream`; aggiunge `lib/i18n.ts`, `lib/basePath.ts`, `locales/en.json`, `scripts/check-locales.mjs`; toglie `lib/format.ts` (in `main` è modificato e lo usano `pages/[owner]/[slug].tsx` e `lib/history.ts`).
- Traduzioni: `en.json` di upstream ha 167 chiavi, il nostro 156. Solo 54 chiavi hanno lo stesso nome, ma 141 testi inglesi di upstream coincidono con un nostro testo: per quelli la traduzione italiana c'è già. Restano da tradurre circa 26 testi.
- `lib/i18n.ts` di upstream esporta `t`, `tn`, `formatNumber` (come il nostro) più `tx`, `pluralKey`, `formatDate`.
- basePath: upstream lo legge da `BASE_PATH` (vuoto di default) e lo applica con `withBasePath()` a icone, feed, file dei dataset e miniature. Le nostre correzioni a mano in `_document.tsx` e `resourceUrl` e quella della PR #10 dovrebbero diventare inutili.
- In questa sessione `create-portaljs` non scarica il template: Node va in timeout verso GitHub (curl invece passa). Lo scaffold va lanciato da Andrea.
- CI: `deploy.yml` usa Node 22, il template chiede `>=22`.

## Fasi

### Fase 0 - Decisioni e scaffold
- [x] `temi-dcat`: PR #20 unita in `main` il 2026-10-20 (deploy riuscito, run 39459994725; sito 200 su `/portaljs/`, `/search`, feed DCAT-AP_IT; indirizzi `/@ondata/…`). Risposte di Andrea alle domande 1-5: sì a tutte
- [ ] Andrea lancia lo scaffold con il prefisso `!` (comando sotto), in una cartella temporanea
→ verifica: la cartella contiene `locales/en.json` e `lib/i18n.ts`; `package.json` ha nome `portal-js-non-portale`

```bash
tmp=/tmp/claude-1000/-home-aborruso-git-portal-js-non-portale/5eb31591-1bd5-4093-9578-556b6dd28501/scratchpad/tpl
rm -rf "$tmp/portal-js-non-portale"; npx -y create-portaljs@0.7.0 "$tmp/portal-js-non-portale" -y --ref 55f2385c98f3 --name "PortalJS demo" --description "Demo di PortalJS sul VPS" --no-git --no-install
```

### Fase 1 - Ramo upstream
- [ ] `git switch upstream`, rsync dello scaffold come da wiki, commit `upstream: template @ 55f2385c98f3`
→ verifica: `git diff --stat HEAD~1` mostra solo file del template (nessun file nostro: `wiki/`, `tasks/`, temi, `dcat-ap-it.ts`); `.claude/skills` aggiornate e non cancellate

### Fase 2 - Merge in un ramo nuovo
- [x] Ramo `template-0.7.0` da `main`, `git merge upstream`: 20 file in conflitto, tutti risolti il 2026-10-20
- [x] Regola per i conflitti di traduzione: si tiene la versione di upstream di `lib/i18n.ts`, `locales/en.json` e delle chiamate `t()` nei componenti; poi si rimettono le nostre modifiche che non riguardano la lingua (tema italia, grafici, temi DCAT, profilo DCAT-AP_IT). Esito: componenti, pagine, `lib/i18n.ts`, `locales/en.json`, `logical.ts`, `duckdb.ts` da upstream, con `data-ui`, colori della mappa da `themeConfig`, `DatasetViews`, filtro e scheda dei temi DCAT, `NAMESPACE_TYPE = 'owner'` rimessi a mano; `dcat.config.json` con il commento di upstream e i nostri valori
- [x] `lib/format.ts`: si segue upstream (cancellato) e si spostano gli usi su `formatNumber`/`formatDate` di `lib/i18n.ts`
- [x] `next.config.js`: forma di upstream più le nostre voci (`output: 'export'`, `images.unoptimized`, basePath di default `/portaljs`, `DEFAULT_LOCALE = 'it'`, `NEXT_PUBLIC_THEME`)
- [x] `package.json` e `package-lock.json`: fusi senza conflitti; in più rispetto a upstream solo `design-tokens-italia` e `recharts`; `npm ci` passa
→ verifica: nessun marcatore di conflitto (`git diff --check`), `npx tsc --noEmit` pulito. Fatto: entrambi puliti

### Fase 3 - Togliere le correzioni superflue
- [x] `/portaljs` scritto a mano in `pages/_document.tsx` e `lib/datasets.ts` → `withBasePath()` di upstream (nel merge); anche `components/themes/italia/Footer.tsx` passa a `withBasePath`
- [x] correzione della PR #10 (`catalog-feeds.json` con basePath) → quella di upstream (#1675): `scripts/generate-dcat.ts` preso da upstream nel merge
- [x] correzione della PR #7 sulle distribuzioni (`toDCAT` in `lib/metadata/dcat.ts`) → quella di upstream (#1677); il profilo DCAT-AP_IT locale (`lib/metadata/dcat-ap-it.ts`) va confrontato con quello di upstream (#1678) e si decide se tenerlo (domanda 3). Fatto nel merge: `dcat.ts`, `dcat-validate.ts` da upstream; upstream ha il profilo `dcat-ap-it` in `dcat-profiles.ts` con gli stessi campi (`publisher.identifier`, `rightsHolder`, `accrualPeriodicity`), quindi `lib/metadata/dcat-ap-it.ts` è stato tolto. Da verificare in Fase 5 col diff dei feed
- [x] etichetta del filtro da `NAMESPACE_TYPE` (PR #13) → quella di upstream (#1674), presa nel merge
→ verifica: `grep -rn "/portaljs" lib pages components scripts` restituisce solo `next.config.js`; feed DCAT generati uguali a quelli di oggi, a parte le differenze attese (diff di `out/catalog*.ttl` prima e dopo)

### Fase 4 - Italiano
- [x] `locales/it.json` con le chiavi di `en.json` di upstream: le 141 traduzioni che coincidono per testo si riprendono dal nostro `it.json`, le altre si traducono. Fatto: 141 riprese, 26 tradotte
- [x] Le chiavi usate solo da file nostri (`DatasetViews.tsx`, `themes/italia/*`, `lib/theme.ts`) entrano in `en.json` e in `it.json`: 9 chiavi (`csv.*`, `footer.*`, `dataset.themes`), aggiunte senza cambiare la forma del file di upstream
- [x] `LOCALES = { en, it }` in `lib/i18n.ts`, `DEFAULT_LOCALE = 'it'`. `npm run i18n:check`: OK, 175 chiavi (avviso solo sulle forme `.many`, che ripiegano su `.other`)
→ verifica: `npm run i18n:check` passa; stesso numero di chiavi in `en.json` e `it.json`; nessun avviso `[i18n] missing key` con `npm run dev` sulle pagine home, ricerca, scheda

### Fase 5 - Build e percorsi
- [x] `npm run build` in locale: verde il 2026-10-20; nessun percorso fuori da `/portaljs/`; `<html lang="it" data-theme="italia">`. Feed: `dcat-3` guadagna le descrizioni delle distribuzioni; DCAT-AP_IT di upstream con `dcat-ap-it-generator validate` 0 errori e 16 warning (oggi 0 e 22), ma i temi non sono più `skos:Concept` con `skos:prefLabel` italiana (regole 167/169). Decisione: si tiene upstream (domanda 6). Prova nel browser (agent-browser, headless, `out/` servito sotto `/portaljs/`) di home, ricerca, CO2 (grafico), world-boundaries (mappa), country-codes (SQL): testo in italiano, `lang="it"`, tema italia, grafico, mappa e DuckDB caricati, nessun errore in console
→ verifica: build verde; il controllo di `deploy.yml` lanciato in locale su `out/` non trova riferimenti fuori da `/portaljs/`; `out/index.html` ha `<html lang="it"`; prova a mano con `npx serve` sotto `/portaljs/` di home, ricerca, una scheda con mappa e una con grafico

### Fase 6 - Documentazione
- [x] wiki: `panoramica.md` (0.7.0 @ `55f2385`, correzioni per `/portaljs/` che non servono più), `lingua.md` (`LOCALES`, `DEFAULT_LOCALE`, `i18n:check`), `aggiornare-il-template.md` (Node e scaffold), `log.md`
→ verifica: nessun riferimento a `DICTIONARIES` o `NEXT_PUBLIC_LOCALE` come impostazione principale (`grep -rn DICTIONARIES wiki`). Fatto il 2026-10-20: aggiornati anche `dcat.md` (profilo del template, temi) e `log.md`; grep pulito

### Fase 7 - Pubblicazione (solo dopo conferma di Andrea)
- [ ] PR da `template-0.7.0`, merge, `git push origin upstream`
- [ ] Action verde; nel sito: feed DCAT, distribuzioni dei dataset con più file, `<html lang="it">`
- [ ] Commento e chiusura della #19; esito a hostinger-e8
→ verifica: `curl` su `/portaljs/`, `/portaljs/catalog.jsonld`, `/portaljs/catalog.dcat-ap-it.ttl` risponde 200

## Domande aperte

1. `temi-dcat` (`c715690`, mai pushato): prima PR e merge in `main`, poi l'aggiornamento (consigliato, un solo giro di conflitti)? Oppure aggiornamento prima e rebase di `temi-dcat` dopo?
2. Scaffold lanciato da te con `!`: ok?
3. Profilo DCAT-AP_IT: se quello di upstream (#1678) fa le stesse cose, togliamo il nostro `dcat-ap-it.ts`, o lo teniamo finché non si confronta il feed col validatore AgID?
4. `upstream` senza `--namespace` (resta `theme` come il template, `owner` resta modifica nostra): ok?
5. `it.json` anche a datopian/portaljs come PR? È un contributo, non un difetto.
6. Temi nel feed DCAT-AP_IT: upstream li scrive come URI semplici, il nostro profilo come `skos:Concept` con `skos:prefLabel` italiana. Decisione di Andrea (2026-10-20): si tiene upstream; la issue su datopian/portaljs si apre dopo la risposta di Rotundo (AgID) su quali regole applica il validatore online (167 avviso, una sola volta per catalogo; 169 errore, solo sui temi `skos:Concept` senza etichetta). Sollecito inviato il 2026-10-20 nel thread «Validatore DCAT-AP_IT: quali regole applica il servizio online»

# Archivio

## Profilo DCAT-AP_IT (issue #5) - chiuso

Chiuso il 2026-10-11: PR #7 mergiata, feed online su `/portaljs/catalog.dcat-ap-it.ttl`, issue #5 chiusa; dettagli nella revisione in fondo e nel wiki ([dcat](../wiki/portale/dcat.md)).


Obiettivo: il portale espone un feed DCAT-AP_IT che passa il validatore AgID (https://validatore.dati.gov.it), senza rompere i feed DCAT/DCAT-AP già pubblicati.

### Situazione di partenza (verificata il 2026-10-11)

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

### Fasi

#### Fase 0 - Decisioni (servono le risposte in fondo)
- [x] Editore del catalogo e titolare dei dataset, con identificativo
- [x] Licenza, temi e frequenza di ogni dataset
→ verifica: valori scritti nelle domande aperte qui sotto

#### Fase 1 - Dati
- [x] `dcat.config.json`: titolo, descrizione, editore con identificativo, contatto, lingua, homepage (chiude anche #4)
- [x] `datasets.json`: per ogni dataset, nel blocco `dcat`, `themes`, `rightsHolder`, `accrualPeriodicity`, eventuale `identifier`
→ verifica: `npm run build` senza avvisi di campi mancanti per `dcat-ap`

#### Fase 2 - Profilo
- [x] Nuovo file `lib/metadata/dcat-ap-it.ts` (file nuovo, così le modifiche al template restano minime) con il profilo `dcat-ap-it`, che parte da DCAT-AP e aggiunge:
  - namespace `dcatapit` e tipi `dcatapit:*` accanto a `dcat:*`
  - editore e titolare come `dcatapit:Agent` con `dct:identifier` e `foaf:name`
  - `dct:identifier` del dataset nella forma `codice:D.n`
  - `dct:rightsHolder`, `dct:accrualPeriodicity`, `dct:modified` (dal manifest, altrimenti dall'ultima modifica git)
  - licenza su ogni distribuzione
- [x] Registrazione: un `import` in `scripts/generate-dcat.ts`
- [x] Regole `dcat-ap-it` in `dcat-validate.ts`, così la build avvisa dei campi mancanti
→ verifica: `DCAT_PROFILES=dcat-ap-it npm run build` produce `catalog.dcat-ap-it.{jsonld,ttl,rdf}` senza avvisi

#### Fase 3 - Validazione
- [x] Caricare il feed su https://validatore.dati.gov.it: zero errori
- [x] Opzionale: eseguire in locale le 157 regole SPARQL di `italia/daf-semantic-validator`, per avere il controllo anche in build
- [x] Controllare che i feed `dcat-3` esistenti non cambino
→ verifica: report del validatore senza errori; diff dei feed `dcat-3` vuoto

#### Fase 4 - Pubblicazione
- [x] Aggiungere `dcat-ap-it` a `profiles` in `dcat.config.json`
- [x] Pagina del wiki sul DCAT, `log.md`
- [x] PR, merge, deploy; verifica del feed online
- [x] Riprendere upstream (datopian/portaljs#1668) con il link all'implementazione
→ verifica: `/portaljs/catalog.dcat-ap-it.ttl` risponde 200 e passa il validatore

### Domande aperte

1. Chi è l'editore? Il portale non è di una PA: niente codice IPA. Usiamo un identificativo diverso (es. codice fiscale, o un nome come `ondata`), sapendo che il validatore potrebbe non accettarlo?
2. I 7 dataset di esempio sono di fonti esterne (ISO, Banca Mondiale…): il titolare è la fonte o chi pubblica il portale?
3. Teniamo i dataset di esempio o il profilo va provato su dati veri (es. quelli di Datasette, issue #1)?
4. Le date: il feed usa `xsd:dateTime`, gli esempi AgID `xsd:date`. Da vedere se il validatore lo accetta.
5. Validazione in build con le regole SPARQL: la vogliamo subito o basta il validatore online?

### Revisione (2026-10-11)

- Decisioni: editore Associazione onData (codice fiscale 97309210827, contatto info@ondata.it); titolare la fonte (ISO, Natural Earth; Datopian per i 5 dataset senza fonte, licenza MIT del repo `datopian/portaljs`); frequenza `UNKNOWN`; dati di esempio.
- Validazione locale con `dcat-ap-it-generator` 0.1.9 (122 regole): 0 errori, 22 avvisi su proprietà raccomandate. Validatore online AgID sul feed pubblicato: nessun errore, solo warning (prova manuale, 2026-10-11).
- Validatore UE DCAT-AP 3.0.1 base: conformi `dcat-3` e `dcat-ap-it`, a parte 5 violazioni `foaf:name` che compaiono anche su un catalogo minimo (vengono dal validatore).
- Trovato e corretto un difetto del template: i dataset con più file non avevano distribuzioni in nessun feed DCAT (`toDCAT` in `lib/metadata/dcat.ts`). Da segnalare upstream.
- Domanda 4 risolta: le regole AgID accettano `xsd:date` e `xsd:dateTime`. Domanda 5: si usa il comando `validate` di `dcat-ap-it-generator`, non in build.
- Dopo il merge di #7: feed online, #5 chiusa, datopian/portaljs#1668 riaperta con il link all'implementazione; difetto delle distribuzioni segnalato in datopian/portaljs#1669.
