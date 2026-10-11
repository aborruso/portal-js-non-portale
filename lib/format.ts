// Client-safe formatting helpers. Kept separate from lib/history.ts (which imports
// `child_process` and is server-only) so surfaces can format dates in the render path
// without dragging Node built-ins into the browser bundle.

import { INTL_LOCALE } from './i18n'

// Render an ISO 8601 timestamp as a short human date in the interface language ("Aug 25, 2021"). Returns the input
// unchanged when it isn't parseable, so a non-ISO string still displays.
export function formatDate(iso: string): string {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return iso
  return new Date(t).toLocaleDateString(INTL_LOCALE, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
