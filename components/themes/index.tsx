import Navbar from '../Navbar'
import ItaliaHeader from './italia/Header'
import ItaliaFooter from './italia/Footer'
import { THEME } from '../../lib/theme'

// Header and footer of the active theme (lib/theme.ts). The «editoriale» theme keeps
// the template's Navbar and has no footer.
export function ThemeHeader() {
  return THEME === 'italia' ? <ItaliaHeader /> : <Navbar />
}

export function ThemeFooter() {
  return THEME === 'italia' ? <ItaliaFooter /> : null
}
