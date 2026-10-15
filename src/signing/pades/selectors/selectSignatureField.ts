import { pdfDictGet } from '../objects/pdfDictGet'
import type { PdfDict } from '../types/PdfDict'
import type { PdfDocument } from '../types/PdfDocument'
import type { PdfPage } from '../types/PdfPage'
import { selectFieldByName } from './selectFieldByName'

/** The top-level signature field named `name`, merged with its widget, and still unsigned. */
export const selectSignatureField = (
  doc: PdfDocument,
  form: PdfDict | undefined,
  name: string,
): PdfPage => {
  const field = selectFieldByName(doc, form, name)
  if (field === undefined) throw new Error(`no signature field named ${name}`)
  const type = pdfDictGet(field.dict, 'FT')
  if (type?.kind !== 'raw' || type.text !== '/Sig')
    throw new Error(`field ${name} is not a signature field`)
  if (pdfDictGet(field.dict, 'V') !== undefined)
    throw new Error(`field ${name} is already signed`)
  return field
}
