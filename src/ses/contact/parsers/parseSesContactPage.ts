import { hasElementWithId } from '../../../html/parsers/hasElementWithId'
import { readElementTextById } from '../../../html/parsers/readElementTextById'
import { sesContactSpanIds } from '../constants/sesContactSpanIds'
import type { SesContact } from '../types/SesContact'

/**
 * Read the "Datos de contacto" tab of "Mis datos": spans
 * `formDatosPersonales:tabViewDatos:{correo,mvl,tlf1,tlf2}`. A page missing any
 * of those spans outside comments is not "Mis datos" (the login did not take),
 * so it is refused; a span present but empty reads as null. The address spans
 * of the same tab are left out.
 */
export const parseSesContactPage = (html: string): SesContact => {
  const page = html.replaceAll(/<!--[\s\S]*?-->/g, '')
  if (
    !Object.values(sesContactSpanIds).every((id) =>
      hasElementWithId(page, 'span', id),
    )
  )
    throw new Error('Centro de Salud Online: the page carries no contact data')
  return {
    email: readElementTextById(page, sesContactSpanIds.email),
    careContactPhone: readElementTextById(
      page,
      sesContactSpanIds.careContactPhone,
    ),
    phone1: readElementTextById(page, sesContactSpanIds.phone1),
    phone2: readElementTextById(page, sesContactSpanIds.phone2),
  }
}
