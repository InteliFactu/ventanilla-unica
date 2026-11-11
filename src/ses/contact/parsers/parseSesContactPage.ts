import { readElementTextById } from '../../../html/parsers/readElementTextById'
import type { SesContact } from '../types/SesContact'

/**
 * Read the "Datos de contacto" tab of "Mis datos": spans
 * `formDatosPersonales:tabViewDatos:{correo,mvl,tlf1,tlf2}`. A page without the
 * e-mail span is not "Mis datos" (the login did not take), so it is refused
 * rather than read as empty. The address spans of the same tab are left out.
 */
export const parseSesContactPage = (html: string): SesContact => {
  const prefix = 'formDatosPersonales:tabViewDatos:'
  if (!html.includes(`id="${prefix}correo"`))
    throw new Error('Centro de Salud Online: the page carries no contact data')
  const span = (id: string): string | null =>
    readElementTextById(html, `${prefix}${id}`)
  return {
    email: span('correo'),
    careContactPhone: span('mvl'),
    phone1: span('tlf1'),
    phone2: span('tlf2'),
  }
}
