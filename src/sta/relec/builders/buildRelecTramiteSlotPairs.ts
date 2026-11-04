import type { FormPair } from '../../../http/types/FormPair'
import { mapHexText } from '../mappers/mapHexText'
import type { RelecUploadTarget } from '../types/RelecUploadTarget'

/** Apply the signed-upload callback to each holder row; retain its DocReq/pid/CUD metadata. */
export const buildRelecTramiteSlotPairs = (
  targets: readonly RelecUploadTarget[],
): readonly FormPair[] =>
  targets.flatMap((target): FormPair[] => [
    [
      `${String(target.slot)}_${target.person}file`,
      mapHexText(target.document.uploadName),
    ],
    [`${String(target.slot)}_${target.person}firma`, 'true'],
  ])
