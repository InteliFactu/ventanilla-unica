import type { RelecAddress } from '../types/RelecAddress'
import { readAddressFields } from './readAddressFields'
import { readSelectedAddressId } from './readSelectedAddressId'

/**
 * The postal address the form selects for the interested party, with the
 * values `changeDireccion()` writes for it in its
 * `if(codigoDireccion=='<id>')` block. Without one the form submits `new`
 * and empty fields.
 */
export const parseHolderAddress = (html: string): RelecAddress => {
  const id = readSelectedAddressId(html)
  const start = id === undefined ? -1 : html.indexOf(`codigoDireccion=='${id}'`)
  if (id === undefined || start === -1) return { id: 'new', fields: {} }
  const next = html.indexOf('codigoDireccion==', start + 1)
  return {
    id,
    fields: readAddressFields(
      html.slice(start, next === -1 ? undefined : next),
    ),
  }
}
