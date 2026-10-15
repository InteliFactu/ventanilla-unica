import { parseStaSections } from '../../parsers/parseStaSections'
import type { StaContactData } from '../types/StaContactData'
import { parseStaOtherAddresses } from './parseStaOtherAddresses'

/**
 * The datos personales page (`PAGE_CODE=DATOS_PERSONALES`): "Mis Medios de
 * Contacto", whether the sede shows them as confirmed, and "Mis Datos
 * Identificativos" when it shows them (the Junta's sede hides them until the
 * contact ways are confirmed).
 */
export const parseStaContactData = (
  html: string,
  host: string,
): StaContactData => {
  const sections = parseStaSections(html)
  const contact = sections['Mis Medios de Contacto']
  if (contact === undefined)
    throw new Error(`${host}: the datos personales page shows no contact data`)
  const identity = sections['Mis Datos Identificativos'] ?? {}
  return {
    host,
    phone: contact['Teléfono'] || undefined,
    email: contact['Correo electrónico'] || undefined,
    confirmed: html.includes('Los medios de contacto han sido confirmados'),
    name: identity['Nombre Completo'],
    nif: identity['DNI/NIE/NIF']?.split(' ')[0],
    address: identity['Dirección'],
    otherAddresses: parseStaOtherAddresses(html),
  }
}
