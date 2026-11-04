import { selectDocumentType } from '../selectors/selectDocumentType'
import type { RelecPreparation } from '../types/RelecPreparation'
import type { RelecUploadTarget } from '../types/RelecUploadTarget'

/** Contribution rows are sequential indices under the represented entity. */
export const mapRelecContributionTargets = (
  prepared: RelecPreparation,
): readonly RelecUploadTarget[] =>
  prepared.plan.documents.map((document, slot) => ({
    origin: prepared.origin,
    slot,
    person: prepared.plan.represented.dboid,
    document,
    type: selectDocumentType(prepared.types, document.typeCode),
  }))
