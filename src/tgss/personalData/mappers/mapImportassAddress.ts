import type { HtmlForm } from '../../../html/types/HtmlForm'
import { readAddressLines } from '../parsers/readAddressLines'
import { readSelectDataValue } from '../parsers/readSelectDataValue'
import type { ImportassAddress } from '../types/ImportassAddress'

/** The domicile from the "Modificar domicilio" form fields, its two selects and the card lines. */
export const mapImportassAddress = (
  html: string,
  form: HtmlForm,
): ImportassAddress => {
  const field = (name: string): string => form.fields[name] ?? ''
  return {
    lines: readAddressLines(html),
    pais: readSelectDataValue(html, 'pais'),
    tipoVia: readSelectDataValue(html, 'tipoVia'),
    nombreVia: field('nombreVia'),
    numero: field('numero'),
    bis: field('bis'),
    bloque: field('bloque'),
    escalera: field('escalera'),
    piso: field('piso'),
    puerta: field('puerta'),
    codigoPostal: field('codigoPostal'),
    localidad: field('localidad'),
  }
}
