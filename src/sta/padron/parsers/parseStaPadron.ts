import { extractStaDatasets } from '../../parsers/extractStaDatasets'
import { parseStaSections } from '../../parsers/parseStaSections'
import { mapStaCohabitant } from '../mappers/mapStaCohabitant'
import type { StaPadron } from '../types/StaPadron'

/**
 * The padrón page (`PAGE_CODE=DATOS_HABITANTE`): the holder's identification,
 * birth, education and census sections and the people registered at the same
 * address. "No se encuentra empadronado/a" is an answer, not an error; the
 * sede's own search error is.
 */
export const parseStaPadron = (html: string, host: string): StaPadron => {
  if (html.includes('Se ha producido un error al buscar los datos del padr'))
    throw new Error(`${host}: the sede could not search its padrón`)
  if (/No se encuentra empadronad/.test(html))
    return { host, registered: false, cohabitants: [] }
  const sections = parseStaSections(html)
  const person = sections['Identificación del ciudadano']
  if (person === undefined)
    throw new Error(`${host}: the padrón page shows no padrón data`)
  const birth = sections['Lugar de nacimiento'] ?? {}
  const census = sections['Datos censo electoral'] ?? {}
  return {
    host,
    registered: true,
    name: person['Nombre']?.replaceAll(/\s+/g, ' '),
    document: person['Documento'],
    since: person['Fecha alta padrón'],
    address: person['Dirección']?.replaceAll(/\s+/g, ' '),
    nationality: person['Nacionalidad'],
    birthDate: birth['Fecha de nacimiento'],
    birthPlace: birth['Nacimiento'],
    education: sections['Datos académicos']?.['Nivel de instrucción'],
    district: census['Distrito'],
    section: census['Sección'],
    cohabitants: (
      extractStaDatasets(html)['habitantes_DATOS_HABITANTE'] ?? []
    ).map(mapStaCohabitant),
  }
}
