import { indirectObject } from '../objects/indirectObject'
import { pdfRefTo } from '../objects/pdfRefTo'
import { selectPage } from '../selectors/selectPage'
import type { FieldPlan } from '../types/FieldPlan'
import type { PlanContext } from '../types/PlanContext'
import { allocateObject } from './allocateObject'
import { buildStampObjects } from './buildStampObjects'
import { buildWidget } from './buildWidget'
import { extendAnnots } from './extendAnnots'
import { withSignatureField } from './withSignatureField'

/** A new signature field and widget on the requested page, with its stamp when visible. */
export const planNewField = (context: PlanContext): FieldPlan => {
  const { doc, allocator, request } = context
  const page = selectPage(doc, context.catalog, request.page)
  const widget = allocateObject(allocator)
  const stamp =
    request.stampLines === undefined
      ? undefined
      : buildStampObjects(allocator, request.stampLines, request.rect)
  const widgetDict = buildWidget({
    signature: context.signature,
    page: page.ref,
    fieldName: `Signature${String(widget)}`,
    stamp,
  })
  const annots = extendAnnots(doc, page.dict, pdfRefTo(widget))
  return {
    objects: [
      indirectObject(widget, 0, widgetDict),
      ...(stamp?.objects ?? []),
      ...annots.objects,
      ...(annots.dict
        ? [indirectObject(page.ref.num, page.ref.gen, annots.dict)]
        : []),
    ],
    editForm: (form) => withSignatureField(doc, form, pdfRefTo(widget)),
  }
}
