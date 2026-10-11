// Dataset views (charts) in datasets.json, following the Frictionless Data Package
// Views spec (https://specs.frictionlessdata.io/views/), «simple» graph spec:
//
//   "views": [
//     { "name": "co2-by-country", "title": "…", "resources": [0],
//       "specType": "simple",
//       "spec": { "type": "bar", "group": "country", "series": ["tonnes_per_capita"] } }
//   ]
//
// `resources` names the data by resource index or name (a single-file dataset has one
// resource, named "data"); `group` is the category / x field, `series` the value
// fields. Series are labelled with the field `title` from the resource's Table Schema,
// else the field name. Only specType "simple" with type "line" or "bar" is rendered
// (components/DatasetViews.tsx); other spec types (vega, plotly…) are skipped.

export type DatasetView = {
  name?: string
  title?: string
  resources?: (number | string)[]
  specType: string
  spec: { type?: string; group?: string; series?: string[] }
}

// Views components/DatasetViews.tsx can draw: simple spec, line or bar, with group and
// series. Kept here so the dataset page can check without loading the chart library.
export function isSimpleChart(view: DatasetView): boolean {
  const { type, group, series } = view.spec ?? {}
  return view.specType === 'simple' && (type === 'line' || type === 'bar') && Boolean(group) && Boolean(series?.length)
}
