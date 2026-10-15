import { indirectObject } from '../objects/indirectObject'
import { pdfDict } from '../objects/pdfDict'
import { pdfDictGet } from '../objects/pdfDictGet'
import { pdfDictWith } from '../objects/pdfDictWith'
import { resolvePdfValue } from '../objects/resolvePdfValue'
import { selectFieldRect } from '../selectors/selectFieldRect'
import { selectSignatureField } from '../selectors/selectSignatureField'
import type { FieldPlan } from '../types/FieldPlan'
import type { PlanContext } from '../types/PlanContext'
import { buildStampObjects } from './buildStampObjects'
import { withSigFlags } from './withSigFlags'

/**
 * Fill the existing empty signature field the request names: its /V points
 * at the signature and, when visible, its appearance is the stamp drawn in the
 * field's own rectangle.
 */
export const planExistingField = (
  context: PlanContext,
  name: string,
): FieldPlan => {
  const { doc, request } = context
  const form = resolvePdfValue(doc, pdfDictGet(context.catalog, 'AcroForm'))
  const field = selectSignatureField(
    doc,
    form?.kind === 'dict' ? form : undefined,
    name,
  )
  const rect = selectFieldRect(doc, field.dict)
  const stamp =
    request.stampLines === undefined || rect === undefined
      ? undefined
      : buildStampObjects(context.allocator, request.stampLines, rect)
  const signed = pdfDictWith(field.dict, 'V', context.signature)
  const updated = stamp
    ? pdfDictWith(signed, 'AP', pdfDict([['N', stamp.appearance]]))
    : signed
  return {
    objects: [
      indirectObject(field.ref.num, field.ref.gen, updated),
      ...(stamp?.objects ?? []),
    ],
    editForm: withSigFlags,
  }
}
