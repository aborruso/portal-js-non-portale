---
type: Reference
title: "Convenzioni del wiki"
description: "Come è scritto questo wiki, cosa significano i campi e come si aggiorna."
tags: [wiki, okf]
status: stable
generated: { by: coding-agent/2026-10-11, at: 2026-10-11T20:15:00Z }
verified: { by: coding-agent/2026-10-11, at: 2026-10-11T20:15:00Z }
sources:
  - id: okf-spec
    resource: https://raw.githubusercontent.com/GoogleCloudPlatform/knowledge-catalog/main/okf/SPEC.md
    title: Open Knowledge Format (OKF), versione 0.2
  - id: vps-wiki
    resource: https://github.com/aborruso/vps-hostinger/blob/main/wiki/convenzioni.md
    title: Convenzioni del wiki del VPS, da cui vengono queste
---

# Cos'è

Questo wiki è un bundle OKF 0.2: una cartella di file Markdown, ognuno con un blocco YAML in testa.[^okf-spec] Ogni file descrive una cosa sola (un "concetto"): una parte del portale, la pubblicazione, una procedura. Si legge con qualunque editor e si versiona con git insieme al codice. Segue le stesse regole del wiki del VPS che ospita il portale.[^vps-wiki]

Descrive il portale **com'è**, non la storia di come ci si è arrivati: quella sta nei commit e in `LOG.md` del repository [`aborruso/vps-hostinger`](https://github.com/aborruso/vps-hostinger), dove sta anche il lato server.

# Struttura

| Cartella | Contenuto | `type` usati |
|---|---|---|
| `portale/` | Cos'è il portale, com'è fatto, i dati | `Reference` |
| `pubblicazione/` | Come arriva online | `Configuration` |
| `procedure/` | Istruzioni passo passo | `Playbook` |

In ogni cartella `index.md` elenca i concetti presenti. `log.md`, nella radice, registra le modifiche al wiki, con la data più recente in alto.

# Campi del frontmatter

| Campo | Significato |
|---|---|
| `type` | Il tipo di concetto. È l'unico obbligatorio. |
| `title`, `description` | Nome e riassunto in una riga; la descrizione è ripetuta in `index.md`. |
| `resource` | Dove sta la cosa descritta: un file del repository, un URL. |
| `tags` | Parole chiave. |
| `status` | `draft` (incompleto), `stable` (valido), `deprecated` (superato, tenuto per memoria). |
| `generated` | Chi ha scritto il contenuto attuale e quando. |
| `verified` | Chi ha controllato il contenuto, sul codice o sul sito, e quando. |
| `stale_after` | Data oltre la quale il contenuto va ricontrollato. Usato dove ci sono versioni di programmi. |
| `sources` | Da dove vengono le informazioni: file del repository, documentazione, comandi. |

Le date sono in UTC, nella forma `2026-10-11T20:15:00Z`.

# Chi ha scritto e chi ha verificato

- Le pagine scritte da un agente portano in `generated.by` e in `verified.by` un nome nella forma `nome/versione`. Vuol dire: verificato con comandi, build o prove sul sito, non riletto da una persona.
- Quando una persona rilegge una pagina e la conferma, aggiunge una voce a `verified` con `human:` seguito dal proprio account, per esempio `human:aborruso`. Le voci precedenti restano.
- Una pagina scritta a mano porta `human:<account>` anche in `generated.by`.

# Come si aggiorna

1. Si cambia qualcosa nel portale o nella pubblicazione.
2. Si aggiorna la pagina che descrive quella cosa, con `generated.at` nuovo. Se la verifica è stata rifatta, si aggiorna anche `verified`.
3. Se la pagina è nuova, la si aggiunge all'`index.md` della sua cartella.
4. Si aggiunge una riga a `log.md`.

Una pagina descrive solo ciò che è stato controllato. Ciò che è previsto ma non ancora fatto resta fuori dal wiki.

# Collegamenti

I collegamenti fra pagine sono percorsi relativi (`../procedure/sviluppare-in-locale.md`), così funzionano anche nell'anteprima dell'editor e su GitHub.

[^okf-spec]: Open Knowledge Format (OKF), versione 0.2
[^vps-wiki]: Convenzioni del wiki del VPS, da cui vengono queste
