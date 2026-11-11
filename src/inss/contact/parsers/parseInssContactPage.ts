import { readInputValueById } from '../../../html/parsers/readInputValueById'
import type { InssContact } from '../types/InssContact'

/**
 * Read the "CONTACTO" block of Tu Seguridad Social's "Tus datos": inputs
 * `prefijo`, `movil` and `email`, filled with what the INSS holds. A page
 * without the `movil` input is not "Tus datos" (an expired session lands on
 * the public home), so it is refused rather than read as empty.
 */
export const parseInssContactPage = (html: string): InssContact => {
  if (!html.includes('id="movil"'))
    throw new Error('Tu Seguridad Social: the page carries no contact block')
  return {
    mobilePrefix: readInputValueById(html, 'prefijo'),
    mobile: readInputValueById(html, 'movil'),
    email: readInputValueById(html, 'email'),
  }
}
