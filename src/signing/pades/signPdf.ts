import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { signatureRequestOf } from './mappers/signatureRequestOf'
import { readPdfDocument } from './parsers/readPdfDocument'
import { selectCommonName } from './selectors/selectCommonName'
import type { SignPdfOptions } from './types/SignPdfOptions'
import { planSignatureObjects } from './update/planSignatureObjects'
import { validateSignablePdf } from './validators/validateSignablePdf'
import { appendUpdate } from './writers/appendUpdate'
import { patchSignature } from './writers/patchSignature'

/**
 * Sign a PDF with the holder's certificate as PAdES-B-B (ETSI.CAdES.detached,
 * or adbe.pkcs7.detached on request) by incremental update: the original
 * bytes are kept untouched in front.
 */
export const signPdf = (
  identity: CertificateIdentity,
  pdf: Buffer,
  options: SignPdfOptions = {},
): Buffer => {
  const doc = readPdfDocument(pdf)
  validateSignablePdf(doc)
  const objects = planSignatureObjects(
    doc,
    signatureRequestOf(selectCommonName(identity), options),
  )
  return patchSignature(appendUpdate(doc, objects), identity, pdf.length, {
    digest: options.digest ?? 'sha256',
    policy: options.policy,
  })
}
