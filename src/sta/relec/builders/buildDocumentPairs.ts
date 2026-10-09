import type { FormPair } from '../../../http/types/FormPair'
import type { RelecDocument } from '../types/RelecDocument'
import { buildSlotPairs } from './buildSlotPairs'

/**
 * Every document row: first the visible type select and description of each
 * row (the trailing empty one included), then each row's hidden inputs, the
 * order in which the browser posted them.
 */
export const buildDocumentPairs = (
  documents: readonly RelecDocument[],
  person: string,
  defaultType: string,
): readonly FormPair[] => {
  const rows = [...documents, undefined]
  return [
    ...rows.flatMap((document, slot): FormPair[] => [
      [`${String(slot)}_${person}tipo`, document?.typeDboid ?? defaultType],
      [`${String(slot)}_${person}description`, document?.description ?? ''],
    ]),
    ...rows.flatMap((document, slot) =>
      buildSlotPairs(slot, person, document, defaultType),
    ),
  ]
}
