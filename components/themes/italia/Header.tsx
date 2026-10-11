import Link from 'next/link'
import { useRouter } from 'next/router'
import dcatConfig from '../../../dcat.config.json'
import { t } from '../../../lib/i18n'

// Header of the «italia» theme: the three bands of the Design System Italia header
// (slim with the owner, center with the portal name, nav). Structure and sizes follow
// italia/italia-tailwind-ui (header.css); colours are design-tokens-italia variables.
const CONTAINER = 'mx-auto flex w-full max-w-[1320px] items-center gap-4 px-4'

export default function ItaliaHeader() {
  const { pathname } = useRouter()
  const publisher = dcatConfig.publisher
  const links = [
    { href: '/', label: t('nav.home'), active: pathname === '/' },
    { href: '/search', label: t('search.heading'), active: pathname !== '/' },
  ]
  return (
    <header className="font-sans text-white">
      <div className="bg-[var(--it-color-blue-20)]">
        <div className={`${CONTAINER} h-12 justify-between`}>
          <a
            href={publisher.homepage}
            className="min-w-0 truncate text-sm font-semibold text-white no-underline hover:underline"
          >
            {publisher.name}
          </a>
        </div>
      </div>
      <div className="bg-accent">
        <div className={`${CONTAINER} h-[72px] lg:h-[120px]`}>
          <Link href="/" className="min-w-0 text-white no-underline hover:no-underline">
            <span className="block truncate text-xl font-bold leading-tight lg:text-3xl">
              PortalJS demo
            </span>
            <span className="hidden truncate text-base md:block">Demo di PortalJS sul VPS</span>
          </Link>
        </div>
      </div>
      <nav className="border-t border-white/20 bg-accent">
        <ul className="mx-auto flex w-full max-w-[1320px] px-4">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={l.active ? 'page' : undefined}
                className={`block px-3 py-3 font-semibold text-white no-underline hover:bg-white/10 ${
                  l.active ? 'border-b-4 border-white' : ''
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
