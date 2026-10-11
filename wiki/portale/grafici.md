---
type: Reference
title: "Grafici dei dataset"
description: "Grafici nella sezione Viste della scheda dataset, dichiarati in datasets.json con la specifica Frictionless Data Package Views (simple: line, bar)."
tags: [grafici, viste, frictionless, recharts]
status: stable
generated: { by: coding-agent/2026-10-12, at: 2026-10-12T00:30:00Z }
verified: { by: coding-agent/2026-10-12, at: 2026-10-12T00:30:00Z }
resource: ../../lib/views.ts
sources:
  - id: spec
    resource: https://specs.frictionlessdata.io/views/
    title: Frictionless Data Package Views, 1.0-beta
  - id: views
    resource: ../../lib/views.ts
    title: Tipo DatasetView e controllo delle viste supportate
  - id: component
    resource: ../../components/DatasetViews.tsx
    title: Componente che disegna i grafici
---

# Come si dichiara un grafico

I grafici si scrivono nel campo `views` di un dataset in `datasets.json`, con la specifica Frictionless «Data Package Views»,[^spec] la stessa che PortalJS segue per i Data Package. Esempio, da CO₂ Emissions per Capita:

```json
"views": [
  {
    "name": "co2-by-country",
    "title": "Tonnellate di CO₂ pro capite per paese (2022)",
    "resources": [0],
    "specType": "simple",
    "spec": { "type": "bar", "group": "country", "series": ["tonnes_per_capita"] }
  }
]
```

| Campo | Significato |
|---|---|
| `resources` | il file da cui leggere i dati, per posizione o per nome; un dataset con un solo file ha una risorsa, posizione `0`, nome `data` |
| `spec.type` | `bar` (barre) o `line` (linea) |
| `spec.group` | la colonna delle categorie o dell'asse X |
| `spec.series` | le colonne dei valori, una serie ciascuna |

L'etichetta di ogni serie è il `title` del campo nello schema Frictionless del dataset (`schema.fields`); se manca, il nome della colonna.

# Come viene disegnato

`components/DatasetViews.tsx` legge lo stesso CSV della tabella di anteprima e disegna il grafico con `recharts`, la libreria indicata dal comando `/portaljs-add-chart` del template.[^component] I colori sono quelli del tema attivo (`lib/theme.ts`): accento per la prima serie, colore di evidenziazione per la seconda. Sugli schermi stretti le etichette dell'asse X sono inclinate.

Si disegnano solo le viste `specType: "simple"` di tipo `bar` o `line` con `group` e `series`;[^views] le altre (`vega`, `plotly`…) sono ignorate. Se un dataset non ha viste disegnabili, la sezione mostra «Ancora nessuna vista».

# Differenza dal template

Il comando `/portaljs-add-chart` del template scrive ogni grafico direttamente nella pagina del dataset. Qui la pagina cambia una volta sola (la sezione Viste legge `views`), e ogni grafico nuovo è una voce in `datasets.json`: niente codice da toccare e meno conflitti con gli aggiornamenti del template.

[^spec]: Frictionless Data Package Views, 1.0-beta
[^views]: Tipo DatasetView e controllo delle viste supportate
[^component]: Componente che disegna i grafici
