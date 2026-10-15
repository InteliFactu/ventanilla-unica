import { pdfDictWith } from '../objects/pdfDictWith'
import { pdfRaw } from '../objects/pdfRaw'
import type { PdfDict } from '../types/PdfDict'

/** An AcroForm marked as holding signatures, appended to only (/SigFlags 3). */
export const withSigFlags = (form: PdfDict): PdfDict =>
  pdfDictWith(form, 'SigFlags', pdfRaw('3'))
