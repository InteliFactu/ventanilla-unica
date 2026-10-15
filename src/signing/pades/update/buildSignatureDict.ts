import { byteRangePlaceholder } from '../byteRangePlaceholder'
import { pdfDate } from '../objects/pdfDate'
import { pdfDict } from '../objects/pdfDict'
import { pdfRaw } from '../objects/pdfRaw'
import { pdfTextString } from '../objects/pdfTextString'
import { signatureContentsBytes } from '../signatureContentsBytes'
import type { PdfDict } from '../types/PdfDict'
import type { PdfValue } from '../types/PdfValue'
import type { SignatureDetails } from '../types/SignatureDetails'

/** The /Sig dictionary with the /ByteRange and /Contents placeholders (ByteRange first). */
export const buildSignatureDict = (details: SignatureDetails): PdfDict => {
  const optional: (readonly [string, PdfValue])[] = []
  if (details.reason)
    optional.push(['Reason', pdfRaw(pdfTextString(details.reason))])
  if (details.location)
    optional.push(['Location', pdfRaw(pdfTextString(details.location))])
  if (details.contactInfo)
    optional.push(['ContactInfo', pdfRaw(pdfTextString(details.contactInfo))])
  return pdfDict([
    ['Type', pdfRaw('/Sig')],
    ['Filter', pdfRaw('/Adobe.PPKLite')],
    ['SubFilter', pdfRaw(`/${details.subFilter ?? 'ETSI.CAdES.detached'}`)],
    ['ByteRange', pdfRaw(byteRangePlaceholder)],
    ['Contents', pdfRaw(`<${'0'.repeat(signatureContentsBytes * 2)}>`)],
    ['M', pdfRaw(pdfTextString(pdfDate(details.date)))],
    ['Name', pdfRaw(pdfTextString(details.commonName))],
    ...optional,
  ])
}
