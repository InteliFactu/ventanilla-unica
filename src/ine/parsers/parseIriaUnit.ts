import { htmlToText } from '../../html/htmlToText'
import type { IriaUnit } from '../types/IriaUnit'

/** The "Datos de la Unidad Seleccionada" header: company name and NIF. */
export const parseIriaUnit = (html: string): IriaUnit | undefined => {
  const text = htmlToText(html)
  const match = /Razón social: ?([^\n]+?) ?NIF: ?([0-9A-Z]+)/.exec(text)
  if (!match) return undefined
  return { razonSocial: (match[1] ?? '').trim(), nif: match[2] ?? '' }
}
