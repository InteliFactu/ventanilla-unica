import type { FormPair } from '../../../http/types/FormPair'
import { mapHexText } from '../mappers/mapHexText'
import type { RelecDocument } from '../types/RelecDocument'

/**
 * The hidden inputs of one document row `<slot>_<person>`, as the uploader
 * leaves them: signed (`firma=true`), the hex upload name in `file`, the type
 * repeated after the dates. The trailing empty row the form always keeps has
 * no document, an empty `reusable` and the first type.
 */
export const buildSlotPairs = (
  slot: number,
  person: string,
  document: RelecDocument | undefined,
  defaultType: string,
): readonly FormPair[] => {
  const key = `${String(slot)}_${person}`
  return [
    [`${key}firma`, 'true'],
    [`${key}required`, 'undefined'],
    [`${key}DocReq`, String(slot)],
    [
      `${key}file`,
      document === undefined ? '' : mapHexText(document.uploadName),
    ],
    [`${key}dboid`, ''],
    [`${key}reusable`, document === undefined ? '' : 'false'],
    [`${key}name`, ''],
    [`${key}FechaIni`, ''],
    [`${key}FechaFin`, ''],
    [`${key}tipo`, document?.typeDboid ?? defaultType],
  ]
}
