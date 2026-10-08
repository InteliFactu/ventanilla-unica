import type { CertificateIdentity } from '../../../certificate/types/CertificateIdentity'

/** The holder signing the request, and whether they confirmed the act. */
export type ContactEmailContext = {
  readonly identity: CertificateIdentity
  readonly confirmed: boolean
}
