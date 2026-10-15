import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'

/** The holder's certificate, the confirmation and where to save the receipt. */
export type RegFilingContext = {
  readonly identity: CertificateIdentity
  readonly confirmed: boolean
  readonly outDir: string | undefined
}
