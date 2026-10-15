import { indirectObject } from '../objects/indirectObject'
import { pdfDictGet } from '../objects/pdfDictGet'
import { pdfRawNumber } from '../objects/pdfRawNumber'
import { pdfRefTo } from '../objects/pdfRefTo'
import { selectCatalog } from '../selectors/selectCatalog'
import type { ObjectAllocator } from '../types/ObjectAllocator'
import type { PdfDocument } from '../types/PdfDocument'
import type { PdfUpdateObject } from '../types/PdfUpdateObject'
import type { SignatureRequest } from '../types/SignatureRequest'
import { allocateObject } from './allocateObject'
import { buildSignatureDict } from './buildSignatureDict'
import { extendAcroForm } from './extendAcroForm'
import { planExistingField } from './planExistingField'
import { planNewField } from './planNewField'

/** Every object the incremental update writes, the signature dictionary first. */
export const planSignatureObjects = (
  doc: PdfDocument,
  request: SignatureRequest,
): PdfUpdateObject[] => {
  const allocator: ObjectAllocator = {
    next: pdfRawNumber(pdfDictGet(doc.trailer, 'Size')) ?? 0,
  }
  const catalog = selectCatalog(doc)
  const signature = allocateObject(allocator)
  const context = {
    doc,
    catalog: catalog.dict,
    allocator,
    signature: pdfRefTo(signature),
    request,
  }
  const field =
    request.field === undefined
      ? planNewField(context)
      : planExistingField(context, request.field)
  const form = extendAcroForm(doc, catalog.dict, field.editForm, allocator)
  return [
    indirectObject(signature, 0, buildSignatureDict(request)),
    ...field.objects,
    ...form.objects,
    ...(form.dict
      ? [indirectObject(catalog.ref.num, catalog.ref.gen, form.dict)]
      : []),
  ]
}
