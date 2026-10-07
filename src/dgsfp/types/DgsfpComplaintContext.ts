import type { CertificateIdentity } from '../../certificate/types/CertificateIdentity'

/** The identity, confirmation and output directory a complaint is filed with. */
export type DgsfpComplaintContext = {
  readonly identity: CertificateIdentity
  readonly confirmed: boolean
  readonly outDir?: string | undefined
}
