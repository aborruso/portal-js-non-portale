import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeHeader, ThemeFooter } from '../components/themes'

export default function App({ Component, pageProps }: AppProps) {
  // Navbar renders on every page (home, search, and each dataset showcase).
  return (
    <>
      <ThemeHeader />
      <Component {...pageProps} />
      <ThemeFooter />
    </>
  )
}
