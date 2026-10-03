import type { CensalCertificateRequest } from './CensalCertificateRequest'

/** A certificate an EMCE-JDIT servlet emitted: the CSV of its receipt, the PDF it resolves to, and who signed the request. */
export type EmceCertificate = {
  readonly csv: string
  readonly pdf: Buffer
  readonly signedBy: CensalCertificateRequest
}
