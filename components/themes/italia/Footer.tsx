import Link from 'next/link'
import dcatConfig from '../../../dcat.config.json'
import { withBasePath } from '../../../lib/basePath'
import { t } from '../../../lib/i18n'

// Footer of the «italia» theme: the two bands of the Design System Italia footer
// (main in the primary colour, legal in the dark blue). Structure and sizes follow
// italia/italia-tailwind-ui (footer.css). Plain <a> hrefs to site files go
// through withBasePath, like pages/_document.tsx.
const CONTAINER = 'mx-auto w-full max-w-[1320px] px-4'
const LINK = 'text-sm text-white underline decoration-white/50 decoration-1 underline-offset-[3px] hover:decoration-white'

export default function ItaliaFooter() {
  const { publisher, contactPoint } = dcatConfig
  return (
    <footer className="mt-16 font-sans text-white">
      <div className="bg-accent">
        <div className={`${CONTAINER} py-8`}>
          <section className="pb-8">
            <h2 className="text-xl font-normal leading-tight lg:text-2xl">PortalJS demo</h2>
            <span className="hidden text-base md:block">Demo di PortalJS sul VPS</span>
          </section>
          <section className="grid gap-10 border-t border-white/40 py-8 sm:grid-cols-2 lg:grid-cols-4">
            <nav>
              <h3 className="mb-3 text-sm font-semibold uppercase">{t('footer.catalog')}</h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href="/search" className={LINK}>
                    {t('search.heading')}
                  </Link>
                </li>
                <li>
                  <a href={withBasePath('/catalog.jsonld')} className={LINK}>
                    {t('footer.dcatFeed')}
                  </a>
                </li>
                <li>
                  <a href={withBasePath('/catalog.dcat-ap-it.ttl')} className={LINK}>
                    {t('footer.dcatApItFeed')}
                  </a>
                </li>
              </ul>
            </nav>
            <nav>
              <h3 className="mb-3 text-sm font-semibold uppercase">{t('footer.publisher')}</h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <a href={publisher.homepage} className={LINK}>
                    {publisher.name}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contactPoint.email}`} className={LINK}>
                    {contactPoint.email}
                  </a>
                </li>
              </ul>
            </nav>
          </section>
        </div>
      </div>
      <div className="bg-[var(--it-color-blue-20)]">
        <div className={`${CONTAINER} py-4 text-xs`}>
          {t('footer.poweredBy')}{' '}
          <a href="https://portaljs.com" className={LINK}>
            PortalJS
          </a>
        </div>
      </div>
    </footer>
  )
}
