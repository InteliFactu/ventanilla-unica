import { indirectObject } from '../objects/indirectObject'
import { pdfDict } from '../objects/pdfDict'
import { pdfDictGet } from '../objects/pdfDictGet'
import { pdfDictWith } from '../objects/pdfDictWith'
import { pdfRefTo } from '../objects/pdfRefTo'
import { readPdfObject } from '../parsers/readPdfObject'
import type { DictChange } from '../types/DictChange'
import type { ObjectAllocator } from '../types/ObjectAllocator'
import type { PdfDict } from '../types/PdfDict'
import type { PdfDocument } from '../types/PdfDocument'
import { allocateObject } from './allocateObject'

/** Apply `edit` to the catalog's AcroForm, which may be absent, inline or indirect. */
export const extendAcroForm = (
  doc: PdfDocument,
  catalog: PdfDict,
  edit: (form: PdfDict) => PdfDict,
  allocator: ObjectAllocator,
): DictChange => {
  const current = pdfDictGet(catalog, 'AcroForm')
  if (current?.kind === 'ref') {
    const form = readPdfObject(doc, current.num)
    if (form.kind !== 'dict') throw new Error('AcroForm is not a dictionary')
    const updated = edit(form)
    return {
      dict: undefined,
      objects: [indirectObject(current.num, current.gen, updated)],
    }
  }
  const updated = edit(current?.kind === 'dict' ? current : pdfDict([]))
  if (current?.kind === 'dict')
    return { dict: pdfDictWith(catalog, 'AcroForm', updated), objects: [] }
  const num = allocateObject(allocator)
  return {
    dict: pdfDictWith(catalog, 'AcroForm', pdfRefTo(num)),
    objects: [indirectObject(num, 0, updated)],
  }
}
