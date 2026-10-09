import type { FormPair } from '../../../http/types/FormPair'
import type { RelecAddress } from '../types/RelecAddress'
import { addressFieldNames } from './addressFieldNames'

/**
 * One address block of the form: the select (`direcciones<prefix>`) then
 * every address input. The represented entity's block goes as `new` and
 * empty, with the street type select on its first option, as the browser
 * sent it; the holder's carries the selected address.
 */
export const buildAddressPairs = (
  prefix: string,
  address: RelecAddress,
): readonly FormPair[] => [
  [`direcciones${prefix}`, address.id],
  ...addressFieldNames.map((name): FormPair => [
    `${prefix}${name}`,
    address.fields[name] ?? '',
  ]),
]
