import type { AddressUpdate } from '../types/AddressUpdate'
import type { ImportassAddress } from '../types/ImportassAddress'

/** True when the domicile Importass holds already equals the requested Spanish one, field by field. */
export const isSameAddress = (
  current: ImportassAddress,
  update: AddressUpdate,
): boolean =>
  current.pais === '724' &&
  (Object.keys(update) as (keyof AddressUpdate)[]).every(
    (key) => current[key] === update[key],
  )
