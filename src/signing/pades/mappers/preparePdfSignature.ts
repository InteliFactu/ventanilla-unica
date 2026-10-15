import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'
import { selectCommonName } from '../selectors/selectCommonName'
import type { PreparedPdfSignature } from '../types/PreparedPdfSignature'
import type { SignPdfOptions } from '../types/SignPdfOptions'
import { preparePdfUpdate } from './preparePdfUpdate'
import { signatureRequestOf } from './signatureRequestOf'

/** Append the signature's incremental update to `pdf` and place its byte range, ready for the CMS. */
export const preparePdfSignature = (
  identity: CertificateIdentity,
  pdf: Buffer,
  options: SignPdfOptions,
): PreparedPdfSignature =>
  preparePdfUpdate(pdf, signatureRequestOf(selectCommonName(identity), options))
