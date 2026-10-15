import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'
import { buildSignedData } from '../cms/buildSignedData'
import { digestByteRanges } from './mappers/digestByteRanges'
import { preparePdfSignature } from './mappers/preparePdfSignature'
import type { SignPdfOptions } from './types/SignPdfOptions'
import { writeSignatureContents } from './writers/writeSignatureContents'

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
  const prepared = preparePdfSignature(identity, pdf, options)
  const digest = options.digest ?? 'sha256'
  const cms = buildSignedData(identity, digestByteRanges(prepared, digest), {
    digest,
    policy: options.policy,
  })
  return writeSignatureContents(prepared, cms)
}
