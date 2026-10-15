import { pdfDictGet } from '../objects/pdfDictGet'
import { pdfTextString } from '../objects/pdfTextString'
import type { PdfDict } from '../types/PdfDict'
import type { PdfDocument } from '../types/PdfDocument'
import type { PdfPage } from '../types/PdfPage'
import { selectFormFields } from './selectFormFields'

/** The top-level AcroForm field whose /T is `name`. */
export const selectFieldByName = (
  doc: PdfDocument,
  form: PdfDict | undefined,
  name: string,
): PdfPage | undefined => {
  const wanted = pdfTextString(name)
  return selectFormFields(doc, form).find((field) => {
    const title = pdfDictGet(field.dict, 'T')
    return title?.kind === 'raw' && title.text === wanted
  })
}
