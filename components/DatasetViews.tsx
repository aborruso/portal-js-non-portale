import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import LoadingSpinner from './ui/LoadingSpinner'
import { parseCsv } from './ui/parseCsv'
import { resourceUrl, type Resource } from '../lib/datasets'
import { formatNumber, t } from '../lib/i18n'
import { themeConfig } from '../lib/theme'
import { isSimpleChart, type DatasetView } from '../lib/views'

// The charts of a dataset (lib/views.ts), one per supported view. Client-only
// (recharts measures the container), loaded with next/dynamic from the dataset page.
export default function DatasetViews({ views, resources }: { views: DatasetView[]; resources: Resource[] }) {
  return (
    <div className="flex flex-col gap-8">
      {views.filter(isSimpleChart).map((view, i) => {
        const ref = view.resources?.[0] ?? 0
        const resource = typeof ref === 'number' ? resources[ref] : resources.find((r) => r.name === ref)
        return resource ? <ViewChart key={view.name ?? i} view={view} resource={resource} /> : null
      })}
    </div>
  )
}


// Series colours from the active theme: accent first, then the highlight colour.
const SERIES = [themeConfig.map.accent, themeConfig.map.highlight]
const TICK = { fontSize: 12, fontFamily: 'var(--theme-font-sans)', fill: 'currentColor' }

function ViewChart({ view, resource }: { view: DatasetView; resource: Resource }) {
  const [rows, setRows] = useState<Record<string, string | number>[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  // On narrow screens the category labels are slanted so they don't overlap.
  const [narrow, setNarrow] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    setNarrow(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setNarrow(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const group = view.spec.group as string
  const series = view.spec.series as string[]
  // Series label: the field title from the resource's Table Schema, else its name.
  const label = (field: string) => resource.schema?.fields?.find((f) => f.name === field)?.title ?? field

  useEffect(() => {
    fetch(resourceUrl(resource))
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.text()
      })
      .then((text) =>
        setRows(
          parseCsv(text).rows.map((row) => {
            const out: Record<string, string | number> = { [group]: row[group] }
            for (const field of series) out[field] = Number(row[field])
            return out
          })
        )
      )
      .catch((e: Error) => setError(e.message))
  }, [resource, group, series])

  const Chart = view.spec.type === 'line' ? LineChart : BarChart
  return (
    <figure className="border border-ink/[0.15] p-5">
      {view.title && (
        <figcaption className="mb-4 font-serif text-[17px] font-semibold text-ink">{view.title}</figcaption>
      )}
      {error ? (
        <div className="font-mono text-sm text-red-700">{t('table.loadFailed', { error })}</div>
      ) : !rows ? (
        <LoadingSpinner />
      ) : (
        <div className="h-80 text-ink/70">
          <ResponsiveContainer width="100%" height="100%">
            <Chart data={rows} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <CartesianGrid stroke="currentColor" strokeOpacity={0.15} vertical={false} />
              <XAxis
                dataKey={group}
                tick={TICK}
                interval={0}
                angle={narrow ? -45 : 0}
                textAnchor={narrow ? 'end' : 'middle'}
                height={narrow ? 80 : 30}
                stroke="currentColor"
                strokeOpacity={0.4}
              />
              <YAxis tick={TICK} stroke="currentColor" strokeOpacity={0.4} tickFormatter={(v: number) => formatNumber(v)} />
              <Tooltip formatter={(v: number) => formatNumber(v)} />
              {series.map((field, i) =>
                view.spec.type === 'line' ? (
                  <Line key={field} dataKey={field} name={label(field)} stroke={SERIES[i % SERIES.length]} strokeWidth={2} dot={false} />
                ) : (
                  <Bar key={field} dataKey={field} name={label(field)} fill={SERIES[i % SERIES.length]} />
                )
              )}
            </Chart>
          </ResponsiveContainer>
        </div>
      )}
    </figure>
  )
}
