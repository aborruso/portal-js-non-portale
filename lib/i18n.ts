// Interface strings. The text lives in locales/<lang>.json, keyed by id; surfaces call
// t('key') instead of writing the words inline. The language is picked at build time by
// NEXT_PUBLIC_LOCALE (set in next.config.js) and defaults to English. A key missing from
// the active language falls back to English, then to the key itself, so a partial
// translation never breaks a page. To add a language: drop locales/<lang>.json next to
// en.json (same keys) and register it in DICTIONARIES below.
import en from '../locales/en.json'
import it from '../locales/it.json'

type Dictionary = Record<string, string>
type Vars = Record<string, string | number>

const DICTIONARIES: Record<string, Dictionary> = { en, it }

export const LOCALE = process.env.NEXT_PUBLIC_LOCALE || 'en'
const dict: Dictionary = DICTIONARIES[LOCALE] ?? en

// BCP 47 tag for dates and numbers (e.g. "it-IT"), stored in each file under `_intl`.
export const INTL_LOCALE = dict._intl ?? en._intl

// Translate `key`, filling {placeholders} from `vars`.
export function t(key: string, vars?: Vars): string {
  const s = dict[key] ?? (en as Dictionary)[key] ?? key
  if (!vars) return s
  return s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m))
}

// Plural form: picks `key.one` or `key.other` and fills {count} with the formatted number.
export function tn(key: string, count: number, vars?: Vars): string {
  return t(`${key}.${count === 1 ? 'one' : 'other'}`, { ...vars, count: formatNumber(count) })
}

export function formatNumber(n: number): string {
  return n.toLocaleString(INTL_LOCALE)
}
