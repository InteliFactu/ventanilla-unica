import { hasElementWithId } from '../../../html/parsers/hasElementWithId'
import { readInputValueById } from '../../../html/parsers/readInputValueById'
import type { InssContact } from '../types/InssContact'

/**
 * Read the "CONTACTO" block of Tu Seguridad Social's "Tus datos": inputs
 * `prefijo`, `movil` and `email`, filled with what the INSS holds. A page
 * missing any of those inputs outside comments is not "Tus datos" (an expired
 * session lands on the public home), so it is refused; an input present but
 * empty reads as null.
 */
export const parseInssContactPage = (html: string): InssContact => {
  const page = html.replaceAll(/<!--[\s\S]*?-->/g, '')
  if (
    !['prefijo', 'movil', 'email'].every((id) =>
      hasElementWithId(page, 'input', id),
    )
  )
    throw new Error('Tu Seguridad Social: the page carries no contact block')
  return {
    mobilePrefix: readInputValueById(page, 'prefijo'),
    mobile: readInputValueById(page, 'movil'),
    email: readInputValueById(page, 'email'),
  }
}
